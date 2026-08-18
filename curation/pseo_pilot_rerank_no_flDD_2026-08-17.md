# pSEO Pilot Cohort — Re-ranked Excluding FL-DD Rows

**Date:** 2026-08-17
**Repo:** `C:\Projects\ASD-Directory`
**Supersedes the ranking in:** `curation/pseo_pilot_content_feasibility_2026-08-17.md`
**Depends on:** `curation/verified_flag_audit_2026-08-17.md`

---

## Why this re-rank exists

The prior pilot ranking was built on `resources.verified`. The audit
(`verified_flag_audit_2026-08-17.md`) established that `verified` was set **per
import source, not per record**:

- `FL-DD Database` (587 rows) — 82.5% verified, **2.7% have a website**
- `Google Places (PT/OT/ST)` (1,344 rows) — **1.8% verified, 100% have a website**
- `legacy_migration` (1,154 rows) — 39% verified, 88% have a website

So verified count ranked the *worst* combos highest. This document re-ranks on
two signals that mean what they say:

1. **Non-FL-DD provider count** — FL-DD is a Medicaid waiver registry covering
   all DD service types, and 504 of its 587 rows (86%) were blanket-tagged `aba`.
   Its rows are not reliably the service they claim to be.
2. **Website-present rate** — a provider with no website cannot be linked, cannot
   be sanity-checked, and gives a parent nothing to click.

`verified` is not used anywhere below.

---

## Part 1 — Ranked cohort, floor of 10 non-FL-DD providers

**Cohort size at this floor:** 99 combos with ≥10 clean providers, 61 with ≥15,
39 with ≥20, spanning 11 distinct services.

| Service | City | Total | Clean (non-FL-DD) | Website | Web % | Source notes |
|---|---|---:|---:|---:|---:|---|
| aba | TALLAHASSEE | 90 | **85** | 76 | 84% | 5 FL-DD, 82 legacy_migration |
| physical-therapy | MIAMI | 86 | **69** | 69 | 100% | 17 FL-DD, 62 Google Places |
| physical-therapy | JACKSONVILLE | 70 | **69** | 69 | 100% | almost entirely Google Places |
| aba | LAKELAND | 71 | **68** | 57 | 84% | 68 legacy_migration |
| aba | ORLANDO | 78 | **68** | 62 | 91% | 57 legacy_migration |
| aba | TAMPA | 99 | **64** | 60 | 94% | **35 FL-DD dropped** |
| physical-therapy | TAMPA | 65 | **63** | 63 | 100% | Google Places |
| occupational-therapy | JACKSONVILLE | 56 | **56** | 56 | 100% | Google Places |
| occupational-therapy | MIAMI | 56 | **56** | 56 | 100% | Google Places |
| aba | JACKSONVILLE | 91 | **54** | 48 | 89% | **37 FL-DD dropped** |
| occupational-therapy | TAMPA | 51 | **51** | 51 | 100% | Google Places |
| aba | MIAMI | 91 | **49** | 43 | 88% | **42 FL-DD dropped** |
| aba | FORT MYERS | 49 | **45** | 37 | 82% | legacy_migration |
| aba | GAINESVILLE | 48 | **44** | 36 | 82% | legacy_migration |
| aba | PORT ST. LUCIE | 37 | **35** | 27 | 77% | below web threshold |
| aba | CAPE CORAL | 38 | **33** | 26 | 79% | borderline |
| aba | WEST PALM BEACH | 41 | **30** | 30 | 100% | 11 FL-DD dropped |
| aba | HOLLYWOOD | 31 | **27** | 27 | 100% | |
| aba | CLEARWATER | 36 | **24** | 21 | 88% | 12 FL-DD dropped |
| aba | SPRING HILL | 26 | **23** | 15 | 65% | below web threshold |
| group-therapy | TAMPA | 23 | **23** | 23 | 100% | |
| aba | HIALEAH | 28 | **20** | 17 | 85% | |
| aba | MIAMI LAKES | 22 | **20** | 18 | 90% | |
| life-skills | TAMPA | 43 | **18** | — | — | 25 FL-DD dropped |
| feeding-therapy | TAMPA | 18 | **18** | 18 | 100% | |
| parent-coaching | TAMPA | 17 | **17** | — | — | |
| life-skills | MIAMI | 36 | **16** | — | — | 20 FL-DD dropped |
| parent-coaching | ORLANDO | 15 | **15** | — | — | |
| virtual-therapy | TAMPA | 15 | **15** | — | — | |

### The ranking inverted

Combos that were top-ranked on verified count and are now gone or demoted:

- **`aba ST. PETERSBURG`** — was 20 providers / 18 verified / 90%, the single
  highest verified rate in the cohort. **3 clean providers. It exits entirely.**
  17 of 20 were FL-DD, and the audit spot-check found a recycling nonprofit, an
  arts centre, assisted living and several group homes among them.
- **`life-skills JACKSONVILLE`** and **`life-skills ST. PETERSBURG`** — both
  vanish. 11 of 11 clean-eligible rows in each were FL-DD.
- **`aba TAMPA`** loses 35 rows, **`aba JACKSONVILLE`** 37, **`aba MIAMI`** 42 —
  all three drop several places.
- **`aba TALLAHASSEE`** — was mid-pack at 50% verified. **Now #1 at 85 clean
  providers and 84% website coverage.** It was penalised for being sourced from
  the one import that wasn't blanket-labeled.
- **`aba LAKELAND`** — was #7 by raw count with a weak 32% verified rate. Now #4
  with 68 clean providers, zero FL-DD contamination.

---

## Part 2 — PT/OT/ST reconsidered

**Verdict: still out of the pilot, but for a completely different reason.**

