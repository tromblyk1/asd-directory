# Inverted vocabulary sweep — start from what exists, ask what knows about it

**Date:** 2026-08-21
**Scope:** report only. Nothing in this document has been fixed.
**Method:** for every entry on every surface, check membership on every other surface.
Full matrix, not pass/fail.

---

## 0. Two premise corrections before the matrix

Both would have produced false defects. Flagging them because the sweep's whole
point is that a check can run correctly against the wrong assumption.

**1. The brief names four surfaces. There are eight.** Four more exist and three of
them can break a page on their own:

| # | Surface | Location | In brief? |
|---|---------|----------|-----------|
| a | JSON files | `data/resources/{services,insurances,scholarships,daycares,…}` | yes |
| b | DB distinct values | `resources.{services,insurances,scholarships}` | yes |
| c | Documented lists | `CLAUDE.md` → VALID SLUGS | yes |
| d | Badge maps | `ProviderCard`, `ServiceTag`, `serviceDefinitions` | yes |
| **e** | **Display-info maps** | `ProviderDetail.tsx:65/93/110` | **no** |
| **f** | **Provider-filter map** | `ServiceDetail.tsx:28` `slugToServiceFilter` | **no** |
| **g** | **Boolean-column map** | `lib/serviceMapping.ts` | **no** |
| **h** | **Daycare badge maps** | `DaycareCard.tsx:77`, `DaycareDetail.tsx:43` | **no** |

Surface **e** is the reason `aba` does not vanish on provider detail pages —
`ProviderDetail.tsx:66` translates `aba` → `aba-therapy` before `ServiceTag`
looks it up. Any audit of surface **d** alone reports `aba` as a defect. It isn't.

**2. `resources.scholarships` has exactly one distinct value (`fes-ua`, 26 rows) —
and that is not a defect.** Scholarships live on the `schools` table as booleans:
`fes_ua` 2,478 · `fes_eo` 2,443 · `ftc` 2,440 · `pep` 213. Judging the four
scholarship JSONs against `resources` alone would have condemned three live pages
backed by 5,000+ school rows.

---

## 1. SERVICES — full matrix

24 distinct DB values · 30 JSON files · 24 documented · badge maps 34 / 80 / 52.

Legend: `✓` present · `✗` absent · `~` present under a different key.

| slug | DB rows | a JSON | c CLAUDE | d PC.serviceBadges | d ServiceTag | e PD.displayInfo | f SD.filter | d serviceDefs |
|---|---:|---|---|---|---|---|---|---|
| aba | 1,075 | `~` aba-therapy | ✓ | ✓ | `~` via e | ✓ | `~` aba-therapy | ✓ |
| physical-therapy | 969 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| occupational-therapy | 801 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| speech-therapy | 706 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `~` speech |
| life-skills | 503 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | `~` life-skills-daily-living |
| parent-coaching | 258 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| group-therapy | 226 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| virtual-therapy | 170 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| mobile-services | 169 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| feeding-therapy | 163 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ados-testing | 135 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| animal-therapy | 108 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| support-groups | 95 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| residential-program | 76 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| respite-care | 49 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| executive-function-coaching | 46 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tutoring | 45 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| music-therapy | 44 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| aac | 28 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| transportation | 15 | ✓ | ✓ | ✓ | ✓ | **✗** | ✓ | ✓ |
| dir-floortime | 11 | ✓ | ✓ | ✓ (→ `floor-time`) | ✓ | ✓ | ✓ | ✓ |
| art-therapy | 4 | ✓ | ✓ | ✓ | ✓ | **✗** | **✗** | ✓ |
| financial-planning | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| autism-travel | 1 | ✓ **no `slug` field** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Reading the two `✗` columns:** both are harmless, and it matters *why*.
`ProviderDetail` does `serviceDisplayInfo[s]?.slug || s` and `ServiceDetail` does
`slugToServiceFilter[slug] || slug`. Both fall through to the raw slug, and for
`transportation` and `art-therapy` the raw slug is already correct on the
downstream surface. These are absences, not breakages — but they are absences that
only stay harmless while the slug happens to match. Not worth fixing; worth knowing
the mechanism, because it is the same fall-through that makes `ProviderCard` print
a raw lowercase slug when `insuranceBadges` misses.

