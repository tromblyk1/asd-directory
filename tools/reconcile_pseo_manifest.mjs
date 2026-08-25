// Reconciles the committed pSEO manifest against a SECOND, LATER read of the database.
// Run this AFTER generate_pseo_manifest.mjs and BEFORE build and deploy. Exit code 1 means
// do not deploy.
//
// WHY THIS EXISTS (2026-08-25): the manifest can be correct when written and stale by the
// time it reaches the server. A regen fetched 2,963 providers and wrote aba/brooksville at
// 5 providers; ~91 rows were deleted during the build-and-deploy window; the page shipped
// claiming 5 against 2 real ones — a soft 404 caused by regenerating, not by failing to.
// The generator cannot catch this: it only ever sees one instant. Only a second read can.
//
// The eligibility rule below is MIRRORED from generate_pseo_manifest.mjs on purpose — an
// independent reimplementation catches generator bugs as well as data movement. If the rule
// changes there, change it here too.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const JSON_IN = resolve(here, '../src/frontend/src/data/pseo/cityPages.json');

const SUPABASE_URL = 'https://twcofgyxiitfvoedftik.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzAyNzUsImV4cCI6MjA3NTc0NjI3NX0.pkxp6DBSgQykenv2UZIILZhUY9P6xp-lBNs6Z8NNmdI';

const EXCLUDED_SERVICES = new Set(['residential-program', 'virtual-therapy']);
const PAGE_SIZE = 1000;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const domainOf = (website) => {
  const host = String(website || '')
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
  return host || null;
};

async function fetchProviders() {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const url =
      `${SUPABASE_URL}/rest/v1/resources` +
      `?select=canonical_city,services,website` +
      `&resource_type=eq.provider&canonical_city=not.is.null`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Range: `${from}-${from + PAGE_SIZE - 1}`,
      },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

const manifest = JSON.parse(readFileSync(JSON_IN, 'utf8'));
const written = new Map(manifest.map((e) => [`${e.service}/${e.citySlug}`, e.providers]));

console.log(`Manifest on disk: ${written.size} pages`);
console.log('Re-reading the database…');
const providers = await fetchProviders();
console.log(`Live read: ${providers.length} providers`);

const domainCities = new Map();
for (const p of providers) {
  const d = domainOf(p.website);
  if (!d) continue;
  if (!domainCities.has(d)) domainCities.set(d, new Set());
  domainCities.get(d).add(p.canonical_city);
}

const combos = new Map();
for (const p of providers) {
  const d = domainOf(p.website);
  const bucket = !d ? 'no_website' : domainCities.get(d).size === 1 ? 'single_city' : 'multi_city';
  for (const service of p.services || []) {
    const key = `${service} ${p.canonical_city}`;
    let c = combos.get(key);
    if (!c) {
      c = { service, city: p.canonical_city, providers: 0, single_city: 0 };
      combos.set(key, c);
    }
    c.providers += 1;
    if (bucket === 'single_city') c.single_city += 1;
  }
}

const live = new Map();
for (const c of combos.values()) {
  if (EXCLUDED_SERVICES.has(c.service)) continue;
  if (c.providers >= 5 || (c.providers >= 3 && c.providers <= 4 && c.single_city >= 2)) {
    live.set(`${c.service}/${slugify(c.city)}`, c.providers);
  }
}

console.log(`Live eligible: ${live.size} pages`);

// A page in the manifest that is no longer eligible is the soft 404. It deploys as a 200
// advertising a provider count the database cannot back.
const stale = [...written.keys()].filter((k) => !live.has(k));
const missing = [...live.keys()].filter((k) => !written.has(k));
const drifted = [...written.entries()].filter(([k, n]) => live.has(k) && live.get(k) !== n);

if (stale.length) {
  console.error(`\nSTALE — in the manifest, no longer eligible (${stale.length}):`);
  for (const k of stale) console.error(`  ${k}  manifest says ${written.get(k)}`);
}
if (missing.length) {
  console.error(`\nMISSING — eligible now, absent from the manifest (${missing.length}):`);
  for (const k of missing) console.error(`  ${k}  live ${live.get(k)}`);
}
if (drifted.length) {
  console.warn(`\nCOUNT DRIFT — still eligible, different provider count (${drifted.length}):`);
  for (const [k, n] of drifted) console.warn(`  ${k}  manifest ${n} -> live ${live.get(k)}`);
  console.warn('Counts move constantly and do not by themselves break a page. Treat a long');
  console.warn('list as evidence a batch is still landing, and consider waiting.');
}

if (stale.length || missing.length) {
  console.error('\nFAIL — the page set disagrees. Do not build or deploy.');
  console.error('Re-run generate_pseo_manifest.mjs once the batch has settled, then reconcile again.');
  process.exit(1);
}

console.log('\nOK — manifest page set matches the live database. Safe to build and deploy.');
