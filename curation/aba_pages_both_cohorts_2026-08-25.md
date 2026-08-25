# CORRECTED — aba page loss under the cohort 1 cleanup — 2026-08-25

**This file replaces an earlier version that reported 33 of 46 pages lost. That number was
wrong and is withdrawn.** It assumed 100% of cohort 2 was removable. Curation read 59 of the
168 and found the `aba` tag correct on the large majority — ABA Results, Nexo ABA, Prodigy
Autism Center, The Scott Center for Autism Treatment, Florida Autism Center of Excellence.
ABA providers named as ABA providers. Five need work and none is a straightforward strip.

**Cohort 2 was never a population.** It was defined by the clause that excluded it from
cohort 1 — everything `legacy_migration` that was not `aba`-only. Its members share a source
string and nothing else. Modelling it as a removable block was a category error.

The shape confirms it: **118 of 168 carry 3+ services and 82 carry 4+.** Cohort 1's signature
is exactly one tag, which is a batch default. A four-element services array is hand curation.
Same source, different populations.

Re-run below at **5–10% of cohort 2 removable**.

---

## 1. Corrected page loss

| Scenario | aba pages lost (of 46) | |
|---|---|---|
| **Cohort 1 alone** | **16** | the number that matters |
| Cohort 1 + 10% of cohort 2, removals falling where they fall | **~17** | expected 16.9 |
| Cohort 1 + 10% of cohort 2, **adversarially placed** | **26** | worst case, see below |
| Cohort 1 + 5% of cohort 2, adversarially placed | 22 | |
| ~~Cohort 1 + 100% of cohort 2~~ | ~~33~~ | **withdrawn** |
| **Cohort 1 at the counseling keep rate + 10% cohort 2** | **~16** | the realistic case, section 4 |

**The honest headline is 16, and the pessimistic bound is 17, not 26.**

The 26 figure requires curation's 5–10% to be the *specific* 15 cohort 2 records out of 168
that sit in the thinnest cities. There is no mechanism that would produce that. If anything
the correlation runs the other way — the original watch list established that contamination
concentrates in **large** cities, so defective records are more likely to be where they cost
nothing.

Expected additional loss from a 10% cohort 2 removal, summed over per-page probabilities:
**0.89 pages.** Under one. That is the number to plan against.

### Why the adversarial bound is 26 and why it is not the planning number

10% of 168 is 16 records. Sorted by how many cohort 2 removals each surviving page can
absorb: five pages fall at a cost of 1 (5 records), five more at a cost of 2 (10 records).
15 records buys 10 pages if placed perfectly. The 16th buys nothing — the next page costs 3.

---

## 2. Which pages drop off the 33 — confirmed, and the expectation was inverted

**All 17 pages whose death required cohort 2 come off the certain-loss list.** The 33 becomes
16. Your five nominations were the right instinct applied to the wrong axis:

| Page | cohort 2 | of 34/19/21/11/5 | c2 removals needed to kill it | verdict |
|---|---|---|---|---|
| Fort Myers | 10 | of 34 | **9** | safest of the 17 |
| Miami Lakes | 8 | of 19 | **7** | very safe |
| Hialeah | 5 | of 21 | **5** | very safe |
| Coral Gables | 4 | of 11 | 2 | moderate |
| Coconut Creek | 4 | of 5 | 2 | moderate |

**Fort Myers, Miami Lakes and Hialeah drop off decisively.** Fort Myers needs 9 of its 10
cohort 2 records removed — 9 of a site-wide budget of 16. It is now among the *least*
exposed pages on the list.

**A high cohort 2 count means a high cost to kill, not a low one.** A page with 10 cohort 2
records has depth; a page with 1 has a single point of failure. Confirming rather than
assuming was the right call — the ranking is backwards from the intuition.

This is the same inversion as the original watch list's headline, one layer down:
**contamination share does not predict fragility, and where it correlates it runs backwards.**

### The pages that actually remain exposed — none of which you named

