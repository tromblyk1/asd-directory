import React from "react";
import { Book, ExternalLink, Clock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

interface MedicaidWaiverProps {
  onNavigate: (page: string, data?: any) => void;
}

const MedicaidWaiver: React.FC<MedicaidWaiverProps> = ({ onNavigate }) => {
  const sources = [
    { label: "Florida Agency for Persons with Disabilities (APD)", href: "https://apd.myflorida.com/" },
    { label: "Florida Medicaid - myflfamilies.com", href: "https://www.myflfamilies.com/" },
    { label: "Early Steps Florida - floridahealth.gov", href: "https://www.floridahealth.gov/" },
    { label: "Family Network on Disabilities - fndfl.org", href: "https://fndfl.org/" },
    { label: "Disability Rights Florida - disabilityrightsflorida.org", href: "https://disabilityrightsflorida.org/" },
  ];

  const relatedArticles = [
    {
      title: "Understanding ABA Therapy",
      description: null,
      onClick: () => onNavigate("article", { slug: "understanding-aba-therapy-florida" }),
      disabled: false,
    },
    {
      title: "Private Insurance Coverage",
      description: "Coming Soon",
      onClick: () => {},
      disabled: true,
    },
    {
      title: "IEP vs 504 Plans",
      description: "Coming Soon",
      onClick: () => {},
      disabled: true,
    },
  ];

  const keyTakeaways = [
    "The iBudget Waiver provides funding for services beyond regular Medicaid, from respite care to supported employment.",
    "Eligibility requires an autism or developmental disability diagnosis, Florida residency, and Medicaid qualification.",
    "There is typically a multi-year waitlist, but applying early secures your spot-it's free to apply.",
    "While waiting, families can access regular Medicaid ABA therapy (no cap for kids under 21), Early Steps, and education scholarships.",
    "Once enrolled, a Waiver Support Coordinator helps you create a personalized support plan and choose approved providers.",
  ];

  return (
    <div className="bg-slate-50 pb-16 pt-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-1 font-medium text-green-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <button
            type="button"
            onClick={() => onNavigate("resources")}
            className="font-medium text-green-600 transition hover:text-green-700"
          >
            Resources
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-500">Insurance &amp; Funding</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-700">Florida Medicaid Waiver Guide</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-12 text-white shadow-xl sm:px-10">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Insurance &amp; Funding
            </span>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Florida Medicaid Waiver Guide: Getting Services for Your Child with Autism
            </h1>
            <p className="flex items-center gap-4 text-sm font-medium text-sky-100">
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
              {keyTakeaways.map((takeaway) => (
                <li key={takeaway} className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </aside>

          <article className="space-y-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What is the Florida Medicaid Waiver?</h2>
              <p>
                Think of the Medicaid Waiver as a special program that helps families get services their child needs - services that regular Medicaid might not cover or might not cover enough of.
              </p>
              <p>
                In Florida, the main waiver for people with autism and other developmental disabilities is called the{" "}
                <strong>iBudget Waiver</strong>. It&apos;s run by the Agency for Persons with Disabilities (APD).
              </p>
              <p>Here&apos;s why it matters: The waiver can pay for things like:</p>
              <ul className="ml-6 list-disc space-y-1 text-slate-700 dark:text-slate-200">
                <li>ABA therapy beyond basic coverage</li>
                <li>Respite care (a break for caregivers!)</li>
                <li>Personal care assistance</li>
                <li>Residential services</li>
                <li>Supported employment</li>
                <li>Life skills coaching</li>
                <li>Specialized therapies</li>
                <li>Adaptive equipment</li>
              </ul>
              <p>
                <strong>The best part?</strong> Once you&apos;re enrolled, you get a budget to spend on approved services that fit YOUR family&apos;s needs.
              </p>
              <p>
                <strong>The tough part?</strong> There&apos;s usually a waitlist. But don&apos;t let that stop you from applying! The sooner you get on the list, the sooner your name comes up.
              </p>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Who Qualifies for the iBudget Waiver?</h2>
              <p>To get on the waiver, your child needs to meet these requirements:</p>
              <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-semibold">Have a qualifying diagnosis:</p>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Autism Spectrum Disorder</li>
                      <li>Intellectual disability</li>
                      <li>Cerebral palsy</li>
                      <li>Spina bifida</li>
                      <li>Prader-Willi syndrome</li>
                      <li>Or another developmental disability that started before age 18</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  <p>
                    <strong>Be a Florida resident</strong> (proof required)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  <p>
                    <strong>Qualify for Medicaid</strong> (or be able to once you&apos;re on the waiver)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-500" />
                  <p>
                    <strong>Need the level of care</strong> typically provided in an institution (but you want to stay home!)
                  </p>
                </div>
              </div>
              <p>
                <strong>Good news:</strong> Most children with autism qualify! The "level of care" requirement sounds scary, but it basically means your child needs significant support with daily activities, behavior, or safety.
              </p>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">The Waitlist: What You Need to Know</h2>
              <p>
                Let&apos;s be honest - this is the hardest part. Florida&apos;s iBudget Waiver has a waitlist that can be <strong>several years long</strong>. But here&apos;s what you should know:
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Why is there a waitlist?</p>
                  <p>The state has a limited budget for the program. They can only enroll people as funding becomes available.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">How long is the wait?</p>
                  <p>It varies by region and your child&apos;s needs. Some families wait 2-3 years, others wait longer. Crisis situations may move faster.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Does it cost money to be on the waitlist?</p>
                  <p>Nope! It&apos;s completely free to apply and stay on the list.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">What happens while you wait?</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>You can access regular Medicaid services (which cover ABA therapy!)</li>
                    <li>Use Early Steps if your child is under 3</li>
                    <li>Apply for scholarships like Gardiner or McKay</li>
                    <li>Connect with county-level resources</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-4 text-sm text-indigo-900">
                <p>
                  <strong>Pro tip:</strong> Apply NOW even if you&apos;re not sure you&apos;ll need it. Your spot is based on when you applied, so getting on the list early is smart!
                </p>
              </div>
            </section>

            <section className="space-y-5 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">How to Apply: Step-by-Step</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 1: Contact APD</h3>
                  <p>
                    Call the Agency for Persons with Disabilities at <strong>(866) APD-CARES</strong> [(866) 273-2273]
                  </p>
                  <p>Or visit their website: <strong>apd.myflorida.com</strong></p>
                  <p>Tell them you want to apply for the iBudget Waiver for your child with autism.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 2: Complete the Application</h3>
                  <p>APD will send you paperwork (or you can fill it out online). You&apos;ll need:</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Your child&apos;s information:</p>
                      <ul className="ml-5 mt-2 list-disc space-y-1">
                        <li>Birth certificate</li>
                        <li>Social Security number</li>
                        <li>Proof of Florida residency (utility bill, lease, etc.)</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Medical documentation:</p>
                      <ul className="ml-5 mt-2 list-disc space-y-1">
                        <li>Autism diagnosis from a psychologist or doctor</li>
                        <li>Recent evaluation reports</li>
                        <li>List of current medications</li>
                        <li>Medical history</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Medicaid information:</p>
                      <ul className="ml-5 mt-2 list-disc space-y-1">
                        <li>If your child has Medicaid, provide the ID number</li>
                        <li>If not, APD will help you apply</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 3: Assessment</h3>
                  <p>An APD representative will schedule a time to:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Meet with your family (often at your home)</li>
                    <li>Ask questions about your child&apos;s daily needs</li>
                    <li>Review medical records</li>
                    <li>Determine eligibility</li>
                  </ul>
                  <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p>
                      <strong>This is important!</strong> Be honest about the challenges your child faces. This isn&apos;t about being negative - it&apos;s about making sure they get the right level of support.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 4: Get on the Waitlist</h3>
                  <p>Once approved, your child is added to the waitlist. You&apos;ll get a letter confirming:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Your waitlist number</li>
                    <li>The date you were added</li>
                    <li>What happens next</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 5: Stay in Touch</h3>
                  <p>
                    <strong>Critical step:</strong> APD sends annual renewal forms. If you don&apos;t return them, you could lose your spot! Set a reminder to watch for that letter.
                  </p>
                  <p>Also update APD if:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>You move</li>
                    <li>Your phone number changes</li>
                    <li>Your child&apos;s needs change significantly</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What Services Does the iBudget Cover?</h2>
              <p>Once you&apos;re enrolled (off the waitlist!), you can use your budget for:</p>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Home &amp; Family Support</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>Personal Care Assistance</strong> - Help with bathing, dressing, eating, medication
                    </li>
                    <li>
                      <strong>Respite Care</strong> - Temporary care so parents can rest, work, or handle appointments
                    </li>
                    <li>
                      <strong>In-Home Support</strong> - Someone to help your child practice life skills at home
                    </li>
                    <li>
                      <strong>Family Training</strong> - Teaching you strategies to support your child
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Therapy &amp; Development</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>ABA Therapy</strong> - Additional hours beyond what regular Medicaid covers
                    </li>
                    <li>
                      <strong>Specialized Therapies</strong> - Speech, OT, PT when needed
                    </li>
                    <li>
                      <strong>Behavior Support</strong> - BCBA consultation and planning
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Living Independently</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>Supported Living</strong> - Assistance for teens/adults who want to live on their own
                    </li>
                    <li>
                      <strong>Residential Services</strong> - Group homes or supported living arrangements
                    </li>
                    <li>
                      <strong>Environmental Modifications</strong> - Home changes for safety or accessibility
                    </li>
                    <li>
                      <strong>Adaptive Equipment</strong> - Communication devices, sensory tools, mobility aids
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Community &amp; Employment</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>Supported Employment</strong> - Job coaching and workplace support
                    </li>
                    <li>
                      <strong>Personal Supports</strong> - Help participating in community activities
                    </li>
                    <li>
                      <strong>Transportation</strong> - Getting to work, therapy, or activities
                    </li>
                  </ul>
                </div>
              </div>
              <p>
                <strong>The Budget Amount:</strong> Your iBudget amount is based on your child&apos;s needs. It can range from <strong>$15,000 to over $100,000 per year</strong> depending on the support tier.
              </p>
              <p>APD categorizes needs into tiers (Tier 1 is highest need, Tier 4 is lowest). Your budget matches your tier.</p>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">How to Use Your iBudget</h2>
              <p>Once enrolled, you&apos;ll work with a <strong>Waiver Support Coordinator</strong>-think of them as your guide!</p>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 1: Create a Support Plan</h3>
                  <p>Your coordinator helps you:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Choose which services you need</li>
                    <li>Find approved providers</li>
                    <li>Budget your funds wisely</li>
                    <li>Set goals for your child</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 2: Hire Providers</h3>
                  <p>You can hire:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>Agency providers</strong> - Companies that employ therapists and caregivers
                    </li>
                    <li>
                      <strong>Individual providers</strong> - People you hire directly (including family members in some cases!)
                    </li>
                  </ul>
                  <p>All providers must be approved by APD.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 3: Track Your Budget</h3>
                  <p>Your coordinator monitors spending. You&apos;ll get regular reports showing:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>How much of your budget you&apos;ve used</li>
                    <li>What services were provided</li>
                    <li>How much remains</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Step 4: Annual Reviews</h3>
                  <p>Every year, APD reassesses your child&apos;s needs. Your budget might:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Stay the same</li>
                    <li>Increase if needs have grown</li>
                    <li>Decrease if needs have lessened</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">While You&apos;re on the Waitlist</h2>
              <p>Don&apos;t just wait - use this time to access other supports!</p>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Regular Medicaid Services</h3>
                  <p>Florida Medicaid covers:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>ABA therapy (no annual cap for kids under 21!)</li>
                    <li>Speech therapy</li>
                    <li>Occupational therapy</li>
                    <li>Physical therapy</li>
                    <li>Doctor visits and hospitalizations</li>
                    <li>Mental health services</li>
                    <li>Prescription medications</li>
                  </ul>
                  <p>These services are available NOW while you wait for the waiver.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Early Steps (Ages 0-3)</h3>
                  <p>Florida&apos;s Early Steps program provides free:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Developmental screenings</li>
                    <li>Evaluations</li>
                    <li>Therapy services</li>
                    <li>Family support</li>
                  </ul>
                  <p>Call <strong>(800) 218-0001</strong> to get started.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Education Scholarships</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong>Gardiner Scholarship</strong> (now Family Empowerment Scholarship) - Up to $10,000+ for private school or therapy
                    </li>
                    <li>
                      <strong>McKay Scholarship</strong> - Funding for private schools for students with IEPs
                    </li>
                    <li>
                      <strong>Hope Scholarship</strong> - Additional option for students facing bullying
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">County Resources</h3>
                  <p>Many Florida counties offer:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Recreation programs for kids with disabilities</li>
                    <li>Parent support groups</li>
                    <li>Respite vouchers</li>
                    <li>Equipment lending libraries</li>
                  </ul>
                  <p>Check with your county&apos;s Parks &amp; Recreation or Human Services department.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Common Questions</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">Can my child have both regular Medicaid AND the waiver?</dt>
                  <dd>Yes! The waiver is an addition to regular Medicaid, not a replacement.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">What if my child doesn&apos;t have Medicaid?</dt>
                  <dd>APD can help you apply. Many families qualify through special Medicaid pathways for people with disabilities.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">Can we hire family members as caregivers?</dt>
                  <dd>Sometimes! It depends on the service and your situation. Ask your waiver coordinator.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">What if we move to a different county in Florida?</dt>
                  <dd>Your waiver follows you! Just notify APD of your new address.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">Can adults get the waiver?</dt>
                  <dd>Yes! The iBudget serves people of all ages, not just children.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">What happens when my child turns 18?</dt>
                  <dd>Services continue! You&apos;ll just need to address guardianship or supported decision-making if needed.</dd>
                </div>
              </dl>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Red Flags &amp; How to Advocate</h2>
              <p>
                <strong>Warning signs something&apos;s wrong:</strong>
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
                  Your coordinator never responds
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
                  Services aren&apos;t being provided as planned
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
                  Your budget doesn&apos;t match your child&apos;s needs
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
                  Providers are unreliable or unprofessional
                </li>
              </ul>
              <p>
                <strong>What to do:</strong>
              </p>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Document everything in writing</li>
                <li>Contact your coordinator&apos;s supervisor</li>
                <li>File a complaint with APD: <strong>(866) APD-CARES</strong></li>
                <li>
                  Reach out to:
                  <ul className="ml-6 mt-1 list-disc space-y-1">
                    <li>
                      <strong>Family Network on Disabilities:</strong> (800) 825-5736
                    </li>
                    <li>
                      <strong>Disability Rights Florida:</strong> (800) 342-0823
                    </li>
                  </ul>
                </li>
              </ol>
              <p>You have rights! Don&apos;t be afraid to speak up.</p>
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
                  disabled={article.disabled}
                  className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-left text-sm font-semibold text-slate-700 transition hover:border-green-500 hover:bg-green-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-green-400 dark:hover:bg-slate-700 ${
                    article.disabled ? "cursor-not-allowed opacity-60 hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800" : ""
                  }`}
                >
                  <span>{article.title}</span>
                  {article.description && (
                    <p className="mt-2 text-xs font-normal text-slate-500 dark:text-slate-400">{article.description}</p>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-10 text-white shadow-lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Need Help with Your Application?</h2>
                <p className="mt-3 text-sm text-purple-100">
                  Connect with Florida parent support organizations for FREE assistance with waiver applications and advocacy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("find-providers")}
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
