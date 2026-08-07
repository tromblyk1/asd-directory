-- Refreshes the ABA therapy guide. Corrects five items that had gone stale or were wrong:
--
--   1. "$36,000 per year" was presented as the commercial insurance cap. Under s. 627.6686 that is
--      the statutory BASE, adjusted every January 1 for the medical component of CPI — so the real
--      current cap is higher. The guide also omitted the $200,000 lifetime max entirely.
--   2. The Geller Act's eligibility limits were missing: coverage runs to under 18 (or 18+ while in
--      high school) AND requires diagnosis at age 8 or younger. Families get blindsided by both.
--   3. "an autism diagnosis and a prescription or referral" is no longer sufficient for Medicaid ABA.
--      The Dec 2024 coverage policy requires a Comprehensive Diagnostic Evaluation (CDE).
--   4. No mention of the Feb 1, 2025 managed-care carve-in — ABA prior auth now runs through the
--      child's MMA plan, which changes network rules and who to call.
--   5. "Family Empowerment Scholarship (formerly Gardiner)" was imprecise, and the guide missed that
--      FES-UA funds can actually pay for ABA.
--
-- Also corrects TRICARE: the referral must come from the ASD-diagnosing provider (not the primary
-- doctor) every two years, and prior auth requires Vineland-3 / SRS-2 / PDDBI outcome measures.

UPDATE blog_posts
SET
  excerpt = 'ABA is the most widely covered autism therapy in Florida — and the one with the most paperwork between you and the first session. Two changes since 2025 altered how families get it authorized, and the insurance cap most guides quote has been wrong for years.',
  content = $guide$
Everyone tells you to "get your child into ABA." Nobody tells you that between the recommendation and the first session there is a diagnostic evaluation, a physician's order, a functional assessment, a treatment plan, a prior authorization, and a network check — and that getting any one of them wrong sends you back to the start.

This guide covers what ABA actually is, what good ABA looks like in 2026, and — the part that stalls most Florida families — exactly how it gets paid for under Medicaid, commercial insurance, TRICARE, and the state scholarship programs.

## What Changed Recently — Read This First

If you last looked into ABA before 2025, two things have changed and both affect how you get services started.

- **Medicaid ABA moved into managed care on February 1, 2025.** Behavior analysis is now carved into Florida's Medicaid managed care plans. Your child's MMA plan — not the state directly — handles prior authorization, network contracting, and payment. Families still in fee-for-service Medicaid route authorization through AHCA's contracted review organization instead.
- **A Comprehensive Diagnostic Evaluation (CDE) is now required.** Since the December 2024 coverage policy, AHCA requires a copy of the child's CDE alongside the other documentation when a provider submits a prior authorization request. A diagnosis letter is not enough.

The practical consequence: **the evaluation you get determines whether ABA gets authorized.** More on this below, because it is the single most common place Florida families lose six months.

## Key Takeaways

- ABA is a data-driven teaching approach delivered by a **BCBA** who designs the plan and **RBTs** who run the sessions.
- **Florida Medicaid** has no hard annual dollar or hour cap for recipients under 21 — authorization is based on medical necessity — but every authorization is time-limited and must be renewed.
- **Commercial coverage under the Geller Act is capped**, and the cap has real limits most families don't learn about until they hit them.
- **Self-funded employer plans are exempt** from Florida's mandate. A large share of Florida employees are on one. Check, don't assume.
- **FES-UA scholarship funds can pay for ABA** from approved providers — a route many families overlook.
- Waitlists are long. Get on several, and ask what you can start doing at home in the meantime.

## What ABA Actually Is

Applied Behavior Analysis is a framework for teaching skills and reducing behaviors that interfere with learning or safety. A **Board Certified Behavior Analyst (BCBA)** assesses your child, writes a plan with specific measurable goals, and tracks progress with data. **Registered Behavior Technicians (RBTs)** deliver most of the direct hours under that BCBA's supervision.

The goals are ordinary life: communicating a need, tolerating a haircut, joining a game, crossing a parking lot safely, getting dressed without a two-hour standoff. Sessions happen at home, in a clinic, at school, or in the community — often some mix.

