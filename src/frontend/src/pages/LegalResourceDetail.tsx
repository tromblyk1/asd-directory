import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, ExternalLink, Scale, Info,
  CheckCircle, AlertCircle, ListChecks, Briefcase
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { loadResource } from '@/lib/loadResource';

interface SponsoredResource {
  name: string;
  tagline?: string;
  city?: string;
  blurb?: string;
  guideTitle?: string;
  guideUrl?: string;
  websiteUrl?: string;
}

interface LegalResourceData {
  title: string;
  category?: string;
  shortDescription?: string;
  seoDescription?: string;
  description: string;
  topics?: string[];
  benefits?: string[];
  whoCanBenefit?: string[];
  links?: Array<{ label: string; url: string; description?: string }>;
  sponsoredResources?: SponsoredResource[];
}

export default function LegalResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [resource, setResource] = useState<LegalResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await loadResource('legal-advocacy', slug);
        if (data && 'title' in data && 'description' in data) {
          setResource({
            title: data.title as string,
            category: (data as any).category,
            shortDescription: (data as any).shortDescription,
            seoDescription: (data as any).seoDescription,
            description: data.description as string,
            topics: (data as any).topics,
            benefits: (data as any).benefits,
            whoCanBenefit: (data as any).whoCanBenefit,
            links: (data as any).links || [],
            sponsoredResources: (data as any).sponsoredResources || [],
          });
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Error loading legal resource:', err);
        setError('Resource not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-600" />
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://floridaautismservices.com' },
      { '@type': 'ListItem', position: 2, name: 'Educational Resources', item: 'https://floridaautismservices.com/resources' },
      { '@type': 'ListItem', position: 3, name: 'Legal & Advocacy', item: 'https://floridaautismservices.com/resources/legal-advocacy' },
      { '@type': 'ListItem', position: 4, name: resource.title, item: `https://floridaautismservices.com/resources/legal-advocacy/${slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{resource.title} | Florida Autism Services Directory</title>
        <meta name="description" content={(resource.seoDescription || resource.shortDescription || resource.description).substring(0, 160)} />
        <meta property="og:title" content={`${resource.title} | Florida Autism Services Directory`} />
        <meta property="og:description" content={(resource.shortDescription || resource.description).substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://floridaautismservices.com/resources/legal-advocacy/${slug}`} />
        <link rel="canonical" href={`https://floridaautismservices.com/resources/legal-advocacy/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12">
        <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 text-white py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/resources">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 h-10 sm:h-9 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Back to Educational Resources</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-200 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white">Resources</Link>
              <span>/</span>
              <span className="text-white font-medium">Legal &amp; Advocacy</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-1 sm:mb-2 text-xs">Legal &amp; Advocacy</Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-sm">{resource.title}</h1>
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
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h2>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
                </div>
              </section>

              {/* Topics covered */}
              {resource.topics && resource.topics.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <ListChecks className="w-5 h-5 text-slate-700" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">What This Covers</h3>
                  </div>
                  <div className="space-y-2">
                    {resource.topics.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-2 h-2 bg-slate-700 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-gray-800 text-sm sm:text-base">{t}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits */}
              {resource.benefits && resource.benefits.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Why This Matters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {resource.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 text-sm sm:text-base">{b}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Who Can Benefit */}
              {resource.whoCanBenefit && resource.whoCanBenefit.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Who This Is For</h3>
                  <div className="space-y-2">
                    {resource.whoCanBenefit.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                        <span className="text-gray-800 text-sm sm:text-base">{p}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sponsored Resources — clearly disclosed */}
              {resource.sponsoredResources && resource.sponsoredResources.length > 0 && (
                <section className="pt-6 sm:pt-8 border-t">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Sponsored Resources</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 italic">
                    {resource.sponsoredResources.length === 1 ? (
                      <>The firm below has sponsored placement on this page. Their support helps fund the directory.
                      Florida Autism Services Directory does not endorse any specific firm — verify independently before retaining counsel.</>
                    ) : (
                      <>The firms below have sponsored placement on this page. Their support helps fund the directory.
                      Florida Autism Services Directory does not endorse any specific firm — verify independently before retaining counsel.</>
                    )}
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    {resource.sponsoredResources.map((firm, idx) => (
                      <Card key={idx} className="border-amber-200 bg-amber-50/40">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900">{firm.name}</h4>
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] uppercase tracking-wide">Sponsored</Badge>
                              </div>
                              {firm.tagline && <p className="text-sm text-gray-600 mt-0.5">{firm.tagline}</p>}
                              {firm.city && <p className="text-xs text-gray-500 mt-0.5">{firm.city}</p>}
                            </div>
                          </div>
                          {firm.blurb && (
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{firm.blurb}</p>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            {firm.guideUrl && (
                              <a
                                href={firm.guideUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
                              >
                                {firm.guideTitle || 'View Guide'}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {firm.websiteUrl && (
                              <a
                                href={firm.websiteUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-sm font-medium transition-colors"
                              >
                                Visit Website
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Learn More Links */}
              {resource.links && resource.links.length > 0 && (
                <section className="pt-6 sm:pt-8 border-t mt-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Learn More</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Trusted resources for additional information:
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {resource.links.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
                        <Card className="hover:shadow-md transition-shadow border-gray-200">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-slate-700 transition-colors text-sm sm:text-base truncate">
                                  {link.label}
                                </h4>
                                {link.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{link.description}</p>
                                )}
                              </div>
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-slate-700 transition-colors flex-shrink-0 ml-3 sm:ml-4" />
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
        </main>
      </div>
    </>
  );
}
