# Insurance chips matching zero providers (2026-08-21)

**Report only. Nothing was changed.**

## The premise doesn't hold

`florida-kidcare`, `molina` and `florida-healthcare-plans` **are not filter chips.** They are
absent from both hardcoded lists — `findproviders.tsx:78-96` and `educationalresources.tsx:42-59`.
Someone already curated them out, and the comment above the array says so explicitly:

```ts
// Insurance options for filtering - ONLY values that exist in the database
```

There is nothing to drop. The empty-page failure you're describing cannot be reached through
the filter UI for these three — selecting them is not possible.

What they still have is **badge and detail-page plumbing**, which is a different (smaller) problem
and is described in §4.

## 1. Where the chip list comes from

A **hardcoded array**. Not a data file, not derived from table values.

| List | Location | Entries |
|---|---|---:|
| Provider search chips | `findproviders.tsx:78-96` (`insuranceOptions`) | 16 |
| Hub page links | `educationalresources.tsx:42-59` (`insurancesList`) | 16 |

Both hold the **same 16 slugs**, and each has a matching JSON detail page:

`accepts-most-insurances`, `florida-medicaid`, `medicare`, `aetna`, `cigna`, `tricare`, `humana`,
`florida-blue`, `unitedhealthcare`, `sunshine-health`, `early-steps`,
`childrens-medical-services`, `avmed`, `oscar`, `allegiance`, `evernorth`

Because it's hardcoded, the list can drift from the table in **both** directions — a slug can be
listed with no data behind it, or data can exist with no way to filter for it. Today it drifts the
second way (see `wellcare`, §4).

### Actual slug counts in `resources.insurances`

17 distinct values, 16 of them chips:

| slug | providers |
|---|---:|
| florida-medicaid | 781 |
| medicare | 328 |
| aetna | 327 |
| cigna | 283 |
| unitedhealthcare | 281 |
| florida-blue | 249 |
| tricare | 248 |
| humana | 230 |
| accepts-most-insurances | 69 |
| sunshine-health | 38 |
| avmed | 22 |
| childrens-medical-services | 17 |
| oscar | 13 |
| allegiance | 3 |
| evernorth | 2 |
| early-steps | 1 |
| **wellcare** | **1** ← not a chip |
| florida-kidcare | 0 |
| molina | 0 |
| florida-healthcare-plans | 0 |

**Every chip matches at least one provider.** No chip renders an empty page.

## 2. Detail pages for the three

**None exist.** `data/resources/insurances/` holds exactly 16 JSON files, matching the 16 chips.

The route `/resources/insurances/:slug` (`App.tsx:86`) is generic, so the URLs resolve — to
`InsuranceDetail.tsx:73-75`, which falls through to `setError('Insurance information not found')`.
A soft not-found, not a crash. They are absent from `sitemap.xml` (16 insurance URLs) and from
`validLinks.json` (15 insurance entries), so nothing crawls them.

**What links to them:** only badge lookups, which fire only if a provider carries the tag — and no
provider does. So all three are currently unreachable in practice.

| File | What it holds |
|---|---|
| `ProviderCard.tsx:117-127` | badge label + link, incl. spelling variants (`kidcare`, `floridakidcare`, `molinahealthcare`) |
| `ProviderDetail.tsx:104-106` | title + slug |
| `ServiceTag.tsx:258,270,318` | name, description, purple styling |
| `serviceDefinitions.ts:263,345,361` | metadata; file imported only by `DaycareDetail.tsx` for *services* |
| `serviceMapping.ts:12,15,16` | legacy boolean → slug translation. **Zero importers. Dead code.** |
| `_archive/pages-old/…/insurances/index.tsx` | archived, not built |

## 3. `schools` / `daycares`

**No.** `information_schema` shows **zero insurance-related columns** on either table
(`daycares` 99 rows, `schools` 2,504 rows).

The only insurance columns anywhere in the database are `resources.insurances` (ARRAY) and three
booleans on the legacy `providers` table (4,656 rows, **never queried by the app**):

| column | rows true |
|---|---:|
| `accepts_florida_kidcare` | 0 |
| `accepts_molina` | 0 |
| `accepts_florida_healthcare_plans` | 3 |

That table is where the three slugs come from. `serviceMapping.ts` was written to translate those
booleans into slugs and has had no callers since the migration to `resources`.

## 4. The real defect: `wellcare`

One provider carries `wellcare`. It is **not** a chip, has **no** JSON page, and
`ProviderCard.tsx:115` links the badge to `/resources/insurances/wellcare`.

That is a **live broken "Learn More" link** on a real card today — the exact failure mode you're
trying to prevent, except it exists and the three you asked about don't. It's the same class of
bug as the `validLinks.json` false positives from 2026-08-16.

Three options, in order of effort:
1. Write `wellcare.json` and add it to the chip list — 1 provider, so the chip renders a
   one-result page. Thin, but honest.
2. Write `wellcare.json`, leave it off the chip list. Badge links work; no empty filter.
3. Strip the tag from that one provider row and delete the badge entry.

Also worth noting: `ProviderCard.tsx` links `molina` → `/resources/insurances/molina-healthcare`
while `serviceDefinitions.ts` and `ServiceTag.tsx` register it as `molina`. If a `molina` row ever
lands, the badge links to a slug nothing else uses.

## Recommendation

**Take no action on the three.** They are already excluded everywhere it matters. Removing the
residual badge entries would be a cleanup with no user-visible effect, and would delete exactly
the mapping you'd need if Molina data ever gets collected — which you said is plausible, since
Molina genuinely operates in Florida Medicaid.

Your stated goal — "keep the slugs valid for future data" — is **already the current state**.

If you want one change out of this, make it `wellcare` (option 2 above): it's the only broken
link on the board.
