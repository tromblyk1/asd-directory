# Coordinate provenance — schema scoping report

**Date:** 2026-08-18
**Status:** Report only. No DDL run, no code changed.
**Proposal under review:** add `coordinates_approximate` (boolean, default false) and
`coordinates_source` (text, nullable — `street_geocode` / `city_centroid` / `zip_centroid` / `manual`)
to `resources`.

---

## Headline

The schema change is clean. **No existing column serves this purpose, no dedup code compares
coordinates, and the ALTER TABLE needs no change to `src/frontend/src/lib/supabase.ts`** — the
provider type the live app actually uses is `ProviderResource` in `components/ProviderCard.tsx`,
not anything in `supabase.ts`.

The surface count is **14 provider-facing coordinate reads across 3 files**, but only **6 would
need to respect the flag**. The other 8 are presence checks, count thresholds, or bounds math that
a centroid does not break.

Two things worth knowing before you decide:

- **Stacked coordinates already exist.** 107 distinct lat/lng points carry 226 provider rows today
  (largest stack: 4). Any coordinate-equality dedup written now already has 226 false-positive
  candidates before a single centroid is added.
- **`virtual-therapy` is a third population you have not counted** — 168 rows, same problem as the
  161 `mobile-services` rows.

---

## 1. Every place that reads latitude or longitude

Scoped to the `resources` provider path. Schools, daycares, events and churches read coordinates
from different tables and are listed at the end for completeness.

### `src/frontend/src/pages/findproviders.tsx` — 8 reads

| Line | What it does | Centroid breaks it? |
|---|---|---|
| 21 | `calculateDistance` — haversine, `R = 3959` miles | Value is wrong by up to a few miles |
| 392–394 | Browser geolocation → `setUserLocation` / `setSearchCenter` | No — user's own position |
| 406–420 | `handleMapMove`, 5-mile threshold for the "search this area" button | No — compares map centers |
| 486–497 | `MapBoundsUpdater` → `fitBounds(coords, { maxZoom: 12 })` | No — city-scale bounds absorb it |
| 535–546 | `locationFilteredProviders` — `distance <= searchRadius` (default 25 mi) | Rarely — centroid is in the right city |
| 549–554 | `mappableProviders` — presence filter only | No |
| 556–574 | `shouldRenderMap` / `MAX_MAP_PROVIDERS` (1500 for county-only) | No — count-based |
| **1120** | **`<Marker position={[lat, lng]}>`** | **Yes — renders as an exact office** |
| **1186** | **Google Maps directions `&destination=lat,lng`** | **Yes — routes a parent to nothing** |

### `src/frontend/src/pages/ProviderDetail.tsx` — 5 reads

| Line | What it does | Centroid breaks it? |
|---|---|---|
| 44–45 | Local type `latitude: number \| null; longitude: number \| null;` | n/a |
| 213 | `const hasCoordinates = provider.latitude && provider.longitude;` | No — presence check |
| **298** | **JSON-LD `"geo": { "@type": "GeoCoordinates", ... }`** | **Yes — publishes a centroid to Google as the business location** |
| **408, 623** | **Directions links `?api=1&destination=lat,lng`** | **Yes** |
| **601, 610** | **`<MapContainer center={...} zoom={14}>` + `<Marker position={...}>`** | **Yes — zoom 14 is street level; a centroid pin lands on a random block** |

### `src/frontend/src/components/ProviderCard.tsx` — 1 read

| Line | What it does | Centroid breaks it? |
|---|---|---|
| 479 | `{!fullAddress && !provider.latitude && (` → renders a "no location" fallback | No — presence check |

### Summary of the six that would need to respect the flag

1. `findproviders.tsx:1120` — list-map marker
2. `findproviders.tsx:1186` — list directions link
3. `ProviderDetail.tsx:298` — JSON-LD `GeoCoordinates`
4. `ProviderDetail.tsx:408` and `:623` — detail directions links
5. `ProviderDetail.tsx:601/610` — detail map (zoom 14)
6. `findproviders.tsx:21`+`535–546` — the distance number shown per card, if it is surfaced

Of these, the **directions links and the JSON-LD are the actively harmful ones**. A pin that is
vaguely wrong is a UX annoyance; a "Get Directions" button that navigates a parent to an empty
intersection is a trust failure, and publishing a centroid as `GeoCoordinates` tells Google the
business is somewhere it is not.

### Out of scope (different tables, same pattern)

`ResourceDetail.tsx` (faith communities — includes a **zoom-15 Google Maps embed iframe** at
L460–471, the tightest zoom anywhere on the site), `Events.tsx`, `Event.types.ts`, `FindSchools.tsx`,
`SchoolDetail.tsx`, `SchoolCard.tsx`, `FindDaycares.tsx`, `DaycareDetail.tsx`, `DaycareCard.tsx`,
`ChurchDetail.tsx`.

---

## 2. Does any dedup logic compare coordinates?

**No. Nothing in the codebase compares coordinates for any purpose.**

Every "dedup" hit was checked:

| File | What "dedup" means there | Coordinates? |
|---|---|---|
| `scripts/events_pipeline/deduper.js` | Merges event records; `preferLonger` on description | No |
| `scripts/events_pipeline/pipeline.js`, `validator.js` | Call sites for the above | No |
| `src/frontend/src/lib/trackListing.ts` | `DEDUP_KEY = 'fas_session_tracked'` — sessionStorage analytics dedup for `impression` / `detail_view` | No |
| `_archive/scripts/dedupe_csv.py` | pandas `drop_duplicates(subset=["provider_name","phone","city"])` | No |

A grep for `lat|lon|coord` across all of `scripts/` returns zero matches.

