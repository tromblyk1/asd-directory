# City / County Normalization Audit — `resources` table

**Date:** 2026-08-16
**Scope:** `resources` where `resource_type = 'provider'` (3,339 rows)
**Status:** AUDIT ONLY. No UPDATE run, no code written.

Prerequisite for the programmatic SEO service+location landing pages
(see `pseo_service_location_recon_2026-08-16.md`).

---

## Headline findings

1. **286 distinct city values** across 3,339 providers (the recon doc's "278" counted only the
   3,061 providers that also have a non-empty `services[]` — both numbers are correct for their
   scope).
2. **9 variant groups** collapse to 9 canonical cities, recovering split counts. Biggest:
   St. Petersburg is split 3 ways (33 + 2 + 1 = 36).
3. **14 rows have junk in the city field** — floor numbers, building names, ZIPs, region names.
   All 14 are individually resolvable from `address`/`zip_code`/`county`; full rows below.
4. **County data is CLEAN.** 54 distinct values, all valid Florida counties, consistently
   formatted. No normalization needed. This is the good news.
5. **`cityCoordinates.json` has its own variant problem** and 28 DB cities have no coordinate
   entry — including **ST. PETERSBURG (33 providers)**, which is the single most important gap.

---

## 1. Recommended canonicalization mapping (variant -> canonical)

| Variants (count) | Recommended canonical | Merged total |
|---|---|---|
| `ST. PETERSBURG` (33), `SAINT PETERSBURG` (2), `ST PETERSBURG` (1) | **ST. PETERSBURG** | 36 |
| `ST. AUGUSTINE` (12), `SAINT AUGUSTINE` (1) | **ST. AUGUSTINE** | 13 |
| `ST. CLOUD` (2), `SAINT CLOUD` (2), `ST CLOUD` (1) | **ST. CLOUD** | 5 |
| `SAINT JOHNS` (1), `ST JOHNS` (1) | **ST. JOHNS** | 2 |
| `PORT ST. LUCIE` (84), `PORT SAINT LUCIE` (1) | **PORT ST. LUCIE** | 85 |
| `MOUNT DORA` (1), `MT. DORA` (1) | **MOUNT DORA** | 2 |
| `MIRAMAR` (37), `MIRAMAR, FLORIDA` (1) | **MIRAMAR** | 38 |
| `SOUTHWEST RANCHES` (9), `SW RANCHES` (1) | **SOUTHWEST RANCHES** | 10 |
| `APOPKA` (5), `APOKA` (1, misspelling) | **APOPKA** | 6 |

Note the county field already uses the `ST.` form (`ST. JOHNS`, `ST. LUCIE`), so standardizing
cities on `ST.` keeps the two fields consistent.

### Judgment calls — flagged, NOT auto-merged

| Values | Why it's ambiguous | Recommendation |
|---|---|---|
| `LAKE WORTH` (16) vs `LAKE WORTH BEACH` (7) | The city legally renamed itself Lake Worth Beach in 2019. Same place, but both names are in live use and searched. | Merge to **LAKE WORTH BEACH**, but only if you want the legal name. Merging gains a 23-provider page. Your call. |
| `PONTE VEDRA` (2) vs `PONTE VEDRA BEACH` (1) | Adjacent but genuinely distinct communities. | Leave separate. Neither reaches threshold anyway. |

### Explicitly do NOT merge (distinct cities that look similar)

`FORT MYERS` / `NORTH FORT MYERS` / `FORT MYERS BEACH` · `MIAMI` / `MIAMI BEACH` / `MIAMI LAKES` /
`MIAMI GARDENS` / `MIAMI SPRINGS` / `MIAMI SHORES` / `NORTH MIAMI` / `NORTH MIAMI BEACH` /
`SOUTH MIAMI` · `PALM BEACH` / `WEST PALM BEACH` / `PALM BEACH GARDENS` / `NORTH PALM BEACH` /
`ROYAL PALM BEACH` / `PALM BEACH` · `DAYTONA BEACH` / `DAYTONA BEACH SHORES` / `SOUTH DAYTONA` ·
`PANAMA CITY` / `PANAMA CITY BEACH` · `OAKLAND` / `OAKLAND PARK` · `MIRAMAR` / `MIRAMAR BEACH`
(the latter is in Walton County, ~500 miles away).

---

## 2. Junk city values — full rows

All 14 rows whose `city` is not a city. Every one is resolvable.

