import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { loadAllResources } from '@/lib/loadResource';

interface ScholarshipsIndexProps {
  onNavigate: (target: string, data?: unknown) => void;
}

type ScholarshipResource = {
  slug: string;
  category: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  [key: string]: unknown;
};

const FRIENDLY_SUMMARIES: Record<string, string> = {
  'fes-eo': 'FES-EO gives qualifying families funds to choose the school that fits their child’s learning style.',
  'fes-ua': 'FES-UA lets families pay for private school, therapies, and learning tools tailored to unique abilities.',
  ftc: 'The Florida Tax Credit Scholarship helps cover tuition or travel so students can attend the best-fit school.',
  pep: 'The PEP scholarship offers flexible dollars for home education, tutoring, and community programs.',
  hope: 'The Hope Scholarship supports students who need a fresh start in a safer, more welcoming school setting.',
};

const ScholarshipsIndex: React.FC<ScholarshipsIndexProps> = ({ onNavigate }) => {
  const [scholarships, setScholarships] = useState<ScholarshipResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadAllResources('scholarships')
      .then((items) => {
        if (isMounted) {
          setScholarships(items as ScholarshipResource[]);
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

  const summaryFor = (program: ScholarshipResource) => {
    const override = FRIENDLY_SUMMARIES[program.slug];
    if (override) {
      return override;
    }

    const source =
      program.shortDescription ??
      (typeof program.description === 'string' ? program.description : '');
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
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </button>
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          Home <span aria-hidden="true">&gt;</span> Resources <span aria-hidden="true">&gt;</span>{' '}
          <span className="text-slate-700 dark:text-slate-200">Scholarships & ESA</span>
        </nav>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Scholarships & Education Savings
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Review Florida scholarship programs and education savings accounts that fund tuition, therapies, and
              learning supports for autistic students.
            </p>
          </div>
          <div className="flex items-center justify-center self-start rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-4 text-white shadow-md">
            <GraduationCap className="h-10 w-10" />
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
          scholarships.map((program) => (
            <article
              key={program.slug}
              className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white/95 p-6 shadow transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{program.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {summaryFor(program)}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(`/resources/scholarships/${program.slug}`)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200"
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

export default ScholarshipsIndex;