They were originally cut for a ~6% verified rate. That reason was wrong — the
audit showed the `Google Places (PT/OT/ST)` import simply was never labeled. On
the two signals that matter they look *excellent*: 100% website coverage, zero
FL-DD contamination, and four PT/OT combos rank in the top 11 above.

The problem is what the scrape actually captured. Of the 1,344 rows:

| Signal | Count | % |
|---|---:|---:|
| Name matches sports / ortho / spine / rehab / pain / injury / wellness | 570 | **42%** |
| Name matches pediatric / children / kids / behavior / developmental | 243 | 18% |
| Mentions autism anywhere | **14** | **1%** |
| Has a description | 5 | 0.4% |
| Also tagged `aba` | 93 | 7% |
| Has a Google rating | 1,289 | 96% |

This is the mirror image of the FL-DD problem. FL-DD over-tagged a Medicaid
registry as autism services; the Places scrape pulled an **adjacent market** —
adult orthopedic and sports physical therapy. A parent landing on "Physical
Therapy in Miami" and finding 69 adult sports-injury clinics is a worse outcome
than a thin page.

**The fix is curation, not generation.** The 243-row pediatric/developmental
shortlist is a tractable manual review. Until someone works that list, PT/OT/ST
should not generate pages. Revisit after review, not before.

---

## Part 3 — A fourth content block that does survive: Google ratings

The feasibility report found three of four planned differentiation blocks dead
(`description` is effectively an empty column; mobile/virtual co-tagging too
sparse; nearby-cities has no consumer). Ratings coverage is a block nobody
planned for, and it does not depend on `verified`:

| Source | Rows | Has rating | ≥10 reviews | Avg rating |
|---|---:|---:|---:|---:|
| Google Places (PT/OT/ST) | 1,344 | 96% | 1,096 | 4.77 |
| legacy_migration | 1,154 | 88% | 529 | 4.57 |
| FL-DD Database | 587 | 71% | 215 | 4.37 |

`legacy_migration` at 88% coverage means nearly every page in the revised pilot
can carry a genuine, per-city-varying sentence — average rating across N rated
providers, count above 4.5, count with 50+ reviews. That is real data-derived
copy that differs city to city.

---

## Part 4 — Revised pilot: 13 combos

Selection rules applied: **≥20 clean providers**, **≥80% website coverage**,
service is autism-plausible, no PT/OT/ST.

| # | Service | City | Clean | Web % |
|---:|---|---|---:|---:|
| 1 | aba | TALLAHASSEE | 85 | 84% |
| 2 | aba | LAKELAND | 68 | 84% |
| 3 | aba | ORLANDO | 68 | 91% |
| 4 | aba | TAMPA | 64 | 94% |
| 5 | aba | JACKSONVILLE | 54 | 89% |
| 6 | aba | MIAMI | 49 | 88% |
| 7 | aba | FORT MYERS | 45 | 82% |
| 8 | aba | GAINESVILLE | 44 | 82% |
| 9 | aba | CAPE CORAL | 33 | 79% |
| 10 | aba | WEST PALM BEACH | 30 | 100% |
| 11 | aba | HOLLYWOOD | 27 | 100% |
| 12 | aba | CLEARWATER | 24 | 88% |
| 13 | group-therapy | TAMPA | 23 | 100% |

**Excluded on the website threshold:**

- `aba PORT ST. LUCIE` — 35 clean but 77% website
- `aba SPRING HILL` — 23 clean but 65% website

**Available if you want to reach 20, all sub-20 clean:**

`life-skills TAMPA` 18 · `feeding-therapy TAMPA` 18 · `parent-coaching TAMPA` 17
· `life-skills MIAMI` 16 · `parent-coaching ORLANDO` 15 · `virtual-therapy
TAMPA` 15

Note that **six of those six additions are Tampa or Orlando.** Padding to 20
means stacking one metro, which is worse for the templated-set problem than
shipping 13.

### The service-mix tradeoff, stated plainly

12 of 13 are `aba`. That is not a choice — it is the only service with clean
depth in more than three cities. The alternative is padding with sub-20 combos
concentrated in Tampa. I'd take the city spread over the service spread here:
different cities give genuinely different provider lists, insurance mixes and
rating profiles, whereas six Tampa pages across six services share much of the
same provider pool.

---

## Part 5 — Is 20 pages defensible? No. The honest number is 8–12.

**On volume, 20 is now supportable for the first time** — 99 combos clear 10
clean providers and 39 clear 20. That was not true when the ranking was built on
`verified`.

Two reasons to still ship fewer:

1. **The content problem is unchanged.** The feasibility report's core finding
   survives this re-rank: `description` is ~empty across every combo, so pages
   are built from provider lists plus 2–3 derived sentences. More pages does not
   mean more unique content, it means more near-duplicates. The ratings block
   helps but does not fix this.

2. **`legacy_migration` now carries the entire pilot and has never been audited.**
   82 of 85 Tallahassee, 68 of 68 Lakeland, 57 of 68 Orlando. This is the same
   structural risk that just invalidated `verified` — a single unaudited import
   determining which pages get built. It *looks* healthy (88% website, 88%
   rating coverage), but "looks healthy" is precisely how `verified` looked
   before the audit.

**Recommendation:** ship pages 1–8, confirm the tagging holds by spot-checking
`legacy_migration` rows in those cities the way FL-DD was spot-checked, then
extend. If `legacy_migration` turns out to have its own tagging artifact, you
will have 8 pages to fix instead of 20.

---

## Suggested next step

Spot-check 20 `legacy_migration` rows tagged `aba` in Tallahassee and Lakeland
against their live websites — the same method that exposed FL-DD. That single
check either clears the pilot or saves the whole build.
