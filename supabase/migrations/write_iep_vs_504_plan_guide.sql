-- Replaces the "Coming Soon" stub for the IEP vs 504 guide with full content.
-- Note: BlogPost.tsx renders the stub template whenever content contains "## Coming Soon".
-- ReactMarkdown is configured without remark-gfm, so tables will not render — use lists only.

UPDATE blog_posts
SET
  excerpt = 'An IEP and a 504 plan are not two flavors of the same thing. In Florida the choice affects the services your child receives, the legal protections you can enforce, and whether your family qualifies for the FES-UA scholarship. Here is how to tell which one your child actually needs.',
  content = $guide$
Your child has an autism diagnosis. The school just told you they qualify for a 504 plan — or that an IEP "isn't necessary" because your child is keeping up academically. Now you're sitting in a parking lot after a meeting, trying to work out whether that was the right call and whether you're allowed to push back.

You are. And in Florida, the difference between these two documents matters more than most parents are told in that meeting.

An IEP and a 504 plan are not two strengths of the same medicine. They come from different federal laws, they promise different things, they carry very different enforcement power, and — in a wrinkle specific to Florida — **they do not open the same scholarship doors.** This guide explains what each one actually is, how to tell which your child needs, and exactly what to do if you disagree with the school's decision.

## The Short Answer

- A **504 plan** removes barriers. It gives your child *accommodations* — changes to how they access the same instruction every other student gets. Extra time on tests, a sensory break, preferential seating, noise-reducing headphones.
- An **IEP** changes the instruction itself. It provides *specially designed instruction* plus related services like speech therapy, occupational therapy, and behavioral support — with written, measurable goals and legally enforceable progress monitoring.

The rule of thumb: **if your child only needs access to the curriculum, a 504 may be enough. If your child needs the curriculum, the teaching, or the therapies to be different, they need an IEP.**

## What Is an IEP?

An **Individualized Education Plan** comes from the **Individuals with Disabilities Education Act (IDEA)**, a federal funding law. In Florida, IEP services are delivered through **ESE** — Exceptional Student Education.

To qualify, your child must meet a two-part test:

1. They must be identified with one of the disability categories under IDEA — **Autism Spectrum Disorder is one of them**, and
2. The disability must adversely affect their educational performance to the point that they need **specially designed instruction**.

That second part is where most disputes happen, and it's where parents of autistic children get tripped up most often. More on that below.

An IEP is a legal document. It must include:

- Your child's present levels of academic and functional performance
- **Measurable annual goals** — specific, trackable, and reported to you on a set schedule
- The **related services** the district will provide: speech-language therapy, occupational therapy, physical therapy, behavioral support, assistive technology
- Accommodations and modifications
- The **placement** and how much time your child spends with non-disabled peers
- Transition planning (required by age 16 in Florida, though many teams start earlier)

An IEP must be **reviewed at least once a year**, and your child must be **reevaluated at least every three years**.

## What Is a 504 Plan?

A **504 plan** comes from **Section 504 of the Rehabilitation Act of 1973** — a civil rights law, not a funding law. It does not come with any additional state or federal money attached, though districts are flatly prohibited from using cost as a reason to deny a needed accommodation.

The eligibility standard is **broader** than IDEA's: your child qualifies if they have a physical or mental impairment that **substantially limits one or more major life activities**. Learning, reading, concentrating, communicating, thinking, and social interaction all count as major life activities.

This is why some autistic students qualify under 504 but not IDEA: the impairment is real and limiting, but the team concludes the child doesn't require specially designed instruction to access their education.

A 504 plan typically includes accommodations like:

- Extended time on tests and assignments
- Testing in a small group or separate, quieter setting
- Scheduled sensory or movement breaks
- Preferential seating, away from doors, bells, or high-traffic areas
- Visual schedules and advance warning of transitions or changes in routine
- Permission to use noise-reducing headphones or fidget tools
- Reduced or modified homework load
- A designated safe person or check-in adult
- Written instructions to supplement verbal ones

