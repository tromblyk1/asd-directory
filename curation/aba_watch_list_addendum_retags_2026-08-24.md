# aba watch list — addendum: retags as a removal mechanism — 2026-08-24

Addendum to `curation/aba_watch_list_2026-08-24.md`. Prompted by 6620 Autism Soccer
(North Miami Beach) being retagged to `recreation-programs` rather than stripped.

---

## Row counts at every step

| Step | Count | Expected | |
|---|---|---|---|
| Providers fetched (`canonical_city` not null) | 2,956 | — | |
| `aba`-tagged among them | **941** | 951 this morning | **drifted −10** |
| Curation population (`legacy_migration`, `aba` only) | **562** | 572 this morning | **drifted −10** |
| Safe pages recomputed from live DB | **30** | 30 (matches watch list) | OK |
| Safe-page verdicts changed by adding the `single_city` test | **0** | — | column was correct |
| Safe pages dying on **one** non-curation retag | **7** | — | new finding |
| Load-bearing records inspected in those 7 | **14** | 14 (2 per city) | OK |
| Load-bearing records found in an in-flight batch CSV | **0 of 14** | — | checked all 5 batch files |

The −10 drift on both counters inside a single day is itself evidence for the point
being made: the population is moving continuously, and the mechanism is invisible to
anything watching deletions.

---

## 1. Does `strips to death` already account for retags? Yes — for curation's population.

Confirmed. `strips to death` counts **records leaving the aba count**, and it never
inspects *how*. A retag and a strip decrement identically. 6620 is
`source = 'legacy_migration'`, `services = ['aba']` — squarely inside curation's
population — so North Miami Beach's modelled loss already includes it. Retagging it to
`recreation-programs` consumes one of the strips the model has already spent.

**No undercount for the fragile 18.** That half of the report stands as written.

## 2. Does the model understate risk for the safe 30? Yes — materially.

Your read is right, and the mechanism is sharper than "a retag can come from anywhere."

The safe column answers one question: *does the page survive if all of curation's
population leaves?* It treats every non-curation record as permanent ballast. But the
survivors are not the same as the initial pool, and the eligibility rule is
**non-monotonic in a way that punishes small pages twice**.

I re-ran the safe column with the `single_city >= 2` half of the rule applied to the
survivors — the trap named for the fragile pages, never applied to the safe ones.

**Good news first: no safe verdict was wrong.** All 30 genuinely survive full removal of
curation's population, `single_city` included. Clearwater's residual 3 is 2 single-city,
North Miami Beach's is 3 of 3, Port Orange 2, Tamarac 2 — all clear the bar.

**The bad news is the margin.** Seven survive with none.

### Safe pages that die on ONE non-curation retag

| City | survives at | of which single_city | extra retags to death |
|---|---|---|---|
| Clearwater | 3 | 2 | **1** |
| North Miami Beach | 3 | 3 | **1** |
| Port Orange | 3 | 2 | **1** |
| Tamarac | 3 | 2 | **1** |
| Spring Hill | 4 | 2 | **1** |
| **Palm Springs** | **5** | 2 | **1** |
| **Stuart** | **5** | 2 | **1** |

Palm Springs and Stuart are the ones worth staring at. They **survive at 5** — above the
floor, in the band that needs no `single_city` test at all — and still die on a single
retag, because losing one single-city record drops them to 4 with `single_city = 1`,
failing the second half of the rule. **A page at 5 is not safer than a page at 4 when
`single_city` is thin.** This is trap #1 from the original report reappearing on the side
of the ledger I had declared safe.

The remaining 23 have real margin: Coconut Creek, Davie, Lakeland, Palm Bay and Coral
Gables need 2; then it climbs to 21 for Tampa.

## 3. Are the load-bearing records plausibly retaggable by other work? Yes.

This is the part that changes the risk picture. I pulled the 14 single-city records the
seven zero-margin verdicts rest on. **None are in curation's population, so the watch
list treats all 14 as immovable — but they are not obviously ABA providers.**

| City | The two records holding the page up | Source |
|---|---|---|
| Spring Hill | **Elite Pain and Spine Specialists** (`aba` only) · **Absolute Healthcare LLC** (`aba` only) | Google Places |
| Stuart | **Luminescence Counseling** (`aba` only) · Adult and Pediatric Institute | Google Places |
| Palm Springs | Living Soul Autism and ABA · **Deeply Rooted Psychotherapy of West Palm Beach** (`aba` only) | legacy / Google Places |
| Clearwater | Step Beyond Development (7 services) · **Katie Merricks Counseling, LLC, PHD** | legacy / Google Places |
| Tamarac | **African-American Advocacy Center for Persons with Disabilities** · **We Level Up Tamarac FL** | legacy_migration |
| Port Orange | Strategies Inc. Applied Behavior Analysis · Great Strides Rehabilitation (7 services) | legacy / Google Places |
| North Miami Beach | Precision ABA Therapy · Super Kids ABA Therapy Center · Family Solutions Center | legacy / Google Places |

**Spring Hill is the clearest case.** Its page is 81% curation-population and the watch
list calls it safe. The two records that make it safe are a pain-and-spine clinic and a
generically named healthcare LLC, each tagged `aba` and nothing else, both from the
Google Places import. If a future pass reviews either one, an 81%-contaminated page dies
on a record curation never touched.

**Tamarac is the second.** Both load-bearing records are `legacy_migration` — the same
import whose blanket tagging started all of this — and one is We Level Up, a
behavioral-health chain, tagged `group-therapy` + `aba`.

**Two are counseling practices** (Katie Merricks, Luminescence) and one a psychotherapy
practice (Deeply Rooted). There are 94 records in `counseling_batch_input.csv` right now.
I checked all 14 against `counseling_batch_input`, `psych_batch_input`,
`psych_batch_results`, `psych_batch_deleted_slugs` and `handtherapy_deleted_slugs`:
**none of the 14 appear in any of them.** So the threat is not the queued work — it is
the batch after it, aimed at the same categories.

Per the AHCA finding, none of this is evidence any tag is wrong, and nothing here is a
reason to strip one. It is only evidence that these records are the kind of thing a
review pass looks at, which is precisely what "plausibly retagged" asks.

### The structural gap

The watch list partitions `aba` into curation's population and everything else. The live
split is three-way:

| Cohort | Records | Treated by the watch list as |
|---|---|---|
| `legacy_migration`, `aba` only — curation's population | 562 | movable |
| `legacy_migration`, `aba` + other services | **168** | **immovable ballast** |
| Google Places / submission / null source | **211** | **immovable ballast** |
| | **941** | |

**379 records — 40% of everything carrying `aba` — are modelled as permanent.** Cohort 2
is the same defective import as cohort 1, excluded from curation's population only by the
"aba is the record's only service" clause. Treating it as a fixed floor is the assumption
that just broke.

---

## What to change in the model

Report `extra retags to death` beside `strips to death`. The first counts curation's
declared work; the second counts everything else, and for seven pages it is **1**.

The generalizable form: **a fragility model scoped to one actor measures that actor's
work, not the page's risk.** The safe column was never a statement about survival — it
was a statement about survival *given that only curation touches anything*. Every
verdict in it was correct and seven of them were one edit from wrong.
