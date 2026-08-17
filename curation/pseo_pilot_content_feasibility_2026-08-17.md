# pSEO Pilot — Content Feasibility Analysis

**Date:** 2026-08-17
**Project:** Florida Autism Services Directory (floridaautismservices.com)
**Status:** Analysis only. No pages generated, no files written to the app, no DB changes.
**Verdict up front:** Do not freeze the current 20-page pilot spec. Only 1 of 4 planned
differentiation blocks survives contact with real fill rates. 9 of 20 proposed pages would
ship as city-name-swapped near-duplicates.

---

## Context for a reader with no prior session history

The site is a client-rendered React SPA over a Supabase/Postgres `resources` table
(~3,700 providers, `resource_type = 'provider'`). The pSEO initiative wants
service-plus-location landing pages, e.g. "ABA Therapy in Tampa".

Two constraints already established and assumed throughout this document:

- Group on `resources.canonical_city`, **never** the raw `city` column. `canonical_city` is a
  normalized column (286 -> 263 distinct values) maintained by a `BEFORE INSERT OR UPDATE`
  trigger. Statewide/virtual-only rows are deliberately NULL and excluded.
- Select pilot pages by **verified provider count**, not raw provider count.

Four services are excluded everywhere as single-provider noise: `autism-travel`,
`financial-planning`, `transportation`, `art-therapy`.

Source cohort file: `Research/pseo_pilot_cohort_ge10_2026-08-16.csv` (227 rows: 110 city-level,
117 county-level, every combo with >= 10 providers).

The recon document planned **four differentiation blocks** per page:

1. Insurance mix
2. Verified count
3. In-home versus telehealth mix
4. Nearby cities

Block 4 was already ruled out before this analysis: `cityCoordinates.json` exists (286 keys)
but **no code consumes it**. Grep across the repo finds references only in planning docs and
an archived generator script (`_archive/scripts/generate_city_coordinates.js`). The
nearby-city module is unbuilt, not merely unwired.

This document tests whether blocks 1-3 survive.

---

## Part 1 — City cohort re-ranked by verified count

