import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, ExternalLink, BookOpen, Info,
  CheckCircle, AlertCircle, Baby, Shield
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { loadResource } from '@/lib/loadResource';

interface DaycareResourceData {
  title: string;
  category?: string;
  description: string;
  whoProvides?: string;
  whatToExpect?: string | string[];
  benefits?: string[];
  whoCanBenefit?: string[];
  eligibility?: string[];
  links?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
}

export default function DaycareResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<DaycareResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const data = await loadResource('daycares', slug);

        if (data && 'title' in data && 'description' in data) {
          setResource({
            title: data.title as string,
            category: (data as any).category,
            description: data.description as string,
            whoProvides: (data as any).whoProvides,
            whatToExpect: (data as any).whatToExpect,
            benefits: (data as any).benefits,
            whoCanBenefit: (data as any).whoCanBenefit,
            eligibility: (data as any).eligibility,
            links: (data as any).links || []
          });
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Error loading daycare resource:', err);
        setError('Resource not found');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              The resource you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/resources">
              <Button className="h-11 sm:h-10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Educational Resources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{resource.title} | Florida Autism Services Directory</title>
        <meta name="description" content={resource.description.substring(0, 160)} />
        <meta property="og:title" content={`${resource.title} | Florida Autism Services Directory`} />
        <meta property="og:description" content={resource.description.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://floridaautismservices.com/resources/daycares/${slug}`} />
        <link rel="canonical" href={`https://floridaautismservices.com/resources/daycares/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-12">
        {/* Header */}
        <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/resources">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 h-10 sm:h-9 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Back to Educational Resources</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-orange-100 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white">Resources</Link>
              <span>/</span>
              <span className="text-white font-medium">{resource.title}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Baby className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-1 sm:mb-2 text-xs">
                  Childcare Resource
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{resource.title}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 lg:-mt-8">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
              {/* Overview */}
              <section className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h2>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {resource.description}
                  </p>
                </div>
              </section>

              {/* What to Expect */}
              {resource.whatToExpect && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">What to Expect</h3>
                  {Array.isArray(resource.whatToExpect) ? (
                    <div className="space-y-2">
                      {resource.whatToExpect.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-2" />
                          <span className="text-gray-800 text-sm sm:text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {resource.whatToExpect}
                    </p>
                  )}
                </section>
              )}

              {/* Benefits */}
              {resource.benefits && resource.benefits.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Key Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {resource.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 text-sm sm:text-base">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Who Can Benefit */}
              {resource.whoCanBenefit && resource.whoCanBenefit.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Who Can Benefit</h3>
                  <div className="space-y-2">
                    {resource.whoCanBenefit.map((person, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                        <span className="text-gray-800 text-sm sm:text-base">{person}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Eligibility */}
              {resource.eligibility && resource.eligibility.length > 0 && (
                <section className="mb-6 sm:mb-8 p-4 sm:p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Eligibility Requirements
                  </h3>
                  <div className="space-y-2">
                    {resource.eligibility.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-gray-800 text-sm sm:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Links */}
              {resource.links && resource.links.length > 0 && (
                <section className="pt-6 sm:pt-8 border-t">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Learn More</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Explore these trusted resources for additional information:
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {resource.links.map((link, idx) => {
                      const isExternal = link.url.startsWith('http');
                      const LinkWrapper = isExternal ? 'a' : Link;
                      const linkProps = isExternal
                        ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
                        : { to: link.url };

                      return (
                        <LinkWrapper key={idx} {...(linkProps as any)} className="block group">
                          <Card className="hover:shadow-md transition-shadow border-gray-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-orange-600 transition-colors text-sm sm:text-base truncate">
                                    {link.label}
                                  </h4>
                                  {link.description && (
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{link.description}</p>
                                  )}
                                </div>
                                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0 ml-3 sm:ml-4" />
                              </div>
                            </CardContent>
                          </Card>
                        </LinkWrapper>
                      );
                    })}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>

          {/* Find Daycares CTA */}
          <Card className="border-none shadow-xl mt-6 sm:mt-8 bg-gradient-to-br from-orange-500 to-amber-500">
            <CardContent className="p-5 sm:p-6 lg:p-8 text-center text-white">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">Find PPEC Centers Near You</h3>
              <p className="text-orange-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Search our directory to find licensed PPEC centers and daycares in your area across Florida.
              </p>
              <Link to="/find-daycares">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 h-11 sm:h-10">
                  Find Daycares Near You
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
