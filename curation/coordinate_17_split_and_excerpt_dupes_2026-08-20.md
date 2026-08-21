# The 17 address-less rows, split — and the duplicate-excerpt check

**Date:** 2026-08-20
**Status:** Report only. SELECT-only database access. No file modified, including
`src/frontend/src/data/cityCoordinates.json`.
**Companions:** `curation/coordinate_provenance_measurements_2026-08-20.md`,
`curation/cityCoordinates_provenance_2026-08-20.csv`

---

## Part 1 — the 17 split

Definition: `resource_type = 'provider'`, `latitude` and `longitude` both present,
`address IS NULL OR btrim(address) = ''`.

### Group A — 6 rows WITH a `google_place_id`

Every one is `source = 'legacy_migration'`, tagged `['aba']` only, and named like an individual
clinician rather than a business. None matches any key in `cityCoordinates.json`.

| id | name | canonical_city | latitude | longitude | google_place_id | services | source |
|---|---|---|---|---|---|---|---|
| 6543 | Kathy D. Stanley, Otrl | HOLLY HILL | 29.241936 | -81.057181 | `ChIJW1Dg7Jbb5ogRT_V7BcKzbUk` | aba | legacy_migration |
| 6597 | Tara J. Donohue, OT | PORT ST. LUCIE | 27.284688 | -80.298052 | `ChIJhbEm2JXo3ogRmV7JbWj8Qq8` | aba | legacy_migration |
| 6667 | Jeri Lane M. Jacobs, OTD | JACKSONVILLE | 30.247004 | -81.745414 | `ChIJgxjNQ3LH5YgRJ10-miw01sU` | aba | legacy_migration |
| 7077 | Starting Pointe Counseling Services, LLC | PORT ST. LUCIE | 27.273049 | -80.358226 | `ChIJt40kRFvV2IgRSDgIxxlXDqk` | aba | legacy_migration |
| 8461 | Shannon C. Bright, MS | DAYTONA BEACH | 29.194831 | -81.025555 | `ChIJ-V9lf5vZ5ogRGUWvz_O5Tvk` | aba | legacy_migration |
| 8523 | Shirley J. Phillips, Occupational | FORT MYERS | 26.603466 | -81.860255 | `ChIJf944c4Rq24gR0tPjAMvhAVc` | aba | legacy_migration |

Two independent reasons these are the uncertain ones, and the second is new:

1. **Provenance.** A Google Business Profile with a hidden address returns Google's service-area
   approximation — neither `city_centroid` nor `street_geocode`. NULL is the honest value.
2. **Identity.** Five of the six are personal names, four with clinical credentials (OTR/L, OT,
   OTD, MS) — three of them occupational-therapy credentials on rows tagged **`aba` only**. This
   is the `legacy_migration` mistagging pattern already established (~91% mistagged `aba`). The
   coordinate question may be moot for some of these rows; they are candidates for the ABA re-tag
   pass before they are candidates for a coordinate.

Also note 6543's coordinate is **0.013° (~1 mile) away** from the `HOLLY HILL` key in
`cityCoordinates.json`. Close but not equal — consistent with a real Google geocode of a real
place, not a copied centroid.

### Group B — 11 rows with NO `google_place_id`

| id | name | canonical_city | latitude | longitude | services | source |
|---|---|---|---|---|---|---|
| 10690 | Heart-to-Heart Music Therapy | FORT MYERS | 26.64080 | -81.86255 | music-therapy, virtual-therapy | *(null)* |
| 10696 | Champion Kids Solutions LLC | ORLANDO | 28.5383 | -81.3792 | tutoring, parent-coaching, life-skills, mobile-services | *(null)* |
| 10710 | Exhale Babysitting Company | JACKSONVILLE | 30.342298 | -81.650399 | respite-care | submission |
| 10711 | KVO Behavior Consulting | JACKSONVILLE | 30.342298 | -81.650399 | parent-coaching, virtual-therapy | submission |
| 10714 | Sunshine Scholars Connection | ST. PETERSBURG | 27.782996 | -82.649933 | parent-coaching, life-skills, executive-function-coaching, tutoring | submission |
| 10722 | Cultivate Behavioral Health & Education – Coral Gables | CORAL GABLES | 25.750219 | -80.263787 | aba, mobile-services | manual_curation_2026-08 |
| 10723 | Cultivate Behavioral Health & Education – Cutler Bay | CUTLER BAY | 25.584067 | -80.339133 | aba, mobile-services | manual_curation_2026-08 |
| 10724 | Cultivate Behavioral Health & Education – Kendale Lakes | KENDALE LAKES | 25.708046 | -80.407836 | aba, mobile-services | manual_curation_2026-08 |
| 10725 | Cultivate Behavioral Health & Education – Kendall | KENDALL | 25.669669 | -80.355584 | aba, mobile-services | manual_curation_2026-08 |
| 10726 | Cultivate Behavioral Health & Education – Palm Beach | PALM BEACH | 26.720600 | -80.038800 | aba, mobile-services | manual_curation_2026-08 |
| 10727 | Cultivate Behavioral Health & Education – Vero Beach | VERO BEACH | 27.633000 | -80.403100 | aba, mobile-services | manual_curation_2026-08 |