**So the risk is prospective, not present** — it applies to whatever dedup gets written next, and to
the manual SQL passes that produced `curation/confirmed_duplicate_pairs.csv` and
`curation/same_site_same_city.csv`.

**But the problem predates the centroids.** Measured today:

| Metric | Value |
|---|---|
| Distinct lat/lng points shared by >1 provider | 107 |
| Provider rows sitting at a shared point | 226 |
| Largest single stack | 4 |

That is medical plazas, shared office suites and re-geocoded addresses. A coordinate-equality rule
written today already misfires 226 times.

---

## 3. Does `resources` already have a column for this?

**No.** Every candidate was checked against `information_schema` and against actual row values:

| Column | Type / default | Rows populated (providers, n=3,192) | Why it does not serve |
|---|---|---|---|
| `needs_review` | boolean, default false | 31 true | Generic curation queue |
| `review_reason` | text | 114 | Free-text, mixed semantics — 83 are "blanket aba tag removed 2026-08-17", 11 "address1 has no street number", 10 "Address contains only numbers". Overloading this would bury the flag in a content-curation backlog |
| `address2_needs_manual_review` | text | 14 | Address-parsing artifact, not geocode provenance |
| `address_original` | text | — | Pre-normalization address string |
| `google_place_id` | text | 2,946 | Closest proxy, but it is a Google *identity*, not coordinate provenance. 198 rows have coordinates and no place_id; conversely an in-home provider can hold a place_id from a Google Business Profile with a hidden address. Not a substitute |
| `verified` / `last_verified_date` | boolean / date | — | Already established as a source label, not a check |

**Coverage baseline:** 3,026 of 3,192 providers have coordinates (94.8%).

### The detectability argument for doing this now

There is currently **no way to identify the centroid rows after the fact.** The only proxies are:

- `address1 IS NULL` — not specific. The 25-row sample includes *ABA Centers of Florida - Boca Raton*
  and *Koala ABA & Learning Centers - Doral Clinic*, which are real offices with real coordinates
  and a null `address1`.
- exact-duplicate lat/lng — already 226 rows of noise from unrelated causes.

Once the `mobile-services` backlog is geocoded, those rows become permanently indistinguishable from
real offices. **Scale, measured:**

| Population | Rows | Already have coordinates |
|---|---:|---:|
| `mobile-services` | 161 | 147 |
| `virtual-therapy` | 168 | not separately counted |
| In-home, no published office (your immediate case) | 6 | 6 |

`virtual-therapy` is a third population with the same defect and arguably a worse one — a virtual
provider arguably should not have a map pin at all.

---

## 4. Would the ALTER TABLE require a `supabase.ts` change?

**No — and the reason is worth knowing, because `supabase.ts` is stale in a way that will mislead
the next person who edits it.**

The provider type the live app actually uses is **`ProviderResource`, exported from
`src/frontend/src/components/ProviderCard.tsx:19-49`** (`latitude` / `longitude` at :33–34).
`findproviders.tsx:10` imports it from there.

`src/frontend/src/lib/supabase.ts` exports four interfaces, and none of them is the provider row:

| Interface | Line | Has lat/lng | Who imports it |
|---|---|---|---|
| `Provider` | 3 | L16–17, optional | **Nothing.** Column names (`provider_name`, `zip`, `service_type`, `accepts_medicaid`…) do not match the current `resources` table. Dead |
| `Church` | 81 | — | `ChurchCard.tsx` |
| `Resource` | 104 | — | Blog/content shape (`title`, `category`, `slug`, `tags`) — only `_archive/pages-old/ResourcesPage.tsx` |
| `PPECCenter` | 116 | **L140–141, required** | `DaycareDetail.tsx` — this is the **daycares** table, not `resources` |

Every other importer of `@/lib/supabase` (`findproviders.tsx`, `ProviderDetail.tsx`,
`FindSchools.tsx`, `SchoolDetail.tsx`, etc.) imports only the `supabase` client, not a type.

### What would actually change, and when

Both provider query paths use `select('*')` — `findproviders.tsx:229` and `ProviderDetail.tsx:147` —
so **the new columns arrive at runtime with no query change.** Types are the only code touch, and
only when a surface starts consuming the flag:

```ts
// src/frontend/src/components/ProviderCard.tsx, inside ProviderResource
  coordinates_approximate?: boolean | null;
  coordinates_source?: string | null;
```

Plus the local provider type in `ProviderDetail.tsx` (around L44–45) if the detail page consumes it.

---

## One design note on the proposal

`coordinates_approximate` is fully derivable from `coordinates_source`
(`street_geocode` → false, everything else → true). Two columns that can disagree is a bug surface,
and the curation track will be populating both by hand.

Two options:

1. **Keep both, add a CHECK** so they cannot diverge:
   `CHECK (coordinates_approximate = (coordinates_source IS DISTINCT FROM 'street_geocode'))`
2. **Keep both, make the boolean generated** — `GENERATED ALWAYS AS (...) STORED`, so curation only
   ever sets `coordinates_source`.

Either is better than two independently-writable columns. Option 2 is the smaller ongoing burden.
Dropping the boolean entirely and having the 6 render sites test
`coordinates_source <> 'street_geocode'` would work but pushes a value list into six components —
not worth it.

Also worth constraining `coordinates_source` to the four values with a CHECK rather than leaving it
free text, given `review_reason` is the cautionary example of free text on this table.

---

## What this report does not decide

- **Display treatment** for approximate coordinates (suppress the pin? show a radius circle?
  drop the directions link? omit `geo` from JSON-LD?) — separate decision, per your instruction.
- **Backfill strategy** for the 3,026 rows that already have coordinates. Leaving
  `coordinates_source` NULL for all of them and treating NULL as "unknown, assume street" is the
  low-effort default, but it means `coordinates_approximate = false` is a claim the data does not
  support for most rows.
