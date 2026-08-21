# pSEO build manifest + events table state

**Date:** 2026-08-20
**Status:** Report only. SELECT-only, no schema changes, no file edits.

Companion CSVs:
- `pseo_page_manifest_2026-08-20.csv` — 395 rows, the definitive service+city build list
- `pseo_medicaid_manifest_2026-08-20.csv` — 35 rows, the medicaid city build list

---

## Headline

**395 service+city pages, 35 medicaid city pages, 21 future-dated events.**

The events table is effectively empty for a location-page purpose: 21 future rows,
4 of which carry a `2099-12-31` placeholder date, 9 of which have neither coordinates
nor an address, and all 12 recurring events are past-dated.

---

## 1. Final page manifest

**Rule:** `providers >= 5`, **plus** `providers` in 3-4 **and** `single_city >= 2`.
Same domain derivation and bare-shared-host exclusion as the domain-decay query.

### Correction to yesterday's numbers

My first run today scoped the domain→city universe to providers *with a non-empty
`services` array*. That is wrong — a business "appears in another city" whether or not
that other record happens to carry service tags. Restricting the universe undercounts
multi-city and inflates single-city; it produced 118 qualifying combos in the 3-4 band
instead of 110. The manifest below uses the correct universe (**all** provider rows
with a `canonical_city`), which reproduces yesterday's 60/56/65/45 distribution exactly.

### Total

| Component | Pages |
|---|---:|
| `providers >= 5` | 285 |
| 3-4 band with `single_city >= 2` | 110 |
| **Total build list** | **395** |

Provider slots across the manifest: **4,380**. Single-city businesses: **2,406** (55%).
Distinct cities: **89**.

For contrast: a flat threshold of 3 would give 511 pages; a flat threshold of 5 gives
285. This rule sits between them at 395 and drops the 116 weakest pages — the ones with
0 or 1 genuinely local business.

### Band split

| Band | Pages |
|---|---:|
| 25+ | 34 |
| 10-24 | 84 |
| 5-9 | 167 |
| 3-4 (single_city ≥ 2 only) | 110 |

### Per service

| Service | Pages | Provider slots | Single-city slots | 3-4 | 5-9 | 10-24 | 25+ |
|---|---:|---:|---:|---:|---:|---:|---:|
| aba | 61 | 1,235 | 676 | 7 | 23 | 17 | 14 |
| physical-therapy | 61 | 854 | 492 | 11 | 25 | 17 | 8 |
| speech-therapy | 61 | 563 | 346 | 21 | 22 | 14 | 4 |
| occupational-therapy | 59 | 651 | 341 | 15 | 26 | 13 | 5 |
| life-skills | 33 | 321 | 138 | 8 | 17 | 6 | 2 |
| parent-coaching | 26 | 171 | 108 | 12 | 9 | 5 | 0 |
| group-therapy | 20 | 144 | 63 | 6 | 10 | 3 | 1 |
| virtual-therapy | 17 | 105 | 73 | 7 | 8 | 2 | 0 |
| ados-testing | 10 | 62 | 26 | 3 | 5 | 2 | 0 |
| support-groups | 10 | 50 | 37 | 6 | 3 | 1 | 0 |
| feeding-therapy | 9 | 79 | 36 | 2 | 4 | 3 | 0 |
| mobile-services | 9 | 52 | 24 | 3 | 5 | 1 | 0 |
| residential-program | 5 | 30 | 3 | 1 | 4 | 0 | 0 |
| animal-therapy | 3 | 12 | 4 | 2 | 1 | 0 | 0 |
| executive-function-coaching | 3 | 14 | 14 | 1 | 2 | 0 | 0 |
| music-therapy | 3 | 13 | 8 | 2 | 1 | 0 | 0 |
| respite-care | 3 | 17 | 12 | 1 | 2 | 0 | 0 |
| aac | 1 | 3 | 2 | 1 | 0 | 0 | 0 |
| tutoring | 1 | 4 | 3 | 1 | 0 | 0 | 0 |
| **Total** | **395** | **4,380** | **2,406** | **110** | **167** | **84** | **34** |

### Flags before generating URLs from this

- **`aac` (1 page) and `animal-therapy` (3 pages)** are not in the VALID SLUGS list in
  `CLAUDE.md`, which documents `pet-therapy`. Four pages hang on undocumented slugs.
- **`residential-program`** clears the threshold on 5 pages but has only **3
  single-city slots out of 30** — it is almost entirely chain branches. It passes the
  rule only because the `>= 5` arm does not test distinctness.
- **`virtual-therapy` (17 pages) and `mobile-services` (9 pages)** are service-area
  categories. A city page for a virtual provider is a weak geographic claim, and these
  are the same populations flagged in the coordinate-provenance work as having no real
  street location.
- **`aba` is the largest service here (1,235 slots) and the least trustworthy tag** —
  the FL-DD and legacy_migration blanket tagging is unresolved.

Columns in the CSV: `service, canonical_city, providers, single_city, multi_city,
no_website, band`. Sorted by service, then providers descending.

---

## 2. Medicaid page manifest

**Rule:** `'florida-medicaid' = ANY(insurances)`, `coalesce(source,'') <> 'FL-DD
Database'`, `providers >= 3`.

**35 cities qualify.**

| Metric | Value |
|---|---:|
| Qualifying cities | 35 |
| Provider slots, FL-DD excluded | 243 |
| Provider slots, all sources | 530 |
| FL-DD slots removed | 287 |
| Single-city businesses | 137 (56%) |
| Multi-city (chain branches) | 103 (42%) |
| No website | 3 |

