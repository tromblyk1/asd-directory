# Slugless provider rows — provenance — 2026-08-20

Report only. No data or code was changed.

> **Corrected 2026-08-20** after review. Three claims in the original were wrong and are
> fixed throughout; see §6 for the full list. In short: the table-wide count is **12, not
> 11**; provider slugs **do** embed the id, as `-fl-{id}`; and **at least two unrelated
> paths** have produced NULL slugs, not one.

---

## 0. Answer

**Two unrelated paths, not one.**

Eleven of the twelve — the Sunrise Community batch — came from **one hand-written
multi-row `INSERT` on 2026-02-19** that omitted the `slug` column. The twelfth (id 9800)
predates it by three months and carries a different source entirely. Neither came from
the Stripe webhook (it has no INSERT path at all) or from a bulk import.

Whether a skipped `nextval` CTE was involved is **undetermined**. The original report
ruled it out on the grounds that provider slugs do not embed the id — that was wrong.
They do, as `-fl-{id}`, which means a generator *must* know the id before it can build
the slug. So the CTE hypothesis is live, not excluded. See §3.

**The path is still wide open today.** Manual SQL is the only write path that inserts
into `resources`, and the database has nothing that would stop it: `slug` is nullable,
has no default, has no generating trigger, and the UNIQUE index permits unlimited NULLs.
Any `INSERT` that omits `slug` succeeds silently.

---

## 1. The rows

### 1a. The twelfth row — different source, different path, three months earlier

Scoping to `resource_type='provider'` returns 11. Scoping to the whole table returns
**12**. The extra row is not a provider:

| id | name | resource_type | canonical_city | source | created_at |
|---|---|---|---|---|---|
| 9800 | Physical Therapy | **`educational`** | HOLLY HILL | `Google Places (PT/OT/ST)` | 2025-11-03 |

That `resource_type` is the entire explanation for the 11-vs-12 discrepancy. It also
means the `Google Places (PT/OT/ST)` importer — 1,231 rows, reported below as 0/1,231
slugless — is only clean *within the provider subset*. It produced this row too.

Curation is deliberately holding 9800 at NULL: "Physical Therapy" is not a business
name, and a slug is permanent once set. It should stay slugless until it has a real
name.

### 1b. The 11 provider rows

`resource_type='provider' AND (slug IS NULL OR btrim(slug)='')` — exactly 11.
**All 11 have since been assigned slugs by curation; the table now has 3,186 providers
and zero slugless ones.**

| id | name | canonical_city | source | created_at |
|---|---|---|---|---|
| 10674 | Sunrise Community, Inc. - Tallahassee | TALLAHASSEE | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10675 | Sunrise Community, Inc. - Bartow | BARTOW | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10676 | Sunrise Community, Inc. - Wauchula | WAUCHULA | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10677 | Sunrise Community, Inc. - Hillsborough County | TAMPA | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10678 | Sunrise Community of Southwest Florida - Bradenton | BRADENTON | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10679 | Sunrise Community of Southwest Florida - Clewiston | CLEWISTON | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10680 | Sunrise Community of Southwest Florida - Naples | NAPLES | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10681 | Sunrise Community, Inc. - Doral | DORAL | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10682 | Sunrise Community, Inc. - Homestead | HOMESTEAD | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10683 | Sunrise Community, Inc. - Davie | DAVIE | `manual` | 2026-02-19 05:20:26.828406+00 |
| 10684 | Sunrise Community, Inc. - Miami 162nd Avenue | MIAMI | `manual` | 2026-02-19 05:20:26.828406+00 |

All 11 are `verified=true`, `featured=false`, and share
`updated_at = 2026-08-16 08:00:03.973188+00` (a later bulk touch, likely the
`canonical_city` backfill — that trigger fires on UPDATE).

---

## 2. Three fingerprints that identify a single hand-written statement

