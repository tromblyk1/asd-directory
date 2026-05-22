# tools/

Repo-level Node scripts that don't belong to the frontend bundle.

## refresh_schemas.mjs

Regenerates every CSV in `supabase/table_schemas/` from the live `information_schema` of the Supabase database. Run after any schema change so the committed snapshots stay in sync.

### One-time setup

```bash
cd tools
npm install
cp .env.example .env
# then open .env and fill in SUPABASE_DB_URL
```

### Run

```bash
cd tools
npm run refresh
```

The script connects to Postgres directly (via the `pg` driver), queries `information_schema.columns` for each tracked table, and overwrites the matching `supabase/table_schemas/Supabase_*_Table_Schema.csv` file. It reports written/skipped counts at the end.

### Adding a new tracked table

Append an entry to the `TABLES` array at the top of `refresh_schemas.mjs`:

```js
{ name: 'new_table', file: 'Supabase_New_Table_Table_Schema.csv' },
```

Then run `npm run refresh` to create the CSV.
