# legacy_migration Spot-Check — ABA tag, Tallahassee & Lakeland

**Date:** 2026-08-17
**Scope:** `source = 'legacy_migration'` AND `'aba' = ANY(services)` AND `canonical_city IN ('TALLAHASSEE','LAKELAND')`
**Rows in scope:** 148 (82 Tallahassee, 66 Lakeland)
**Method:** same standard applied to FL-DD — an individual's personal name, a
counseling practice, a state agency, an advocacy association, an adult day
program or a medical clinic is not an ABA provider. Websites fetched and read
where present.
**Follows:** `curation/pseo_pilot_rerank_no_flDD_2026-08-17.md` (pilot pages 1 and 2)

---

> ## Verdict
>
> **`legacy_migration` has the same defect as FL-DD, at a worse rate.**
> Roughly **91% of the 148 rows are not ABA providers.** Of 148 rows, **13 are
> genuine ABA**, 126 are mistagged, 9 unresolvable.
>
> **Pilot pages 1 and 2 cannot ship.** Tallahassee has ~6 real ABA providers, not
> 85. Lakeland has ~7, not 68.
>
> **Rating presence is not a proxy for tag reliability** — mistagging is 93% in
> the unrated group and 92% in the well-rated group. That kills the ratings-based
> triage idea and means the defect extends across the whole table.

---

## Part 1 — Group A: no Google rating (31 rows)

**2 genuine · 25 mistagged · 4 unresolvable → 93% mistag rate on resolvable rows**

### Lakeland (15)

| id | Name | Website | Rating | Assessment |
|---|---|---|---|---|
| 7124 | Behavioral Progression, Inc. | behavioralprogression.com | — | **GENUINE** — "in-home, in-school, clinic, and community-based ABA services" |
| 7300 | Autism Institute for Learning and Development | autismildlakeland.org | — | MISTAG — individualized education, homeschool evaluations, IEP advocacy. Autism-relevant but no ABA offered |
| 7358 | Ascend Mind and Body | ascendfl.com → ascendmb.com | — | MISTAG — primary care, psychiatry, ketamine therapy, medical weight loss. No autism services |
| 7508 | Alice A. Hylton, OTR | none | — | MISTAG — individual occupational therapist |
| 8685 | Claudia L. Martinez, Occupational | none | — | MISTAG — individual OT; name truncated mid-word |
| 7236 | Judith Johnson, OT | none | — | MISTAG — individual OT |
| 6537 | Susan E. Underwood, OTR | none | — | MISTAG — individual OT |
| 8804 | Rayanne Woodruff, SLP | risimaging.com | — | MISTAG — individual SLP, **and the website belongs to a radiology imaging company** |
| 7233 | Creative Community Counseling | cathyghent.com | — | MISTAG — solo counselor |
| 8663 | Heather Stambaugh, LMHC LPC NCC CFMHE | lkldtherapyformisfits.com | — | MISTAG — individual mental-health counselor |
| 8828 | Perspective A Counseling Center LLC | none | — | MISTAG — counseling |
| 6629 | Sunshine Circle Speech & Language | sunshinecircle-slp.com | — | MISTAG — speech therapy |
| 9072 | `integrity therapy services, llc login` | integritytherapy.info | — | MISTAG — **the name is a scraped page title including the word "login"**; PT/OT practice |
| 8955 | USF Health Dept of Pediatrics, Early Steps Program | health.usf.edu | — | MISTAG — Early Steps is Florida's early-intervention program |
| 10387 | Learnary | learnary.com | — | UNRESOLVED — site returned no content |

### Tallahassee (16)

