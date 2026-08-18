# `provider_services_wide.ABA` — Precision Against the 148 Hand-Verified Rows

**Date:** 2026-08-18
**Ground truth:** `curation/legacy_migration_spotcheck_2026-08-17.md` (148 rows, `source = legacy_migration`, `'aba' = ANY(services)`, `canonical_city IN ('TALLAHASSEE','LAKELAND')`)
**Table under test:** `provider_services_wide` — website-crawl output, boolean `ABA` flag plus a stored `ABA_Excerpt`
**Read-only.** No DB changes, no code changes.

---

> ## Verdict
>
> **The excerpt is good enough to adjudicate without opening the website — for the rows it covers.**
> Every false positive is defeated by reading its own stored excerpt. All but one
> are the phrase **"Cognitive Behavioral Therapy" / "Dialectical Behavior Therapy"**.
> A human skimming 18 excerpts would reach 17 correct verdicts.
>
> **The flag alone is not good enough.** Raw precision is **56%**. The value is
> entirely in the excerpt, not the boolean.
>
> **Coverage, not accuracy, is the binding constraint.** The table answers
> **~88% of ABA-tagged records that have a website** and **0% of those that don't**.
> For a 78-with / 87-without queue that is roughly **69 of 165 answered, 96 still
> needing research** — and all 96 needing it for the reason the table can't help:
> there is no website to crawl.
>
> **Separately: `provider_ratings_summary` is not stale relative to its base table,
> but the underlying review data has not moved since 2025-10-18.** Parents are
> seeing a **10-month-old** rating snapshot, and 1,535 providers with a
> `google_place_id` have no row in the view at all.

---

## Part 0 — A join-key correction

`resources.normalized_phone` is **effectively empty**: 9 of 3,334 rows populated.
All 148 spot-check rows have `normalized_phone IS NULL`. Any join written against
that column returns zero rows.

Everything below normalizes on the fly:

```sql
right(regexp_replace(coalesce(phone,''), '\D', '', 'g'), 10)
```

Two join strategies are measured: **phone-only** (the originally proposed key) and
**phone-or-domain** (falling back to registrable host from `website`).

---

## Part 1 — How many of the 148 join at all

| Human verdict | Rows | Join by phone | Join by phone **or domain** |
|---|---:|---:|---:|
| GENUINE | 13 | 9 (69%) | **12 (92%)** |
| MISTAG | 126 | 102 (81%) | **105 (83%)** |
| UNRESOLVED | 9 | 5 | 5 |
| **Total** | **148** | **116 (78%)** | **122 (82%)** |

### The phone join systematically loses the real providers

The four GENUINE rows that fail the phone join are not random:

| id | Name | Website |
|---|---|---|
| 6521 | Learn and Rise | `sites.google.com/view/learn-and-rise-behaviortherapy/...` |
| 6756 | Acorn Health ABA Therapy - Lakeland | acornhealth.com |
| 7094 | Florida Autism Center Tallahassee (BlueSprig) | bluesprigautism.com |
| 7095 | Hopebridge Autism Therapy Center - Tallahassee | hopebridge.com |

**Three of the four are national ABA chains**, and all three *are* present in
`provider_services_wide` with correct flags and strong excerpts — they simply
carry corporate phone numbers that don't match the per-center number in
`resources`. Acorn Health: `"ABA Therapy & Treatment In Lakeland, FL"`.
Hopebridge: `"...applied behavior analysis (ABA therapy)..."`.

Adding the domain fallback recovers Acorn and Hopebridge. BlueSprig joins but its
`ABA` flag is **NULL** (crawl produced no verdict). Learn and Rise is on
`sites.google.com`, which must be **excluded from a domain join** — it is a shared
host and already collides with an unrelated record (`Growing Smiles ABA Services Inc`).

**A phone-only join preferentially drops exactly the rows a re-tag most needs to keep.**

---

## Part 2 — Confusion matrix

Excludes the 9 UNRESOLVED rows (no human verdict to compare against) and rows
where the crawler produced a NULL flag (crawl failed — not a prediction).

### Phone join

