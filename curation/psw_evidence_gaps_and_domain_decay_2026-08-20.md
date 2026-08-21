# Flags without evidence, shared-hosting domains, and the domain-decay check

**Date:** 2026-08-20
**Status:** Report only. SELECT-only. Nothing fixed, nothing modified.
**Companion:** `curation/coordinate_17_split_and_excerpt_dupes_2026-08-20.md`

---

## Correction to the previous report

I wrote that `provider_services_wide."ABA"` is true for 9341 Horizons Therapy. **That was wrong,
and the error was mine, not the crawler's.**

`provider_services_wide` contains **no row for Horizons at all**. It has 2 rows on
`sites.google.com`, both belonging to **Growing Smiles ABA Services Inc**. The `ABA = true` I
reported against 9341 came from *my own join* — `resources.website` host → `psw."Domain"` — which
matched Horizons to Growing Smiles' crawl record.

That makes the defect worse, not better, because it is not contained in a stale crawl table. **The
join key itself is unsound**, and any query that joins these two tables by domain will silently
attribute one business's evidence to another. The earlier shortlist was built on exactly this join.

---

## 1a. Service flags asserted with no stored excerpt

`provider_services_wide`, 1,039 rows.

| | `ABA` | `HomeAccess` |
|---|---:|---:|
| Flag true | 357 | 231 |
| **Flag true, excerpt NULL/empty** | **19 (5.3%)** | **0 (0.0%)** |
| Excerpt present, flag false | 0 | 0 |

**`HomeAccess` never asserts without evidence. `ABA` does, 19 times.** The asymmetry has a
mechanical explanation, and it is visible in the data below.

### The 19 ABA rows with no excerpt

| psw id | ProviderName | Domain | City | Crawl_Status |
|---:|---|---|---|---|
| 921 | Beautiful Minds **ABA** | ababeautifulminds.com | Miami Lakes | Failed (empty/JS-only) |
| 478 | **ABA** For Life Behavioral Solutions | abaforlifebs.my.canva.site | Cape Coral | Failed (empty/JS-only) |
| 505 | **ABA** Therapy Solutions, LLC | abasolutions.org | Palm City | Failed (empty/JS-only) |
| 896 | **Aba** Star Therapy | abastartherapy.com | Pembroke Park | Failed (empty/JS-only) |
| 436 | **ABA** Therapy Evolution | abatherapy-evolution.com | Hialeah | Failed (empty/JS-only) |
| 537 | Bright Future **ABA** Solutions | brightfutureabasolutions.com | Port St. Lucie | Failed (empty/JS-only) |
| 547 | Creative Minds **ABA** Services Inc. | creativemindsfla.com | Coconut Creek | Failed (empty/JS-only) |
| 104 | Full Spectrum **ABA** | fullspectrumaba.com | Daytona Beach | Failed (empty/JS-only) |
| 494 | Inara Health – **ABA** Agency | inarahealth.org | Miramar | Failed (empty/JS-only) |
| 909 | **ABA** Therapy \| Applied Behavior Analysis \| MGM Behavioral | mgmbehavioral.com | Miami Lakes | Failed (empty/JS-only) |
| 663 | Autism **ABA** Monarch Behavior Analysis LLC | monarchbehavior.com | West Palm Beach | Failed (empty/JS-only) |
| 554 | Shiloh **ABA** Inc. | shilohaba.com | Coral Springs | Failed (empty/JS-only) |
| 757 | Silver Lining Learning Academy & **ABA** Therapy | sllearningacademyinc.com | Winter Park | Failed (empty/JS-only) |
| 489 | South Florida **ABA** Early Intervention Center, LLC | southfloridaaba.org | Miami Lakes | Failed (empty/JS-only) |
| 437 | Step Forward **ABA** | stepforwardaba.com | Miami | Failed (empty/JS-only) |
| 885 | **ABA** Alliance Therapy, Orlando | therapyabaalliance.com | Orlando | Failed (empty/JS-only) |
| 72 | Growing Smiles **ABA** Services Inc | sites.google.com | Hollywood | Skipped (directory/social) |
| 192 | Growing Smiles **ABA** Services Inc | sites.google.com | Hollywood | Skipped (directory/social) |
| **15** | **Sabal Palm Psychological Services** | sabalpalmpsychology.com | Fort Lauderdale | **Success** |

| Breakdown | Count |
|---|---:|
| `ProviderName` contains "ABA" | **18 of 19** |
| Crawl failed (empty/JS-only) | 16 |
| Crawl skipped (directory/social) | 2 |
| Crawl succeeded | **1** |

### What this means

**18 of 19 are name-derived, not page-derived.** Every one has "ABA" in the business name, and in
every one the crawl produced nothing (16 failed, 2 skipped). The flag is a fallback: when the
crawler could not read the site, it inferred the service from the company name. That is why
`HomeAccess` has zero — "home access" is not a string that appears in business names, so the
fallback never fires for it.

