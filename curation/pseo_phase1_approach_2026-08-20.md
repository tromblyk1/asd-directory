# pSEO city pages, phase 1 — approach

**Date:** 2026-08-20
**Status:** Approach only. No files written, no code changed.
**Scope:** 373 pages = `pseo_page_manifest_2026-08-20.csv` (395) − residential-program (5) − virtual-therapy (17).

---

## Three things to settle before the five questions

### 1. The verified badge ask is the one I would push back on

You want the Verified badge given real visual weight because it is the site's
differentiator. The problem is that `resources.verified` does not mean what the badge
says it means. `ProviderCard.tsx:302` currently renders the tooltip:

> "Verified provider - information confirmed by Florida Autism Services"

Measured against the data, that claim is not supported:

| Source | Provider rows | `verified = true` | % |
|---|---:|---:|---:|
| PATH International | 45 | 45 | **100%** |
| American Hippotherapy Association | 22 | 22 | **100%** |
| manual | 11 | 11 | **100%** |
| Autism Service Dog Program | 5 | 5 | **100%** |
| EAGALA | 5 | 5 | **100%** |
| FL-DD Database | 579 | 476 | 82.2% |
| legacy_migration | 1,114 | 438 | 39.3% |
| Google Places (PT/OT/ST) | 1,231 | 22 | **1.8%** |

The flag tracks **which import batch a row came from**, not whether anyone confirmed
anything. Whole sources are 100% or 0%. 1,145 of 3,181 providers (36%) carry it.

Giving it visual weight on one search page is a small overstatement. Giving it visual
weight as the primary trust signal across 373 new landing pages scales a claim the data
cannot support, on exactly the pages meant to win trust from cold search traffic.

**Two honest options:**

- **(a) Ship the badge with weight, and make the label true first.** Run a real check
  pass on the providers that appear in the manifest — 373 pages draw on far fewer than
  3,181 rows — and reset `verified` to mean "we checked." This is the version that
  actually is a differentiator.
- **(b) Ship phase 1 without elevating the badge.** Leave it as-is, elevate something the
  data does support instead — has a phone we can dial (3,135 of 3,181), has a website,
  has a street address.

I would not do the middle thing, which is making a weak claim louder.

### 2. No prerender means the pSEO premise itself is on the line

This is the decision that matters most and it is not in your list of five. The site is a
pure client-rendered SPA — confirmed: `vite.config.ts` has only `@vitejs/plugin-react`,
`package.json` build is `npm run validate:links && vite build`, no postbuild step, no
`React.lazy`, `index.html` is a bare `<div id="root">`.

So all 373 pages ship as an empty shell that Google must execute JavaScript to see.
Google does render JS, but it is a second-pass, budget-limited queue. The sitemap already
declares **6,397 URLs**; 373 more is a 6% increase against a crawl budget that is already
being spent on a fully client-rendered site.

I am not proposing we add SSG in phase 1 — that is a large change to the build and the
deploy. But go in knowing that phase 1 is a test of whether client-rendered pSEO indexes
on this domain at all, and instrument it that way: ship, then check Search Console
coverage on the 373 before building phase 2.

### 3. Two reuse asks are cheaper and more expensive than they look

- **ProviderCard is genuinely reusable.** Props are just `{ provider, rating? }`
  (`ProviderCard.tsx:54-57`) with no page coupling. It already renders `tel:` links
  (`:439`) and the verified badge (`:293`). Two of your four content asks are already
  done.
- **The filter chips are not reusable as written, and the blocker is not effort — it is
  that the filter system has no concept of a city.** `findproviders.tsx` filters by
  **county** only (`:326-329`). There is a `?county=` URL param (`:150`) but no `?city=`.
  The chips are inline JSX inside a ~1,200-line component wired to 15+ `useState` hooks
  and a Leaflet map. "Reuse with the city preset" means first adding a city dimension to
  the filter model, then extracting the chip UI. That is the single largest piece of work
  in this phase and it is not a landing-page concern.

  **Recommendation: cut filter chips from phase 1.** A landing page for "ABA in Tampa" is
  already the filtered view. Its job is to rank and hand off. Put a "Refine these results"
  link to `/providers?service=aba&county=Hillsborough` and let the existing search page do
  filtering. If the pages index, add the city dimension in phase 2 and inherit it here.
  This also honors "do not build a second filtering system" more faithfully than
  extracting a copy of the first one would.

