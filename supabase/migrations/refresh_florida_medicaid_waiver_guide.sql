-- Refresh of the iBudget/Medicaid waiver guide (originally published 2025-12-06).
--
-- Corrects four hard factual errors found during audit:
--   1. Listed the McKay and Gardiner scholarships as current. Both were repealed by
--      HB 7045 (2021); McKay folded into FES-UA effective 2022-07-01.
--   2. Described iBudget budgets as set by "Tier 1-4". Tiers belong to the pre-iBudget
--      waiver. iBudget uses an algorithm driven by the QSI assessment.
--   3. Said waitlist position is based on application date. Position is set by seven
--      priority categories under s. 393.065(5); date only orders within categories 3-7.
--   4. Omitted the Feb 2025 move of behavior analysis into managed care and the ICMC
--      program (HB 1103, 2025), both of which change how families actually get services.
--
-- updated_at is bumped to now() so the guide earns the "Updated" badge and sorts with
-- current content. created_at is deliberately left at the original publication date.

UPDATE blog_posts
SET
  excerpt = 'Florida''s iBudget Waiver funds the long-term supports regular Medicaid will not cover. Getting on the list is free, but your place in line is not first-come, first-served — and two major changes since 2025 have altered how families actually reach services.',
  content = $guide$## Key Takeaways

- The iBudget Waiver, run by the Agency for Persons with Disabilities (APD), funds long-term supports regular Medicaid does not cover — respite, personal care, supported living, and supported employment.
- Getting on the list is free and you should do it as early as possible. But **your place in line is not simply first-come, first-served** — state law sorts everyone into seven priority categories.
- **New since 2025:** Medicaid ABA moved into managed care plans, and Florida is shifting developmental disability services toward managed care through the ICMC program.
- While you wait, regular Medicaid still covers ABA, speech, occupational, and physical therapy for children under 21 — and the FES-UA scholarship is available regardless of waiver status.

## What Changed Recently — Read This First

If you researched the waiver before 2025, three things have changed enough to affect what you should actually do.

**Behavior analysis moved into managed care (February 1, 2025).** ABA services for children under 21 used to be billed fee-for-service, with prior authorization handled by the state's outside review vendor. Now, if your child is enrolled in a Medicaid managed care plan, **prior authorization goes to your health plan** and you generally must use a provider in that plan's network. Florida also rewrote its Behavior Analysis Services Coverage Policy, effective February 10, 2025, which added a **Comprehensive Diagnostic Evaluation (CDE)** requirement — a doctor's prescription alone is no longer enough to start services — and requires reassessment every six months.

**Managed care is coming to developmental disability services.** HB 1103 (2025) expanded Florida's IDD pilot into the **ICMC program** (Intellectual and Developmental Disabilities Comprehensive Managed Care). Since October 2025 it has been offered statewide to people on the pre-enrollment list, and **as of July 1, 2026, existing iBudget enrollees who want to transfer into it may do so.** This is a genuine choice, not an automatic switch — ask your Waiver Support Coordinator to walk you through the tradeoffs before deciding.

**APD calls it the "pre-enrollment list" now,** not the waitlist. You will still hear both terms, but APD's own forms and website use pre-enrollment.

> If someone tells you to send an ABA prior authorization to the state's review vendor, that guidance is out of date. Ask your managed care plan for its current authorization process in writing.

## What Is the Florida Medicaid Waiver?

Think of the Medicaid Waiver as a program that funds services regular Medicaid will not cover, or will not cover in enough quantity. In Florida the main waiver for people with autism and other developmental disabilities is the **iBudget Waiver**, administered by APD.

The waiver can pay for:

- ABA and behavior services beyond what regular Medicaid authorizes
- Respite care, so caregivers get a break
- Personal care assistance
- Residential and supported living services
- Supported employment and job coaching
- Life skills coaching
- Adaptive equipment and environmental modifications

Once enrolled, you receive an individual budget to spend on approved services that fit your family. The hard part is getting in — demand far exceeds available funding.

## Who Qualifies?

To be eligible, your child must:

- **Have a qualifying diagnosis** — autism spectrum disorder, intellectual disability, cerebral palsy, spina bifida, Down syndrome, Prader-Willi syndrome, or another developmental disability that began before age 18.
- **Be a Florida resident.** A utility bill, lease, or state ID works as proof.
- **Qualify for Medicaid**, or meet the criteria to qualify once on the waiver.
- **Need an institutional level of care** — meaning that without these supports, your child would need care at the level an institution provides.

Most children with a well-documented autism diagnosis meet these criteria. The level-of-care requirement is not a judgment about your family; it simply establishes that your child needs significant support with daily living, communication, behavior, or safety.

## The Pre-Enrollment List: How It Actually Works

