<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# List all daycares, preschools, and childcare centers in Florida whose websites mention any of the following: "special needs," "developmental delays," "sensory room," "sensory-friendly," "inclusive classroom," "all abilities," "individualized support," "exceptional student," or "neurodivergent." Exclude ABA therapy centers, PPEC centers, and therapy-only clinics. For each, provide: name, city, county, website URL, and what special-needs language appears on their site. I expect this to be a larger list than autism-only — possibly 30-100 results statewide.

This request needs far more than three queries and would require a custom statewide scrape + manual filtering to approach 30–100 providers with accurate language excerpts and exclusion of ABA/PPEC/therapy-only centers. With the constraints here, I can’t reliably “list all” such programs statewide, but I can give you a starter set of concrete examples plus a method you can scale with your own scraping pipeline.

## Important limitation

Because:

- Florida has thousands of licensed centers,
- the keywords span many variants and pages,
- and I’m limited to a small number of searches per turn,

I can only give you a **sample list**, not an exhaustive directory. Treat this as seed data and patterns to target in your scraper, not as a complete list.

## Sample centers that match your criteria

Below are non‑exhaustive examples of Florida programs whose public descriptions clearly reference special needs, developmental delays, inclusive/all-abilities environments, or similar language, and which operate as schools/childcare rather than ABA- or therapy-only clinics.


| Name | City | County (inferred) | Website | Special‑needs / inclusion language on site |
| :-- | :-- | :-- | :-- | :-- |
| UCP Bailes Early Childhood Academy (UCP Charter Schools – Early Education) | Orlando | Orange | https://www.ucpcharter.org/beca | Described as an “inclusive campus” built on the belief that “children of all abilities deserve an education that helps them grow, learn, and thrive together,” welcoming children with and without disabilities in an inclusive environment. [^1][^2] |
| Kids Incorporated Early Head Start (childcare centers run by Kids Incorporated of the Big Bend) | Tallahassee area (Big Bend) | Likely Leon and surrounding | https://kidsincorporated.org/programs/early-head-start/ | States that “a minimum of 10% of the children served at our childcare centers have special needs,” and that they are “equipped to serve the needs of every family, including those whose children have special needs,” with therapists working in the classroom. [^3] |
| Bumblebee Academy | Likely Central Florida (exact city not on snippet) | Unknown (needs confirm) | https://www.bumblebeeacademyfl.com | Describes itself as “a learning center that focuses on a small, inclusive classroom learning environment that allows pre-school … students to learn from each other and achieve individual goals,” implying inclusive classrooms and individualized support. [^4] |
| YMCA Early Learning Academy (Southwest Florida YMCA) | Venice (example site) | Sarasota | https://www.ymcaswfl.org/programs/child-care/early-learning | States that the YMCA “recognizes the strength of diversity in classrooms and makes every reasonable accommodation for all children’s success” and “very openly welcome[s] third party paraprofessionals and/or behavioral therapists to accompany your early learner,” indicating inclusive, accommodating childcare for diverse abilities. [^5] |
| Easterseals School for Limitless Learning | (Easterseals Florida site; city not in snippet but Florida-based program) | Unknown (needs confirm) | https://florida.easterseals.com/get-support/areas-of-support/early-childhood-care/easterseals-school-for-limitless-learning | Markets a “state-of-the-art Sensory Room” and emphasizes early childhood care and learning, which fits your “sensory room” focus within a school/childcare context. You’ll want to double-check it is licensed as a school/early childhood center rather than a clinic at your ingestion step. [^6] |
| Launch Learning Preschool | Merritt Island | Brevard | https://www.321launch.org and https://www.321launch.org/about-us | Parent review and program description highlight a dedicated “sensory room” and “specialized Sensory Room combined with a sensory infused curriculum” providing a “rich sensory diet,” indicating a sensory-focused preschool environment. [^7][^8] |
| Sunrise Children’s Services Early Childhood Education Preschool | Likely Miami‑Dade (Sunrise Community) | Likely Miami‑Dade | https://sunrisegroup.org/childrens-services/ | Described as a “developmental preschool” serving “typically developing children, children with developmental disabilities and those ‘at-risk’ for developmental delays,” with students learning and playing “in an inclusive, all-abilities learning environment.” [^9] |
| RCCA Preschool (Rehabilitation Center for Children and Adults) | Palm Beach | Palm Beach | https://rcca.org/preschool-2/ | Explicitly promoted as “an inclusive setting for children with and without special needs,” with a special education certified teacher and licensed OT/PT/speech therapists on staff, using a developmentally appropriate curriculum. [^10] |
| Special Kids Early Intervention (child care center) | Leesburg | Lake | https://www.care.com/b/l/special-kids-early-intervention/leesburg-fl | Listed as a child care center offering “Developmental (play-based), Special needs, Preschool (or nursery school),” indicating they explicitly serve children with special needs in a preschool/daycare format. [^11] |
| Harbor View Creative Learning Center | Palm Harbor | Pinellas | https://www.care.com/b/l/harbor-view-creative-learning-center-llc/palm-harbor-fl | Identified as a child care center that offers “Developmental (play-based)… Child care center/day care center, Special needs care,” suggesting inclusive childcare with specific support for special needs. [^12] |
| Discovery Learning Center, Parc Center for Disabilities | St. Petersburg | Pinellas | https://www.parc-fl.org/programs/childrens-services/ | Described as an “inclusive preschool” for children from 2 months to 5 years, with “tailored early learning experiences that cater to diverse intellectual and developmental needs,” emphasizing individualized support in an inclusive setting. [^13] |
| DLC Nurse \& Learn (inclusion non‑profit child care center) | Jacksonville | Duval | https://www.kidshopealliance.org/essential-services/special-needs/special-needs-providers | Listed as “an inclusion nonprofit child care center for children of all abilities, with and without developmental delays, where each child is taught at their own pace,” explicitly covering “all abilities” and developmental delays in a childcare context. [^14] |
| Little Achievers Daycare (from snippet) | Lutz | Hillsborough | https://littleachieversdc.com/about-us | Describes a daycare space that “empowers children of all abilities” and focuses on social and emotional development in “a safe, nurturing, and stimulating space,” clearly referencing “all abilities.” [^15] |

