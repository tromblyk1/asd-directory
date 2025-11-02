import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { loadAllResources } from '@/lib/loadResource';

interface InsurancesIndexProps {
  onNavigate: (target: string, data?: unknown) => void;
}

type InsuranceResource = {
  slug: string;
  category: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  [key: string]: unknown;
};

const FRIENDLY_SUMMARIES: Record<string, string> = {
  medicaid: 'Medicaid is Florida’s safety net plan that covers many autism therapies with little or no cost.',
  medicare: 'Medicare supports adults with disabilities by helping pay for doctor visits, tests, and therapies.',
  aetna: 'Aetna plans often cover ABA, speech, and other autism services—just check your exact policy for details.',
  cigna: 'Cigna can help with therapy visits and evaluations; members should call for prior approval before starting care.',
  tricare: 'TRICARE serves military families and covers many autism supports when an approved provider is involved.',
  humana: 'Humana plans include medical and therapy benefits; coordinators can guide you toward in-network help.',
  'florida-blue': 'Florida Blue offers statewide provider networks and programs that support autism care and family wellness.',
  'sunshine-health': 'Sunshine Health manages Medicaid plans and helps families schedule services close to home.',
  wellcare: 'WellCare connects families with doctors, medications, and therapy benefits under Florida Medicaid and Medicare.',
  molina: 'Molina Healthcare focuses on coordinated care so families can find doctors, therapists, and helpful programs.',
  unitedhealthcare: 'UnitedHealthcare has large networks and digital tools to track approvals for autism services.',
  'florida-healthcare-plans': 'Florida Healthcare Plans offers regional coverage with dedicated care coordinators for therapy support.',
  'florida-kidcare': 'Florida KidCare gives affordable insurance options for children so they can see doctors and therapists regularly.',
  'private-pay-only': 'Private pay means families handle costs directly and can pair services with grant or scholarship help.',
};

const InsurancesIndex: React.FC<InsurancesIndexProps> = ({ onNavigate }) => {
  const [insurances, setInsurances] = useState<InsuranceResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadAllResources('insurances')
      .then((items) => {
        if (isMounted) {
          setInsurances(items as InsuranceResource[]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryFor = (plan: InsuranceResource) => {
    const override = FRIENDLY_SUMMARIES[plan.slug];
    if (override) {
      return override;
    }

    const source =
      plan.shortDescription ?? (typeof plan.description === 'string' ? plan.description : '');
    if (!source) {
      return '';
    }
    const words = source.split(/\s+/).filter(Boolean);
    const limited = words.slice(0, 22).join(' ');
    return `${limited}${words.length > 22 ? '…' : ''}`;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="rounded-3xl bg-white/95 p-8 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
        <button
          type="button"
          onClick={() => onNavigate('/resources')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-sky-300 dark:hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </button>
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          Home <span aria-hidden="true">&gt;</span> Resources <span aria-hidden="true">&gt;</span>{' '}
          <span className="text-slate-700 dark:text-slate-200">Insurance & Funding</span>
        </nav>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Insurance & Funding Options
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Compare Florida insurance plans, waivers, and funding sources that help families cover autism-related
              services.
            </p>
          </div>
          <div className="flex items-center justify-center self-start rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-blue-600 p-4 text-white shadow-md">
            <Shield className="h-10 w-10" />
          </div>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {isLoading ? (
          <article className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white/95 p-6 shadow transition dark:border-slate-800 dark:bg-slate-900/80">
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-5 h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </article>
        ) : (
          insurances.map((plan) => (
            <article
              key={plan.slug}
              className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white/95 p-6 shadow transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {summaryFor(plan)}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(`/resources/insurances/${plan.slug}`)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-sky-300 dark:hover:text-sky-200"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default InsurancesIndex;
