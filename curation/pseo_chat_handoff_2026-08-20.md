# pSEO handoff — 2026-08-20

For the pSEO chat. Covers what landed today, one open decision that needs an answer
before more manifest work, and the proposed approach for the location input on
`/providers/:service/:city`.

Written to be read cold — the pSEO chat has not seen the deletion batch outcome.

---

## 0. Status

| Item | State |
|---|---|
| 22-record deletion batch | Applied by curation |
| Provider count | **3,167** (reconciled exactly, §1) |
| pSEO manifest | Regenerated against live data — **373 pages**, 3 added / 3 removed (§2) |
| Sitemap | 6,660 URLs, unchanged total; 6 pSEO URLs swapped |
| Build + deploy | Done, 131 files to Hostinger |
| Commit | `fc0d64e`, pushed |
| `resources_set_slug` trigger | **APPLIED** (§4) |
| Manifest source of truth | **Open decision — §3** |
| Location input | **Approach proposed, not built — §5** |

---

## 1. Count reconciliation

Curation deleted 22 records. One (9800) was `resource_type='educational'`, so 21 were
providers. An earlier measurement said 19, and the working hypothesis was that two
deletions landed late. **That hypothesis was inverted — the gap was additions, not
deletions.**

| | |
|---|---|
| Baseline at time of earlier count | 3,186 |
| Provider deletions | −21 |
| Created after that baseline | **+2** |
| Predicted | 3,167 |
| **Actual** | **3,167** ✓ |

The two late rows: **10728** Child Advancement Center - Winter Park (2026-08-20 09:48,
`manual_curation_2026-08`) and **10729** Foundational Potential Consulting, PALM BAY
(2026-08-20 16:13, `source='submission'`). The ten Cultivate rows (10718–10727) were
created 2026-08-19 16:30 and were already inside the baseline — but *not* inside the
committed manifest. That distinction is what §3 is about.

All 22 batch ids confirmed gone. All four survivors present: 9855, 9965, 8519, 5848.
Slugless provider rows: 0.

**9855 Watson Clinic is NOT deleted.** It looked like a duplicate of 9965 only because
its address was wrong; curation corrected it to 1430 Lakeland Hills Blvd, ZIP 33805.
It is Watson Clinic's third Lakeland location and its URL stays live — exclude it from
any soft-404 handling.

---

## 2. Manifest diff — 373 → 373, six pages swapped

Recomputed all (service, canonical_city) combos from live data, applying the rule from
`pseo_build_manifest_2026-08-20.md:24` — `providers >= 5`, **or** `providers` in 3–4
**and** `single_city >= 2` — with `residential-program` and `virtual-therapy` excluded
per `tools/generate_pseo_manifest.mjs:12`.

### Added (3)

| Page | providers | single_city |
|---|---|---|
| `/providers/occupational-therapy/riverview` | 4 | 2 |
| `/providers/physical-therapy/riverview` | 3 | 2 |
| `/providers/speech-therapy/riverview` | 4 | 2 |

All three come from the 10 Cultivate rows created 2026-08-19. **These pages should have
existed before this deletion batch.** They were absent because the committed manifest
was generated from a CSV built before those rows landed. See §3.

### Removed (3)

| Page | was | now | why |
|---|---|---|---|
| `/providers/occupational-therapy/brandon` | 5 | 4, single_city 0 | fails the 3–4 band's `single_city >= 2` arm |
| `/providers/speech-therapy/brandon` | 5 | 4, single_city 0 | same |
| `/providers/music-therapy/hollywood` | 3 | **2** | merge side-effect, below the floor of 3 |

`music-therapy/hollywood` is the one worth understanding. 6399 was **merged into 5848**,
not plain-deleted — but 5848 (Cadenza Center for Psychotherapy & the Arts) already
carried the `music-therapy` tag. Absorbing 6399 therefore removed a row without adding
a tag, and the combo fell 3 → 2. The only survivors are 5848 and 7631 (Kids Miracle
Steps PPEC).

The other merge, **7382 → 8519** (Tampa Pediatric Psychology), changed no page
memberships: 8519 already held every service 7382 contributed.

### Near-misses to watch

| Page | providers | single_city | risk |
|---|---|---|---|
| `/providers/occupational-therapy/port-st-lucie` | 7 → **5** | 3 → **1** | passes only on the `>=5` arm now; one more loss breaks it |
| `/providers/physical-therapy/holly-hill` | 5 → **4** | 3 | holds — 3–4 band, single_city ≥ 2 |

### Sitemap delta

Total unchanged at **6,660**. Providers 3,167, pSEO 373. The three added and three
removed pSEO URLs cancel out, so the net URL delta is zero but six URLs are different.

---

## 3. OPEN DECISION — manifest source of truth

### The problem

`tools/generate_pseo_manifest.mjs` reads a hardcoded, dated CSV. To regenerate today's
manifest without destroying the pre-deletion artifact, the input was moved to
`curation/pseo_page_manifest_2026-08-20_post_deletions.csv` and the generator repointed
at it (two lines).