| id | name | address | city (junk) | county | zip | Correct city |
|---|---|---|---|---|---|---|
| 10161 | Horizons Pediatric Center PPEC - B2 | 215 IMPERIAL BLVD SUITE B1 | `B2` | Polk | 33803 | **LAKELAND** |
| 8596 | FIRST WORDS Project - Bldg. A | EDGEWATER OFFICE PARK | `Bldg. A` | null | 32309 | **TALLAHASSEE** |
| 10587 | Lev & Learn Therapy | null | `Broward County` | Broward | null | County-wide; no city |
| 9794 | Department of Communication Sciences and Disorders | ORLANDO | `Fl 32816` | null | 32816 | **ORLANDO** (UCF) |
| 10473 | Genesis Assistance Dogs Inc | null | `Florida` | null | null | Statewide; no city |
| 10168 | Nicklaus Children's Palm Beach Gardens Outpatient Center | 11310 LEGACY AVENUE | `Legacy Pl` | Palm Beach | 33410 | **PALM BEACH GARDENS** |
| 6229 | NEW LIFE SUPPORTS & SERVICES, INC | MIRAMAR EXECUTIVE CENTER #369, 3600 S STATE ROAD 7 | `Miramar, Florida` | Broward | 33023 | **MIRAMAR** |
| 10474 | 4 Paws for Ability | null | `Multiple FL locations` | null | null | Statewide; no city |
| 8475 | Children's Learning Clinic | FLORIDA STATE UNIVERSITY | `Psychology Dept Bldg` | null | 32304 | **TALLAHASSEE** |
| 10578 | Remarkable Disability Services | null | `Remote` | null | null | Virtual; no city |
| 10245 | Care Options for Kids - Room 204 | 3350 SW 148TH AVE | `Room 204` | Broward | 33027 | **MIRAMAR** |
| 9721 | Orthopedic Specialists of Jacksonville | 14534 OLD SAINT AUGUSTINE RD #3210 MOB 3 | `Second Floor` | Duval | 32258 | **JACKSONVILLE** |
| 9858 | Jacksonville Orthopaedic Institute Rehabilitation - Second Floor | 14534 OLD SAINT AUGUSTINE RD #3220 MOB 3 | `Second Floor` | Duval | 32258 | **JACKSONVILLE** |
| 10567 | Trusted Friend LLC | null | `Tampa Bay Area` | Pinellas | null | Region; no city |

**Pattern worth noting:** 5 of these (`B2`, `Bldg. A`, `Legacy Pl`, `Room 204`, `Second Floor`)
are address continuation lines that shifted into the city column — a column-offset bug during a
past import, not random typos. The provider `name` often carries the same fragment
(e.g. "Care Options for Kids - Room 204"), so the names likely need cleaning too.

**5 rows have no real city** (`Broward County`, `Florida`, `Multiple FL locations`, `Remote`,
`Tampa Bay Area`) — these are genuinely statewide/virtual providers. Recommend a deliberate
convention (NULL city, or a `service_area` flag) rather than forcing a city. They should be
excluded from city landing pages but may belong on county or virtual-therapy pages.

---

## 3. County analysis — clean, no action needed

54 distinct values, 3,126 providers with a county (213 without). All are valid Florida counties,
consistently uppercase-normalized on read, no punctuation or abbreviation variants. `ST. JOHNS`
and `ST. LUCIE` both use the `ST.` form; `MIAMI-DADE` is consistently hyphenated.

Florida has 67 counties; 13 have no providers at all.

Full distribution:

BROWARD 477, MIAMI-DADE 398, HILLSBOROUGH 262, PALM BEACH 239, ORANGE 221, DUVAL 205, PINELLAS 180,
LEE 167, LEON 139, POLK 131, VOLUSIA 100, BREVARD 96, ALACHUA 91, ST. LUCIE 91, PASCO 42, SEMINOLE 38,
MARTIN 31, LAKE 19, OSCEOLA 14, ST. JOHNS 13, SARASOTA 12, MANATEE 10, CLAY 8, MARION 8, CHARLOTTE 6,
COLLIER 6, ESCAMBIA 6, NASSAU 6, BAY 5, INDIAN RIVER 5, CITRUS 4, SANTA ROSA 4, FLAGLER 3, WALTON 3,
COLUMBIA 2, HENDRY 2, HIGHLANDS 2, LEVY 2, OKALOOSA 2, SUMTER 2, SUWANNEE 2, BAKER 1, BRADFORD 1,
DESOTO 1, GADSDEN 1, GULF 1, HARDEE 1, HOLMES 1, JACKSON 1, MADISON 1, MONROE 1, OKEECHOBEE 1,
PUTNAM 1, HERNANDO 60.

