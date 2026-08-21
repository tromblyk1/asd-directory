# Audit — the 17 `ABA Therapy | Therapy Services` rows (2026-08-20)

**Verdict: all 17 are correctly tagged `aba`. No action. Do not send these to curation.**

I flagged these as suspicious on the grounds that they share the composite
`ABA Therapy | <something>` subcategory shape with the FL-DD rows curation just cleaned. That
inference was wrong. The shape is shared; the provenance and the meaning are not.

## 1. The composite subcategory means opposite things in the two sources

| Source | Subcategories | Left side of the `\|` | `aba` tag is |
|---|---|---|---|
| **FL-DD Database** | 12 | a blanket import artifact — every row got `ABA Therapy` | presumptively **wrong** |
| **Google Places (PT/OT/ST)** | 5 | a real service the business offers | presumptively **right** |

The split is exact — no subcategory value appears under both sources:

| subcategory | source | rows | still `aba` |
|---|---|---|---|
| `ABA Therapy \| Behavior Assistant` | FL-DD | 13 | 13 |
| `ABA Therapy \| Life Skills Development 1 (Companion)` | FL-DD | 11 | 0 |
| `ABA Therapy \| Life Skills Development 2 (SEC)` | FL-DD | 149 | 2 |
| `ABA Therapy \| Life Skills Development 3 (ADT)` | FL-DD | 105 | 0 |
| `ABA Therapy \| Life Skills Development 4 (Prevoc)` | FL-DD | 4 | 0 |
| `ABA Therapy \| Physical Therapy & Assessment` | FL-DD | 49 | 4 |
| `ABA Therapy \| Private Duty Nursing` | FL-DD | 4 | 0 |
| `ABA Therapy \| Residential Nursing Services` | FL-DD | 39 | 0 |
| `ABA Therapy \| Skilled Nursing` | FL-DD | 6 | 0 |
| `ABA Therapy \| Speech Therapy & Assessment` | FL-DD | 2 | 0 |
| `ABA Therapy \| Supported Living Coaching` | FL-DD | 46 | 0 |
| `ABA Therapy \| Transportation` | FL-DD | 38 | 0 |
| `ABA Therapy \| Occupational Therapy` | Google Places | 3 | 1 |
| `ABA Therapy \| Occupational Therapy, Speech Therapy` | Google Places | 1 | 1 |
| `ABA Therapy \| Physical Therapy, Occupational Therapy, Speech Therapy` | Google Places | 1 | 0 |
| `ABA Therapy \| Speech Therapy` | Google Places | 4 | 1 |
| **`ABA Therapy \| Therapy Services`** | **Google Places** | **17** | **17** |

**The screening rule that actually works is `source`, not the subcategory string.** A composite
subcategory is only evidence of mis-tagging when `source = 'FL-DD Database'`.

## 2. Name/website evidence — 17 of 17 confirm ABA

Every row carries ABA evidence in the business name or the website path. This is self-evident
from the names; no external lookup was needed.

| id | name | city | services |
|---|---|---|---|
| 6142 | ABA Kids Connection, Inc - Brooksville | Brooksville | aba, parent-coaching |
| 8962 | Abacus Therapies - Fort Lauderdale | Fort Lauderdale | aba, parent-coaching, mobile-services |
| 9169 | BASS ABA Therapy - Gainesville East | Gainesville | aba |
| 9171 | BASS ABA Therapy - Gainesville West | Gainesville | aba |
| 8965 | Bless My Mind ABA Therapy - Hialeah | Hialeah | aba |
| 6072 | South Florida ABA Early Intervention Center, LLC | Hialeah | aba |
| 6070 | Gifted Kids Therapy Services LLC (ABA therapy/Applied Behavior Analyst) | Lake Worth | aba |
| 8964 | Advanced Behavioral Dimensions - ABA Therapy Company | Lauderhill | aba, virtual-therapy, parent-coaching |
| 8968 | Full Spectrum ABA - Melbourne | Melbourne | aba |
| 8848 | In Motion ABA | Melbourne | aba, parent-coaching |
| 9166 | Cultivate Behavioral Health & Education - Orange Park | Orange Park | aba |
| 10394 | BASS ABA Therapy - Ormond Beach | Ormond Beach | aba |
| 9023 | Watson's Way ABA | Pinellas Park | aba |
| 9172 | BASS ABA Therapy - Port Orange | Port Orange | aba |
| 6670 | BASS ABA Therapy - Spring Hill | Spring Hill | aba |
| 8819 | ABA Kids Connection, Inc - Tampa | Tampa | aba, parent-coaching |
| 5840 | Cultivate Behavioral Health & Education - Yulee | Yulee | aba |