This is not a random 5%. It is a second, undocumented inference path that produces flags
indistinguishable from crawled ones at read time. **An evidence-carrying design that silently
substitutes a name match for evidence is not adjudicable by reading** — which is the point you
made, and the data supports it exactly.

Practical note: a name-derived ABA flag is not worthless. "Shiloh ABA Inc." almost certainly does
ABA. But it is a *different claim* — the company is named for the service — and it carries none of
the branch-level or currency information a page excerpt would. It should be labelled, not trusted
or discarded wholesale.

**psw id 15, Sabal Palm Psychological Services, is the single genuinely unexplained row.** It is
the only one whose crawl **succeeded** (5 pages read), the only one whose name contains no "ABA",
and its `Matched_Categories` is `LifeSkills` — not ABA. So the crawl ran, matched a different
category, and `ABA` came out true with no excerpt and no name basis. Neither inference path
explains it. This one is worth opening.

---

## 1b. Shared-hosting domains

Two populations, and they behave differently.

### Bare hosts — the real defect (4 domains, 10 rows, 10 distinct businesses)

These lose the tenant identifier entirely, so every business on the platform collapses to one key.

| Domain | resources rows | Distinct businesses | Rows |
|---|---:|---:|---|
| `instagram.com` | 3 | 3 | 8939 Creative Friends Therapy [PEMBROKE PINES] \| 9179 Speech With A Twist [MIAMI] \| 10587 Lev & Learn Therapy [—] |
| `sites.google.com` | 3 | 3 | 6521 Learn and Rise [LAKELAND] \| 8872 Growing Smiles ABA Services [HOLLYWOOD] \| 9341 Horizons Therapy & Learning Center [KISSIMMEE] |
| `facebook.com` | 2 | 2 | 9449 Quality Physical Therapy [MIAMI] \| 10589 Spectrum Strong [PALM HARBOR] |
| `linktr.ee` | 2 | 2 | 7136 D&D ABA Therapy Port St Lucie [PORT ST. LUCIE] \| 7360 FISIOCORP MIAMI [NORTH BAY VILLAGE] |

Note the full URLs *do* carry the tenant — `sites.google.com/growingsmilesaba.com/...` vs
`sites.google.com/view/learn-and-rise-behaviortherapy/...`. The information is present in
`website`; it is destroyed by taking `split_part(host, '/', 1)`. So this is a derivation choice,
not missing data.

### Subdomain hosts — safe (12 domains, 1 row each)

`*.wixsite.com` (4: 6939, 6555, 9291, 9295, 9781), `*.my.canva.site` (4: 6675, 7030, 6605, 7452),
`brightbehaviorhealth.myclickfunnels.com` (7232), `3cstherapycenter.godaddysites.com` (9797),
`championkidsfamily.square.site` (10696). These keep the tenant in the hostname, so the domain key
is already unique per business. No action needed.

### Not a defect, listed for completeness

`www-healthpro-heritage-com.sandbox.hs-sites.com` — 3 rows, 3 distinct names, but all three are
**HealthPRO Pediatrics** branches (Riverview, Lakeland Harden Blvd, Lakeland Florida Ave South).
That is a legitimate chain sharing a legitimate domain, not unrelated businesses. It is however a
vendor sandbox URL, which is its own data-quality question.

### Scale

10 rows across 4 bare hosts, out of ~3,100 providers with a website. Small, and only
`sites.google.com` has actually produced a wrong attribution so far — because it is the only bare
host where one of the collapsed businesses has a `provider_services_wide` row. The other three are
latent for exactly as long as that stays true.

---

## 2. The domain-decay check

### Why it is needed, restated from the evidence

`10728 Child Advancement Center – Winter Park` has `created_at = 2026-08-20 09:48 UTC` — **it was
inserted today**, two days after the audit that ruled on `6583 Child Advancement Center – Dania
Beach` closed. It arrived carrying 6583's exact three tags (`aba, parent-coaching,
mobile-services`) and joins to 6583's identical ABA excerpt. Nobody reviewed it.

This is not a flaw in how the shortlist was filtered. The filter was correct on 2026-08-18. The
audit decayed because the table moved underneath it.

### The query

Paste as-is into the Supabase SQL editor. The only thing curation edits is the `ARRAY[...]` block
— replace it with the id column of whatever audit has closed.

```sql
-- DOMAIN-DECAY CHECK
-- Returns any provider row that shares a website domain with an audited record
-- but was not itself audited. Run after every curation batch.
-- To reuse: replace the ARRAY below with the ids of the closed audit.
-- Currently loaded: the 231 ids of curation/aba_shortlist_individual_2026-08-18_FINAL.csv

