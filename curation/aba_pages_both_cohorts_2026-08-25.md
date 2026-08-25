# The 33 — aba pages that fall if both cohort 1 and cohort 2 are removed — 2026-08-25

Per-page detail behind the headline number in `cohort2_city_distribution_2026-08-25.md`.
Curation is deciding whether to proceed on "33 of 46", so this is which specific pages go.

Measured against the manifest committed in `bb36087` (354 pages, 46 `aba`) and the live DB.

---

## Read this first: 33 is a ceiling, not a forecast

The model assumes **every** cohort 1 and cohort 2 record leaves `aba`. That is the worst case,
not the expected case. Cohort 1 is a *review* population — the counseling batch came back
91 REMOVE / 3 KEEP / 1 UNCLEAR, so the keep rate is low, but it is not zero, and one kept
record in the right city saves a page.

**Use 33 as the exposure if the cleanup runs to completion.** The realised number will be
lower and depends on which specific records are kept, not how many.

## Row counts at every step

| Step | Count | Expected | |
|---|---|---|---|
| Live `aba` pages | 46 | 46 | matches manifest |
| Die from cohort 1 alone | 16 | 16 | |
| Die from cohort 2 alone | 7 | 7 | |
| **Die from both** | **33** | **33** | 16 + 7 = 23, so 10 more than the parts |
| Die *only* in combination | 15 | — | neither batch alone takes them |
| **Survive both** | **13** | 46 − 33 = 13 | OK |
| Of the 33, die on the **floor** (survivors < 3) | 28 | — | |
| Of the 33, die on **`single_city`** (survivors 3–4) | **5** | **4 per your note** | **see below** |

---

## Correction: it is five that die on `single_city`, not four

| City | survivors | of which single_city |
|---|---|---|
| Hialeah | 4 | 0 |
| Miramar | 4 | 1 |
| Palm Springs | 4 | 1 |
| **Fort Myers** | **3** | **0** |
| **Miami Lakes** | **3** | **0** |

Three land at 4 survivors and two at 3. If "above 3" was meant strictly, it is three
(Hialeah, Miramar, Palm Springs); if it meant "at or above the floor", it is five. Either
reading, four is not a count that appears in the data.

**These are the ones a casual read misses.** All five finish at or above the 3-provider
floor and all five are ineligible anyway, because the 3–4 band additionally requires
`single_city >= 2`. Fort Myers is the sharpest illustration: it is the third-largest `aba`
page on the site at 34 providers, it ends with 3 real survivors, and **none of the three is
a single-city business** — all are chain branches or multi-city domains. The page reads as
"still has providers" and is gone.

---

## The 33, dying on `single_city` (5)

| Page | aba now | cohort 1 | cohort 2 | cohort 3 survivors | surv. single_city | dies on |
|---|---|---|---|---|---|---|
| `aba/hialeah` | 21 | 12 | 5 | 4 | 0 | single_city |
| `aba/miramar` | 10 | 3 | 3 | 4 | 1 | single_city |
| `aba/palm-springs` | 6 | 1 | 1 | 4 | 1 | single_city |
| `aba/fort-myers` | 34 | 21 | 10 | 3 | 0 | single_city |
| `aba/miami-lakes` | 19 | 8 | 8 | 3 | 0 | single_city |

## The 33, dying on the floor (28)

Ordered by survivors, then by current size.

| Page | aba now | cohort 1 | cohort 2 | cohort 3 survivors | surv. single_city | dies on |
|---|---|---|---|---|---|---|
| `aba/tallahassee` | 57 | 46 | 9 | 2 | 1 | floor |
| `aba/port-st-lucie` | 25 | 18 | 5 | 2 | 2 | floor |
| `aba/clearwater` | 16 | 13 | 1 | 2 | 1 | floor |
| `aba/palm-bay` | 15 | 11 | 2 | 2 | 2 | floor |
| `aba/winter-park` | 14 | 11 | 1 | 2 | 0 | floor |
| `aba/weston` | 8 | 4 | 2 | 2 | 0 | floor |
| `aba/port-orange` | 4 | 1 | 1 | 2 | 1 | floor |
| `aba/pembroke-pines` | 17 | 11 | 5 | 1 | 0 | floor |
| `aba/davie` | 15 | 11 | 3 | 1 | 1 | floor |
| `aba/coral-gables` | 11 | 6 | 4 | 1 | 0 | floor |
| `aba/coral-springs` | 8 | 5 | 2 | 1 | 0 | floor |
| `aba/north-miami-beach` | 8 | 5 | 2 | 1 | 1 | floor |
| `aba/ormond-beach` | 7 | 4 | 2 | 1 | 0 | floor |
| `aba/lauderhill` | 4 | 2 | 1 | 1 | 1 | floor |
| `aba/tamarac` | 4 | 1 | 2 | 1 | 0 | floor |
| `aba/plantation` | 3 | 2 | 0 | 1 | 0 | floor |
| `aba/miami-gardens` | 3 | 1 | 1 | 1 | 0 | floor |
| `aba/lakeland` | 34 | 30 | 4 | **0** | 0 | floor |
| `aba/largo` | 7 | 6 | 1 | **0** | 0 | floor |
| `aba/daytona-beach` | 7 | 6 | 1 | **0** | 0 | floor |
| `aba/aventura` | 5 | 4 | 1 | **0** | 0 | floor |
| `aba/lake-worth-beach` | 5 | 3 | 2 | **0** | 0 | floor |
| `aba/coconut-creek` | 5 | 1 | 4 | **0** | 0 | floor |
| `aba/north-miami` | 4 | 3 | 1 | **0** | 0 | floor |
| `aba/miami-springs` | 4 | 2 | 2 | **0** | 0 | floor |
| `aba/miami-beach` | 3 | 2 | 1 | **0** | 0 | floor |
| `aba/hallandale-beach` | 3 | 2 | 1 | **0** | 0 | floor |
| `aba/south-miami` | 3 | 2 | 1 | **0** | 0 | floor |

