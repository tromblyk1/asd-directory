<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# What is the average monthly tuition for private daycare/preschool in Florida in 2025-2026? I need data specifically for:

1. Average monthly tuition by child age bracket (infant 0-1, toddler 1-2, preschool 3-4, VPK/PreK 4-5)
2. Average enrollment duration - how long does a typical family stay enrolled at the same daycare? Does this vary by the age they enroll?
3. Average family size among daycare-enrolled families - what percentage of families enroll more than one child? Is there typically a sibling discount, and if so how much?
4. Annual family retention rates for private daycares

Focus on Florida specifically. I'm trying to calculate the lifetime value (LTV) of one family to a private daycare center. Please cite sources with dates.

The best recent Florida-specific data suggest that full-time center-based tuition in 2023–2026 runs roughly about 800–1,800 dollars per month per child depending on age, but there is almost no published Florida data on family-level retention, multi-child enrollment, or LTV-style metrics—so those parts will have to be modeled with assumptions. I’ll give you the most current Florida numbers available, then show how to turn them into an LTV model and where the data gaps are.

***

## Florida tuition by age (2023–2026)

### 1. Official Florida market-rate survey (centers)

Florida’s Division of Early Learning conducts a statewide Market Rate Survey (MRS) of **private-pay rates** that is used to set School Readiness reimbursement ceilings.  The most detailed recent report with full tables is the **2023–2024 MRS**, published by the Florida Department of Education.[^1][^2]

For **center-based care, full‑time, daily, mid‑market rate statewide**, the 2023–24 MRS reports approximately:[^2]

- Infant (0–11 months): 81.72 dollars per full-time day (mid).
- Toddler (about 12–23 months): 64.39 dollars per day (mid).
- 2‑year‑old: 60.02 dollars per day (mid).
- Preschool 3‑year‑old: 41.02 dollars per day (mid).
- Preschool 4‑year‑old: 38.36 dollars per day (mid).
- Preschool 5‑year‑old: 37.01 dollars per day (mid).

If you assume a typical schedule of 5 days per week, 52 weeks per year, that’s about **21.7 paid days per month** on average (260 days per year ÷ 12). Converting the mid‑rate daily prices to **approximate monthly tuition** gives:


| Age bracket (center-based) | Source row(s) used | Approx. mid‑market daily rate 2023–24 | Approx. implied monthly tuition (5 days/week, year‑round) |
| :-- | :-- | :-- | :-- |
| Infant 0–1 | “Infant” | 81.72 dollars/day [^2] | ≈ 1,770 dollars/month (81.72 × 21.7) [^2] |
| Toddler 1–2 | Average of “Toddler” and “2-Year-Old” | ≈ 62.2 dollars/day [(64.39+60.02)/2] [^2] | ≈ 1,350 dollars/month (62.2 × 21.7) [^2] |
| Preschool 3–4 | Average of “Preschool 3” and “Preschool 4” | ≈ 39.7 dollars/day [^2] | ≈ 860 dollars/month (39.7 × 21.7) [^2] |
| VPK/PreK 4–5 | Average of “Preschool 4” and “Preschool 5” | ≈ 37.7 dollars/day [^2] | ≈ 820 dollars/month (37.7 × 21.7) [^2] |

Key caveats:

- These are **mid-market private-pay prices**, not subsidized rates, and statewide averages obscure big metro vs rural differences.[^2]
- The **2024–2025 MRS** exists (2025-dated report) but from the snippet we only see partial tables; the structure and magnitudes are similar, indicating costs have remained high or risen modestly.[^3][^1]
- Using the mid‑rate puts you near the middle of the distribution; many private centers, especially higher‑quality ones, will be closer to the “high” column in the MRS tables, which are noticeably higher than the mid values.[^2]

For a **private autism‑friendly center targeting mid‑to‑upper‑market families**, these MRS-derived monthly figures are a reasonable *ceiling benchmark*; your actual tuition might sit somewhat below the mid-rate (for competitiveness) or near it if you include added supports.

### 2. Other statewide Florida estimates (infant and 4‑year‑old)

A couple of national providers aggregate Florida cost data and give state-level averages that line up with, but are generally lower than, the MRS numbers:

- **Procare Solutions (2024 article on 2023 costs)** reports that *“annual infant care in Florida costs an average of 12,639 dollars, while care for a 4‑year‑old child would cost families an average of 9,139 dollars”* in a child care center.[^4]
- A **2026 Florida cost guide by Tootris** cites the same figures and explicitly converts them to monthly: infant care 12,639 dollars per year (≈ 1,053 dollars/month) and 4‑year‑old care 9,139 dollars per year (≈ 762 dollars/month).[^5]
- A 2025 article by **MyKidReports**, based on 350 Florida centers, finds the “typical monthly expense for infant daycare in Florida is approximately 1,000 dollars” in 2023 and notes that the Economic Policy Institute’s 2024 Family Budget Calculator reports average annual infant care costs at 9,238 dollars (≈ 770 dollars/month) across center‑based and in‑home care combined.[^6]