| id | Name | Website | Rating | Assessment |
|---|---|---|---|---|
| 6921 | Bryter Way, A.B.A. | bryterwayaba.com | — | **GENUINE** — "tailored therapy for children diagnosed with autism" |
| 6974 | Southeastern Behavioral Health | sebhfl.com | — | MISTAG — general behavioral health, no autism or ABA mention anywhere |
| 6851 | Attachment and Experiential Therapy, LLC | adptherapy.com | — | MISTAG — attachment therapy; phone is **(603) New Hampshire** |
| 6604 | Canopy Counseling & Consulting, LLC | canopy-counseling.com | — | MISTAG — counseling |
| 6739 | Evolving Strong, LLC | evolvingstrong.com | — | MISTAG — counseling practice |
| 5860 | Effective Expression Speech Therapy | none | — | MISTAG — speech; phone **(732) New Jersey**; address `4052 Bald Cypress Way` is the **FL Dept of Health HQ**, not a clinic |
| 9115 | FABA | none | — | MISTAG — Florida Association for Behavior Analysis is a **professional association**, not a provider |
| 6834 | Florida Association of Centers for Independent Living | floridacils.org | — | MISTAG — statewide advocacy umbrella |
| 7355 | Florida Learning Disabilities Research Center | fldrc.fsu.edu | — | MISTAG — FSU research centre |
| 7411 | FSU Center for Academic and Professional Development | learningforlife.fsu.edu | — | MISTAG — adult continuing education |
| 6548 | Susan Goldstein Consulting | susangoldsteinconsulting.com | — | MISTAG — solo consultant; phone **(954) Broward** |
| 7256 | Louis M. Tornyai, OTC | none | — | MISTAG — individual |
| 7129 | WordPLAY Therapy Services | wordplay850.com | — | MISTAG — speech/language |
| 6908 | Learning Alternative Behaviors | none | — | UNRESOLVED — name is plausible ABA; phone **(904) Jacksonville** |
| 6602 | Bright Stars Therapy Inc | none | — | UNRESOLVED |
| 7128 | Veritas Therapy Group | none | — | UNRESOLVED |

---

## Part 2 — Group B: rated, fewer than 10 reviews (68 rows)

**7 genuine · 56 mistagged · 5 unresolvable → 89% mistag rate on resolvable rows**

### The genuine ones

| id | Name | City | Rating | Reviews | Assessment |
|---|---|---|---:|---:|---|
| 9017 | ABA WAY | LAKELAND | 5 | 5 | **GENUINE** — verified ABA for ASD and developmental disabilities |
| 7475 | I Love ABA llc | LAKELAND | 5 | 6 | **GENUINE** — "1x1 ABA therapy in your home, school, or community" |
| 9048 | Neurodevelopmental Center for Children | LAKELAND | 5 | 6 | **GENUINE** — hopefultherapies.com, ABA + speech + OT + PT |
| 6545 | The Orchard ABA LLC | TALLAHASSEE | 5 | 4 | **GENUINE** — verified BCBA-supervised ABA |
| 7094 | Florida Autism Center Tallahassee (BlueSprig) | TALLAHASSEE | 4.3 | 6 | **GENUINE** — national ABA provider. Note name carries scrape garbage: `- 2868 Mahan Dr , 26, 27` |
| 7095 | Hopebridge Autism Therapy Center - Tallahassee | TALLAHASSEE | 3 | 7 | **GENUINE** — national ABA provider. Name also carries an appended address |
| 7473 | Engage Behavioral Health | TALLAHASSEE | 5 | 1 | **GENUINE (caveat)** — domain 301-redirects to invocompanies.com corporate; local page is gone |

### Representative mistags — the ones that show what this import really is

| id | Name | City | Rating | Reviews | Assessment |
|---|---|---|---:|---:|---|
| 7087 | New Hope Intervention, LLC | TALLAHASSEE | 1 | 1 | MISTAG — **a batterer's intervention program.** Also anger management and an anti-theft program. This is the recycling-nonprofit equivalent |
| 7125 | Agency for Persons with Disabilities | TALLAHASSEE | 3.4 | 8 | MISTAG — **a Florida state agency** |
| 7046 | Florida Developmental Disabilities Council | TALLAHASSEE | 3 | 2 | MISTAG — state council |
| 8959 | The Able Trust | TALLAHASSEE | 5 | 1 | MISTAG — disability employment foundation |
| 8795 | employU | TALLAHASSEE | 5 | 2 | MISTAG — employment services; (407) Orlando phone |
| 6887 | Future Pathways | TALLAHASSEE | 4.7 | 9 | MISTAG — verified: career development and independent-living skills for **teens and adults** |
| 6751 | Learning to Achieve Wellness - TMS Therapy & Spravato | LAKELAND | 5 | 3 | MISTAG — adult TMS and esketamine clinic |
| 7184 | R & R Travel Therapy | TALLAHASSEE | 5 | 1 | MISTAG — travel-therapist staffing |
| 6730 | FSU Psychology Clinic | TALLAHASSEE | 4.3 | 4 | MISTAG — university training clinic |
| 7409 | Stannard Chuck | TALLAHASSEE | 5 | 4 | MISTAG — individual, and the name is stored **surname-first** |
| 6920 | Families First of Florida, LLC | TALLAHASSEE | 4.2 | 5 | MISTAG — child welfare |
| 7465 | KINTI COUNSELING, LLC | LAKELAND | 5 | 1 | MISTAG — website is a raw SimplePractice client portal |
| 8907 | Better Brain Care | TALLAHASSEE | 5 | 1 | MISTAG — website is a third-party directory listing page |
| 6560 | Infinite Spectrum Foundation Inc. | TALLAHASSEE | 5 | 1 | MISTAG — autism foundation, not a therapy provider |