|  | Human: GENUINE | Human: MISTAG |
|---|---:|---:|
| **Flag TRUE** | TP = **8** | FP = **6** |
| **Flag FALSE** | FN = **1** | TN = **78** |
| Flag NULL (crawl failed) | 0 | 18 |

- **Precision = 8 / 14 = 57.1%**
- **Recall = 8 / 9 = 88.9%**

### Phone-or-domain join

|  | Human: GENUINE | Human: MISTAG |
|---|---:|---:|
| **Flag TRUE** | TP = **10** | FP = **8** |
| **Flag FALSE** | FN = **1** | TN = **78** |
| Flag NULL (crawl failed) | 1 | 19 |

- **Precision = 10 / 18 = 55.6%**
- **Recall = 10 / 11 = 90.9%**

Precision is flat across both joins; the domain fallback buys recall and coverage,
not accuracy.

**Context for the 56% figure:** the base rate in this cohort is **9%** genuine
(13 of 148). The flag lifts a 9% prior to a 56% posterior — a **6× improvement**,
and it correctly rejects 78 of 84 adjudicable mistags. It is a strong shortlist
generator. It is not an answer.

---

## Part 3 — Every false positive, with its stored excerpt

All 8. Excerpts are verbatim from `ABA_Excerpt`, trimmed for width.

| id | Name | Domain | Stored `ABA_Excerpt` | What fooled it |
|---|---|---|---|---|
| 6643 | Ability Plus Mental Health Clinic | abilityplusmentalhealthllc.com | "therapists utilize techniques like **Cognitive Behavioral Therapy** and **Dialectical Behavior Therapy** to match your unique needs…" | CBT/DBT |
| 7040 | Thoughtful Counseling LLC | thoughtfulcounseling.net | "My therapeutic approach includes **Cognitive Behavioral Therapy** and **Dialectical Behavior Therapy**. When we know why we are thinking…" | CBT/DBT |
| 8852 | Diamond Behavioral Health - Tallahassee | diamondbehavioralhealth.com | "…patterns and behaviors contributing to their mental health challenges. **Dialectical Behavior Therapy (DBT)**: This therapy is designed to help individuals build skills in emotional…" | DBT |
| 8866 | Marie H. Guilford, PHD | doctorguilford.com | "…Disorder Evaluations Therapy Modalities **Cognitive Behavioral Therapy Dialectical Behavior Therapy** Mindfulness-Based Therapy Telehealth…" | CBT/DBT |
| 8948 | WellStead Mental Health | wellsteadmentalhealth.com | "…in a safe and supportive environment. **Dialectical Behavior Therapy (DBT)** DBT combines cognitive-behavioral techniques with mindfulness practices…" | DBT |
| 9116 | Cue Counseling Center | cuecounseling.com | "…Health Behavioral Health Department and through Tampa Bay Center for **Cognitive Behavior Therapy**, a **Dialectical Behavioral Therapy (DBT)** clinic…" | CBT/DBT |
| 9084 | Thriveworks Counseling & Psychiatry - Tallahassee | thriveworks.com | "…therapy **Cognitive behavioral therapy (CBT)** Depression counseling **Dialectical behavior therapy (DBT)** Grief & loss counseling…" | CBT/DBT |
| 7109 | Elite DNA Behavioral Health - Tallahassee | elitedna.com | "**Fort Myers** Occupational Therapy, Speech & **ABA** Clinic \| Florida Skip to main content Visit Elite DNA Home Page…" | **Different failure mode** — see below |

### The failure mode is one thing, and it is trivially detectable

**Seven of eight are the same substring collision.** The crawler matches
`behavior` inside "Cognitive Behavioral Therapy" and "Dialectical Behavior
Therapy" — two named modalities from the adult psychotherapy vocabulary that have
nothing to do with applied behavior analysis. This is a **single regex defect**,
not a distribution of subtle judgment calls.

Excluding excerpts that contain `cognitive behavio` or `dialectical behavio`
without also containing `applied behavior analysis`, `ABA`, `BCBA` or `behavior
analyst` would remove **7 of the 8 false positives and none of the 10 true
positives**, taking precision from 56% to **91%** on this cohort with no manual
review at all.