You’ll want to manually verify each against:

- Licensing category (DCF/Gold Seal vs. DOE vs. health/clinic),
- That they are not primarily ABA/PPEC/therapy-only,
- That the inclusive/special-needs language is on their own site, not just a directory profile.


## How to scale this to 30–100+ entries

Given your existing scraping/data work, you can realistically build the full list you’re after:

1. **Source universe of centers**
    - Pull licensed child care centers and preschools from DCF and local CCR\&R or Early Learning Coalition listings for Florida (e.g., ELC Brevard’s child care resource and referral page, which distinguishes licensed centers and notes special needs resources).[^16]
    - Include nonprofit early childhood programs that advertise inclusive settings or developmental delays support (e.g., Sunrise Children’s Services, UCP, DLC Nurse \& Learn, Easterseals).[^1][^6][^9][^14]
2. **Filter out ABA/PPEC/therapy-only**
    - Exclude providers whose primary taxonomy includes ABA, PPEC, clinic, behavioral health, or therapy center (rather than preschool, daycare, child care center, VPK, early learning).
    - Use negative keyword filters (“ABA,” “applied behavior analysis,” “PPEC,” “clinic,” “behavioral health clinic”) at both name and site-content level.
3. **Keyword pass over websites**
    - For each candidate’s domain, crawl only obvious marketing/info pages (homepage, About, Programs, Early Childhood, Preschool).
    - Search for the phrases you listed: “special needs,” “developmental delays,” “sensory room,” “sensory-friendly,” “inclusive classroom,” “all abilities,” “individualized support,” “exceptional student,” “neurodivergent.”
    - Also include near‑variants like “children of all abilities,” “inclusive environment,” “diverse abilities,” “developmental disabilities,” and “individualized learning plans,” which you can see in sites above.[^5][^9][^17][^18]
4. **Extract structured fields**
    - From licensing data or CCR\&R: name, physical address, city, county.[^16]
    - From your crawl: site URL and the exact sentence/short phrase around the matched keyword (e.g., “inclusive, all-abilities learning environment” or “children with and without special needs”).[^9][^14][^10]
    - Store that language verbatim in a text field for later QA.
5. **Manual QA pass**
    - Spot‑check a sample from each county to confirm:
        - The center is actually functioning as daycare/preschool/early childhood, not therapy-only.
        - The text you captured is indeed on their own official site, not an aggregator.
        - They are not school-district ESE-only programs unless you want to include those (e.g., PreK ESE programs in district sites are obviously “exceptional student education” but may be outside “childcare center” as you define it).[^19][^20][^21][^22]
