#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data', 'resources');
const OUTPUT_FILE = path.join(DATA_DIR, 'validLinks.json');

const EXCLUDED_TERMS = [
  'find-a-doctor',
  'provider-directory',
  'findcare',
  'doctorfinder',
  'directory',
  'locator',
  'find-provider',
];

const SOFT_404_TERMS = [
  '404',
  "page can't be found",
  'page not found',
  'not available',
  'we can’t find',
  'we cant find',
  'doesn’t exist',
  'doesnt exist',
  'file not found',
];

// Several hosts serve a challenge stub or 403 to default agent strings.
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const REQUEST_TIMEOUT_MS = 7000;
const REQUEST_DELAY_MS = 200;
const MAX_CONCURRENT_PER_DOMAIN = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDomain = (url) => {
  try {
    return new URL(url).hostname || '';
  } catch {
    return '';
  }
};

const shouldSkipLink = (url) => {
  const lower = url.toLowerCase();
  return EXCLUDED_TERMS.some((term) => lower.includes(term));
};

const toRouteSlug = (value) => {
  if (!value) {
    return value;
  }
  if (value.includes('-')) {
    return value.toLowerCase();
  }
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

// Only the title and first heading are checked. Scanning the whole body matched "404" inside
// analytics IDs and SVG path data, silently deleting healthy links.
const isSoft404 = (html) => {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '';
  const lower = `${title} ${heading}`.replace(/<[^>]+>/g, ' ').toLowerCase();
  return SOFT_404_TERMS.some((term) => lower.includes(term));
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...BROWSER_HEADERS, ...(options.headers ?? {}) },
      signal: controller.signal,
      redirect: 'follow',
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

const validateUrl = async (url) => {
  try {
    // GET only. A HEAD preflight added nothing but latency, and hosts that reject the method
    // outright were being recorded as dead links.
    const getResponse = await fetchWithTimeout(url, { method: 'GET' });
    if (getResponse.status < 200 || getResponse.status >= 300) {
      return { ok: false, reason: `Status ${getResponse.status}` };
    }

    const contentType = getResponse.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      return { ok: true };
    }

    const body = await getResponse.text();
    if (isSoft404(body)) {
      return { ok: false, reason: 'Soft 404 detected' };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'Unknown error' };
  }
};

const domainQueues = new Map();

const enqueueValidation = async (url, task) => {
  const domain = getDomain(url);
  if (!domain) {
    return task();
  }

  if (!domainQueues.has(domain)) {
    domainQueues.set(domain, []);
  }

  const queue = domainQueues.get(domain);

  const runTask = async () => {
    try {
      if ((runTask.active ?? 0) >= MAX_CONCURRENT_PER_DOMAIN) {
        await new Promise((resolve) => queue.push(resolve));
      }
      runTask.active = (runTask.active ?? 0) + 1;
      const result = await task();
      await sleep(REQUEST_DELAY_MS);
      return result;
    } finally {
      runTask.active = (runTask.active ?? 0) - 1;
      const next = queue.shift();
      if (next) {
        next();
      }
    }
  };

  return runTask();
};

const main = async () => {
  console.log('Validating resource links...');
  const pattern = path.posix.join(DATA_DIR.replace(/\\/g, '/'), '**/*.json');
  const files = glob.sync(pattern, { nodir: true }).map((filePath) => path.normalize(filePath));
  console.log(`Found ${files.length} resource files to validate.`);

  const results = {};
  let skippedCount = 0;
  let validCount = 0;
  let invalidCount = 0;

  for (const file of files) {
    if (file.endsWith('validLinks.json')) {
      continue;
    }

    const relativePath = path.relative(DATA_DIR, file).replace(/\\/g, '/');
    const [category, filename] = relativePath.split('/');
    const slug = filename.replace('.json', '');
    const key = `${category}/${toRouteSlug(slug)}`;

    try {
      const raw = await fs.readFile(file, 'utf-8');
      const data = JSON.parse(raw);

      const links = Array.isArray(data.links) ? data.links : [];
      if (!links.length) {
        continue;
      }

      const filteredLinks = [];
      const cache = {};

      for (const link of links) {
        if (!link?.url) {
          invalidCount += 1;
          continue;
        }

        if (shouldSkipLink(link.url)) {
          skippedCount += 1;
          continue;
        }

        const task = async () => {
          if (cache[link.url] !== undefined) {
            return cache[link.url];
          }
          const outcome = await validateUrl(link.url);
          cache[link.url] = outcome;
          return outcome;
        };

        const outcome = await enqueueValidation(link.url, task);
        if (outcome.ok) {
          validCount += 1;
          filteredLinks.push({ label: link.label, url: link.url, description: link.description });
        } else {
          invalidCount += 1;
        }
      }

      if (filteredLinks.length) {
        results[key] = filteredLinks;
      }
    } catch (error) {
      console.error(`Failed processing ${relativePath}:`, error instanceof Error ? error.message : error);
    }
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Validation complete. Valid: ${validCount}, Invalid: ${invalidCount}, Skipped: ${skippedCount}`);
  console.log(`Output written to ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