This is the part most families get wrong, and the misunderstanding is costly.

**Your position is not determined by when you applied.** Under section 393.065(5), Florida Statutes, APD sorts everyone waiting into **seven priority categories**, ranked highest to lowest need. Category 1 is for people in crisis — homelessness, danger to self or others, or a caregiver who can no longer provide care. Category 2 covers certain children transitioning out of the child welfare system. Only **within Categories 3 through 7** does date order apply, and even then it runs from the date your eligibility was determined, not the date you first called.

What this means in practice:

- **Apply early anyway.** You cannot be placed in a category at all until you have applied and been determined eligible, and that determination date is what orders you within your category.
- **Your category can change.** If your family's circumstances deteriorate — a caregiver becomes ill, your child's behavior becomes unsafe, your housing becomes unstable — tell APD immediately and ask to be re-evaluated for a higher category. Do not assume they will notice.
- **Document everything.** Category changes are driven by evidence. Keep records of hospitalizations, police contacts, school incidents, caregiver medical conditions, and housing instability.

**How long is the wait?** For most families in Categories 3 through 7, it is measured in years, not months. As of early 2026 roughly 17,000 Floridians were on the pre-enrollment list. Florida's FY 2026-27 budget added $10 million toward reducing it, plus $15 million for the developmental disability managed care program — real money, but modest against the size of the list.

> Respond to every letter APD sends. Families lose their place by missing a renewal or a request for updated information. Set a calendar reminder and keep APD updated on address and phone changes.

## How to Apply: Step by Step

