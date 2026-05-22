#!/usr/bin/env node
// Regenerate supabase/table_schemas/*.csv from the live database schema.
// One-command drift fix — see tools/README.md for setup.

import 'dotenv/config';
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, '..', 'supabase', 'table_schemas');

// Tracked tables. Filenames mirror what is committed in supabase/table_schemas/.
const TABLES = [
  { name: 'blog_posts',   file: 'Supabase_Blog_Posts_Table_Schema.csv' },
  { name: 'churches',     file: 'Supabase_Churches_Table_Schema.csv' },
  { name: 'daycares',     file: 'Supabase_Daycares_Table_Schema.csv' },
  { name: 'events',       file: 'Supabase_Events_Table_Schema.csv' },
  { name: 'ppec_centers', file: 'Supabase_PPEC_Centers_Table_Schema.csv' },
  { name: 'resources',    file: 'Supabase_Resources_Table_Schema.csv' },
  { name: 'schools',      file: 'Supabase_Schools_Table_Schema.csv' },
  { name: 'site_stats',   file: 'Supabase_Site_Stats_Table_Schema.csv' },
];

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL. Copy .env.example to .env and fill it in. See README.md.');
  process.exit(1);
}

function csvField(val) {
  if (val === null || val === undefined) return 'null';
  const s = String(val);
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const client = new pg.Client({ connectionString });
await client.connect();
console.log('→ Connected to Supabase database.');

const tableNames = TABLES.map(t => t.name);
const { rows } = await client.query(
  `SELECT table_name, column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = ANY($1::text[])
   ORDER BY table_name, ordinal_position`,
  [tableNames]
);
await client.end();

const byTable = new Map();
for (const r of rows) {
  if (!byTable.has(r.table_name)) byTable.set(r.table_name, []);
  byTable.get(r.table_name).push(r);
}

let written = 0;
let skipped = 0;
for (const { name, file } of TABLES) {
  const cols = byTable.get(name);
  if (!cols || cols.length === 0) {
    console.warn(`  ! ${name}: not found in DB, skipping`);
    skipped++;
    continue;
  }
  const lines = ['column_name,data_type,is_nullable,column_default'];
  for (const c of cols) {
    lines.push([csvField(c.column_name), csvField(c.data_type), csvField(c.is_nullable), csvField(c.column_default)].join(','));
  }
  fs.writeFileSync(path.join(SCHEMAS_DIR, file), lines.join('\n') + '\n');
  console.log(`  ✓ ${file} (${cols.length} cols)`);
  written++;
}

console.log(`\n✓ Done. ${written} CSV file(s) written, ${skipped} skipped.`);