**`curation/` is untracked.** So `cityPages.json` — which *is* committed — is generated
from a source that is not in git. That defeats the point of committing the manifest.

### Recommendation: have the generator read the DB directly and write the CSV as an *output*

The argument is not tidiness. It is that the two-step process already broke silently,
and §2 is the evidence. Three Riverview pages should have existed before this batch.
They didn't, because someone hand-ran the SQL, pasted a CSV, and the Cultivate rows
landed after that. The committed manifest was stale in a way nobody could see, because
the input it came from was neither in git nor reproducible.

Moving the CSVs into a tracked folder fixes the *visibility* half of that and leaves the
*drift* half completely intact. The next batch drifts the same way.

There is a second cost to the status quo. The manifest rule — the two thresholds plus
the whole domain-based `single_city` derivation — currently exists only in a markdown
doc and in whatever SQL happens to be in someone's editor. It had to be reconstructed
from scratch this session and validated 11/11 against known rows before it could be
trusted. That reconstruction should not have been necessary and should not be necessary
again.

**Precedent already exists:** `generate-sitemap.js` queries Supabase directly. The
client and credentials are already wired into the repo. This is not new infrastructure.

**Cost:** roughly 45 minutes. And it means the rule has to be *right* in code rather
than approximately right in a doc.

**The honest counter-argument:** moving the files is a two-minute `git mv`, and encoding
a nontrivial rule in JS creates a new place for it to be wrong. That is real. But the
alternative is re-deriving the rule by hand every time curation closes a batch, which is
the worse failure mode — and it is the one that just happened.

Either way, the dated CSV should keep being written into `curation/` as an audit trail.
Just as an output, never as an input.

### The derivation, for whoever implements it

Validated 11/11 against known manifest rows, including the `aba`/TAMPA 90/44/15/31
four-way split.

```sql
WITH base AS (
  SELECT canonical_city, services,
    NULLIF(split_part(
      regexp_replace(regexp_replace(lower(coalesce(website,'')), '^https?://', ''), '^www\.', ''),
      '/', 1), '') AS domain
  FROM resources
  WHERE resource_type='provider' AND canonical_city IS NOT NULL
), dom_cities AS (
  SELECT domain, count(DISTINCT canonical_city) AS n_cities
  FROM base WHERE domain IS NOT NULL GROUP BY 1
), ex AS (
  SELECT b.canonical_city, unnest(b.services) AS service, b.domain, dc.n_cities
  FROM base b LEFT JOIN dom_cities dc USING (domain)
)
SELECT service, canonical_city, count(*) AS providers,
  count(*) FILTER (WHERE domain IS NOT NULL AND n_cities = 1) AS single_city,
  count(*) FILTER (WHERE domain IS NOT NULL AND n_cities > 1) AS multi_city,
  count(*) FILTER (WHERE domain IS NULL)                      AS no_website
FROM ex GROUP BY 1,2;
```

Notes: no-website rows are a **disjoint third bucket**, not folded into either
`single_city` or `multi_city`. Band is derived from `providers`: `25+` / `10-24` /
`5-9` / `3-4`.

---

## 4. Slug trigger — APPLIED

`supabase/migrations/resources_set_slug.sql` has been run. A test insert that omitted
`slug` returned `trigger-test-clinic-deltona-fl-10730` with `canonical_city` populated.
That single result confirms both open questions:

- **`NEW.id` is available in a BEFORE INSERT trigger.** Postgres applies column defaults
  before row-level BEFORE INSERT triggers fire, so the id is already drawn from
  `nextval('resources_id_seq')`. No AFTER INSERT pass and no generated column needed.
- **Trigger ordering holds.** The city segment is present, which means
  `resources_set_canonical_city` fired first. Postgres orders same-timing triggers
  alphabetically by name, and `resources_set_c…` sorts before `resources_set_s…`.

Test row deleted. The migration file carries an `APPLIED 2026-08-20` header with this
evidence.

**Standing hazard:** renaming either trigger so the alphabetical order flips fails
*silently*. `canonical_city` would still be NULL when the slug trigger reads it, the
city segment would slugify to `''`, and every new slug would come out as
`name-fl-{id}`. No error, no constraint violation — and slugs are permanent once set.

---

## 5. Location input on `ProvidersByCity.tsx` — proposed approach

Per `curation/pseo_location_distance_sort_2026-08-20.md`. **Nothing built yet.**

Scope: typed ZIP + browser geolocation. Street address skipped — it is the only one of
the three with an API key, a recurring bill, and an external point of failure, and on a
page already scoped to one city and one service it buys almost nothing over ZIP.

### 5a. ZIP centroid table

- **Location:** `src/frontend/src/data/flZipCentroids.json`
- **Shape:** keyed by ZIP, 2-element array value to keep it small —
  `{ "33701": [27.7726, -82.6360], … }`
- **Size:** ~1,500 FL ZCTAs, ≈40 KB raw / ≈12 KB gzipped
- **Source:** US Census ZCTA Gazetteer — public domain, no key, no rate limit, no
  attribution requirement, and the points never move

