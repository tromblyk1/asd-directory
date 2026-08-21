# Filter semantics — is "unknown" treated as "no"? (2026-08-21)

Read-only audit. **Curation's concern is confirmed, and it is broader than insurance.**

## 1. The insurance filter is exclusive — empty array is excluded

`findproviders.tsx:336-337`:

```ts
const matchesInsurance = selectedInsurances.length === 0 ||
  arrayContainsAny(provider.insurances, selectedInsurances);
```

The behavior lives in the shared helper, **`findproviders.tsx:275-285`**. The decisive line is
**276**:

```ts
const arrayContainsAny = (arr: string[] | null | undefined, selectedValues: string[]): boolean => {
  if (!arr || arr.length === 0 || selectedValues.length === 0) return selectedValues.length === 0;
```

Read the guard directly: when `arr` is null or empty **and** at least one value is selected, it
returns `selectedValues.length === 0`, which is **`false`**. The provider is dropped.

**So yes — selecting any payer hides every provider whose insurance data is simply unknown.
Absence of data is rendered as a negative claim.** With 1,978 of 3,054 providers (**64.8%**)
carrying no insurance data, selecting a payer discards roughly two-thirds of the directory
before any real matching happens.

## 2. The defect is shared — same helper backs all three filters

One helper, three call sites, identical semantics:

| Filter | Line | Call |
|---|---|---|
| Service | 332-333 | `arrayContainsAny(provider.services, selectedServices)` |
| Insurance | 336-337 | `arrayContainsAny(provider.insurances, selectedInsurances)` |
| Scholarship | 340-341 | `arrayContainsAny(provider.scholarships, selectedScholarships)` |

**The blast radius is not the same for all three, though, and they should not be treated
alike:**

- **Scholarship** — same bug, and the sparsity is worse. Treating unknown as "does not accept
  FES-UA" is the same false negative.
- **Service** — arguably *correct* as-is. A provider with no services listed genuinely cannot be
  claimed to offer ABA, and the pSEO pages are defined by service tags. Changing this one would
  have wide unintended consequences. Flagging it as "shared defect" would be over-reading.

The honest framing: **the helper is right for `services` and wrong for `insurances` /
`scholarships`**, because the fields differ in what an empty value *means* — a missing service
tag is close to a real "no", a missing insurance tag is purely "we never collected it."

## 3. `accepts-most-insurances` only matches itself

Normalized it becomes `acceptsmostinsurances`. Against a selection of `aetna` all three
comparisons in the helper fail — no equality, and neither substring test relates the two. It is
an ordinary tag with no special handling anywhere in the filter path.

**And it is worse than it looks: all 69 rows carrying it have `cardinality(insurances) = 1`** —
that tag is their *only* insurance value. So the 69 providers who have most explicitly told us
they take a broad range of payers are invisible to **every** specific-payer filter in the app.

## 4. `ProvidersByCity.tsx` — no insurance filter at all

It filters server-side, once, at the Supabase query (**line 103**):

```ts
.eq('resource_type', 'provider')
.eq('canonical_city', page!.city)
.contains('services', [page!.service])
```

No insurance or scholarship filtering exists on this page — consistent with the phase-1 decision
to cut filter chips. `.contains` on an empty array is false, so empty-`services` providers are
excluded, but that is definitional for a service+city page rather than a defect.

## 5. Latent, not currently firing: the substring matching is bidirectional

Lines 280-282 match on equality **and** `item.includes(selected)` **and**
`selected.includes(item)`. That is loose enough to produce false positives in principle. I
checked every distinct value currently in `services`, `insurances` and `scholarships` for pairs
where one normalizes to a substring of another: **zero collisions.** Not a live bug. Worth
knowing before anyone adds a slug like `medicaid` alongside `florida-medicaid`, which *would*
start matching.

## 6. Phase-2 Medicaid manifest — the pages would substantially misrepresent coverage

The 35-city manifest (`pseo_medicaid_manifest_2026-08-20.csv`) was built from providers tagged
`florida-medicaid` after excluding FL-DD. Across **all** providers in those 35 cities:

| | count |
|---|---|
| Providers in the 35 cities | **2,095** |
| With any insurance data | **663 (31.6%)** |
| No insurance data at all | **1,432 (68.4%)** |
| Tagged `florida-medicaid` | 470 |

**Only 31.6% of providers in those cities have any insurance data.** A page titled to the effect
of "Medicaid providers in Tallahassee" would be drawn from a pool where 91% of local providers
have never been assessed for insurance at all.

Per city, worst coverage first:

| city | all providers | with data | unknown | % known | medicaid-tagged |
|---|---:|---:|---:|---:|---:|
| Tallahassee | 126 | 11 | 115 | **9%** | 8 |
| Lakeland | 99 | 16 | 83 | **16%** | 7 |
| Gainesville | 82 | 14 | 68 | **17%** | 9 |
| Port St. Lucie | 67 | 13 | 54 | **19%** | 7 |
| Palm Bay | 30 | 7 | 23 | 23% | 6 |
| Melbourne | 38 | 9 | 29 | 24% | 5 |
| Davie | 42 | 10 | 32 | 24% | 8 |
| Cape Coral | 63 | 16 | 47 | 25% | 11 |
| Coral Gables | 24 | 6 | 18 | 25% | 4 |
| Spring Hill | 46 | 12 | 34 | 26% | 9 |
| Jacksonville | 171 | 46 | 125 | 27% | 33 |
| Hollywood | 77 | 22 | 55 | 29% | 11 |
| Miami Lakes | 38 | 11 | 27 | 29% | 7 |
| Brooksville | 13 | 4 | 9 | 31% | 3 |
| Orlando | 154 | 49 | 105 | 32% | 34 |
| West Palm Beach | 85 | 27 | 58 | 32% | 23 |
| Pembroke Pines | 38 | 12 | 26 | 32% | 11 |
| Fort Myers | 83 | 27 | 56 | 33% | 23 |
| Palm Beach Gardens | 18 | 6 | 12 | 33% | 3 |
| Clearwater | 71 | 24 | 47 | 34% | 18 |
| Hialeah | 42 | 15 | 27 | 36% | 14 |
| Fort Lauderdale | 73 | 28 | 45 | 38% | 14 |
| Tampa | 194 | 75 | 119 | 39% | 51 |
| Coral Springs | 47 | 19 | 28 | 40% | 7 |
| Miami | 186 | 78 | 108 | 42% | 60 |
| Boca Raton | 29 | 14 | 15 | 48% | 9 |
| North Miami Beach | 25 | 13 | 12 | 52% | 8 |
| Stuart | 17 | 9 | 8 | 53% | 6 |
| Plantation | 15 | 8 | 7 | 53% | 8 |
| Sunrise | 13 | 7 | 6 | 54% | 6 |
| Miramar | 34 | 19 | 15 | 56% | 18 |
| Lake Worth | 10 | 6 | 4 | 60% | 5 |
| Palm Harbor | 16 | 10 | 6 | 63% | 7 |
| Lauderhill | 19 | 13 | 6 | 68% | 11 |
| New Port Richey | 10 | 7 | 3 | 70% | 6 |

Tallahassee is the sharpest case and it echoes a known problem: it already over-ranks because
the scrape swept up statewide agencies headquartered in the capital
(`project_services_tags_unreliable.md`). A Medicaid page there would be built on 8 tagged rows
out of 126 local providers, 115 of which have never been checked.

**Note the exclusion cuts the opposite way from what you'd want.** FL-DD is only 228 of the
2,095 rows, and FL-DD is the one source that actually *is* a Medicaid registry. Excluding it —
correct on service-tag grounds, since it blanket-tagged `aba` — removes the rows with the
strongest Medicaid provenance from a Medicaid page.

## Summary

1. Insurance filter: **exclusive, unknown treated as no.** Confirmed at `findproviders.tsx:276`.
2. Scholarship: **same helper, same defect.** Service: same helper, but empty arguably means no.
3. `accepts-most-insurances`: matches only itself, and is the sole tag on all 69 rows that have it.
4. `ProvidersByCity.tsx`: no insurance filtering; service filter is server-side `.contains`.
5. Medicaid manifest: **31.6% of providers in those 35 cities have any insurance data.**

No fix proposed here, per instruction.