### Services: files with no DB rows (7)

| file | why | verdict |
|---|---|---|
| `aba-therapy` | alias target for `aba` (1,075) | correct by design |
| `floor-time` | duplicate of `dir-floortime` | **open** — see floortime report |
| `inpp` | written 2026-08-21 ahead of curation | intentional |
| `pharmacogenetic-testing` | written 2026-08-21 ahead of curation | intentional |
| `afterschool-program` | services copy; daycares has its own | intentional |
| `respiratory-care` | daycare/PPEC vocabulary | see §4 — **dead surface** |
| `skilled-nursing` | daycare/PPEC vocabulary | see §4 — **dead surface** |

### Services: DB values with no JSON file (1)

`aba` — deliberate. `aba-therapy.json` and `/resources/services/aba-therapy` are
indexed in `sitemap.xml` and `validLinks.json`; the 360 pSEO pages already split
slug from path. Reviewed and declined 2026-08-21. **Do not "fix."**

---

## 2. INSURANCES — full matrix

**20** distinct DB values (CLAUDE.md was reconciled to 17 yesterday and is already
stale — see §5) · 23 JSON files · badge maps 40 / 80 / 52.

| slug | DB rows | a JSON | c CLAUDE | d PC.insuranceBadges | d ServiceTag | e PD.displayInfo |
|---|---:|---|---|---|---|---|
| florida-medicaid | 783 | ✓ | ✓ | ✓ | ✓ | ✓ |
| aetna | 329 | ✓ | ✓ | ✓ | ✓ | ✓ |
| medicare | 328 | ✓ | ✓ | ✓ | ✓ | ✓ |
| cigna | 285 | ✓ | ✓ | ✓ | ✓ | ✓ |
| unitedhealthcare | 284 | ✓ | ✓ | ✓ | ✓ | ✓ |
| florida-blue | 250 | ✓ | ✓ | ✓ | ✓ | ✓ |
| **tricare** | **248** | ✓ **no `slug` field** | ✓ | ✓ | ✓ | ✓ |
| humana | 231 | ✓ | ✓ | ✓ | ✓ | ✓ |
| accepts-most-insurances | 69 | ✓ | ✓ | ✓ | ✓ | ✓ |
| sunshine-health | 40 | ✓ | ✓ | ✓ | ✓ | ✓ |
| avmed | 22 | ✓ | ✓ | ✓ | ✓ | ✗ (harmless) |
| childrens-medical-services | 17 | ✓ **no `slug` field** | ✓ | ✓ | ✓ | ✗ (harmless) |
| oscar | 13 | ✓ | ✓ | ✓ | ✓ | ✗ (harmless) |
| **molina** | **3** | ✓ | **stale: "not yet used"** | ✓ | ✓ | ✓ |
| allegiance | 3 | ✓ | ✓ | ✓ | ✓ | ✗ (harmless) |
| wellcare | 2 | ✓ | ✓ | ✓ | ✓ | ✓ |
| evernorth | 2 | ✓ | ✓ | ✓ | ✓ | ✗ (harmless) |
| **florida-kidcare** | **1** | ✓ | **stale: "not yet used"** | ✓ | ✓ | ✓ |
| **florida-healthcare-plans** | **1** | ✓ | **stale: "not yet used"** | ✓ | ✓ | ✗ (harmless) |
| early-steps | 1 | ✓ **no `slug` field** | ✓ | ✓ | ✓ | ✗ (harmless) |

**The functional surfaces are now completely clean.** Every DB value has a file, a
`ProviderCard` badge, and a `ServiceTag` entry. Zero insurance slugs render raw,
zero vanish. That was not true 24 hours ago.

### Insurances: files with no DB rows (3)

`simply-healthcare`, `community-care-plan`, `curative` — all written 2026-08-21
ahead of curation, all deliberately off the chip list. Correct by design.

---

## 3. Defect class: JSON file with no `slug` field — **5 files, not 1**

This is the class `floor-time` belongs to, and it is the class every prior sweep
missed, because every prior sweep keyed on the `slug` field.

