# pSEO landing page mockup — ABA therapy in Tampa

**Date:** 2026-08-18
**Purpose:** one page of real copy, built only from data that exists right now, to test
whether a service+location generator produces anything worth publishing.
**Status:** written mockup. No code, no template, nothing built.

---

## Part 1 — Which combo, and why

### The earlier re-rank is dead. Recomputed from scratch.

Tallahassee and Lakeland were #1 and #4 in the 2026-08-17 re-rank. **Both are gone.** The
provider table has shed ~150 rows since (3,334 → 3,182 providers), but that is not what
changed the answer — the ranking signal did.

Ranking non-FL-DD `aba`-tagged rows by raw count still puts **Tallahassee first with 79**.
Ranking the same rows by *website evidence* — a join to `provider_services_wide` where the
crawler's `ABA` flag is true, with the CBT/DBT substring exclusion applied — puts
**Tallahassee thirteenth with 7**. The state-capital scrape artifact documented on
2026-08-17 is fully intact: Tallahassee's lead is statewide agencies, councils and FSU
entities headquartered there, not ABA clinics. Lakeland does not reach the top 15 on either
measure.

Recomputed top of the table:

| City | `aba`-tagged, non-FL-DD | With website evidence | Ratio |
|---|---:|---:|---:|
| **Tampa** | 64 | **25** | 39% |
| Orlando | 69 | 24 | 35% |
| Jacksonville | 54 | 18 | 33% |
| West Palm Beach | 31 | 18 | 58% |
| Miami | 48 | 16 | 33% |
| … | | | |
| Tallahassee | **79** | 7 | **9%** |

*[Query: `resources` where `resource_type='provider'` and `'aba' = ANY(services)` and
`source <> 'FL-DD Database'`, LEFT JOIN `provider_services_wide` on normalized phone OR
website domain, filtered to `ABA = true` with the CBT/DBT regex exclusion, grouped by
`canonical_city`.]*

**Chosen combo: ABA therapy + Tampa.** It has the most evidence-backed providers (25) of any
Florida city. If a generator cannot produce a publishable page for the single best cell in
the matrix, it cannot produce one for cell #400.

### Caveat carried into the mockup

The 25 are *evidence-backed*, not *verified*. The crawler flag scores 56% raw precision,
~91% after the CBT/DBT exclusion. Reading the 25 excerpts, at least four should not be on
this page:

- **GiGi's Playhouse Tampa** (id 9131) — a Down syndrome achievement center. Its excerpt is
  a staff testimonial mentioning ABA as a career interest.
- **The Little Years Therapy Co.** (id 8853) — excerpt reads "collaborating with … ABA, OT,
  PT." They coordinate with ABA providers; they do not deliver it.
- **Quest, Inc. Training Center & Tampa Corporate Office** (id 5835) — the corporate office,
  same street address as Quest Kids Therapy (id 5808). A duplicate storefront.
- **InBloom Autism Services | Tampa** (id 8507) and **Positive Behavior Supports – Tampa**
  (id 10622) — both carry chain excerpts describing a *different* branch (Davie and
  Suwannee River respectively). Company offers ABA; this page asserts the Tampa branch does.

So the real number is roughly 20–21, and it is not knowable without the hand review. The
page below is written at 25 because that is what the data says today.

---

## Part 2 — The page

Everything below is what a parent would see. Bracketed notes are provenance and would not
appear on the page.

---

### ABA Therapy in Tampa, Florida

**25 ABA providers listed in Tampa** *[COUNT(\*) of the evidence-backed set above]*

If your child has just been diagnosed with autism and a pediatrician has recommended ABA,
you are probably starting with a list of names and no way to tell them apart. This page
lists the ABA providers we have on file in Tampa, with address, phone and the other services
each one lists, so you can build a call list.

*[Not data-derived. Generic framing, identical on every page except the city name.]*

Tampa's ABA providers are spread across 11 ZIP codes, from Ybor and downtown (33602) out to
Carrollwood and Citrus Park (33618, 33625) and south to Gandy and Ballast Point (33611,
33629). *[`COUNT(DISTINCT zip_code)` = 11; individual ZIPs from `zip_code`. Neighborhood
names are my own gloss on the ZIPs — **not in the database**.]*

Ten of the 25 list ABA as their only service. The other fifteen list at least one more —
most commonly parent coaching (8 providers), then speech or occupational therapy under the
same roof (5), and ADOS diagnostic testing (3). *[`array_length(services,1)=1` = 10;
`'parent-coaching' = ANY(services)` = 8; `'speech-therapy' OR 'occupational-therapy'` = 5;
`'ados-testing'` = 3.]*

