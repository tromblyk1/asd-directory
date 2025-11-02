export type ResourceArticleCategory = 'therapy' | 'insurance' | 'education';

export interface ResourceArticle {
  title: string;
  category: ResourceArticleCategory;
  slug: string;
  excerpt: string;
  keywords: string[];
  comingSoon?: boolean;
}

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    title: 'Understanding ABA Therapy in Florida',
    category: 'therapy',
    slug: 'understanding-aba-therapy-florida',
    excerpt: 'Learn how ABA works, what it covers, and how to find providers across Florida.',
    keywords: ['ABA therapy', 'autism treatment', 'behavior support'],
  },
  {
    title: 'Florida Medicaid Waiver Guide for Autism Services',
    category: 'insurance',
    slug: 'florida-medicaid-waiver-autism-guide',
    excerpt: 'Step-by-step help for applying to the iBudget Waiver and using benefits wisely.',
    keywords: ['Medicaid waiver', 'iBudget', 'APD'],
  },
  {
    title: 'IEP vs 504 Plan: Which Does Your Child Need?',
    category: 'education',
    slug: 'iep-vs-504-plan-comparison',
    excerpt: 'Understand the differences between school support plans and how to advocate for your child.',
    keywords: ['IEP', '504 plan', 'special education'],
    comingSoon: true,
  },
  {
    title: 'Speech Therapy for Autism: What to Expect',
    category: 'therapy',
    slug: 'speech-therapy-autism-expectations',
    excerpt: 'Discover how speech therapy supports communication growth in everyday life.',
    keywords: ['speech therapy', 'communication', 'SLP'],
    comingSoon: true,
  },
];

export const RESOURCE_ARTICLE_LOOKUP = new Map(
  RESOURCE_ARTICLES.map((article) => [article.slug, article]),
);
