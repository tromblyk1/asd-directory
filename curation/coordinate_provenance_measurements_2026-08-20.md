# Coordinate provenance — measurements and insert-path audit

**Date:** 2026-08-20
**Status:** Report only. No DDL run, no code changed. All database access was SELECT-only.
**Companion file:** `curation/cityCoordinates_provenance_2026-08-20.csv` (284 rows, one per key)
**Prior report:** `curation/coordinate_provenance_schema_scoping_2026-08-18.md`

---

## Headline

Two premises behind the curation track's plan do not survive measurement.

1. **The population is 17, not ~160.** Only 17 provider rows have coordinates and no street
   address. The 161 `mobile-services` and 168 `virtual-therapy` rows overwhelmingly *do* have
   street addresses — exactly as suspected.
2. **No key in `cityCoordinates.json` is a verified city centroid.** Zero of 284. There is no
   gazetteer source anywhere in the repo; 118 keys are provably arithmetic means of provider
   coordinates by decimal signature, and **5 keys are a specific named provider's office address**.

Insert paths are clean — a `GENERATED ALWAYS` column breaks nothing, because `SubmitResource.tsx`
does not insert into `resources` at all.

---

## 1. Migration SQL

### Forward

```sql
ALTER TABLE resources ADD COLUMN coordinates_source text;

ALTER TABLE resources
  ADD CONSTRAINT resources_coordinates_source_check
  CHECK (coordinates_source IS NULL
         OR coordinates_source IN ('street_geocode','city_centroid','zip_centroid','manual'));

ALTER TABLE resources
  ADD COLUMN coordinates_approximate boolean
  GENERATED ALWAYS AS (
    CASE WHEN coordinates_source IS NULL THEN NULL
         ELSE coordinates_source <> 'street_geocode' END
  ) STORED;
```

### Rollback

Order matters — the generated column depends on `coordinates_source`, so it must drop first.

```sql
ALTER TABLE resources DROP COLUMN IF EXISTS coordinates_approximate;
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_coordinates_source_check;
ALTER TABLE resources DROP COLUMN IF EXISTS coordinates_source;
```

### Notes on the CHECK

`coordinates_source IS NULL OR ...` is technically redundant — `NULL IN ('a','b')` evaluates to
NULL, and a CHECK constraint passes on NULL. It is written explicitly so the next person reading
the constraint does not have to reason about three-valued logic to confirm NULL is allowed.

### What NULL implies for the generated boolean

The `CASE` is deliberate. `coordinates_source <> 'street_geocode'` alone would return NULL for a
NULL source (correct), but the tempting `IS DISTINCT FROM` variant returns **TRUE** — which would
assert all 3,026 unchecked rows are approximate, the mirror-image false claim. The `CASE` gives:

| `coordinates_source` | `coordinates_approximate` | Means |
|---|---|---|
| NULL (3,026 rows day one) | **NULL** | Unknown — nobody has checked |
| `street_geocode` | false | Verified street-level |
| `city_centroid` / `zip_centroid` / `manual` | true | Verified approximate |

So day one the column makes no claim about any row. That is the correct starting state.

**But the six render sites cannot currently distinguish NULL from false.** JavaScript truthiness
collapses `null` and `false` — `if (!provider.coordinates_approximate)` treats "unknown" and
"verified street-level" identically. Any surface consuming the flag must test explicitly:

```ts
provider.coordinates_approximate === true   // known approximate — suppress pin / directions / JSON-LD geo
provider.coordinates_approximate === false  // known street-level — render normally
provider.coordinates_approximate === null   // unknown — decide the default deliberately
```

The six sites (from the 2026-08-18 scoping report): `findproviders.tsx:1120` marker,
`findproviders.tsx:1186` directions link, `ProviderDetail.tsx:298` JSON-LD `GeoCoordinates`,
`ProviderDetail.tsx:408`/`:623` directions links, `ProviderDetail.tsx:601`/`610` map at zoom 14,
and the per-card distance number (`findproviders.tsx:21` + `535–546`).

The NULL default is a policy decision, not a schema one: treating NULL as "render normally"
preserves today's behavior for 3,026 rows; treating it as "suppress" degrades 3,026 rows to fix 17.

---

## 2. Population measurements

### Which column holds the street address

**`address` is authoritative. `address1` is a parsed subset of it.** Providers, n = 3,186:

| Column | Populated |
|---|---:|
| `address` | 3,127 |
| `address1` | 3,014 |
| `address2` | 684 |
| both `address` and `address1` | 3,014 |
| **only `address`** | **113** |
| **only `address1`** | **0** |
| neither | 59 |

`only_address1 = 0` is the proof: `address1` is never populated without `address`. So `address` is
the correct and complete basis for "has no street address." **All counts below use
`address IS NULL OR btrim(address) = ''`.**

Caveat on quality, not coverage: 9 rows have `address` populated with no digit anywhere
(building-name-only), and `review_reason` separately flags 11 rows "address1 has no street number"
and 10 rows "Address contains only numbers". Those ~30 rows are nominally addressed but not
street-geocodable, so 17 is a floor.

### a–f

| | Question | With coordinates | Without coordinates |
|---|---|---:|---:|
| a | `virtual-therapy` + no street address | **2** | 5 |
| b | `mobile-services` + no street address | **7** | 7 |
| c | both tags + no street address | **2** | — |
| d | **no street address, any tag, WITH coordinates** | **17** | — |
| e | of (d), have a `google_place_id` | **6** | — |
| f | coordinates + no street address + no city | **0** | — |

Context: 59 provider rows total have no street address. Raw tag totals are 161 `mobile-services`
and 168 `virtual-therapy` — so **95%+ of both tag populations have a real street address** and need
no flag, confirming the raw tag counts were the wrong planning numbers.

**(d) = 17 is the real planning number.** Not ~160.

**(f) = 0 is good news:** every row that needs a fallback coordinate has a city to hang it on.

**(e) = 6 is a caution:** a `google_place_id` on an address-less row usually means a Google Business
Profile with a hidden address. Those coordinates may be Google's own approximation of a service
area, not a street geocode — so they need `coordinates_source` set, not assumed.

---

## 3. Insert-path audit

**Adding a `GENERATED ALWAYS` column breaks nothing.** `from('resources')` appears in 7 files;
only 3 are live, and none of them inserts a wide object.

| Path | What it does | Column list or spread? | Breaks? |
|---|---|---|---|
| `src/frontend/src/pages/SubmitResource.tsx` | **Does not touch the database.** L262: `// Send email notification via PHP backend (no database insert - you'll add manually after review)`. Posts to the PHP mailer | n/a — the spreads at L203/211/325/330/340 are React `setFormData(prev => ({...prev}))` state updates, not DB payloads | **No** |
| `supabase/functions/stripe-webhook/index.ts` L101–102 | The only live write to `resources`: `.update({ featured: true, featured_tier: tier })` | Explicit, two named columns | **No** |
| `src/frontend/src/pages/ProviderDetail.tsx` L147 | `.select('*')` read | n/a | No |
| `src/frontend/src/pages/findproviders.tsx` L229 | `.select('*')` read | n/a | No |
| `src/frontend/send-submission-email.php`, `send-event-submission-email.php` | Email only — no supabase/PDO/mysqli/INSERT anywhere | n/a | **No** |
| `_archive/02_migrate_data.mjs` L143, L228, L384 | Three `.from('resources').insert(...)` calls | Object spreads — *would* break | Archived/dead |

**There is no `api/` directory.** The two files above are the only PHP in the repo.

Because both provider reads use `.select('*')`, the new columns arrive at runtime with no query
change. The only code touch is types, and only when a surface starts consuming the flag —
`ProviderResource` in `ProviderCard.tsx:19-49` and the local type in `ProviderDetail.tsx:44-45`.
No change to `src/frontend/src/lib/supabase.ts` (its `Provider` interface is dead — imported by
nothing, column names stale).

---

## 4. `cityCoordinates.json` provenance audit

**File not modified.** 284 keys. Full per-key detail in
`curation/cityCoordinates_provenance_2026-08-20.csv`.

### Method

Two independent signals:

1. **Decimal-place count as a fingerprint.** A coordinate carrying **≥8 decimal places** cannot come
   from a gazetteer or a geocoder — it is an arithmetic mean of ≥2 values. ≤7 decimals is
   ambiguous (could be either), so those are reported as unknown rather than assumed clean.
2. **Exact coordinate equality** against every provider row, then **the direction of the match**
   resolved by hand. Same equality test, opposite meanings:
   - *file derived FROM a provider* → the key **is** that provider's office. A leak.
   - *provider assigned FROM the file* → the provider carries a centroid. Expected.

