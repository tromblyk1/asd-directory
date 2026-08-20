// Generates the pSEO city-page manifest consumed by the app router and the sitemap.
// Source of truth: curation/pseo_page_manifest_2026-08-20_post_deletions.csv, minus excluded services.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CSV_IN = resolve(here, '../curation/pseo_page_manifest_2026-08-20_post_deletions.csv');
const JSON_OUT = resolve(here, '../src/frontend/src/data/pseo/cityPages.json');

// residential-program is 27/30 chain branches; virtual-therapy has no real street location.
const EXCLUDED_SERVICES = new Set(['residential-program', 'virtual-therapy']);

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const titleCase = (s) =>
  s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

const rows = readFileSync(CSV_IN, 'utf8').trim().split(/\r?\n/);
const header = rows[0].split(',');
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const entries = [];
for (const line of rows.slice(1)) {
  const f = line.split(',');
  const service = f[idx.service];
  if (EXCLUDED_SERVICES.has(service)) continue;
  const city = f[idx.canonical_city];
  entries.push({
    service,
    city,
    citySlug: slugify(city),
    cityName: titleCase(city),
    providers: Number(f[idx.providers]),
    band: f[idx.band],
  });
}

const seen = new Map();
for (const e of entries) {
  const key = `${e.service}/${e.citySlug}`;
  if (seen.has(key)) throw new Error(`slug collision: ${key} (${seen.get(key)} vs ${e.city})`);
  seen.set(key, e.city);
}

entries.sort((a, b) =>
  a.service.localeCompare(b.service) || b.providers - a.providers || a.city.localeCompare(b.city));

mkdirSync(dirname(JSON_OUT), { recursive: true });
writeFileSync(JSON_OUT, JSON.stringify(entries, null, 2) + '\n');

console.log(`${entries.length} pages -> ${JSON_OUT}`);
console.log(`${new Set(entries.map((e) => e.citySlug)).size} distinct cities, ${new Set(entries.map((e) => e.service)).size} services`);
