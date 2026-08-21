# Provider Geocoding Report - 2026-08-20

Input: providers_to_geocode_2026-08-20.csv (109 rows)
Geocoder: US Census onelineaddress, benchmark Public_AR_Current

## Counts

- CENSUS: 13
- CENSUS_DIRECTIONAL_MISMATCH: 0
- FAILED: 94
- REJECTED_BAD_MATCH: 2

## REJECTED_BAD_MATCH

- **9535** Total MD - input `2700 W CYPRESS CREEK RD STE C100, Fort Lauderdale` -> Census returned `2700 CYPRESS LN, FORT LAUDERDALE, FL, 33332`. Census returned "2700 CYPRESS LN, FORT LAUDERDALE, FL, 33332"; street name CYPRESS CREEK != CYPRESS; street type RD != LN; directional W != (none); zip 33309 != 33332
- **5766** E&R HEALTH CARE INC. - input `12750 NW 17TH ST UNIT 111, Miami` -> Census returned `12750 NW 17TH AVE, MIAMI, FL, 33167`. Census returned "12750 NW 17TH AVE, MIAMI, FL, 33167"; street type ST != AVE; zip 33182 != 33167

## FAILED (no Census match after 2 attempts) - 94 rows

| id | name | city | input_address |
|---|---|---|---|
| 7098 | Hancock-Smith Pediatric & Behavioral Health, LLC | Alachua | 13900 TECH CITY CIR |
| 6066 | UNIQUE CARING OPPORTUNITIES INC. | Alachua | 15604 NW 140TH ST |
| 6390 | ANGELIC COMPANION SERVICES | Altamonte Springs | 498 PALM SPRINGS DR STE 100 |
| 9505 | Dr. Daniel Komforti, PT, DPT | Altamonte Springs | 860 N STATE RD 434 |
| 9401 | Talk the Talk Pediatric Therapy, LLC | Apollo Beach | 300 FRANDORSON CIR |
| 6281 | RIDGE AREA ARC, INC. | Avon Park | 4352 INDEPENDENCE ST |
| 6401 | HABILITATION CENTER FOR THE HANDICAPPED, INC. | Boca Raton | 22313 BOCA RIO ROAD |
| 7942 | Select Physical Therapy - Cay West | Cape Coral | 1715 CAPE CORAL PKWY W |
| 8934 | THE ARC OF LEVY COUNTY, INC. | Chiefland | 7550 149 PL |
| 9054 | NEED A HAND? CALL ANN | Clearwater | 4300 E BAY DR LOT 106 |
| 10267 | Barrett Outpatient Rehabilitation & Sports Medicine Center | Clearwater | 430 MORTON PLANT ST # 101 |
| 10148 | Brooks Rehabilitation Outpatient Clinic - Deltona | Deltona | 3400 HALIFAX CROSSING BLVD |
| 10004 | Wolfson Children's Specialty Center - Baptist Clay | Fleming Island | 1747 BAPTIST CLAY DR |
| 7575 | Island Cove Behavioral Pediatrics | Fleming Island | 1831 GOLDEN EAGLE WAY |
| 10235 | Wolfson Children's Rehabilitation - Wolfson Children’s Specialty Center - Baptist Clay | Fleming Island | 1747 BAPTIST CLAY DR SUITE 100 |
| 7366 | Evolutions Treatment Center - Ft Lauderdale | Fort Lauderdale | 2901 W CYPRESS CREEK RD |
| 9433 | XPE Sports Rehab | Fort Lauderdale | 5300 POWERLINE RD |
| 8504 | Sunshine Kidz Pediatric Care - Ft Lauderdale | Fort Lauderdale | 2122 W CYPRESS CREEK RD |
| 9678 | Hernandez Therapy Clinic | Fort Lauderdale | 2950 W CYPRESS CREEK RD |
| 9890 | CORA Physical Therapy Fort Myers | Fort Myers | 6900 DANIELS PKWY |
| 8066 | Helping Hands | Gainesville | GAINESVILLE |
| 6226 | SUCCESS AT WORK | Hialeah | 5800 PALM AVE |
| 6166 | D & D REHAB CENTER, INC | Hialeah | 3412 W 84TH ST # E106 |
| 6162 | AMERICAN HOME HEALTH PROVIDERS CORP. | Hialeah | 3408 W 84TH ST STE 203 |
| 10060 | Loving Angels PPEC | Hialeah | 13115 W OKEECHOBEE RD |
| 7592 | Joe DiMaggio Children’s Hospital | Hollywood | 1005 JOE DIMAGGIO DR |
| 7672 | Select Physical Therapy - Hollywood | Hollywood | 3325 HOLLYWOOD BLVD |
| 9325 | My Kid Therapy Center - ABA Therapy in Miami | Homestead | 1180 N KROME AVE |
| 5777 | BUSH BRIANNA N | Jacksonville | 6528 SWEETBAY LN APT 102 |
| 9561 | Premier Physical Therapy | Jacksonville | 4230 PABLO PROFESSIONAL CT |
| 9972 | Reunion Rehabilitation Hospital Jacksonville | Jacksonville | 12645 SALINA DR |
| 6463 | HPS, HELPING PEOPLE SUCCEED, INC. | Jensen Beach | 1601 NE SUCCESS DRIVE |
| 9747 | Sloane Stecker Physical Therapy - Jupiter | Jupiter | 1155 MAIN ST STE 101 |
| 10398 | Beyond Speaking Rehab Specialists | Kissimmee | 3485 W VINE ST SUITE 3485 |
| 10202 | EARLY INTERVENTION SOLUTIONS LLC | Land O Lakes | 5424 LAND O' LAKES BLVD |
| 9637 | Advanced Rehabilitation, Inc | Largo | 3690 E BAY DR S |
| 6383 | THE ARC NORTH FLORIDA, INC | Live Oak | 511 GOLDKIST BLVD SW |
| 9316 | A+ Handwriting Occupational Therapy | Lutz | SHEFFIELD PARK DR |
| 10556 | St. John the Evangelist Catholic Community | Melbourne | 5645 Stadium Pkwy, Melbourne, FL 32940 |
| 9786 | Behavior Basics, Inc., Brevard Office | Melbourne | 2401 W EAU GALLIE BLVD |
| 10010 | DREAM HOPE & BELIEVE THERAPY CORP | Miami | 13155 SW 134TH ST SUITE 218 & 219 |
| 9317 | A Touch of Hope Occupational Therapy - Miami | Miami | 19400 TURNBERRY WAY APT 812 |
| 6192 | HOUSING AND ASSISTIVE TECHNOLOGY IN | Miami | 2000 TOWERSIDE TER APT 505 |
| 10011 | My Big World Inc | Miami | 8785 SW 165TH AVE SUITE 101 |
| 9350 | Super Hero Speech | Miami | 13155 SW 134TH ST |
| 9334 | S.U.C.C.E.ED in Learning | Miami | 6035 BIRD RD |
| 9458 | AnatomyPT • Physical Therapy & Orthotics | Miami Beach | 301 ARTHUR GODFREY RD |
| 9408 | Always Keep Progressing - North Miami Beach - 16800 Nw 2nd Ave | Miami Gardens | 16800 NW 2ND AVE |
| 9841 | Physical Therapy NOW Miami Lakes | Miami Lakes | 15985 NW 57TH AVE |
| 7967 | Select Physical Therapy - Miami Lakes | Miami Lakes | 15150 BULL RUN RD |
| 6439 | KEY FITS SOLUTIONS LLC | Milton | 3996 AVALON BLVD STE 100-C |
| 6344 | Easterseals LEAP Program - Naples | Naples | 8793 TAMIAMI TRL E STE 111 |
| 7360 | FISIOCORP MIAMI LLC | North Bay Village | 1440 79TH STREET CAUSEWAY |
| 9426 | Physical Therapy Time | North Miami Beach | 1380 NE MIAMI GARDENS DR |
| 9309 | Alyssa Frey CranioSacral and Occupational Therapist CST, OT | North Palm Beach | 300 MERCURY RD |
| 7653 | Challenges Conquered Counseling Services | Oakland Park | 800 E CYPRESS CREEK RD |
| 10215 | PT Solutions of Oldsmar (formerly Westchase Physical Therapy) | Oldsmar | 3953 TAMPA RD |
| 8199 | Brilliant Brains Behavior Services LLC | Oldsmar | 3970 TAMPA RD SUITE E |
| 9173 | Small Talk Speech Therapy (Orange Park) | Orange Park | 1700 WELLS RD STE 18 |
| 10249 | AMP PEDIATRIC THERAPY | Orlando | 6900 TAVISTOCK LAKES BLVD |
| 9256 | Sweet Speech, LLC | Oviedo | OVIEDO |
| 9900 | AxisPro Physical Therapy & Hand clinic - Palm Bay | Palm Bay | 5240 BABCOCK ST NE # 102 |
| 9292 | Little Harbor Therapy, LLC | Palm Beach Gardens | JUPITER |
| 9324 | Holistic Family Occupational Therapy, LLC - Palm Springs | Palm Springs | 2290 10TH AVE N |
| 9783 | Apollo Rehab Parkland | Parkland | 7635 N STATE RD 7 |
| 8720 | PEGGY JOYCE HARGROVE JOYCE LOVE & CARE HOME | Plant City | 3304 SAN MOISE PL |
| 9949 | CORA Physical Therapy St. Lucie West | Port St. Lucie | 1707 ST LUCIE W BLVD |
| 7331 | Select Physical Therapy - Port St Lucie | Port St. Lucie | 156 NW CALIFORNIA BLVD |
| 9680 | Action Physical Therapy | Port St. Lucie | 1680 ST LUCIE W BLVD |
| 9509 | Rejuvenate Physical Therapy | Safety Harbor | 1803 BRIAR CREEK BLVD |
| 9670 | Mease Countryside Physical Therapy & Sports Rehabilitation | Safety Harbor | 3251 MCMULLEN BOOTH RD STE 200 |
| 9797 | 3 C's Therapy Center | Sanford | 4019 W 1ST ST |
| 7314 | Select Physical Therapy - Sebastian | Sebastian | 1424 U.S. RTE 1 SUITE B |
| 9517 | Longevity Rehab Center - Sebastian | Sebastian | 13000 U.S. RTE 1 STE 7 |
| 7459 | Behavior Management Consultants - 4820 Kerry Forest Pkwy | Tallahassee | 4820 KERRY FOREST PKWY |
| 10227 | LifeCare Therapy | Tamarac | 7777 N UNIVERSITY DR # 101S |
| 9439 | Physical Therapy Associates of South Florida | Tamarac | 7171 N UNIVERSITY DR |
| 6474 | BEBES NURSING CARE LLC | Tamarac | 7171 N UNIVERSITY DR STE 205 |
| 7661 | Select Physical Therapy - Tamarac | Tamarac | 7160 N UNIVERSITY DR |
| 5835 | Quest, Inc. Training Center & Tampa Corporate Office | Tampa | 3910 US-301 |
| 8689 | MERCED CARE HOME LLC | Tampa | 4701 N HABANA AVE |
| 9962 | Pelvic Solutions | Tampa | 307 S BOULEVARD B |
| 6267 | DGAN LLC | Tampa | 6802 LAKEVIEW CENTER DR STE 500 |
| 5808 | Quest Kids Therapy - Tampa - 3910 Us-301 | Tampa | 3910 US-301 |
| 9254 | Our Speech Garden, LLC. | Tampa | TAMPA |
| 9960 | Optimal Performance & PT | Tampa | 1812 |
| 9307 | Spellers Center Tampa - Occupational Therapy for Nonverbal Individuals with Autism/ Apraxia | Trinity | 1816 HEALTH CARE DR |
| 10241 | Purposeful Play Pediatric Therapy | Venice | 680 U.S. 41 BYPASS N SUITE 2 |
| 9203 | The Learning Experience - West Melbourne | West Melbourne | 4470 HOLLYWOOD BLVD |
| 6398 | C INDIVIDUALS TRANSITION TO WORK INC. | West Palm Beach | 4949 ALORA ISLES DR APT 1116 |
| 9662 | Paley Orthopedic & Spine Institute | West Palm Beach | KIMMEL 901 |
| 8632 | ABLE LIFE CARE SERVICES | West Palm Beach | 4728 ALORA ISLES DR APT 7211 |
| 9059 | MILESTONES OF EXCELLENCE, LLC | Winter Haven | 2013 PINE PL APT 112 |
| 6284 | THE ARC NASSAU, INC. | Yulee | 86051 HAMILTON STREET |