---

## 4. `cityCoordinates.json` cross-reference

The file has 286 entries; the DB has 286 distinct city values. **They are not the same 286** —
28 on each side don't match.

### DB cities with NO coordinate entry (28)

`ST. PETERSBURG (33)`, `SORRENTO (2)`, `WILLISTON (2)`, `CELEBRATION (2)`, `ST. CLOUD (2)`,
`WAUCHULA (1)`, `CRESTVIEW (1)`, `CLEWISTON (1)`, `WEBSTER (1)`, `ST JOHNS (1)`,
`FERNANDINA BEACH (1)`, `INLET BEACH (1)`, `MT. DORA (1)`, `PANAMA CITY BEACH (1)`,
`THE VILLAGES (1)`, `COCOA BEACH (1)`, `SAINT JOHNS (1)`, `FREEPORT (1)`,
`MULTIPLE FL LOCATIONS (1)`, `FLORIDA (1)`, `BAKER (1)`, `TAMPA BAY AREA (1)`,
`DEFUNIAK SPRINGS (1)`, `MERRITT ISLAND (1)`, `REMOTE (1)`, `CHULUOTA (1)`,
`BROWARD COUNTY (1)`, `OAKLAND (1)`

**The critical one is ST. PETERSBURG.** No spelling variant of it exists in the coordinate file, so
all 36 providers there have no coordinates. St. Petersburg is Florida's 5th-largest city and would
otherwise generate several landing pages comfortably above threshold. This must be added.

### Coordinate entries with NO providers (28)

`AUBURNDALE, BEVERLY HILLS, CHIPLEY, CRAWFORDVILLE, DAVENPORT, FT LAUDERDALE, FT MYERS,
FT WALTON BEACH, FT. LAUDERDALE, FT. MYERS, GRANT-VALKARIA, HAVANA, HOLIDAY, HOMOSASSA, INVERNESS,
JONESVILLE, MASARYKTOWN, MICCOSUKEE, OPA-LOCKA, OPERATION: SNIP WELLNESS CLINIC, POLK CITY, SANIBEL,
SEFFNER, SR 31, ST AUGUSTINE, STE102, TREASURE ISLAND, WINDERMERE`

Two things to note:

- **The coordinate file has the same variant disease.** It carries `FT LAUDERDALE`, `FT. LAUDERDALE`,
  `FT MYERS`, `FT. MYERS`, and `ST AUGUSTINE` as dead entries alongside the `FORT`/`ST.` spellings
  the DB actually uses. Whatever canonical form is chosen must be applied to **both** the table and
  this JSON file, or the join silently fails.
- **It has junk entries too** — `OPERATION: SNIP WELLNESS CLINIC`, `SR 31`, `STE102` are not cities.
  Same column-offset import bug, same cleanup needed.

---

## 5. Full distinct city list (286 values, by provider count)