### cityCoordinates.json matches — candidate list, not a verdict

**6 of the 17 match a key. All 6 are the Cultivate rows. All 6 are in Group B.**

| id | matched key | Match quality |
|---|---|---|
| 10722 | CORAL GABLES | file `25.750219076923088, -80.26378696153847` → row is that value rounded to 6 dp |
| 10723 | CUTLER BAY | file `25.58406666666667, -80.33913333333334` → row is that value rounded to 6 dp |
| 10724 | KENDALE LAKES | exact |
| 10725 | KENDALL | exact |
| 10726 | PALM BEACH | exact |
| 10727 | VERO BEACH | exact |

**Why this is circumstantial and not proof — but is stronger here than in the earlier audit.**
Coordinate equality misfires when the direction of causation is unknown: in a thin city, the
"centroid" often *is* a single provider's real geocode, so a match means the file copied the
provider, not the reverse. That failure mode **cannot apply to these six**, because all six rows
have no street address at all — there was no geocodable address for the file to have derived from.
Combined with `source = 'manual_curation_2026-08'` (postdating the file by ten months) and the
two 6-dp roundings, the direction is essentially settled: the provider took the file's value.

That said, it is still inference. The two roundings in particular are consistent with a copy but
also with independent hand-entry from a map. Treat as a candidate list.

**11 of the 17 match nothing in the file** — the 6 in Group A plus 10690, 10696, 10710, 10711,
10714. Their coordinates came from somewhere else.

### Two things found while matching, neither asked for

- **10710 and 10711 carry the identical coordinate** `30.342298, -81.650399` — two unrelated
  Jacksonville businesses (a babysitting company and a behavior consultancy), both
  `source = 'submission'`, both with no street address. The point is ~1 km from downtown
  Jacksonville and matches **no** key in `cityCoordinates.json`. It looks like a Jacksonville
  default applied at submission time, from a source not in the repo.
- **10696** is `28.5383, -81.3792` — four decimal places, and that is the standard published
  coordinate for the City of Orlando. It matches no key in the file either. So a gazetteer-style
  value entered this table from somewhere, which means the file is not the only fallback source
  in play.

### Consequence for the plan

The stated plan holds, with one caveat per group:

- **Group B, 11 rows → Census-geocode to the city name, set `city_centroid`.** Sound. Note that
  for the 6 Cultivate rows this will *overwrite* the `cityCoordinates.json` value with a real
  Census place centroid — which is the correct outcome, since no key in that file is a verified
  centroid. Also worth deciding what happens to 10710/10711's shared point, which is not a
  centroid of anything.
- **Group A, 6 rows → leave `coordinates_source` NULL.** Sound, and NULL is exactly what the
  generated-column `CASE` was designed to preserve. But queue these for the ABA re-tag first;
  three carry OT credentials and an `aba`-only tag.

---

## Part 2 — duplicate excerpt check

**Status: this was dropped. It never ran.** It was raised in an earlier prompt, the chains audit
was parked pending the curation track's mismatch list, and the check went with it. Run now.

### 2a. `provider_services_wide`, all multi-record domains

43 domains appear on more than one record, covering 118 records.

| Metric | `ABA_Excerpt` | `HomeAccess_Excerpt` |
|---|---:|---:|
| Multi-record domains with >1 non-empty excerpt | 17 | 13 |
| **…of which distinct excerpt count = 1 (verbatim repeat)** | **10** | **9** |
| Records inside those flagged domains | 24 | 19 |
| Domains where excerpts actually differ | 7 | 4 |

**Flagged domains — record count > 1, distinct excerpt count = 1:**

| Domain | psw records | ABA rows / distinct | HomeAccess rows / distinct | Flag |
|---|---:|---|---|---|
| thriveworks.com | 4 | 4 / **1** | 0 / 0 | ABA identical |
| abacentersfl.com | 3 | 3 / **1** | 3 / **1** | both identical |
| littleleaves.org | 3 | 3 / **1** | 3 / 2 | ABA identical |
| brooksrehab.org | 3 | 0 / 0 | 2 / **1** | HomeAccess identical |
| behavior-analysis.org | 2 | 2 / **1** | 2 / **1** | both identical |
| leadingpathwaysaba.com | 2 | 2 / **1** | 2 / **1** | both identical |
| mykidtherapycenter.com | 2 | 2 / **1** | 2 / **1** | both identical |
| projectbrilliance.com | 2 | 2 / **1** | 2 / **1** | both identical |
| behavioralhealth-centers.com | 2 | 2 / **1** | 0 / 0 | ABA identical |
| superkidsaba.com | 2 | 2 / **1** | 0 / 0 | ABA identical |
| www-healthpro-heritage-com.sandbox.hs-sites.com | 2 | 2 / **1** | 0 / 0 | ABA identical |
| actsfl.org | 2 | 0 / 0 | 2 / **1** | HomeAccess identical |
| apd.myflorida.com | 2 | 0 / 0 | 2 / **1** | HomeAccess identical |
| tukkosabatherapy.com | 2 | 2 / 2 | 2 / **1** | HomeAccess identical |