| Page | aba now | cohort 1 | **cohort 2** | survives cohort 1 at | c2 removals to kill |
|---|---|---|---|---|---|
| `aba/clearwater` | 16 | 13 | **1** | 3 (2 sc) | **1** |
| `aba/north-miami-beach` | 8 | 5 | **2** | 3 (3 sc) | **1** |
| `aba/palm-springs` | 6 | 1 | **1** | 5 (2 sc) | **1** |
| `aba/port-orange` | 4 | 1 | **1** | 3 (2 sc) | **1** |
| `aba/tamarac` | 4 | 1 | **2** | 3 (2 sc) | **1** |
| `aba/lakeland` | 34 | 30 | 4 | 4 (3 sc) | 2 |
| `aba/palm-bay` | 15 | 11 | 2 | 4 (3 sc) | 2 |
| `aba/davie` | 15 | 11 | 3 | 4 (3 sc) | 2 |
| `aba/coral-gables` | 11 | 6 | 4 | 5 (3 sc) | 2 |
| `aba/coconut-creek` | 5 | 1 | 4 | 4 (4 sc) | 2 |

**Clearwater is the sharpest case on the site.** It holds exactly one cohort 2 record, and
after cohort 1 clears, that record is the page. A 1-in-168 draw takes a 16-provider page.

Thirteen pages cannot be killed by cohort 2 at any rate: Orlando, Tampa, Miami, Jacksonville,
Gainesville, West Palm Beach, Hollywood, Cape Coral, Spring Hill, Fort Lauderdale, Melbourne,
Boca Raton, Stuart.

---

## 3. The five flagged for individual correction

**Two have already landed, during this session.** `aba/tallahassee` went 57 → 56 and
`aba/ormond-beach` 7 → 6 between two queries minutes apart. That is the unannounced-drift
mechanism you were asking about, observed live rather than theorised.

| Record | City | Status | Bucket | Load-bearing? |
|---|---|---|---|---|
| Elite DNA — Ormond Beach (7416) | Ormond Beach | **done** — now `occupational-therapy` only | multi_city | no |
| Elite DNA — Tallahassee (7109) | Tallahassee | **done** — now `occupational-therapy` only | multi_city | no |
| We Level Up Tamarac (7149) | Tamarac | still `group-therapy` + `aba` | **single_city** | **see below** |
| WellStead Mental Health (8948) | Tallahassee | still `aba` + `virtual-therapy` | single_city | no — Tallahassee absorbs 7 |
| MorMindful Therapy (9029) | Fort Lauderdale | still `animal-therapy` + `aba` | single_city | no — cannot be killed by cohort 2 |

Both Elite DNA records were `multi_city` (elitedna.com appears in 5 cities), so neither was
holding up the 3–4 band. Their removal cost each page exactly one provider and nothing else.

### No page dies on any one of the five, today

| City | today | minus the flagged record | after cohort 1 | after cohort 1 **and** the record |
|---|---|---|---|---|
| Tamarac | 4 (3 sc) — live | 3 (2 sc) — **live** | 3 (2 sc) — live | 2 (1 sc) — **DEAD** |
| Tallahassee | 56 (44 sc) — live | 55 (43 sc) — live | 10 (8 sc) — live | 9 (7 sc) — live |
| Fort Lauderdale | 12 (6 sc) — live | 11 (5 sc) — live | 8 (4 sc) — live | 7 (3 sc) — live |

**Direct answer: no.** Correcting We Level Up Tamarac today takes the page from 4 to 3 with
`single_city` 2, which still satisfies the 3–4 band. Nothing disappears unannounced.

**But it consumes Tamarac's entire remaining margin.** After it, `aba/tamarac` is a
3-provider page resting on exactly 2 single-city records, and cohort 1's single Tamarac
record then kills it. **Order matters and only for this one record:** correct We Level Up
*before* cohort 1 reaches Tamarac and the page dies in the batch, visibly, in a diff. Correct
it *after*, and it dies as a one-off with no report around it.

Recommend We Level Up Tamarac be handled inside a batch rather than as a standalone fix.
The other four are safe in any order.

