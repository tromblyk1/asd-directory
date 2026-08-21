# Distance sort on the pSEO pages — feasibility report — 2026-08-20

Report only. Nothing built, nothing changed.

Scope: adding a location input to `/providers/:service/:city` (373 live pages) that
re-sorts the provider list by distance from a user-supplied point.

---

## 0. Answer

**Build ZIP + browser geolocation. Skip typed street address.**

ZIP needs one static asset that does not exist yet — a Florida ZIP→centroid table,
~1,500 rows, ~12 KB gzipped, free and public-domain from the Census ZCTA gazetteer.
Geolocation needs no new data at all and the code is already written in
`findproviders.tsx`. Street address is the only one of the three that requires an
external geocoder, an API key, and a recurring bill, and on a page that is already
scoped to a single city it buys almost nothing over ZIP.

Rough effort: **~1 hour** for geolocation alone, **~4 hours** for ZIP + geolocation
together (most of it sourcing and trimming the gazetteer), **+4 hours and a monthly
bill** if street address is added.

The real risk is not the distance math. It is (a) NaN in the comparator silently
scrambling the list and (b) distance-sorting the paid featured block. Both are
addressed in §4 and §5.

---

## 1. What the coordinate data can support

| Metric | Value |
|---|---|
| Providers (`resource_type='provider'`) | 3,186 |
| With both `latitude` and `longitude` | 3,020 (94.79%) |
| With NULL `latitude` or `longitude` | **166 (5.21%)** |
| With a non-empty `zip_code` | 3,127 |
| With a non-empty `address` | 3,127 |
| NULL-coordinate rows that *do* have a ZIP | **123 of 166 (74%)** |

Per-page exposure, approximating the manifest as (canonical_city × service) groups
with ≥3 providers:

| Metric | Value |
|---|---|
| Candidate page groups | 512 |
| Pages where every provider is geocoded | 394 (77%) |
| Pages with at least one NULL-coordinate provider | **118 (23%)** |
| Worst single page | **8** NULL-coordinate providers |

So roughly one page in four has to have a defined answer for "what does a provider
with no coordinates do in a distance sort." This is not an edge case that can be
waved off.

**The 74% figure is the useful one.** If a ZIP→centroid table is being shipped for the
input anyway, the same table backfills 123 of the 166 missing provider coordinates to
ZIP-centroid precision for free — no extra asset, no extra cost. That takes per-page
coverage from 77% to roughly 94% of pages fully sortable. Worth doing at the same time.

### `cityCoordinates.json` — do not use as an origin

It exists and it is already imported by `ProvidersByCity.tsx:12`, but per the
established provenance note it holds **averaged provider coordinates, not true city
centroids**. It is sound for ranking cities against each other (its current job in the
"nearby cities" block) and unsound as a point presented to a user as "near you" or
"near {city} center." Do not repurpose it as a distance origin.

---

## 2. What is reusable from `findproviders.tsx`

### Reusable as-is

**`calculateDistance` — `findproviders.tsx:21-31`.** Haversine, miles, `R = 3959`.
Pure function, no imports, no React. Copy it or lift it into `lib/utils.ts` and import
from both. This is the whole distance engine; nothing else is needed.

**`requestUserLocation` — `findproviders.tsx:383-403`.** The complete
`navigator.geolocation` pattern including the three-state status machine
(`'loading' | 'success' | 'denied'`), the feature-detect guard, the error branch, and
sensible options: `{ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }`.
Directly liftable, ~20 lines. `enableHighAccuracy: false` is the right default here —
it avoids the GPS warm-up delay, and city-scale accuracy is all this needs.

### Not reusable — because it does not exist

**There is no geocoding anywhere in the codebase.** This is the finding that decides
the scope. `findproviders.tsx` appears to support ZIP search, but line 320 is a plain
string match:

```ts
matchField(provider.zip_code) || ...
```

It matches the typed ZIP against the provider's stored `zip_code` **as text**. It never
converts a ZIP to a coordinate. A user typing `33701` gets providers whose `zip_code`
column literally reads `33701` — not providers *near* 33701. So typed-ZIP-to-distance
is genuinely new work, not a refactor of something already there.

A repo-wide search confirms no ZIP centroid dataset ships today:
`src/frontend/src/data/` holds `cityCoordinates.json`, `pseo/`, `resources/`,
`resourceArticles.ts`, and `resources.zip` (an archive file, not data).

### Partially reusable

`ProvidersByCity.tsx:48-55` already has a `distance()` helper — but it takes two *city
names* and looks them up in `cityCoordinates.json`, with a flat-earth degree
approximation rather than haversine. It is fine for its current job (ranking nearby
cities) and wrong for provider-level distance. Leave it alone; add the haversine
alongside it rather than widening it.

Notably, it **already models the NULL guard correctly** — returns
`Number.POSITIVE_INFINITY` when either city is missing from the lookup, then the caller
filters with `Number.isFinite` at `:153`. That is exactly the pattern §4 recommends, so
the file is already internally consistent with it.

---

## 3. The three input modes, ranked by cost

### A. Browser geolocation — cheapest, but weakest on these pages

- **New data required:** none.
- **New dependencies:** none.
- **Code:** ~30 lines, lifted from `findproviders.tsx:383-403`.
- **Runtime cost:** zero.

Requires HTTPS (the site is), and shows a browser permission prompt. Two real caveats:

1. Denial rates on desktop are high, so the UI must degrade to the current sort
   silently rather than showing an error state.