Twenty of the 25 have a Google rating on file, averaging 4.8. *[`rating IS NOT NULL` = 20;
`AVG(rating)` = 4.79. Ratings are frozen at 2025-10-18 — ~10 months stale.]*

Eleven are marked verified in our directory. *[`verified = true` = 11. **This column is a
source label, not a web check** — see `project_verified_flag_is_source_label`. Publishing it
as if it meant "we checked" would be a false claim. I would cut this sentence.]*

---

#### What we could not tell you

*[This section is me, not the page. Every sentence below is one I tried to write and could
not support.]*

- **Insurance.** Only 5 of the 25 have any value in `insurances`. Cannot write "X providers
  accept Florida Medicaid."
- **Ages served.** `age_groups` is populated on **0 of 25**. Cannot write "providers serving
  toddlers through teens."
- **Waitlists, hours, in-home vs center, BCBA counts, Spanish-speaking staff.** No column
  exists for any of these. These are the questions parents actually ask.
- **Provider descriptions.** `description` is non-empty on **2 of 25**, and both are one-line
  import artifacts. There is no per-provider prose to render.

---

#### ABA providers in Tampa

*[All 25 rows. Fields: `name`, `address`, `zip_code`, `phone`, `services`. Nothing else is
reliably present.]*

| Provider | Address | ZIP | Phone | Also lists |
|---|---|---|---|---|
| ABA Centers of Florida – Tampa | 4343 Anchor Plaza Pkwy, Ste 150 | 33634 | (844) 669-4222 | ADOS testing, life skills, parent coaching, mobile |
| ABA Therapy Hillsborough – Positive Behavior Health Developments | 400 N Ashley Dr, Ste 1900 | 33602 | (888) 343-7222 | — |
| ABC Behavioral Services | 8910 N Dale Mabry Hwy | 33614 | (813) 399-1396 | Life skills |
| Achieve Behavior | 217 S Matanzas Ave | 33609 | (813) 250-0482 | — |
| Blue Peninsula ABA Inc. | 4730 N Habana Ave | 33614 | (813) 353-0706 | — |
| Bright Days Behavior | 4025 W Waters Ave #114 | 33614 | (813) 290-0680 | — |
| Butterfly Effects – ABA Therapy for Autism | 10004 N Dale Mabry Hwy | 33618 | (888) 880-9270 | — |
| Decker Therapy Services | 4810 W Gandy Blvd | 33611 | (813) 380-8230 | Feeding, speech, OT |
| Florida Autism Center of Excellence (F.A.C.E.) | 6310 E Sligh Ave | 33617 | (813) 985-3223 | Support groups |
| General Behavior Analysis | 5406 Hoover Blvd | 33634 | (813) 249-8901 | — |
| GiGi's Playhouse Tampa | 3611 W Hillsborough Ave #200 | 33614 | (813) 544-8000 | PT, OT, tutoring, speech |
| Hand In Hand Behavior Therapy | 5410 Mariner St #175 | 33609 | (813) 461-5380 | Life skills, parent coaching |
| I Can Grow ABA Therapy INC | 6408 W Linebaugh Ave #106 | 33625 | (813) 405-4201 | — |
| InBloom Autism Services – Tampa | 5447 Beaumont Center Blvd | 33634 | (888) 754-0398 | Parent coaching, group, virtual |
| Kyo Autism Therapy | 100 S Ashley Dr #600 | 33602 | (877) 264-6747 | — |
| Little Blue Bees Behavior Therapy | 2700 N MacDill Ave | 33607 | (813) 644-6538 | — |
| Positive Behavior Supports Corp. – Tampa | 1413 Tech Blvd | 33619 | (855) 832-6727 | Group, parent coaching, mobile |
| Prestige Behavior Therapy | 5321 Memorial Hwy | 33634 | (813) 252-0825 | Life skills, support groups, parent coaching |
| Project Brilliance Tampa | 8170 Woodland Center Blvd | 33614 | (813) 252-4232 | Group, ADOS testing, parent coaching |
| Quest Kids Therapy – Tampa | 3910 US-301 | 33619 | (407) 218-4300 | Life skills |
| Quest, Inc. Training Center & Corporate Office | 3910 US-301 | 33619 | — | Life skills |
| Success On The Spectrum – Carrollwood | 4014 Gunn Hwy | 33618 | (813) 923-9905 | Life skills, OT, speech, group, support groups |
| Tampa Kids Therapy | 3801 S Manhattan Ave | 33611 | (813) 530-5954 | Feeding, group, exec function, ADOS, PT, OT, parent coaching |
| The Little Years Therapy Co. | 4318 W El Prado Blvd | 33629 | (813) 444-3622 | Feeding, speech, virtual, parent coaching |
| Transforming Treasures | 6702 N Gunlock Ave | 33614 | (813) 644-5766 | — |

