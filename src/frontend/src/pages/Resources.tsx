import React, { useMemo, useState } from 'react';
import { Book, Search, Clock, Tag, ChevronRight } from 'lucide-react';

type ResourceCategory =
  | 'all'
  | 'therapy'
  | 'insurance'
  | 'education'
  | 'early-intervention'
  | 'parent-support'
  | 'legal-rights'
  | 'daily-living'
  | 'transition-adulthood';

type ResourceArticle = {
  title: string;
  category: ResourceCategory;
  slug: string;
  excerpt: string;
  readTime: string;
  lastUpdated: string;
  keywords: string[];
};

const CATEGORY_OPTIONS: Array<{ key: ResourceCategory; label: string }> = [
  { key: 'all', label: 'All Resources' },
  { key: 'therapy', label: 'Types of Therapy' },
  { key: 'insurance', label: 'Insurance & Funding' },
  { key: 'education', label: 'Education & IEP' },
  { key: 'early-intervention', label: 'Early Intervention' },
  { key: 'parent-support', label: 'Parent Support' },
  { key: 'legal-rights', label: 'Legal Rights' },
  { key: 'daily-living', label: 'Daily Living' },
  { key: 'transition-adulthood', label: 'Transition to Adulthood' },
];

const ARTICLES: ResourceArticle[] = [
  {
    title: 'Understanding ABA Therapy in Florida',
    category: 'therapy',
    slug: 'understanding-aba-therapy-florida',
    excerpt:
      'Learn about Applied Behavior Analysis, insurance coverage, and finding qualified providers in Florida.',
    readTime: '5 min',
    lastUpdated: '2025-10-15',
    keywords: ['ABA therapy', 'autism treatment', 'BCBA'],
  },
  {
    title: 'Florida Medicaid Waiver Guide for Autism Services',
    category: 'insurance',
    slug: 'florida-medicaid-waiver-autism-guide',
    excerpt: 'Step-by-step guide to applying for the iBudget Waiver and accessing covered services.',
    readTime: '7 min',
    lastUpdated: '2025-10-18',
    keywords: ['Medicaid waiver', 'iBudget', 'APD'],
  },
  {
    title: 'IEP vs 504 Plan: Which Does Your Child Need?',
    category: 'education',
    slug: 'iep-vs-504-plan-comparison',
    excerpt: 'Understand the differences and determine the best educational support for your child.',
    readTime: '7 min',
    lastUpdated: '2025-10-14',
    keywords: ['IEP', '504 plan', 'special education'],
  },
  {
    title: 'Speech Therapy for Autism: What to Expect',
    category: 'therapy',
    slug: 'speech-therapy-autism-expectations',
    excerpt:
      'Comprehensive guide to speech-language therapy services, goals, and coverage options.',
    readTime: '6 min',
    lastUpdated: '2025-10-12',
    keywords: ['speech therapy', 'communication', 'SLP'],
  },
];

interface ResourcesProps {
  onNavigate: (page: string, data?: any) => void;
}

const Resources: React.FC<ResourcesProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      if (!matchesCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        article.title,
        article.excerpt,
        article.readTime,
        article.lastUpdated,
        ...article.keywords,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-green-100 via-blue-50 to-green-100 p-8 shadow-sm dark:from-green-900/10 dark:via-slate-900 dark:to-green-900/10">
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
              Explore vetted resources on therapies, insurance, school services, and everyday
              supports for autistic children, teens, and adults across Florida.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map(({ key, label }) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-green-50 hover:text-green-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-green-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by topic, keyword, or question..."
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-green-400 dark:focus:ring-green-500/40"
            />
          </div>
        </div>
      </header>

      {filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            No articles match your filters
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search term or choosing a different category to discover additional
            resources.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <Tag className="h-3.5 w-3.5" />
                {CATEGORY_OPTIONS.find((option) => option.key === article.category)?.label ??
                  'Resource'}
              </span>

              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {article.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">
                {article.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-blue-500 dark:text-blue-300">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock className="h-4 w-4" />
                  {article.readTime} read
                </span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Book className="h-4 w-4" />
                  Updated {new Date(article.lastUpdated).toLocaleDateString()}
                </span>
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
                    onNavigate('article', { slug: article.slug, category: article.category })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
                >
                  Read Article
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;

