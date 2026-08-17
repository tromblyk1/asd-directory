# Audit: what `verified = true` actually means on `resources`

**Date:** 2026-08-17
**Project:** Florida Autism Services Directory (floridaautismservices.com)
**Status:** Audit only. No DB changes, no application files modified.

> **Headline finding:** `verified` is **inherited from the import source**, not a per-record
> confirmation. It marks whether a row arrived from a credentialing/registry list rather than a
> Google Places scrape. Nobody web-checked these providers one by one.
>
> **Consequence:** the pSEO pilot selection, which ranks pages entirely on verified count, is
> measuring import provenance rather than data quality. It systematically ranks *worst* pages
> highest. See "What this invalidates" at the end.

---

## Why this audit was run

The companion document `curation/pseo_pilot_content_feasibility_2026-08-17.md` proposed a
20-page pilot ranked on verified provider count. Two numbers in it were mutually inconsistent:

- `aba` in **ST. PETERSBURG**: 90% verified, but only **2 of 20** providers have a website.
- `aba` in **TALLAHASSEE**: 50% verified, and **79%** of providers have a website.

Both cannot mean "personally confirmed via web check." This audit establishes what the flag
does mean.

Scope for every query below: `resources` table, `resource_type = 'provider'` (3,339 rows,
1,174 verified). Grouping uses `canonical_city`, per standing project constraint.

---

## 1. Provenance columns available

| column | type | verdict |
|---|---|---|
| `source` | text | **The real provenance field.** Populated on 1,076 of 1,174 verified rows. |
| `last_verified_date` | date | **Misleadingly named.** It is a scrape date, not a verification date — see below. |
| `created_at` | timestamptz | 100% populated. The only surviving timing evidence. |
| `updated_at` | timestamptz | **No longer usable as an audit signal** — see §2. |
| `needs_review` | boolean | Only 71 rows true, of which 10 are *also* `verified`. |
| `review_reason` | text | 71 rows, exactly matching `needs_review`. |
| `google_place_id` | text | Effective proxy for "came from a Places scrape." |
| `address_original`, `address2_needs_manual_review` | text | Address-cleanup provenance only. |

**Columns that do not exist:** `verified_at`, `verified_by`, `import_batch`. There is no audit
table. **There is no record anywhere of who set `verified`, or when.**

### `last_verified_date` is a scrape timestamp

| | count |
|---|---|
| verified rows with `last_verified_date` | 966 |
| **unverified** rows with `last_verified_date` | **2,139** |
| unverified rows with `google_place_id` | **2,139** (exact match) |

The column is populated on more than twice as many unverified rows as verified ones, and its
unverified population exactly equals the rows carrying a Google Place ID. It records when an
external dataset was pulled. **Do not use it as verification recency.**

---

## 2. Timing — this was a bulk pass, not record-by-record work

Of 1,174 verified providers, **961 (82%) share a single `created_at` date: 2025-11-03.**
The next largest day is 2025-11-17 at 73 rows.

### Caveat: `updated_at` has been overwritten

Every verified row now carries one of only **4 distinct `updated_at` timestamps, all dated
2026-08-16 or 2026-08-17.** Those are the `canonical_city` backfill and trigger runs performed
during the Phase 2 city-normalization work on those dates.

Whatever update history existed prior to 2026-08-16 is gone. This is an unintended side effect
of that migration and is worth recording: **`resources.updated_at` cannot answer any question
about pre-2026-08-16 activity.** Only `created_at` remains usable.

---

## 3. `verified` versus website presence — the relationship is inverted

### Whole table

| | rows | with website | % |
|---|---|---|---|
| verified = **true** | 1,174 | 589 | **50.2%** |
| verified = **false** | 2,165 | 1,976 | **91.3%** |

Verified rows are roughly **half as likely** to have a website as unverified ones. That alone
disproves "verified means web-checked."

### The mechanism is `source`

