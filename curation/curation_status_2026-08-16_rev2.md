# DATA CURATION STATUS — for pSEO chat + CC

**Revision:** 2 · **As of:** 2026-08-16 · **Owner:** curation chat (Keith)
**Scope:** `resources` table, database-only. No repo or code changes made from this track.
**Update cadence:** re-issue after each executed batch; combo counts below are **pre-backfill**.

> **Read this first:** every count in this document predates the queued 201-record services
> backfill. Counts will move. Do not treat any number here as final except where explicitly
> marked stable.

---

## ⛔ BLOCKERS FOR pSEO PAGE GENERATION

### 1. `aba` slug mismatch — CONFIRMED, fix routes to pSEO chat

- DB stores the slug as **`aba`** — 1,562 tag instances, 4× the next-largest service.
- The only page module file is **`aba-therapy.json`**.
- **Confirmed by reading `loadResource.ts`:** the services module map is keyed on filename,
  so it contains `aba-therapy` and not `aba`. `buildSlugCandidates("aba")` returns exactly
  one candidate, `"aba"` — the camelCase branch requires a dash and the kebab branch requires
  an uppercase character, and `aba` has neither. Lookup misses and returns `null`.
- **No mapping layer in `serviceMapping.ts`.** That file exports only `INSURANCE_SLUGS` and
  `SCHOLARSHIP_SLUGS`, has no service map at all, and is built around a boolean-column pattern
  the `resources` table does not use. Probably dead code for providers.
- **Remaining open question, narrow:** does the service route component or `ServiceTag.tsx`
  rewrite the slug before calling `loadResource`? One file read settles it.
- **Fix direction:** alias, not rename. `/services/aba-therapy` may already be indexed and in
  sitemap.xml. Also note `loadResource` spreads the JSON data *after* setting `slug: candidate`,
  so the JSON's internal `"slug": "aba-therapy"` overwrites the candidate — a bare file rename
  does not fully fix this.
- **Owner: pSEO chat / CC.** This is a frontend change. The DB is correct as-is.

### 2. Only two DB slugs are actually broken

Cross-check of all 24 DB slugs against the per-slug JSON files:

| DB slug | file | status |
|---|---|---|
| `aba` | `aba-therapy.json` | ❌ mismatch (see above) |
| `financial-planning` | *none* | ❌ no file, and a singleton — likely drop the tag rather than build a page |
| all other 22 | matching filename | ✓ resolve correctly |

Orphan: `floor-time.json` has zero DB usage and sits beside the correct `dir-floortime.json`.

This is materially narrower than "~40% of service surface area is at risk." One slug is broken,
but it happens to be the highest-volume one.

### 3. Group on `canonical_city`, never on `city`

- A `canonical_city` column + `BEFORE INSERT OR UPDATE` trigger is live on `resources`, calling
  `public.canonicalize_city(text)`.
- The function uppercases, strips trailing `, FLORIDA` / `, FL`, returns NULL for `% COUNTY` and
  for FLORIDA / FL / REMOTE / VIRTUAL / ONLINE / STATEWIDE / MULTIPLE FL LOCATIONS / TAMPA BAY
  AREA, then applies a 14-branch alias CASE.
- **286 distinct raw `city` values collapse to 263 canonical values.**
- Example: ST. PETERSBURG = 36 providers across three spellings (`St. Petersburg` 33,
  `Saint Petersburg` 2, `St Petersburg` 1). Group on raw `city` and it splits 33/2/1.
- The generator must call `canonicalize_city()` or replicate its CASE table.

### 4. `cityCoordinates.json` is keyed on the wrong column

- Must be keyed to **`canonical_city`** (263 keys), not `city`.
- This is the real cause of the missing ST. PETERSBURG entry — the wrong key space, not simply
  a missing key. Junk keys (`STE102`, `SR 31`) are a symptom of the same thing.
- **Owner: pSEO chat / CC.** Corrected key list to be produced by this track; the file edit is
  a code change.

### 5. `serviceDefinitions.ts` is stale — do not use as slug ground truth

| concept | DB (truth) | JSON file | `serviceDefinitions.ts` |
|---|---|---|---|
| ABA | `aba` | `aba-therapy.json` ❌ | `aba` |
| Speech | `speech-therapy` | `speech-therapy.json` ✓ | `speech` ❌ |
| Life skills | `life-skills` | `life-skills.json` ✓ | `life-skills-daily-living` ❌ |
| Floortime | `dir-floortime` | `dir-floortime.json` ✓ + orphan `floor-time.json` | `dir-floortime` |

Also: `pet-therapy` and `inpp` appear in the project-instruction slug list with **zero** DB usage.
`animal-therapy` (108) is the real slug.