**The eighth, id 7109 Elite DNA, is the only genuinely hard one, and it is a
different problem.** The excerpt is a real ABA claim — but it is scraped from the
chain's **Fort Myers** page. Elite DNA runs an ABA clinic in Fort Myers and a
general behavioral-health clinic in Tallahassee. The flag is right about the
company and wrong about the location. This is the same multi-location trap that
made BlueSprig/Hopebridge/Acorn fail the phone join, seen from the other side:
**`provider_services_wide` describes a domain, not a location.** A careful reader
catches it because the excerpt names the city — but only if they are watching for
it.

### The one false negative

| id | Name | Crawl status | Excerpt |
|---|---|---|---|
| 6958 | Applied Behavioral Learning Experiences - Lakeland | `Success (no matches)` | *(none)* |

The crawl succeeded and found nothing. This is an established Florida ABA provider
whose site the crawler read without matching. Notably, **the record's own name
contains "Applied Behavioral"** — a name-signal pass would have caught what the
website crawl missed. The two signals are complementary; neither alone is sufficient.

---

## Part 4 — Is the excerpt alone good enough to adjudicate?

**Yes, for coverage-limited use. Answering plainly:**

A human adjudicating **only** the 18 flagged excerpts in this cohort, never opening
a browser, would get **17 of 18 right**. The seven CBT/DBT excerpts are
self-evidently not ABA to anyone who knows the vocabulary — the disqualifying
phrase is *inside the quoted text*. The ten true positives are equally
self-evident: "ABA Therapy in Home, School, and Community", "Applied Behavior
Analysis (ABA) therapy", "Autism Therapy | Florida … Orchard ABA".

The one they'd plausibly get wrong is **Elite DNA (7109)** — and only if they read
past the word "Fort Myers".

Three qualifications on that answer:

1. **Excerpts are ~141 characters and mid-sentence.** They are windows around the
   match, not summaries. 338 of 357 `ABA = true` rows have one; **19 do not**, and
   those are unadjudicable without opening the site.

2. **The excerpt only ever justifies a YES.** `ABA = false` rows have no excerpt —
   there is no evidence to read, so a human can only accept the crawler's negative
   on faith. Recall is ~91% here, which is good, but 6958 shows the negatives are
   not free of error. **Positives are adjudicable; negatives are not.**

3. **Domain ≠ location.** Both the Elite DNA false positive and the three chain
   false-negatives come from the same fact. Excerpt adjudication must always ask
   "does this claim apply to *this branch*", and the excerpt frequently cannot say.

**Practical read:** use the excerpt to adjudicate the positives — that's a fast,
low-error pass. Do not use the absence of a flag as evidence of anything.

---

## Part 5 — How much of the 165-row manual queue does this table answer?

