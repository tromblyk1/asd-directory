# Audit — Four Unaccounted Tables

**Date:** 2026-08-18
**Scope:** `google_reviews`, `google_reviews_canonical`, `providers`,
`provider_services_wide`, `provider_services_wide_merged`, `staging_pet_therapy`
**Method:** read-only. Schema from `information_schema`, counts and coverage via
SQL, app usage via grep for `.from('<table>')` across `src/frontend/src/`.

---

> ## Headline findings
>
> 1. **One of these is live, not orphaned.** `google_reviews_canonical` backs a
>    **materialized view** `provider_ratings_summary` that the app reads in
>    `hooks/useProviderRatings.ts`. Do not touch it.
> 2. **`provider_services_wide` is the most valuable table in the database right
>    now.** It is a website-crawl output that stores a **quoted excerpt as
>    evidence** for every service flag — the exact thing `resources.services`
>    lacks. It is the head start on the re-tag project.
> 3. **Review text exists but does not solve the prose problem.** 12,519 reviews
>    with text, but only **17–22% of ABA providers** in the target cities have
>    any, and Lakeland is at 4.4%.
> 4. `provider_services_wide_merged` is **empty (0 rows)**. `providers` is a
>    frozen legacy predecessor. `staging_pet_therapy` is residue.

---

## 1. `google_reviews` and `google_reviews_canonical`

Both are **BASE TABLEs**, not views.

| | `google_reviews` | `google_reviews_canonical` |
|---|---:|---:|
| Rows | **12,753** | **11,842** |
| Rows with `review_text` | **12,519** (98.2%) | **11,841** (100.0%) |
| Distinct `google_place_id` | 2,512 | 2,486 |
| Avg review length | **506 chars** | 507 chars |

### They store full review text, not just aggregates

Columns: `id`, `provider_name`, `provider_phone`, `google_place_id`,
`reviewer_name`, `reviewer_rating`, `review_text`, `review_time`,
`relative_time`, `profile_photo`, `fetched_at`, `created_at`,
`review_text_search`.

`review_text` is real prose averaging 506 characters. `google_reviews` also has a
`tsvector` column (`review_text_search`), so full-text search was set up at some
point.

### `_canonical` is a de-duplicated copy that lost its types

Same 13 columns, but `created_at` is `text` (not `timestamptz`) and
`review_text_search` is `text` (not `tsvector`). That is a CSV round-trip
signature — the table was exported, de-duplicated externally, and re-imported
without a typed DDL. It is 911 rows smaller, consistent with dedupe.

### ⚠️ `_canonical` is load-bearing — the app reads it

`provider_ratings_summary` is a **materialized view** (`relkind = 'm'`) defined as:

```sql
SELECT google_place_id, count(*) AS review_count,
       round(avg(reviewer_rating), 2) AS avg_rating,
       count(CASE WHEN reviewer_rating = 5 THEN 1 END) AS five_star_count,
       ... two_star_count, one_star_count,
       max(review_time) AS latest_review_date
FROM google_reviews_canonical
WHERE reviewer_rating IS NOT NULL AND google_place_id IS NOT NULL
GROUP BY google_place_id;
```

Read by `src/frontend/src/hooks/useProviderRatings.ts:51` and `:112`.

Two consequences worth knowing:

- **`google_reviews_canonical` cannot be dropped.** It is not orphaned.
- **It is a materialized view, so it is a frozen snapshot.** Star breakdowns
  shown on the live site are only as fresh as the last `REFRESH MATERIALIZED
  VIEW`. Worth checking when that last ran.

### Review-text coverage against `resources`

| Measure | Count | % |
|---|---:|---:|
| `resources` rows total | 3,334 | — |
| ...with a `google_place_id` | 3,096 | 92.9% |
| **...with ≥1 review carrying text** | **1,560** | **46.8%** |
| `aba`-tagged rows | 1,462 | — |
| **...with ≥1 review carrying text** | **311** | **21.3%** |

### The four cities

| City | ABA providers | With review text | % | Reviews available |
|---|---:|---:|---:|---:|
| TAMPA | 90 | 17 | 18.9% | 87 |
| ORLANDO | 73 | 16 | 21.9% | 73 |
| TALLAHASSEE | 90 | 15 | 16.7% | 77 |
| **LAKELAND** | 68 | **3** | **4.4%** | 14 |

### Verdict on review text as page prose

**It does not rescue page generation.** Three reasons:

