# aba page watch list — 2026-08-24

Join of `curation/aba_ceiling_by_city_2026-08-24.csv` against the live pSEO manifest
(`src/frontend/src/data/pseo/cityPages.json`, 356 entries, 48 of them `aba`) and the live
`resources` table.

**Curation's population** = `source = 'legacy_migration'` AND `aba` is the record's only
service. Reproduced independently from the DB before joining: **63 cities, 572 records** —
an exact match to the CSV on both the row count and every per-city number.

---

## Row counts at every step

| Step | Count | Expected | |
|---|---|---|---|
| Providers fetched (`canonical_city` not null) | 2,966 | — | |
| `aba`-tagged among them | 951 | — | |
| Distinct `aba` cities | 122 | — | |
| Cities holding curation's population | **63** | 63 | OK |
| Curation population records | **572** | 572 (CSV sum) | OK |
| CSV data rows parsed | **63** | 63 | OK |
| CSV rows matched to a DB city | **63 of 63** | 63 | OK |
| Unmatched CSV cities | **0** | 0 | OK |
| Per-city count disagreements CSV vs DB | **0** | 0 | OK |
| Manifest `aba` pages | 48 | — | |
| Output rows | **48** | 48 | OK |
| Output rows retained at `pop = 0` | 2 | — | constraint (b) |
| CSV cities with no `aba` page | 17 | — | listed below |

### On constraint (a) — the join key

The CSV is title-cased (`Tallahassee`), `canonical_city` is upper-cased (`TALLAHASSEE`),
so a literal join would have matched **zero rows while reporting success** — the third
failure mode named in the brief. Joined on `slugify()` instead, the same transform the
manifest uses for `citySlug`, so all three sides share one key.

Verified that the transform does not merge anything: **122 distinct `canonical_city`
values produce 122 distinct slugs, zero collisions.** Checked in SQL rather than in the
join script, because the obvious in-script guard (comparing map size to distinct stored
names) is self-referential and would have passed regardless.

### On constraint (b)

All 48 manifest pages appear. **Boca Raton and Melbourne carry zero records from
curation's population** and are present as `0` rather than dropped.

---

## The watch list

`strips to floor` = removals needed to fall below 3 providers.
`reach?` = whether curation's population is even large enough to get there.
`strips to death` = removals at which the page actually leaves the manifest — earlier than
the floor for 3–4 provider pages, which also require `single_city >= 2`. Modelled worst
case, i.e. curation strips single-city records first.

### Fragile — one batch could remove these (18 pages)

| City | aba total | curation pop | everything else | strips to floor | reach? | **strips to death** |
|---|---|---|---|---|---|---|
| Hallandale Beach | 3 | 2 | 1 | 1 | yes | **1** |
| Maitland | 3 | 2 | 1 | 1 | yes | **1** |
| Miami Beach | 3 | 2 | 1 | 1 | yes | **1** |
| Miami Gardens | 3 | 1 | 2 | 1 | yes | **1** |
| Plantation | 3 | 2 | 1 | 1 | yes | **1** |
| South Miami | 3 | 2 | 1 | 1 | yes | **1** |
| North Miami | 4 | 3 | 1 | 2 | yes | **1** |
| Lauderhill | 4 | 2 | 2 | 2 | yes | 2 |
| Brooksville | 5 | 4 | 1 | 3 | yes | 2 |
| Aventura | 5 | 4 | 1 | 3 | yes | 3 |
| Lake Worth Beach | 5 | 3 | 2 | 3 | yes | 3 |
| Miami Springs | 5 | 3 | 2 | 3 | yes | 3 |
| Coral Springs | 8 | 5 | 3 | 6 | no | 4 |
| Weston | 8 | 4 | 4 | 6 | no | 4 |
| Largo | 7 | 6 | 1 | 5 | yes | 5 |
| Daytona Beach | 10 | 9 | 1 | 8 | yes | 6 |
| Ormond Beach | 10 | 7 | 3 | 8 | no | 7 |
| Winter Park | 14 | 11 | 3 | 12 | no | 10 |

Coral Springs, Weston, Ormond Beach and Winter Park **die without reaching the floor** —
they fall into the 3–4 band and fail the `single_city >= 2` half of the rule. Watching only
the 3-provider floor would have missed all four.

