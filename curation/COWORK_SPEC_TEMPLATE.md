# CANONICAL COWORK SPEC TEMPLATE — Florida Autism Services Directory

**Read this file before writing ANY Cowork research spec. Do not compose
a spec from memory.** Five specs written in one session drifted from each
other because each was re-derived rather than built from a source. Every
rule below was earned by a specific failure and costs records when
dropped.

Version: 2026-08-29

---

## HOW TO USE

Copy the SPEC BODY below. Fill the bracketed fields. Delete only the
sections that genuinely cannot apply to the batch. When a batch teaches
something new, add it here first, then use it.

**Before writing the spec:**
1. Confirm the actual row count with a query. Never guess it.
2. Read the record list and hand-pull obvious cases. This has saved 4–55
   records of budget on every batch.
3. State the row count TWICE in the spec — intro and row-conservation
   block.

---

## SPEC BODY

```
You are researching [N] provider records from a Florida autism services
directory[, drawn from CITIES]. Every record currently carries "[TAG]" as
its only service tag. That tag came from a bulk import that stamped it
indiscriminately, so assume nothing about it.

[If applicable: The obvious cases have already been removed by hand, so
expect this set to be harder than a typical batch.]

INPUT FILE
C:\Projects\ASD-Directory\curation\[FILENAME].csv

OUTPUT FILE
C:\Projects\ASD-Directory\curation\[FILENAME]_RESULTS.csv

The input file contains exactly [N] rows. Your output file must contain
exactly [N] rows. This is checked first.

WHAT TO DETERMINE FOR EACH RECORD

1. Is the business still operating?
2. Does it have a working website of its own?
3. What is its primary service?
4. Does it actually deliver ABA (applied behavior analysis)?
5. Is there a named BCBA associated with it?
6. Does it serve autistic people or people with developmental
   disabilities specifically?

THE BCBA TEST

A Board Certified Behavior Analyst on staff is what distinguishes a real
ABA provider from a counseling practice using behavioral techniques. An
LMHC, LCSW, psychologist, or psychiatrist applying behavioral methods is
NOT an ABA provider.

The evidence is asymmetric. NO BCBA anywhere on the site or in the NPI
registry is strong evidence AGAINST an ABA tag. A BCBA being present is
only suggestive and needs a second signal: RBTs on staff, a dedicated ABA
service page, Medicaid ABA billing, or BHCOE accreditation.

When you confirm ABA, NAME the individual BCBA. If the site says "our
BCBAs" without naming anyone, write "none named". That distinction is
recorded in the directory and matters when a listing is challenged.

NPI taxonomy 103K00000X is Behavior Analyst. 251S00000X is
Community/Behavioral Health. They are not interchangeable, and a
Community/Behavioral Health taxonomy is evidence AGAINST an ABA tag.

TRAP 1 — SITE-WIDE CHROME

Evidence must come from content that VARIES between pages. Compare at
least two pages before crediting anything. A service list in a footer, a
header nav, or a condition index appears on every page and describes the
WEBSITE, not the practice. If "autism" or "ABA" appears in identical text
on the home page, the contact page and the about page, it is chrome and
it is not evidence.

TRAP 2 — PARENT ORGANISATIONS AND AFFILIATES

Large organisations list every service the whole org offers while an
individual location runs only some of them. Credit the named location,
never the parent's full service list.

Confirmed instances: UF Health, FSU, Johns Hopkins All Children's,
AdventHealth, University of Miami, BayCare, Wolfson/Baptist, Devereux.
A hospital system's condition index is never evidence for a specific
clinic.

TRAP 3 — ADULT VERSUS PEDIATRIC

Adult OT, adult mental health, geriatric care and adult residential
services do not belong in this directory. Establish the physical SETTING
and the actual CASELOAD, not the license type.

Generic OT taxonomy 225X00000X and generic SLP taxonomy 235Z00000X do NOT
distinguish pediatric from adult. Neither does a name.

This trap has produced 22+ removals. It is the single most common failure
mode in this project. Settings that resolved it: worksite employee health
clinics, senior-living campuses, adult ICF/IID cluster homes, home health
agencies, lymphedema and wound care practices, general outpatient rehab.

SCOPE RULE — COUNSELING IS OUT

This directory does NOT list counseling, psychotherapy, psychiatry,
psychology or general mental health practices. If a provider's primary
service is talk therapy, medication management, trauma or PTSD treatment,
substance abuse treatment, or life coaching, it does not belong here,
EVEN IF the practice mentions autism among conditions it sees.

The exception is a practice that delivers a service the directory DOES
list — autism diagnostic evaluation (ADOS testing), group therapy for
autistic clients, or parent coaching. If a psychology or neuropsychology
practice performs autism evaluations, say so explicitly, because that
changes the outcome. CHECK THIS EXCEPTION ON EVERY COUNSELING-ADJACENT
RECORD AND STATE THAT YOU CHECKED.

SCOPE RULE — RELATED BUT NOT AUTISM

Cerebral palsy, Down syndrome, aged care, mobility/accessibility, and
general disability services are not autism. An organisation serving
developmental disabilities BROADLY may qualify; one exclusive to a
different condition does not. State which in notes.

SCOPE RULE — TRANSPORTATION IS OUT

Transportation and paratransit are out of scope for the resources table.
Not autism-specific.

TABLE PLACEMENT

Some records are schools, preschools, daycares or PPEC centers rather
than therapy providers. For each, answer: CAN A PARENT BOOK THIS SERVICE
WITHOUT ENROLLING THEIR CHILD IN A PROGRAM?

If therapy is available only to enrolled students, say so — that record
belongs in a different table. If a program is open to community families
as well as enrolled ones, the resources entry IS warranted; say that too.

INDIVIDUALS ARE NOT SERVICE LOCATIONS

A record naming a person plus a credential ("Jane Smith, OT") is a
clinician, not a place. Determine what organisation they practice at.
The organisation is the record that belongs in the directory.

RULES

Never infer a service from the business name alone. "Behavioral,"
"Therapy," "Solutions," "Spectrum," "Institute," "Academy," "Threshold"
and "Kids" tell you nothing on their own.

No website is a FINDING, not a failure. Record it and move on. Check the
NPI registry, the Florida Division of Corporations (Sunbiz) and AHCA
listings before concluding anything.

The AHCA behavior analysis provider list is a WHITELIST ONLY. Presence
confirms. Absence proves nothing.

A P.O. box is not a service location.

A lapsed domain that redirects to an unrelated site — parked pages,
gambling sites, for-sale pages — means the business likely no longer
operates. Say so explicitly and corroborate with Sunbiz and NPI. Three
defunct providers were found this way.

An NPI or Sunbiz registration persists after a business stops operating.
Registration alone is never proof of an operating business.

Strip Google My Business and Facebook tracking parameters (everything
from "?" onward) before fetching.

If you cannot establish something, say UNCLEAR. An honest UNCLEAR is more
useful than a confident guess.

RECOMMENDATION VALUES

KEEP_ABA    — evidence supports that this provider delivers ABA
KEEP_OTHER  — real provider, belongs in an autism directory, but the
              service is something other than ABA
REMOVE      — not autism or developmental disability relevant, not
              operating, out of scope, or not a service provider at all
UNCLEAR     — could not establish

For EVERY record you keep, whether KEEP_ABA or KEEP_OTHER, state the FULL
CORRECT TAG SET in notes — not just what is wrong with the current one.
A verdict without a tag set means the retag never gets written.

Valid slugs ONLY: aba, speech-therapy, occupational-therapy,
physical-therapy, feeding-therapy, music-therapy, animal-therapy,
art-therapy, dir-floortime, aac, ados-testing, life-skills,
executive-function-coaching, respite-care, residential-program, tutoring,
support-groups, group-therapy, parent-coaching, virtual-therapy,
mobile-services, adult-day-training, supported-employment,
supported-living, prevocational-training, in-home-nursing,
recreation-programs, autism-travel, financial-planning

Also flag any address, phone or website in the input that contradicts
what the provider publishes.

OUTPUT COLUMNS, in this order

id, name, city, operating, website_found, body_text_returned,
primary_service, delivers_aba, bcba_found, autism_relevant, recommend,
evidence_url, evidence_quality, notes

body_text_returned is YES, NO, or N/A.
  NO means the page returned HTTP 200 but served no readable body text —
  normally JS-only rendering. A 200 with an empty body is NOT a working
  page for research purposes. Any verdict on such a record rests on
  indexed page titles and third-party sources, NOT on anything the
  provider published.
  When body_text_returned is NO, say so in notes and cap
  evidence_quality at LOW regardless of how confident the title makes
  the verdict look.
  N/A means no website on file, or the domain did not resolve at all.

evidence_quality is HIGH, MEDIUM or LOW. HIGH means a page specific to
this provider stating what they do. LOW means inference from thin
material. A registry entry alone is NEVER HIGH.

Put every reservation in notes.

ROW CONSERVATION

Exactly [N] output rows, one per input id. A record you could not resolve
returns a row saying so with recommend = UNCLEAR. An omitted row is
indistinguishable from a record that does not exist, and past batches
have lost exactly the records that mattered most this way. Count your
rows before writing the file.
```

