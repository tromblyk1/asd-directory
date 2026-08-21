# Daycare service vocabulary — NOT deleted. My sweep was wrong.

**Date:** 2026-08-22
**Instruction:** delete `DaycareCard`'s badge map, the four daycare JSONs,
`skilled-nursing` and `respiratory-care` — *"If any of it is load-bearing in a way
the sweep missed, report instead of deleting."*
**Outcome:** it is load-bearing. Nothing was deleted.

---

## The error

`curation/inverted_vocabulary_sweep_2026-08-21.md` §4e claimed the daycare service
vocabulary "has no database behind it at all." That conclusion rested on one check:
the `daycares` table has no `services` column. That check was correct. The
conclusion drawn from it was not.

**`DaycareCard.tsx:238` is guarded by `record_type === 'ppec'`, and PPEC records
come from a different table.**

```tsx
{daycare.record_type === 'ppec' && daycare.services && daycare.services.length > 0 && (
```

`FindDaycares.tsx:113-162` fetches from **both** `daycares` **and** `ppec_centers`,
merges them, and tags each row with `record_type`. `ppec_centers` has a
`services ARRAY` column — and it is populated:

| slug | PPEC centers |
|---|---:|
| **skilled-nursing** | **199** |
| speech-therapy | 178 |
| physical-therapy | 176 |
| occupational-therapy | 175 |
| transportation | 127 |
| **respiratory-care** | **94** |
| feeding-therapy | 42 |
| aba | 38 |
| **afterschool-program** | **37** |
| music-therapy | 21 |
| art-therapy | 13 |

Every one of those badges renders on `/find-daycares` today. Deleting
`skilled-nursing.json` and `respiratory-care.json` would have broken the "Learn
More" target for **293 live badge instances** — the exact `wellcare` failure the
last four prompts were spent paying down, at roughly 150× the scale.

I checked one table's schema and generalised to a surface that reads from two.

---

## The four daycare JSONs are also live

`/resources/daycares/:slug` is a real route — `App.tsx:91` → `DaycareResourceDetail.tsx`,
which calls `loadResource('daycares', slug)`.

| path | linked from | in sitemap | in validLinks |
|---|---|---|---|
| `/resources/daycares/ppec` | `educationalresources.tsx:71` | line 472 | line 510 |
| `/resources/daycares/ese-prek` | `educationalresources.tsx:72` | line 460 | line 534 |
| `/resources/daycares/head-start` | — | line 466 | line 522 |
| `/resources/daycares/afterschool-program` | — | line 454 | — |

`ppec` and `ese-prek` are linked directly from the Educational Resources hub page.
All four are in `sitemap.xml`, so all four are submitted to Google.

`/resources/services/respiratory-care` is additionally listed in
`educationalresources.tsx:35` (`servicesList`), so it has an inbound internal link
from the hub page too.

**Full deletion blast radius, had it gone ahead:** 8 sitemap URLs 404, 6
`validLinks.json` entries orphaned, 3 hub-page links broken, and 293 badge links
pointing at deleted pages.

---

## Where the premise and the reality diverge

The instruction's reasoning was sound and one clause of it is exactly right:

> *"the daycares table has no services or insurances column and is not getting one:
> that table deliberately uses booleans instead of arrays"*

Confirmed — `daycares` is 59 boolean columns across 99 rows, and `DaycareCard`
renders those through a separate feature-badge block. That design decision holds.

But the badge map is not scaffolding from that decision. It serves `ppec_centers`,
which is a **different table with a different design** — 200+ rows, array-based,
and the one `FindDaycares` merges in alongside `daycares`. Both patterns coexist
on the same card component, selected by `record_type`.

So: `daycares` uses booleans, deliberately. `ppec_centers` uses a services array,
also deliberately. The vocabulary belongs to the second one.

---

## What is actually dead here

Narrower than the sweep claimed, and none of it is worth a separate change:

- `daycares.services` is read at `DaycareDetail.tsx:180` (`daycare.services || []`)
  and is always `[]` for true daycare rows — but the same line serves PPEC rows,
  where it is populated. The `|| []` is doing real work, not masking a defect.
- `serviceDefinitions.ts` slug divergences (`speech`, `life-skills-daily-living`)
  remain cosmetic — line 620 falls back to title-casing.

---

## Correction filed

`project_vocabulary_surfaces.md` in memory asserted "the `daycares` table has NO
`services` column → the badge map serves a field that does not exist." The first
half is true, the second half is false. Corrected.

**Rule this produces:** when a component branches on a record-type discriminator,
schema-check *every* table that can produce that record type before calling a
surface dead. `FindDaycares` merges two tables into one card; checking one of them
proves nothing about the other.
