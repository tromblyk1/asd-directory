# pSEO manifest regeneration — post-retag reconciliation (2026-08-20)

Status: **manifest regenerated, NOT deployed.** Held pending review of the 12 removals.

## 1. Deletion reconciliation — resolved

My earlier "5 deletions" and curation's "108 deletions" were **both correct, measured at
different times**. The 108 landed *after* my generator run.

| Checkpoint | Provider count |
|---|---|
| Start of session | 3,186 |
| After first curation batch (21 del + 2 add) | 3,167 |
| At my first manifest regen | 3,162 |
| **Now** | **3,054** |

3,162 − 108 = **3,054. All 108 deletions are present and accounted for.**

No rows remain in any of the deleted subcategories. The deletions did **not** change the page
set, because all 108 had empty `services` and therefore belonged to no service+city combo —
the regenerated manifest is 361 pages both before and after they landed.

Retag activity is settled, not in flight: writes arrived as discrete batches (270 rows at
21:57, 46 at 22:03, 1 at 22:11), not a continuous stream. My earlier "in flight" call was
wrong.

## 2. Page delta — 373 → 361, confirmed unchanged after reconciliation

All 12 removals are `aba` pages. **Zero additions.** Eligibility rule:
`providers >= 5, OR providers in 3..4 AND single_city >= 2`.

| Page | providers before | providers now | single_city | multi_city | no_website | why it fails |
|---|---|---|---|---|---|---|
| `/providers/aba/st-petersburg` | 19 | 4 | 1 | 1 | 2 | 3–4 band, single_city 1 < 2 |
| `/providers/aba/riverview` | 8 | 1 | 0 | 1 | 0 | below 3 |
| `/providers/aba/brandon` | 7 | 3 | 0 | 2 | 1 | 3–4 band, single_city 0 < 2 |
| `/providers/aba/lake-worth` | 6 | 2 | 1 | 1 | 0 | below 3 |
| `/providers/aba/doral` | 5 | 4 | 0 | 3 | 1 | 3–4 band, single_city 0 < 2 |
| `/providers/aba/ruskin` | 5 | 0 | 0 | 0 | 0 | no aba providers left |
| `/providers/aba/sarasota` | 5 | 2 | 0 | 1 | 1 | below 3 |
| `/providers/aba/st-augustine` | 5 | 3 | 1 | 1 | 1 | 3–4 band, single_city 1 < 2 |
| `/providers/aba/dunedin` | 4 | 2 | 2 | 0 | 0 | below 3 |
| `/providers/aba/fort-pierce` | 3 | 2 | 2 | 0 | 0 | below 3 |
| `/providers/aba/jupiter` | 3 | 2 | 2 | 0 | 0 | below 3 |
| `/providers/aba/pompano-beach` | 3 | 2 | 1 | 1 | 0 | below 3 |

`st-petersburg` is the significant loss: 19 → 4. Fifteen of its listings were FL-DD rows
blanket-tagged `aba`.

Eligible combos (incl. excluded services) held at 380; pages at 361 across 86 cities /
17 services.

## 3. Residual mis-tag found — 44 rows, low blast radius

FL-DD stores `subcategory` as a composite `ABA Therapy | <real service>`. 59 FL-DD rows still
carry the `aba` tag, against curation's stated 9 keepers. The breakdown:

| subcategory | rows | still aba-tagged |
|---|---|---|
| `ABA Therapy \| Physical Therapy & Assessment` | 49 | **44** |
| `ABA Therapy \| Behavior Assistant` | 13 | 13 |
| `ABA Therapy \| Life Skills Development 2 (SEC)` | 149 | 2 |

The 13 Behavior Assistant rows are plausibly correct. The **44 under Physical Therapy &
Assessment look mis-tagged** — that subcategory is physical therapy, not behavior analysis.
Concentrated in Miami (15), Hialeah (3), Tampa/Panama City/Largo (2 each), rest singletons.

**Blast radius if curation strips all 44: exactly one page falls out** — `aba/oakland-park`
(3 → 2 providers). Every other surviving aba page stays eligible. So this manifest is safe to
ship regardless of how that residual is resolved; it is not a partial-state risk.

## 4. Generator

Already rebuilt to read Supabase directly — commit `543edbd`, `tools/generate_pseo_manifest.mjs`.
The dated CSV in `curation/` is an output-only audit artifact. There is no CSV read path.
JS port was validated against the SQL derivation by MD5 fingerprint of the emitted CSV
(`45141fc1ba7bf367a794c1f88054b975`, exact match).

## 5. Not yet done

Sitemap regen, rebuild, deploy, commit, push — held for go-ahead on the 12 removals.