| source | rows | verified % | website % | created |
|---|---|---|---|---|
| Google Places (PT/OT/ST) | 1,344 | **1.8%** | **100%** | 2025-11-03 |
| legacy_migration | 1,154 | 39.0% | 88.3% | 2025-11-03 |
| **FL-DD Database** | 587 | **82.5%** | **2.7%** | 2025-11-03 |
| (null/empty) | 117 | 83.8% | 98.3% | 2025-11-23 → 2026-04-23 |
| PATH International | 45 | 100% | 4.4% | 2025-11-03 → 11-17 |
| American Hippotherapy Association | 22 | 100% | **0%** | 2025-11-17 |
| submission | 18 | 83.3% | 100% | 2026-01-03 → 2026-08-16 |
| manual | 11 | 100% | 100% | 2026-02-19 |
| Google Places (Pet Therapy) | 10 | **0%** | 100% | 2025-11-03 |
| ADI Accredited | 5 | 100% | 100% | 2025-11-15 |
| Autism Service Dog Program | 5 | 100% | 100% | 2025-11-15 |
| EAGALA | 5 | 100% | 80% | 2025-11-17 |
| Verified Service Dog Organization | 4 | 100% | 100% | 2025-11-15 |
| self-submitted | 3 | 0% | 100% | 2026-05-08 → 06-04 |
| provider-submission | 2 | 100% | 100% | 2026-02-26 |

The pattern is unambiguous: **registry/credentialing imports are ~100% verified with almost no
websites; Google Places scrapes are ~0-2% verified with 100% websites.** `verified` is a source
label that was applied at import time.

Note also that several `source` values are free-text one-offs (`Website verification Feb 2026`,
`Services Matrix import (2025-10-17)`, a Facebook-comment provenance string, `MANUAL` vs
`manual`, `submission` vs `self-submitted` vs `provider-submission`). The field has no
controlled vocabulary.

### Side effect: the PT/OT/ST exclusion was made for the wrong reason

The feasibility report excluded physical-therapy, occupational-therapy and speech-therapy
because they sit at ~6% verified. Those 1,344 rows are a **single Google Places scrape that
nobody ever marked verified**. Their low rate reflects import method, not provider quality.

### Per-combo cross-tab for the 20 proposed pilot pages

Sorted by verified-with-website rate. `ver_web%` tracks the FL-DD share almost perfectly.

| service | city | ver | ver w/ web | **ver_web%** | unver_web% | FL-DD | legacy | other |
|---|---|---|---|---|---|---|---|---|
| life-skills | JACKSONVILLE | 11 | 0 | **0%** | 100% | **11** | 0 | 0 |
| aba | ST. PETERSBURG | 18 | 1 | **6%** | 50% | **17** | 0 | 1 |
| life-skills | ST. PETERSBURG | 11 | 1 | **9%** | 100% | **11** | 0 | 0 |
| life-skills | MIAMI | 21 | 2 | **10%** | 100% | **20** | 0 | 1 |
| life-skills | TAMPA | 27 | 3 | **11%** | 94% | **24** | 1 | 2 |
| aba | MIAMI | 64 | 22 | 34% | 78% | 41 | 19 | 4 |
| aba | JACKSONVILLE | 64 | 23 | 36% | 93% | 37 | 22 | 5 |
| aba | MIRAMAR | 14 | 5 | 36% | 100% | 9 | 3 | 2 |
| aba | TAMPA | 59 | 26 | 44% | 85% | 31 | 20 | 8 |
| aba | FORT LAUDERDALE | 17 | 9 | 53% | 100% | 6 | 9 | 2 |
| aba | CLEARWATER | 25 | 15 | 60% | 55% | 10 | 14 | 1 |
| aba | CAPE CORAL | 16 | 10 | 63% | 73% | 5 | 11 | 0 |
| aba | WEST PALM BEACH | 29 | 19 | 66% | 92% | 10 | 18 | 1 |
| aba | ORLANDO | 44 | 32 | 73% | 88% | 9 | 28 | 7 |
| aba | GAINESVILLE | 30 | 22 | 73% | 78% | 4 | 26 | 0 |
| aba | LAKELAND | 23 | 17 | 74% | 83% | 3 | 20 | 0 |
| aba | FORT MYERS | 29 | 22 | 76% | 75% | 4 | 22 | 3 |
| aba | TALLAHASSEE | 45 | 36 | 80% | 78% | 5 | 39 | 1 |
| aba | DAVIE | 15 | 12 | 80% | 100% | 2 | 12 | 1 |
| ados-testing | ORLANDO | 8 | 8 | **100%** | 100% | **0** | 1 | 7 |