### Safe — curation's population cannot remove these (30 pages)

Every one of these survives even if **all** its curation-population records lose the tag.

| City | aba total | curation pop | everything else | % contaminated | survives at |
|---|---|---|---|---|---|
| Tallahassee | 69 | 58 | 11 | 84% | 11 |
| Orlando | 61 | 41 | 20 | 67% | 20 |
| Tampa | 59 | 34 | 25 | 58% | 25 |
| Lakeland | 53 | 49 | 4 | **92%** | 4 |
| Jacksonville | 49 | 31 | 18 | 63% | 18 |
| Miami | 46 | 28 | 18 | 61% | 18 |
| Fort Myers | 38 | 25 | 13 | 66% | 13 |
| Gainesville | 36 | 29 | 7 | 81% | 7 |
| Port St. Lucie | 30 | 23 | 7 | 77% | 7 |
| West Palm Beach | 28 | 15 | 13 | 54% | 13 |
| Cape Coral | 28 | 21 | 7 | 75% | 7 |
| Hollywood | 27 | 8 | 19 | 30% | 19 |
| Spring Hill | 21 | 17 | 4 | 81% | 4 |
| Hialeah | 21 | 12 | 9 | 57% | 9 |
| Miami Lakes | 19 | 8 | 11 | 42% | 11 |
| Pembroke Pines | 18 | 12 | 6 | 67% | 6 |
| Clearwater | 18 | 15 | 3 | 83% | 3 |
| Davie | 15 | 11 | 4 | 73% | 4 |
| Palm Bay | 15 | 11 | 4 | 73% | 4 |
| Fort Lauderdale | 13 | 5 | 8 | 38% | 8 |
| Coral Gables | 11 | 6 | 5 | 55% | 5 |
| Melbourne | 10 | **0** | 10 | 0% | 10 |
| Miramar | 10 | 3 | 7 | 30% | 7 |
| North Miami Beach | 10 | 7 | 3 | 70% | 3 |
| Boca Raton | 8 | **0** | 8 | 0% | 8 |
| Port Orange | 6 | 3 | 3 | 50% | 3 |
| Palm Springs | 6 | 1 | 5 | 17% | 5 |
| Stuart | 6 | 1 | 5 | 17% | 5 |
| Coconut Creek | 5 | 1 | 4 | 20% | 4 |
| Tamarac | 5 | 2 | 3 | 40% | 3 |

---

## CSV cities with no `aba` page (17 of 63)

Not join failures — these cities hold contaminated records but were never eligible for a
page, so there is no URL to lose. Listed so the 63 is fully accounted for:

Greenacres (3), Dunedin (2), Lake Park (2), Holly Hill (2), South Daytona (2),
Oakland Park (1), Daytona Beach Shores (1), West Melbourne (1), Sunrise (1),
Riviera Beach (1), Dania Beach (1), Wilton Manors (1), Coconut Grove (1),
Palm City (1), Belle Isle (1), Margate (1), North Lauderdale (1).

46 CSV cities have an `aba` page; 46 + 17 = 63.

---

## What the join says

**Contamination and fragility are close to unrelated.** The most contaminated pages are
the safest — Lakeland is 92% curation-population and survives, Tallahassee 84% and
survives with 11. Meanwhile Miami Gardens is only 33% contaminated and dies on the first
strip. Page size, not contamination share, predicts survival, and the two big pages are
big *because* of the contamination.

**So the exposure is almost entirely quality, not URL loss.** 30 of 48 pages cannot be
removed by this cleanup at all; they will simply keep serving lists that are 54–92% wrong
until curation reaches them. The 18 fragile pages are all small and mostly metro-fringe.

**Seven pages die on a single strip** — Hallandale Beach, Maitland, Miami Beach, Miami
Gardens, Plantation, South Miami, North Miami. Those are the ones to regenerate against,
and since the hold is released they will now fall out on the next batch rather than
lingering as zero-provider pages.

**The `single_city >= 2` half of the rule kills four pages before the floor does.** A watch
list built on the 3-provider floor alone would call Coral Springs, Weston, Ormond Beach and
Winter Park safe when they are not.