These sources suggest **more modest statewide averages**, especially when you blend in in‑home providers and lower‑priced centers, roughly:

- Infant center-based: around 1,000–1,050 dollars/month on average in 2023–2026 (Procare, Tootris, MyKidReports).[^6][^5][^4]
- 4‑year‑old center-based: around 760 dollars/month on average in 2023–2026.[^5][^4]

Reconciling with the MRS:

- Converting the Florida MRS mid‑rate daily price for infants yields about 1,770 dollars/month, which is **substantially higher** than the 1,000–1,050 dollars/month statewide averages from those private datasets.[^4][^6][^5][^2]
- Likely reasons: the MRS pulls **posted private-pay rates** (and identifies 75th-percentile market levels for policy), while Procare and others aggregate **actual paid tuition** across a mix of providers, including lower‑cost options.[^1][^4][^2]

**Practical takeaway for LTV modeling in 2025–2026:**

- For a **mid-market Florida private center**, it’s reasonable to model around **1,000–1,200 dollars/month for infants**, **1,100–1,300 dollars/month for toddlers**, and **750–900 dollars/month for 3–5‑year‑olds** as ballpark tuition ranges, with awareness that high-end programs and major metros can be above this (approaching MRS mid-to-high levels).
- Those specific ranges are modeling assumptions, but they are anchored by the Florida MRS mid‑rates on the high side and the Procare/Tootris/EPI averages on the low side.[^6][^5][^4][^2]

***

## Enrollment duration at one daycare

### 2. Observed average tenure in center-based care

There is **very little published, Florida-specific data** on how long a family stays with the *same* center. Most of what exists is national.

The U.S. National Center for Education Statistics (NCES) reports that in 2019, for children age 5 and younger not yet in kindergarten, the **mean length of time in their *primary* center‑based care arrangement was about 14 months** nationally.  They note:[^7]

- Average tenure was longer for children whose primary care was a relative (19 months) than for those in center-based settings (14 months).[^7]
- These figures combine infants, toddlers, and preschoolers; the data are not broken out by age of enrollment in the published fast fact.[^7]

No Florida-only breakdown is provided in that publication, and I did not find any Florida DOE or DEL report that summarizes **family-level tenure at a given center**—the Market Rate Survey focuses on prices, not duration.[^1][^2]

### 3. How tenure likely varies with age at enrollment

Given the structural boundaries of early childhood care (birth to kindergarten), and the NCES finding that the **average child changes primary arrangements about every 14 months**, it is reasonable to expect:[^7]

- **Infant starters (e.g., enroll 6–12 months)**: families who are happy with their center can easily stay through toddler and preschool years, yielding **2–4 years of continuous enrollment per child**, but some will move when a preschool or VPK option opens up, or when they relocate or change jobs.
- **Toddler starters (1–2 years)**: feasible continuous stay of **2–3 years** until kindergarten, depending on when they enter and whether they move to a school-based pre‑K.
- **Preschool starters (3–4 years)**: realistically **1–2 years** at the same center before kindergarten, as they are closer to school age.

Those ranges are **logical scenarios** rather than published statistics; the only hard data point here is the 14‑month average center tenure nationally from NCES.  For your LTV calculations, you’ll likely want to run multiple scenarios (e.g., 18, 24, 36, 48 months per child) and then refine with your own center data once you’re operating.[^7]

***

## Families with multiple children \& sibling discounts

### 4. Share of multi-child families

I was not able to locate Florida‑specific or even robust national statistics that directly answer: *“What percentage of enrolled families at private daycares have more than one child simultaneously enrolled?”*

Existing national early‑education surveys typically report at the **child level** (number of children in care by age, type of care) rather than the **family level** (children per enrolled household), and Florida’s MRS likewise does not tabulate family size or number of siblings enrolled per family.[^1][^2][^7]

For LTV modeling, you’ll likely need to:

- Either assume a **reasonable proportion of multi-child families** (e.g., 20–40 percent of households eventually enroll a sibling) based on your target neighborhood’s demographics,
- Or, once you have a few months of operations, calculate from your own CRM/billing data: (\# families with ≥2 active children ÷ total active families).


### 5. Sibling discount prevalence and size

There is also no centralized Florida dataset on sibling discounts, but multiple industry and parent-facing sources describe **common patterns**:

- A 2026 daycare pricing guide from Wonderschool notes that **“many providers offer 10–15% off for a second child, and some offer even steeper discounts for three or more children in care simultaneously.”**[^8]
- A 2025 article from Holistic Moms similarly states that **sibling discounts typically reduce second‑child tuition by 10–15%, with additional savings for third children**.[^9]
- A 2025 Brightwheel operations guide for childcare programs lists percentage-based sibling discounts such as **10% off for the second child and 15% off for additional siblings** as standard approaches, while emphasizing that programs must model the financial impact carefully.[^10]

From these sources, **typical U.S. practice** (and very likely in Florida as well) looks like:

- Sibling discounts **are common but not universal**; many centers do not offer them, especially where demand is high.[^8][^10][^9]
- Where they are offered, **10–15% off the lower‑tuition child** (or occasionally total family bill) is a very common structure.[^10][^9][^8]
- Some providers increase the discount slightly for a third or fourth child (e.g., 15–20% on additional siblings), but data are anecdotal.[^9][^8]

For your LTV model, a **workable assumption**—consistent with those sources—would be:

- X percent of families (you choose) eventually enroll a second child.
- When they do, the **second child’s tuition is discounted by about 10–15 percent**, with no discount on the first child.[^8][^10][^9]

***

## Retention and churn at the family level

### 6. What’s actually measured in the literature

Most quantitative work tracks **staff turnover**, not family/customer retention, or else defines retention abstractly without publishing benchmarks.

Examples:

- A 2023 snapshot based on the 2019 National Survey of Early Care and Education (NSECE) found that **about one-third of U.S. center-based programs had “high” teacher turnover, defined as more than 20% of their staff leaving in the prior 12 months**, and the average annual staff turnover rate was about 33%.[^11][^12]
- A 2021 ChildcareCRM blog post on “enrollment retention rate” explains the metric and gives an illustrative example where a center ends a month with 135 children after enrolling 8 new ones, starting from 150, yielding an **84.67% monthly retention rate**—but that is a *worked example*, not a reported industry average.[^13]

I did **not** find any Florida DOE, DEL, or national dataset that cleanly reports **annual family or child retention rates** for private childcare centers (e.g., “typical centers retain 80% of families year over year”).[^12][^11][^2][^1]

Given that limitation, the most defensible quantitative anchor for retention remains the **NCES 14‑month average tenure in a primary center‑based arrangement**, which implies relatively frequent switching or aging‑out of arrangements nationally.[^7]

### 7. How to translate tenure into a retention assumption

You can turn assumed average tenure per child into an **implied annual retention rate** for modeling purposes, but this requires an assumption about the distribution of exits (e.g., constant hazard vs age-based transitions). Because there is no published Florida benchmark, any such translation will be **a modeling choice**, not an empirical fact.

For planning, you might:

- Pick a **target average tenure per child** in months (e.g., 24 or 36 months for infants who stay through preschool, 18–24 months for preschool-only entrants).
- From those, back into **annual family-level retention scenarios** (e.g., “low retention,” “medium,” “high”) and stress-test your LTV against each.
- Once you’re live, compute true retention directly:
    - Annual child retention = children still enrolled at year end ÷ children enrolled at year start (ignoring new enrollments).
    - Annual family retention = families still with ≥1 child enrolled at year end ÷ families at year start.

Because you’re building an autism-friendly private program—which tends to attract families seeking stability—you may well achieve **longer tenure and higher retention** than the national averages, but that will be center-specific and not something the current public datasets can tell us.

***

## Using these numbers to estimate LTV

Given the data gaps, the most robust approach is to build an **assumption‑driven LTV model** that you can later calibrate with your own center data. A simple structure for a private Florida daycare/preschool looks like this:

### 8. Per‑child revenue by age band

For each age band $i$ (infant, toddler, preschool 3–4, PreK 4–5), define:

- $P_i$: average monthly tuition you charge in that band.
    - Use Florida ranges such as: infant 1,000–1,200 dollars/month; toddler 1,100–1,300; preschool 3–5 years 750–900, grounded in the MRS and statewide averages as described above.[^5][^4][^6][^2]
- $M_i$: average number of months a typical child in that band stays at *your* center.

Then **per-child LTV (revenue-only, before costs) in that band** is:

$$
\text{Child LTV}_i = P_i \times M_i
$$

(You can later multiply by your gross margin to get profit LTV.)

### 9. Per-family LTV with siblings

To incorporate families with more than one child and sibling discounts:

- Let $q$ = proportion of families that eventually enroll a **second child**.
- Let $d$ = **sibling discount** on the second child’s tuition (e.g., 10–15 percent, consistent with industry norms).[^10][^9][^8]
- Let $\text{Child LTV}_{1}$ and $\text{Child LTV}_{2}$ be the LTVs for the first and second child (you may choose different age‑of‑entry patterns for siblings).

Then **expected revenue LTV per family** is approximately:

$$
\text{Family LTV} \approx (1 - q)\,\text{Child LTV}_{1} + q\left(\text{Child LTV}_{1} + (1-d)\,\text{Child LTV}_{2}\right)
$$

You can extend this if you want to model third children, but in most centers the bulk of incremental value comes from just the second child.

### 10. Layering in retention and acquisition costs

Finally, to make this operational:

- Choose **retention scenarios** (e.g., average child stays 18, 24, or 36 months) and plug those into $M_i$ for each age band, recognizing that NCES’s national 14‑month figure is a lower bound you’d like to exceed.[^7]
- Estimate **customer acquisition cost per family (CAC)**—marketing, tours, admin, any referral bonuses.
- Compute **net LTV** per family as (Family revenue LTV × gross margin) − CAC.

Because there is no solid Florida dataset for family retention or multi-child share, the most accurate numbers will come once you have **6–12 months of your own enrollment and billing data**; until then, using the Florida tuition bands above plus scenario-based assumptions for tenure and sibling behavior is the best evidence‑based way to get to a working LTV estimate.
<span style="display:none">[^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30]</span>

<div align="center">⁂</div>

[^1]: https://www.fldoe.org/schools/early-learning/rep-pol-guide/market-rate.stml

[^2]: https://www.fldoe.org/file/20628/2024-MRS-Report.pdf

[^3]: https://www.fldoe.org/file/20628/2025-MRS-Report.pdf

[^4]: https://www.procaresoftware.com/blog/child-care-costs-by-state-2023/

[^5]: https://tootris.com/edu/blog/parents/florida-child-care-costs-by-city-age-type/

[^6]: https://mykidreports.com/blog/average-cost-of-daycare-and-childcare-in-florida

[^7]: https://nces.ed.gov/fastfacts/display.asp?id=4

[^8]: https://www.wonderschool.com/blog/family-resources/how-much-does-daycare-cost-complete-2026-price-guide

[^9]: https://holisticmoms.org/how-much-is-daycare-a-week/

[^10]: https://mybrightwheel.com/blog/daycare-sibling-discount-policy

[^11]: https://acf.gov/sites/default/files/documents/opre/workforce_turnover_snapshot_apr2023.pdf

[^12]: https://acf.gov/opre/report/turnover-center-based-child-care-and-early-education-workforce-findings-2019-nsece

[^13]: https://blog.lineleader.com/how-to-track-enrollment-retention-

[^14]: https://trustedcare.com/costs/child-care-cost

[^15]: https://www.census.gov/library/stories/2024/01/rising-child-care-cost.html

[^16]: https://www.americanprogress.org/article/a-2024-review-of-child-care-and-early-learning-in-the-united-states/

[^17]: https://www.self.inc/info/childcare-costs-by-state/

[^18]: https://www.flsenate.gov/Laws/Statutes/2024/1002.82

[^19]: https://www.epi.org/press/updated-resource-calculates-the-cost-of-child-care-in-every-state-child-care-is-more-expensive-than-public-college-tuition-in-38-states-and-washington-d-c/

[^20]: https://www.care.com/c/how-much-does-child-care-cost/

[^21]: https://tcf.org/content/report/care-matters-a-2024-report-card-for-policies-in-the-states/

[^22]: https://www.epi.org/child-care-costs-in-the-united-states/

[^23]: https://www.mccormickinstitute.nl.edu/examining-the-role-of-employer-benefits-and-turnover-in-center-based-child-care

[^24]: https://www.reddit.com/r/toddlers/comments/tpy6wm/does_your_daycare_offer_a_discount_for_more_than/

[^25]: https://www.childcareaware.org/thechildcarestandstill/

[^26]: https://www.procaresoftware.com/blog/how-to-increase-enrollment-in-child-care-10-winning-strategies/

[^27]: https://comptroller.nyc.gov/reports/child-care-affordability-and-the-benefits-of-universal-provision/

[^28]: https://community.whattoexpect.com/forums/october-2016-babies/topic/childcare-cost-for-siblings-2-kids.html

[^29]: https://docs.iza.org/dp16881.pdf

[^30]: https://www.osc.ny.gov/press/releases/2025/02/child-care-ny-challenged-staff-shortages-high-prices-and-too-few-slots