| # | City (raw, uppercased) | Providers |
|---|---|---|
| 1 | TAMPA | 205 |
| 2 | MIAMI | 200 |
| 3 | JACKSONVILLE | 199 |
| 4 | ORLANDO | 162 |
| 5 | TALLAHASSEE | 141 |
| 6 | LAKELAND | 115 |
| 7 | WEST PALM BEACH | 93 |
| 8 | GAINESVILLE | 90 |
| 9 | FORT MYERS | 84 |
| 10 | HOLLYWOOD | 84 |
| 11 | PORT ST. LUCIE | 84 |
| 12 | FORT LAUDERDALE | 83 |
| 13 | CLEARWATER | 78 |
| 14 | CAPE CORAL | 72 |
| 15 | SPRING HILL | 51 |
| 16 | CORAL SPRINGS | 49 |
| 17 | HIALEAH | 45 |
| 18 | DAVIE | 42 |
| 19 | MELBOURNE | 42 |
| 20 | PEMBROKE PINES | 41 |
| 21 | MIAMI LAKES | 38 |
| 22 | MIRAMAR | 37 |
| 23 | PALM BAY | 33 |
| 24 | ST. PETERSBURG | 33 |
| 25 | BOCA RATON | 31 |
| 26 | WINTER PARK | 30 |
| 27 | LARGO | 28 |
| 28 | DAYTONA BEACH | 27 |
| 29 | NORTH MIAMI BEACH | 26 |
| 30 | CORAL GABLES | 23 |
| 31 | ORMOND BEACH | 23 |
| 32 | PALM BEACH GARDENS | 20 |
| 33 | LAUDERHILL | 19 |
| 34 | PALM SPRINGS | 19 |
| 35 | PORT ORANGE | 19 |
| 36 | STUART | 19 |
| 37 | PALM HARBOR | 18 |
| 38 | LAKE WORTH | 16 |
| 39 | WESTON | 16 |
| 40 | BRANDON | 15 |
| 41 | COCONUT CREEK | 15 |
| 42 | HALLANDALE BEACH | 15 |
| 43 | MIAMI BEACH | 15 |
| 44 | PLANTATION | 15 |
| 45 | TAMARAC | 15 |
| 46 | FORT PIERCE | 14 |
| 47 | MAITLAND | 14 |
| 48 | MIAMI GARDENS | 14 |
| 49 | BROOKSVILLE | 13 |
| 50 | RIVERVIEW | 12 |
| 51 | ST. AUGUSTINE | 12 |
| 52 | SUNRISE | 12 |
| 53 | WEST MELBOURNE | 12 |
| 54 | HOLLY HILL | 11 |
| 55 | JACKSONVILLE BEACH | 11 |
| 56 | JUPITER | 11 |
| 57 | LUTZ | 11 |
| 58 | BOYNTON BEACH | 10 |
| 59 | NEW PORT RICHEY | 10 |
| 60 | SOUTH MIAMI | 10 |
| 61 | DORAL | 9 |
| 62 | KISSIMMEE | 9 |
| 63 | LAND O LAKES | 9 |
| 64 | LONGWOOD | 9 |
| 65 | NAPLES | 9 |
| 66 | OAKLAND PARK | 9 |
| 67 | SARASOTA | 9 |
| 68 | SOUTHWEST RANCHES | 9 |
| 69 | WINTER HAVEN | 9 |
| 70 | AVENTURA | 8 |
| 71 | BRADENTON | 8 |
| 72 | CLERMONT | 8 |
| 73 | DELAND | 8 |
| 74 | DUNEDIN | 8 |
| 75 | HUDSON | 8 |
| 76 | LAKE MARY | 8 |
| 77 | NORTH MIAMI | 8 |
| 78 | ROYAL PALM BEACH | 8 |
| 79 | LAKE WORTH BEACH | 7 |
| 80 | NORTH PALM BEACH | 7 |
| 81 | OCALA | 7 |
| 82 | ORANGE PARK | 7 |
| 83 | OVIEDO | 7 |
| 84 | PENSACOLA | 7 |
| 85 | PLANT CITY | 7 |
| 86 | ALTAMONTE SPRINGS | 6 |
| 87 | DANIA BEACH | 6 |
| 88 | GREENACRES | 6 |
| 89 | MIAMI SPRINGS | 6 |
| 90 | NORTH FORT MYERS | 6 |
| 91 | OCOEE | 6 |
| 92 | PALM CITY | 6 |
| 93 | PARKLAND | 6 |
| 94 | PINELLAS PARK | 6 |
| 95 | POMPANO BEACH | 6 |
| 96 | RUSKIN | 6 |
| 97 | SANFORD | 6 |
| 98 | SEMINOLE | 6 |
| 99 | TEMPLE TERRACE | 6 |
| 100 | WELLINGTON | 6 |
| 101 | YULEE | 6 |
| 102 | APOPKA | 5 |
| 103 | COOPER CITY | 5 |
| 104 | HOMESTEAD | 5 |
| 105 | JENSEN BEACH | 5 |
| 106 | LEESBURG | 5 |
| 107 | LOXAHATCHEE | 5 |
| 108 | PORT CHARLOTTE | 5 |
| 109 | ROCKLEDGE | 5 |
| 110 | VALRICO | 5 |
| 111 | VERO BEACH | 5 |
| 112 | WESLEY CHAPEL | 5 |
| 113 | WINTER GARDEN | 5 |
| 114 | APOLLO BEACH | 4 |
| 115 | COCOA | 4 |
| 116 | DELRAY BEACH | 4 |
| 117 | DELTONA | 4 |
| 118 | MARGATE | 4 |
| 119 | MILTON | 4 |
| 120 | NEWBERRY | 4 |
| 121 | ORANGE CITY | 4 |
| 122 | TARPON SPRINGS | 4 |
| 123 | ALACHUA | 3 |
| 124 | CUTLER BAY | 3 |
| 125 | ESTERO | 3 |
| 126 | FLEMING ISLAND | 3 |
| 127 | GIBSONTON | 3 |
| 128 | HAINES CITY | 3 |
| 129 | HIALEAH GARDENS | 3 |
| 130 | INDIALANTIC | 3 |
| 131 | LAKE PARK | 3 |
| 132 | LEHIGH ACRES | 3 |
| 133 | NEW SMYRNA BEACH | 3 |
| 134 | NORTH PORT | 3 |
| 135 | ODESSA | 3 |
| 136 | PALM BEACH | 3 |
| 137 | PALM COAST | 3 |
| 138 | PANAMA CITY | 3 |
| 139 | PORT RICHEY | 3 |
| 140 | SAFETY HARBOR | 3 |
| 141 | SEBASTIAN | 3 |
| 142 | TRINITY | 3 |
| 143 | VENICE | 3 |
| 144 | WINTER SPRINGS | 3 |
| 145 | AVON PARK | 2 |
| 146 | BONITA SPRINGS | 2 |
| 147 | CASSELBERRY | 2 |
| 148 | CELEBRATION | 2 |
| 149 | CITRA | 2 |
| 150 | CRYSTAL RIVER | 2 |
| 151 | DADE CITY | 2 |
| 152 | DEERFIELD BEACH | 2 |
| 153 | FORT WALTON BEACH | 2 |
| 154 | GREEN COVE SPRINGS | 2 |
| 155 | LAKE CITY | 2 |
| 156 | LAUDERDALE LAKES | 2 |
| 157 | LIVE OAK | 2 |
| 158 | MEDLEY | 2 |
| 159 | MELBOURNE BEACH | 2 |
| 160 | MIAMI SHORES | 2 |
| 161 | MIDDLEBURG | 2 |
| 162 | NOKOMIS | 2 |
| 163 | OLDSMAR | 2 |
| 164 | PACE | 2 |
| 165 | PALMETTO | 2 |
| 166 | PEMBROKE PARK | 2 |
| 167 | PONTE VEDRA | 2 |
| 168 | QUINCY | 2 |
| 169 | RIVIERA BEACH | 2 |
| 170 | SAINT CLOUD | 2 |
| 171 | SAINT PETERSBURG | 2 |
| 172 | SATELLITE BEACH | 2 |
| 173 | SECOND FLOOR | 2 |
| 174 | SORRENTO | 2 |
| 175 | SOUTH DAYTONA | 2 |
| 176 | ST. CLOUD | 2 |
| 177 | WILLISTON | 2 |
| 178 | WIMAUMA | 2 |
| 179 | ZEPHYRHILLS | 2 |
| 180 | APOKA | 1 |
| 181 | ARCADIA | 1 |
| 182 | ARCHER | 1 |
| 183 | ATLANTIC BEACH | 1 |
| 184 | B2 | 1 |
| 185 | BAKER | 1 |
| 186 | BARTOW | 1 |
| 187 | BAY HARBOR ISLANDS | 1 |
| 188 | BELLE GLADE | 1 |
| 189 | BELLE ISLE | 1 |
| 190 | BLDG. A | 1 |
| 191 | BOKEELIA | 1 |
| 192 | BONIFAY | 1 |
| 193 | BRONSON | 1 |
| 194 | BROWARD COUNTY | 1 |
| 195 | BUSHNELL | 1 |
| 196 | CALLAHAN | 1 |
| 197 | CAPE CANAVERAL | 1 |
| 198 | CHAMPIONSGATE | 1 |
| 199 | CHIEFLAND | 1 |
| 200 | CHULUOTA | 1 |
| 201 | CLEWISTON | 1 |
| 202 | COCOA BEACH | 1 |
| 203 | COCONUT GROVE | 1 |
| 204 | CRESTVIEW | 1 |
| 205 | DAYTONA BEACH SHORES | 1 |
| 206 | DEFUNIAK SPRINGS | 1 |
| 207 | ELLENTON | 1 |
| 208 | EUSTIS | 1 |
| 209 | FERNANDINA BEACH | 1 |
| 210 | FL 32816 | 1 |
| 211 | FLAGLER BEACH | 1 |
| 212 | FLORIDA | 1 |
| 213 | FORT MYERS BEACH | 1 |
| 214 | FREEPORT | 1 |
| 215 | FRUIT COVE | 1 |
| 216 | FRUITLAND PARK | 1 |
| 217 | GOTHA | 1 |
| 218 | GROVELAND | 1 |
| 219 | GULF BREEZE | 1 |
| 220 | GULFPORT | 1 |
| 221 | HERNANDO | 1 |
| 222 | HOBE SOUND | 1 |
| 223 | HOMELAND | 1 |
| 224 | INDIAN HARBOUR BEACH | 1 |
| 225 | INDIANTOWN | 1 |
| 226 | INLET BEACH | 1 |
| 227 | KENNETH CITY | 1 |
| 228 | KEY BISCAYNE | 1 |
| 229 | KEY WEST | 1 |
| 230 | KEYSTONE HEIGHTS | 1 |
| 231 | LABELLE | 1 |
| 232 | LAKE ALFRED | 1 |
| 233 | LAKE HELEN | 1 |
| 234 | LAKE WALES | 1 |
| 235 | LANTANA | 1 |
| 236 | LECANTO | 1 |
| 237 | LEGACY PL | 1 |
| 238 | LITHIA | 1 |
| 239 | LYNN HAVEN | 1 |
| 240 | MACCLENNY | 1 |
| 241 | MADISON | 1 |
| 242 | MALABAR | 1 |
| 243 | MARIANNA | 1 |
| 244 | MERRITT ISLAND | 1 |
| 245 | MICANOPY | 1 |
| 246 | MINNEOLA | 1 |
| 247 | MIRAMAR BEACH | 1 |
| 248 | MIRAMAR, FLORIDA | 1 |
| 249 | MOUNT DORA | 1 |
| 250 | MT. DORA | 1 |
| 251 | MULTIPLE FL LOCATIONS | 1 |
| 252 | NORTH BAY VILLAGE | 1 |
| 253 | NORTH LAUDERDALE | 1 |
| 254 | OAKLAND | 1 |
| 255 | OKEECHOBEE | 1 |
| 256 | OPA LOCKA | 1 |
| 257 | PALATKA | 1 |
| 258 | PALMETTO BAY | 1 |
| 259 | PANAMA CITY BEACH | 1 |
| 260 | PINECREST | 1 |
| 261 | PONTE VEDRA BEACH | 1 |
| 262 | PORT SAINT LUCIE | 1 |
| 263 | PORT ST JOE | 1 |
| 264 | PSYCHOLOGY DEPT BLDG | 1 |
| 265 | PUNTA GORDA | 1 |
| 266 | REMOTE | 1 |
| 267 | ROOM 204 | 1 |
| 268 | SAINT AUGUSTINE | 1 |
| 269 | SAINT JOHNS | 1 |
| 270 | SANTA ROSA BEACH | 1 |
| 271 | SEBRING | 1 |
| 272 | ST CLOUD | 1 |
| 273 | ST JOHNS | 1 |
| 274 | ST PETERSBURG | 1 |
| 275 | STARKE | 1 |
| 276 | SUN CITY CENTER | 1 |
| 277 | SW RANCHES | 1 |
| 278 | TAMPA BAY AREA | 1 |
| 279 | TAVARES | 1 |
| 280 | THE VILLAGES | 1 |
| 281 | TIOGA | 1 |
| 282 | TITUSVILLE | 1 |
| 283 | UMATILLA | 1 |
| 284 | WAUCHULA | 1 |
| 285 | WEBSTER | 1 |
| 286 | WILTON MANORS | 1 |

---

## Recommended Phase 2 approach

**Add a `canonical_city` column; do not normalize in place.**

Reasons:
- The raw `city` value is the only remaining evidence of what the source import produced. Overwriting
  it destroys the ability to audit or re-run the mapping if it turns out wrong.
- The junk rows need a *different* fix from the variant rows (they need a real city derived from
  address/ZIP, not a spelling change). Keeping them separable matters.
- The 5 statewide/virtual providers need a deliberate NULL, which is easy to express in a new column
  and lossy in the old one.
- Landing-page generation reads one clean column and never has to know about variants.

Suggested sequence:
1. Add `canonical_city text` to `resources`.
2. Populate from the 9-group mapping above + the 14 junk-row fixes (statewide rows -> NULL).
3. Add the missing coordinate entries, starting with St. Petersburg; dedupe the `FT`/`ST` variants
   and drop the 3 junk keys in `cityCoordinates.json`.
4. Re-run the threshold counts against `canonical_city` — merged variants may push a few
   combinations over the >=5 line.
5. Add a CHECK or a periodic query to catch new junk on future imports.

**Open question for Keith:** the Lake Worth / Lake Worth Beach merge is a real decision, not a
cleanup. Merging yields one 23-provider city instead of a 16 and a 7.