| file | category | DB rows | consequence |
|---|---|---:|---|
| **`insurances/tricare.json`** | insurances | **248** | invisible to slug-keyed checks |
| `insurances/childrens-medical-services.json` | insurances | 17 | invisible to slug-keyed checks |
| `insurances/early-steps.json` | insurances | 1 | invisible to slug-keyed checks |
| `services/autism-travel.json` | services | 1 | invisible to slug-keyed checks |
| `services/floor-time.json` | services | 0 | invisible — **and it is a duplicate** |

**Nothing is broken today.** `generate-sitemap.js` derives slugs from *filenames*
(`file.replace('.json','')`), and `loadResource(category, slug)` resolves by
filename too. The `slug` field inside the file is read by **no runtime code path**.

That is precisely why this class is dangerous: it is a defect only in the tooling
that audits, never in the tooling that serves. `floor-time` survived four sweeps
not because the checks were wrong but because they assumed a shape the file didn't
have — and the four other files in the same shape include the site's 7th-largest
insurance tag.

**Implication for any future sweep:** key on filename, then treat a missing or
mismatched `slug` field as its own finding. Do not use `slug` as the join key.

---

## 4. Defect class: badge entry nothing else registers

### 4a. Intentional aliases — not defects

Keys that exist to catch data-entry variants. All resolve to a live target.

- `ProviderCard.serviceBadges`: `aba-therapy, speech, ot, pt, feeding`
- `ProviderCard.insuranceBadges`: `floridamedicaid, medicaid, floridablue,
  bluecross, bcbs, united, uhc, well-care, molina-healthcare, molinahealthcare,
  sunshinehealth, sunshine, floridakidcare, kidcare, floridahealthcareplans,
  earlysteps, cms`
- `ServiceTag`: `ftc-scholarship`, `pep-scholarship` (duplicate `ftc`/`pep`)

### 4b. True orphans — nothing else on any surface registers them

| key | surface | status |
|---|---|---|
| `hope` | `ProviderDetail.scholarshipDisplayInfo:115` | no JSON, no DB rows, no badge, not in CLAUDE.md. Points at `hope-scholarship`, which has no file. **Dead.** |
| `faith-based` | `ServiceTag.SERVICE_METADATA` | no JSON, no DB rows, no `ProviderCard` entry. **Dead.** |
| `hope_scholarship`, `medicaid_waiver`, `private_pay`, `church_support`, `pet_therapy` | `serviceDefinitions.ts` | no JSON, no DB rows, no badge. **Dead.** `pet_therapy` still carries slug `animal-therapy`, so it is a live alias in a dead file. |
| `fkc` | `ServiceTag.SERVICE_METADATA` | sits in the school-accreditation cluster; abbreviation is ambiguous against `florida-kidcare`. **Unclassifiable without a look at the entry.** |

### 4c. **`lib/serviceMapping.ts` — an entire surface with zero importers**

`INSURANCE_SLUGS` (17 entries) and `SCHOLARSHIP_SLUGS` (4) are exported and
**imported nowhere in `src/`**. They map `providers`-table boolean columns
(`accepts_medicaid` → `florida-medicaid`) — the pre-`resources` schema.

Two consequences:

1. It still contains `accepts_molina: 'molina-healthcare'` — the exact stale value
   corrected in `ServiceTag` yesterday. A dead file preserved the bug.
2. **`CLAUDE.md`'s "Adding a new INSURANCE / SERVICE / SCHOLARSHIP" checklists
   instruct step 5/6/7: "add to `serviceMapping.ts`."** The documentation directs
   maintenance of a file nothing reads. That is a checklist actively spending
   attention on a no-op.

### 4d. `serviceDefinitions.ts` — scoped to daycares, not providers

52 underscore-cased keys. Read by **one consumer**: `DaycareDetail.tsx:619`,
which looks up by the `.slug` field, not the key — so the underscore keys are
irrelevant and the naive count of "20 of 24 provider slugs missing" is a category
error, not 20 defects.

Two `.slug` values do diverge from the DB: `speech` (DB: `speech-therapy`) and
`life-skills-daily-living` (DB: `life-skills`). Consequence is cosmetic only —
line 620 falls back to title-casing the slug, so the button reads
"More Life Skills daycares" instead of the definition's title.

### 4e. **The daycare service vocabulary has no database behind it at all**

The purest instance of the class in the codebase, and the sweep only reached it by
inverting direction.

