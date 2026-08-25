# aba watch list — refreshed 2026-08-25

Supersedes `aba_watch_list_2026-08-24.md` and its retag addendum. Rebuilt against the
manifest committed in `bb36087` (354 pages, 46 of them `aba`).

---

## Row counts at every step

| Step | Count | Expected | |
|---|---|---|---|
| Providers, all | 2,876 | — | was 3,003 after the LifeStance close |
| Providers with `canonical_city` | 2,872 | — | 4 null, excluded by the generator |
| `aba`-tagged | **849** | — | was 941 six hours ago |
| Curation population (`legacy_migration`, `aba` only) | **470** | **562 per curation** | **−92, see below** |
| Cities holding that population | **60** | **63 per curation** | **−3** |
| `recreation-programs` tagged | **5** | 5 | OK |
| Manifest pages | 354 | — | was 356 |
| Manifest `aba` pages | **46** | — | was 48 |
| SQL reproduction of eligible `aba` cities | **46** | 46 | OK — matches manifest exactly |
| Fragile (curation's population can remove) | **16** | — | was 18 |
| Safe (it cannot) | **30** | — | 16 + 30 = 46 OK |
| Safe pages with zero retag margin | **7** | — | membership unchanged |

The manifest/SQL agreement at 46 is the check that failed on the first attempt and is the
reason this file exists — see below.

---

## The regeneration ran mid-batch, and I had to do it twice

**First regen:** fetched 2,963 providers, wrote 355 pages, dropped `aba/maitland`. That
was a correct read of curation's described batch — the 4 `aba_named` deletions showed up
exactly, provider pages went 2,971 → 2,967. Built, deployed, committed as `752d697`.

**Then the reconciliation disagreed: 47 aba pages in the manifest, 46 in SQL.** The odd one
was Brooksville, sitting in the freshly written manifest at 5 providers while the database
held 2. Nothing in Brooksville had been touched since 2026-08-16, so the data had not
"moved underneath" in the usual sense.

**Ruled out first: unstable pagination.** `generate_pseo_manifest.mjs` pages through the
REST API with `Range` headers and **no `order` parameter**, which is the classic setup for
rows repeating or vanishing across page boundaries. I replicated the exact fetch with `id`
included: **2,872 rows, 2,872 unique ids, zero duplicates.** Pagination is sound. Worth
recording as ruled out, because it is the obvious suspect and it is wrong.

**Actual cause: a second, much larger wave landed during the build-and-deploy window.**
~91 provider rows were deleted between the generator's fetch and the reconciliation, a
window of a few minutes. The first manifest was accurate when written and stale by the time
it reached the server.

**That is the soft-404 shape, reproduced live.** `aba/brooksville` was deployed as a page
claiming 5 providers against 2 real ones — a combo present in a stale manifest, taking the
200 branch and advertising the stale count. Exactly the failure the hold was released to
prevent, arriving from the opposite direction: not from regenerating too rarely, but from
regenerating while the data was still moving.

Regenerated against the settled 2,872 (354 pages), rebuilt, redeployed, committed `bb36087`.
Both Brooksville and Maitland are out.

**The batch was far larger than described.** Curation reported 12 records touched. The
actual movement was 92 records leaving `aba`, and the deletion count (−91 providers) almost
exactly equals it — so this was overwhelmingly a **deletion** wave, not a retag wave.
Unreported movement: Lakeland −19, Tallahassee −12, Jacksonville −8, Cape Coral −7,
Gainesville −6, Spring Hill −5, Port St. Lucie −5. **Worth confirming with curation that
this was intended**, since none of it appears in the batch note.

---

## Manifest diff, pre-batch → settled

**Added: none.** Still zero additions at every observation, consistent with the one-way
argument — stripping or deleting can only shrink a combo.

**Removed (2):**

| Page | Was |
|---|---|
| `aba/brooksville` | 5 |
| `aba/maitland` | 3 |

**Count changed: 32.** The `aba` decrements, largest first: Lakeland 53→34, Tallahassee
69→57, Jacksonville 49→41, Cape Coral 28→21, Gainesville 36→30, Port St. Lucie 30→25,
Spring Hill 21→16, Fort Myers 38→34, Orlando 61→58, Tampa 59→56, Miami 46→43, West Palm
Beach 28→26, Daytona Beach 10→7, Ormond Beach 10→7, North Miami Beach 10→8, Clearwater
18→16, Pembroke Pines 18→17, Hollywood 27→26, Fort Lauderdale 13→12, Port Orange 6→4,
Tamarac 5→4, Miami Springs 5→4.

Seven non-`aba` combos moved up, three of them the reported retags landing:
`support-groups/jacksonville` 6→7 and `support-groups/miami` 5→6 (UM CARD, Shades of
Autism), plus `life-skills/tampa`, `mobile-services/tampa`, `respite-care/tampa`,
`occupational-therapy/orlando`, `physical-therapy/orlando`, `group-therapy/tallahassee`,
`life-skills/tallahassee`. `life-skills/miramar` 5→4.

`recreation-programs` produced **zero pages**, as projected — the 5 records are spread
across 5 cities and no city reaches 3.

---

## Q1 — Maitland

**It fell out.** It was one of the seven single-strip pages, curation's population there
went 2 → 1, and one strip was all it needed. `aba/maitland` is gone from the manifest and
the sitemap. Maitland now holds **1** `aba` record in total, so it is not coming back.

It behaved exactly as modelled. Brooksville, which the previous list put at 2 strips, went
in the same regeneration because the undescribed wave took 3 of its records at once rather
than the 1 the model was pacing against.

## Q2 — the current single-strip list

**Six, and they are the previous seven minus Maitland. No new entrants.**

| City | aba total | curation pop | everything else | single_city | strips to death |
|---|---|---|---|---|---|
| Hallandale Beach | 3 | 2 | 1 | 2 | **1** |
| Miami Beach | 3 | 2 | 1 | 3 | **1** |
| Miami Gardens | 3 | 1 | 2 | 2 | **1** |
| Plantation | 3 | 2 | 1 | 2 | **1** |
| South Miami | 3 | 2 | 1 | 2 | **1** |
| North Miami | 4 | 3 | 1 | 2 | **1** |

Despite 92 records leaving and the 1–2 record tail growing to 28 cities, **the single-strip
list did not gain a member.** The tail grew in cities that hold no page — the same pattern
as the original list's 17 pageless cities. Growth in the tail is not by itself growth in
exposure; it only matters where a page exists.

### The rest of the fragile set (16 total)

Lauderhill 2, Miami Springs 2, Aventura 3, Lake Worth Beach 3, Daytona Beach 3,
Ormond Beach 4, Coral Springs 4, Weston 4, Largo 5, Winter Park 10.

Daytona Beach moved the most, 6 strips → 3.

## Retag margin on the safe 30 — unchanged membership

Still **seven** safe pages that die on one retag from outside curation's population:
Clearwater, North Miami Beach, Palm Springs, Port Orange, Spring Hill, Stuart, Tamarac.

Port Orange and Tamarac are now at 4 `aba` total (from 6 and 5). Palm Springs and Stuart
still survive at 5 with `single_city = 2` — the case where a page above the floor still
dies on one removal because it lands in the 3–4 band with `single_city = 1`.

Clearwater and Spring Hill remain the sharpest: 16 records each, 13 and 12 of them in
curation's population, both resting on exactly 2 single-city records that curation will
never touch.
