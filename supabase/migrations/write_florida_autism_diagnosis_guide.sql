-- Creates the Florida autism diagnosis/evaluation guide as an UNPUBLISHED row, then schedules
-- pg_cron to flip it live on Mon Aug 17, 2026 at 12:00 UTC (8am ET).
--
-- Notes:
--   * ReactMarkdown is configured without remark-gfm, so tables will not render — lists only.
--   * "## Coming Soon" anywhere in content triggers the stub template in BlogPost.tsx. Avoid it.
--   * The update_blog_posts_updated_at trigger forces updated_at = now() on every UPDATE, so the
--     cron flip stamps updated_at to the publish date. created_at is set to match so the byline,
--     the card date, and the guides-list sort all agree on Aug 17.
--   * Sitemap is generated from Supabase by generate-sitemap.js — rerun it after the guide goes live.

-- content is NOT NULL, so the row is seeded empty and filled by the UPDATE below.
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, image_url, published, featured, created_at, updated_at)
VALUES (
  'How to Get an Autism Diagnosis in Florida',
  'florida-autism-diagnosis-guide',
  '',
  'Florida families are waiting 8 to 24 months for an autism evaluation — and many discover too late that the report they finally received will not unlock the services they need. Here is how the diagnostic system actually works, how to shorten the wait, and how to make sure the evaluation counts.',
  'Florida Autism Services',
  'guide',
  'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800',
  false,
  false,
  '2026-08-17 12:00:00+00',
  '2026-08-17 12:00:00+00'
);

UPDATE blog_posts
SET content = $guide$
You noticed something. Maybe your two-year-old stopped using words they used to have. Maybe your pediatrician said "let's watch it" at the last visit and you've been watching ever since. Maybe your child is seven, doing fine academically, and falling apart every day the moment they get in the car.

So you called somewhere to get an evaluation, and the answer was: **fourteen months.**

That wait is real, it is the single biggest obstacle Florida families face, and it is not the whole story. There is more than one door into a diagnosis in this state, several of them are free, and a few of them move much faster than the one most families try first. There is also a way to get all the way through this process and end up with a report that does not do what you need it to do — which is the part almost nobody warns you about.

## Key Takeaways

- Florida has **two separate diagnostic systems** — a *medical* diagnosis and an *educational* eligibility determination. They are not interchangeable, and most families eventually need both.
- **Under age 3:** call Early Steps at **(800) 218-0001**. It is free, a parent can refer, and no diagnosis is required to start.
- **Age 3 and up:** your school district must evaluate at no cost under **Child Find**. Request it in writing.
- Reported waits for a private medical evaluation in Florida run **8 to 24 months** as of 2026. Get on more than one waitlist.
- If you plan to use Medicaid for ABA, the evaluation must meet Florida's **Comprehensive Diagnostic Evaluation (CDE)** standard — ask before you book, not after.
- **CARD centers are free and genuinely useful, but they do not diagnose.** Florida law prohibits it. Do not spend six months waiting on the wrong door.
- The day you have a diagnosis, do three things: apply for **FES-UA**, get on the **APD waiver pre-enrollment list**, and request a school evaluation.

## First, Understand That There Are Two Different Diagnoses

This trips up more Florida families than anything else in the process.

A **medical diagnosis** of Autism Spectrum Disorder is made by a licensed clinician against the DSM-5-TR criteria. It is what insurance, Medicaid, the state's scholarship programs, and the Agency for Persons with Disabilities all run on.

An **educational eligibility** determination is made by your school district. The district evaluates whether your child meets Florida's ESE criteria for the Autism Spectrum Disorder eligibility category *and* needs specially designed instruction. That determination governs whether your child gets an IEP.

Here is why the distinction matters:

- A medical diagnosis **does not** obligate the school to write an IEP. The district runs its own evaluation against its own criteria.
- Educational eligibility **does not** get ABA authorized by Medicaid or a commercial plan. Those require a clinical diagnosis and, usually, a physician's order.

Neither one substitutes for the other. If your child needs both school services and therapy services, plan on pursuing both tracks — and you can pursue them at the same time. They are separate agencies with separate timelines, and nothing about starting one prevents you from starting the other.

## If Your Child Is Under 3: Start With Early Steps

**This is the fastest door in Florida, and it is free.**

Early Steps is Florida's early intervention program for children from birth to 36 months. It serves children with diagnosed conditions that may lead to developmental delay — autism is explicitly one of them — *and* children who simply show developmental concerns with no diagnosis at all.