**a. Identical `created_at` to the microsecond.** All 11 carry
`2026-02-19 05:20:26.828406+00`. `created_at` defaults to `now()`, which is
transaction-start time and constant across a statement. Eleven separate API calls would
produce eleven distinct timestamps. This is one `INSERT ... VALUES (...), (...), ...`.

**b. Contiguous ids with no interleaving.** 10674–10684 unbroken. The surrounding rows
were each typed one at a time, minutes to hours apart:

| id | name | created_at | slugless |
|---|---|---|---|
| 10672 | YMCA of South Florida - Special Needs Programs | 2026-02-18 22:39:12 | no |
| 10673 | Easterseals Florida - Winter Park | 2026-02-19 04:13:31 | no |
| **10674–10684** | **Sunrise Community × 11** | **2026-02-19 05:20:26.828406** | **yes** |
| 10686 | Dragonfly Fit and Fun Social Club, Inc. | 2026-02-26 00:20:47 | no |

(`10685` is absent — deleted at some later point.)

**c. `source='manual'` appears nowhere else in the table.** It is used by these 11 rows
and no others, and it is the only source value with any slugless rows at all:

Counts below are provider-scoped. Note that `Google Places (PT/OT/ST)` is 0-slugless
only within that scope — table-wide it also produced id 9800 (§1a).

| source | rows | slugless |
|---|---|---|
| Google Places (PT/OT/ST) | 1,231 | 0 |
| legacy_migration | 1,113 | 0 |
| FL-DD Database | 579 | 0 |
| *(null)* | 117 | 0 |
| PATH International | 45 | 0 |
| American Hippotherapy Association | 22 | 0 |
| submission | 17 | 0 |
| manual_curation_2026-08 | 11 | 0 |
| **manual** | **11** | **11** |
| *(15 other sources)* | 39 | 0 |
| **total** | **3,186** | **11** |

Note the contrast with `manual_curation_2026-08` — same kind of hand curation, 11 rows,
2026-08-19/20, **0 slugless**. Whoever wrote that batch included the slug column.

---

## 3. Ruling out the other two hypotheses

### Stripe webhook — ruled out, it cannot insert

`stripe-webhook` is the project's only edge function (v3, ACTIVE, `verify_jwt=false`).
Its sole `resources` operation is an **update**:

```ts
const { error } = await supabase
  .from("resources")
  .update({ featured: true, featured_tier: tier })
  .eq("id", Number(ref));
```

There is no `.insert()` and no `.upsert()` anywhere in it. It touches only `featured`
and `featured_tier` on a row that already exists, keyed by a numeric
`client_reference_id`. When no reference is present it logs and does nothing. **It has
never been able to create a `resources` row**, slugless or otherwise.

### Bulk import — ruled out by the source column and the timestamp

Every named import source (`Google Places`, `legacy_migration`, `FL-DD Database`,
`PATH International`, …) clusters on 2025-11-03/15/17 and is 0/N slugless. The 11 rows
sit alone on 2026-02-19 under a source value no importer ever wrote.

### Skipped `nextval` CTE — NOT ruled out (this section was wrong)

The original report ruled this out by claiming provider slugs do not embed the id. That
was a measurement error. The test used was:

```sql
count(*) FILTER (WHERE slug = name_slug || '-' || id)  -- 0
```

It looked for a bare `name-id` shape and so missed the `-fl-` infix that every provider
slug actually carries. The real convention is:

```
slugify(name) || '-' || slugify(city) || '-fl-' || id
```

Re-measured against the current 3,186 providers:

| shape | count |
|---|---|
| slug ends in `-fl-{id}` | **3,097** |
| slug set but no trailing id | 89 |
| slug NULL or empty | 0 |

An expression implementing the convention above reproduces **3,065 of the 3,097**
byte-for-byte; the 32 residuals are name-or-city drift after the slug was frozen, not a
competing rule.

