import React from 'react';
import { Book, ExternalLink, Clock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface MedicaidWaiverProps {
  onNavigate: (page: string, data?: any) => void;
}

const MedicaidWaiver: React.FC<MedicaidWaiverProps> = ({ onNavigate }) => {
  const sources = [
    { label: 'Florida Agency for Persons with Disabilities (APD)', href: 'https://apd.myflorida.com/' },
    { label: 'Florida Medicaid', href: 'https://www.myflfamilies.com/' },
    { label: 'Early Steps Florida', href: 'https://www.floridahealth.gov/' },
    { label: 'Family Network on Disabilities', href: 'https://fndfl.org/' },
    { label: 'Disability Rights Florida', href: 'https://disabilityrightsflorida.org/' },
  ];

  const relatedArticles = [
    {
      title: 'Understanding ABA Therapy',
      onClick: () => onNavigate('article', { slug: 'understanding-aba-therapy-florida' }),
    },
    {
      title: 'Private Insurance Coverage',
      onClick: () => onNavigate('article', { slug: 'understanding-private-insurance-autism' }),
    },
    {
      title: 'IEP vs 504 Plans',
      onClick: () => onNavigate('article', { slug: 'iep-vs-504-plan-comparison' }),
    },
  ];

  return (
    <div className="bg-slate-50 pb-16 pt-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1 font-medium text-green-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="font-medium text-green-600 transition hover:text-green-700"
          >
            Resources
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-500">Insurance &amp; Funding</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-700">
            Florida Medicaid Waiver Guide
          </span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-12 text-white shadow-xl sm:px-10">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-green-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Insurance &amp; Funding
            </span>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Florida Medicaid Waiver Guide: Getting Services for Your Child with Autism
            </h1>
            <p className="flex items-center gap-4 text-sm font-medium text-green-100">
              <span className="inline-flex items-center gap-2">
                <Book className="h-4 w-4" />
                7 min read
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Updated October 18, 2025
              </span>
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl space-y-12">
          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-amber-800">Key Takeaways</h2>
            <ul className="grid gap-3 text-sm text-amber-900 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                The iBudget Waiver provides funding for services beyond regular Medicaid, from respite care to supported employment.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Eligibility requires an autism or developmental disability diagnosis, Florida residency, and Medicaid qualification.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                There is typically a multi-year waitlist, but applying early secures your spot - it is free to apply.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                While waiting, families can access Medicaid ABA therapy (no cap under age 21), Early Steps, and education scholarships.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Once enrolled, a Waiver Support Coordinator helps you create a personalized plan and choose approved providers.
              </li>
            </ul>
          </aside>

          <article className="space-y-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                What is the Florida Medicaid Waiver?
              </h2>
              <p>
                Think of the Medicaid Waiver as a special program that helps families get services their child needs. These are services that regular Medicaid might not cover or might not cover enough of. In Florida, the main waiver for people with autism and other developmental disabilities is called the <strong>iBudget Waiver</strong>. It is run by the Agency for Persons with Disabilities (APD).
              </p>
              <p>Here is why it matters: the waiver can pay for things like:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>ABA therapy beyond basic coverage</li>
                <li>Respite care (a break for caregivers)</li>
                <li>Personal care assistance</li>
                <li>Residential services</li>
                <li>Supported employment</li>
                <li>Life skills coaching</li>
                <li>Specialized therapies</li>
                <li>Adaptive equipment</li>
              </ul>
              <p>
                <strong>The best part:</strong> once you are enrolled, you receive a budget to spend on approved services that fit your family. <strong>The tough part:</strong> there is usually a waitlist. Apply anyway - the sooner you get on the list, the sooner your name moves up.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                  Apply even if you are unsure. Your place in line is based on the date you apply, so getting started today is the smartest move.
                </p>
              </div>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Who Qualifies for the iBudget Waiver?
              </h2>
              <p>To qualify for the waiver, your child needs to meet these requirements:</p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-green-600" />
                  <span>
                    <strong>Have a qualifying diagnosis:</strong> autism spectrum disorder, intellectual disability, cerebral palsy, spina bifida, Prader-Willi syndrome, or another developmental disability that started before age 18.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-green-600" />
                  <span>
                    <strong>Be a Florida resident.</strong> Provide proof such as a utility bill, lease, or state ID.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-green-600" />
                  <span>
                    <strong>Qualify for Medicaid</strong> or meet the criteria to qualify once you are on the waiver.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-green-600" />
                  <span>
                    <strong>Need a high level of care</strong> similar to what an institution would provide, so you can keep services at home instead.
                  </span>
                </li>
              </ul>
              <p>
                <strong>Good news:</strong> most children with autism meet these criteria. The "level of care" requirement simply proves that your child needs significant support with daily activities, behavior, or safety.
              </p>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">The Waitlist: What You Need to Know</h2>
              <p>
                Florida's iBudget Waiver has a waitlist that can be several years long. Understanding the process helps you plan ahead.
              </p>
              <p>
                <strong>Why is there a waitlist?</strong> The state has a limited budget and can only enroll people as funding becomes available.
              </p>
              <p>
                <strong>How long is the wait?</strong> It depends on your region and your child's needs. Some families wait two to three years, others longer. Crisis situations may move faster.
              </p>
              <p>
                <strong>Does it cost money to be on the waitlist?</strong> No. It is completely free to apply and remain on the list.
              </p>
              <p>While you wait, your family can still:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Use regular Medicaid services, including ABA therapy</li>
                <li>Enroll in Early Steps if your child is under three</li>
                <li>Apply for scholarships like Family Empowerment (Gardiner) or McKay</li>
                <li>Connect with county recreation, respite, and support programs</li>
              </ul>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                  Watch for waitlist letters from APD. If you miss a renewal form, you could lose your spot, so set a reminder to respond quickly.
                </p>
              </div>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">How to Apply: Step-by-Step</h2>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 1: Contact APD</h3>
              <p>
                Call the Agency for Persons with Disabilities at <strong>(866) APD-CARES</strong> (866-273-2273) or visit <strong>apd.myflorida.com</strong>. Let them know you are applying for the iBudget Waiver for your child with autism.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 2: Complete the Application</h3>
              <p>APD will send paperwork or provide an online form. Gather:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li><strong>Your child's information:</strong> birth certificate, Social Security number, proof of Florida residency.</li>
                <li><strong>Medical documentation:</strong> autism diagnosis, recent evaluations, medication list, and medical history.</li>
                <li><strong>Medicaid information:</strong> your child's Medicaid ID number, or ask APD for help applying.</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 3: Assessment</h3>
              <p>
                An APD representative will meet with your family (often at home), review records, and ask about daily routines. Be honest about the difficult moments so your child receives the correct level of support.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 4: Get on the Waitlist</h3>
              <p>
                Once approved, your child is added to the waitlist. You receive a letter with your waitlist number, the date you were added, and what to expect next.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 5: Stay in Touch</h3>
              <p>
                APD mails yearly renewal forms. Return them right away and update APD if you move, change phone numbers, or your child's needs change.
              </p>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What Services Does the iBudget Cover?</h2>
              <p>
                Once you are enrolled, the iBudget gives your family flexibility. You can use the funds for home supports, therapies, independent living, and community participation.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Home &amp; Family Support</h3>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Personal care assistance for bathing, dressing, eating, and medication</li>
                <li>Respite care so caregivers can rest or attend appointments</li>
                <li>In-home support to practice daily living skills</li>
                <li>Family training to learn helpful strategies</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Therapy &amp; Development</h3>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Extra ABA therapy hours beyond regular Medicaid</li>
                <li>Specialized therapies like speech, occupational, and physical therapy</li>
                <li>Behavior support from board-certified behavior analysts</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Living Independently</h3>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Supported living coaches for teens and adults</li>
                <li>Residential services such as group homes</li>
                <li>Environmental modifications for safety and accessibility</li>
                <li>Adaptive equipment like communication devices or mobility supports</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Community &amp; Employment</h3>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Supported employment with job coaching</li>
                <li>Personal supports to join community activities</li>
                <li>Transportation to work, therapy, or programs</li>
              </ul>
              <p>
                Budget amounts range from <strong>,000 to over ,000 per year</strong> depending on need. APD places people into tiers. Tier 1 is the highest level of need and Tier 4 is the lowest, and your budget matches your tier.
              </p>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">How to Use Your iBudget</h2>
              <p>
                Once you are enrolled, you will work with a <strong>Waiver Support Coordinator</strong>. Think of this person as your guide through every step.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 1: Create a Support Plan</h3>
              <p>
                Your coordinator helps you choose services, find providers, set goals, and plan how to use your budget wisely.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 2: Hire Providers</h3>
              <p>
                You can work with agencies or hire individuals, including some relatives. All providers must be approved by APD.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 3: Track Your Budget</h3>
              <p>
                Your coordinator provides regular reports so you always know which services were used and how much money remains.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Step 4: Annual Reviews</h3>
              <p>
                APD reviews your child's needs each year. Budgets can stay the same, increase, or decrease depending on what has changed.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                  Keep copies of service plans, budget summaries, and provider notes. Organized records make renewals and appeals easy.
                </p>
              </div>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">While You're on the Waitlist</h2>
              <p>
                Do not wait quietly. Take advantage of other supports right now.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Regular Medicaid Services</h3>
              <p>
                Florida Medicaid covers ABA therapy (no annual cap for kids under age 21), speech therapy, occupational therapy, physical therapy, medical visits, mental health services, and prescriptions.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Early Steps (Ages 0-3)</h3>
              <p>
                Early Steps provides developmental screenings, evaluations, therapies, and family support. Call <strong>(800) 218-0001</strong> to get started.
              </p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Education Scholarships</h3>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Family Empowerment Scholarship (Gardiner) for private school or therapies</li>
                <li>McKay Scholarship for private schools with IEP supports</li>
                <li>Hope Scholarship for students experiencing bullying</li>
              </ul>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">County Resources</h3>
              <p>
                Many counties offer recreation programs, parent support groups, respite vouchers, and equipment lending libraries. Check with your county's parks or human services department.
              </p>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Common Questions</h2>
              <p>
                <strong>Can my child have both regular Medicaid and the waiver?</strong> Yes. The waiver adds services on top of regular Medicaid.
              </p>
              <p>
                <strong>What if my child does not have Medicaid yet?</strong> APD can help you apply through special disability-based pathways.
              </p>
              <p>
                <strong>Can we hire family members as caregivers?</strong> Sometimes. It depends on the service and your situation. Ask your coordinator for details.
              </p>
              <p>
                <strong>What if we move to another county?</strong> Your waiver follows you, but you must update APD with your new address.
              </p>
              <p>
                <strong>Does the waiver end when my child turns 18?</strong> No. The iBudget serves people of all ages. You may need to plan for guardianship or supported decision-making.
              </p>
            </section>
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Red Flags &amp; How to Advocate</h2>
              <p>Keep an eye out for these warning signs:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Coordinators who rarely respond or do not return calls</li>
                <li>Services that are not delivered as promised</li>
                <li>Budgets that no longer match your child's needs and cannot be explained</li>
                <li>Providers who are unreliable or unprofessional</li>
              </ul>
              <p>If something feels wrong, speak up:</p>
              <ol className="list-decimal space-y-2 pl-6 text-slate-700 dark:text-slate-200">
                <li>Document everything in writing.</li>
                <li>Contact your coordinator's supervisor.</li>
                <li>File a complaint with APD at <strong>(866) APD-CARES</strong>.</li>
                <li>Reach out for backup:
                  <ul className="mt-1 list-disc space-y-1 pl-6">
                    <li>Family Network on Disabilities: <strong>(800) 825-5736</strong></li>
                    <li>Disability Rights Florida: <strong>(800) 342-0823</strong></li>
                  </ul>
                </li>
              </ol>
              <p>You have rights. Florida has strong advocacy organizations ready to stand beside you.</p>
            </section>
          </article>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sources</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Related Articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((article) => (
                <button
                  key={article.title}
                  type="button"
                  onClick={article.onClick}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-left text-sm font-semibold text-slate-700 transition hover:border-green-500 hover:bg-green-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-green-400 dark:hover:bg-slate-700"
                >
                  {article.title}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-10 text-white shadow-lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Need Help with Your Application?</h2>
                <p className="mt-3 text-sm text-purple-100">
                  Connect with Florida parent support organizations for free assistance with waiver applications and advocacy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('find-providers')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-700 shadow-md transition hover:bg-purple-100"
              >
                Find Support Organizations
              </button>
            </div>
          </section>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">Last Updated: October 18, 2025</p>
        </main>
      </div>
    </div>
  );
};

export default MedicaidWaiver;