What makes it the right first call:

- **Anyone can refer,** including you. You do not need a doctor's referral, a diagnosis, or a waitlist appointment first.
- **There is no cost to families** for evaluation and eligibility determination.
- If there's no diagnosed condition yet, a team screens, evaluates, and assesses your child to determine eligibility.
- Services are delivered in your child's natural environment — usually your home — and focus on coaching *you*, which is exactly what the research supports at this age.

**Call (800) 218-0001** or contact your regional Early Steps office. Do it the week you have the concern. Do not wait for the pediatrician's next appointment, and do not wait for the private evaluation you've scheduled for next spring.

One caution: Early Steps eligibility is not the same thing as a medical autism diagnosis. It gets services started immediately, which is the point — but you will still want a formal diagnostic evaluation, and you should stay on that waitlist while Early Steps is working.

The other thing to know: **Early Steps ends at 36 months.** Transition planning to the school district's ESE preschool program should begin by around 33 months. Ask your service coordinator about it early, because that handoff is where children most often fall through the gap.

## If Your Child Is 3 or Older: Use Child Find

Once your child turns 3, responsibility shifts to your school district — and the district has a federal obligation called **Child Find** to identify, locate, and evaluate any child who may have a disability. That obligation applies whether your child is enrolled in public school, private school, or homeschooled, and it applies to preschoolers who have never attended a day of school.

**The evaluation is free.** Districts cannot charge for it and cannot require you to obtain a private evaluation first.

How to trigger it:

1. Write to your school's principal and the district's ESE office. Email is ideal — it timestamps itself.
2. State plainly: *"I am requesting a full individual evaluation for special education eligibility under IDEA for my child, [name], date of birth [date]. I am concerned about [specific observations]."*
3. Ask for a copy of your procedural safeguards.
4. Keep the sent message.

Two Florida specifics worth knowing:

- **Florida districts generally require a documented multi-tiered intervention process before an autism eligibility determination**, unless the data already clearly indicates a disability. This is legitimate under state rule — but it is *not* a reason to refuse or delay your evaluation request. If a school tells you they can't evaluate until interventions have run for a semester, ask for that refusal in **Prior Written Notice**. Districts rarely put a flat refusal in writing, and the request usually moves.
- **FDLRS** — the Florida Diagnostic and Learning Resources System — supports Child Find with screenings, family services, and referral information. Your regional FDLRS center is a useful free resource for figuring out who to contact in your district.

For what happens after eligibility is determined, see our guide on [IEP vs. 504 Plan](/blog/iep-vs-504-plan-guide) — the difference matters more in Florida than most parents are told.

## The Medical Evaluation: Who Can Diagnose

A diagnostic evaluation for autism should be performed by a clinician with specific training in developmental assessment. In practice that means:

- **Developmental-behavioral pediatricians** — the deepest training for this specific question, and the longest waitlists
- **Child psychologists (Ph.D. or Psy.D.)** — often the most available route, and typically the most thorough on the testing side
- **Child psychiatrists**
- **Pediatric neurologists**

For Florida-specific paperwork purposes, it's worth knowing that the **FES-UA scholarship** accepts documentation of a qualifying diagnosis from a Florida-licensed physician, a physician licensed in another U.S. state or territory, a Florida-licensed physician assistant authorized to sign on a physician's behalf, a Florida-licensed autonomous APRN, or a licensed psychologist. A current district IEP works as an alternative. **A 504 plan does not.**

## What a Real Evaluation Actually Looks Like

A defensible autism evaluation is not a fifteen-minute conversation and a checklist. It should involve several hours across one or more sessions, and it should include:

- **A structured developmental and medical history** from you, often using a formal parent interview such as the ADI-R
- **Direct standardized observation of your child** — the [ADOS-2](/resources/services/ados-testing) is the current gold standard, administered by someone trained and reliable in it
- **A cognitive or developmental assessment** appropriate to your child's age and language level
- **An adaptive functioning measure**, most commonly the **Vineland-3** — this captures what your child actually does day to day, not what they can do on a good afternoon in a quiet room
- **Behavior rating scales**, commonly the **BASC-3**, with input from you and ideally from a teacher or childcare provider
- **A written report** stating the DSM-5-TR criteria met, the severity levels for social communication and restricted/repetitive behaviors, and specific treatment recommendations

If a provider offers to diagnose based on a brief screener and a short observation, keep looking. That report will not hold up when you need it to.

## The Part Almost Nobody Warns You About: The CDE