---

## 4. The realistic case — applying the counseling keep rate to cohort 1

The counseling batch closed 91 REMOVE / 3 KEEP / 1 UNCLEAR. At 3-in-95, cohort 1's 470
records yield **~15 keeps**.

A keep only saves a page if it lands in one of the 16 cities that die, and enough of them do.

| Page | aba now | cohort 1 | survives at | **keeps needed** | P(saved) |
|---|---|---|---|---|---|
| `aba/winter-park` | 14 | 11 | 3 (1 sc) | 1 | **30%** |
| `aba/coral-springs` | 8 | 5 | 3 (1 sc) | 1 | 15% |
| `aba/weston` | 8 | 4 | 4 (1 sc) | 1 | 12% |
| `aba/ormond-beach` | 6 | 4 | 2 (1 sc) | 1 | 12% |
| `aba/lake-worth-beach` | 5 | 3 | 2 (2 sc) | 1 | 9% |
| `aba/miami-springs` | 4 | 2 | 2 (1 sc) | 1 | 6% |
| `aba/lauderhill` | 4 | 2 | 2 (2 sc) | 1 | 6% |
| `aba/miami-gardens` | 3 | 1 | 2 (1 sc) | 1 | 3% |
| `aba/daytona-beach` | 7 | 6 | 1 (0 sc) | 2 | 1.4% |
| `aba/largo` | 7 | 6 | 1 (1 sc) | 2 | 1.4% |
| `aba/aventura` | 5 | 4 | 1 (1 sc) | 2 | 0.6% |
| `aba/north-miami` | 4 | 3 | 1 (0 sc) | 2 | 0.3% |
| `aba/south-miami` | 3 | 2 | 1 (0 sc) | 2 | 0.1% |
| `aba/hallandale-beach` | 3 | 2 | 1 (1 sc) | 2 | 0.1% |
| `aba/plantation` | 3 | 2 | 1 (0 sc) | 2 | 0.1% |
| `aba/miami-beach` | 3 | 2 | 1 (1 sc) | 2 | 0.1% |

**Expected saves: 0.98 — one page.** Eight need a single keep, eight need two.

**Winter Park is the one to watch at 30%.** It has 11 cohort 1 records and needs only one of
them to survive review. If curation is inclined to look twice anywhere, that is where a
second look has the highest chance of preserving a URL.

**So the realistic case is 15 pages lost, not 16, and certainly not 33.** The keep rate moves
the number by one. It is not a lever worth pulling deliberately — but it does mean the ceiling
and the expectation are within a page of each other, which is the useful thing to know.

---

## Corrected bottom line for curation

1. **Expect to lose 16 aba pages, going 46 → 30.** Not 33, not 26.
2. **Cohort 2 is not a removal population and should not be batched as one.** At a 10% rate
   its expected contribution is under one page.
3. **If cohort 2 records are reviewed individually, watch the five thin cities** — Clearwater,
   North Miami Beach, Palm Springs, Port Orange, Tamarac. Each holds 1–2 cohort 2 records and
   each loses its page if one goes after cohort 1 has cleared. Clearwater holds exactly one.
4. **We Level Up Tamarac should be corrected inside a batch, not as a one-off**, so the page
   loss appears in a diff.
5. **The keep rate is worth about one page**, most likely Winter Park.

## What I got wrong, recorded so it is not repeated

**A cohort defined by a negation is not a population.** Cohort 2 was "`legacy_migration` and
NOT `aba`-only" — a residue, not a group with a shared cause. Cohort 1 has a mechanism behind
it (a batch default wrote one tag), which is what made it modellable as a block. Cohort 2 has
no mechanism, only the absence of cohort 1's.

**The test that would have caught it, and which I had already computed:** the services-array
length distribution. 118 of 168 carry 3+ services and 82 carry 4+. That is the fingerprint of
hand curation and it was visible in the data before any of this was modelled. **Check whether
a proposed population has a shared cause before modelling it as one** — and when the only
thing its members share is the field you selected on, it does not.