- `DaycareCard.tsx:77` defines a 20-key `serviceBadges` map.
- `DaycareDetail.tsx:43` defines a slug-translation map.
- `data/resources/daycares/` holds 4 JSON files.
- `services/skilled-nursing.json` and `services/respiratory-care.json` exist to
  serve those badges.

**The `daycares` table has no `services` column and no `insurances` column.** It is
a 59-column boolean table (`aba_on_site`, `on_site_therapy`, `transportation_provided`…)
across 99 rows. `DaycareDetail.tsx:180` reads `daycare.services || []`, which is
always `[]`, and every consumer sits behind `services.length > 0`.

So: two service detail pages, four daycare JSONs, and two badge maps exist to
render a field that does not exist. Nothing is visibly broken — the guard holds —
but this is roughly 100 lines of vocabulary with no possible source of truth.
**Report only; needs a decision, not a patch.**

---

## 5. Defect class: documentation drift — and how fast it happens

`CLAUDE.md` VALID SLUGS was reconciled **yesterday, 2026-08-21**, moving insurances
from 11 documented to "17 in use + 6 registered but not yet used."

**It is already wrong.** Curation landed batch 1 in the interim:

| slug | CLAUDE.md says | DB now says |
|---|---|---|
| molina | registered, not yet used | **3 rows** |
| florida-kidcare | registered, not yet used | **1 row** |
| florida-healthcare-plans | registered, not yet used | **1 row** |

In-use is now 20, not 17. Registered-but-unused is now 3 (`simply-healthcare`,
`community-care-plan`, `curative`), not 6.

The lesson is not "update the file." A hand-maintained list of DB distinct values
drifted inside 24 hours *while under active attention*. The in-use/not-yet-used
split is the part that rots — it is a snapshot of a counter, written in prose.
The slug vocabulary itself (which slugs are legal) is stable and worth documenting;
the row counts are not.

Services list is currently accurate (24 documented = 24 in use).
Scholarships list is accurate for `schools`; it reads as wrong against `resources`.

---

## 6. Summary — the four classes, counted

| class | count | severity |
|---|---:|---|
| DB slug with no file | **1** (`aba`) | none — deliberate, indexed |
| File with no DB rows | **10** | 7 intentional (written-ahead / alias), 1 open (`floor-time`), 2 belong to a dead surface (`skilled-nursing`, `respiratory-care`) |
| Badge entry nothing else registers | **9 true orphans** + 1 dead file (`serviceMapping.ts`, 21 entries) + 1 dead vocabulary (daycare services, ~100 lines) | cosmetic today; `serviceMapping` is in the CLAUDE.md checklist, so it costs attention every time a slug is added |
| File with no `slug` field | **5** | none today — but includes `tricare` (248) and is the class that hid `floor-time` from four consecutive audits |

**Zero DB slugs currently render raw or vanish**, for services or insurances, on
provider cards or provider detail pages. Verified directly, not inferred.

**The behavioral asymmetry worth remembering:** the same defect — a slug with no
map entry — surfaces two different ways. `ServiceTag.tsx:518-522` returns `null`,
so the tag disappears with no trace. `ProviderCard.tsx:370-378` renders the raw
slug, unlinked and lowercase, so a parent sees `community-care-plan`. The silent
one is the more expensive failure and the harder one to notice in QA.

---

## 7. If any of this gets fixed, the ranking

Not a recommendation to act. Ordering only, if asked later.

1. **Decide on the daycare service vocabulary (§4e).** Largest volume of code with
   no source of truth. Either add the columns or delete the maps. Needs your call.
2. **Remove `serviceMapping.ts` from the CLAUDE.md checklists (§4c).** Cheapest
   real win — stops the docs from directing work into a dead file. Whether to
   delete the file itself is separate.
3. **Add `slug` to the 5 files missing it (§3).** Zero runtime effect, but it makes
   every future sweep honest. `tricare` first.
4. **Drop `hope` and `faith-based` (§4b).** Dead keys, trivially removable.
5. **Re-cut the CLAUDE.md in-use/registered split (§5)** — or stop tracking counts
   in prose, which is the better fix.

`floor-time` is deliberately absent from this list; it is held pending Search
Console. See `floortime_redirect_feasibility_2026-08-21.md`.