**Consequence for this report:** because the slug embeds the id, any generator must read
the id *before* it can build the slug — which is exactly the condition that makes a
`nextval` CTE necessary. The CTE hypothesis is therefore **undetermined**, not excluded.
Nothing else in this report turns on it: the `INSERT` still did not list `slug` among
its columns, and the three fingerprints in §2 still identify a single hand-written
statement.

The 89 slugs with no trailing id are a separate, older shape and are out of scope here.

### The submission form — ruled out, it never writes to the DB

`SubmitResource.tsx:262`:

> `// Send email notification via PHP backend (no database insert - you'll add manually after review)`

Confirmed by grep: there is **no `.insert(` against `resources` anywhere in
`src/frontend/src/`**. All four `.from('resources')` call sites are SELECTs
(`findproviders.tsx:228`, `ProvidersByCity.tsx:70`, `ProviderDetail.tsx:146`, and one
archived page). The 17 `source='submission'` rows all have slugs precisely because a
human added them by hand after review.

---

## 4. What is still open today

**Manual SQL — and it is the only insert path that exists.** Nothing in the schema
defends against it:

| Defence | Present? |
|---|---|
| `slug` NOT NULL | No — `is_nullable = YES` |
| `slug` column default | No — `column_default = null` |
| BEFORE INSERT trigger generating slug | No |
| UNIQUE index blocking repeats | `resources_slug_key` exists, but Postgres UNIQUE permits **unlimited NULLs**, so all 12 NULL slugs coexisted without error |

The table has exactly two triggers, neither of which touches `slug`:

- `resources_set_canonical_city` — BEFORE INSERT OR UPDATE
- `update_resources_updated_at` — BEFORE UPDATE

So an `INSERT` that omits `slug` raises no error, trips no constraint, and produces a
row that is invisible to `/providers/:slug` and absent from the sitemap. That is what
happened on 2026-02-19 and it would happen again today.

By contrast, the two automated paths are both incapable of it: the Stripe webhook only
updates, and the submission form only sends email.

---

## 5. Downstream state

**At the time of the original report:**

- Sitemap emitted 3,175 provider URLs (the 11 had no URL to emit).
- `ProviderCard` degrades to an unlinked entry when `slug` is null, so no
  `/providers/null` was rendered. 5 of the 11 surfaced on 11 of the 373 pSEO pages; the
  other 6 were excluded because their only service tag is `residential-program`, which
  the manifest drops.
- Nothing user-facing was broken. The rows were simply unreachable by direct URL.

**Now:** curation has assigned all 11 Sunrise slugs. Providers are at 3,186 with **zero
slugless rows**, the sitemap emits 3,186 provider URLs, and all 11 are reachable by
direct URL. Id 9800 remains NULL by design (§1a) and is not a provider, so it costs no
provider URL.

---

## 6. Corrections applied 2026-08-20

| # | Original claim | Correct |
|---|---|---|
| 1 | Provider slugs do not embed the id; 0 of 3,175 match `name-id` | They do, as **`-fl-{id}`** — 3,097 of 3,186. The test regex looked for a bare `name-id` and missed the `-fl-` infix. |
| 2 | Skipped `nextval` CTE ruled out | **Undetermined.** It was ruled out on the strength of claim 1. Since the slug embeds the id, a generator must read the id first — the CTE condition holds. |
| 3 | 11 slugless rows | **12** table-wide. The original query was scoped `resource_type='provider'`; id 9800 is `resource_type='educational'`, which is why the counts differed. |
| 4 | One insert path produced them | **At least two.** Id 9800 predates the Sunrise batch by three months and carries `source='Google Places (PT/OT/ST)'`. |

Unaffected by the corrections: the Stripe webhook remains ruled out (it has no INSERT or
UPSERT path at all, only `.update()`), the submission form remains ruled out (no DB
write), and the three fingerprints in §2 still identify the Sunrise 11 as a single
hand-written statement.
