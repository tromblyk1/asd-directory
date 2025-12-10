import React from "react";
import { Book, ExternalLink, Clock, ArrowLeft } from "lucide-react";

interface ABATherapyProps {
  onNavigate: (page: string, data?: any) => void;
}

const ABATherapy: React.FC<ABATherapyProps> = ({ onNavigate }) => {
  const sources = [
    { label: "Behavior Analyst Certification Board (BACB)", href: "https://www.bacb.com/" },
    { label: "Florida Agency for Persons with Disabilities", href: "https://apd.myflorida.com/" },
    { label: "TRICARE Autism Care Demonstration", href: "https://tricare.mil/" },
    { label: "American Speech-Language-Hearing Association", href: "https://www.asha.org/" },
    { label: "Autism Speaks – Florida Resources", href: "https://www.autismspeaks.org/" },
  ];

  const relatedArticles = [
    {
      title: "Speech Therapy for Autism",
      onClick: () => onNavigate("article", { slug: "speech-therapy-autism-expectations" }),
    },
    {
      title: "Florida Medicaid Waiver Guide",
      onClick: () => onNavigate("article", { slug: "florida-medicaid-waiver-autism-guide" }),
    },
    {
      title: "Private Insurance Coverage",
      onClick: () => onNavigate("article", { slug: "understanding-private-insurance-autism" }),
    },
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
          <span className="font-medium text-slate-500">Types of Therapy</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-700">Understanding ABA Therapy</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-12 text-white shadow-xl sm:px-10">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-green-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Types of Therapy
            </span>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Understanding ABA Therapy in Florida: A Complete Guide for Families
            </h1>
            <p className="flex items-center gap-4 text-sm font-medium text-green-100">
              <span className="inline-flex items-center gap-2">
                <Book className="h-4 w-4" />
                5 min read
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Updated October 15, 2025
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
                ABA is a science-based teaching method that breaks big goals into small steps for real-life success.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                A BCBA creates a custom plan for your child and checks progress with data every week.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Modern ABA in Florida feels like play—therapists use games, songs, and interests to teach.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Medicaid, most private insurers, and TRICARE all cover ABA therapy when requirements are met.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Practicing skills at home helps your child learn faster—parent involvement is the secret sauce.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Teens and adults benefit too, with programs for jobs, independent living, and college support.
              </li>
            </ul>
          </aside>

          <article className="space-y-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What is ABA Therapy?</h2>
              <p>
                Think of ABA (Applied Behavior Analysis) as a teaching method backed by science. It helps people with autism learn new skills and reduce behaviors that might get in the way of learning or safety. Instead of using a one-size-fits-all program, a Board Certified Behavior Analyst (BCBA) designs a plan that fits your child. They break big goals into small, doable steps, then keep track of progress with data so you can see what’s working.
              </p>
              <p>
                ABA can make a big difference in everyday life. Kids and adults use ABA strategies to build communication, play with friends, get dressed more easily, feel safer in the community, and learn in school. In Florida, many providers make sessions feel like playtime with games, songs, and activities your child already loves. Teams often include speech therapists and occupational therapists so everyone is working toward the same goals.
              </p>
              <p>
                ABA isn’t just for little kids. Teens and adults can use ABA to learn job skills, cook meals, ride the bus, or get ready for college classes. The plan changes as your child grows and as your family’s goals change. Your BCBA will always check in with you to be sure therapy matches what matters most to your family.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p>
                  Ask if the clinic offers a “pairing” period. This lets therapists learn about your child’s favorite games and snacks so sessions start off fun and friendly.
                </p>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">How Does ABA Work?</h2>
              <p>
                ABA usually begins with an assessment that lasts one to two weeks. During this time a BCBA watches your child in different places, talks with your family about goals, and uses tools to understand strengths and challenges. They also look at why certain behaviors happen so they can teach safe alternatives.
              </p>
              <p>
                Next, the BCBA writes a treatment plan filled with clear goals. You review the plan together to make sure it fits your family. Once insurance approves it, therapy begins! Registered Behavior Technicians (RBTs) work with your child at home, in a clinic, at school, or in the community. Each session includes data collection so progress is easy to see. Your BCBA checks this data often, updates the plan, and coaches you along the way.
              </p>
              <p>
                The secret to success is practice everywhere. Skills learned in therapy need to work at bedtime, at grandma’s house, and at the grocery store. Your BCBA will show you how to use strategies in daily routines and will team up with teachers, speech therapists, or doctors so everyone is on the same page. Many Florida providers now use secure apps where you can view notes, watch short videos, or message your BCBA any time you have a question.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p>
                  Ask your BCBA to share session notes or graphs each week. Seeing “wins” on paper keeps everyone motivated and helps you spot new skills to celebrate at home.
                </p>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Insurance Coverage in Florida</h2>
              <p>
                Florida has powerful laws that help families pay for ABA therapy. Whether you use Medicaid, private insurance, or TRICARE, there’s a path to coverage.
              </p>
              <p>
                <strong>Florida Medicaid</strong> covers ABA with no hour limits for kids under 21. You need an autism diagnosis and a prescription or referral. Families who have the iBudget Waiver through the Agency for Persons with Disabilities can keep ABA services during the teen and adult years too.
              </p>
              <p>
                <strong>Private insurance</strong> plans like Blue Cross Blue Shield, Aetna, UnitedHealthcare, Cigna, and Humana usually cover up to $36,000 per year. A few employer insurance plans don’t have to follow Florida’s rules, so it’s smart to ask your HR team to confirm.
              </p>
              <p>
                <strong>Military families</strong> can rely on TRICARE’s Autism Care Demonstration. It covers up to 40 hours per week with small copays, as long as you keep a referral from your primary doctor and renew approvals every six months.
              </p>
              <p>
                Even with insurance you might see deductibles, copays, or coinsurance. Ask whether your provider offers payment plans or if they know about scholarships like the Family Empowerment Scholarship (formerly Gardiner). Some nonprofits give small grants to help with therapy costs.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p>
                  Keep a binder—or a shared digital folder—with reports, prescriptions, and insurance letters. Having everything in one place makes approvals and renewals much easier.
                </p>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Finding Great Providers in Florida</h2>
              <p>
                Ready to start your search? Begin with the BACB registry to make sure the BCBA is certified. Ask your pediatrician, school ESE team, and other parents for recommendations. Don’t forget to explore the Florida Autism Services database—you can filter by location, insurance, and services.
              </p>
              <p>
                When you meet a new provider, bring a list of questions. Ask how often the BCBA will be with your child, whether you can observe sessions, and how they share progress. It’s okay to ask about staff training, background checks, and how they coordinate with other therapists. The best providers welcome your questions because they see you as part of the team.
              </p>
              <p>
                Watch for red flags like a BCBA who is rarely around, unclear goals, or staff who seem unsure what to do. If something feels off, speak up. It’s perfectly fine to get a second opinion or switch to another provider.
              </p>
              <p>
                Waitlists are common in Florida, especially in smaller towns. Get on several lists, ask about telehealth or hybrid models, and check back often. While you wait, your BCBA may give you early strategies to try at home so you feel productive and prepared.
              </p>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What to Expect</h2>
              <p>
                During the first months, therapists focus on building a strong relationship with your child. They use play to create trust and start with “quick win” goals so your child sees success early. You’ll receive regular updates that explain what skills were practiced and what comes next.
              </p>
              <p>
                Progress doesn’t always move in a straight line. Some weeks feel fast, others slower. That’s normal! Your BCBA studies the data and adjusts teaching methods to keep things moving. If challenging behaviors pop up, the team looks for the cause and teaches safer ways to communicate needs—never harsh punishments.
              </p>
              <p>
                Every six to twelve months, the BCBA reassesses skills, updates goals, and sends reports to insurance. Transition planning is part of the process too. As your child grows, the team helps them try new settings, like school classrooms, clubs, internships, or community outings, so progress continues after therapy hours decrease.
              </p>
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-900">
                <p>
                  Keep a shared notebook or digital document where therapists and family members add notes. It’s a simple way to spot patterns, remember new words, and plan next steps together.
                </p>
              </div>
            </section>

            <section className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Parent Involvement</h2>
              <p>
                Parent involvement isn’t optional—it’s the secret sauce! When families practice strategies between sessions, kids make faster progress. You’ll receive parent training where therapists model steps, practice with you, and give gentle feedback until you feel confident.
              </p>
              <p>
                The more you practice, the more natural the new skills feel. Your BCBA might provide visual schedules, favorite reward ideas, or simple data sheets. Share what works at home, tell the team about changes (like new medicines or sleep routines), and bring therapy data to school IEP meetings.
              </p>
              <p>
                Caring for yourself matters too. Florida has strong caregiver networks like Family Network on Disabilities, Parent to Parent groups, CARD centers, and APD respite programs. Connecting with other parents helps you feel supported and ready for the next challenge.
              </p>
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

          <section className="rounded-3xl bg-green-600 px-8 py-10 text-white shadow-lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Ready to Find ABA Providers Near You?</h2>
                <p className="mt-3 text-sm text-green-100">
                  Search our database of 1,900+ verified ABA providers across Florida.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("find-providers", { service: "ABA" })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-md transition hover:bg-green-100"
              >
                Search ABA Providers
              </button>
            </div>
          </section>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">Last Updated: October 15, 2025</p>
        </main>
      </div>
    </div>
  );
};

export default ABATherapy;
