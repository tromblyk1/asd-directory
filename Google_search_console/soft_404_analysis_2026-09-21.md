# Soft 404 validation "failed" — analysis of the 2026-09-21 export

Source: `floridaautismservices.com-Coverage-Drilldown-2026-09-21/Table.csv` (309 URLs)
Trigger: GSC email "Some fixes failed for Page indexing issues", issue `Soft 404`
Validation restarted 2026-09-18 against the pending-state fix (commit `283a982`, live 2026-09-17 23:49 UTC).

## Verdict: expected. No code change required.

The validation was judged against URLs whose rows no longer exist. **271 of 309 (88%) are dead
URLs** — the page is genuinely gone, and the site correctly serves a noindexed "Not Found" view.
The only thing Google objects to is that a static SPA on Hostinger returns **HTTP 200** for every
path, so "gone" can never be expressed as a 404/410 status. That is a hosting-architecture
limit, not a regression, and re-running the validation will fail again for the same reason.

## Composition of the 309

| Bucket | Count | Reality |
|---|---:|---|
| Provider slugs whose row is deleted | 222 | Correctly noindexed |
| Provider slugs renamed (Easterseals rebrand + 1 address cleanup) | 8 | Row lives under a new slug |
| `lifestance-health-maitland` | 1 | Chain deleted 2026-08-23 |
| `/providers/null` | 1 | **Bug** — something emitted a null slug |
| School slugs whose row is deleted | 39 | Correctly noindexed |
| **Subtotal: dead URLs** | **271** | |
| Provider detail pages that still exist | 18 | Live |
| School detail pages that still exist | 4 | Live |
| Zero-result filter states (`?service=`, `?scholarship=`, `?accreditation=`) | 8 | Thin, 200, no results |
| Resource / guide / blog paths | 8 | Mixed |

## The date test — the only thing that decides whether the fix works

The fix went live 2026-09-17 23:49 UTC. A failure citing a **pre-9/17** crawl means nothing; a
**post-9/17** crawl on a **live** page would mean the fix is insufficient.

Only **13 of 309** were crawled on 9/18 or 9/19:

- **12 providers — every one is a deleted row.** Correct behaviour, nothing to fix.
- **1 school — `saint-theresa-catholic-school-coral-gables-fl` — exists and renders fine.**
  Loaded live 2026-09-21: full `<h1>`, title `Saint Theresa Catholic School | Private School in
  CORAL GABLES, FL`, address, map, scholarship badges. Classification is stale, not a defect.

**All 22 live detail pages in the report were last crawled before 9/17** (earliest 2026-02-28,
latest 2026-09-11), except the Saint Theresa case above. So the fix has not actually been tested
yet by Google on the population it targets.

## Sitemap is clean — checked, don't re-check

Spot-checked five dead slugs against `src/frontend/public/sitemap.xml`: none present. The one
live URL (`saint-theresa…`) is present. The sitemap is not advertising deleted pages, so there
is no sitemap-side contribution to this report.

## Optional cheap wins (none urgent, none requested yet)

1. **8 renamed Easterseals slugs → 301.** Old URL still earns crawls; a redirect recovers the
   signal and removes 8 soft 404s. Old → current slug:
   - `easter-seals-florida-inc-naples-fl-6344` → `easterseals-leap-program-naples-fl`
   - `easter-seals-florida-inc-palm-bay-fl-6389` → `easterseals-adult-day-training-palm-bay-fl`
   - `easterseals-florida-igoe-amar-center-west-palm-beach-fl-7381` → `easterseals-igoe-amar-center-west-palm-beach-fl`
   - `easter-seals-south-florida-opa-locka-fl-8774` → `easterseals-south-florida-miami-gardens-ophelia-brown-fl`
   - `easterseals-necfl-daytona-beach-fl-8970` → `easterseals-autism-center-of-excellence-daytona-beach-fl`
   - `eastersealsearly-steps-north-beaches-deland-fl-9212` → `easterseals-elite-aba-services-deland-fl`
   - `speech-works-pediatric-therapy-orange-city-2750-enterprise-rd-orange-city-fl-10281` → `speech-works-pediatric-therapy-orange-city-fl-10281`
   - `easterseals-northeast-central-florida-new-smyrna-beach-fl-10554` → `easterseals-at-edgars-farm-new-smyrna-beach-fl`
2. **`/providers/null`** — find what emits a null slug into an href. One crawled instance
   (2026-07-21), so low volume, but it is a real defect rather than stale data.
3. **Three filter values that aren't real service slugs** — `skilled-nursing`,
   `respiratory-care`, `pharmacogenetic-testing` appear as `?service=` params. Only
   `pharmacogenetic-testing` exists in `ProviderDetail.tsx`'s `serviceDisplayInfo`; none are in
   the documented vocabulary. Zero results = thin page = soft 404.

## What NOT to do

- **Don't re-run the Soft 404 validation right now.** It will fail again: Google will recrawl
  the same 271 dead URLs and keep getting a 200. Wait until the live pages have been recrawled
  post-9/17.
- **Don't treat the count dropping 317 → 309 as the fix failing.** It moved the right way.
- **Don't try to serve 410s via a generated `.htaccess` allowlist.** Shared hosting can't do
  `RewriteMap`, and an explicit deny-list of 271-and-growing slugs is a maintenance trap.