### Provenance distribution

| Classification | Keys | What it means |
|---|---:|---|
| `provider_average_multi` | 118 | ≥8 decimals — **provably** an arithmetic mean of provider coordinates |
| `short_decimal_unknown` | 135 | ≤7 decimals — provenance unknown; **71 of these have n=1**, 119 have n≤5 |
| `unverifiable_no_providers` | 20 | Zero providers in that `canonical_city` today — nothing to check against |
| `provider_copied_this_centroid` | 6 | The 6 Cultivate rows; provider took the file's value (expected direction) |
| **`LEAK_centroid_is_a_real_office`** | **5** | **The key's coordinate IS a named provider's office address** |

### Provider counts per key

| Bucket | Keys |
|---|---:|
| n = 0 | 20 |
| n = 1 | 85 |
| **n ≤ 5 (flagged as thin)** | **184** |
| n ≥ 10 and `provider_average_multi` | 56 |
| n ≤ 5 and `provider_average_multi` | 37 |

**184 of 284 keys — 65% — are thin.** In a thin city an "average" of one or two providers is not a
centroid in any meaningful sense; it is an office, or the midpoint between two offices.

### The 5 leaks — named

| Key | n | The provider the coordinate actually is |
|---|---:|---|
| BELLE ISLE | 1 | **7349** The Kelly Behavioral Institute |
| COCONUT GROVE | 1 | **9094** Williamsburg Therapy Group Miami |
| DAYTONA BEACH SHORES | 1 | **10363** New Beginnings Counseling |
| NORTH LAUDERDALE | 1 | **7394** Superior Healthcare for the Aged & Disabled |
| OPA-LOCKA | 0 | **8774** Easterseals South Florida – Miami Gardens — and note the provider is in **MIAMI GARDENS**, not Opa-Locka |

Assign one of these to another provider and that provider's map pin, "Get Directions" button and
JSON-LD `GeoCoordinates` all point at a real, occupied building belonging to a named competitor.

### 5 is a lower bound, and the true number is unknowable

If the file was built in October 2025 by averaging provider coordinates, then **every one of the 85
n=1 keys matched its single provider exactly on the day it was written.** Roughly 140 deletions and
120 retags since then destroyed that evidence — the provider that produced the value is gone, so
the equality test no longer fires. The 5 detected today are the survivors, not the population.

### Keys sharing a coordinate point

| Point | Keys |
|---|---|
| `28.178, -80.602` | INDIAN HARBOUR BEACH, SATELLITE BEACH |
| `29.6609, -82.5852` | JONESVILLE, NEWBERRY, TIOGA |

Separately, `OPA LOCKA` (n=1) and `OPA-LOCKA` (n=0) are a normalization-drift pair carrying
**different** coordinates — the same class of defect as the `ST. PETERSBURG` / `SAINT PETERSBURG`
split already known on `canonical_city`.

### Answer to the question asked

**Zero of the 284 keys are safe to describe as a real city centroid.**

- 118 are provably provider averages.
- 5 are provably a single named provider's office.
- 6 are round-trips of values already stamped onto providers.
- 135 are unknown, and 71 of those have exactly one provider — the same shape as the 5 proven leaks.
- 20 cannot be checked at all.

Nothing in the repo contains a gazetteer, a Census place file, or any external coordinate source.
So `city_centroid` as a `coordinates_source` value would be **a claim the data does not support**
for any row populated from this file.

---

## Consequence for the curation track

The plan to scale a city-centroid pattern to ~160 records off this file rests on both premises
this report breaks:

- The population is **17**, so the work is a manual afternoon, not a bulk operation.
- The file is not a centroid source. Using it would stamp `city_centroid` — a provenance claim —
  onto coordinates that are, for at least 5 keys, someone else's street address.

For 17 rows, geocoding the city name against the Census Bureau geocoder (already the established
first step in the workflow) produces a defensible `city_centroid` value and costs less than
auditing 284 keys of unknown origin. That path also does not need a Google key.

## What this report does not decide

- Display treatment for approximate coordinates, and the NULL default at the six render sites.
- Whether to fix, regenerate, or delete `cityCoordinates.json`. Worth knowing before deciding:
  **nothing in the codebase imports it.** Zero call sites.
- Backfill of `coordinates_source` for the 3,026 rows that already have coordinates.