The remaining 42 mistags in this group are near-uniformly solo counselors and
counseling centers: Black Swan Counseling, Floret Counseling, Thoughtful
Counseling, Cue Counseling, Hope Counseling Centers, Lightside Psychology, Stoa
Life Counseling, Whitney Owens Counseling, Living Free Counseling, Gulf Wind
Counseling, Renaissance Somatic Counseling, Anew Life Counseling, Talk Lift Heal,
Lang Counseling, Erica Miller Counseling, ABLE Counseling, Restoration and
Wellness, Chamomile Psychology, Powers of Mind, Enso Psych Group, Railey &
Associates, Behavioral Health Solutions, Psychological & Family Consultants, plus
named individuals (Anne O. Tierney LCSW, Kristin Allen LMHC, Marie H. Guilford
PhD, Ricke Jill L PhD, Catherine M. Seifer MA, Kara T Vaassen LMHC, Rick Zalanka
LMHC, Susan Truett LMHC, Dorothy Hopkins LLC) and speech providers (Grow the Vine
Speech, Tiny Wonders Speech, Children's Communication Center, Sunny Pediatric
Services/sunnyspeech.com, Speech Language Pathology Services of Tallahassee).

Unresolvable: 7013 Holladay Child Development Services, 6812 Enrichment Services
Int., 7375 IMPACT Therapy, 7270 Pediatric Therapy Services Tallahassee, 6867
Let's Talk & Move Therapy Center.

---

## Part 3 — Group C: well-rated, 10+ reviews (49 rows)

**4 genuine · 45 mistagged · 0 unresolvable → 92% mistag rate**

This is the group that was supposed to be clean. It is not.

### The genuine ones

| id | Name | City | Rating | Reviews |
|---|---|---|---:|---:|
| 6756 | Acorn Health ABA Therapy - Lakeland | LAKELAND | 4.1 | 17 | **GENUINE** — verified "ABA Therapy & Treatment In Lakeland, FL" |
| 6958 | Applied Behavioral Learning Experiences - Lakeland | LAKELAND | 4 | 54 | **GENUINE** — established FL ABA provider (no website on file) |
| 6521 | Learn and Rise | LAKELAND | 4.9 | 29 | **GENUINE** — Google Sites page, URL slug `behaviortherapy`; site is login-gated so unverified |
| 7479 | Cayer Behavioral Group | TALLAHASSEE | 4 | 28 | **GENUINE** — verified "leader in Pediatric autism services in North Florida" |

### The mistags, worst first

