import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { loadResource } from '@/lib/loadResource';
import validLinksMap from '@/data/resources/validLinks.json';

interface ServiceDetailProps {
  onNavigate: (target: string, data?: unknown) => void;
  slug?: string;
}

interface ResourceDetailLink {
  label?: string;
  url?: string;
  description?: string;
}

interface ResourceDetail {
  slug: string;
  category: string;
  title?: string;
  description?: string;
  links?: ResourceDetailLink[];
}

type ValidLinksMap = Record<string, ResourceDetailLink[]>;

const VALID_LINKS = validLinksMap as ValidLinksMap;

const extractSlugFromPath = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length >= 3 && segments[0] === 'resources' && segments[1] === 'services') {
    return segments[2];
  }
  return undefined;
};

const splitDescriptionIntoParagraphs = (text?: string): string[] => {
  if (!text) {
    return [];
  }

  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return [];
  }

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const uniqueSentences: string[] = [];
  const seen = new Set<string>();
  sentences.forEach((sentence) => {
    const key = sentence.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSentences.push(sentence);
    }
  });

  const paragraphs: string[] = [];
  const MAX_SENTENCES = 2;
  for (let index = 0; index < uniqueSentences.length; index += MAX_SENTENCES) {
    paragraphs.push(uniqueSentences.slice(index, index + MAX_SENTENCES).join(' '));
  }

  return paragraphs;
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ onNavigate, slug: initialSlug }) => {
  const slug = initialSlug ?? useMemo(extractSlugFromPath, [initialSlug]);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const targetSlug = slug ?? extractSlugFromPath();

    if (!targetSlug) {
      setResource(null);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    loadResource('services', targetSlug)
      .then((data) => {
        if (isMounted) {
          setResource((data as ResourceDetail) ?? null);
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
  }, [slug]);

  const paragraphs = useMemo(
    () => splitDescriptionIntoParagraphs(resource?.description),
    [resource?.description],
  );

  const linkKey = slug ? `services/${slug}` : undefined;
  const validLinks = useMemo(() => {
    if (!linkKey) {
      return [];
    }
    return VALID_LINKS[linkKey] ?? [];
  }, [linkKey]);

  const isValidService = resource && resource.category === 'services';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-10 text-center shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
        <div className="mx-auto h-8 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!isValidService) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-10 text-center shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-200">
          <Info className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Content coming soon.</h1>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/resources/services')}
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-teal-700"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="rounded-3xl bg-white/95 p-8 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
        <button
          type="button"
          onClick={() => onNavigate('/resources/services')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          Home <span aria-hidden="true">&gt;</span> Resources <span aria-hidden="true">&gt;</span> Services{' '}
          <span aria-hidden="true">&gt;</span>{' '}
          <span className="text-slate-700 dark:text-slate-200">{resource.title}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {resource.title}
        </h1>
      </header>

      <div className="rounded-3xl bg-white/95 p-8 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-600 dark:text-teal-300">What to Expect</p>
        <div className="mt-3 space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
          {paragraphs.length ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Content coming soon.</p>}
        </div>

        {validLinks.length ? (
          <div className="mt-8 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm dark:border-teal-900/60 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-200">Learn More</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {validLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-teal-700 underline-offset-2 hover:underline dark:text-teal-200"
                  >
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="font-semibold">{link.label ?? link.url}</span>
                      {link.description ? (
                        <span className="block text-slate-600 dark:text-slate-300">{link.description}</span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default ServiceDetail;
