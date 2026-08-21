# Badge-link slug mismatch audit (2026-08-21)

Full sweep of the three badge maps in `ProviderCard.tsx` — `serviceBadges` (35 keys),
`insuranceBadges` (38 keys), `scholarshipBadges` (4 keys) — for the molina class of bug:
a key whose `link` path ends in something other than the key itself.

**Report only. The only thing changed today was `molina`, as instructed.**

## Method and what counts as a bug

Most key/path differences are **deliberate aliases** and are fine: `uhc` → `unitedhealthcare`,
`bcbs` → `florida-blue`, `ot` → `occupational-therapy`. The alias key is a spelling variant that
never appears in the database; it exists so `findBadgeInfo` catches messy data.

A mismatch only matters when the key **is a real slug in `resources`**. Then a provider carrying
that tag renders a badge pointing somewhere the slug doesn't live. I checked every key against
the actual distinct values in `resources.services` (24) and `resources.insurances` (17).

## Findings — the complete set is three, and you already knew one

| key | DB rows | links to | JSON exists? | verdict |
|---|---:|---|---|---|
| `molina` | 0 (8 pending) | `/resources/insurances/molina-healthcare` | no | **FIXED today** |
| `aba` | **1,085** | `/resources/services/aba-therapy` | yes | mismatch, resolves |
| `dir-floortime` | 11 | `/resources/services/floor-time` | yes | mismatch, resolves |

Nothing else. Every other insurance key links to its own slug; all four scholarship keys are
exact; the remaining service keys are either exact or non-DB aliases.

### `aba` → `aba-therapy` (1,085 providers)

The single most-used tag on the site links to a path that is not its slug. It works —
`aba-therapy.json` exists — so this is inconsistency, not breakage. Leaving it alone is
defensible; changing it is not free, because `/resources/services/aba-therapy` is in
`sitemap.xml` and `validLinks.json` and has been indexed. **Recommendation: leave it.** The
pSEO pages already use `/providers/aba/:city`, so the slug/path split is established.

### `dir-floortime` → `floor-time` (11 providers)

Both `dir-floortime.json` and `floor-time.json` exist. Two files for one concept, and the badge
sends traffic to the one that doesn't match the slug. Also resolves, so no user-visible break —
but it's a duplicate-content pair worth collapsing at some point. Not today.

## Second class of defect found on the way: link targets with no JSON

Same failure as `wellcare`, but latent. These three service keys link to paths with no JSON file,
so they'd hit `Service information not found`:

| key | DB rows | link target |
|---|---:|---|
| `inpp` | 0 | `/resources/services/inpp` |
| `pharmacogenetic-testing` | 0 | `/resources/services/pharmacogenetic-testing` |
| `afterschool-program` | 0 | `/resources/services/afterschool-program` |

**All three are at zero rows, so nothing is broken on the live site today.** They become live
breaks the moment curation tags a provider — exactly how `wellcare` happened. Either write the
JSON or drop the badge entries; no urgency until one is about to be used.

Also noted: `pet-therapy` is listed as a valid service slug in `CLAUDE.md` but has **no entry in
`serviceBadges` at all**, so a provider tagged with it would render no badge. Zero rows carry it,
and the DB uses `animal-therapy` instead. That's a stale line in `CLAUDE.md`, not a code bug.

## Two things about the molina fix you should know

**1. Your premise was half right.** `serviceDefinitions.ts:345-350` registers it as `molina`.
`ServiceTag.tsx:270` registers it as **`molina-healthcare`**. So "agree with the rest" had two
possible answers. I took `molina`, because that's the value curation is about to write into
`resources.insurances` and the DB slug is what everything else should follow. `ServiceTag` is now
the odd one out — a provider tagged `molina` gets no entry in `SERVICE_METADATA` and falls back to
default styling instead of purple. **Not fixed, because you asked for one fix.** It should be,
before the 8 rows land.

**2. The link still won't resolve.** There is no `molina.json`. Once curation adds the 8
providers, the badge will point at `/resources/insurances/molina` and render
`Insurance information not found` — the same broken Learn More you just paid down on `wellcare`,
moved rather than removed. Same for the 3 `florida-healthcare-plans` rows and the 1
`florida-kidcare` row.

**Before batch 1 lands, three JSON files are needed:** `molina.json`,
`florida-healthcare-plans.json`, `florida-kidcare.json`. That is the real prerequisite for the
collection work, and it's cheap — the `avmed.json` shape is the template.
