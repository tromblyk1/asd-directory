# Collapsing the `dir-floortime` / `floor-time` duplicate (2026-08-21)

**Report only. Nothing was changed.**

**Short answer: yes to both — `/resources/services/floor-time` is in `sitemap.xml` AND in
`validLinks.json`, and so is `/resources/services/dir-floortime`. Both pages are live, both are
submitted for indexing, and both render the same 11 providers.** That is the actual cost here:
this isn't a stray file, it's a published duplicate-content pair the site has been telling Google
to crawl.

## What exists

| | `dir-floortime` | `floor-time` |
|---|---|---|
| JSON file | ✓ modern shape | ✓ **legacy shape** |
| `slug` / `category` fields | ✓ | **absent** |
| `shortDescription` | ✓ | absent |
| `benefits` / `whoCanBenefit` | ✓ | absent |
| `links` | 1 (ICDL, with description) | 3 (ICDL, Profectum, Autism Speaks) |
| In `sitemap.xml` | ✓ line 148 | ✓ line 172 |
| In `validLinks.json` | ✓ line 177 | ✓ line 127 |
| Is the DB slug | **✓ (11 providers)** | ✗ (0) |

`floor-time.json` predates the schema — it has no `slug` field at all, which is why it never shows
up in slug-based sweeps. `dir-floortime.json` is the correct, current-shape file.

**The badge links point at the wrong one.** Every DIR/Floortime badge on the site sends users to
`floor-time`, the file that isn't the slug and has the thinner content.

## The six live references to `floor-time`

| # | Location | What it does |
|---|---|---|
| 1 | `ProviderCard.tsx:72` | badge link → `/resources/services/floor-time` |
| 2 | `DaycareCard.tsx:85` | badge link → `/resources/services/floor-time` |
| 3 | `ServiceDetail.tsx:36` | `'floor-time': 'dir-floortime'` — the route resolves and filters correctly |
| 4 | `validLinks.json:127` | `"services/floor-time"` with its 3 outbound links |
| 5 | `sitemap.xml:172` | submitted URL |
| 6 | `floor-time.json` | the file itself |

Line 3 is why nothing is broken today: `ServiceDetail` already maps `floor-time` back to the
`dir-floortime` filter, so both URLs render a working page listing the same 11 providers.

`dir-floortime` is **not** in the pSEO manifest — 11 providers is under the threshold — so no
`/providers/dir-floortime/:city` pages are affected. That removes the biggest complication.

## What the collapse would take

Six edits, in this order. It is small, but three of them touch indexed URLs, which is the part
that needs care rather than effort.

1. **`ProviderCard.tsx:72`** — link → `/resources/services/dir-floortime`
2. **`DaycareCard.tsx:85`** — same
3. **`floor-time.json`** — merge the two extra links (Profectum, Autism Speaks) into
   `dir-floortime.json` first; they're genuinely useful and only exist on the legacy file. Then
   delete `floor-time.json`.
4. **`validLinks.json`** — delete the `services/floor-time` key, add the two merged links under
   `services/dir-floortime`
5. **`sitemap.xml`** — remove the `floor-time` `<loc>` block
6. **`ServiceDetail.tsx:36`** — **keep** `'floor-time': 'dir-floortime'`, or the indexed URL
   starts 404ing for anyone arriving from a search result or a bookmark

## The one real decision

Step 5 orphans an indexed URL. Three options:

- **Leave the alias as a soft landing** (steps 1-5, keep step 6's mapping). `/floor-time` keeps
  rendering the same content it renders now; it just stops being linked and stops being submitted.
  Google drops it over time. **Simplest, and what I'd do** — no server config, no redirect layer.
  Downside: the duplicate page technically stays reachable, so the duplicate-content signal
  decays slowly rather than resolving cleanly.
- **Add a canonical tag** on the `floor-time` render pointing at `dir-floortime`. Cleaner SEO
  signal, but it means special-casing one slug inside `ServiceDetail`'s Helmet block, and this is
  an SPA — verify with view-source, not a DOM snapshot.
- **301 redirect** at the host. Correct answer in principle. Hostinger static hosting means an
  `.htaccess` rule, which is outside the deploy script's scope and would need to survive future
  deploys. Not worth it for one URL.

## Recommendation

**Worth doing, not urgent.** Nothing is broken and no user hits an error today — the cost is a
duplicate page competing with itself in search and badge traffic landing on the thinner of the
two files. Option 1, done as its own commit so the sitemap change is isolated and easy to watch
in Search Console.

One thing to check first that would change the priority: whether `floor-time` or `dir-floortime`
is the one actually earning impressions. If `floor-time` is the page Google has settled on, the
merge should move content *toward* it instead — in which case the right fix is renaming the slug
in the database, not the file. Search Console will answer that in a minute.
