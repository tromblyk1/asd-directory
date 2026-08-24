# Search Console indexing investigation — 2026-08-23

Data: `curation/search_console_2026-08-23/` (9 Coverage drilldown exports, GSC last update 8/20).
No code changed. Cause established only.

---

## Verdict up front

**The noindex is not a bug in who emits it. It is a bug in what is being asked for.**

91% of the 708 (642 URLs) are **rows that no longer exist in the database**. The
`schools` table holds 2,504 rows; the noindexed school URLs point at rows that
were deleted. `SchoolDetail` correctly renders "School Not Found" + `noindex`.
That is the system working as designed. Not an emergency.

The genuine anomaly is the **66 URLs that are in the current sitemap and whose rows
exist in the database right now**. Those are real pages that served `noindex`.

**Hypothesis 4 is falsified.** Every detail page has a separate `isLoading` early
return that fires *before* the not-found branch, and the loading branch renders no
`<Helmet>` at all. A render-budget timeout produces a spinner with **no robots meta**,
never a `noindex`. The loading state and the not-found state are not the same branch
on any page.

**What actually produces `noindex` on a live page:** the branch is
`if (error || !school)` — `error` is any *query failure*, not just a missing row.
`main.tsx:14` sets `retry: 1`. The site is a pure client-rendered SPA (single
`index.html`, no prerender plugin in `vite.config.ts`), so Googlebot must execute JS
and hit Supabase directly. One transient Supabase/network failure plus one failed
retry lands Googlebot on the not-found branch of a page that resolves fine on the
next attempt. That is the mechanism behind the 66.

---

## 1. Every place that emits meta robots noindex

| File:line | Trigger condition | Async? |
|---|---|---|
| `ProviderDetail.tsx:196` | `error \|\| !provider` — Supabase `.single()` on `resources` failed or returned no row | **Yes — query-dependent** |
| `SchoolDetail.tsx:114` | `error \|\| !school` — `.single()` on `schools` | **Yes** |
| `DaycareDetail.tsx:156` | `error \|\| !daycare` | **Yes** |
| `ChurchDetail.tsx:152` | `error \|\| !church` | **Yes** |
| `EventDetail.tsx:132` | `!event` — note: `error` is **not destructured**, so a failed query falls through to this branch identically | **Yes** |
| `ResourceDetail.tsx:118` | `!resource` | **Yes** |
| `ResourceCategory.tsx:76` | `!category \|\| !categoryConfig[category]` — static config map lookup | No — synchronous, safe |
| `ProvidersByCity.tsx:289` | `!page` — lookup against the static imported pSEO `PAGES` manifest | No — synchronous, safe |
| `FeaturedThankYou.tsx:10` | Unconditional — intentional | No |

The six query-dependent emitters are the entire exposure. The two synchronous ones
cannot misfire.

## 2. Not-found branches and ordering

Every detail page checks loading first:

`SchoolDetail` 101/109 · `ProviderDetail` 183/191 · `DaycareDetail` 143/151 ·
`ChurchDetail` 139/147 · `EventDetail` 119/127 · `ResourceDetail` 105/113 ·
`ServiceDetail` 102/110 · `InsuranceDetail` 90/98 · `ScholarshipDetail` 93/101 ·
`AccreditationDetail` 54/62 · `DenominationDetail` 75/83 · `SchoolTypeDetail` 62/70

The JSON-backed pages (Service/Insurance/Scholarship/Accreditation/Denomination/SchoolType)
have a not-found branch but emit **no** robots meta — they are the pre-8/20 pattern and
would produce soft 404s, not noindex, if ever hit. `BlogPost` has a loading branch and
no noindex at all.

## 3. The specific school slugs

None exist — and not merely a slug mismatch. Searching by *name* returns nothing either.

| Slug | In `schools`? |
|---|---|
| `the-goddard-school-of-viera-melbourne-fl` | no row |
| `american-worldwide-academy-miami-fl` | no row |
| `roots-academy-of-brooksville-brooksville-fl` | no row |
| `legacy-christian-school-fort-pierce-fl` | no row |
| `klazia-international-school-davie-fl` | no row |
| `american-high-school-academy-inc-miami-fl` | no row |

`schools` = 2,504 rows, 2,500 with a non-null slug. The current `sitemap.xml` contains
exactly **2,500** school URLs — sitemap and DB are in sync. CLAUDE.md's "~3,600+ schools"
is stale; the table shrank and nobody updated the doc. Those 642 URLs are Google
remembering a larger sitemap.

## 4. The hypothesis — falsified, with a replacement

Tested and rejected: the loading state is a bare spinner `<div>` with no `Helmet`, so a
Googlebot render timeout yields *no* robots directive.

What survives instead:

- All **49** in-sitemap noindexed schools exist in the DB today, all `created_at = 2025-11-28`
  — so they long predate every crawl date in the export. They were not added after the fact.
- No duplicate slugs in `schools` or `resources` (so `.single()` is not erroring on multiple rows).
- RLS on `schools` is `Allow public read access` with qual `true` — anon can read every row.
- Therefore `!school` was false and **`error` was true**: the query itself failed at crawl time.

