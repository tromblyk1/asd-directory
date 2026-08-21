# pSEO city-page inventory — read-only analysis

**Date:** 2026-08-20
**Status:** Report only. SELECT-only, no schema changes, no file edits.
**Scope:** `resources` where `resource_type = 'provider'`.

Companion CSVs:
- `pseo_city_page_inventory_2026-08-20_band3_4.csv` — all 226 combos in the 3-4 band, per-combo distinctness
- `pseo_city_page_inventory_2026-08-20_medicaid.csv` — per-city medicaid counts, 81 cities

---

## Headline

**511 pages at threshold 3, 285 at threshold 5.** The 226 pages that exist only
because the threshold is 3 are the weakest inventory on the site: **60 of them contain
zero single-city businesses**, and **116 of 226 (51%) contain at most one**. They are
mostly branch offices of clinics already listed on a nearby metro page.

Separately: **every one of the 579 FL-DD import rows is tagged `florida-medicaid`** —
a blanket tag, same defect as the FL-DD `aba` tagging. Medicaid city pages go from
82 to 35 at threshold 3 once those rows are excluded, and **19 cities drop to zero**.

---

## 1. Page inventory

Pairs are `unnest(services)` × `canonical_city`, providers only, non-null city,
non-empty `services`.

| Band | Combos |
|---|---:|
| 3-4 | 226 |
| 5-9 | 167 |
| 10-24 | 84 |
| 25+ | 34 |
| **≥3 — pages at threshold 3** | **511** |
| **≥5 — pages at threshold 5** | **285** |
| ≤2 (below any threshold) | 1,101 |
| Total distinct combos | 1,612 |

Dropping the threshold from 5 to 3 adds **226 pages (+79%)**. Section 2 is about
whether those 226 are worth having.

### Per service

| Service slug | Pages ≥3 | Pages ≥5 | In 3-4 band | Provider slots ≥3 |
|---|---:|---:|---:|---:|
| aba | 89 | 54 | 35 | 1,329 |
| speech-therapy | 72 | 40 | 32 | 600 |
| occupational-therapy | 71 | 44 | 27 | 689 |
| physical-therapy | 70 | 50 | 20 | 883 |
| life-skills | 47 | 25 | 22 | 369 |
| parent-coaching | 32 | 14 | 18 | 190 |
| group-therapy | 27 | 14 | 13 | 166 |
| mobile-services | 18 | 6 | 12 | 80 |
| virtual-therapy | 18 | 10 | 8 | 109 |
| ados-testing | 14 | 7 | 7 | 76 |
| feeding-therapy | 12 | 7 | 5 | 89 |
| residential-program | 12 | 4 | 8 | 52 |
| support-groups | 10 | 4 | 6 | 50 |
| animal-therapy | 6 | 1 | 5 | 21 |
| music-therapy | 3 | 1 | 2 | 13 |
| executive-function-coaching | 3 | 2 | 1 | 14 |
| respite-care | 3 | 2 | 1 | 17 |
| tutoring | 2 | 0 | 2 | 7 |
| aac | 2 | 0 | 2 | 7 |

**Slug drift.** `animal-therapy` (6 pages) and `aac` (2 pages) are not in the
VALID SLUGS list in `CLAUDE.md`, which documents `pet-therapy` instead. Decide whether
these are typos to merge or real tags to document before generating URLs from them.

**`aba` caveat.** The 1,329 `aba` provider slots inherit the known FL-DD/legacy blanket
tagging problem (see `project_services_tags_unreliable`). The largest service in this
inventory is also the least trustworthy one.

---

## 2. Small-city distinctness — the 3-4 band

226 combos, **764 provider slots**. Domain derivation and the bare-shared-host
exclusion list are identical to the domain-decay query.

### Provider slots

| Classification | Slots | Share |
|---|---:|---:|
| Single-city business (appears in no other `canonical_city`) | 330 | 43.2% |
| Multi-city (chain branch — same domain in another city) | 283 | 37.0% |
| No website at all | 149 | 19.5% |
| Bare shared host (excluded from domain matching) | 2 | 0.3% |

### Per-combo composition

| Single-city businesses on the page | Combos |
|---|---:|
| 0 | **60** |
| 1 | 56 |
| 2 | 65 |
| 3+ | 45 |