**Loading: lazy `await import()` on first location activation** — not on page load, and
not at the Supabase query. One lazy import serves both the user's ZIP lookup and the
NULL-coordinate provider backfill. Vite code-splits it automatically, so all 373 pages
carry zero extra bytes unless someone actually uses the control.

> **Confirm this reading.** The requirement says "backfill at query time." This
> interprets that as the *distance* query, not the *database* query — nothing on the
> page renders differently until a location is active, so the backfill isn't needed
> until then either. If the backfill should instead happen at the Supabase-query level
> so it is available regardless, the table has to load **eagerly on every pSEO page**.

### 5b. Coordinate resolution, per provider

In precedence order:

1. `latitude` && `longitude` both non-null → **exact**
2. else `zip_code` hits the centroid table → **approximate**, flagged in UI
3. else → **unlocatable**

Current coverage: 3,020 of 3,186 providers geocoded (94.8%); of the 166 missing, **123
(74%) have a ZIP**, so step 2 recovers them. That takes per-page coverage from ~77% to
~94% of pages fully sortable.

### 5c. How the sort composes with the featured block

`ordered` gains exactly one new input: `origin: {lat, lng} | null`.

**`origin === null` → the existing memo is returned untouched.** No behavior change on
any of the 373 pages.

**`origin` set** — the featured block is computed exactly as today and pinned above,
unmodified. Only `nonFeatured` changes:

```
[ premium, enhanced, basic, other,            ← untouched, current paid tier order
  ...locatable   sorted by miles ascending,
  ...unlocatable sorted by current completeness rank ]
```

`nonFeatured` is **partitioned before sorting**, not sorted with a sentinel value.
Unlocatable rows never enter the distance comparator at all, so it only ever sees finite
numbers.

> This is deliberately stronger than the `Number.POSITIVE_INFINITY` recommendation in
> the earlier feasibility report. `Infinity - Infinity` is `NaN`, so the sentinel
> approach still has a hole whenever two uncoordinated rows meet in the comparator — and
> a comparator returning `NaN` is undefined behavior in V8. It does not throw; it leaves
> the array in an arbitrary order, including, potentially, the paid featured block.
> Partitioning closes that hole by construction.

The unlocatable group keeps today's `rankOf` + seeded-shuffle ordering and renders under
a labeled "Distance unavailable" divider — **never interleaved, never hidden**. Hiding
them would silently drop listings on ~118 of 512 candidate page groups, up to 8 at once,
and any one of them could be a paying featured listing on a page it was sold on.

Distance is computed once per provider into `{provider, miles, approx}` before sorting,
so haversine runs N times rather than N log N. Render cost is negligible regardless —
each page loads only its own city's providers (~90 at the top end, not 3,167).

**Haversine goes local to `ProvidersByCity.tsx`.** `calculateDistance` is *not* being
lifted out of `findproviders.tsx:21-31` — that is a refactor of a file outside this
task. ~10 lines of deliberate duplication.

### 5d. UI

A compact control bar between the "N providers listed" line and the Refine button.

- **Mobile:** "Use my location" button first, ZIP input beneath.
  **Desktop:** ZIP input first, geolocation secondary.
  One markup block with Tailwind `order-*` responsive classes, not two.
- ZIP validates on 5 digits. No autocomplete, no debounce needed.
- **Geolocation is accuracy-gated.** Reuses the `requestUserLocation` pattern from
  `findproviders.tsx:383-403` (`{ enableHighAccuracy: false, timeout: 10000,
  maximumAge: 300000 }`), but if `position.coords.accuracy` exceeds ~8 km the sort is
  **not** applied and the control says so. On desktop the browser falls back to IP or
  WiFi triangulation at city scale — and every provider on `/providers/aba/tampa` is
  already in Tampa, so an ungated version would produce a confident-looking random
  reordering. Denial degrades silently to the current sort, no error state.
- Active state: `Sorted by distance from 33701 · Clear`
- Per-card distance: `4.2 mi` exact, `~4 mi (ZIP area)` approximate.

### 5e. URL

**Location lives in component state only. Never a query param.** `canonical` at
`ProvidersByCity.tsx:182` stays hardcoded per page. No indexable variants of the 373
pages, and there is no sharing use case that justifies the SEO risk.

---

## 6. Questions blocking the build

1. **ZIP centroid JSON** — has to be downloaded from the Census gazetteer and trimmed to
   Florida. Confirm, or supply a local copy.
2. **Per-card distance rendering** — cleanest is an optional prop on `ProviderCard`, but
   that component is flagged CRITICAL and is shared with `findproviders.tsx`. An
   optional prop defaulting to `undefined` is non-breaking there. The alternative is
   rendering the chip in a wrapper *around* the card in `ProvidersByCity` and leaving
   `ProviderCard` untouched. Which?
3. **Control bar placement** — currently proposed above the Refine button. That button
   was deliberately moved up recently, so confirm the location controls belong above it
   rather than below.
4. **§3** — DB-reading generator, or tracked CSV? Blocks the next manifest regeneration,
   not this build.