Corroborating evidence that the host/API fails under crawl load: 29 URLs are
`Blocked due to access forbidden (403)` and 2 returned `Server error (5xx)`. Same site,
same period, same intermittency.

Crawl-date clustering supports a load-related cause rather than a per-page defect —
of the 66, fourteen were crawled on a single day (2026-08-21), and the all-708 crawl
histogram spikes to 118 on 08-21 and 80 on 08-22.

## 5. Soft 404 — yes, the same mechanism

250 URLs, 233 of them 2-segment `/providers/` detail pages. 27 are in the current
sitemap; of the 24 provider slugs among them, **all 24 exist in the DB right now**.
Crawl dates cluster in March–April 2026.

Soft 404 and "Excluded by noindex" are **the same branch at two points in time**.
`curation/events_category_audit_2026-08-20.md:194` records that `ProviderDetail`'s
not-found branch was the only detail page emitting no robots meta, so it returned
HTTP 200 with "Provider Not Found" — textbook soft 404. The 8/20 change added
`noindex, follow` to that exact branch.

**Consequence to expect: the 708 will keep climbing, and that is the fix working.**
As Google recrawls the ~233 provider soft-404s they migrate out of Soft 404 and into
the noindex bucket. The 8/20–8/22 crawl spike (45 / 118 / 80) is that migration
beginning. Do not read further growth in the noindex number as the problem getting worse.

---

## Crawled / Discovered — the phase-2 read

### Discovered - currently not indexed (470) — complete export

All 470 have last-crawled `1969-12-31` (epoch 0) — **Google has never fetched any of them.**
All 470 are in the current sitemap. This is pure crawl budget, not a quality judgment.

| Type | Count |
|---|---|
| `/providers/` detail (2-seg) | 111 |
| **pSEO `/providers/:service/:city`** | **176** |
| `/schools/` detail | 130 |
| `/events/` | 46 |
| `/resources/` | 6 |
| `/educational-resources` | 1 |

### Crawled - currently not indexed (2,346 total; export capped at 1,000)

Treating the export as a sample, as instructed — percentages, not counts:

| Type | Share of sample |
|---|---|
| `/providers/` detail | 51.0% |
| `/schools/` detail | 45.5% |
| `/daycare/` detail | 1.7% |
| `/resources/` | 1.2% |
| `/churches/` | 0.3% |
| **pSEO** | **0.1% (1 URL)** |
| `/events/`, top-level | 0.2% |

96.5% of the sample is provider + school detail pages. 81.9% of the sample is in the
current sitemap.

### pSEO verdict — 360 pages in the sitemap (not 361)

The sitemap carries **360** 3-segment `/providers/:service/:city` URLs, matching the
manifest regen recorded in memory (373 → 361 → 360). Intersecting all nine exports:

| Category | pSEO pages |
|---|---|
| Discovered - not indexed | **176** |
| Crawled - not indexed | **1** (`/providers/aba/pembroke-pines`, crawled 2026-08-21) |
| Excluded by noindex | 0 |
| Soft 404 | 0 |
| 403 / 5xx / duplicate / redirect / alternate-canonical | 0 |

**Read for the phase-2 decision:** the pSEO set has no quality problem. Zero are
noindexed, zero are soft 404, and only one has been crawled and rejected. 176 of 360
(48.9%) have never been fetched at all, and the remaining 183 are neither in a problem
bucket nor flagged — Google simply has not gotten to most of them. Phase 1 launched
2026-08-20, three days before this data. The constraint is discovery/crawl rate, not
page quality, so the phase-2 lever is internal linking and crawl budget, not rewriting
the template.

---

## Low priority

**Server error (5xx) — 2:**
- `/providers/cultivate-behavioral-health-education-coral-gables-coral-gables-fl-10722` (2026-08-20)
- `/providers/top-notch-training-palm-bay-fl-5859` (2026-04-15)

Four months apart, no shared prefix — transient host errors, not a pattern.

**Blocked due to access forbidden (403) — 29:** 15 `/schools/`, 14 `/providers/` detail
pages. **27 of 29 were last crawled 2026-02-25 → 2026-03-02** — a single stale window,
almost certainly a Hostinger WAF / rate-limit episode during a crawl burst. Only one
recent (2026-08-11). Nothing in the code serves 403.

**Confirmed benign, not investigated further:**
- Alternate page with proper canonical (166 rows in export vs 150 reported) — filtered
  `/find-daycares?…`, `/schools?…`, `/providers?…` query-string variants correctly
  canonicalising to their base pages. Working as intended.
- Duplicate without user-selected canonical (3) — 2 providers, 1 school.
- Page with redirect (3) — 2 root variants, `/submit`.

---

## Open question for the fix (not actioned)

Two distinct problems, and they want different fixes — do not treat them as one:

1. **642 stale URLs** — rows deleted from `schools`/`resources`. Currently correct
   (noindex). Only question is whether to leave them decaying or serve real 410s.
2. **66 live pages that flickered** — caused by `error` being treated as
   "not found". A query failure and a missing row are not the same thing and should
   not share a branch. `retry: 1` at `main.tsx:14` makes the flicker window wide.

The 66 is the one that costs indexed pages.
