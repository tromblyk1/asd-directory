import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, ExternalLink, Shield, Info, 
  CheckCircle, AlertCircle, DollarSign 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface InsuranceData {
  title: string;
  type: string;
  description: string;
  eligibility?: string;
  coverage?: string;
  howToApply?: string;
  benefits?: string[];
  limitations?: string[];
  links?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
}

export default function InsuranceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [insurance, setInsurance] = useState<InsuranceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsurance() {
      try {
        setLoading(true);
        setError(null);
        
        // Import the JSON file dynamically based on slug
        const insuranceData = await import(`@/data/resources/insurances/${slug}.json`);
        setInsurance(insuranceData.default || insuranceData);
      } catch (err) {
        console.error('Error loading insurance:', err);
        setError('Insurance information not found');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadInsurance();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !insurance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Not Found</h2>
            <p className="text-gray-600 mb-6">
              The insurance information you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/education">
              <Button>Back to Education</Button>
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
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Educational Resources",
        "item": `${window.location.origin}/education`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Insurance",
        "item": `${window.location.origin}/resources/insurances`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": insurance.title,
        "item": window.location.href
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{insurance.title} Coverage | Florida ASD Directory</title>
        <meta 
          name="description" 
          content={insurance.description.substring(0, 160)} 
        />
        <meta property="og:title" content={`${insurance.title} | Florida ASD Directory`} />
        <meta property="og:description" content={insurance.description.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-12">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-6">
            <Link to="/education">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Education
              </Button>
            </Link>
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-green-100 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/education" className="hover:text-white">Education</Link>
              <span>/</span>
              <Link to="/resources/insurances" className="hover:text-white">Insurance</Link>
              <span>/</span>
              <span className="text-white font-medium">{insurance.title}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  {insurance.type || 'Insurance Coverage'}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold">{insurance.title}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 -mt-8">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              {/* Overview Section */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {insurance.description}
                  </p>
                </div>
              </section>

              {/* Eligibility Section */}
              {insurance.eligibility && (
                <section className="mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Eligibility Requirements</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {insurance.eligibility}
                  </p>
                </section>
              )}

              {/* Coverage Section */}
              {insurance.coverage && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Covered</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {insurance.coverage}
                  </p>
                </section>
              )}

              {/* Benefits Section */}
              {insurance.benefits && insurance.benefits.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Coverage Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {insurance.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Limitations Section */}
              {insurance.limitations && insurance.limitations.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Important Limitations</h3>
                  <div className="space-y-2">
                    {insurance.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* How to Apply Section */}
              {insurance.howToApply && (
                <section className="mb-8 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">How to Apply</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {insurance.howToApply}
                  </p>
                </section>
              )}

              {/* Official Resources Section */}
              {insurance.links && insurance.links.length > 0 && (
                <section className="pt-8 border-t">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Official Resources</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Access official information and application portals:
                  </p>
                  <div className="space-y-3">
                    {insurance.links.map((link, idx) => (
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
                                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                                  {link.label}
                                </h4>
                                {link.description && (
                                  <p className="text-sm text-gray-600">{link.description}</p>
                                )}
                              </div>
                              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-4" />
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

          {/* Find Providers CTA */}
          <Card className="border-none shadow-xl mt-8 bg-gradient-to-br from-green-600 to-blue-600">
            <CardContent className="p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Find Providers That Accept {insurance.title}</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Search our directory to find qualified providers that accept {insurance.title} 
                coverage across Florida.
              </p>
              <Link to={`/findproviders?insurance=${slug}`}>
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  Find Providers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
