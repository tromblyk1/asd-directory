# SCOPE & VOCABULARY DECISIONS — KEITH, 2026-08-28

These are settled. Do not re-raise them. Cite this file if they resurface.

---

## 1. COUNSELING / PSYCHIATRY / PSYCHOLOGY — **OUT OF SCOPE**

**Decision:** Not in scope. No counseling, psychiatry, psychotherapy, or
mental-health slug will be created.

**Rule that follows:** A record whose primary service is counseling or
talk therapy, and which has no *other* applicable existing tag, is
REMOVED. A record that legitimately carries `ados-testing`,
`group-therapy`, `parent-coaching`, or another valid slug KEEPS that tag
and stays listed — the counseling decision does not evict it.

**Population:** 108 records match the name pattern (counsel / psycholog /
psychiatr / psychotherap / mental health). ~76 already carry a valid
non-counseling tag and are unaffected. ~32 are affected: 19 aba-only,
12 with no service tag, plus 6709.

**Caveat carried forward:** Of the 12 no-service records, prior sessions
found roughly half of no-service records had a BAD ADDRESS rather than a
missing tag. Verify address before treating any of them as a vocabulary
casualty.

**6709 Mosaic Psychiatry — CONFIRMED DELETE.** Keith checked their
services page; Ctrl-F for "autism" and "ASD" returned zero results.

**Known gap this creates:** 39 of the 108 came from
`Google Places (PT/OT/ST)` and were never seen by the earlier 95-record
counseling batch, which was scoped to `legacy_migration` only.

---

## 2. TRANSPORTATION — **OUT OF SCOPE (resources table)**

**Decision:** Out. Not autism-specific. Reasoning: it primarily serves
autistic adults, who can find transportation services through the same
channels as anyone else. Consistent with the existing
MOBILITY-IS-NOT-AUTISM rule that removed the APD accessibility
contractors.

**Scope of the decision:** `resources` table ONLY.
`ppec_centers.transportation` (127 rows) is untouched — it describes a
service bundled into medical daycare and is legitimate there.

**Actions that follow:**
- The ~24 `resources` records tagged `transportation` are removal
  candidates (confirm count before acting).
- The untagged transportation providers are NOT to be tagged. They are
  removal candidates.
- 8607 LEE COUNTY BOARD OF CO COMMISSIONERS / LEE TRAN PASSPORT SERVICE
  — county paratransit — resolves to REMOVE under this decision.
- pSEO added `transportation` to ProviderDetail's display map on
  2026-08-28. That needs REVERSING on the resources side.

---

## 3. `autism-travel` — **KEEP**

**Decision:** Keep the slug and keep record 10571 (Paradise Coast Travel,
Bonita Springs).

**Reason:** This was a provider who submitted through the new-resource
form, and Keith made the call himself at the time. It is not an orphan
artifact of an import.

**Action:** Overrides the earlier delete-and-drop recommendation. pSEO
had excluded `autism-travel` from the slug display fix pending this
decision — it now needs the FULL shippability chain: detail page,
display mapping on every load-bearing surface including ProvidersByCity,
and a filter option.

---

## 4. `financial-planning` — **KEEP**

**Decision:** Same as autism-travel. Submitted provider, Keith's own
call. One record is fine.

**Action:** Verify it has detail page + display mapping + filter option.
Route to pSEO with autism-travel.

---

## 5. `pet-therapy` — **DEAD STRING ONLY, CATEGORY IS ALIVE**

**Resolved, not a decision.** `pet-therapy` was RENAMED to
`animal-therapy`. `animal-therapy` currently holds 107 records. Nothing
was deleted. No SQL was ever run that removed this category.

**Action:** Remove the dead `pet-therapy` string wherever it still
appears in code. Zero data impact.

---

## 6. `inpp` — **PENDING KEITH, RECOMMENDATION = DROP**

**Status:** Only item on this list still open.

**What it is:** The INPP method — Institute for Neuro-Physiological
Psychology, developed by Sally Goddard Blythe. A primitive-reflex
integration program: roughly a year of movement exercises intended to
inhibit retained infant reflexes, marketed for learning difficulties and
anxiety.

**Why drop:**
- Targets learning difficulties, ADHD, and motor immaturity — NOT autism
  specifically
- Evidence base is thin; the main supporting study's authors flagged weak
  validity, and a related primitive-reflex ADHD paper was retracted
- ZERO records in `resources`, `ppec_centers`, or anywhere else

---

## 7. ADULT PRIMARY CARE / I-DD MEDICAL HOME — **OUT, WITH A CONDITION**

**Decision:** In scope ONLY if specifically specialized for autistic or
I/DD adults. General primary care does not qualify. Nothing general
(PCPs, transportation, and similar) is admitted on the basis that
autistic adults also use it.

**8806 UF Health Jacksonville PAIDD:** MEETS the scope criterion — it is
an I/DD-specific medical home, not a general PCP. But it FAILS on
vocabulary economics: one record, no slug to sit on, and unverified
contact info. Under the sparse-coverage rule (five statewide is a guide,
not a filter chip), it stays deleted.

**Reopen only if** a survey establishes that 5+ I/DD adult medical homes
exist in Florida. Otherwise this is guide content, not directory
content.

---

## 8. WOLFSON / BAPTIST RECORDS — **DELEGATED TO COWORK**

**Decision:** Keith is not reviewing these individually. A dedicated
Cowork batch parses every Wolfson/Baptist record and returns a
keep/remove argument per listing.

**Trigger:** Two records at the SAME street address
(1747 Baptist Clay Dr, Fleming Island) with different suites, different
phones, and an identical tag set:
- 10235 Wolfson Children's Rehabilitation — Wolfson Children's Specialty
  Center — Baptist Clay · Suite 100 · (904) 516-1800
- 10004 Wolfson Children's Specialty Center — Baptist Clay ·
  no suite · (904) 202-8000

Both tagged Speech / OT / PT.

**The batch question** is which records describe DISTINCT service
locations, not what each one does. Different job from the aba batch.

**Also folded in:** 8522 and 9261 (Wolfson Children's Behavioral Health,
Bartram Park and Southbank), both aba-only and both `verified = true`.

---

## STILL OPEN — BUT NOT KEITH'S DECISIONS

Routed to research or query. Do not put these in front of him as
decisions.

- FL-DD 12 aba-only records → Cowork
- ~46 FL-DD two-line names → mechanical + Cowork
- ~902 `http://` records → sample 20 and fetch, establish real failure rate
- ~113 no-services records → VERIFY ADDRESS FIRST
- Scholarship chip verification vs Step Up's approved-provider list
- 6722 All Kids Therapy Center → Claude in Chrome (JS-only site)
- 6624 Children Autism Help → needs a phone call, not another fetch
- The `verified = true` integrity question → answerable by query
  (does verified correlate with source/created_at blocks, i.e. did an
  import set it?), NOT by asking Keith
- 6 UNCLEAR individual records → single batch decision when the aba
  cleanup closes
- `art-therapy` (4 in resources, 13 in ppec) → already wired by pSEO,
  no decision needed
