import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, ExternalLink, GraduationCap, Info, 
  CheckCircle, AlertCircle, FileText, School, Stethoscope
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { loadResource } from '@/lib/loadResource';

interface ScholarshipData {
  title: string;
  program?: string;
  description: string;
  eligibility?: string;
  fundingDetails?: string;
  howToApply?: string;
  benefits?: string[];
  requirements?: string[];
  links?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
}

const slugToSchoolFilter: Record<string, string> = {
  'fes-ua': 'fes_ua_participant',
  'fes-eo': 'fes_eo_participant',
  'ftc': 'ftc_participant',
  'pep': 'pep_participant',
  'hope': 'hope_participant',
};

const slugToProviderFilter: Record<string, string> = {
  'fes-ua': 'fes-ua',
  'fes-eo': 'fes-eo',
  'ftc': 'ftc',
  'pep': 'pep',
  'hope': 'hope',
};

export default function ScholarshipDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [scholarship, setScholarship] = useState<ScholarshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScholarshipData() {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await loadResource('scholarships', slug);
        
        if (data && 'title' in data && 'description' in data) {
          setScholarship({
            title: data.title as string,
            program: (data as any).program,
            description: data.description as string,
            eligibility: (data as any).eligibility,
            fundingDetails: (data as any).fundingDetails,
            howToApply: (data as any).howToApply,
            benefits: (data as any).benefits,
            requirements: (data as any).requirements,
            links: (data as any).links || []
          });
        } else {
          setError('Scholarship information not found');
        }
      } catch (err) {
        console.error('Error loading scholarship:', err);
        setError('Scholarship information not found');
      } finally {
        setLoading(false);
      }
    }

    loadScholarshipData();
  }, [slug]);

  const schoolFilter = slug ? (slugToSchoolFilter[slug] || slug) : '';
  const providerFilter = slug ? (slugToProviderFilter[slug] || slug) : '';
  
  const findSchoolsUrl = schoolFilter ? `/schools?scholarship=${schoolFilter}` : '/schools';
  const findProvidersUrl = providerFilter ? `/providers?scholarship=${providerFilter}` : '/providers';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              The scholarship information you're looking for doesn't exist or has been moved.
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
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
      { "@type": "ListItem", "position": 2, "name": "Educational Resources", "item": "https://floridaautismservices.com/resources" },
      { "@type": "ListItem", "position": 3, "name": "Scholarships", "item": "https://floridaautismservices.com/resources/scholarships" },
      { "@type": "ListItem", "position": 4, "name": scholarship.title, "item": `https://floridaautismservices.com/resources/scholarships/${slug}` }
    ]
  };

  const scholarshipSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": scholarship.title,
    "description": scholarship.description,
    "provider": { "@type": "Organization", "name": "State of Florida" },
    "areaServed": { "@type": "State", "name": "Florida" },
    "programType": "Scholarship",
    "offers": { "@type": "Offer", "category": "Financial Aid" }
  };

  return (
    <>
      <Helmet>
        <title>{scholarship.title} | Florida Autism Services Directory</title>
        <meta name="description" content={scholarship.description.substring(0, 160)} />
        <meta property="og:title" content={`${scholarship.title} | Florida Autism Services Directory`} />
        <meta property="og:description" content={scholarship.description.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://floridaautismservices.com/resources/scholarships/${slug}`} />
        <link rel="canonical" href={`https://floridaautismservices.com/resources/scholarships/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(scholarshipSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-12">
        {/* Header - MOBILE OPTIMIZED */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/resources">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 h-10 sm:h-9 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Back to Educational Resources</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            
            {/* Breadcrumb - Hidden on mobile */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-green-100 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white">Resources</Link>
              <span>/</span>
              <Link to="/resources/scholarships" className="hover:text-white">Scholarships</Link>
              <span>/</span>
              <span className="text-white font-medium">{scholarship.title}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-1 sm:mb-2 text-xs">
                  {scholarship.program || 'Education Scholarship'}
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{scholarship.title}</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 lg:-mt-8">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
              {/* Overview Section */}
              <section className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">About This Scholarship</h2>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {scholarship.description}
                  </p>
                </div>
              </section>

              {/* Eligibility Section */}
              {scholarship.eligibility && (
                <section className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Eligibility Requirements</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {scholarship.eligibility}
                  </p>
                </section>
              )}

              {/* Funding Details Section */}
              {scholarship.fundingDetails && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Funding Details</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {scholarship.fundingDetails}
                  </p>
                </section>
              )}

              {/* Benefits Section */}
              {scholarship.benefits && scholarship.benefits.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Program Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {scholarship.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 text-sm sm:text-base">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Requirements Section */}
              {scholarship.requirements && scholarship.requirements.length > 0 && (
                <section className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Application Requirements</h3>
                  <div className="space-y-2">
                    {scholarship.requirements.map((requirement, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 text-sm sm:text-base">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* How to Apply Section */}
              {scholarship.howToApply && (
                <section className="mb-6 sm:mb-8 p-4 sm:p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">How to Apply</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {scholarship.howToApply}
                  </p>
                </section>
              )}

              {/* Official Resources Section */}
              {scholarship.links && scholarship.links.length > 0 && (
                <section className="pt-6 sm:pt-8 border-t">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Official Application Resources</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Access official information and application portals:
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {scholarship.links.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
                        <Card className="hover:shadow-md transition-shadow border-gray-200">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-green-600 transition-colors text-sm sm:text-base truncate">
                                  {link.label}
                                </h4>
                                {link.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{link.description}</p>
                                )}
                              </div>
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-3 sm:ml-4" />
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

          {/* Dual CTAs - Schools and Providers - MOBILE OPTIMIZED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {/* Find Schools CTA */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-green-600 to-emerald-600">
              <CardContent className="p-5 sm:p-6 lg:p-8 text-center text-white">
                <School className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-90" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Find Schools</h3>
                <p className="text-green-100 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Search for schools that accept {scholarship.title} funding across Florida.
                </p>
                <Link to={findSchoolsUrl}>
                  <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 w-full h-11 sm:h-10">
                    Find Schools
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Find Providers CTA */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-cyan-600">
              <CardContent className="p-5 sm:p-6 lg:p-8 text-center text-white">
                <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-90" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Find Providers</h3>
                <p className="text-blue-100 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Search for therapy providers that accept {scholarship.title} funding.
                </p>
                <Link to={findProvidersUrl}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full h-11 sm:h-10">
                    Find Providers
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}