Same class of bug in another array: `serviceMapping.ts` maps `accepts_molina` →
`molina-healthcare`, but the project instructions list `molina` and no `molina-healthcare.json`
appears to exist. Unverified — worth a check.

---

## ✅ WHAT IS STABLE ENOUGH TO BUILD ON

Revision 1 said "any cohort selected today will be wrong." That is true for a full ~380-page
build. It is **not** true for the 20-page pilot, and the distinction matters.

Projected worst-case net movement is −77 records across a 3,722-record table. The pilot cohort
is drawn from service+city combos at ≥10 providers, where the largest are ABA/Tampa 99,
ABA/Jacksonville 91, ABA/Miami 91. Nothing in the pending-decision queue moves those below
threshold. **The pilot cohort can be frozen. The full build cannot.**

---

## ⚠️ COMBO COUNT AND COMBO QUALITY ARE DIVERGING

This is new in revision 2 and it changes how the generator should select pages.

Verification rates across the ≥10 city cohort:

| service | providers | verified | rate |
|---|---|---|---|
| `aba` | 1,140 | 651 | **57%** |
| `life-skills` | 181 | 102 | **56%** |
| `ados-testing` | 24 | 13 | 54% |
| `parent-coaching` | 56 | 18 | 32% |
| `group-therapy` | 45 | 11 | 24% |
| `physical-therapy` | 650 | 37 | **6%** |
| `occupational-therapy` | 396 | 27 | **7%** |
| `speech-therapy` | 289 | 16 | **6%** |
| `feeding-therapy` | 18 | 0 | **0%** |

Now cross-reference the queued backfill: 201 records, ~320 new combo assignments, concentrated
in `aba`, `physical-therapy`, `occupational-therapy`, `speech-therapy`.

Those 201 records had **no service tags at all** until now. They are by definition records that
have never been individually confirmed. Running the backfill grows the PT / OT / ST combos —
already the least-verified data in the table — with records at 0% verification.

**Consequence:** raw combo count will rise fastest exactly where data quality is lowest. If the
page generator ranks build candidates by provider count, it will rank the weakest combos higher
after the backfill than before.

**Requirement for the generator:** gate on `verified` count, not raw count. A combo with 22
providers of which 18 are verified is a better page than one with 34 providers of which 0 are.

Related and unresolved: PT / OT / ST at ~6% verified may indicate a bulk import of generic
pediatric therapy clinics with no autism relevance. Per the table-placement rules, generic
medical providers with no autism focus do not belong in the directory at all. Those combos
should not be built into landing pages before that question is answered.

---

## CANONICAL SERVICE VOCABULARY (24 slugs, from DB)

`aba` 1562 · `physical-therapy` 956 · `occupational-therapy` 742 · `speech-therapy` 633 ·
`life-skills` 496 · `parent-coaching` 225 · `group-therapy` 211 · `virtual-therapy` 155 ·
`ados-testing` 126 · `residential-program` 121 · `feeding-therapy` 119 · `animal-therapy` 108 ·
`mobile-services` 105 · `support-groups` 95 · `respite-care` 46 ·
`executive-function-coaching` 42 · `tutoring` 35 · `music-therapy` 34 · `aac` 10 ·
`dir-floortime` 5 · `transportation` 1 · `art-therapy` 1 · `financial-planning` 1 ·
`autism-travel` 1

No typo'd slugs in production. **Four singletons** (`transportation`, `art-therapy`,
`financial-planning`, `autism-travel`) would each generate a page backed by one provider —
needs a volume floor decision. `financial-planning` additionally has no JSON file and appears
in no valid list.

**Five records canonicalize to NULL** (`Florida`, `Multiple FL locations`, `Remote`,
`Broward County`, `Tampa Bay Area`) — these providers belong to no city page. Statewide/virtual
policy decision needed.

---

## DATA QUALITY FINDINGS THAT AFFECT COUNTS

### Duplicate density — sample caveat

SQL address-matching found **9 duplicate pairs**. Independent website verification of 42 records
found **8 more clusters** SQL had missed, because the same physical site is stored with different
address strings or different city labels.

**Do not extrapolate 8/42 to the full table.** Those 42 records were pulled as a targeted
ambiguous subset, not a random sample, so the rate is a hit rate on hard cases and not a
table-wide base rate. *(If the selection method was in fact random, correct this line — it
changes the conclusion substantially.)*

What is fair to say: SQL alone undercounts duplicates, current per-combo counts are inflated by
an unknown margin, and the margin is larger in service+city combos that draw on multi-location
franchise providers.

### City labels are wrong at a material rate