2. **On a city-scoped page the value is thin.** Without GPS, the browser falls back to
   IP or WiFi triangulation — city-scale accuracy. Every provider on
   `/providers/aba/tampa` is already in Tampa, so a city-scale origin cannot
   meaningfully separate them. It works well on mobile (real GPS); on desktop it will
   often produce a near-arbitrary reordering that *looks* authoritative. If shipped,
   consider gating the sort on `position.coords.accuracy` and ignoring fixes coarser
   than a few miles.

### B. Typed ZIP — the right one to build

- **New data required:** a Florida ZIP→centroid table.
- **New dependencies:** none.
- **Runtime cost:** zero.

Two ways to get the centroids:

| Approach | Cost | Verdict |
|---|---|---|
| **Static JSON, FL only** — ~1,500 ZCTAs × `{zip, lat, lng}`, ≈40 KB raw / ≈12 KB gzipped. Source: US Census ZCTA Gazetteer (public domain). | Free, one-time | **Do this.** No key, no rate limit, no latency, no failure mode. Lazy-import it so it costs nothing until the user actually types. |
| **Geocoding API** (Nominatim or Google) | Key management, rate limits, per-call latency; Nominatim's usage policy discourages autocomplete-style querying | Not worth it to resolve 1,500 static points that never move. |

ZIP is also the input families actually know, it validates trivially (5 digits), and it
needs no autocomplete UI.

### C. Typed street address — skip

- **New data required:** none, but it is unavoidably an API call. No static table can
  resolve arbitrary street addresses.
- **Runtime cost:** Google Geocoding is roughly $5 per 1,000 requests past the free
  tier; Nominatim is free but effectively 1 req/sec and prohibits sustained use.
- **Also brings:** an API key in the client bundle (so a referrer restriction and
  quota alarm are mandatory), debounce logic, an error state, and a loading state.

This is the only one of the three with a recurring bill and an external point of
failure. On a page already narrowed to one city and one service, street-level precision
over ZIP-level changes the ordering of a handful of listings within a few miles of each
other. Not a good trade.

---

## 4. What NULL-coordinate providers do inside a distance sort

**The failure to avoid is silent, not loud.** A comparator that returns `NaN` is
undefined behavior — `a.miles - b.miles` is `NaN` whenever either side is `NaN` or
`undefined`, and V8 will not throw. It will leave the array in an arbitrary order and
nothing will look broken in dev. On the 118 affected pages the entire list ordering
becomes unpredictable, including, potentially, the paid featured block.

So the first requirement is: **the distance function must return a real number for
every row, always.** Follow the pattern already in `ProvidersByCity.tsx:51` — return
`Number.POSITIVE_INFINITY` when a coordinate is missing, never `null`/`undefined`/`NaN`.
`Infinity - Infinity` is still `NaN`, so if two uncoordinated rows can meet in the
comparator, compare with a stable rank rather than a subtraction, or partition them out
before sorting.

Three defensible placement policies:

| Policy | Behavior | Assessment |
|---|---|---|
| **(a) Sink to the bottom** | `Infinity` distance, sorts last, remains visible | **Recommended.** Preserves the page's implicit promise that these providers are listed in this city, while being honest that they cannot be ranked. |
| **(b) Two-tier list** | Distance-sorted block, then a labelled "Distance unavailable" block holding the current completeness ordering | Also fine, and more honest to the user. Slightly more UI. |
| **(c) Hide them** | Filter out before rendering | **Wrong.** Silently drops listings on 118 of 512 pages, up to 8 at once. If any of them is a paying featured listing it disappears from a page it was sold on. |

Note that (a) and (b) both become much less visible if the ZIP centroid backfill in §1
is done at the same time — that pulls 123 of the 166 into the sortable set.

---

## 5. Two things that must not break

**Paid placement.** `ProvidersByCity.tsx:82-83` documents the rule explicitly: every
paying tier outranks free listings, and the tier order must hold on every page.
A naive distance sort applied across the whole array demotes paid listings and breaks
that contract. Distance must replace `rankOf` **only within the non-featured
remainder** — the four featured tier blocks stay pinned above it, in tier order,
untouched. This needs a sign-off from whoever owns the placement policy before it
ships, not an engineering judgment call.

**Canonical URLs.** `canonical` at `:182` is hardcoded per page, which is correct and
must stay that way. If the location input ever writes to the URL as a query param, that
param must be excluded from the canonical and must not create indexable variants of
373 pages. The safest version keeps the location entirely in component state and never
touches the URL — there is no sharing use case that justifies the SEO risk.

**Not a concern:** render cost. Each page loads only its own city's providers (~90 at
the top end, not 3,186), so haversine across the list is negligible. No memoization
beyond the existing `useMemo` is needed.

---

## 6. Suggested build order

1. Lift `calculateDistance` into `lib/utils.ts`; import it in both pages. No behavior change.
2. Ship the FL ZIP centroid JSON (lazy-imported).
3. Backfill the 123 NULL-coordinate providers that have a ZIP, to ZIP-centroid precision. Flag them as approximate so they are not later mistaken for geocoded rows.
4. Add the ZIP input + distance sort over the **non-featured remainder only**, with `Infinity` sinking per §4(a).
5. Add the geolocation button last, reusing `requestUserLocation`, gated on accuracy.

Steps 1–4 are the value. Step 5 is a nice-to-have that mostly helps mobile.
