const fs = require('fs');
const path = require('path');

const INPUT_CSV = path.join(__dirname, 'providers_missing_email.csv');
const OUTPUT_CSV = path.join(__dirname, 'scraped_emails.csv');
const PROGRESS_FILE = path.join(__dirname, 'scrape_progress.json');
const TIMEOUT_MS = 10000;
const CONCURRENCY = 10;

// Domains to skip
const SKIP_DOMAINS = [
  'facebook.com', 'fb.com', 'canva.com', 'godaddy.com',
  'instagram.com', 'linkedin.com', 'youtube.com', 'twitter.com',
  'wixsite.com', 'sites.google.com'
];

// Known chain domains — scrape once, apply to all
const CHAIN_DOMAINS = [
  'teampbs.com', 'lifestance.com', 'abacentersfl.com',
  'hopebridge.com', 'thriveworks.com'
];

function parseCsv(text) {
  const lines = text.split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Simple CSV parse handling quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    if (fields.length >= 5) {
      rows.push({ id: fields[0], name: fields[1], city: fields[2], county: fields[3], website: fields[4] });
    }
  }
  return rows;
}

function normalizeUrl(website) {
  let url = website.trim();
  if (!url) return null;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function shouldSkip(domain) {
  if (!domain) return true;
  return SKIP_DOMAINS.some(sd => domain === sd || domain.endsWith('.' + sd));
}

function isChainDomain(domain) {
  return CHAIN_DOMAINS.some(cd => domain === cd || domain.endsWith('.' + cd));
}

// Email regex - find emails on page, filter out image/asset emails
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const IGNORE_EMAIL_PATTERNS = [
  /\.png$/i, /\.jpg$/i, /\.jpeg$/i, /\.gif$/i, /\.svg$/i, /\.webp$/i,
  /\.css$/i, /\.js$/i, /\.woff$/i, /\.ttf$/i,
  /sentry\.io/i, /webpack/i, /example\.com/i, /test\.com/i,
  /email\.com$/i, /domain\.com$/i, /company\.com$/i, /yourcompany/i,
  /wixpress\.com/i, /googleapis\.com/i, /cloudflare/i,
  /@2x/i, /@3x/i
];

function extractEmails(html) {
  // Also decode HTML entities and mailto links
  const decoded = html
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.');

  const matches = decoded.match(EMAIL_RE);
  if (!matches) return [];

  const unique = [...new Set(matches.map(e => e.toLowerCase()))];
  return unique.filter(email => {
    if (IGNORE_EMAIL_PATTERNS.some(p => p.test(email))) return false;
    // Must have a reasonable TLD
    const parts = email.split('.');
    const tld = parts[parts.length - 1];
    if (tld.length < 2 || tld.length > 10) return false;
    return true;
  });
}

// Prioritize contact-like emails
function pickBestEmail(emails, domain) {
  if (emails.length === 0) return null;
  if (emails.length === 1) return emails[0];

  // Prefer emails matching the website domain
  const domainEmails = emails.filter(e => {
    const emailDomain = e.split('@')[1];
    return emailDomain === domain || domain.endsWith('.' + emailDomain) || emailDomain.endsWith('.' + domain);
  });

  const pool = domainEmails.length > 0 ? domainEmails : emails;

  // Prioritize contact/info type addresses
  const priority = ['contact', 'info', 'hello', 'admin', 'office', 'support', 'help', 'intake', 'referral'];
  for (const prefix of priority) {
    const match = pool.find(e => e.startsWith(prefix + '@'));
    if (match) return match;
  }

  return pool[0];
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('text/html') && !ct.includes('text/plain') && !ct.includes('application/xhtml')) return null;
    return await resp.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function findEmailForUrl(baseUrl) {
  const domain = getDomain(baseUrl);

  // Try homepage
  let html = await fetchPage(baseUrl);
  if (html) {
    const emails = extractEmails(html);
    const best = pickBestEmail(emails, domain);
    if (best) return best;
  }

  // Try /contact variations
  const contactPaths = ['/contact', '/contact-us', '/about/contact', '/about'];
  for (const p of contactPaths) {
    try {
      const u = new URL(p, baseUrl);
      html = await fetchPage(u.href);
      if (html) {
        const emails = extractEmails(html);
        const best = pickBestEmail(emails, domain);
        if (best) return best;
      }
    } catch {
      continue;
    }
  }

  return null;
}

// Simple concurrency limiter
async function asyncPool(limit, items, fn) {
  const results = [];
  const executing = new Set();
  for (const [i, item] of items.entries()) {
    const p = Promise.resolve().then(() => fn(item, i));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function main() {
  const csvText = fs.readFileSync(INPUT_CSV, 'utf-8');
  const rows = parseCsv(csvText);
  console.log(`Loaded ${rows.length} providers`);

  // Load progress if exists
  let progress = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      console.log(`Resuming from progress file (${Object.keys(progress).length} domains already scraped)`);
    } catch {}
  }

  // Group by domain
  const domainMap = new Map(); // domain -> { url, ids[] }
  const skipCount = { noUrl: 0, skippedDomain: 0 };

  for (const row of rows) {
    const url = normalizeUrl(row.website);
    if (!url) { skipCount.noUrl++; continue; }
    const domain = getDomain(url);
    if (!domain) { skipCount.noUrl++; continue; }
    if (shouldSkip(domain)) { skipCount.skippedDomain++; continue; }

    if (!domainMap.has(domain)) {
      domainMap.set(domain, { url, ids: [], isChain: isChainDomain(domain) });
    }
    domainMap.get(domain).ids.push(row.id);
  }

  console.log(`Unique domains to scrape: ${domainMap.size}`);
  console.log(`Skipped: ${skipCount.noUrl} no URL, ${skipCount.skippedDomain} blocked domains`);

  // Filter out already-scraped domains
  const domainsToScrape = [];
  for (const [domain, info] of domainMap.entries()) {
    if (domain in progress) continue;
    domainsToScrape.push([domain, info]);
  }
  console.log(`Domains remaining to scrape: ${domainsToScrape.length}`);

  let completed = 0;
  let found = 0;
  const total = domainsToScrape.length;

  const saveProgress = () => {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  };

  // Save progress every 50 domains
  let lastSave = 0;

  await asyncPool(CONCURRENCY, domainsToScrape, async ([domain, info]) => {
    const email = await findEmailForUrl(info.url);
    progress[domain] = email || null;
    completed++;

    if (email) {
      found++;
      console.log(`[${completed}/${total}] ✓ ${domain} → ${email} (${info.ids.length} providers)`);
    } else if (completed % 50 === 0) {
      console.log(`[${completed}/${total}] ... (${found} emails found so far)`);
    }

    if (completed - lastSave >= 50) {
      lastSave = completed;
      saveProgress();
    }
  });

  // Final save
  saveProgress();

  // Build output
  const output = ['id,email'];
  let totalRows = 0;
  for (const [domain, info] of domainMap.entries()) {
    const email = progress[domain];
    if (email) {
      for (const id of info.ids) {
        output.push(`${id},${email}`);
        totalRows++;
      }
    }
  }

  fs.writeFileSync(OUTPUT_CSV, output.join('\n') + '\n');
  console.log(`\nDone! Found emails for ${totalRows} providers across ${found + Object.values(progress).filter(v => v).length} domains`);
  console.log(`Output written to: ${OUTPUT_CSV}`);
}

main().catch(console.error);
