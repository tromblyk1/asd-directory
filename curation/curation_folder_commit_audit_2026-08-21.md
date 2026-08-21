# Pre-commit audit of `curation/` (2026-08-21)

**Verdict: clean, safe to commit.** No credentials, no keys, no private personal data.
One thing to know before you read further, because it changes how the rest reads:

> **This repository is PUBLIC.** `api.github.com/repos/tromblyk1/asd-directory` returns
> `"private": false`. Everything committed here is world-readable and permanently in history.

The audit below was run against that assumption, not against a private-repo assumption.

## 1. Inventory

| | |
|---|---:|
| Files | **112** (110 at scan time, plus this report and the scholarship one) |
| Total size | 1.8 MB |
| `.csv` | 66 |
| `.md` | 28 |
| `.txt` | 13 |
| `.json` | 2 |
| `.py` | 1 |

Largest: `chains_verdicts.csv` (122 KB), `aba_shortlist_2026-08-18.csv` (108 KB),
`google_places_143_verdicts.csv` (103 KB), `insurance_lists_2026-08-21.csv` (81 KB).
Nothing large enough to be a repo-weight concern.

## 2. Credentials — none

Scanned for `api_key`, `secret`, `password`, `token`, `bearer`, `sk_live`, `sk_test`, `AKIA`,
PEM headers, JWTs (`eyJ…`), `service_role`, `anon_key`.

Eight files matched on keyword. **All eight are false positives** — ordinary English:

- `"The secret of change is to focus…"` (a quote scraped from a provider's site)
- `"token match, not the same place"` (a geocoding rejection note)
- `"measure token cost per record"` / `"budgeting agent tokens"` (LLM tokens)
- `split_addr(tokens)` (a Python function parsing street addresses)

Zero JWT-shaped or key-shaped strings anywhere.

## 3. Personal data — present, but already public

**12 personal-domain email addresses**, of which 11 are business contacts:

- **9 of the 11 are already live in the `resources` table** and rendered on the public site
  (`4childadvancement@`, `angeliccompanionservices.hr@`, `caringfamilygrouphome@`, `fstasst@`,
  `fussiontherapyinc@`, `impactslifeskillcenter@`, `lifedevelopmentalcenter@`,
  `littleexplorerstherapy@`, `nking0427@`).
- 2 are not in the DB (`DRPATRICK2016@`, `basetherapyoffice@`) — sole-practitioner business
  contacts from rejected/deleted candidate rows. Still business, not household, addresses.
- The 12th is **your own** (`keithtrombly07@gmail.com`), in `run_nominatim_2026-08-20.py:25` as
  the `CONTACT` User-Agent string Nominatim's usage policy requires. It is already the author
  line on every commit in this repo, so committing it adds no exposure.

**33 event organizer emails** in `events_candidates_2026-08-20.csv` — mostly named individuals
at institutions (`@miami.edu`, `@nova.edu`, `@fau.edu`, `@lovelandcenter.org`, `@brevardzoo.org`).
Checked a sample of 8 against the `events` table: **all 8 are already live**, and the `events`
table is anon-readable through the public Supabase key the SPA ships. So these are already
retrievable from the site today. No new exposure.

## 4. Scraped third-party content — the one real judgment call

`aba_shortlist_2026-08-18.csv` carries an `aba_excerpt` column: **406 excerpts scraped from
provider websites**, median **163 characters**, max 176. They exist as the evidence backing each
`aba` tag decision — which is precisely the audit trail you want tracked.

Short factual excerpts used as evidence is defensible, and the length cap keeps it that way.
Flagging it only so the decision is deliberate rather than accidental: **committing this puts
~406 snippets of other companies' website copy into a public repo.** I would still commit it —
without the excerpt the shortlist stops being evidence and becomes an unsourced assertion —
but you should be the one to make that call knowingly.

## 5. Editorial verdicts on named businesses — checked, not a problem

`*_verdicts.csv` files contain `DELETE` / `MISMATCH` / `REJECTED_*` calls against named real
companies. I read a sample expecting quality judgments and found **scope descriptions instead**:

- "Adult wellness studio franchise: cryotherapy, red light therapy, IV drips"
- "120-bed skilled nursing facility providing long-term residential and post-acute rehab"
- "Site is alive and not bot-blocked, but no machine-readable location list is published"

These are factual statements about what a business does, justifying exclusion from an autism
directory. Not assessments of whether anyone is any good at it. No exposure there.

Separately: `aba_shortlist_2026-08-18.csv` has `keith_verdict` and `keith_note` columns that are
**empty in all 424 rows** — template columns that were never filled.

## 6. Commercial / partner information — none

Scanned for dollar figures, rates, invoices, contract terms, and the Payer Law negotiation.
Matches are all incidental: the featured-tier *mechanism* is described (premium → enhanced →
basic → shuffle) but that logic is already in committed source, and one line notes that Payer
Law screenshots are untracked PNGs. **No pricing, no rates, no deal terms anywhere.**

## 7. Recommendation

**Commit all 112 files. No gitignore additions needed.**

The counter-argument I considered and rejected: excluding the scraped-excerpt and email-bearing
CSVs would leave the markdown decision records without their supporting evidence, which defeats
the point of tracking the folder. The contact data is already public through the site itself.

Not in scope and deliberately left untracked: `email_list/`, which holds a submission PDF, and
`images/Archive/`.