**Combos that are verified-without-website at extreme rates** (all ≥89% FL-DD-sourced):
`life-skills JACKSONVILLE` (0%), `aba ST. PETERSBURG` (6%), `life-skills ST. PETERSBURG` (9%),
`life-skills MIAMI` (10%), `life-skills TAMPA` (11%).

The original puzzle resolves exactly: St. Petersburg ABA is 17/18 FL-DD (registry, no
websites); Tallahassee ABA is 39/45 legacy_migration (88% websites). Same flag, two unrelated
meanings.

**This also invalidates the insurance-mix finding** in the feasibility report. The
medicaid-only `life-skills` combos are pure FL-DD, and FL-DD is a Medicaid waiver provider
registry. The "insurance mix" signal was an artifact of import source too.

---

## 4. ST. PETERSBURG ABA cohort — one import, and mistagged

All 20 records in the combo:

| id | name | website | phone | address | ver | source | last_verified_date | created |
|---|---|---|---|---|---|---|---|---|
| 6049 | OCEAN CREST HOME CARE LLC ⏎ (dup line) | — | (224) 565-7873 | 2895 38TH AVE N | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6059 | A HOME FOR ANGELS, LLC | — | (305) 987-0472 | 5509 WESTCHESTER BLVD | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6097 | ROSANA O'NEILL, INC. ⏎ ST. PETE ABA | — | (727) 424-1578 | 5628 36TH AVE N | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6098 | PRIME JS LLC | — | **(135) 229-3615** | 6080 DENVER ST NE | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6138 | BERTHELOT BERTHELOT ⏎ TRELAINE HOUSE OF LOVE, INC. | — | (727) 742-4924 | 1789 26TH AVE S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6140 | BEHAVIORAL EVOLUTION, INC | — | (727) 954-5401 | 701 77TH AVE N STE 56546 | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6204 | HEART TO HEART ENTERPRISE | — | (727) 417-1542 | 600 39TH ST S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6411 | KRAMPITZ CLARENCE R | — | (727) 303-9583 | 535 CENTRAL AVE # 307 | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6412 | LOUISE GRAHAM REGENERATION CENTER INC | — | (727) 327-9444 | 2301 3RD AVE S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6413 | CARRINGTONS CARING ANGELS, LLC | — | (727) 498-8834 | 3110 1ST AVE N STE 2I | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6417 | SUPERIOR CARE HOMES INC | — | (727) 565-3652 | 125 DOLPHIN AVE SE | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6418 | WRIGHTWAY CONSULTING, INC ⏎ WRIGHTWAY MEDICAL | — | (727) 577-7544 | 2909 47TH AVE N | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6425 | CREATIVE CLAY, INC. | — | (727) 825-0515 | 1846 1ST AVE S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6457 | RAISA CARE FOR INC | — | (727) 459-0062 | 365 114TH AVE N UNIT 4 | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6458 | BYSTENIA SERVICES INC | — | (727) 642-5448 | 2521 MADRID WAY S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6460 | KJ THERAPEUTIC LEARNING CENTER LLC ⏎ (dup) | — | (727) 742-6642 | 2227 22ND ST S | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 6508 | ISABELLA MANOR | — | (727) 544-0091 | 7105 50TH AVE NORTH | t | FL-DD | 2025-10-12 | 2025-11-03 |
| 10634 | Thriveworks Counseling & Psychiatry – St Petersburg | thriveworks.com/… | (727) 620-3184 | 6733 1st Ave South Ste 102 | t | (null) | — | 2026-01-01 |
| 8672 | ADAPT & TRANSFORM BEHAVIOR, LLC | atbx.org | (813) 324-5730 | 4518 3RD AVE S | **f** | FL-DD | 2025-10-12 | 2025-11-03 |
| 8931 | 2ND MILE MANOR ⏎ QUALITY SERVICE INC | — | (813) 312-8244 | 4354 19TH ST N | **f** | FL-DD | 2025-10-12 | 2025-11-03 |