These are genuinely valuable. For many autistic students — particularly those doing well academically who struggle with sensory load, transitions, and executive function — a well-written and *actually followed* 504 plan is the right tool.

## The Core Differences That Actually Matter

**Governing law:** IEP comes from IDEA (education funding law). 504 comes from the Rehabilitation Act (civil rights law).

**What you get:** An IEP provides specially designed instruction *and* related services. A 504 provides accommodations and access; it generally does not provide therapy services.

**Written goals:** An IEP requires measurable annual goals and regular progress reports. A 504 plan has no goal requirement — which means there is often nothing concrete to measure when things aren't working.

**The document itself:** Federal law spells out exactly what an IEP must contain. Section 504 does not require a written plan at all — districts write them as best practice, and the format varies from county to county.

**Review schedule:** IEPs must be reviewed annually and reevaluated every three years. 504 plans are reviewed "periodically," which in practice often means only when a parent asks.

**Your seat at the table:** IDEA makes you a required member of the IEP team and entitles you to meaningful participation. Section 504 contains no equivalent parent-participation mandate — good districts include you, but the law doesn't compel it the same way.

**Prior written notice:** Under IDEA, the district must notify you *in writing* before it changes or refuses to change your child's identification, evaluation, or placement. Section 504 has no comparable requirement. This is a bigger deal than it sounds — it's the paper trail that makes everything else enforceable.

**Independent evaluations:** Under IDEA, if you disagree with the district's evaluation you can request an **Independent Educational Evaluation (IEE) at public expense**. There is no clear parallel right under Section 504.

**If you disagree:** IDEA gives you mediation, a state complaint to the Florida Department of Education, and a formal due process hearing, plus "stay-put" protection that keeps your child's current services in place while a dispute is pending. Under Section 504 there is no state due process system — your options are the district's own impartial hearing and a complaint to the U.S. Department of Education's Office for Civil Rights.

**Funding:** IDEA brings supplemental federal and state ESE dollars to the district. Section 504 brings none.

## The Florida Wrinkle: Scholarships and the Matrix

This is the piece most national articles miss entirely, and for Florida families it can be the deciding factor.

### FES-UA eligibility

The **Family Empowerment Scholarship for Students with Unique Abilities (FES-UA)** is Florida's primary scholarship for students with disabilities. To qualify, a student needs **either an active IEP or a diagnosis of a qualifying condition from a licensed physician or psychologist.**

**A 504 plan by itself does not establish eligibility.**

A student who has only a 504 plan can still qualify — but the parent has to supply a formal medical diagnosis from a physician or psychologist when applying. For families whose child has a documented autism diagnosis, this is usually straightforward. For families relying on the school's evaluation alone, it can be a wall.

If you are weighing a 504 against an IEP and a scholarship is anywhere in your future plans, factor this in before you agree to anything.

### The Matrix of Services

Florida funds ESE through a rating scale called the **Matrix of Services**, which assigns a student a level from **251 to 255** based on the intensity of services in their IEP. The matrix is completed by the IEP team, based on what the IEP actually says.

That score follows your child. It affects district funding, and it affects the size of an FES-UA award. **Services that are discussed in a meeting but never written into the IEP do not count toward the matrix.** If a service matters, it belongs in the document — not in the minutes, not in an email, not in a teacher's verbal assurance.

Learn more about Florida's scholarship options on our [FES-UA scholarship page](https://floridaautismservices.com/resources/scholarships/fes-ua).

## "But My Child Gets Good Grades"

This is the single most common reason Florida parents are steered toward a 504 instead of an IEP, and it deserves a direct answer.

Passing grades **do not** automatically disqualify a child from an IEP. IDEA's standard is that the disability adversely affects *educational performance* — and educational performance is not only academic performance. It includes **functional performance**: communication, social interaction, self-regulation, organization, independence, and behavior.

An autistic student can hold a 3.8 GPA and still:

- Be unable to start a multi-step assignment without one-on-one prompting
- Melt down in the car every afternoon from the effort of masking all day
- Have no reciprocal peer interaction at all
- Miss every unwritten social rule that governs group work
- Be unable to ask for help, report bullying, or advocate for themselves
- Lose an hour of instruction a day to anxiety or sensory overload

If your child needs *instruction* — actual teaching — in social skills, communication, executive function, or self-regulation, that is specially designed instruction. That points to an IEP, regardless of report card.

Grades are evidence. They are not the whole test.

## How to Request an Evaluation

You can request an evaluation **at any time, at no cost to you.** You do not need a private diagnosis first, and you do not need the school's permission to ask.

**Put it in writing.** A verbal request in a hallway starts no clock and creates no record. An emailed request does both.

Send it to your child's principal and the school's ESE specialist or 504 coordinator. Something this simple is enough:

> I am requesting a full evaluation of my child, [name], [grade], for eligibility for Exceptional Student Education services under IDEA, and for a Section 504 plan. My concerns are: [describe specifics — communication, social interaction, sensory needs, attention, self-regulation, work completion, behavior]. Please send me the consent forms and let me know the next steps. I am requesting written confirmation of the date you received this request.

### The timeline in Florida

Once you sign **written consent** for the evaluation, Florida requires the district to complete the initial evaluation within **60 calendar days** (Florida State Board Rule 6A-6.0331).

Details that matter:

- The clock starts on the day you **sign consent** — not the day you ask. Sign promptly.
- The 60 days **exclude** school holidays, district breaks, and summer vacation, and can pause for extended student absences or school closures.
- The district and parent can agree in writing to extend by up to **30 additional calendar days**. You are not required to agree.
- The 60-day rule applies to **initial** evaluations, not reevaluations.

Section 504 evaluations have **no fixed federal timeline** — the standard is a "reasonable" period, defined by district policy. Ask your district's 504 coordinator what their published timeline is, in writing.

## If the School Offers a 504 and You Believe an IEP Is Warranted

You have options, and they escalate in this order:

1. **Ask for the data.** Request every evaluation, observation, and assessment the team relied on. Ask specifically which IDEA eligibility criteria they found were not met, and why. You are entitled to this.
2. **Get prior written notice.** If the district refuses to evaluate for ESE or finds your child ineligible, ask for the refusal **in writing**. This is required under IDEA and it forces the district to state its reasoning on the record.
3. **Bring outside evidence.** A private evaluation from a developmental pediatrician, neuropsychologist, or licensed psychologist must be *considered* by the team. It doesn't bind them, but it changes the conversation. Our [provider directory](https://floridaautismservices.com/providers) lists evaluating clinicians across all 67 counties.
4. **Request an IEE at public expense.** If you disagree with the district's evaluation, you can request an Independent Educational Evaluation paid for by the district. They must either fund it or file due process to defend their own evaluation.
5. **Use the dispute options.** Under IDEA: mediation, a state complaint to the Florida Department of Education, or a due process hearing. Under Section 504: the district's impartial hearing process or a complaint to the Office for Civil Rights.