| id | stored | actual |
|---|---|---|
| 8573 | Miramar | Pembroke Pines |
| 8582 | Palm Springs | West Palm Beach |
| 8603 | Palm Springs | West Palm Beach |
| 8557 | Holly Hill | Daytona Beach |
| 8508 | Miami | Miami Shores (deleted as dup) |

Separately, **20 records** have a name suffix naming a different city than their address (border
clinics marketing under the larger neighboring city, e.g. "Select Physical Therapy - West Palm
Beach" at a Palm Springs address). Address is treated as truth; the name suffix is cosmetic but
will read as an error on generated pages.

### 8 records carry hand-patched `canonical_city` the function cannot reproduce

ids 9721, 9858, 10161, 10245, 9794, 10168, 8475, 8596 — `city` holds an address fragment
(`Bldg. A`, `B2`, `Second Floor`, `Room 204`, `Fl 32816`, `Legacy Pl`, `Psychology Dept Bldg`).
Correct `canonical_city` values are hand-set and will survive only until something touches
`city`. Fix is queued and combo-neutral.

### PPEC centers in `resources` — 42 records, per-record question

Revision 1 framed this as one all-or-nothing policy decision. It is not.

The project instructions already supply the test: a dual listing is legitimate when each entry
represents a **different function**, and the question is *"can a parent access this specific
service without being enrolled in the other program?"* A PPEC center that takes standalone
speech or OT appointments passes and belongs in `resources`. One that only serves its own
enrolled medical-daycare census does not.

So this is 42 individual determinations, not a single 42-record deletion. Worst case is −42;
realistic case is materially smaller. **Do not propose deleting the cohort wholesale.**

---

## RECORD MOVEMENT

### Executed

| id | action | detail |
|---|---|---|
| 8508 | DELETED | Duplicate of 10373 (same address, phone, site) |
| 10373 | BACKFILLED | `aba, parent-coaching, feeding-therapy, mobile-services` |

Net so far: **−1 record.**

### Queued, ready to run

| batch | n | combo impact |
|---|---|---|
| Services backfill from `subcategory` | 201 | **+~320 record-to-combo assignments.** Records that belonged to zero combos join 1–8 each. Concentrated in `aba`, `physical-therapy`, `occupational-therapy`, `speech-therapy`. **See the quality-divergence section — these records are unverified.** |
| `city` fixes on hand-patched rows | 8 | **Zero.** Each recomputes to the canonical value it already holds. |

### Pending decision

| item | n | impact |
|---|---|---|
| Verified deletes (adult PT, adult rehab, psych practices, wellness franchises) | 19 | −19 records, mostly `physical-therapy` |
| Duplicate cluster resolution | ~13 clusters | ~−14 records |
| PPEC-in-`resources` (per-record, not wholesale) | up to 42 | realistically well under −42 |
| Move to `churches` (10556) | 1 | −1 |
| Move to `schools` (6972) | 1 | −1 |
| Records still NULL after backfill | 76 | pending verification |

**Projected net:** between −35 and −77 records, against +201 records gaining service tags.
Both directions move combo counts. Neither is settled.

---

## STATE OF THE WORK QUEUE

1. **Empty/NULL `services[]`** — 277 identified. 201 backfill SQL ready; 42 verified by Cowork;
   76 remain after backfill (PPEC, duplicates, support orgs, placement holds). *In progress.*
2. **Wrong-table records in `schools`** — not started. Named targets: Blessed Pediatric Care,
   Sandrino, Grace, Love Nation, Ganeinu, TTS Mentoring.
3. **Missing county/coordinates** — 17 records identified (same 17 for both). Includes id 8596
   FIRST WORDS Project. Geocoding pass not run.
4. **`cityCoordinates.json` audit** — root cause identified (wrong key column). Corrected key
   list not yet produced. *File edit belongs to the pSEO chat.*

---

## OWNERSHIP SPLIT

| item | owner |
|---|---|
| `aba` slug alias fix | pSEO chat → CC |
| `cityCoordinates.json` re-key (file edit) | pSEO chat → CC |
| `cityCoordinates.json` corrected key list (data) | curation chat |
| `serviceDefinitions.ts` drift reconciliation | pSEO chat → CC |
| Everything else in this document | curation chat |

---

## NOTES FOR CC

No code changes have been made or requested from this track. Items to be aware of:

- Do **not** hardcode a service slug list from the project instructions file — it contains
  `pet-therapy` and `inpp`, which have zero DB usage, and omits `financial-planning`.
- `serviceDefinitions.ts` slug drift (table above) needs reconciling. The DB and the per-slug
  JSON files are the working sources of truth.
- Select pilot pages by **verified provider count**, not raw provider count.
- Group on `canonical_city`. Never on `city`.