`HomeAccess_Excerpt` repeats at essentially the same rate as `ABA_Excerpt` — 9 of 13 vs 10 of 17.
So this is not an ABA-specific artifact; it is how the crawler stores evidence, and any
service flag derived from an excerpt inherits it.

### 2b. `aba_shortlist_chains_2026-08-18.csv` — the audit this gates

50 domains, 193 shortlist records. Resolved against `provider_services_wide`:

| | Domains |
|---|---:|
| Chain domains with **exactly one** `provider_services_wide` row | **33** |
| Chain domains with >1 psw row, excerpts **verbatim identical** | 8 |
| Chain domains with >1 psw row, excerpts **differ** | 7 |
| Chain domains with no psw row | 0 |

**The CSV's own header premise is confirmed, and by a stronger mechanism than it claims.** The
header says "The crawler stores ONE excerpt per DOMAIN, not per location." For **33 of 50 domains
that is structurally true** — there is literally one crawl row, so all 193 shortlist records join
to a single excerpt and `representative_excerpt` is not merely representative, it is the only one
that exists. For 8 more it is empirically true. The domain-level evidence genuinely cannot reach
the branch, and `Y-SOME` is the correct verdict wherever it was used.

**7 domains are the exception — they hold more than one distinct excerpt already:**

| Domain | psw rows | distinct ABA excerpts |
|---|---:|---:|
| acornhealth.com | 5 | 4 |
| hopebridge.com | 4 | 3 |
| elitedna.com | 7 | 2 |
| devereux.org | 3 | 2 |
| abaresults.com | 2 | 2 |
| teampbs.com | 2 | 2 |
| tukkosabatherapy.com | 2 | 2 |

These 7 are the only chains where per-branch evidence is already sitting in the database. They do
not need the curation track's published-city-list check to make progress — the differing excerpts
can be read against the branch list today. The other 43 do.

### 2c. Cross-file leak from `aba_shortlist_individual_2026-08-18_FINAL.csv`

229 of the 231 rows carry a domain; 229 distinct domains; no domain appears twice inside the file
(the filter worked as designed). Checked each against both `provider_services_wide` and the domain
derived from `resources.website` across all providers.

**2 leaks found.**

| Shortlist id | Domain | Also on | Nature |
|---|---|---|---|
| **6583** Child Advancement Center – Dania Beach | `4childadvancement.com` | **10728** Child Advancement Center – Winter Park (`manual_curation_2026-08`) | **Real leak.** Same identical ABA excerpt. 10728 did not exist when the shortlist was built, so it inherited a verdict it was never audited for — and it is already tagged `aba, parent-coaching, mobile-services`, the same three tags as 6583 |
| **8872** Growing Smiles ABA Services Inc | `sites.google.com` | **6521** Learn and Rise [LAKELAND], **9341** Horizons Therapy & Learning Center [KISSIMMEE] | **Not an excerpt leak — a domain-derivation defect.** Three unrelated businesses on distinct Google Sites subpaths, collapsed to the shared host. `ABA_Excerpt` is NULL for all three, yet `provider_services_wide."ABA"` is **true** for all three, including 9341, which is tagged speech/OT only |

**On id 5818 specifically:** it did **not** leak. `autismabatherapy.com` has exactly one
`provider_services_wide` row and exactly one `resources` row (5818, AutismABATherapy – Fort Myers).
The mechanism you were worried about is real but has no second row to land on *in the database*.
It does have a second row **outside** it: `curation/autismabatherapy_locations.csv` exists, meaning
the site publishes locations the table does not carry. And 5818's stored excerpt opens
"Skip to content Happy New Year from Autism ABA Therapy! As we step into 2025…" — a homepage
banner, which is company-level text with zero location content. So the *verdict* on 5818 rests on
the same weak evidence as a chain row; it simply has no sibling to contaminate yet. If those
locations are ever imported, it becomes a 6583.

### The generalizable finding

The 6583 case is the one that matters, because it is not a flaw in how the shortlist was filtered
— the filter was correct at the time. **`manual_curation_2026-08` added a second row on an
already-audited domain after the audit closed.** Any completed domain-level audit silently
decays as new locations are added under domains it already ruled on. Re-running 2c after each
curation batch costs one query.

`sites.google.com` is a separate and arguably worse problem: domain is being used as a provider
identity key, and shared-hosting domains (`sites.google.com`, `linktr.ee`, `wixsite.com`,
`my.canva.site`, `myclickfunnels.com` all appear in the shortlist) break that assumption. Three of
those five appear in the FINAL file. Only `sites.google.com` currently has more than one row, so
only it surfaced — the others are latent.

---

## What this report does not decide

- Whether to Census-geocode Group B now or wait for the `coordinates_source` column to exist.
- Whether the 3 OT-credentialed rows in Group A go to the ABA re-tag before the coordinate pass.
- What to do about `sites.google.com` as a join key, or about 10710/10711's shared point.
- Anything about the 43 chain domains still gated on the curation track's mismatch list.
