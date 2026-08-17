# DATA CURATION STATUS — for pSEO chat + CC

**As of:** 2026-08-16 · Scope: `resources` table, database-only. No repo/code changes made.

---

## ⛔ BLOCKERS FOR pSEO PAGE GENERATION

### 1. `aba` slug mismatch — highest priority

- DB stores the slug as **`aba`** — 1,562 tag instances, 4× the next-largest service.
- The only page module file is **`aba-therapy.json`**, and `loadResource.ts` derives the route slug from the **filename**.
- Result: either `/services/aba/*` has no backing content, or `/services/aba-therapy/*` matches zero providers.
- ~40% of service surface area depends on resolving this.
- **Not yet verified:** `ServiceTag.tsx` and the service route component weren't reviewable, so a mapping layer may exist. Confirm before generating.

### 2. Group on `canonical_city`, never on `city`

- A `canonical_city` column + `BEFORE INSERT OR UPDATE` trigger is live on `resources`, calling `public.canonicalize_city(text)`.
- The function: uppercases, strips trailing `, FLORIDA` / `, FL`, returns NULL for `% COUNTY` and for FLORIDA/FL/REMOTE/VIRTUAL/ONLINE/STATEWIDE/MULTIPLE FL LOCATIONS/TAMPA BAY AREA, then applies a 14-branch alias CASE.
- **286 distinct raw `city` values collapse to 263 canonical values.**
- Example: ST. PETERSBURG = 36 providers across three spellings (`St. Petersburg` 33, `Saint Petersburg` 2, `St Petersburg` 1). Group on raw `city` and it splits into 33/2/1.
- The generator must call `canonicalize_city()` or replicate its CASE table.

### 3. `cityCoordinates.json` is keyed on the wrong column

- Must be keyed to **`canonical_city`** (263 keys), not `city`.
- This is the real cause of the missing ST. PETERSBURG entry — not a missing key so much as the wrong key space.
- Junk keys (`STE102`, `SR 31`) are a symptom of the same thing.

### 4. Combo counts are actively in flux — do not freeze a cohort yet

Net record movement projected below. Any cohort selected today will be wrong.

### 5. `serviceDefinitions.ts` is stale — do not use as slug ground truth

| concept | DB (truth) | JSON file | serviceDefinitions.ts |
|---|---|---|---|
| ABA | `aba` | `aba-therapy.json` ❌ | `aba` |
| Speech | `speech-therapy` | `speech-therapy.json` ✓ | `speech` ❌ |
| Life skills | `life-skills` | `life-skills.json` ✓ | `life-skills-daily-living` ❌ |
| Floortime | `dir-floortime` | `dir-floortime.json` ✓ + orphan `floor-time.json` | `dir-floortime` |

Also: `pet-therapy` and `inpp` appear in the project-instruction slug list with **zero** DB usage. `animal-therapy` (108) is the real slug.

---

## CANONICAL SERVICE VOCABULARY (24 slugs, from DB)

`aba` 1562 · `physical-therapy` 956 · `occupational-therapy` 742 · `speech-therapy` 633 · `life-skills` 496 · `parent-coaching` 225 · `group-therapy` 211 · `virtual-therapy` 155 · `ados-testing` 126 · `residential-program` 121 · `feeding-therapy` 119 · `animal-therapy` 108 · `mobile-services` 105 · `support-groups` 95 · `respite-care` 46 · `executive-function-coaching` 42 · `tutoring` 35 · `music-therapy` 34 · `aac` 10 · `dir-floortime` 5 · `transportation` 1 · `art-therapy` 1 · `financial-planning` 1 · `autism-travel` 1

No typo'd slugs in production. **Four singletons** (`transportation`, `art-therapy`, `financial-planning`, `autism-travel`) would each generate a page backed by one provider — needs a volume floor decision. `financial-planning` has no JSON file and appears in no valid list.

**Five records canonicalize to NULL** (`Florida`, `Multiple FL locations`, `Remote`, `Broward County`, `Tampa Bay Area`) — these providers belong to no city page. Statewide/virtual policy decision needed.

