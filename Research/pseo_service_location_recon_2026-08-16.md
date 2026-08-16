# Phase 1 Recon — Programmatic SEO Service+Location Landing Pages

**Date:** 2026-08-16
**Status:** Recon only. No code written or modified.
**Repo:** `C:\Projects\ASD-Directory` (frontend at `src/frontend`)

## Goal

GSC shows the site ranks well for navigational queries (specific school/provider names) but gets
essentially zero traffic from discovery queries like "aba therapy tampa" or "speech therapy
jacksonville." No page targets those queries. This document reports what exists today and
recommends how to close that gap.

---

## 1. Rendering / indexing — the blocker

**There is no prerendering of any kind.** `src/frontend/package.json` — the entire build is:

```
"build": "npm run validate:links && vite build"
```

`vite.config.ts` has no prerender/SSG plugin. No react-snap, no vite-react-ssg, no
`@prerenderer/*`. The build emits exactly one HTML file: `dist/index.html`, whose `<body>` is
`<div id="root"></div>` plus a module script. Every one of the 6,397 sitemap URLs currently serves
that same empty shell. All content — provider names, services, cities — is fetched client-side
from Supabase after hydration.

Google does execute JS, but rendering is a deferred second-pass queue. For a low-authority domain
adding hundreds of near-identical thin routes at once, that is the least reliable place to spend
crawl budget.

**The good news:** `src/frontend/public/.htaccess` lines 9-13:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

The SPA fallback only fires when the requested file or directory **doesn't exist**. Dropping a real
`dist/providers/aba-therapy-tampa/index.html` into the build output means Apache serves it
directly and the rewrite never runs. **Prerendering requires zero Hostinger config changes.**

### Options and tradeoffs

| Approach | How it fits | Cost / risk |
|---|---|---|
| `@prerenderer/rollup-plugin` (maintained successor to prerender-spa-plugin) | Puppeteer renders existing React routes at build time, writes real HTML. One codebase, one component. | Adds Puppeteer (~300MB). Build time scales with routes — 700 routes at ~1-2s each is a 10-25 min build. Needs a "data ready" signal since TanStack Query is async. |
| react-snap | Same idea, near-zero config. | Effectively unmaintained (last real release 2020); peer-deps fight React 18. Avoid. |
| **Custom build-time HTML generator** (Node script queries Supabase, emits static HTML per combo) | No headless browser, fast (~seconds for 700 pages), total control over markup and JSON-LD, guaranteed crawlable. | A second rendering path to maintain alongside React. Pages are static-at-build; filtering/map needs a link into the SPA. |
| Migrate to Astro or Next SSG | Purpose-built for this. | Full rewrite of 40+ pages. Not worth it for one feature. |

**Recommendation: the custom build-time generator.** These landing pages are documents ("here are
99 ABA providers in Tampa"), not app screens. They don't need the map, filter panel, or Leaflet.
Real HTML gets guaranteed indexation, sub-second loads, and a ~10-second build step instead of 25
minutes. Each page links into the existing SPA (`/providers?service=aba&city=Tampa`) for the
interactive view.

Honest cost: it is a second way of building a page in this repo. Still the right call — the
alternative is a Puppeteer dependency plus a build slow enough that it stops getting run.

---

## 2. Existing SEO utilities

**`src/utils/seo.ts` is dead code.** Its only importer in the entire tree is
`src/_archive/App.tsx.OLD`. Zero live pages call `updateSEO` or `generateStructuredData`.

**`react-helmet-async` is the live pattern.** `HelmetProvider` wraps the app at `src/main.tsx:23`,
and ~12 pages use `<Helmet>`: Blog, BlogPost, about, contact, Donate, ChurchDetail, DaycareDetail,
AccreditationDetail, DenominationDetail, DaycareResourceDetail, ServiceDetail, ProviderDetail.

**They don't conflict**, only because seo.ts is never invoked. If it were, it would — both write to
`document.head` by different mechanisms, and seo.ts's imperative DOM manipulation would fight
Helmet's reconciliation.

**JSON-LD status:** ProviderDetail **does** emit it — `ProviderDetail.tsx:290-300`, a
`LocalBusiness` schema with name, PostalAddress, telephone, url, and GeoCoordinates. No equivalent
found on SchoolDetail; confirm separately if schools matter to this effort.

**Going forward:** use Helmet. Delete seo.ts as dead code (separately, not as part of this work).
If we use the static generator, it emits `<head>` directly and Helmet isn't involved for those pages.

---

## 3. Existing category pages

`/resources/services/:slug` → `ServiceDetail.tsx`. Loads a hand-written JSON file
(`src/data/resources/services/*.json`) with `description`, `whoProvides`, `whatToExpect`,
`benefits`, `whoCanBenefit`, `links`. It is **purely editorial** — never queries the `resources`
table, no concept of location. It carries a `slugToServiceFilter` map (`ServiceDetail.tsx:28-56`)
used only to build a link into `/providers?service=X`.

**New routes; don't extend these.** Different intent (what *is* ABA therapy vs. who provides it
near me), different data source, different template. Keep these as the editorial hub and link them
*down* to the new location pages — hub-and-spoke, which also gives the new pages internal link
equity from day one.

---

## 4. Data availability

Queried live 2026-08-16. `resources` has 3,339 rows with `resource_type='provider'`; 3,061 have a
non-empty `services[]`, 3,339 have `city`, 3,126 have `county`, 3,076 have coordinates.

### Combination counts

| | total | **>=3 providers** | **>=5 providers** | >=10 |
|---|---|---|---|---|
| service + city | 1,509 | **468** | **260** | 110 |
| service + county | 471 | **251** | **190** | 117 |