WITH audited(id) AS (
  SELECT unnest(ARRAY[
    5818,5822,5829,5834,5838,5841,6012,6030,6031,6033,6035,6326,6338,6353,6517,6526,6530,6545,6547,6555,
    6583,6584,6587,6624,6626,6632,6633,6636,6644,6654,6660,6669,6673,6675,6689,6692,6693,6696,6698,6701,
    6703,6711,6722,6725,6732,6733,6738,6753,6757,6764,6767,6769,6783,6799,6833,6837,6841,6860,6869,6879,
    6881,6888,6889,6895,6906,6909,6912,6913,6915,6918,6921,6923,6932,6933,6947,6948,6964,6968,6979,6980,
    6984,6985,6987,6990,6996,6997,7002,7007,7009,7010,7023,7024,7028,7029,7042,7049,7054,7061,7067,7099,
    7101,7121,7124,7130,7133,7151,7152,7155,7201,7202,7218,7220,7222,7223,7229,7232,7240,7247,7251,7253,
    7263,7265,7267,7275,7284,7294,7302,7306,7310,7313,7319,7323,7325,7337,7340,7341,7342,7343,7346,7349,
    7352,7353,7357,7362,7385,7387,7389,7395,7407,7408,7412,7413,7417,7422,7426,7431,7433,7457,7464,7473,
    7475,7477,7479,7487,7489,7497,7500,7501,7504,7527,8568,8602,8645,8723,8725,8782,8796,8799,8800,8807,
    8808,8809,8813,8815,8827,8837,8853,8862,8872,8873,8874,8876,8879,8887,8888,8889,8892,8898,8902,8906,
    8936,8938,8964,8991,8994,8998,9001,9017,9028,9031,9042,9047,9099,9106,9110,9119,9120,9124,9137,9141,
    9213,9281,10250,10325,10329,10343,10351,10358,10376,10387,10390])
),
dom AS (
  SELECT r.id, r.name, r.canonical_city, r.services, r.source, r.created_at,
         split_part(
           lower(regexp_replace(regexp_replace(r.website,'^https?://',''),'^www\.','')),
           '/', 1) AS domain
  FROM resources r
  WHERE r.resource_type = 'provider'
    AND r.website IS NOT NULL AND btrim(r.website) <> ''
),
audited_domains AS (
  SELECT DISTINCT d.domain
  FROM dom d JOIN audited a ON a.id = d.id
  -- bare shared hosts carry no tenant identity; they would false-positive forever
  WHERE d.domain NOT IN ('sites.google.com','linktr.ee','facebook.com','m.facebook.com',
                         'instagram.com','linkedin.com','business.site','maps.google.com','g.page')
)
SELECT d.id, d.name, d.canonical_city, d.domain, d.services, d.source, d.created_at,
       (SELECT string_agg(a2.id::text, ',' ORDER BY a2.id)
          FROM dom d2 JOIN audited a2 ON a2.id = d2.id
         WHERE d2.domain = d.domain) AS audited_siblings
FROM dom d
JOIN audited_domains ad ON ad.domain = d.domain
WHERE d.id NOT IN (SELECT id FROM audited)
ORDER BY d.domain, d.id;
```

### Current result: 1 row

| id | name | canonical_city | domain | services | source | created_at | audited_siblings |
|---:|---|---|---|---|---|---|---|
| 10728 | Child Advancement Center – Winter Park | WINTER PARK | 4childadvancement.com | aba, parent-coaching, mobile-services | manual_curation_2026-08 | 2026-08-20 09:48:42 UTC | 6583 |

### Design notes

- **`audited_siblings`** names which audited row(s) the new row inherits from, so the reviewer can
  open the original verdict rather than starting over.
- **The bare-host exclusion is deliberate.** Without it the query permanently returns 6521 and
  9341 as decay against 8872, which they are not — they are unrelated businesses that happen to
  share Google's hostname. Excluding them means bare-host rows are *never* checked by this query;
  they need the separate treatment in section 1b.
- **Chain domains are not loaded.** The `aba_shortlist_chains_2026-08-18.csv` audit is still open,
  so its 50 domains have no closed verdict to decay. When it closes, append those ids to the array
  and the same query covers both.
- **`created_at` is populated and usable** — 10728 carries a real timestamp. A date-threshold
  variant (`WHERE d.created_at > '2026-08-18'`) would be shorter but would miss decay from rows
  that predate the audit and had their `website` edited into a collision afterwards. The id-list
  form catches both.

---

## What this report does not decide

- Whether name-derived ABA flags get their own marker, get re-crawled, or get dropped.
- What to do about psw id 15 (Sabal Palm) — the one unexplained assertion.
- Whether the domain derivation should keep the first path segment for bare hosts.
- Whether 10728 gets an audit verdict or is simply accepted on 6583's.