| id | Name | City | Rating | Reviews | Assessment |
|---|---|---|---:|---:|---|
| 6724 | Capernaum Medical Center | LAKELAND | 3.7 | **589** | MISTAG — verified **pediatric neurology and epilepsy**. Highest review count in the entire cohort |
| 7076 | North Florida Pediatric Associates | TALLAHASSEE | 4.3 | 291 | MISTAG — a pediatrician's office |
| 8841 | North Florida Spine and Wellness | TALLAHASSEE | 5 | 284 | MISTAG — **chiropractic clinic** |
| 7472 | LifeStance Health - Lakeland | LAKELAND | 4.6 | 452 | MISTAG — adult outpatient mental health |
| 7361 | NeuroSpa | LAKELAND | 5 | 116 | MISTAG — adult TMS / ketamine |
| 8993 | Johns Hopkins All Children's Outpatient Care | LAKELAND | 4.4 | 115 | MISTAG — pediatric hospital outpatient centre |
| 6805 | Tri-County Human Services, Inc. | LAKELAND | 3.9 | 104 | MISTAG — substance abuse treatment |
| 7390 | Pathway Wellness | TALLAHASSEE | 4.8 | 92 | MISTAG — wellness clinic |
| 7109 | Elite DNA Behavioral Health | TALLAHASSEE | 3.6 | 84 | MISTAG — general behavioral health |
| 9084 | Thriveworks Counseling & Psychiatry | TALLAHASSEE | 4.3 | 75 | MISTAG — adult counseling chain |
| 6700 | Noah's Ark of Central Florida | LAKELAND | 4.4 | 75 | MISTAG — adult DD residential/day program |
| 7195 | Apalachee Center | TALLAHASSEE | 2.3 | 43 | MISTAG — community mental health / crisis |
| 8615 | Adult Education-West Area Adult School | LAKELAND | 4.4 | 36 | MISTAG — **an adult school** |
| 7078 | Better Living Solutions Recovery Center | TALLAHASSEE | 3.9 | 16 | MISTAG — eating disorder treatment |
| 6718 | FAAST, Inc | TALLAHASSEE | 4.8 | 15 | MISTAG — assistive technology program |
| 6734 | Tallahassee Development Center | TALLAHASSEE | 3.3 | 15 | MISTAG — adult DD day program |
| 6658 | Sunrise Community Inc | TALLAHASSEE | 4.3 | 13 | MISTAG — adult DD group homes |
| 7127 | Alliance For Independence | LAKELAND | 4.3 | 10 | MISTAG — adult DD services |
| 7316 | Early Childhood Learning Center | LAKELAND | 4 | 10 | MISTAG — VPK / preschool |
| 7003 | Virtually Speaking | LAKELAND | 4.8 | 17 | MISTAG — teletherapy SLP |
| 5849 | Capital Speech & Language Therapy Services | TALLAHASSEE | 5 | 85 | MISTAG — speech therapy |
| 6648 | Caroline's Speech Retreat | TALLAHASSEE | 5 | 24 | MISTAG — pediatric speech therapy |
| 6651 | Southeastern Therapy Services - Speech Therapy | TALLAHASSEE | 3.5 | 11 | MISTAG — speech therapy |
| 6943 | Harmony at Home Coaching / The Kid Coach | LAKELAND | 5 | 16 | MISTAG — parent coaching |

Remaining 21 mistags are counseling and psychology practices: Meadowbrook
Psychiatric, Kindelan McDanal & Associates, Atala Counseling, Psychological
Associates of Central Florida, Family Life Counseling, Serenity Counseling,
Silver Lining Counseling, New Directions Counseling, Masterpiece Counseling,
Renewed Integrative Counseling, ABC Mental Health & Relationship Counseling, The
Sabol Center, WellStead Mental Health, Lifespan Psychiatric, Red Hills
Counseling, A Time To Change Counseling, Therapeutic Endeavors, Diamond
Behavioral Health, Ability Plus Mental Health, Tallahassee Counseling Center, SG
Mental Health Counseling.

---

## Part 4 — Does rating presence predict tag reliability? No.

| Group | Rows | Genuine | Mistag | Unresolved | **Mistag rate (resolvable)** |
|---|---:|---:|---:|---:|---:|
| A — no rating | 31 | 2 | 25 | 4 | **93%** |
| B — rated, <10 reviews | 68 | 7 | 56 | 5 | **89%** |
| C — rated, 10+ reviews | 49 | 4 | 45 | 0 | **92%** |
| **All** | **148** | **13** | **126** | **9** | **91%** |

**Stated plainly: the rates do not differ.** 93% / 89% / 92% is noise around a
flat 91%. Rating presence tells you a business exists and has customers — it says
nothing about whether the `services` tag on that row is correct.

Two consequences:

1. **The ratings-based content block from the re-rank doc is still usable for
   copy, but useless for triage.** It cannot be used to filter rows into a
   trustworthy subset.
