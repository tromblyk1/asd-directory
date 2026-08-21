# Nominatim geocoding run - 2026-08-20

## Why this is a script instead of finished output

The Nominatim search API could not be reached from the Claude session:

1. **Direct HTTPS from the session container is blocked.** The egress proxy
   returns `403` on the CONNECT tunnel for `nominatim.openstreetmap.org`
   (same block that stopped `geocoding.geo.census.gov` in the Census run).
2. **The fetch tool refuses it.** `nominatim.openstreetmap.org/robots.txt`
   disallows `/search`, so the sanctioned fetch path returns
   `ROBOTS_DISALLOWED`. Routing around a robots block with scripted HTTP is
   not something the session will do.

No key exists that changes either. So the run has to happen from a machine
with ordinary internet access - which also puts the requests on **your** IP
under **your** User-Agent, which is what the Nominatim usage policy expects.

## Input verification (completed in-session)

- File `providers_nominatim_2026-08-20.csv` confirmed present in
  `C:\Projects\ASD-Directory\curation\`, exact name match.
- Columns: `id, name, address, city, state, zip_code`
- **Row count: 88** - not the expected 94. Fully explained, see below.
- No `zip_code` nulls. No address edited relative to the original
  `providers_to_geocode_2026-08-20.csv`.

### Reconciling 88 vs 94

| bucket | count |
|---|---|
| Rows carried over from the 94 Census `FAILED` | 77 |
| The 17 malformed rows I flagged, correctly dropped | -17 |
| Census `REJECTED_BAD_MATCH` added back (9535, 5766) | +2 |
| Brand-new IDs not in the original 109 | +9 |
| **Total** | **88** |

The 9 new IDs are 6064, 8470, 10206, 6902, 9732, 9768, 9437, 9516, 9272 -
all highway-style addresses (`US Highway 41`, `S FEDERAL HWY`, `N DALE MABRY
HWY`, `S State Road 7`). 88 looks deliberate, not an accident; nothing is
missing that should be there.

## Running it

Put the script in the same folder as the input CSV, then:

    python run_nominatim_2026-08-20.py

Python 3.8+, standard library only, no dependencies. Takes about **2 minutes**
(88 requests at 1.1s apart, strictly sequential).

Set `CONTACT` at the top of the script if you want a different contact address
in the User-Agent. Do not lower `RATE_LIMIT`.

Outputs, written beside the input:

- `nominatim_coordinates_2026-08-20.csv` - the deliverable, exact column spec
- `nominatim_raw_2026-08-20.json` - every raw API response, for audit

It prints per-method counts and the `ZIP_MISMATCH` list at the end. Send back
the raw JSON and I will re-verify the classifications independently.

## What the validation enforces

`geocode_method` is one of `NOMINATIM`, `ZIP_MISMATCH`,
`FALLBACK_NOT_ADDRESS`, `REJECTED_BAD_MATCH`, `FAILED`.

- **lat/lon read correctly.** Nominatim returns them as strings in
  conventional order - `lat` is latitude, `lon` is longitude. This is the
  opposite of Census `x`/`y` and the script does not carry that habit over.
- **Premise-level type required.** Anything with `class` in
  boundary/place/highway/landuse/waterway/natural, or a `type` like city,
  town, suburb, administrative, residential, highway, road, postcode, is
  `FALLBACK_NOT_ADDRESS`. An unrecognised type also falls back rather than
  being waved through, and the `class`/`type` pair is written into the notes
  so a wrongly-rejected premise type can be spotted and the list widened.
- **Street compared as a token sequence** against `addressdetails`
  (`house_number` + `road`), not the display string. House number,
  directionals, name tokens and street-type tokens must each match exactly.
  `ST` != `AVE`. `DR` != `DR N`. **`AVE` != `AVE RD`.**
- **ZIP must match exactly.** Any difference is `ZIP_MISMATCH`: coordinates
  are recorded in the CSV but the method flags them as not to be applied.
  No numeric-proximity allowance.
- **Florida bounds** lat 24.5-31.0, lon -87.6 to -80.0, longitude negative.
  Outside is `REJECTED_BAD_MATCH`. This also catches a transposed pair.
- Unit designators (`SUITE`, `STE`, `APT`, `UNIT`, `LOT`, `#`, ...) are
  stripped before comparison; the original address string is preserved
  unchanged in `input_address`.

The validator was exercised against 14 synthetic responses covering every
branch - clean hit, road fallback, city fallback, admin fallback,
`AVE` vs `AVE RD`, `ST` vs `AVE`, `DR` vs `DR N`, ZIP mismatch, out-of-bounds,
transposed lat/lon, wrong house number, empty result, suite-stripping, and a
clinic-type accept. All 14 classified as intended.

## Constraints honoured

No Supabase connection, no SQL, input file not modified, nothing read or
written under any `events*` name. `id` is carried through unchanged.