If you intend to use **Florida Medicaid** to pay for ABA — and most Florida families with an autism diagnosis eventually do — the evaluation you obtain must satisfy Florida's **Comprehensive Diagnostic Evaluation (CDE)** requirement.

Since the December 2024 coverage policy, AHCA requires a copy of the child's CDE, alongside the other required documentation, when a provider submits a prior authorization request for behavior analysis services. The CDE must come from a qualifying licensed professional — a developmental pediatrician, psychologist, psychiatrist, or neurologist — and it must be a full diagnostic workup, not a screening.

This requirement now applies to managed care plans as well. Since **February 1, 2025**, behavior analysis services are carved into Florida's Medicaid managed care plans, which means your child's MMA plan handles authorization, network contracting, and reimbursement. Families in fee-for-service Medicaid continue to route prior authorization through AHCA's contracted review organization.

**What this means for you, practically:**

- Before you book an evaluation, ask the office directly: *"Does your evaluation meet Florida Medicaid's CDE requirement for behavior analysis prior authorization?"* Get the answer before you take the appointment.
- Ask what instruments they administer. If Vineland-3 and BASC-3 aren't part of the battery, expect trouble at authorization.
- Keep the complete report, not just the summary letter. Plans request the full document.

Families who skip this question routinely wait a year for an evaluation, receive a two-page letter confirming a diagnosis, and then discover they need to start over. Ten minutes on the phone up front prevents it.

More on what comes next in our [ABA therapy guide](/blog/understanding-aba-therapy-florida-guide).

## The Wait — and How to Shorten It

Florida families are reporting waits of **8 to 24 months** for diagnosis and the start of therapy as of 2026. That is the reality, and no amount of persistence eliminates it entirely. But several things measurably help:

- **Get on multiple waitlists at once.** There is no penalty for holding several appointments and canceling the ones you don't need. Call every practice within a reasonable drive, not just the closest one.
- **Ask to be put on the cancellation list at each one.** Then call back every few weeks. Practices fill cancellations from whoever picks up the phone.
- **Widen your radius.** A three-hour drive for a one-day evaluation is often faster than waiting for the practice ten minutes away.
- **Don't wait for the diagnosis to start services.** Early Steps, the school district evaluation, speech therapy, and occupational therapy do not all require an autism diagnosis first. Many are accessible on a pediatrician's referral for a delay or a concern.
- **Ask your pediatrician to refer directly.** Some practices prioritize physician referrals over self-referrals, and some won't schedule without one.
- **Consider a university-affiliated clinic or teaching hospital.** Longer sessions, sometimes shorter waits, and often better-trained examiners.

**Meanwhile, get on the [APD iBudget waiver pre-enrollment list](/blog/florida-medicaid-waiver-guide) the moment you have a qualifying diagnosis.** It costs nothing, the wait is measured in years, and your date of application is one of the few things you control.

## What CARD Is — and What It Isn't

Florida funds seven university-based **Centers for Autism and Related Disabilities (CARD)** covering the whole state, and their services are genuinely free to individuals, families, and professionals.

**But CARD centers do not perform diagnostic evaluations.** Florida law does not permit it. They do not diagnose, and they do not provide ABA, speech, occupational, or physical therapy.

What they *do* provide is real and worth having:

- Individualized consultation and technical assistance
- Training for families and for the professionals working with your child
- Support navigating school, community, and adult-services systems
- **Referral information for diagnostic resources in your community** — which is exactly the help you want when you're starting from zero

Call your regional CARD center early. Just call it for what it is: the best free navigation resource in the state, not the place that will diagnose your child.

## Paying For It

- **Medicaid** covers diagnostic evaluation for children. If your child has Medicaid, start with in-network providers under their plan.
- **Commercial insurance:** Florida's autism insurance mandate (often called the Geller Act) requires many state-regulated plans to cover autism diagnosis and treatment. **Self-funded employer plans governed by ERISA are exempt** — and a large share of Florida employees are on self-funded plans, so check rather than assume. Call the number on your card and ask specifically whether your plan is fully insured or self-funded.
- **Private pay** evaluations are commonly well over $1,000 and can run several thousand dollars depending on the battery. Always ask for the full price in writing, including any separate charges for testing, report writing, and the feedback session.
- **University clinics and training programs** frequently offer sliding-scale rates.
- **Early Steps and school district evaluations are free.** If cost is the barrier, these are your routes.

## After the Diagnosis: Your First 60 Days

The report is not the finish line — it's a key that opens several doors, and some of them have their own long lines behind them. In rough priority order:

1. **Get on the APD iBudget waiver pre-enrollment list.** Free, and the wait is long. Do this first because your application date matters.
2. **Apply for [FES-UA](/resources/scholarships/fes-ua).** An autism diagnosis documented by a qualifying licensed professional makes your child eligible — an IEP is not required. Funding is awarded on a first-come basis, so apply as soon as the application window opens.
3. **Request a school district evaluation in writing** if you haven't already, or request an IEP meeting if your child already has one.
4. **Start prior authorization for therapy.** ABA, speech, and occupational therapy each require their own authorization path. Confirm your evaluation satisfies the CDE requirement before your provider submits.
5. **Ask for copies of everything.** Full report, raw score summaries, the physician's order. You will be asked for these repeatedly for years.
6. **Find your people.** Your regional CARD center, a local parent support group, and this directory's [provider search](/providers) are the three places to start.

## Key Terms to Know

- **ASD** — Autism Spectrum Disorder, the DSM-5-TR diagnosis.
- **CDE** — Comprehensive Diagnostic Evaluation. Florida Medicaid's required diagnostic standard for authorizing behavior analysis services.
- **ADOS-2** — Autism Diagnostic Observation Schedule, Second Edition. The standardized direct-observation assessment considered the gold standard.
- **ADI-R** — Autism Diagnostic Interview, Revised. Structured caregiver interview.
- **Vineland-3** — Adaptive behavior scales measuring everyday functioning.
- **BASC-3** — Behavior Assessment System for Children, including the Parent Rating Scales.
- **M-CHAT-R/F** — The autism screening tool pediatricians use at the 18- and 24-month well visits. A positive screen is a referral trigger, not a diagnosis.
- **Child Find** — The federal obligation on school districts to identify, locate, and evaluate children who may have disabilities.
- **FDLRS** — Florida Diagnostic and Learning Resources System. Regional centers supporting Child Find and family services.
- **Early Steps** — Florida's birth-to-36-months early intervention program.
- **CARD** — Center for Autism and Related Disabilities. Free university-based support; does not diagnose.
- **ESE** — Exceptional Student Education. Florida's term for special education.
- **APD** — Agency for Persons with Disabilities. Administers the iBudget waiver.
- **Prior Written Notice (PWN)** — The district's required written explanation when it proposes or refuses an evaluation or placement change.

## Tips From Parents Who've Been Through It

- **Put the request in writing, always.** Phone calls to schools and agencies do not start clocks. Dated emails do.
- **Start the free tracks while you wait on the paid one.** Early Steps and the district evaluation cost nothing and run in parallel with your private waitlist.
- **Write down what you're seeing, with dates.** Short notes on a phone are enough. Evaluators ask for specific examples and specific ages, and it is remarkably hard to reconstruct two years later.
- **Video helps.** A few short clips of the behaviors that concern you can convey in thirty seconds what takes ten minutes to describe — especially when your child has a good day in the office.
- **Ask about the CDE before you book.** This is the single highest-value ten-minute phone call in the entire process.
- **Ask who administers the ADOS-2 and whether they're research-reliable.** Good clinics answer this without hesitation.
- **Bring childcare arrangements for siblings.** Evaluations run long, and a distracted parent interview produces a weaker history.
- **Request the full written report, not just the letter.** Everything downstream asks for the full document.
- **A diagnosis is not a ceiling.** It is the paperwork that unlocks the support. Nothing about your child changed the day the report was signed.

## The Bottom Line

Florida's diagnostic system is slow, fragmented, and split across agencies that don't talk to each other. But there are three doors, not one — and two of them are free and open right now.

If your child is under 3, call Early Steps today. If your child is 3 or older, email the district today. Then get on the private evaluation waitlists, ask each one whether their evaluation meets the CDE standard, and use the waiting time to start the services that don't require the diagnosis first.

The families who come out of this process fastest are not the ones who found a shortcut. They're the ones who started three tracks at once instead of waiting politely at the end of a single line.

Ready to start building your team? Search [autism providers across all 67 Florida counties](/providers) by service, insurance, and location.
$guide$
WHERE slug = 'florida-autism-diagnosis-guide';

-- Keep created_at pinned to the scheduled publish date; the updated_at trigger fired on the
-- statement above and would otherwise leave the row looking revised before it ever went live.
UPDATE blog_posts
SET created_at = '2026-08-17 12:00:00+00'
WHERE slug = 'florida-autism-diagnosis-guide';