Band split: 25+ → 1, 10-24 → 5, 5-9 → 15, 3-4 → 14.

### The delta, per city

The CSV carries `providers` (FL-DD excluded) alongside `providers_all_sources` and
`fldd_excluded` so the gap stays visible on every row. The widest gaps:

| City | Excl. FL-DD | All sources | FL-DD removed |
|---|---:|---:|---:|
| MIAMI | 19 | 64 | 45 |
| TAMPA | 18 | 56 | 38 |
| JACKSONVILLE | 17 | 55 | 38 |
| WEST PALM BEACH | 9 | 26 | 17 |
| MIRAMAR | 6 | 18 | 12 |
| ORLANDO | 28 | 40 | 12 |
| CLEARWATER | 10 | 20 | 10 |
| HIALEAH | 6 | 16 | 10 |
| LAUDERHILL | 3 | 11 | 8 |
| FORT MYERS | 15 | 23 | 8 |

Four cities in the manifest have **zero** FL-DD rows — BROOKSVILLE, CORAL GABLES,
PALM BEACH GARDENS, and (from the CSV) their counts are identical either way. Those
are the cleanest medicaid pages on the list.

**Not in the manifest but worth knowing:** 47 cities clear threshold 3 with FL-DD
included and fall below it once excluded; 19 of those drop to literally zero. Those 19
are listed in `pseo_city_page_inventory_2026-08-20.md` and include Pensacola, Sarasota,
and Bradenton.

**One page in the manifest is entirely chain branches:** STUART (4 providers, 0
single-city). NEW PORT RICHEY is the same at 3 providers.

---

## 3. Events table state

The column is `date` (there is no `start_date`). `end_date` exists and is used below to
avoid dropping multi-day events that are still running.

### Totals

| Metric | Value |
|---|---:|
| Total rows | **139** |
| Rows with a NULL date | 0 |
| Future by `date >= current_date` | **19** |
| Future by `coalesce(end_date, date) >= current_date` | **21** |
| Past | 118 |
| Earliest date | 2025-05-03 |
| Latest date | **2099-12-31** |

### Two data-quality problems visible in the totals

**Placeholder dates.** Four future rows carry `2099-12-31`, which is a sentinel, not a
date. They are 19% of the future inventory:

| id | Title | City |
|---:|---|---|
| 60 | Art on the Spectrum | Tampa |
| 61 | Free Autism Screenings | Babcock Ranch, Naples, Fort Myers area |
| 62 | Sensory in the Park | Orlando |
| 63 | Florida Racquet Sports Programs | Various cities |

Real future inventory is therefore **17**, not 21.

**Recurring events do not roll forward.** 12 rows have `is_recurring = true`, and
**all 12 are past-dated**. Nothing advances `date` on a recurrence, so every recurring
event has silently fallen out of the future set.

### Future-dated events by city

| City | Events | Coords | Address | Zip | Venue | Neither coords nor address |
|---|---:|---:|---:|---:|---:|---:|
| Fort Lauderdale | 6 | 6 | 6 | 0 | 6 | 0 |
| Davie | 2 | 2 | 2 | 0 | 2 | 0 |
| Orlando | 2 | 1 | 0 | 0 | 2 | 1 |
| Aventura | 1 | 1 | 1 | 0 | 1 | 0 |
| Babcock Ranch, Naples, Fort Myers area | 1 | 0 | 0 | 0 | 1 | 1 |
| Cape Coral | 1 | 1 | 1 | 1 | 1 | 0 |
| Destin | 1 | 0 | 0 | 0 | 1 | 1 |
| Flagler Beach | 1 | 0 | 1 | 0 | 1 | 0 |
| Fort Myers area | 1 | 0 | 0 | 0 | 1 | 1 |
| Kissimmee | 1 | 0 | 0 | 0 | 0 | 1 |
| Niceville | 1 | 0 | 0 | 0 | 1 | 1 |
| Ocoee | 1 | 0 | 0 | 0 | 0 | 1 |
| Tampa | 1 | 0 | 0 | 0 | 1 | 1 |
| Various cities | 1 | 0 | 0 | 0 | 1 | 1 |
| **Total** | **21** | **11** | **12** | **1** | **19** | **9** |

### Mappability

| State | Events | Share |
|---|---:|---:|
| Usable coordinates (lat and lng both present) | **11** | 52% |
| No coordinates but a geocodable street address | **1** | 5% |
| Neither — unmappable without new research | **9** | 43% |

Only one row (Flagler Beach) would be recovered by running a geocoder. The other nine
have no address to geocode; `venue_name` is present on 8 of them, so the recoverable
path is venue-name lookup, not address geocoding.

**`city` is free text, not a canonical value.** Three of the 14 distinct values are not
cities: `Babcock Ranch, Naples, Fort Myers area`, `Fort Myers area`, and
`Various cities`. Six Fort Lauderdale events are 29% of the entire future inventory.

### Bottom line for pSEO

The events table cannot support city-level event pages. Seventeen genuinely-dated
future events spread across 13 real city values, with 43% unmappable, is not enough for
a single page to be worth indexing — and the recurring-event bug means the table will
keep draining rather than filling.

---

## What this report does not decide

- Whether `aac` / `animal-therapy` are typos to merge or tags to document.
- Whether `virtual-therapy` and `mobile-services` belong on city pages at all.
- Whether the `2099-12-31` sentinel is intentional (an "ongoing" marker) or an import
  artifact.
- Whether the recurring-event roll-forward should be a scheduled job or a query-time
  computation.
