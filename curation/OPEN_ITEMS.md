# OPEN ITEMS — Florida Autism Services Directory

**Last updated: 2026-08-29, end of session**

One file. Everything undone lives here. Nothing else needs to be
remembered.

---

## STATE OF THE DATABASE

- **2,658 providers** (started the day at 2,767)
- **554 records carry the `aba` chip** (was 1,034 when the cleanup began)
- **139 aba-only legacy_migration records**, of which **17 are unaudited**
- `review_reason` is now the audit marker on every record touched since
  2026-08-29. It is queryable. Use it, not the curation folder, to
  establish what has been reviewed.

**The ABA cleanup is closed as a project.** pSEO has regenerated the
manifest and sitemap with final counts.

---

## NEEDS KEITH — nobody else can do these

### 17 records needing phone calls
Full detail in `curation/aba_remaining_20_2026-08-29.csv` (3 of the 20
have since been deleted).

The four that have burned three research passes each and will never
resolve by search: **6624 Children Autism Help** (Miami), **8996 Autism
Early Intervention and Prevention Center** (Tampa), **6631 Psych Pro
Centers** (West Palm Beach), **8880 Crossworks Therapy By the BEACH**
(Cape Coral).

6631 is the highest value call — nobody has ever read a word of that
site's body content, and the answer decides whether it is a psych
practice (out of scope) or an evaluation practice doing ADOS (in scope).

### Decisions, not research
- **7484 Champions Club Special Needs Ministry** (Cape Coral) — a
  franchised ministry hosted at City First Church, which is not in the
  churches table. Parked for months. It is a missing RECORD TYPE, not a
  missing slug. Decide: churches table under the host congregation,
  delete, or leave.
- **6597 Tara J. Donohue, OT** (Port St. Lucie) — fits the adult-OT
  pattern that has now produced 22 removals. Better as part of a single
  batch verdict on the remaining UNCLEARs than as an individual call.
- **6974 Southeastern Behavioral Health** (Tallahassee) — HIGH evidence
  but genuinely mixed. Read sebhfl.com yourself and decide.
- **8976 Irving's Lodge** (Dania Beach) and **8878 Health and Healing
  Mental Health Center** (Port St. Lucie) — LOW-evidence removals held
  out of the delete blocks. Confirm and delete, or research once more.
- **6610 Family Initiative, Inc** (Cape Coral) — the ABA verdict rests on
  org-level pages; the Cape Coral location page never itemises which
  services run there. Same shape as Wolfson.
- **The Academy at NSU** — second schools row at 7600 SW 36th St, or
  not. SQL is written and waiting in the session history.

### Live-site checks (the thing you are fastest at)
- **6818 Prestige Behavioral Center, LLC.** — record says Cape Coral,
  their site and NPI say 150 Pondella Rd, North Fort Myers, plus a second
  NPI location in Naples. A city change moves which pSEO pages it feeds.
- **7319 Crystal Angels Behavior Center Inc** (Cape Coral) — record says
  4831 Coronado Pkwy, NPI says 1501 SE 21st Ln. Site is
  crystalangelsbehavior.com.
- **8966 South Florida Autism Charter School** — needs its grade range
  off sfacs.org before the schools INSERT completes.

### Needs Claude in Chrome
- **6722 All Kids Therapy Center** (Gainesville) — JS-only site, Cowork
  got nothing across multiple attempts. Which disciplines? Any BCBA?

---

## ROUTED — does not need Keith

### Table-placement inserts (7 records left `resources` today)
Slugs captured in `curation/aba_batch_final_deleted_slugs.csv`.

→ **ppec_centers**: 7220 Little Giants Kid's Services, 7425 Lisa L. Rappa
  (belongs as PediPec)
→ **schools**: 6863 Peace By Piece, 7340 Reaching Milestones Learning
  Center, 7300 Autism Institute for Learning and Development, 6603 The
  Chase Academy
→ **daycares**: 7316 Early Childhood Learning Center

### Genuine additions found during research
- **Reaching Milestones' separate Jacksonville ABA clinic** — different
  address from the Learning Center, zip 32216. A real missing record.
- **6711 Affluent Learning Center's Pre-K/K arm** — schools candidate,
  alongside Quest Kids, Fataj, Victory Center, Peace By Piece and LiFT.

