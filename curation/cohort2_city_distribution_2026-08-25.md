# Cohort 2 city distribution — sequencing advice before the batch runs — 2026-08-25

Cohort 2 = `source = 'legacy_migration'` AND `'aba' = ANY(services)` AND the record carries
**more than one** service. This is the population curation has agreed to take next.

Measured against the live DB and the manifest committed in `bb36087` (354 pages, 46 `aba`).

---

## Row counts at every step

| Step | Count | Expected | |
|---|---|---|---|
| `aba`-tagged providers | 849 | — | |
| Cohort 1 (`legacy_migration`, aba only) | 470 | — | curation's *current* population |
| **Cohort 2 (`legacy_migration`, aba + others)** | **168** | **168** | OK — matches the addendum |
| Cohort 3 (every other source, incl. `source IS NULL`) | 211 | — | |
| Sum | **849** | 849 | OK |
| Cities holding cohort 2 | **51** | — | 43 with a page, 8 without |
| Live `aba` pages | 46 | 46 | matches manifest |
| Pages with at least one cohort 2 record | **43** | — | 93% of pages |

> The cohort split is easy to get wrong: 53 `aba` rows have `source IS NULL`, and the natural
> predicate `NOT c1 AND NOT c2` evaluates to NULL for them and **silently drops them**. Sum the
> three cohorts against the total every time. First attempt here came to 796, not 849.

---

## The direct answer: cohort 2 is NOT concentrated in the seven zero-margin cities

| City | aba total | cohort 1 | **cohort 2** | cohort 3 |
|---|---|---|---|---|
| Clearwater | 16 | 13 | **1** | 2 |
| North Miami Beach | 8 | 5 | **2** | 1 |
| Palm Springs | 6 | 1 | **1** | 4 |
| Port Orange | 4 | 1 | **1** | 2 |
| **Spring Hill** | 16 | 12 | **0** | 4 |
| **Stuart** | 6 | 1 | **0** | 5 |
| Tamarac | 4 | 1 | **2** | 1 |
| **Total** | **60** | 34 | **7** | 19 |

**7 of 168 cohort 2 records — 4.2% — sit in the seven zero-margin cities**, which hold
60 of 849 `aba` records, or **7.1%**. Cohort 2 is *under*-represented there, not concentrated.
Spring Hill and Stuart contain **none of it at all**.

**On the question as asked, the batch does not need sequencing.** Run it.

---

## But the sequencing risk is real, and it is somewhere else entirely

Looking at cohort 2 in isolation understates it badly. Three numbers:

| Scenario | Pages lost (of 46) |
|---|---|
| Cohort 1 removed (curation's current batch) | **16** |
| Cohort 2 removed (the next batch) | **7** |
| **Both removed** | **33** |

**15 pages die only in combination** — neither cohort alone takes them, both together do.
16 + 7 = 23, but the real total is 33. The gap is the whole finding.

This is the same non-monotonic eligibility rule biting again. A page at 34 records losing 30
to cohort 1 survives at 4; losing 4 more to cohort 2 takes it to 0. Neither batch "caused" it.

### Pages that die ONLY when both cohorts are removed (15)

| City | aba total | cohort 1 | cohort 2 | survivors | of which single_city |
|---|---|---|---|---|---|
| Tallahassee | 57 | 46 | 9 | 2 | 1 |
| Fort Myers | 34 | 21 | 10 | 3 | 0 |
| Lakeland | 34 | 30 | 4 | **0** | 0 |
| Port St. Lucie | 25 | 18 | 5 | 2 | 2 |
| Hialeah | 21 | 12 | 5 | 4 | 0 |
| Miami Lakes | 19 | 8 | 8 | 3 | 0 |
| Pembroke Pines | 17 | 11 | 5 | 1 | 0 |
| Clearwater | 16 | 13 | 1 | 2 | 1 |
| Davie | 15 | 11 | 3 | 1 | 1 |
| Palm Bay | 15 | 11 | 2 | 2 | 2 |
| Coral Gables | 11 | 6 | 4 | 1 | 0 |
| Miramar | 10 | 3 | 3 | 4 | 1 |
| North Miami Beach | 8 | 5 | 2 | 1 | 1 |
| Palm Springs | 6 | 1 | 1 | 4 | 1 |
| Port Orange | 4 | 1 | 1 | 2 | 1 |

**Tallahassee, Fort Myers and Lakeland are the ones to look at.** These are among the largest
`aba` pages on the site and every one of them is called "safe" by the current watch list.
Lakeland ends at **zero** surviving records.

**Four of the seven zero-margin cities are on this list** — Clearwater, North Miami Beach,
Palm Springs, Port Orange. That is the retag-margin prediction from the 08-24 addendum
cashing out exactly as modelled: those pages had margin of 1 against non-cohort-1 removal,
and cohort 2 is non-cohort-1 removal. Spring Hill and Stuart hold, because their load-bearing
records are Google Places imports (cohort 3), which no batch is currently aimed at.

### Pages cohort 2 kills that cohort 1 would not have (2)

| City | aba total | cohort 1 | cohort 2 | survivors |
|---|---|---|---|---|
| **Coconut Creek** | 5 | 1 | **4** | 0 |
| **Tamarac** | 4 | 1 | **2** | 1 |

These are the only two pages where cohort 2 is *new* URL loss. Coconut Creek is 80% cohort 2
and ends at zero. The other five pages cohort 2 kills — Hallandale Beach, Miami Beach,
Miami Gardens, Miami Springs, South Miami — are already dead from cohort 1, so cohort 2 costs
nothing extra there.

---

## Full per-city table, cities holding cohort 2

`page after c2` = would the page survive removing all cohort 2 records from that city.
`page after both` = would it survive removing cohort 1 and cohort 2.

| City | aba total | c1 | **c2** | c3 | page now | after c2 | after both |
|---|---|---|---|---|---|---|---|
| Orlando | 58 | 38 | 12 | 8 | yes | yes | yes |
| Tampa | 56 | 31 | 11 | 14 | yes | yes | yes |
| Fort Myers | 34 | 21 | 10 | 3 | yes | yes | **NO** |
| West Palm Beach | 26 | 13 | 10 | 3 | yes | yes | yes |
| Tallahassee | 57 | 46 | 9 | 2 | yes | yes | **NO** |
| Jacksonville | 41 | 23 | 8 | 10 | yes | yes | yes |
| Miami Lakes | 19 | 8 | 8 | 3 | yes | yes | **NO** |
| Miami | 43 | 25 | 7 | 11 | yes | yes | yes |
| Hollywood | 26 | 7 | 6 | 13 | yes | yes | yes |
| Port St. Lucie | 25 | 18 | 5 | 2 | yes | yes | **NO** |
| Hialeah | 21 | 12 | 5 | 4 | yes | yes | **NO** |
| Pembroke Pines | 17 | 11 | 5 | 1 | yes | yes | **NO** |
| Lakeland | 34 | 30 | 4 | 0 | yes | yes | **NO** |
| Cape Coral | 21 | 14 | 4 | 3 | yes | yes | yes |
| Fort Lauderdale | 12 | 4 | 4 | 4 | yes | yes | yes |
| Coral Gables | 11 | 6 | 4 | 1 | yes | yes | **NO** |
| **Coconut Creek** | 5 | 1 | 4 | 0 | yes | **NO** | **NO** |
| Gainesville | 30 | 23 | 3 | 4 | yes | yes | yes |
| Davie | 15 | 11 | 3 | 1 | yes | yes | **NO** |
| Miramar | 10 | 3 | 3 | 4 | yes | yes | **NO** |
| Boca Raton | 8 | 0 | 3 | 5 | yes | yes | yes |
| Palm Bay | 15 | 11 | 2 | 2 | yes | yes | **NO** |
| Melbourne | 10 | 0 | 2 | 8 | yes | yes | yes |
| Weston | 8 | 4 | 2 | 2 | yes | yes | **NO** (c1) |
| Coral Springs | 8 | 5 | 2 | 1 | yes | yes | **NO** (c1) |
| North Miami Beach | 8 | 5 | 2 | 1 | yes | yes | **NO** |
| Ormond Beach | 7 | 4 | 2 | 1 | yes | yes | **NO** (c1) |
| Lake Worth Beach | 5 | 3 | 2 | 0 | yes | yes | **NO** (c1) |
| **Tamarac** | 4 | 1 | 2 | 1 | yes | **NO** | **NO** |
| Miami Springs | 4 | 2 | 2 | 0 | yes | **NO** | **NO** (c1 too) |
| Clearwater | 16 | 13 | 1 | 2 | yes | yes | **NO** |
| Winter Park | 14 | 11 | 1 | 2 | yes | yes | **NO** (c1) |
| Largo | 7 | 6 | 1 | 0 | yes | yes | **NO** (c1) |
| Daytona Beach | 7 | 6 | 1 | 0 | yes | yes | **NO** (c1) |
| Palm Springs | 6 | 1 | 1 | 4 | yes | yes | **NO** |
| Aventura | 5 | 4 | 1 | 0 | yes | yes | **NO** (c1) |
| Port Orange | 4 | 1 | 1 | 2 | yes | yes | **NO** |
| Lauderhill | 4 | 2 | 1 | 1 | yes | yes | **NO** (c1) |
| North Miami | 4 | 3 | 1 | 0 | yes | yes | **NO** (c1) |
| Miami Beach | 3 | 2 | 1 | 0 | yes | **NO** | **NO** (c1 too) |
| Hallandale Beach | 3 | 2 | 1 | 0 | yes | **NO** | **NO** (c1 too) |
| Miami Gardens | 3 | 1 | 1 | 1 | yes | **NO** | **NO** (c1 too) |
| South Miami | 3 | 2 | 1 | 0 | yes | **NO** | **NO** (c1 too) |

`(c1)` marks pages cohort 1 alone already kills — cohort 2 adds nothing there.

### Cities holding cohort 2 with no page to lose (8)

Miami Shores 2, Dania Beach 1, Homestead 1, Jensen Beach 1, Maitland 1, Margate 1,
Palm Beach Gardens 1, Pembroke Park 1. **11 records, zero URL exposure.** Free work — no
reason to sequence around any of it.

---

## What to tell curation

1. **Run the batch. It does not need sequencing on the grounds you were worried about.**
   Cohort 2 barely touches the zero-margin cities and is entirely absent from the two
   sharpest ones.
2. **The number that matters is 33 of 46, not 7 of 46.** Cohort 1 and cohort 2 together take
   72% of the `aba` pages. Neither batch looks dangerous alone. If the plan is to run both,
   that is the figure to plan against.
3. **Handle Coconut Creek deliberately.** 4 of its 5 records are cohort 2 and the page ends
   at zero. It is the only genuinely new page loss of any size.
4. **Do the 8 pageless cities first if a warm-up is wanted.** 11 records, no URL risk.
5. **Spring Hill and Stuart are now the only zero-margin cities that survive both batches**,
   and they survive on Google Places records — a pain-and-spine clinic, a generic healthcare
   LLC, two counseling practices. Cohort 3 is the next thing that would take them, and
   nothing is currently aimed at it.

## The transferable point

**Cohort-at-a-time risk assessment understates cumulative risk whenever the eligibility rule
is non-monotonic.** Each batch is measured against the live page count, so each looks safe;
the page that survives batch 1 at 4 records dies to a batch 2 that only removes 4. Model the
**union** of planned populations, not each one against today's state.