2. **This is a whole-table defect, not a city defect.** `legacy_migration` is
   1,154 rows across the state. If the `aba` tag is ~91% wrong in the two cities
   that ranked #1 and #4, there is no reason to expect the other cities differ,
   and no reason to expect only the `aba` tag is affected. Note how many rows
   above are speech, OT or counseling practices — the same rows are likely
   mistagged into `speech-therapy` and `occupational-therapy` too.

### What the import actually was

The pattern is unmistakable: someone scraped **the entire mental-health,
counseling and therapy market** in each city and applied `aba` across the
results. Every source now has a signature defect:

| Source | What it really is | Defect |
|---|---|---|
| FL-DD Database | Medicaid DD waiver registry | 86% blanket-tagged `aba` — includes group homes, assisted living, a recycling nonprofit |
| Google Places (PT/OT/ST) | Adult ortho/sports PT scrape | 42% adult sports/ortho, 1% mention autism |
| legacy_migration | Counseling / mental-health / "therapy" scrape | **91% mistagged `aba` — includes a batterer's intervention program, a chiropractor, a state agency, an adult school** |

All three imports over-tagged. None was per-record reviewed.

---

## Part 5 — Is Tallahassee's 85 real?

**It is not a duplication artifact. Every row is a distinct organization.**

| Metric | Value |
|---|---|
| Non-FL-DD `aba` rows in Tallahassee | 84 |
| Distinct phone numbers | **84 / 84** |
| Distinct names | **84 / 84** |
| Distinct website domains | **70 / 70** |
| Distinct addresses | 79 (5 shared — normal for shared office buildings) |

Zero deduplication needed. So the count is real — as a count of **distinct
businesses**. It is an artifact as a count of **ABA providers**. Real ABA in
Tallahassee is approximately **6**.

### Why Tallahassee over-indexes past Miami and Tampa

Because it is the **state capital**, and the scrape swept up statewide
organisations headquartered there and tagged them as local ABA providers:

- Agency for Persons with Disabilities (state agency)
- Florida Developmental Disabilities Council (state council)
- FABA — Florida Association for Behavior Analysis (professional body)
- Florida Association of Centers for Independent Living (statewide umbrella)
- The Able Trust, FAAST Inc., employU (statewide nonprofits)
- Florida Learning Disabilities Research Center, FSU Psychology Clinic, FSU
  Center for Academic and Professional Development (university entities)

Add FSU's dense private-counseling market and you get 84 "providers" in a metro
of ~200k. The ranking signal was measuring *proximity to state government*, not
service availability. Population intuition was correct and the data was wrong.

---

## Part 6 — What this means for the pilot

**The revised 13-page pilot in `pseo_pilot_rerank_no_flDD_2026-08-17.md` is dead
as specified.** Pages 1 and 2 were Tallahassee (85) and Lakeland (68). Actual
ABA provider counts are ~6 and ~7. Pages 3-13 were selected by the same
`legacy_migration` count and have not been checked, but there is no reason to
expect them to hold.

Three findings now stack in the same direction:

1. `verified` is an import-source label, not a check.
2. Non-FL-DD counts are inflated by a counseling-market scrape.
3. Every ranking signal tried so far — verified count, raw provider count,
   non-FL-DD count, website presence, rating coverage — is downstream of
   `source`, and every source is over-tagged.

**There is no ranking signal left that survives contact with the data.** The
blocker is not page generation or content templating. It is that `resources.services`
does not reliably describe what the provider does, and no column on the table
tells you which rows to trust.

### Recommendation

Stop pSEO work. The directory's core promise — filter by service, get providers
who offer that service — is currently not met on the provider search page either.
A parent filtering `/providers?service=aba` in Tallahassee today gets 84 results
of which ~6 are ABA providers. That is a live product problem that outranks the
pilot.

The tractable path is a positive-signal re-tag rather than another ranking
attempt: derive `aba` from evidence (name or website containing ABA / applied
behavior analysis / behavior analyst / BCBA / autism), review the shortlist by
hand, and treat everything else as untagged for that service. In these two cities
that yields ~13 rows from 148 — small, but correct. Scaled to the 3,700-row table
it is a real curation project, and it should be scoped and costed before any page
generation is discussed again.

---

## Suggested next step

Run the same evidence-based count statewide — how many `aba`-tagged rows have ABA
evidence in the name or website versus how many do not — to size the re-tag job
before committing to it.