- **116 of 226 (51%)** have at most one genuinely local business.
- **23 combos are entirely chain branches** — every provider on the page is a
  branch of a clinic already listed elsewhere.
- **20 combos are entirely websiteless** — no domain to distinguish anything.
- Average single-city businesses per combo: **1.46**.

### Answer to the question asked

> *do 3-provider pages hold businesses that appear nowhere else, or are they mostly
> branches of clinics already listed on a nearby metro page*

**Mostly branches.** 37% of slots are literal chain branches and another 19.5% carry
no website at all. Only 43% are businesses that appear in exactly one city, and they
are concentrated — 45 combos hold three or more of them while 60 hold none.

The threshold-3 tier is not uniformly weak; it is bimodal. A threshold alone will not
separate the good pages from the bad ones. A **minimum single-city count** would:
requiring ≥2 single-city businesses drops the 3-4 band from 226 combos to 110.

Full per-combo detail (sorted by `single_city` ascending, then `providers` descending,
so the worst pages are at the top) is in
`pseo_city_page_inventory_2026-08-20_band3_4.csv`, columns
`service, canonical_city, providers, single_city, multi_city, no_website`.

---

## 3. Insurance page feasibility

### FL-DD source value

Determined from `resources.source`: **`'FL-DD Database'`, 579 provider rows.**
Other source values: Google Places (PT/OT/ST) 1,231; legacy_migration 1,114;
NULL 117; PATH International 45; and a long tail.

> **Defect found and corrected mid-analysis.** The first pass split the buckets on
> `source = 'FL-DD Database'`, which evaluates to NULL for the 117 NULL-source rows —
> so those rows fell out of *both* the FL-DD and the non-FL-DD FILTER. The numbers
> below use `coalesce(source,'') = 'FL-DD Database'`. The uncorrected run reported
> 34 cities at ≥3 and 17 at ≥5; the correct figures are 35 and 21.

### Counts

| Metric | Value |
|---|---:|
| Providers tagged `florida-medicaid` | 893 |
| …from the FL-DD import | **579 — every single FL-DD row** |
| …from all other sources | 314 |
| Providers tagged `accepts-most-insurances` | 76 |
| …from the FL-DD import | **0** |

### Cities clearing threshold

| Tag | Threshold | With FL-DD | Without FL-DD |
|---|---:|---:|---:|
| `florida-medicaid` | ≥3 | **82** | **35** |
| `florida-medicaid` | ≥5 | 45 | 21 |
| `accepts-most-insurances` | ≥3 | 7 | 7 |

**47 cities fall below 3 when FL-DD is excluded.** Nineteen of them drop to *zero*
non-FL-DD medicaid providers:

RIVERVIEW, LEESBURG, PENSACOLA, RUSKIN, SEMINOLE, LAND O LAKES, OCOEE, SARASOTA,
TEMPLE TERRACE, APOPKA, BOYNTON BEACH, BRADENTON, COOPER CITY, CUTLER BAY, DUNEDIN,
LOXAHATCHEE, PANAMA CITY, PLANT CITY, WINTER HAVEN.

For those 19, a "Medicaid providers in Pensacola" page would be built entirely on a
blanket import tag with no independently sourced row behind it.

Per-city detail in `pseo_city_page_inventory_2026-08-20_medicaid.csv`, columns
`canonical_city, medicaid_all, medicaid_fldd, medicaid_excl_fldd,
clears_3_with_fldd, clears_3_without_fldd` (81 cities).

### Slug drift in `insurances`

Five values present in the array are undocumented in `CLAUDE.md`:
`accepts-most-insurances` (76 rows), `avmed` (21), `oscar` (12), `allegiance` (3),
`evernorth` (2). `accepts-most-insurances` is also semantically different from the
others — it is a claim about coverage breadth, not a named payer, and it has no
detail page under `data/resources/insurances/`.

---

## What this report does not decide

- Whether to build at threshold 3 or 5, or to gate on single-city count instead.
- Whether `animal-therapy` / `aac` are typos or real tags.
- Whether FL-DD's blanket `florida-medicaid` tag should be re-verified, narrowed, or
  simply excluded from pSEO page eligibility.