**A >=3 threshold yields ~719 pages; >=5 yields ~450 — not the ~2,000 originally scoped.**
Materially smaller and more tractable, and it lowers the indexation risk.

Target queries are well covered: `aba`/TAMPA = **99 providers**, `speech-therapy`/JACKSONVILLE =
**45**. ABA in Miami and Jacksonville are 91 each.

Supporting data:
- `src/data/cityCoordinates.json` — 286 entries, `{latitude, longitude}` keyed by uppercase city
  name. Usable for map embeds and `geo` JSON-LD.
- `src/lib/serviceDefinitions.ts` — editorial title/short/long copy per service. Exactly the
  reusable unique-content block these pages need.

### Two data problems that must be fixed first

1. **City values are not normalized.** `ST. PETERSBURG` (33 providers), `SAINT PETERSBURG` (2), and
   `ST PETERSBURG` (1) are three distinct values. Same pattern for St. Augustine, St. Cloud, St.
   Johns. Generating slugs from raw values produces competing duplicate URLs for one city, splits
   provider counts, and can push a real city below threshold. There is also junk in the field — one
   row's city is `BLDG. A`, an address line that leaked in.
2. **Service slug drift.** The DB has **24** distinct services; CLAUDE.md documents 20. Four have
   exactly one provider (`autism-travel`, `financial-planning`, `transportation`, `art-therapy`)
   and should be excluded from generation regardless of threshold.

Also: 278 distinct cities, 53 distinct counties (of Florida's 67).

### Service distribution (providers per service)

aba 1560, physical-therapy 955, occupational-therapy 741, speech-therapy 633, life-skills 496,
parent-coaching 225, group-therapy 211, virtual-therapy 155, ados-testing 126, residential-program
121, feeding-therapy 119, animal-therapy 108, mobile-services 104, support-groups 95, respite-care
46, executive-function-coaching 42, tutoring 35, music-therapy 34, aac 10, dir-floortime 5,
autism-travel 1, financial-planning 1, transportation 1, art-therapy 1.

---

## 5. Sitemap

`generate-sitemap.js` sits at the **repo root**, not in `src/frontend`. Standalone CommonJS, run by
hand (`node generate-sitemap.js`), **not wired into `npm run build`**. It fetches slugs from
Supabase via the REST API (anon key hardcoded at line 16 — public by design, but committed), merges
in local JSON filenames for resource categories, and writes both `sitemap.xml` and `robots.txt`
into `src/frontend/public/`.

Current output: 6,397 URLs — 3,330 providers, 2,505 schools, 300 daycares, 140 events, 52
resources, 43 churches, 8 guides, 6 blog, plus static pages.

Adding new URLs means adding a generator block to this script. Because it is manual it has already
drifted — the 2026-08-17 guide publish needs a manual sitemap regen for exactly this reason. Fold
sitemap generation into the same build step as the landing pages so they cannot desync.

---

## 6. Internal linking

ProviderDetail has a "Find Similar Providers" card (`ProviderDetail.tsx:687-707`) linking the
provider's first three services to `/providers?service=${service}`. That is a **query-string filter
into the SPA** — not a crawlable destination, and it passes no meaningful link equity.

Beyond that, provider pages link only back to `/providers` (lines 201, 306). **Provider detail
pages do not link to `/resources/services/:slug` at all**, and nothing links by city or county.

The opportunity: retarget that card to the new landing pages (`/providers/aba-therapy-tampa`) and
add a "Providers in {city}" / "Providers in {county} County" block. With 3,339 provider pages
already indexed and ranking for navigational queries, they are the best available source of
internal links — this is what gets 700 new pages discovered without waiting on the sitemap alone.

---

## Recommended approach

1. **Fix city normalization first.** A canonical-city → variants slug map in the DB or a lookup
   table. Schema before UI; everything downstream depends on it.
2. **Threshold at >=5 providers** → ~450 pages. Below 5, a directory page of 3 providers is thin
   content and risks a site-wide quality signal, which is the real downside here. Start at 5; drop
   to 3 later per-service if the >=5 cohort performs.
3. **Build a static generator** emitting real HTML per combination at build time, with unique
   content per page: `serviceDefinitions.ts` long copy, the actual provider list, city/county
   context, and `ItemList` + `LocalBusiness` JSON-LD.
4. **Wire sitemap generation into the same script** so URLs cannot drift.
5. **Add internal links** from provider detail pages (service + city + county) and from the
   editorial `/resources/services/:slug` hubs.
6. **Ship a ~20-page pilot first** — top cities x top 4 services — and wait for GSC to confirm
   indexation before generating all 450. Highest-value step: if indexation doesn't work, you find
   out after 20 pages instead of 450.

---

## Blockers and pushback

- **"2,000 new routes"** — it is ~450-719 depending on threshold. Smaller and safer than scoped.
- **"We have no pages targeting those queries"** — technically true for crawlers, but
  `/providers?service=aba` already renders that result set. The gap is that it is a query string
  behind client-side rendering, so it can neither be indexed nor ranked. The data path exists; only
  the crawlable surface is missing.
- **The indexing problem is not new.** All 6,397 existing URLs serve an empty shell. Prerendering is
  worth evaluating for provider/school detail pages too, but that is a separate, larger decision and
  should not be bundled into this.
- **Unresolved dependency:** the `validLinks.json` validator bug (soft-404 substring match on `404`
  in `src/frontend/tools/validateResourceLinks.mjs`) is still live and runs on *every* build. Any
  build that generates these pages also regenerates that file and can drop working links. Fix before
  this project starts producing builds.