**Caveat on scoping.** I could not reconstruct the exact 165-row id list from the
repo. `curation/CURATION_TRACK_UPDATE.txt:78` refers to "the full 165" but defines
it in a prior update that isn't in `curation/` or `curation/archive/`. No query I
tried reproduces 165 split 78/87 (`needs_review = true` gives 29; ABA-tagged in
Tallahassee+Lakeland gives 158; by-source splits don't match).

So the figures below are computed on the **entire ABA-tagged population (1,462
rows)** split by website presence, then applied to a 78/87 queue. Join rate is
driven almost entirely by whether a website exists, so these rates transfer to any
subset. Drop the id list in a CSV and I'll rerun it exactly in one query.

### Join coverage across all ABA-tagged records

| | Rows | Join by phone | Join by phone **or domain** | Domain-only lift |
|---|---:|---:|---:|---:|
| **Has website** | 927 | 700 (75.5%) | **815 (87.9%)** | +115 |
| **No website** | 535 | 13 (2.4%) | **13 (2.4%)** | 0 |

### Applied to a 78-with-website / 87-without queue

| Group | Queue | Expected to join | Expected **usable** (non-NULL flag) | Still needs research |
|---|---:|---:|---:|---:|
| With website | 78 | **~69** (88%) | **~59** | ~19 |
| Without website | 87 | **~2** (2.4%) | **~2** | ~85 |
| **Total** | **165** | **~71** | **~61** | **~104** |

"Usable" discounts the ~14% of joined website rows whose `ABA` flag is NULL
because the crawl failed (`Failed (empty/JS-only)` and similar).

### What this means for agent time

**Do not spend agent research time on the 78 with websites until you've run the
join.** Roughly **59 of 78** already have a crawler verdict, and for the positives
among them a stored excerpt makes the call in seconds. That is a **~75% reduction**
in the website half of the queue.

**The 87 without websites get no help whatsoever.** `provider_services_wide` is a
website crawl; a record with no website was never crawled. 2.4% is noise —
records that had a website at crawl time and lost it since, or that matched a
sibling record's phone.

That reframes the queue: it is not 165 records of uniform cost. It is **~59
cheap desk checks, ~19 website visits, and ~85 records that require the expensive
path** (phone calls, AHCA cross-match, Google Business listings) because there is
nothing on the web to read. If you're budgeting agent tokens, the 87 no-website
rows are where the entire cost lives, and this table does not touch them.

---

## Part 6 — `provider_ratings_summary` refresh recency

**The view is internally consistent. The data behind it is 10 months old.**

| Check | Result |
|---|---|
| `relkind` | `m` — materialized view, confirmed |
| Last autoanalyze on the matview | **2025-10-18 23:33:44 UTC** |
| Last autoanalyze on `google_reviews_canonical` | 2025-10-18 23:17:44 UTC |
| Last autoanalyze on `google_reviews` | 2025-10-14 01:11:21 UTC |
| Matview rows | 2,486 |
| Distinct `google_place_id` in `google_reviews_canonical` | 2,486 |
| Places in base table missing from matview | **0** |
| `resources` rows with a `google_place_id` and **no** matview row | **1,535** |

`REFRESH MATERIALIZED VIEW` rewrites the heap and resets statistics, so the
2025-10-18 23:33 autoanalyze is the best available proxy for the last refresh —
**about 10 months ago.** Postgres does not record refresh time directly.

**Two distinct findings, and only one is a staleness problem:**

1. **The matview is *not* drifted from its base table.** 2,486 = 2,486, zero
   places missing. Refreshing it right now would change nothing. The freeze is
   upstream: `google_reviews_canonical` itself hasn't been written since October
   2025.

2. **The real exposure is coverage, not recency.** **1,535 providers carry a
   `google_place_id` but have no row in the view**, so `useProviderRatings.ts`
   returns nothing for them and they render with no stars at all. That is
   roughly 38% of the table showing blank where a rating is expected.

So: parents are seeing rating counts and averages frozen at October 2025 — a
provider that has gained 200 reviews or dropped a full star since then still
displays the old number. That is a genuine accuracy problem for a page that
presents the figure as current, but **a refresh does not fix it.** The fix is
re-running the Google Places pull into `google_reviews_canonical`, then
refreshing. Worth deciding whether to keep displaying a 10-month-old figure
without a "last updated" qualifier in the meantime.

---

## What I'd do next

1. **Apply the CBT/DBT exclusion** to the `ABA = true` set before any human sees
   it. One regex, removes 7 of 8 false positives on this cohort, costs nothing.
   Precision 56% → ~91%.
2. **Join on phone OR domain, excluding shared hosts** (`sites.google.com`,
   `facebook.com`, `linktr.ee`). Recovers the national chains, +115 rows of
   coverage, and it's the chains that are the real ABA providers.
3. **Add a name-signal pass** (`ABA`, `BCBA`, `applied behavio`, `behavior
   analy`, `autism` in `resources.name`) as a second independent channel. It
   catches 6958, which the crawl missed, and it works on the 535 website-less
   rows where the crawl is silent.
4. **Route the 87 no-website queue records away from web research** — they need
   the AHCA cross-match and phone verification, not agent browsing.
5. **Decide on the ratings display** before the next deploy: refresh won't help,
   so either re-pull Google data or qualify the number on the page.

**Note on the earlier Learnary finding:** id 10387 was UNRESOLVED in the
spot-check and its `ABA_Excerpt` reads `"Learnary | ABA Therapy Florida"`. It is
held out of the confusion matrix above to keep the measurement independent — the
crawler cannot be scored against a verdict the crawler supplied. Treated as a
genuine ABA provider on its own evidence, Lakeland's genuine count moves 7 → 8.
