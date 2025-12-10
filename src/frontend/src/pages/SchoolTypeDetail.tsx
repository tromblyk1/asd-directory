import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, ExternalLink, Building2, Info, 
  CheckCircle, AlertCircle, Heart
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface SchoolTypeData {
  title: string;
  description: string;
  benefits?: string[];
  considerations?: string[];
  financialInfo?: string;
  links?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
}

// Mapping from slug to filter parameter
const slugToFilter: Record<string, string> = {
  'nonprofit': 'nonprofit=true',
};

export default function SchoolTypeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [schoolType, setSchoolType] = useState<SchoolTypeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchoolTypeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamic import of JSON file using the slug directly
        const data = await import(`@/data/resources/school-types/${slug}.json`);
        setSchoolType(data.default || data);
      } catch (err) {
        console.error('Error loading school type data:', err);
        setError('School type information not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadSchoolTypeData();
    }
  }, [slug]);

  // Get the filter for the CTA
  const filterParam = slug ? slugToFilter[slug] : null;
  const filterUrl = filterParam ? `/schools?${filterParam}` : '/schools';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-cyan-600" />
      </div>
    );
  }

  if (error || !schoolType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              School Type Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'The school type information you\'re looking for could not be found.'}
            </p>
            <Link to="/resources">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate breadcrumb schema for SEO
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
        "name": "School Types",
        "item": "https://floridaautismservices.com/resources/school-types"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": schoolType.title,
        "item": `https://floridaautismservices.com/resources/school-types/${slug}`
      }
    ]
  };

  // Generate article schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${schoolType.title} - School Type Guide for Florida Families`,
    "description": schoolType.description.substring(0, 200),
    "author": {
      "@type": "Organization",
      "name": "Florida Autism Services Directory"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Florida Autism Services Directory"
    }
  };

  return (
    <>
      <Helmet>
        <title>{schoolType.title} | Florida Autism Services Directory</title>
        <meta 
          name="description" 
          content={`Learn about ${schoolType.title.toLowerCase()} in Florida. ${schoolType.description.substring(0, 120)}...`}
        />
        <meta property="og:title" content={`${schoolType.title} | Florida Autism Services Directory`} />
        <meta property="og:description" content={schoolType.description.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://floridaautismservices.com/resources/school-types/${slug}`} />
        <link rel="canonical" href={`https://floridaautismservices.com/resources/school-types/${slug}`} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-12">
        {/* Header */}
        <header className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/resources">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            
            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-cyan-100 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white">Resources</Link>
              <span>/</span>
              <Link to="/resources/school-types" className="hover:text-white">School Types</Link>
              <span>/</span>
              <span className="text-white font-medium">{schoolType.title}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                {slug === 'nonprofit' ? (
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                ) : (
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                )}
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  School Type
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{schoolType.title}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 lg:-mt-8">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
              {/* Overview Section */}
              <section className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">About {schoolType.title}</h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {schoolType.description}
                  </p>
                </div>
              </section>

              {/* Financial Info Section */}
              {schoolType.financialInfo && (
                <section className="mb-6 sm:mb-8 p-4 sm:p-6 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-6 h-6 text-cyan-600" />
                    <h3 className="text-xl font-bold text-gray-900">Financial Information</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {schoolType.financialInfo}
                  </p>
                </section>
              )}

              {/* Benefits Section */}
              {schoolType.benefits && schoolType.benefits.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 sm:mb-4">Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {schoolType.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Considerations Section */}
              {schoolType.considerations && schoolType.considerations.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 sm:mb-4">Things to Consider</h3>
                  <div className="space-y-2">
                    {schoolType.considerations.map((consideration, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{consideration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Learn More Links */}
              {schoolType.links && schoolType.links.length > 0 && (
                <section className="pt-8 border-t">
                  <h3 className="text-lg sm:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 sm:mb-4">Learn More</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore these resources for additional information:
                  </p>
                  <div className="space-y-3">
                    {schoolType.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <Card className="hover:shadow-md transition-shadow border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                                  {link.label}
                                </h4>
                                {link.description && (
                                  <p className="text-sm text-gray-600">{link.description}</p>
                                )}
                              </div>
                              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors flex-shrink-0 ml-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>

          {/* Find Schools CTA */}
          <Card className="border-none shadow-xl mt-8 bg-gradient-to-br from-cyan-600 to-teal-600">
            <CardContent className="p-5 sm:p-6 lg:p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Find {schoolType.title}</h3>
              <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                Search our directory to find {schoolType.title.toLowerCase()} across Florida.
              </p>
              <Link to={filterUrl}>
                <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50">
                  Find Schools
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}