### Step 1: Contact APD
Call **(866) 273-2273** — (866) APD-CARES — or start at [apd.myflorida.com](https://apd.myflorida.com/customers/application/). Say you are applying for developmental disability services for your child.

### Step 2: Complete the Application
Gather before you start:

- **Your child's records:** birth certificate, Social Security number, proof of Florida residency
- **Medical documentation:** the autism diagnosis, recent evaluations, medication list, medical history
- **Medicaid information:** your child's Medicaid ID, or ask APD for help applying

The diagnostic documentation is what carries the application. A thin evaluation is the most common reason a determination stalls.

### Step 3: Eligibility Determination
APD reviews the records and may request additional evaluation. This step establishes both whether your child is eligible and the date that orders your position within your category.

### Step 4: Category Assignment
Once eligible, your child is placed on the pre-enrollment list in one of the seven priority categories. You will receive a letter confirming eligibility and category.

### Step 5: Stay Active
Return renewal paperwork promptly. Report any significant change in your child's needs or your family's circumstances — this is the mechanism by which categories get revisited.

## What the iBudget Covers

### Home and Family Support
- Personal care assistance with bathing, dressing, eating, and medication
- Respite care
- In-home supports for daily living skills
- Family training

### Therapy and Behavior
- Behavior analysis services and behavior assistant services
- Specialized therapies including speech, occupational, and physical therapy
- Support from board certified behavior analysts

### Living Independently
- Supported living coaching for teens and adults
- Residential services, including group homes
- Environmental modifications for safety and accessibility
- Adaptive equipment, including communication devices

### Community and Employment
- Supported employment and job coaching
- Personal supports for community participation
- Transportation to work, therapy, and programs

## How Your Budget Is Set

Your child does not get assigned to a tier. **The old four-tier structure belonged to the waiver that iBudget replaced** — if a source is still describing Tiers 1 through 4, it predates the current program.

Instead, APD calculates an **individual budget using an algorithm**. The main inputs are a standardized needs assessment called the **QSI (Questionnaire for Situational Information)**, your child's age, and their living setting. Higher assessed support needs produce a larger budget.

Two things worth knowing:

- **The QSI matters enormously.** It is an interview-based assessment, and how thoroughly your child's support needs are described directly affects the funding. Be specific and describe your child's hardest days, not their best ones.
- **The algorithm's result is not final.** If the calculated amount cannot cover your child's needs, there is a process to request additional funding for **significant additional needs**. Your Waiver Support Coordinator can explain what documentation supports that request.

## Using Your iBudget

Once enrolled, you work with a **Waiver Support Coordinator** — your guide through the system.

1. **Build a support plan.** Choose services, set goals, and plan how to spend the budget.
2. **Choose providers.** You can use agencies or hire individuals, and in some cases relatives. All providers must be APD-approved.
3. **Track spending.** Your coordinator provides reports showing what was used and what remains.
4. **Annual review.** Needs are reassessed each year and budgets may rise, fall, or hold steady.

> If your coordinator is unresponsive, you can request a different one. You are not stuck with a coordinator who does not return your calls.

## While You Wait

Do not treat the list as a reason to pause. Most of what your child needs in the meantime is available through other channels.

### Regular Medicaid
Florida Medicaid covers behavior analysis, speech therapy, occupational therapy, physical therapy, medical care, mental health services, and prescriptions for children under 21. Federal EPSDT rules require medically necessary services for children regardless of the waiver.

Under the current rules, expect to need a **Comprehensive Diagnostic Evaluation**, prior authorization from your managed care plan, an in-network provider, and reassessment every six months.

### Early Steps (Birth to 3)
Developmental screenings, evaluations, therapy, and family support. Call **(800) 218-0001**. If your child is approaching 3, ask about transition to school district services — see our [ESE Pre-K guide](https://floridaautismservices.com/blog/florida-ese-prek-guide).

### Education Scholarships
Florida's scholarship programs were reorganized, and two names you may still see quoted no longer exist. **The McKay Scholarship and the Gardiner Scholarship were repealed** and folded into the Family Empowerment Scholarship. The current programs are:

- **[FES-UA](https://floridaautismservices.com/resources/scholarships/fes-ua)** — Family Empowerment Scholarship for Students with Unique Abilities. The successor to McKay and Gardiner, and the main one for autistic students. Functions as an education savings account, so funds can go toward therapies and services, not only tuition.
- **[FES-EO](https://floridaautismservices.com/resources/scholarships/fes-eo)** — Educational Options, Florida's general school choice scholarship.
- **[FTC](https://floridaautismservices.com/resources/scholarships/ftc)** — Florida Tax Credit Scholarship.
- **[PEP](https://floridaautismservices.com/resources/scholarships/pep)** — Personalized Education Program, for families educating outside a traditional school.

FES-UA does not require the waiver, and it does not require an IEP if you have a qualifying diagnosis from a licensed physician or psychologist.

### County and Community Resources
Many counties run recreation programs, parent support groups, respite vouchers, and equipment lending libraries. Start with your county's parks or human services department, and with your regional [CARD center](https://florida-card.org/), which provides support at no cost to families.

## Common Questions

**Can my child have both regular Medicaid and the waiver?** Yes. The waiver adds services on top of regular Medicaid.

**What if my child does not have Medicaid yet?** APD can help you apply through disability-based eligibility pathways.

**Should we switch to the ICMC managed care program?** It depends on your situation, and as of July 1, 2026 it is a real option for existing enrollees. Ask specifically about whether your current providers are in network and how service authorizations would change. Get the answers in writing before you decide.

**Can we hire family members as caregivers?** For some services, yes. It depends on the service and your circumstances — ask your coordinator.

**What if we move to another county?** Your waiver follows you, but you must update APD promptly.

**Does the waiver end at 18?** No. iBudget serves people of all ages. Around this age you should also be planning for guardianship alternatives, supported decision-making, adult Medicaid, and SSI.

## Red Flags and How to Advocate

Watch for:

- A coordinator who does not return calls
- Services authorized but never delivered
- A budget that no longer matches your child's needs, with no explanation
- Being told a service "isn't covered" without anything in writing

If something is wrong:

1. **Put it in writing.** Email creates the record that phone calls do not.
2. **Escalate to the supervisor.** Every coordinator has one.
3. **File a complaint with APD** at (866) 273-2273.
4. **Appeal.** Denials and reductions carry appeal rights, and there are deadlines — act quickly rather than waiting to see if things improve.
5. **Get free help:**
   - Family Network on Disabilities: **(800) 825-5736**
   - Disability Rights Florida: **(800) 342-0823**

Neither organization charges families.

## Helpful Resources

- [Apply for APD Services](https://apd.myflorida.com/customers/application/) — start your application
- [APD Pre-Enrollment Information](https://www.apd.myflorida.com/customers/preenrollment/) — how the list works
- [Florida Medicaid Application](https://www.myflfamilies.com/medicaid) — apply online
- [Early Steps Florida](https://www.floridahealth.gov/programs-and-services/childrens-health/early-steps/) — birth to 3 services
- [Florida CARD Centers](https://florida-card.org/) — free support, statewide
- [Family Network on Disabilities](https://fndusa.org/) — free advocacy support
- [Disability Rights Florida](https://disabilityrightsflorida.org/) — legal assistance
- [Find Providers Near You](https://floridaautismservices.com/providers) — search our directory

*Program rules, funding, and waitlist figures change. Confirm current details with APD or your managed care plan before making decisions.*$guide$,
  updated_at = now()
WHERE slug = 'florida-medicaid-waiver-guide';

-- The IEP guide's updated_at was left behind its own created_at by the publish edit, which
-- would sort it below this refresh. Align them so the newest guide leads the list.
UPDATE blog_posts
SET updated_at = created_at
WHERE slug = 'iep-vs-504-plan-guide';
