# Should the scholarship filter stay on provider search? (2026-08-21)

Report only, no action taken.

**Recommendation: remove it from provider search.** Not because 27 of 3,054 is a small
number — because three of the four options can never return anything, and the fourth is one
chain. It is not a sparse filter, it is a broken one.

## 1. Provider-side coverage

| | providers |
|---|---:|
| Total `resource_type = 'provider'` | **3,054** |
| Any scholarship tag | **27 (0.9%)** |
| `fes-ua` | 26 |
| `ftc` | **1** |
| `fes-eo` | **0** |
| `pep` | **0** |

**Two of the four filter chips are dead controls.** `fes-eo` and `pep` are offered in the UI
and match zero providers. A parent who selects either gets an empty result set that reads as
"no provider in Florida takes this," which is a claim the data does not make.

## 2. The 26 `fes-ua` rows are 16 organizations, not 26

**11 of 27 are Positive Behavior Supports Corporation branches** (Brandon, Fort Myers,
Gainesville, Jacksonville, Melbourne, Miami, Orlando, Pembroke Pines, Stuart HQ, Tallahassee,
Tampa). Filtering to FES-UA returns a page that is 40% one company.

The remaining 16 are single sites: AutismABATherapy Fort Myers, Berger Counseling, Bumblebee
Academy, Coastal Play & Progress, Coastal Speech and Language, Creative Pathways, Dr. Lisa
Grossman, Easterseals South Florida Miami Gardens, Foundational Potential, Heart-to-Heart Music
Therapy, Hetherington Therapy, Jabber Jaw Kids, Kids Aboard Therapy, Seawinds Pediatric
Therapy, UCP Unlocking Positive Behavior, and the one `ftc` row.

## 3. Three of the four scholarships do not fund providers at all

This is the structural reason the data looks the way it does, and it will not improve with
collection effort:

| scholarship | what it pays for | applicable to a therapy provider? |
|---|---|---|
| **FES-UA** | tuition **and** approved therapies, curriculum, services | **yes** |
| FES-EO | private school tuition | no |
| FTC | private school tuition | no |
| PEP | homeschool/personalized education expenses | marginal |

So the honest shape of the provider-side question is **one boolean — does this provider accept
FES-UA reimbursement** — not a four-way filter. The zero counts on `fes-eo` and `pep` are the
data agreeing with the statute, not a gap.

**The single `ftc` row is probably a mistag.** Collaborative Behavior Group (id 6961, Port St.
Lucie, `legacy_migration`) is an ABA provider carrying `ftc` and nothing else. FTC is school
tuition. Worth a curation look, but it is one row and changes nothing here.

## 4. Same latent defect as insurance, now the only one left

Before today's fix, `arrayContainsAny` dropped every provider with an empty array. That still
applies to scholarships: **selecting FES-UA hides 3,027 of 3,054 providers**, the overwhelming
majority of which have simply never been asked. Keith declined banding for scholarships
(correctly — 27 rows is not a band problem), so the exclusive semantics remain in place here.

That is fine if the filter goes away. If it stays, it is the last place in the app where absence
of data is still rendered as a negative claim.

## 5. Schools side — where scholarship participation actually lives

`schools` uses four booleans and they are fully populated (**zero rows with all four null**):

| | schools | share |
|---|---:|---:|
| Total | 2,504 | |
| `fes_ua_participant` | 2,478 | **99.0%** |
| `fes_eo_participant` | 2,443 | 97.6% |
| `ftc_participant` | 2,440 | 97.4% |
| `pep_participant` | 213 | **8.5%** |
| Any of the four | 2,478 | 99.0% |
| None | 26 | 1.0% |

`FindSchools.tsx:279-281` filters on the booleans directly, so there is no unknown-as-no problem
— a `false` there is a real "no."

**But note the discriminating power is nearly nil for three of them.** Selecting FES-UA on the
schools page returns 99% of the directory; FES-EO and FTC return ~97.5%. Only **PEP actually
narrows anything** (8.5%). That is a separate observation from the provider question and no
action is proposed on it — but if the schools scholarship filter is ever revisited, the finding
is that three of its four chips are close to no-ops and PEP is the only one doing work.

## 6. Options

1. **Remove the scholarship filter from provider search.** Cleanest. Removes two dead chips,
   removes the last unknown-as-no filter, and removes a filter whose best case is 16 orgs.
   The 27 tags stay in the DB and keep rendering as badges on `ProviderCard` — the information
   is not lost, only the filter control goes.
2. **Collapse to a single "Accepts FES-UA" toggle.** Keeps the one applicable dimension, kills
   the three inapplicable ones. Still 26 rows / 16 orgs behind it, still exclusive semantics,
   but at least every chip is real.
3. **Leave it and band it like insurance.** Rejected already, and the numbers support that —
   a band structure over 27 rows is machinery with nothing to sort.

Option 1 unless there is a plan to collect FES-UA acceptance at scale, in which case option 2
is the placeholder for it.