Only 8962 (Abacus Therapies) lacks "ABA" in the name; its website path is
`abacustherapies.com/aba-therapy/broward/`, which settles it.

Chain branches present: **BASS ×5**, **Cultivate ×2**, **ABA Kids Connection ×2** — all
correctly land in `multi_city` under the domain-keyed `single_city` derivation.

## 3. Blast radius — zero pages, in either direction

Recomputed eligibility (`providers >= 5, OR providers in 3..4 AND single_city >= 2`) for all 14
affected cities, with and without the 17 rows.

| city | ts rows | providers now | single now | providers w/o | single w/o | eligible now | eligible w/o |
|---|---|---|---|---|---|---|---|
| Brooksville | 1 | 5 | 3 | 4 | 3 | yes | yes |
| Fort Lauderdale | 1 | 17 | 10 | 16 | 10 | yes | yes |
| Gainesville | 2 | 43 | 27 | 41 | 27 | yes | yes |
| Hialeah | 2 | 21 | 14 | 19 | 14 | yes | yes |
| Lake Worth | 1 | 2 | 1 | 0 | 0 | no | no |
| Lauderhill | 1 | 4 | 4 | 3 | 3 | yes | yes |
| Melbourne | 2 | 10 | 7 | 5 | 4 | yes | yes |
| Orange Park | 1 | 2 | 1 | 1 | 1 | no | no |
| Ormond Beach | 1 | 11 | 9 | 10 | 9 | yes | yes |
| Pinellas Park | 1 | 2 | 1 | 1 | 0 | no | no |
| Port Orange | 1 | 6 | 5 | 5 | 5 | yes | yes |
| Spring Hill | 1 | 21 | 12 | 20 | 12 | yes | yes |
| Tampa | 1 | 64 | 47 | 56 | 44 | yes | yes |
| Yulee | 1 | 2 | 0 | 1 | 0 | no | no |

**No page changes state.** Brooksville is the only near miss — it drops 5 → 4 providers, but
`single_city` 3 keeps it eligible through the 3–4 band. The manifest stays at 360 regardless.

## 4. Also clean: the other 4 Google Places composites

`Occupational Therapy` (3 rows, 1 `aba`), `Occupational Therapy, Speech Therapy` (1/1),
`Physical Therapy, OT, ST` (1/0), `Speech Therapy` (4/1). Same provenance, same reasoning —
multi-discipline clinics that also do ABA. Nothing to review.

## 5. Where the remaining FL-DD `aba` tags stand

39 rows across all sources still carry `aba` under a composite subcategory. Of those:
- **17** — Google Places `Therapy Services`: correct (this audit)
- **3** — other Google Places composites: correct (§4)
- **4** — FL-DD `Physical Therapy & Assessment`: the AHCA Behavior Analysis keepers curation
  deliberately retained
- **13** — FL-DD `Behavior Assistant`: **correctly tagged, leave alone.** Behavior Assistant is
  a real Florida Medicaid waiver role performed under BCBA supervision; curation kept the tag
  deliberately. I suggested auditing these against the AHCA Behavior Analysis list — **that was
  rejected, and rightly.** AHCA is a *whitelist*: a match confirms, a non-match proves nothing.
  Only 9 of 412 FL-DD rows matched it (2.2%), and the earlier strip was justified by the absence
  of positive evidence generally, not by AHCA disconfirming anything. Running 13 rows against it
  would yield ~12 meaningless non-matches and invite a strip on bad grounds. If revisited, the
  evidence is the providers' own websites.
- **2** — FL-DD `Life Skills Development 2 (SEC)`: stragglers, worth a glance

Nothing here is blocking. The manifest is correct as shipped at 360 pages.