---

## DATA QUALITY FINDINGS THAT AFFECT COUNTS

### Duplicate density is higher than SQL alone detects

SQL address-matching found **9 duplicate pairs**. Independent website verification of 42 records found **8 more clusters** SQL had missed, because the same physical site is stored with different address strings or different city labels.

Implication: **there is no reliable count of true unique providers right now.** Current per-combo counts are inflated by an unknown margin.

### City labels are wrong at a material rate

Confirmed cases where the stored city ≠ actual city:

| id | stored | actual |
|---|---|---|
| 8573 | Miramar | Pembroke Pines |
| 8582 | Palm Springs | West Palm Beach |
| 8603 | Palm Springs | West Palm Beach |
| 8557 | Holly Hill | Daytona Beach |
| 8508 | Miami | Miami Shores (deleted as dup) |

Separately, **20 records** have a name suffix naming a different city than their address (border clinics marketing under the larger neighboring city, e.g. "Select Physical Therapy - West Palm Beach" at a Palm Springs address). Address is treated as truth; the name suffix is cosmetic but will read as an error on generated pages.

### 8 records carry hand-patched `canonical_city` the function cannot reproduce

ids 9721, 9858, 10161, 10245, 9794, 10168, 8475, 8596 — `city` holds an address fragment (`Bldg. A`, `B2`, `Second Floor`, `Room 204`, `Fl 32816`, `Legacy Pl`, `Psychology Dept Bldg`). Correct `canonical_city` values are hand-set and will survive only until something touches `city`. Fix is queued (combo-neutral).

### PPEC centers exist in `resources` at scale

**42 PPEC records** live in `resources`, in addition to the `ppec_centers` table and the Find Daycares surface. This is an established pattern, not a handful of errors. **Unresolved policy decision** — removing them would strip 42 records of speech/OT/PT + city combos out of the cohort.

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
| Services backfill from `subcategory` | 201 | **+~320 record-to-combo assignments.** Records that belonged to zero combos now join 1–8 each. Concentrated in `aba`, `physical-therapy`, `occupational-therapy`, `speech-therapy`. |
| `city` fixes on hand-patched rows | 8 | **Zero.** Each recomputes to the canonical value it already holds. |

### Pending decision

| item | n | impact |
|---|---|---|
| Verified deletes (adult PT, adult rehab, psych practices, wellness franchises) | 19 | −19 records, mostly `physical-therapy` |
| Duplicate cluster resolution | ~13 clusters | ~−14 records |
| PPEC-in-`resources` policy | up to 42 | potentially −42 |
| Move to `churches` (10556) | 1 | −1 |
| Move to `schools` (6972) | 1 | −1 |
| Records still NULL after backfill | 76 | pending verification |

**Projected net:** between −35 and −77 records, against +201 records gaining service tags. Both directions move combo counts. Neither is settled.

---

## STATE OF THE WORK QUEUE

1. **Empty/NULL `services[]`** — 277 identified. 201 backfill SQL ready; 42 verified by Cowork; 76 remain after backfill (PPEC, duplicates, support orgs, placement holds). *In progress.*
2. **Wrong-table records in `schools`** — not started. Named targets: Blessed Pediatric Care, Sandrino, Grace, Love Nation, Ganeinu, TTS Mentoring.
3. **Missing county/coordinates** — 17 records identified (same 17 for both). Includes id 8596 FIRST WORDS Project. Geocoding pass not run.
4. **`cityCoordinates.json` audit** — root cause identified (wrong key column). Corrected key list not yet produced.

---

## NOTES FOR CC

No code changes have been made or requested from this track. Two items to be aware of, not act on:

- Do **not** hardcode a service slug list from the project instructions file — it contains `pet-therapy` and `inpp`, which have zero DB usage, and omits `financial-planning`.
- `serviceDefinitions.ts` slug drift (table above) needs reconciling, but the DB and the per-slug JSON files are the working sources of truth.