Free help is available at every one of these steps. **[Disability Rights Florida](https://disabilityrightsflorida.org/)** is the state's federally designated protection and advocacy organization. The **[Family Network on Disabilities](https://fndusa.org/)** provides free parent training and support navigating disputes. Neither charges families.

## Can a Child Have Both?

No — and this trips people up. A student with an IEP does not also need a 504 plan, because everything a 504 plan can provide, an IEP can provide. The IEP is the more comprehensive document and it absorbs the accommodations.

What *can* happen is a transition in either direction. A child who no longer needs specially designed instruction may exit an IEP and move to a 504 to keep their accommodations. A child on a 504 whose needs grow can be evaluated for an IEP at any time. **Exiting an IEP is a change in placement** — you're entitled to prior written notice, and you can disagree.

Before agreeing to move your child off an IEP onto a 504, re-read the FES-UA section above.

## Preparing for the Meeting

- **Ask for the draft in advance.** Request the draft IEP or 504 and all evaluation reports at least a few days before you meet. Walking in cold means reacting instead of participating.
- **Bring someone.** Florida law protects your right to bring another adult to any meeting with school district personnel. A spouse, a friend, or an advocate — a second set of ears is worth more than you'd think.
- **Write your concerns down** and hand out copies. Parent concerns can be entered into the IEP itself.
- **Ask for specifics, not adjectives.** "Speech therapy as needed" is unenforceable. "Speech therapy, 30 minutes, twice weekly, in a small group" is enforceable. Frequency, duration, setting, and provider — every time.
- **Don't sign under pressure.** You can take the document home to review. You can consent to parts of a plan and not others.
- **Record decisions in writing.** After the meeting, email the team a short summary of what was agreed. If someone disagrees with your summary, you want that on the record too.

## Key Terms to Know

- **IDEA** — Individuals with Disabilities Education Act. The federal law behind IEPs.
- **Section 504** — Part of the Rehabilitation Act of 1973. The civil rights law behind 504 plans.
- **ESE** — Exceptional Student Education. Florida's term for special education.
- **FAPE** — Free Appropriate Public Education. Your child's right under both laws.
- **LRE** — Least Restrictive Environment. Children with disabilities must be educated with non-disabled peers to the maximum extent appropriate.
- **Specially Designed Instruction** — Adapting the content, methodology, or delivery of instruction. The dividing line between an IEP and a 504.
- **Prior Written Notice (PWN)** — The district's written explanation before it changes or refuses to change identification, evaluation, or placement. Your most useful paper trail.
- **IEE** — Independent Educational Evaluation. An outside evaluation you can request at district expense if you disagree with theirs.
- **Matrix of Services** — Florida's ESE funding rating (levels 251–255), completed by the IEP team.
- **FES-UA** — Family Empowerment Scholarship for Students with Unique Abilities.
- **Manifestation Determination** — The review required before disciplinary removal, to decide whether the behavior was caused by the child's disability.
- **Child Find** — The federal requirement that districts identify, locate, and evaluate children who may have disabilities.

## Tips from Parents Who've Been Through It

- **Email, don't call.** Every meaningful request should exist in writing. Timelines and enforcement both depend on dated records.
- **A diagnosis is not eligibility.** A medical autism diagnosis does not automatically produce an IEP. The school runs its own evaluation against educational criteria. Bring the diagnosis anyway — it carries weight.
- **Watch for "we don't do that here."** Services are determined by your child's individual needs, not by what a school already has on hand. If you hear that a service isn't available at your school, ask for it in writing.
- **Get the accommodations to the actual teachers.** A perfect plan nobody reads changes nothing. Ask how it will be distributed, and follow up in week three.
- **Keep one binder.** Evaluations, plans, progress reports, and every email, in date order. Parents who win disagreements are almost always the ones who kept records.
- **You can call a meeting any time.** You do not have to wait for the annual review. Put the request in writing and the district must respond.

## The Bottom Line

A 504 plan is a good tool for a child who needs the barriers removed. An IEP is the right tool for a child who needs the teaching itself to change — and it comes with real goals, real services, and real enforcement power behind them.

For Florida families, there's one extra consideration you can't afford to overlook: an IEP opens FES-UA eligibility on its own, and a 504 plan does not.

If you're unsure, request the evaluation. It's free, it starts a legal clock, and it produces data you'll be able to use no matter which direction the team goes. The worst outcome is finding out your child qualified for far more support than they were getting — three years later.
$guide$,
  updated_at = now()
WHERE slug = 'iep-vs-504-plan-guide';

-- The stub carried a 2025-10-01 created_at, which BlogPost.tsx renders as the byline
-- date. Reset to the real publication date so the guide isn't presented as year-old content.
UPDATE blog_posts
SET created_at = '2026-08-07 12:00:00+00',
    updated_at = now()
WHERE slug = 'iep-vs-504-plan-guide';