### Yes — it is one import

All 17 verified FL-DD rows share an identical `last_verified_date` (2025-10-12) and an
identical `created_at` (2025-11-03). Names are all-caps; several cram two lines (legal name +
DBA) into the `name` column, separated by a newline.

### The larger problem: most of these are not ABA providers

Identifiable from the names alone:

- `LOUISE GRAHAM REGENERATION CENTER` — a St. Petersburg recycling/thrift nonprofit
- `CREATIVE CLAY` — a disability arts center
- `ISABELLA MANOR` — assisted living
- `TRELAINE HOUSE OF LOVE`, `SUPERIOR CARE HOMES`, `2ND MILE MANOR` — group homes
- `OCEAN CREST HOME CARE`, `CARRINGTONS CARING ANGELS`, `RAISA CARE FOR INC`,
  `BYSTENIA SERVICES` — home-care agencies
- `KRAMPITZ CLARENCE R` — an individual person's name

At most **3 of 17** read as plausibly ABA: 6097 (ST. PETE ABA), 6140 (BEHAVIORAL EVOLUTION),
6460 (KJ THERAPEUTIC LEARNING CENTER).

Meanwhile the one row that clearly *is* a behaviour-analysis practice with a live website —
**id 8672 `ADAPT & TRANSFORM BEHAVIOR` (atbx.org)** — is marked **not verified**.

### The mistagging is systemic, not local

Across the whole FL-DD import (587 provider rows):

| metric | value |
|---|---|
| rows tagged `aba` | **504 (86%)** |
| rows tagged `life-skills` | 282 (48%) |
| rows tagged `residential-program` | 101 (17%) |
| average services per row | 1.68 |
| names containing an embedded newline | 96 |
| names entirely upper-case | 579 of 587 |
| distinct `last_verified_date` values | 4 (2025-10-12 → 2026-02-19) |

FL-DD is a Florida Medicaid waiver provider registry covering **all** developmental-disability
service types. Whatever mapped it into `services[]` applied `aba` to 86% of rows — a blanket
tag, not a per-provider determination.

Phone data from that import is also unreliable: id 6098 has area code `(135)` (does not
exist), id 6049 `(224)` (Illinois) and id 6059 `(305)` (Miami), all on St. Petersburg
addresses.

---

## What this invalidates

1. **`verified` cannot be used as the pSEO pilot selection criterion.** It ranks FL-DD-heavy
   combos highest, and those are precisely the combos with no websites, medicaid-only
   insurance, and blanket-applied service tags.
2. **Proposed pilot page #11** would publish *"18 verified ABA providers in St. Petersburg"*
   listing a recycling nonprofit, an assisted living facility and an arts centre.
3. **Three of the four combos previously recommended as strongest** — `aba Tampa`,
   `aba Jacksonville`, `aba Miami` — are 48-64% FL-DD, carrying the same mistagging at lower
   concentration.
4. **The only structurally clean combo in the pilot is `ados-testing ORLANDO`**: zero FL-DD
   rows, 100% websites.
5. **Treat as invalid until service tags are re-derived:** the verified counts in
   `Research/pseo_pilot_cohort_ge10_2026-08-16.csv`, and Parts 1, 2 and 4 of
   `curation/pseo_pilot_content_feasibility_2026-08-17.md`. Neither file has been modified.

## Suggested next steps

- Sample ~30 FL-DD rows across the whole import and classify which are genuinely ABA, to size
  the mistagging correction.
- Re-rank the pilot excluding FL-DD-sourced rows entirely; report which combos still clear 10
  providers on a defensible basis.
- Decide what `verified` *should* mean going forward, and add `verified_at` / `verified_by` (or
  a source-trust tier) before the flag is used for any public-facing claim.
- Do not surface the word "verified" to parents on generated pages until the above is settled.