*[One row has no phone (id 5835). Two rows share an address (5808/5835). Eleven of the
"Also lists" cells are empty because the provider is tagged `aba` and nothing else.]*

---

#### Also in Tampa

12 autism-friendly events listed in Tampa. *[`events` WHERE `city='Tampa'` = 12. Events
expire; this number is a moving target and can go to zero.]*

143 schools listed in Hillsborough County. *[`schools` WHERE `district='HILLSBOROUGH'` = 143.
Requires the county↔city mapping; correct for Tampa, ambiguous for cities that straddle
county lines.]*

---

## Part 3 — The near-duplicate question

**Direct answer: for the next four cities, roughly 85% of the non-list copy is identical,
and the 15% that changes is numerals.**

Here is every sentence on the page, scored against Orlando, Jacksonville, West Palm Beach
and Miami:

| Page element | Changes across the 5 cities? |
|---|---|
| H1 | City name only |
| Provider count | 25 / 24 / 18 / 18 / 16 — a numeral |
| Intro paragraph | **Nothing.** Not data-derived at all |
| ZIP-spread sentence | 11 / 11 / 7 / 7 / 13 ZIPs — a numeral plus my hand-written neighborhood gloss, which does not scale to 400 pages |
| Service-mix sentence | 10/8/5/3 → 13/5/4/3 → 6/5/5/3 → 10/3/2/1 → 7/5/3/2. Numerals. The *ranking* (ABA-only first, parent coaching second) is identical in all five |
| Rating sentence | 4.79 / 4.20 / 4.41 / 4.79 / 4.82. All "about 4.5 stars." Says nothing distinguishing, and all five are equally stale |
| Verified sentence | Should be cut on all five |
| Provider table | **Fully distinct.** The only genuinely unique content |
| Events count | 12 / 24 / 12 / 2 / 6. West Palm Beach's 2 is too thin to render |
| Schools count | 143 / 205 / 139 / 113 / 471 |

*[All figures from one grouped query over the five cities: `has_desc`, `has_ins`,
`has_ages`, `has_rating`, `verified`, per-service counts, `COUNT(DISTINCT zip_code)`,
`AVG(rating)`.]*

The structural problem is that the fields which would let pages diverge are empty in the
same way everywhere:

| | Tampa | Orlando | Jacksonville | W. Palm Bch | Miami |
|---|---:|---:|---:|---:|---:|
| Providers | 25 | 24 | 18 | 18 | 16 |
| With a description | 2 | 1 | 1 | **0** | 1 |
| With insurance data | 5 | 5 | 3 | 5 | 3 |
| With age ranges | **0** | **0** | **0** | **0** | **0** |
| Tagged mobile-services | 2 | 2 | 1 | 1 | 2 |

`age_groups` is empty in all five. `description` is empty in ~95% of rows in all five.
`insurances` sits at 17–28% in all five. **The sparsity is uniform, so it cannot be a source
of differentiation** — every city is thin in exactly the same places.

### What that means for shipping

You asked what is left after the three dead blocks. What is left is: a headline, a count, a
generic intro, three sentences of numerals, and a table. The table is real and it is the
reason a parent would use the page. Everything wrapped around it is a template with
variables substituted — which is the definition of the near-duplicate pattern Google
demotes, and there would be ~719 of them.

Two honest readings:

1. **The table alone justifies the page.** A directory listing of 25 local ABA providers
   with addresses and phone numbers has real user value even if the prose is thin. Ship the
   table, cut every sentence above it except the count, and accept these are index pages
   rather than content pages. Risk: 719 pages whose only unique content is a table is still
   the near-duplicate pattern, just with less padding to argue about.

2. **The page is not ready and the missing data is the project.** `age_groups` at 0%,
   `description` at 5%, `insurances` at 20%, plus no waitlist, hours, in-home/center, or
   BCBA-count fields — those are what parents ask and what would make Tampa read differently
   from Orlando. None of it can be generated; it has to be collected.

My read: **the ranking work is finished and the answer it produced is that the generator is
not the bottleneck.** Building it now yields 719 pages that differ by a numeral and a table.
The two things that would change that are the ABA re-tag (in progress — 424 rows split into
`aba_shortlist_chains` and `aba_shortlist_individual`, verdict columns still empty) and a
field-collection pass on ages, insurance and intake. Neither is generator work.

Also worth stating plainly: on the single best cell in the matrix, ~4 of 25 listings are
wrong, and I can see that by reading. At cell #400 the counts fall to 3–5 providers, where
one bad row is 25% of the page.