---

## WHY body_text_returned EXISTS

A verdict backed by a page title looks identical to one backed by a full
page read in every other column. Only evidence_quality hints at it, and
only if the researcher was careful.

It is also a ROUTING signal, not just a confidence signal. A JS-only site
means research will NEVER resolve that record no matter how many passes
run — each pass re-reads the same absence. Records 6631 Psych Pro Centers
and 6722 All Kids Therapy Center each burned multiple passes before
anyone noticed the sites render nothing to automated fetching.

**When body_text_returned is NO, route to phone contact or Claude in
Chrome immediately. Do not schedule another research pass.**

---

## PROCESSING THE RESULTS — READ THIS BEFORE WRITING SQL

**Read the notes column in full for EVERY record, regardless of verdict.**
Tag sets, insurance lists, address corrections and website fixes live in
the reservation clause at the END of notes, including on KEEP_ABA records
where the verdict itself needs no action. Sorting records into verdict
buckets and writing SQL from the buckets loses all of it. This happened
and required a full re-read pass across two completed batches.

**Never put an undecided record in a DELETE statement.** Hesitation goes
ABOVE the SQL, never below it. Undecided records go in a separate block
run only after Keith decides.

**Every deletion pair names the file and path in the same message.**
SELECT slug capture → Keith saves CSV → DELETE.

**Caveats go above the SQL block.** Keith runs SQL immediately on receipt.
A caveat below the block is read after it has already run.

**Always name the provider alongside the id.** Every id handed over gets
its business name attached, every time — checking a record on a live site
is impossible with a bare number.
