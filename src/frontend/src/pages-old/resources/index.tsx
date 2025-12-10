import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Book,
  ChevronRight,
  Clock,
  GraduationCap,
  Search,
  ShieldCheck,
  Stethoscope,
  Tag,
} from 'lucide-react';
import { loadAllResources } from '@/lib/loadResource';
import {
  RESOURCE_ARTICLES,
  type ResourceArticle,
} from '@/data/resourceArticles';

interface ResourcesLandingProps {
  onNavigate: (target: string, data?: unknown) => void;
}

const CATEGORY_CARDS: Array<{
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}> = [
  {
    title: 'Therapies & Services',
    description:
      'Explore evidence-based therapies, clinical supports, and community programs tailored to autistic individuals.',
    icon: <Stethoscope className="h-6 w-6" />,
    href: '/resources/services',
  },
  {
    title: 'Insurance & Funding',
    description:
      'Understand Florida insurance plans, waivers, and funding sources that help cover autism services.',
    icon: <ShieldCheck className="h-6 w-6" />,
    href: '/resources/insurances',
  },
  {
    title: 'Scholarships & ESA Programs',
    description:
      'Learn about scholarships and education savings accounts that support specialized schooling and therapies.',
    icon: <GraduationCap className="h-6 w-6" />,
    href: '/resources/scholarships',
  },
];

const ResourcesLanding: React.FC<ResourcesLandingProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resourcesState, setResourcesState] = useState<{
    items: Array<{
      slug: string;
      title?: string;
      description?: string;
      shortDescription?: string;
      category: 'services' | 'insurances' | 'scholarships';
    }>;
    loaded: boolean;
  }>({ items: [], loaded: false });

  useEffect(() => {
    if (resourcesState.loaded) {
      return;
    }

    let cancelled = false;

    Promise.all([
      loadAllResources('services'),
      loadAllResources('insurances'),
      loadAllResources('scholarships'),
    ]).then(([services, insurances, scholarships]) => {
      if (cancelled) {
        return;
      }

      setResourcesState({
        loaded: true,
        items: [
          ...(services as typeof services).map((item) => ({ ...item, category: 'services' })),
          ...(insurances as typeof insurances).map((item) => ({ ...item, category: 'insurances' })),
          ...(scholarships as typeof scholarships).map((item) => ({ ...item, category: 'scholarships' })),
        ],
      });
    });

    return () => {
      cancelled = true;
    };
  }, [resourcesState.loaded]);

  const filteredArticles = useMemo(() => {
    const articles: ResourceArticle[] = RESOURCE_ARTICLES;
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return articles;
    }

    return articles.filter((article) => {
      const haystack = [article.title, article.excerpt, ...article.keywords].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm]);

  const resourceMatches = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return resourcesState.items.filter((item) => {
      const haystack = [
        item.title,
        item.shortDescription,
        item.description,
        item.slug,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [resourcesState.items, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 rounded-3xl bg-gradient-to-r from-green-100 via-blue-50 to-green-100 p-6 shadow-sm dark:from-green-900/10 dark:via-slate-900 dark:to-green-900/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-green-600 p-4 text-white shadow-md">
              <Book className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                Resource Hub
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
                Guides, Funding Help, and Support for Florida Families
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Explore vetted resources on therapies, insurance, school services, and everyday supports for autistic
                children, teens, and adults across Florida.
              </p>
            </div>
          </div>
          <div className="relative w-full shrink-0 rounded-xl bg-white/80 p-2 shadow-sm backdrop-blur sm:w-[22rem] dark:bg-slate-900/60">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-full border border-transparent bg-transparent py-2 pl-10 pr-4 text-sm text-slate-700 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200 dark:text-slate-100 dark:focus:border-green-500 dark:focus:ring-green-500/40"
            />
          </div>
        </div>
      </header>

      <section aria-labelledby="resource-categories" className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <h2 id="resource-categories" className="sr-only">
          Resource Categories
        </h2>
        {CATEGORY_CARDS.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="relative flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {card.icon}
                  {card.title}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/40 to-transparent text-slate-700 shadow-sm dark:text-slate-200">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.description}</p>
              <button
                type="button"
                onClick={() => onNavigate(card.href)}
                className="mt-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
              >
                Explore {card.title}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      {searchTerm.trim() ? (
        <section className="mb-12 rounded-3xl bg-white/95 p-8 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Search Results</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Showing matches for <strong>{`“${searchTerm.trim()}”`}</strong>.
          </p>

          {resourceMatches.length === 0 && filteredArticles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No matches found</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Try different keywords or check spelling.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-8">
              {resourceMatches.length ? (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resources</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {resourceMatches.map((resource) => {
                      const description =
                        resource.shortDescription ??
                        (resource.description as string | undefined) ??
                        '';
                      const categoryLabel =
                        resource.category === 'services'
                          ? 'Therapies & Services'
                          : resource.category === 'insurances'
                          ? 'Insurance & Funding'
                          : 'Scholarships & ESA';

                      return (
                        <article
                          key={`${resource.category}-${resource.slug}`}
                          className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                        >
                          <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {categoryLabel}
                          </span>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{resource.title}</h4>
                          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
                          <button
                            type="button"
                            onClick={() => onNavigate(`/resources/${resource.category}/${resource.slug}`)}
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700 dark:text-green-300 dark:hover:text-green-200"
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {filteredArticles.length ? (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Guides</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredArticles.map((article) => (
                      <article
                        key={article.slug}
                        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                      >
                        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <Tag className="h-3.5 w-3.5" />
                          {article.category === 'therapy'
                            ? 'Therapy'
                            : article.category === 'insurance'
                            ? 'Insurance & Funding'
                            : 'Education & IEP'}
                        </span>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{article.title}</h2>
                        <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-blue-500 dark:text-blue-300">
                          {article.comingSoon ? (
                            <span className="inline-flex items-center gap-1 font-semibold uppercase text-yellow-600 dark:text-yellow-300">
                              Coming Soon
                            </span>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Clock className="h-4 w-4" />
                                Quick read
                              </span>
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Book className="h-4 w-4" />
                                Updated regularly
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {article.keywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500 dark:bg-blue-500/10 dark:text-blue-300"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() =>
                              article.comingSoon
                                ? window.alert('This guide is coming soon. Please check back shortly!')
                                : onNavigate('article', { slug: article.slug, category: article.category })
                            }
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                              article.comingSoon ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                            disabled={article.comingSoon}
                          >
                            {article.comingSoon ? 'Coming Soon' : 'Read Guide'}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      ) : (
        <section>
          <h2 className="sr-only">Featured Guides & Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {RESOURCE_ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <Tag className="h-3.5 w-3.5" />
                  {article.category === 'therapy'
                    ? 'Therapy'
                    : article.category === 'insurance'
                    ? 'Insurance & Funding'
                    : 'Education & IEP'}
                </span>

                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{article.title}</h2>
                <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-blue-500 dark:text-blue-300">
                  {article.comingSoon ? (
                    <span className="inline-flex items-center gap-1 font-semibold uppercase text-yellow-600 dark:text-yellow-300">
                      Coming Soon
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Clock className="h-4 w-4" />
                        Quick read
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Book className="h-4 w-4" />
                        Updated regularly
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500 dark:bg-blue-500/10 dark:text-blue-300"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      article.comingSoon
                        ? window.alert('This guide is coming soon. Please check back shortly!')
                        : onNavigate('article', { slug: article.slug, category: article.category })
                    }
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
                      article.comingSoon ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={article.comingSoon}
                  >
                    {article.comingSoon ? 'Coming Soon' : 'Read Guide'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResourcesLanding;