---

## 1. Route shape and coexistence

**Recommended:** `/providers/:serviceSlug/:citySlug`
Example: `/providers/aba/tampa`, `/providers/speech-therapy/st-petersburg`

Why this and not a flat `/aba-tampa`:

- **No collision with the existing routes.** `App.tsx` declares `/providers`
  (FindProviders) and `/providers/:slug` (ProviderDetail). React Router matches on
  segment count, so a two-segment path can never be captured by the one-segment
  `/providers/:slug`. Nothing about the existing routes changes.
- It keeps the pages inside the `/providers` namespace, so they inherit topical
  proximity rather than starting a new top-level namespace.
- It leaves `/resources/services/:slug` (ServiceDetail) untouched as the explainer
  destination, which is what your "link it, do not repeat it" rule needs.

**City slugs are safe.** I checked every distinct `canonical_city` through
`lower()` + non-alphanumeric→hyphen: **zero collisions**. `ST. PETERSBURG` →
`st-petersburg` uniquely.

**One route entry, added after the existing provider routes:**

```
/providers/:serviceSlug/:citySlug  →  ProviderCityLanding
```

**Non-manifest combos must hard-404, not render empty.** If `/providers/aba/anywhere`
renders a page with zero providers, we have built an infinite thin-content generator —
the fastest way to get a manual action. The component checks the combo against the
manifest first and renders the 404 path if absent.

## 2. Static generation vs dynamic route

**Recommended: one dynamic route reading a committed manifest. Do not add SSG in phase 1.**

| | Dynamic route + manifest | Static generation |
|---|---|---|
| Build change | none | new prerender step, Puppeteer or vite-ssg |
| Deploy change | none — `dist/` shape unchanged | 373 new HTML files through SFTP |
| Hostinger | works today, `.htaccess` already rewrites all deep URLs to `index.html` | works, but 373 more files per deploy |
| SEO | JS-render dependent | real HTML, materially better |
| Cost | ~0 | days, plus a fragile postbuild |

The deploy script "overwrites but never deletes" (per `CLAUDE.md`), so 373 prerendered
files also mean 373 stale files to clean whenever the manifest changes.

The SPA fallback is already in place — `src/frontend/public/.htaccess` rewrites anything
that is not a real file or directory to `index.html`. New URL patterns work on Hostinger
with no host config change.

**The honest trade:** SSG is the technically correct answer for pSEO and I am
recommending against it for phase 1 purely on cost-of-being-wrong. If 373 client-rendered
pages do not index, we learn that for near-zero build work. If they do index, SSG becomes
a justified phase-2 investment with evidence behind it.

**One thing to fix regardless: the page must not fetch the whole table.**
`findproviders.tsx:219-250` pulls **all 3,192 provider rows with `select('*')`** in four
paginated round-trips on mount. That is defensible for a search page with a map. It is
not defensible for a landing page showing 3-90 providers, and it would be the single
biggest drag on Core Web Vitals across all 373. The landing page issues its own scoped
query: `resource_type='provider'` + `canonical_city = ?` + `? = ANY(services)`, selecting
only the columns `ProviderCard` reads.

## 3. How the manifest gets into the app

**Recommended: committed JSON, generated from the DB by a script, checked into git.**

`src/frontend/src/data/pseo/cityPages.json` — one entry per page: service slug, city
slug, display city, provider count, band, and the sibling services for the cross-link row
(derivable from the manifest at generation time, so the page does no work for it).

Why committed rather than queried at runtime:

- **The manifest is a curation decision, not a live fact.** `single_city >= 2` and the
  two dropped services are judgments. A runtime query would silently re-derive a
  different page set as rows are added — and the domain-decay work already showed
  curation adds rows under closed audits.
- **The route guard and the sitemap must agree.** Both read one file. If the page set is
  computed at runtime it can drift out of sync with a sitemap generated at a different
  moment, producing indexed URLs that 404 and live URLs Google never hears about.
- It is ~373 small objects. Trivial payload, zero network cost, no loading state.

Not committed: the provider rows. Those stay a live query, so listings never go stale.

**Regeneration is deliberate and reviewable** — run the script, look at the git diff, see
exactly which pages appear and disappear. That is the right amount of friction for
something that changes the indexed surface of the site.

Note the existing convention this follows: `src/frontend/src/data/resources/**/*.json`
already holds committed content read at runtime, and `generate-sitemap.js:46-64` already
scans those folders.