1. **Coverage is too thin where it matters.** At 17–22%, four of every five
   providers listed on a page would still have no prose. Lakeland at 4.4% (3
   providers, 14 reviews total) cannot support a page at all.
2. **The reviews attach to the wrong rows.** Coverage is driven by
   `google_place_id`, which came from the Places scrape — so it is densest on
   exactly the rows the spot-check found are mistagged, and sparsest on the small
   genuine-ABA set.
3. **Republishing it is a bad idea independently.** Google review text is
   third-party UGC. Bulk-republishing it on generated pages is a Google ToS
   problem and reads as scraped content to the very algorithm the pSEO pages are
   meant to please. Aggregates (`provider_ratings_summary`) are the safe use, and
   those are already wired up.

---

## 2. `providers` — legacy predecessor of `resources`

**BASE TABLE. 4,656 rows. 79 columns. Nothing in the app reads it.**

`max(last_updated) = 2025-10-28` — frozen for roughly ten months.

It is **not** a view over `resources` and not a subset: 4,656 rows vs `resources`'
3,334, with only **1,429 matching by `google_place_id`**.

### What it is

The **wide-boolean ancestor** of the current schema. Where `resources` uses three
array columns (`services[]`, `insurances[]`, `scholarships[]`), `providers` uses
one boolean column per value:

- **Services (25 booleans):** `aba`, `speech`, `ot`, `pt`, `respite_care`,
  `life_skills`, `residential`, `church_support`, `pet_therapy`, `aac_speech`,
  `dir_floortime`, `feeding`, `inpp`, `music_therapy`, `virtual_therapy`,
  `ados_testing`, `pharmacogenetic_testing`, `autism_travel`, `mobile_services`,
  `support_groups`, `telehealth`, `parent_coaching`, `executive_function`,
  `tutoring`, `group_therapy`
- **Insurance (16):** `accepts_medicaid`, `accepts_medicare`,
  `accepts_florida_blue`, `accepts_unitedhealthcare`, `accepts_aetna`,
  `accepts_cigna`, `accepts_tricare`, `accepts_humana`,
  `accepts_florida_healthcare_plans`, `accepts_sunshine_health`,
  `accepts_wellcare`, `accepts_molina`, `accepts_florida_kidcare`,
  `accepts_private_pay_only`
- **Scholarships (5):** `accepts_fes_ua`, `accepts_fes_eo`, `accepts_ftc`,
  `accepts_pep`, `accepts_hope_scholarship`
- **Audience (3):** `serves_children`, `serves_teens`, `serves_adults`
- **Programs (7):** `offers_telehealth`, `offers_peers_program`,
  `offers_space_program`, `offers_social_skills_groups`,
  `offers_neuropsych_assessment`, `offers_tutoring`, `offers_ef_coaching`,
  `offers_parent_coaching`

**Verdict: legacy, dead, but do not drop yet.** It carries fields `resources`
never got — `serves_children` / `serves_teens` / `serves_adults` in particular
would directly address the "is this an adult provider?" failure mode that the
spot-check kept hitting (adult DD day programs, adult TMS clinics, adult schools
all tagged `aba`). `providers.aba` is true on 944 rows; whether that flag is any
better than `resources.services` is untested, but it is a free second opinion
worth checking before this table is discarded.

---

## 3. `provider_services_wide` and `provider_services_wide_merged`

Both are **BASE TABLEs**, not views. **Nothing in the app reads either.**

### `provider_services_wide` — 1,039 rows, 30 columns

This is the output of a **website crawler**, and it is the most useful thing
found in this audit.

| Column group | Columns |
|---|---|
| Identity | `id`, `ProviderName`, `Domain`, `Website_final`, `Address1`, `City`, `State`, `Zip`, `phone`, `normalized_phone` |
| Crawl metadata | `Crawl_Status`, `Pages_Crawled`, `Matched_Categories` |
| Service flags (9) | `HomeAccess`, `RespiteCare`, `ABA`, `OT`, `PT`, `Speech`, `LifeSkills`, `Employment`, `Residential`, plus `church_support`, `pet_therapy` |
| **Evidence (9)** | `HomeAccess_Excerpt`, `RespiteCare_Excerpt`, `ABA_Excerpt`, `OT_Excerpt`, `PT_Excerpt`, `Speech_Excerpt`, `LifeSkills_Excerpt`, `Employment_Excerpt`, `Residential_Excerpt` |