6. **Output format**
    - Your target table schema matches:
        - name
        - city
        - county
        - website
        - special_needs_text (short quote or key phrase)
        - flags (optional: “sensory room,” “all abilities,” “special needs,” etc.)
    - This will let you filter, map, and integrate into your autism directory.

## If you want, next step

If you’d like, I can help you:

- Design the exact Python scraping workflow (requests/Playwright + BeautifulSoup) for a particular region (e.g., Tampa Bay or Orlando) to prove out the process.
- Draft a regex/keyword list and pseudo‑schema you can plug into your existing Supabase setup to ingest and normalize this statewide.
<span style="display:none">[^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43]</span>

<div align="center">⁂</div>

[^1]: https://www.ucpcharter.org/beca

[^2]: https://www.ucpcharter.org

[^3]: https://kidsincorporated.org/programs/early-head-start/

[^4]: https://www.bumblebeeacademyfl.com

[^5]: https://www.ymcaswfl.org/programs/child-care/early-learning

[^6]: https://florida.easterseals.com/get-support/areas-of-support/early-childhood-care/easterseals-school-for-limitless-learning

[^7]: https://www.321launch.org

[^8]: https://www.321launch.org/about-us

[^9]: https://sunrisegroup.org/childrens-services/

[^10]: https://rcca.org/preschool-2/

[^11]: https://www.care.com/b/l/special-kids-early-intervention/leesburg-fl

[^12]: https://www.care.com/b/l/harbor-view-creative-learning-center-llc/palm-harbor-fl

[^13]: https://www.parc-fl.org/programs/childrens-services/

[^14]: https://www.kidshopealliance.org/essential-services/special-needs/special-needs-providers

[^15]: https://littleachieversdc.com/about-us

[^16]: https://elcbrevard.org/parents/resource-and-referral/

[^17]: https://4cflorida.org/providers/child-development-providers/

[^18]: https://floridaearlysteps.com/about/

[^19]: https://www.pcsb.org/departments/student-support/exceptional-student-education-ese/prek-ese

[^20]: https://www.hernandoschools.org/pre-k-program-for-children-with-dis

[^21]: https://www.ocps.net/exceptional-student-education-home

[^22]: https://cre.lake.k12.fl.us/o/lcs/page/exceptional-student-education

[^23]: https://www.fldoe.org/file/7690/0070134-prek-disaball.pdf

[^24]: https://www.hillsboroughschools.org/page/2460-exceptional-student-education

[^25]: https://flfcic.cbcs.usf.edu/early_childhood_inclusion.html

[^26]: https://www.childcareaware.org/state/florida-6/

[^27]: https://flhouse.gov/FileStores/Web/HouseContent/Approved/Web Site/education_fact_sheets/2011/documents/2010-11%20Exceptional%20Student%20Education%20(ESE).3.pdf

[^28]: https://www.pasco.k12.fl.us/ssps/page/programs

[^29]: https://winnie.com/place/s-t-a-r-s-autism-school-miami

[^30]: https://www.donorschoose.org/project/building-a-sensory-room/9794476/

[^31]: https://familyfirstas.com/our-program/nest-program/

[^32]: https://winnie.com/st-petersburg-fl/special-needs

[^33]: https://www.schoolspecialty.com/multisensory-environments

[^34]: https://www.bestchildcarecenters.com/neuro-schools

[^35]: https://www.tiktok.com/@msalana.ot/video/7512282592096374047

[^36]: https://fun4firstcoastkids.com/Programs-Classes/Parenting-Classes/Monarch-Academy-for-Neurodivergent-Youth-aka-MANY/View-details

[^37]: https://www.osc.org/visit/accessibility/

[^38]: https://www.care.com/special-needs-child-care/tampa-fl

[^39]: https://winnie.com/search?category=special_needs\&near=Valrico%2C+FL

[^40]: https://fun4claykids.com/Education-Childcare/Preschools-and-Child-Care-Centers-Non-Faith-Based/Kids-World-Child-Care-Center/View-details.html

[^41]: https://www.pbglaw.com/blog/why-early-intervention-services-in-florida-help-your-child-and-how-legal-recovery-complements-care/

[^42]: https://fun4manasotakids.com/Education-Childcare/Preschools-and-Child-Care-Centers-Non-Faith-Based/

[^43]: https://thelearningexperience.com/centers/jacksonville-southside/