## 4. Sitemap and canonical

**Sitemap.** `generate-sitemap.js` at the repo root, currently emitting **6,397 URLs** to
`src/frontend/public/sitemap.xml`. It is **not** wired into `npm run build` — it runs
manually as `node generate-sitemap.js`. Extend it with one block that reads the committed
manifest JSON and emits `/providers/{service}/{city}`. New total ≈ **6,770**.

It also writes `robots.txt`, which already declares the sitemap. No change needed there.

**Two things worth flagging:**

- The manual run is the weak link. The manifest, the route guard and the sitemap have to
  move together; today the sitemap moves only when someone remembers. Wiring
  `generate-sitemap.js` into the build is a separate change I am not proposing here, but
  it is the obvious follow-up.
- The sitemap is generated into `public/`, so it is only picked up by the *next* build.
  Regenerate → build → deploy, in that order.

**Canonical.** Every page hand-rolls its own Helmet block; there is no shared SEO
component (`ProviderDetail.tsx:282`, `ServiceDetail.tsx:162` are the pattern). Follow it:
self-referential canonical, `https://floridaautismservices.com/providers/{service}/{city}`,
lowercase, no trailing slash, no query string.

The important canonical decision is what these pages must **not** do: they must not
canonical to `/providers` or to the service page. A self-referential canonical is what
declares them as independent destinations. If we are not willing to say these pages are
distinct enough to stand alone, we should not ship them.

**JSON-LD:** `ItemList` of the providers, plus `BreadcrumbList`
(Home → Providers → Service → City). Do **not** emit `LocalBusiness` per provider here —
`ProviderDetail.tsx:290` already owns that, and duplicating it across a list page
competes with the canonical source.

## 5. What breaks in existing components

| Component | Reusable as-is? | What is needed |
|---|---|---|
| `ProviderCard.tsx` | **Yes** | Nothing. Props are `{ provider, rating? }` (`:54-57`), no page coupling. Already renders `tel:` (`:439`) and the verified badge (`:293`). |
| `TooltipProvider` | n/a | Must wrap the whole list once, not per card — `CLAUDE.md` documents this as a known perf trap. |
| `useProviderRatings` | Yes | Optional `rating` prop; the page can pass nothing initially. |
| Featured tier sort | **Must be copied** | `findproviders.tsx:346-379` ranks premium → enhanced → basic → other → daily-seeded shuffle. This is paid placement. If the landing pages do not honor it, we are selling placement that 373 pages ignore. |
| Filter chips | **No** | No city dimension exists (`:326-329` is county-only); chips are inline in a 1,200-line component. See recommendation to cut from phase 1. |
| Provider query | **No** | `:219-250` fetches all 3,192 rows with `select('*')`. Landing page needs its own scoped query. |
| `App.tsx` | Additive only | One new `<Route>`. No existing route changes. |
| `generate-sitemap.js` | Additive only | One new block. |

**Two data notes for the page content:**

- ZIP spread is viable — 3,127 of 3,181 providers have a `zip_code`.
- **11 providers have no `slug`** and therefore cannot link to a detail page. The card
  needs to degrade rather than emit a broken `/providers/null` link. Worth checking
  whether any of the 11 land in the manifest before deciding how to handle it.
- `ProviderCard` displays `provider.city`, while the manifest groups on
  `canonical_city`. Providers grouped into `ST. PETERSBURG` may display a variant
  spelling on their card. Cosmetic, but visible on exactly these pages.

---

## What I would build in phase 1, in order

1. Manifest generator script → `src/frontend/src/data/pseo/cityPages.json` (373 entries).
2. `ProviderCityLanding` page: scoped query, manifest guard + 404, Helmet block with
   self-referential canonical, `ItemList` + `BreadcrumbList` JSON-LD.
3. Content: H1 (service + city), provider count, ZIP spread, `ProviderCard` list with the
   featured tier sort, cross-link row from the manifest, hand-authored nearby-city links,
   a link to the service explainer, and a "Refine these results" link into `/providers`.
4. One route in `App.tsx`.
5. One block in `generate-sitemap.js`.

**Deferred out of phase 1:** filter chips (needs a city dimension in the filter model),
SSG, medicaid pages, and any change to the verified badge until the label is true.

**Open decision I need from you:** which verified option — (a) run a real check pass on
the manifest providers first, or (b) ship without elevating the badge.