**Crawl status breakdown:**

| Status | Rows |
|---|---:|
| Success | 639 |
| Success (no matches) | 239 |
| Failed (empty/JS-only) | 157 |
| Skipped (directory/social) | 4 |

**Fill rates:**

| Field | Count |
|---|---:|
| `ABA` = true | 357 |
| `ABA_Excerpt` present | **338** (avg 141 chars) |
| `LifeSkills_Excerpt` | 340 |
| `Speech_Excerpt` | 219 |
| `OT_Excerpt` | 219 |
| `PT_Excerpt` | 124 |
| Rows with `normalized_phone` | 1,035 / 1,039 |

1,035 rows carry a normalized phone, and joining on it matches **1,124 `resources`
rows** — so this is directly linkable to the live table.

### Why this matters: it stores *why*

Sample `ABA_Excerpt` values:

| Provider | City | Excerpt |
|---|---|---|
| Contemporary Learning Center | Winter Park | "…providing intensive applied behavior analysis (ABA) in clinic, educational setting support, community skills preparedness…" |
| NeuroRise Behavioral Center | Fort Myers | "NeuroRise Behavioral Therapy LLC \| ABA therapy … Welcome to NeuroRise Behavioral Center" |
| **Learnary** | **Lakeland** | **"Learnary \| ABA Therapy Florida … Learning to Change, Teaching to Thrive"** |
| SPOT Therapy Associates | Fort Myers | "…Greenspan Floor Time, Brain Gym, **Verbal Behavior ABA**, Building Blocks to Sensory Integration…" |
| Trauma and Counseling Solutions | Spring Hill | "…Michele uses **cognitive behavior therapy** and art therapy when needed…" |

The last row is a **false positive** — `ABA = true` was triggered by a substring
match on "behavior" in "cognitive behavior therapy". So the crawler has its own
precision problem, roughly the same class of error as the imports.

**But the difference is decisive: the evidence is stored.** A human can
adjudicate that row in two seconds by reading the excerpt. Nothing on
`resources.services` allows that — you have to open the website yourself, which
is what made yesterday's 148-row spot-check take as long as it did.

**This table is the head start on the re-tag project I recommended.** 338
pre-extracted ABA justifications covering 1,124 joinable `resources` rows is a
substantial fraction of the manual work already done.

It also **resolves one row from yesterday's spot-check**: `Learnary` (Lakeland, id
10387) was marked UNRESOLVED because learnary.com returned no content. The crawl
excerpt reads "Learnary | ABA Therapy Florida" — it is genuine. Lakeland's genuine
ABA count goes from 7 to **8**.

**Coverage limit:** 1,039 rows against 3,334 in `resources` — about 31%. It is a
head start, not a solution.

### `provider_services_wide_merged` — **0 rows**

11 columns (`normalized_phone`, `phone`, `aba`, `speech_therapy`,
`occupational_therapy`, `physical_therapy`, `respite_care`,
`life_skills_development`, `residential_habilitation`, `church_support`,
`pet_therapy`, `zip`). **Completely empty.**

It is the intended *destination* of a merge that was never run — note the column
names are snake_case and much closer to `resources` slugs than the source table's
PascalCase. Someone designed the mapping step and stopped. Dead.

### Vocabulary comparison

`resources.services` has **24 distinct slugs actually in use**:

| Slug | Rows | | Slug | Rows |
|---|---:|---|---|---:|
| `aba` | 1,462 | | `mobile-services` | 107 |
| `physical-therapy` | 955 | | `animal-therapy` | 107 |
| `occupational-therapy` | 743 | | `support-groups` | 95 |
| `speech-therapy` | 634 | | `respite-care` | 47 |
| `life-skills` | 495 | | `executive-function-coaching` | 42 |
| `parent-coaching` | 226 | | `tutoring` | 35 |
| `group-therapy` | 211 | | `music-therapy` | 34 |
| `virtual-therapy` | 155 | | `aac` | 10 |
| `ados-testing` | 126 | | `dir-floortime` | 5 |
| `residential-program` | 122 | | `transportation` | 2 |
| `feeding-therapy` | 120 | | `art-therapy` / `autism-travel` / `financial-planning` | 1 each |

**How the wide tables differ:**

