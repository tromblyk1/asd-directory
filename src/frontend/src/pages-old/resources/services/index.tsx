import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react';
import { loadAllResources } from '@/lib/loadResource';

interface ServicesIndexProps {
  onNavigate: (target: string, data?: unknown) => void;
}

type ServiceResource = {
  slug: string;
  category: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  [key: string]: unknown;
};

const FRIENDLY_SUMMARIES: Record<string, string> = {
  'aba-therapy': 'ABA therapy teaches small, step-by-step skills that help kids learn good habits and cut tricky behaviors.',
  'speech-therapy': 'Speech therapy builds clear words and social talking so kids can share what they need with others.',
  'occupational-therapy': 'Occupational therapy practices everyday tasks like writing, dressing, and staying calm during busy moments.',
  'physical-therapy': 'Physical therapy strengthens muscles and balance so moving, playing, and staying active feels easier.',
  'feeding-therapy': 'Feeding therapy helps kids try new foods safely and enjoy mealtimes with less stress.',
  'music-therapy': 'Music therapy uses songs and instruments to boost attention, mood, and communication.',
  inpp: 'INPP exercises calm leftover reflexes so kids can focus, balance, and learn more easily.',
  aac: 'AAC services teach tools like picture boards or talker devices so everyone has a voice.',
  'aac-speech': 'AAC services teach tools like picture boards or talker devices so everyone has a voice.',
  'dir-floortime': 'DIR/Floortime follows the child’s interests to grow connection, pretend play, and problem-solving.',
  'respite-care': 'Respite care gives caregivers a trusted break while children enjoy safe, supportive attention.',
  'life-skills': 'Life skills coaching practices cooking, cleaning, and other daily routines for greater independence.',
  'life-skills-daily-living': 'Life skills coaching practices cooking, cleaning, and other daily routines for greater independence.',
  'residential-program': 'Residential programs provide 24/7 support in homes that teach healthy habits and community life.',
  'support-groups': 'Support groups gather peers and families to share tips, stories, and encouragement.',
  'pet-therapy': 'Pet therapy pairs friendly animals with kids to lower stress and practice gentle social skills.',
  'faith-based': 'Faith-based support offers welcoming worship, sensory breaks, and caring volunteers for every family.',
  'faith-based-support': 'Faith-based support offers welcoming worship, sensory breaks, and caring volunteers for every family.',
  'virtual-therapy': 'Virtual therapy brings your therapist to a screen, making care easier to fit into busy days.',
  'ados-testing': 'ADOS testing is a trusted play-based evaluation that checks for signs of autism.',
  'pharmacogenetic-testing': 'Pharmacogenetic testing looks at genes to help doctors choose medicine that works best with fewer side effects.',
  'autism-travel': 'Autism travel planners set up calm, sensory-friendly trips so families can explore with confidence.',
  'mobile-services': 'Mobile services send therapists to homes, schools, or community spots for real-world practice.',
  'executive-function-coaching': 'Executive function coaching teaches simple routines for planning, organizing, and staying on track.',
  'parent-coaching': 'Parent coaching gives caregivers quick tools and steady support to use therapy ideas at home.',
  tutoring: 'Specialized tutoring adjusts schoolwork so students understand lessons and feel proud of progress.',
  'group-therapy': 'Group therapy lets kids practice teamwork, sharing, and coping skills with friendly peers.',
};

const ServicesIndex: React.FC<ServicesIndexProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadAllResources('services')
      .then((items) => {
        if (isMounted) {
          setServices(items as ServiceResource[]);
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

  const summaryFor = (service: ServiceResource) => {
    const override = FRIENDLY_SUMMARIES[service.slug];
    if (override) {
      return override;
    }

    const source =
      service.shortDescription ??
      (typeof service.description === 'string' ? service.description : '');
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
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </button>
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          Home <span aria-hidden="true">&gt;</span> Resources <span aria-hidden="true">&gt;</span>{' '}
          <span className="text-slate-700 dark:text-slate-200">Services</span>
        </nav>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Services &amp; Therapies Directory
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Understand the full range of therapeutic services, supports, and programs available to autistic
              individuals throughout Florida.
            </p>
          </div>
          <div className="flex items-center justify-center self-start rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 p-4 text-white shadow-md">
            <ListChecks className="h-10 w-10" />
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
          services.map((service) => (
            <article
              key={service.slug}
              className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white/95 p-6 shadow transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{service.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {summaryFor(service)}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(`/resources/services/${service.slug}`)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
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

export default ServicesIndex;