### ~30 address, phone and website contradictions
Flagged in-row throughout the batch results files. Notable ones:
- **6838 Play and Learn Therapy** — stored 840 E Oakland Park Blvd is
  outright wrong; real address 3296 NW 9th Ave (already corrected)
- **6889 Angelic Steps Therapy** — publishes Davie, record says Hollywood
  (city change, moves pSEO pages)
- **6704 Little Eaters** — publishes 4651 Sheridan St Ste 220B vs stored
  4420
- **7477 Collaborative Solutions** — publishes a different address than
  the stored 6914 Aloma Ave
- **6499 Children's Diagnostic** — .org domain 302-redirects to .com
- **6965 MySpot** — stored Lauderhill URL 404s

---

## LARGER OPEN ITEMS — no deadline, real value

### 189 undated `verified` flags
`verified = true` with no `last_verified_date`. The 313 legacy_migration
and 15 Google Places verified records all carry dates and hold up. The
undated blocks were set by process, not by Keith:
- 87 accreditation rosters (PATH 43, EAGALA 5, ADI 4, service dogs 9,
  dual 2 — the 22 AHA records are now deleted)
- 66 null-source, 14 submission, 11 manual, 2 provider-submission

Roster membership proves an organisation was accredited on the day a list
was published. It does not confirm the row.

### 45 PATH International records missing websites
They have addresses and coordinates so they render fine. Lower priority
than it looks.

### ~902 `http://` website records, never sampled
The one confirmed failure was `http://www.` — Chrome hides both the
scheme and the `www.`, so a broken URL looks identical to a working one
in the address bar.

**Better approach than checking for broken links:** check for redirects to
unrelated domains. Three defunct providers were found that way today
(6869 Coral Behavioral, 6710 New Beginning, 8880 Crossworks) — a lapsed
domain picked up by a squatter correlates with a business that stopped
operating. Sample 20 and fetch them for a real failure rate before
writing any UPDATE across 902 rows.

### ~46 FL-DD two-line names
Names with an embedded `\n`. A mechanical pass fixed 29. The rest need
judgment — roughly 15 are INVERTED with a person on line 1 and the
business on line 2. Blanket truncation to line 1 would leave a bare
person's name as the public provider name.

Also unresolved: **6409 PELL JUDY L / 12/18/1955** — a date of birth in a
public name field. PII. Delete candidate.

### Scholarship chips, never verified
`fes-eo`, `pep`, `hope`, `ftc` all at 0. Nothing has ever checked
scholarship flags against Step Up's actual approved-provider list. The
iCraftStories founder confirmed her own site OVERSTATED ESA coverage for
Florida — a caution that applies to every scholarship claim in the
directory.

### ~2,763 records with NULL `coordinates_source`
Only ~46 populated. The column cannot describe coordinate quality across
the directory. Not urgent, but any geocoding backfill should set it for
everything it touches.

---

## EXTERNAL THREADS

- **Paige (Drift and Discover ABA, St. Petersburg)** — new submission,
  inserted and verified. Email sent asking about the 248 area code phone,
  whether Aetna is contracted or pending, and Step Up approval status.
  Awaiting reply. NOT a Featured Listings prospect yet — brand new
  practice still in credentialing.
- **Desiree Alonzo (iCraftStories / Unico Health NFP)** — Unico is
  retiring its provider finder. The thing worth having is their provider
  dataset. She has promised traffic numbers and specifics on the records.
  If she comes back again without them, the dataset probably is not real.
- **Omar Correa (Success On The Spectrum)** — 9 Florida locations, warm
  contact, CEO. A Featured Listings prospect. Outstanding: spot-check
  that the Gulf Breeze page no longer says "Opening Soon."
- **Heldor Goday (ABLE / Applied Behavioral Learning Experiences)** — 4
  submissions pending answers on a dead SSL cert, one phone number given
  for four locations, and two Census `Non_Exact` addresses. **Do not
  insert those four until he answers.** Note: their Clearwater location
  is already in the directory as record 8805.

---

## STANDING PATTERN — three families emailed the directory as an agency
this week, and one of them sent a minor's medical records three times.

They think the site is a service provider. The phone removal was the same
signal from a different angle. Worth a line above the fold on the
homepage saying what the site is not.

Also: the emergency housing request from Jean Farmer sat in the inbox for
11 days. If contact form submissions are not landing somewhere checked
daily, that is the actual problem — that message was an adult protective
services situation.
