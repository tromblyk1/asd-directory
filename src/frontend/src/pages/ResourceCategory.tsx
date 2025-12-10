import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Shield, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadAllResources } from '@/lib/loadResource';

type ResourceCategory = 'services' | 'insurances' | 'scholarships';

interface ResourceItem {
  slug: string;
  title: string;
  category: string;
  description?: string;
}

const categoryConfig = {
  services: {
    title: 'Therapy Services',
    description: 'Explore autism therapy and intervention services available in Florida including ABA therapy, speech therapy, occupational therapy, and more.',
    icon: BookOpen,
    color: 'from-blue-600 to-cyan-600',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    keywords: 'autism therapy Florida, ABA therapy, speech therapy, occupational therapy, autism services',
  },
  insurances: {
    title: 'Insurance Plans',
    description: 'Learn about health insurance options that cover autism services in Florida including Medicaid, private insurance, and government programs.',
    icon: Shield,
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    keywords: 'autism insurance Florida, Medicaid autism coverage, ABA insurance, autism therapy insurance',
  },
  scholarships: {
    title: 'Scholarships & Funding',
    description: 'Discover Florida scholarship programs and funding options for families with children on the autism spectrum including FES-UA, FES-EO, and more.',
    icon: GraduationCap,
    color: 'from-green-600 to-emerald-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    keywords: 'Florida autism scholarships, FES-UA, FES-EO, autism school funding, special needs scholarships',
  },
};

export default function ResourceCategory() {
  const { category } = useParams<{ category: ResourceCategory }>();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!category || !['services', 'insurances', 'scholarships'].includes(category)) {
        setLoading(false);
        return;
      }

      try {
        const data = await loadAllResources(category as any);
        setResources(data as ResourceItem[]);
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);

  if (!category || !categoryConfig[category as ResourceCategory]) {
    return (
      <>
        <Helmet>
          <title>Category Not Found | Florida Autism Services Directory</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
              <Link to="/">
                <Button className="h-11 sm:h-10">Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const config = categoryConfig[category as ResourceCategory];
  const Icon = config.icon;
  const canonicalUrl = `https://floridaautismservices.com/resources/${category}`;

  // Schema.org CollectionPage structured data
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${config.title} | Florida Autism Services Directory`,
    "description": config.description,
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Florida Autism Services Directory",
      "url": "https://floridaautismservices.com"
    },
    "about": {
      "@type": "Thing",
      "name": config.title
    },
    ...(resources.length > 0 && {
      "numberOfItems": resources.length,
      "itemListElement": resources.slice(0, 10).map((resource, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": resource.title,
        "url": `https://floridaautismservices.com/resources/${category}/${resource.slug}`
      }))
    })
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://floridaautismservices.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Educational Resources",
        "item": "https://floridaautismservices.com/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": config.title,
        "item": canonicalUrl
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{config.title} | Florida Autism Services Directory</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${config.title} | Florida Autism Services`} />
        <meta property="og:description" content={config.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${config.title} | Florida Autism Services`} />
        <meta name="twitter:description" content={config.description} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
        {/* Header - MOBILE OPTIMIZED */}
        <header className={`bg-gradient-to-r ${config.color} text-white py-6 sm:py-8 lg:py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Link to="/resources">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 h-10 sm:h-9 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Back to Educational Resources</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            {/* Breadcrumb Navigation - Hidden on very small screens */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-white/80 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/resources" className="hover:text-white">Resources</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white font-medium">{config.title}</span>
            </nav>

            {/* Mobile: stacked layout, Desktop: side-by-side */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{config.title}</h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 mt-1 sm:mt-2">
                  Browse all available {category} information
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {resources.length === 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="py-8 sm:py-12 text-center px-4">
                <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">{resources.length}</span> {category} available
                </p>
              </div>

              {/* MOBILE: single column, SM: 2 cols, LG: 3 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {resources.map((resource) => (
                  <Link key={resource.slug} to={`/resources/${category}/${resource.slug}`}>
                    <article>
                      <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                        <CardContent className="p-4 sm:p-5 lg:p-6">
                          <Badge className={`${config.badgeColor} border mb-2 sm:mb-3 text-xs`}>
                            {category === 'services' ? 'Service' : category === 'insurances' ? 'Insurance' : 'Scholarship'}
                          </Badge>

                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h2>

                          {resource.description && (
                            <p className="text-gray-700 text-xs sm:text-sm line-clamp-3">
                              {resource.description}
                            </p>
                          )}

                          <div className="mt-3 sm:mt-4 flex items-center text-blue-600 font-medium text-xs sm:text-sm">
                            <span>Learn More</span>
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                          </div>
                        </CardContent>
                      </Card>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}