**Eleven pages end at literally zero `aba` records.** `aba/lakeland` is the one to look at —
34 providers today, 30 cohort 1, 4 cohort 2, and **not a single record from any other
source**. The page is 100% defective import. It is also, by the 08-24 watch list, "safe."

---

## The three biggest pages on the list

| Page | aba now | survivors | watch list verdict today |
|---|---|---|---|
| `aba/tallahassee` | 57 | 2 | safe |
| `aba/fort-myers` | 34 | 3 | safe |
| `aba/lakeland` | 34 | 0 | safe |

All three are called safe by the current watch list, because that column asks only whether
the page survives **cohort 1**. It does — Tallahassee at 11, Fort Myers at 13, Lakeland at 4.
Cohort 2 then takes 9, 10 and 4 more.

This is the size illusion from the original report, one layer down. **Contamination made
these pages big; removing contamination in two passes rather than one does not make them
survive it.**

---

## The 13 that survive both

| Page | aba now | cohort 1 | cohort 2 | survivors | surv. single_city |
|---|---|---|---|---|---|
| `aba/tampa` | 56 | 31 | 11 | 14 | 7 |
| `aba/hollywood` | 26 | 7 | 6 | 13 | 7 |
| `aba/miami` | 43 | 25 | 7 | 11 | 6 |
| `aba/jacksonville` | 41 | 23 | 8 | 10 | 0 |
| `aba/orlando` | 58 | 38 | 12 | 8 | 5 |
| `aba/melbourne` | 10 | 0 | 2 | 8 | 5 |
| `aba/boca-raton` | 8 | 0 | 3 | 5 | 2 |
| `aba/stuart` | 6 | 1 | 0 | 5 | 2 |
| `aba/gainesville` | 30 | 23 | 3 | 4 | 2 |
| `aba/spring-hill` | 16 | 12 | 0 | 4 | 2 |
| `aba/fort-lauderdale` | 12 | 4 | 4 | 4 | 2 |
| `aba/west-palm-beach` | 26 | 13 | 10 | 3 | 2 |
| `aba/cape-coral` | 21 | 14 | 4 | 3 | 2 |

**Seven of the 13 survive with a margin of one.** Boca Raton, Stuart, Gainesville, Spring
Hill, Fort Lauderdale, West Palm Beach and Cape Coral all end with exactly 2 single-city
records. Losing one of those — to a cohort 3 review, a closure, a website change that merges
two domains — drops them below the `single_city >= 2` half of the rule. Boca Raton and Stuart
sit at 5 survivors and still have this exposure, which is the same trap as Palm Springs and
Stuart in the 08-24 addendum.

**Only Tampa, Hollywood, Miami, Jacksonville, Orlando and Melbourne have real depth.**

---

## What to tell curation

1. **33 of 46 is the ceiling if both batches run to completion**, not a prediction. Keeps
   change it, and one keep in the right city is worth more than ten in Orlando.
2. **Five pages die while still showing 3 or 4 providers** — Hialeah, Miramar, Palm Springs,
   Fort Myers, Miami Lakes. Do not spot-check this work by eyeballing whether a city "still
   has providers left."
3. **Eleven pages end at zero.** Lakeland is 100% defective import at 34 records.
4. **The end state is 13 pages, and 7 of those 13 have a margin of one.** If both batches
   run, `aba` goes from 46 pages to 13, of which 6 are genuinely robust.
5. **This is not an argument against the cleanup.** A page held up by 30 mistagged records is
   a page that should not rank. It is an argument for knowing the number before starting
   rather than discovering it in Search Console eight weeks later.