| `provider_services_wide` | `_merged` | `resources` equivalent |
|---|---|---|
| `ABA` | `aba` | `aba` ✅ |
| `Speech` | `speech_therapy` | `speech-therapy` ✅ |
| `OT` | `occupational_therapy` | `occupational-therapy` ✅ |
| `PT` | `physical_therapy` | `physical-therapy` ✅ |
| `RespiteCare` | `respite_care` | `respite-care` ✅ |
| `LifeSkills` | `life_skills_development` | `life-skills` ✅ |
| `Residential` | `residential_habilitation` | `residential-program` ≈ |
| `pet_therapy` | `pet_therapy` | **`animal-therapy`** — name mismatch |
| `HomeAccess` | — | **none** |
| `Employment` | — | **none** |
| `church_support` | `church_support` | **none** |

So the wide tables cover **9 of 24** slugs and introduce **3 concepts `resources`
has no home for** — `HomeAccess`, `Employment`, `church_support`. Fifteen
`resources` slugs have no wide-table equivalent at all: `ados-testing`,
`feeding-therapy`, `music-therapy`, `dir-floortime`, `group-therapy`,
`parent-coaching`, `executive-function-coaching`, `support-groups`, `tutoring`,
`virtual-therapy`, `mobile-services`, `autism-travel`, `aac`, `transportation`,
`art-therapy`.

Practically: the crawl can help re-tag the four big clinical services and
life-skills. It cannot help with the long tail.

---

## 4. `staging_pet_therapy` — dead residue

**1,414 rows. Three columns: `google_place_id` (NOT NULL), `phone`,
`normalized_phone`.** Nothing else. No name, no service flag, no payload of any
kind — it is a bare list of identifiers.

- 119 of 1,414 match a `resources` row by `google_place_id`.
- **`resources` has zero rows tagged `pet-therapy`** — and never will, because the
  live slug is `animal-therapy` (107 rows).
- Nothing in the app reads it.

**Confirmed dead residue.** It cannot be "applied" even if you wanted to: it
carries no determination about which places actually offer animal therapy, only
which places were in some queue. Whatever produced it either finished (the 107
`animal-therapy` rows) or was abandoned.

Safe to drop. My preference is to leave it until the tagging work is finished —
it costs nothing at 1,414 rows, and running DDL in the middle of a data-integrity
investigation adds risk for no benefit.

---

## Incidental finding — `CLAUDE.md` slug list is stale

`CLAUDE.md` under **VALID SLUGS → Services** lists **20** slugs including
`pet-therapy`. Reality:

- **`pet-therapy` does not exist in the database (0 rows).** The live slug is
  **`animal-therapy`** (107 rows), and the app uses it consistently and correctly
  — `ServiceTag.tsx:94`, `ProviderCard.tsx:78`, `findproviders.tsx:53`,
  `educationalresources.tsx:20`, `ServiceDetail.tsx:43`, and
  `data/resources/services/animal-therapy.json`. **The code is right; the doc is
  wrong.** No live bug, just drift.
- **24 slugs are in use, not 20.** Undocumented: `animal-therapy` (107), `aac`
  (10), `transportation` (2), `art-therapy` (1), `financial-planning` (1). The
  last three are almost certainly one-off junk from a submission or import.

---

## Summary table

| Table | Rows | Live? | Verdict |
|---|---:|---|---|
| `google_reviews` | 12,753 | No direct read | Source of `_canonical`. Full review text, tsvector FTS. Keep |
| `google_reviews_canonical` | 11,842 | **YES — via matview** | Backs `provider_ratings_summary`, read by `useProviderRatings.ts`. **Do not drop.** Check matview refresh recency |
| `providers` | 4,656 | No | Legacy wide-boolean ancestor of `resources`, frozen 2025-10-28. Keep for now — has `serves_children/teens/adults` |
| `provider_services_wide` | 1,039 | No | **Crawl output with stored evidence excerpts. Highest-value table for the re-tag project.** Keep |
| `provider_services_wide_merged` | **0** | No | Empty. Abandoned merge target. Droppable |
| `staging_pet_therapy` | 1,414 | No | Bare identifier list, no payload. Dead residue. Droppable |

---

## Suggested next step

Cross-check `provider_services_wide.ABA_Excerpt` against the 148 rows from
yesterday's Tallahassee/Lakeland spot-check. I hand-verified those, so the overlap
gives a measured precision figure for the crawler's ABA flag against known
answers — which tells you whether the 338 stored excerpts can be trusted as a
re-tag seed or need full manual review anyway.