Re-ranking by data quality rather than raw volume inverts the list hard.
`physical-therapy MIAMI` was #5 on raw count and falls to #13. `physical-therapy JACKSONVILLE`
(70 providers) falls from #8 to roughly #75 on 2 verified. Conversely `aba ST. PETERSBURG`
(20 raw, #43) rises to #14, and `aba BRANDON` (10 raw, bottom tier) rises to #28 at 90% verified.

Top 42 shown; everything below has <= 4 verified.

| # | service | city | providers | verified | verified % |
|---|---|---|---|---|---|
| 1 | aba | JACKSONVILLE | 91 | 64 | 70% |
| 2 | aba | MIAMI | 91 | 64 | 70% |
| 3 | aba | TAMPA | 99 | 59 | 60% |
| 4 | aba | TALLAHASSEE | 90 | 45 | 50% |
| 5 | aba | ORLANDO | 78 | 44 | 56% |
| 6 | aba | GAINESVILLE | 48 | 30 | 63% |
| 7 | aba | FORT MYERS | 49 | 29 | 59% |
| 8 | aba | WEST PALM BEACH | 41 | 29 | 71% |
| 9 | life-skills | TAMPA | 43 | 27 | 63% |
| 10 | aba | CLEARWATER | 36 | 25 | 69% |
| 11 | aba | LAKELAND | 71 | 23 | 32% |
| 12 | life-skills | MIAMI | 36 | 21 | 58% |
| 13 | **physical-therapy** | MIAMI | 86 | 18 | 21% |
| 14 | aba | ST. PETERSBURG | 20 | 18 | 90% |
| 15 | aba | FORT LAUDERDALE | 25 | 17 | 68% |
| 16 | aba | CAPE CORAL | 38 | 16 | 42% |
| 17 | aba | DAVIE | 20 | 15 | 75% |
| 18 | aba | HIALEAH | 28 | 15 | 54% |
| 19 | aba | HOLLYWOOD | 31 | 15 | 48% |
| 20 | aba | PORT ST. LUCIE | 37 | 15 | 41% |
| 21 | aba | MIRAMAR | 18 | 14 | 78% |
| 22 | aba | LARGO | 18 | 13 | 72% |
| 23 | aba | PEMBROKE PINES | 24 | 13 | 54% |
| 24 | aba | BOCA RATON | 17 | 11 | 65% |
| 25 | aba | SPRING HILL | 26 | 11 | 42% |
| 26 | life-skills | JACKSONVILLE | 19 | 11 | 58% |
| 27 | life-skills | ST. PETERSBURG | 12 | 11 | 92% |
| 28 | aba | BRANDON | 10 | 9 | 90% |
| 29 | aba | MIAMI LAKES | 22 | 9 | 41% |
| 30 | ados-testing | ORLANDO | 12 | 8 | 67% |
| 31 | aba | DAYTONA BEACH | 17 | 8 | 47% |
| 32 | aba | WINTER PARK | 16 | 8 | 50% |
| 33 | life-skills | FORT LAUDERDALE | 12 | 8 | 67% |
| 34 | life-skills | FORT MYERS | 16 | 8 | 50% |
| 35 | life-skills | WEST PALM BEACH | 18 | 8 | 44% |
| 36 | aba | NORTH MIAMI BEACH | 13 | 7 | 54% |
| 37 | aba | PALM BAY | 22 | 7 | 32% |
| 38 | parent-coaching | ORLANDO | 15 | 7 | 47% |
| 39 | group-therapy | ORLANDO | 12 | 6 | 50% |
| 40 | aba | CORAL SPRINGS | 10 | 5 | 50% |
| 41 | aba | MELBOURNE | 13 | 5 | 38% |
| 42 | ados-testing | TAMPA | 12 | 5 | 42% |

---

## Part 2 — The proposed 20-page pilot

Selection floor: **>= 10 verified providers**, with one deliberate exception
(`ados-testing ORLANDO` at 8). Only 26 city-level combos in the entire cohort clear 10
verified: 22 `aba` and 4 `life-skills`.

| # | service | city | verified | verified % |
|---|---|---|---|---|
| 1 | aba | Jacksonville | 64 | 70% |
| 2 | aba | Miami | 64 | 70% |
| 3 | aba | Tampa | 59 | 60% |
| 4 | aba | Tallahassee | 45 | 50% |
| 5 | aba | Orlando | 44 | 56% |
| 6 | aba | Gainesville | 30 | 63% |
| 7 | aba | Fort Myers | 29 | 59% |
| 8 | aba | West Palm Beach | 29 | 71% |
| 9 | aba | Clearwater | 25 | 69% |
| 10 | aba | Lakeland | 23 | 32% |
| 11 | aba | St. Petersburg | 18 | 90% |
| 12 | aba | Fort Lauderdale | 17 | 68% |
| 13 | aba | Cape Coral | 16 | 42% |
| 14 | aba | Davie | 15 | 75% |
| 15 | aba | Miramar | 14 | 78% |
| 16 | life-skills | Tampa | 27 | 63% |
| 17 | life-skills | Miami | 21 | 58% |
| 18 | life-skills | Jacksonville | 11 | 58% |
| 19 | life-skills | St. Petersburg | 11 | 92% |
| 20 | ados-testing | Orlando | 8 | 67% |

### Why no physical-therapy, occupational-therapy or speech-therapy

Those three services sit at roughly 6% verified across the whole cohort.
`physical-therapy MIAMI` is the only combo that argues for inclusion — 18 verified is more
than 10 of the picks above. It was still excluded: 21% verified means a parent landing there
sees roughly four unverified listings for every verified one. A queued 201-record services
backfill also lands mostly on PT/OT/ST, so any page built now rests on a number about to
change. Revisit as page 21 after that backfill.

### Service mix versus city coverage tradeoff

The data supports two services at credible depth, not five. The chosen split is 15 `aba` +
4 `life-skills` + 1 `ados-testing`. The alternative — padding with 5-verified combos to
manufacture variety — trades credibility for cosmetic breadth, which is the wrong trade for
a pilot whose purpose is to answer "does this format rank at all". Thin pages answer that
question wrong and cannot be un-indexed cheaply.

The templating risk lives in the **copy**, not the service count. Fifteen ABA pages
differentiated only by a swapped city name read as generated regardless of how many services
sit beside them.

City coverage: 15 distinct cities. Pages 16-20 deliberately double up on Tampa, Miami,
Jacksonville, St. Petersburg and Orlando rather than reaching into new cities, which buys a
read on whether two service pages in one city cannibalize each other before scaling to ~700.
To maximize distinct-city coverage instead, swap #18/#19 for `aba Hialeah` (15) and
`aba Hollywood` (15), accepting a 17/2/1 split.

### cityCoordinates.json check

All 20 proposed cities have coordinate entries. Three problems block the nearby-city module
regardless:

1. **Nothing consumes the file** (see Context above).
2. **Key format is inconsistent** across the 286 keys — `TAMPA` and `MIAMI` are upper-case;
   `Tallahassee`, `Orlando`, `Davie`, `Palm Bay` are title-case. Any lookup must normalize.
3. **`ST. PETERSBURG` fails exact match.** The JSON key is `ST PETERSBURG` (no period);
   `canonical_city` is `ST. PETERSBURG` (with one). This breaks proposed pages #11 and #19.
   `Port St. Lucie` has the same shape mismatch and is in the cohort at raw #20.

---

## Part 3 — Measured fill rates (the feasibility test)

Measured across **all** providers in each combo (not just verified ones), via
`resource_type = 'provider' AND canonical_city = <city> AND <service> = ANY(services)`.

| service | city | n | ver | insurances | description | median len | website | phone | lat/lng | mobile | virtual |
|---|---|---|---|---|---|---|---|---|---|---|---|
| aba | JACKSONVILLE | 91 | 64 | 48 (53%) | 1 (1%) | 146 | 48 (53%) | 91 | 89 | 1 | 3 |
| aba | MIAMI | 91 | 64 | 50 (55%) | 1 (1%) | 146 | 43 (47%) | 91 | 88 | 2 | 5 |
| aba | TAMPA | 99 | 59 | 53 (54%) | 5 (5%) | 219 | 60 (61%) | 98 | 95 | 7 | 6 |
| aba | TALLAHASSEE | 90 | 45 | **10 (11%)** | 3 (3%) | 193 | 71 (79%) | 90 | 89 | 1 | 3 |
| aba | ORLANDO | 78 | 44 | 26 (33%) | 3 (4%) | 165 | 62 (79%) | 78 | 78 | 3 | 4 |
| aba | GAINESVILLE | 48 | 30 | **10 (21%)** | 1 (2%) | 146 | 36 (75%) | 48 | 48 | 1 | 2 |
| aba | FORT MYERS | 49 | 29 | 14 (29%) | 2 (4%) | 272 | 37 (76%) | 49 | 49 | 2 | 1 |
| aba | WEST PALM BEACH | 41 | 29 | 18 (44%) | **0** | — | 30 (73%) | 41 | 41 | 2 | **0** |
| life-skills | TAMPA | 43 | 27 | 29 (67%) | 3 (7%) | 203 | 18 (42%) | 42 | 41 | 1 | 3 |
| aba | CLEARWATER | 36 | 25 | 18 (50%) | 1 (3%) | 245 | 21 (58%) | 36 | 35 | 3 | **0** |
| aba | LAKELAND | 71 | 23 | **7 (10%)** | **0** | — | 57 (80%) | 71 | 71 | **0** | 2 |
| life-skills | MIAMI | 36 | 21 | 21 (58%) | 1 (3%) | 177 | 17 (47%) | 36 | 33 | **0** | 6 |
| aba | ST. PETERSBURG | 20 | 18 | 20 (100%) | **0** | — | **2 (10%)** | 20 | 20 | 1 | **0** |
| aba | FORT LAUDERDALE | 25 | 17 | 11 (44%) | **0** | — | 17 (68%) | 25 | 25 | 1 | 3 |
| aba | CAPE CORAL | 38 | 16 | **8 (21%)** | **0** | — | 26 (68%) | 38 | 37 | **0** | **0** |
| aba | DAVIE | 20 | 15 | **5 (25%)** | **0** | — | 17 (85%) | 20 | 20 | **0** | 1 |
| aba | MIRAMAR | 18 | 14 | 11 (61%) | 2 (11%) | 244 | 9 (50%) | 18 | 18 | 2 | 2 |
| life-skills | JACKSONVILLE | 19 | 11 | 13 (68%) | **0** | — | 8 (42%) | 19 | 19 | **0** | **0** |
| life-skills | ST. PETERSBURG | 12 | 11 | 11 (92%) | 2 (17%) | 250 | **2 (17%)** | 12 | 12 | **0** | **0** |
| ados-testing | ORLANDO | 12 | 8 | 8 (67%) | **0** | — | 12 (100%) | 12 | 12 | 1 | 5 |

**The headline finding: `description` is effectively an empty column.** 0-5 rows populated per
combo. Eight of twenty combos have zero. Where it exists, median length is 146-272 characters.

`phone` (98-100%) and `lat/lng` (92-100%) are near-perfect, so the map and call-to-action work
on every page — but neither generates a *unique* sentence, because every page has them.

### Insurance mix detail

| service | city | distinct slugs | top 3 by frequency |
|---|---|---|---|
| aba | TAMPA | 13 | florida-medicaid:47, aetna:13, unitedhealthcare:12 |
| aba | ORLANDO | 12 | florida-medicaid:21, aetna:10, florida-blue:10 |
| aba | MIAMI | 11 | florida-medicaid:47, florida-blue:6, aetna:5 |
| aba | WEST PALM BEACH | 11 | florida-medicaid:17, aetna:4, cigna:4 |
| aba | FORT LAUDERDALE | 10 | florida-medicaid:7, aetna:4, cigna:4 |
| ados-testing | ORLANDO | 10 | **aetna:7, cigna:7, florida-blue:7** |
| aba | JACKSONVILLE | 9 | florida-medicaid:43, **tricare:8**, florida-blue:7 |
| aba | CLEARWATER | 9 | florida-medicaid:16, aetna:3, cigna:3 |
| aba | FORT MYERS | 9 | florida-medicaid:12, aetna:7, **tricare:6** |
| aba | GAINESVILLE | 9 | florida-medicaid:8, florida-blue:5, unitedhealthcare:5 |
| aba | MIRAMAR | 9 | florida-medicaid:11, aetna:2, cigna:2 |
| aba | TALLAHASSEE | 9 | florida-medicaid:8, aetna:3, florida-blue:3 |
| aba | CAPE CORAL | 8 | florida-medicaid:8, florida-blue:2, humana:2 |
| aba | DAVIE | 8 | florida-medicaid:4, aetna:2, cigna:2 |
| aba | LAKELAND | 8 | florida-medicaid:6, tricare:3, unitedhealthcare:3 |
| aba | ST. PETERSBURG | 8 | florida-medicaid:19, aetna:1, cigna:1 |
| life-skills | JACKSONVILLE | 4 | florida-medicaid:13, aetna:1, cigna:1 |
| life-skills | MIAMI | 3 | florida-medicaid:21, aetna:1, medicare:1 |
| life-skills | TAMPA | 3 | florida-medicaid:27, `accepts-most-insurances`:1, medicare:1 |
| life-skills | ST. PETERSBURG | **1** | florida-medicaid:11 |

`florida-medicaid` ranks #1 in 18 of 20 combos. The #2 and #3 slots are usually aetna/cigna
tied at 2-4. The *counts* differ per page; the *slug set* barely does.

---

## Part 4 — Usable data-derived sentences per page

Scoring criteria applied:

- **Verified sentence** requires `verified >= 8`.
- **Insurance sentence** requires >= 40% insurance coverage **and** >= 3 distinct slugs with
  non-trivial spread.
- **In-home/telehealth sentence** requires `mobile + virtual >= 5`.
- **Payer standout** counts as a separate sentence where a non-medicaid payer reaches >= 5 and
  reflects a real local fact.

| service | city | verified | insurance | telehealth | payer standout | total |
|---|---|---|---|---|---|---|
| aba | TAMPA | yes | yes | marginal (13%) | yes — aetna 13 / uhc 12 | **4** |
| ados-testing | ORLANDO | yes | yes — commercial-first | yes — 42% virtual | — | **3** |
| aba | JACKSONVILLE | yes | yes | no | yes — tricare 8 | **3** |
| aba | MIAMI | yes | yes | marginal (8%) | — | **2** |
| aba | WEST PALM BEACH | yes | yes | no | — | **2** |
| aba | CLEARWATER | yes | yes | no | — | **2** |
| aba | FORT LAUDERDALE | yes | yes | no | — | **2** |
| aba | MIRAMAR | yes | yes | no | — | **2** |
| aba | ST. PETERSBURG | yes — 90% | yes — 100% coverage | no | — | **2** |
| aba | ORLANDO | yes | marginal (33%) | no | yes — aetna/fl-blue 10 | **2** |
| aba | FORT MYERS | yes | marginal (29%) | no | yes — tricare 6 | **2** |
| life-skills | TAMPA | yes | duplicate* | no | — | **2** |
| life-skills | MIAMI | yes | duplicate* | marginal (17%) | — | **2** |
| life-skills | JACKSONVILLE | yes | duplicate* | no | — | **2** |
| aba | TALLAHASSEE | yes | **no — 11%** | no | — | **1 (FLAG)** |
| aba | GAINESVILLE | yes | **no — 21%** | no | — | **1 (FLAG)** |
| aba | LAKELAND | yes | **no — 10%** | no | — | **1 (FLAG)** |
| aba | CAPE CORAL | yes | **no — 21%** | no | — | **1 (FLAG)** |
| aba | DAVIE | yes | **no — 25%** | no | — | **1 (FLAG)** |
| life-skills | ST. PETERSBURG | yes — 92% | **no — 1 slug** | no | — | **1 (FLAG)** |

\* The three `life-skills` pages that clear the insurance bar do so with the *same* sentence —
"nearly all accept Florida Medicaid" (27/29, 21/21, 13/13). Writable, but identical across
pages, so it differentiates nothing.

**Six combos flagged below two usable sentences.** Adding the three duplicate-insurance
`life-skills` pages gives **9 of 20** that would ship as city-name-swapped templates.

---

## Part 5 — Do the planned blocks survive?

**Verified count — SURVIVES.** The only universally reliable block. Range runs 32% (Lakeland)
to 92% (life-skills St. Petersburg), so the numbers genuinely vary per page. Caveat: Lakeland
at 32% is a *negative* differentiator; that page advertises its own weakness.

**Insurance mix — SURVIVES in 11 of 20, degraded.** Coverage is the binding problem, not slug
variety. Five combos hold insurance data on <= 25% of providers, so "the mix" would be
extrapolated from 5-10 rows out of 20-90. Where writable it still reads templated, because
medicaid leads 18 of 20 lists. Two genuine exceptions worth exploiting as real local facts:

- `ados-testing ORLANDO` is the only commercial-first combo — no medicaid in its top 3.
- `aba JACKSONVILLE` (tricare:8) and `aba FORT MYERS` (tricare:6) reflect real military
  populations — NAS Jacksonville and Lee County.

**In-home versus telehealth — DOES NOT SURVIVE.** Only `ados-testing ORLANDO` (5 of 12
virtual, 42%) supports a real sentence. Everything else is 0-7 rows out of 18-99. Six combos
hold a hard zero on one or both counts; `aba CAPE CORAL` is zero on both.

**Nearby cities — OUT** (module unbuilt; see Context).

Net: **one reliable block and one partial**, against four planned. Not enough to avoid
near-duplicate pages. The root cause is `description` being empty — it is the only field that
could carry prose rather than counts, and it is populated on 0-5% of rows.

---

## Part 6 — Incidental data-quality findings

- **`accepts-most-insurances` is not a valid insurance slug.** It appears once, in
  `life-skills TAMPA`. The project's insurance vocabulary has 11 slugs: `florida-medicaid`,
  `medicare`, `aetna`, `cigna`, `florida-blue`, `humana`, `unitedhealthcare`, `tricare`,
  `sunshine-health`, `early-steps`, `childrens-medical-services`.
- **`aba ST. PETERSBURG` has 2 websites out of 20**, and `life-skills ST. PETERSBURG` 2 of 12.
  These are the two highest verified-rate pages in the pilot (90% and 92%), yet 18 of 20
  listings would render with no link out. High verification combined with no website looks
  like a curation artifact and should be understood before either becomes a landing page.

---

## Recommendation

Do not freeze the current spec. Two viable paths:

1. **Cut the pilot to the four combos that clear three sentences** — `aba Tampa`,
   `aba Jacksonville`, `ados-testing Orlando`, `aba Miami` — and hand-write them. Smallest
   commitment, still answers whether the format ranks.
2. **Spend the curation effort on `description` for the ~250 verified providers in the top
   five combos first.** That single field unblocks every page at once. No amount of
   re-ranking substitutes for it.

A third option worth considering: add a differentiation block that is not provider-derived —
county-level scholarship eligibility (FES-UA, FES-EO, FTC, PEP) varies by county, is factual,
and does not depend on per-provider fill rates.