ABA is not only for young children. Teens and adults use it for job skills, cooking, transit, and college readiness. What changes is the goal set, not the method.

## What Good ABA Looks Like in 2026

ABA has drawn real criticism, much of it aimed at how the field operated decades ago — compliance-driven programs, drills stripped of context, goals set to make children appear less autistic rather than more capable. Those criticisms landed, and the field has moved. Knowing what current practice should look like is your best tool for evaluating a provider.

Signs you're looking at a program worth your child's time:

- **Assent-based.** The team watches for your child's willingness to participate and treats withdrawal as information, not defiance.
- **Naturalistic.** Skills are taught inside play and daily routines, not only at a table.
- **Functional goals.** Targets are things that make your child's life easier, not things that make your child look typical. Hand-flapping that hurts nobody is not a treatment target.
- **Communication first.** Any program addressing a challenging behavior should be teaching a replacement way to communicate the same need — including AAC or sign, not just speech.
- **Parent-facing.** You're trained and consulted, not managed.
- **Honest about hours.** A recommendation should be justified by your child's assessment, not by what fills a schedule.

If a provider dismisses these questions or tells you criticism of ABA comes from people who don't understand it, that's information too.

## How It Works, Step by Step

1. **Diagnostic evaluation.** You need a documented autism diagnosis. For Medicaid, it must meet the CDE standard.
2. **Physician's order.** A referral or prescription for behavior analysis services.
3. **Assessment.** The BCBA observes your child across settings, interviews you, and administers standardized measures. Florida Medicaid's documentation framework centers on the **Vineland-3** adaptive behavior scales and the **BASC-3** Parent Rating Questionnaire.
4. **Treatment plan.** Written goals, recommended hours, and service locations. Review it before it goes anywhere — you are entitled to understand every goal.
5. **Prior authorization.** Submitted to your MMA plan, your commercial insurer, or the fee-for-service reviewer. Medicaid authorizations run on roughly a **six-month cycle**, so this is recurring, not one-time.
6. **Services begin.** RBT sessions with BCBA supervision, ongoing data, and periodic reassessment.

**Where families get stuck:** step 1. An evaluation that doesn't meet the CDE standard, or a report that omits the required instruments, gets the authorization denied — after you already waited months for the appointment. Before you book an evaluation, ask the office directly whether it satisfies Florida Medicaid's CDE requirement for behavior analysis authorization. See our [autism diagnosis guide](/blog/florida-autism-diagnosis-guide) for how to get this right the first time.

## Paying For It: Florida Medicaid

For children under 21, Florida Medicaid covers behavior analysis under **EPSDT**, the federal requirement to provide medically necessary services to children. There is no arbitrary annual dollar cap or hour ceiling — but "medically necessary" is determined through authorization, and that authorization is time-limited.

What you need:

- A **CDE** from a qualifying licensed professional — developmental pediatrician, psychologist, psychiatrist, or neurologist
- A **physician's order** for behavior analysis services
- A **BCBA assessment** with the required instruments
- **Prior authorization** through your child's managed care plan

Two things to watch since the carve-in:

- **Network matters now.** Your plan authorizes services from providers in *its* network. A provider who took your child's Medicaid before may not be contracted with your specific MMA plan. Confirm before you get attached to a clinic.
- **Know who to call.** Authorization questions go to your MMA plan's behavioral health line, not to AHCA.

If your child has the **iBudget Waiver** through the Agency for Persons with Disabilities, related supports can continue past 21. The waiver has a years-long waitlist and is worth applying to the moment your child qualifies — see the [Florida Medicaid waiver guide](/blog/florida-medicaid-waiver-guide).

## Paying For It: Commercial Insurance

Florida's autism insurance mandate — the **Steven A. Geller Autism Coverage Act**, at ss. 627.6686 and 641.31098 — requires many state-regulated group plans to cover autism diagnosis and treatment including ABA. The details matter more than most summaries admit:

- **The annual maximum is a moving number.** The statute sets **$36,000**, but that figure "shall be adjusted annually on January 1 of each calendar year to reflect any change from the previous year in the medical component of the then current Consumer Price Index." The base has been indexed for years, so the current cap is meaningfully higher than $36,000. **Ask your plan for the current figure in writing** — do not budget off the number you read in an article.
- **There is a $200,000 lifetime maximum** on these benefits.
- **Age limits are strict.** Coverage applies to an individual **under 18**, or **18 and older while still in high school** — and requires that the autism diagnosis was made at **age 8 or younger**. A child diagnosed at 10 does not gain mandate protection.
- **Large categories of plans are exempt.** The mandate does not reach individual-market policies, individually underwritten plans, or small-employer plans. Separately, **self-funded employer plans governed by federal ERISA law are outside state authority entirely.**

That last point is the one that catches people. Many Florida employees are on self-funded plans without knowing it, because the card carries a familiar insurer's logo while the employer actually pays the claims. **Call the number on your card and ask specifically: is this plan fully insured or self-funded?** Self-funded plans often cover ABA voluntarily and generously — but they do it by choice, and the state cap and protections don't apply either way.

Even with coverage, expect deductibles, copays, and coinsurance. Ask your provider about payment plans before the first invoice, not after.

## Paying For It: TRICARE

Military families access ABA through the **Autism Care Demonstration (ACD)**, currently authorized through **December 31, 2028**. Requirements are specific and easy to trip over:

- A referral from your child's **ASD-diagnosing provider** — not your primary care manager — is required, and must be renewed **every two years**.
- The referral must include a definitive ASD diagnosis with severity level, a DSM-5 checklist, a validated assessment tool, and an explicit request for ABA.
- Prior authorization requires **outcome measures**: the **Vineland-3**, the **Social Responsiveness Scale (SRS-2)**, and the **Pervasive Developmental Disorder Behavior Inventory (PDDBI)**. These are re-administered on a schedule to demonstrate progress.

Hours are set by medical necessity, not a fixed weekly number. Build the outcome-measure appointments into your calendar — a lapsed measure can suspend authorization.

## Paying For It: FES-UA and the Scholarships

The **Gardiner Scholarship** no longer exists as a separate program. It was folded into the **[Family Empowerment Scholarship for Students with Unique Abilities (FES-UA)](/resources/scholarships/fes-ua)**, an education savings account administered by Step Up For Students.

Why this matters here: **FES-UA funds can be used to pay for applied behavior analysis** from approved providers. Families who assume the scholarship only covers tuition leave a therapy funding source on the table.

Eligibility runs on an autism diagnosis documented by a qualifying licensed professional, **or** a current district IEP. A 504 plan alone does not qualify — see [IEP vs. 504 Plan](/blog/iep-vs-504-plan-guide).

Award amounts vary by county, grade band, and the student's **Matrix of Services** level. Students at the base matrix levels average roughly $10,000; level 254 averages around $22,000 and level 255 around $34,000. If your child's needs are substantial and the matrix level looks low, that rating is worth reviewing with the IEP team.

## Understanding ABA Provider Credentials

Certifications come from the Behavior Analyst Certification Board (BACB):

- **BCBA (Board Certified Behavior Analyst)** — master's level. Designs and oversees the program, conducts assessments, supervises sessions. This is who should be leading your child's care.
- **BCBA-D (Doctoral)** — same scope, doctoral training. Often in research, university settings, or complex cases.
- **BCaBA (Board Certified Assistant Behavior Analyst)** — bachelor's level. Implements plans under BCBA supervision; cannot practice independently.
- **RBT (Registered Behavior Technician)** — entry-level. Delivers direct sessions under supervision.

**Using the BACB registry:** search for "BCBA" and filter to **Active** status. Florida also licenses behavior analysts at the state level, so you can verify licensure separately.

## Choosing a Provider — and Red Flags

Ask every clinic you interview:

- How many hours per month will the **BCBA** personally spend with my child, and how much is direct observation?
- What is your **RBT turnover** like, and how many technicians will my child work with?
- May I **observe sessions**, announced or unannounced?
- How do you decide when a behavior becomes a treatment target?
- What is your approach when my child refuses a task?
- How do you **coordinate** with speech, OT, and the school team?
- How and how often do I get **progress data**?
- Are you in network with **my specific plan** — not just "Medicaid"?

Walk away from: a BCBA who is rarely present, goals written in language nobody can explain, pressure to accept a large weekly hour count before the assessment is finished, refusal to let you observe, or any program still relying on punishment procedures.

Waitlists are long, especially outside the metro counties. Get on several, ask about telehealth for the parent-training component, and check back regularly — cancellations go to whoever answers the phone.

## Parent Involvement

Parent training is not a courtesy add-on; it's the part that determines whether skills survive outside the session. A skill that works with an RBT but collapses at bedtime hasn't been learned yet — it's been performed.

Expect your BCBA to model strategies, practice with you, and give feedback. Bring therapy data to IEP meetings. Tell the team about changes at home — new medication, sleep disruption, a move — because behavior data without context leads to wrong conclusions.

And use the free supports: your regional **CARD** center, Family Network on Disabilities, Parent to Parent groups, and APD respite programs.

## Key Terms to Know

- **ABA** — Applied Behavior Analysis.
- **BCBA / RBT** — the analyst who designs the program and the technician who delivers it.
- **EPSDT** — the federal Medicaid requirement to cover medically necessary services for children under 21.
- **CDE** — Comprehensive Diagnostic Evaluation. Required for Medicaid ABA authorization.
- **Prior Authorization (PA)** — plan approval required before services are covered. Medicaid runs roughly six-month cycles.
- **MMA plan** — Managed Medical Assistance plan. Since Feb 2025, your ABA authorization runs through it.
- **Geller Act** — Florida's autism insurance mandate, ss. 627.6686 and 641.31098.
- **ERISA** — the federal law governing self-funded employer plans, which places them outside state insurance mandates.
- **Vineland-3 / BASC-3 / SRS-2 / PDDBI** — standardized instruments required by various payers.
- **Matrix of Services** — Florida's ESE services rating (levels 251–255) that drives FES-UA award size.
- **FES-UA** — Family Empowerment Scholarship for Students with Unique Abilities. Absorbed the former Gardiner Scholarship.

## The Bottom Line

ABA is the most widely funded autism therapy in Florida, and also the one with the most machinery between you and a first session. Almost every delay traces to paperwork rather than to clinical disagreement.

Three things save the most time: get a diagnostic evaluation that meets the CDE standard, confirm in writing whether your commercial plan is fully insured or self-funded, and verify network status with your specific plan rather than with the word "Medicaid."

And keep asking questions of your provider. The good ones expect it.

## Helpful Resources

- [Find ABA Providers in Florida](/providers?service=aba) — search by county, insurance, and service
- [How to Get an Autism Diagnosis in Florida](/blog/florida-autism-diagnosis-guide) — including the CDE requirement
- [Florida Medicaid Waiver Guide](/blog/florida-medicaid-waiver-guide) — iBudget and the pre-enrollment list
- [FES-UA Scholarship](/resources/scholarships/fes-ua) — eligibility and award levels
- [BACB Certificant Registry](https://www.bacb.com/find-a-certificant/) — verify BCBA credentials
- [TRICARE Autism Care Demonstration](https://www.tricare.mil/autism) — military family benefits
- [Agency for Persons with Disabilities](https://apd.myflorida.com/) — iBudget Waiver
- [Family Network on Disabilities](https://fndusa.org/) — parent support
$guide$,
  updated_at = now()
WHERE slug = 'understanding-aba-therapy-florida-guide';

-- Guides.tsx sorts by updated_at, so refreshing the ABA guide would otherwise push it above the
-- brand-new IEP guide. now() is transaction-scoped, so touching the IEP row in this same statement
-- batch gives both rows an identical updated_at; the list query's created_at DESC ordering then
-- breaks the tie in the newer guide's favor. No-op on the data itself.
UPDATE blog_posts
SET title = title
WHERE slug = 'iep-vs-504-plan-guide';
