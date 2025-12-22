import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Navigation, 
  GraduationCap,
  Building2,
  Church,
  Copy,
  Check,
  ExternalLink,
  Award,
  DollarSign
} from 'lucide-react';
import { School } from '../components/SchoolCard';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ServiceTag from '@/components/ServiceTag';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';

// Scholarship name mapping for SEO
const scholarshipNames: Record<string, string> = {
  'fes-ua': 'FES Unique Abilities',
  'fes-eo': 'FES Educational Opportunities',
  'ftc': 'Florida Tax Credit',
  'pep': 'Personalized Education Program',
  'hope': 'HOPE Scholarship'
};

export default function SchoolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  // Load map dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      import('react-leaflet').then((module) => {
        setMapComponent(() => module);
      });
    }
  }, []);

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['school', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as School;
    },
    enabled: !!slug,
  });

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <>
        <Helmet>
          <title>School Not Found | Florida Autism Services Directory</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-6 sm:p-12 text-center">
              <GraduationCap className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">School Not Found</h2>
              <p className="text-gray-600 mb-6">
                The school you're looking for could not be found.
              </p>
              <Link to="/schools">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Find Schools</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const hasCoordinates = school.latitude && school.longitude;

  // Collect all scholarship slugs this school participates in
  const scholarshipSlugs: string[] = [];
  if (school.fes_ua_participant) scholarshipSlugs.push('fes-ua');
  if (school.fes_eo_participant) scholarshipSlugs.push('fes-eo');
  if (school.ftc_participant) scholarshipSlugs.push('ftc');
  if (school.pep_participant) scholarshipSlugs.push('pep');

  // Parse accreditation codes
  const accreditationCodes: string[] = school.accreditation 
    ? school.accreditation.split(',').map(acc => acc.trim().toLowerCase())
    : [];

  // Build SEO content
  const schoolName = toTitleCase(school.name);
  const cityName = school.city || 'Florida';
  const districtName = toTitleCase(school.district || '');
  
  const scholarshipText = scholarshipSlugs.length > 0 
    ? `Accepts ${scholarshipSlugs.map(s => scholarshipNames[s] || s.toUpperCase()).join(', ')} scholarships.`
    : '';
  
  const pageTitle = `${schoolName} | Private School in ${cityName}, FL`;
  const pageDescription = `${schoolName} is a private school in ${cityName}, Florida${school.denomination ? ` (${school.denomination})` : ''}. ${scholarshipText} ${school.grade_levels ? `Grades: ${school.grade_levels}.` : ''} Find contact info, location, and enrollment details.`;
  const canonicalUrl = `https://floridaautismservices.com/schools/${slug}`;

  // Schema.org EducationalOrganization structured data
  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": schoolName,
    "description": `Private school serving students in ${cityName}, Florida`,
    "url": canonicalUrl,
    ...(school.website && { "sameAs": school.website.startsWith('http') ? school.website : `https://${school.website}` }),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "FL",
      "addressCountry": "US",
      ...(school.address && { "streetAddress": school.address }),
      ...(school.zip && { "postalCode": school.zip })
    },
    ...(school.phone && { "telephone": school.phone }),
    ...(school.director_email && { "email": school.director_email }),
    ...(hasCoordinates && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": school.latitude,
        "longitude": school.longitude
      }
    }),
    ...(school.is_nonprofit && { "nonprofitStatus": "Nonprofit501c3" }),
    ...(school.denomination && { "additionalType": "ReligiousOrganization" }),
    "areaServed": {
      "@type": "State",
      "name": "Florida"
    }
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
        "name": "Find Schools",
        "item": "https://floridaautismservices.com/schools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": schoolName,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${schoolName}, private school ${cityName}, Florida private schools, ${school.denomination ? school.denomination + ' school, ' : ''}autism friendly schools, ${scholarshipSlugs.map(s => scholarshipNames[s]).join(', ')}`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="place" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Geo tags */}
        {hasCoordinates && (
          <>
            <meta name="geo.position" content={`${school.latitude};${school.longitude}`} />
            <meta name="geo.region" content="US-FL" />
            <meta name="geo.placename" content={cityName} />
          </>
        )}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schoolSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-8 sm:pb-12">
        {/* Header - Mobile optimized */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/schools">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 -ml-2 sm:ml-0">
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Find Schools</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            
            {/* Header Badges - Using ServiceTag for scholarships */}
            <TooltipProvider delayDuration={200}>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {scholarshipSlugs.map((slug) => (
                  <ServiceTag key={slug} slug={slug} type="scholarship" />
                ))}
                
                {school.is_nonprofit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/resources/school-types/nonprofit">
                        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 font-semibold transition-colors">
                          <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1" />
                          Nonprofit
                        </Badge>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs hidden lg:block">
                      <p>501(c)(3) nonprofit organization - May offer financial aid or sliding scale tuition</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {school.denomination && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={`/resources/denominations/${school.denomination.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 font-semibold transition-colors">
                          <Church className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1" />
                          <span className="max-w-[100px] sm:max-w-none truncate">{school.denomination}</span>
                        </Badge>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs hidden lg:block">
                      <p>{school.denomination} religious school</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
              {toTitleCase(school.name)}
            </h1>
            <p className="text-purple-100 text-base sm:text-lg">
              {school.city}, {school.district}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
          {/* Mobile: Map first, then content. Desktop: Content left, map right */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Mobile Map - Shows first on mobile only */}
            {hasCoordinates && (
              <div className="lg:hidden">
                <Card className="border-none shadow-xl overflow-hidden">
                  <div className="h-[200px] sm:h-[250px] relative">
                    {!MapComponent ? (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                      </div>
                    ) : (
                      <MapComponent.MapContainer
                        center={[school.latitude!, school.longitude!]}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <MapComponent.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent.Marker position={[school.latitude!, school.longitude!]}>
                          <MapComponent.Popup>
                            <div className="text-center">
                              <p className="font-bold text-sm">{toTitleCase(school.name)}</p>
                              <p className="text-xs text-gray-600">{school.city}, FL</p>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      </MapComponent.MapContainer>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact & Details Card */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">School Information</h2>
                  
                  <div className="space-y-4 sm:space-y-5">
                    {/* Address */}
                    {school.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600 break-words">{school.address}</p>
                          <p className="text-gray-600">{school.city}, FL {school.zip}</p>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {school.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a 
                            href={`tel:${formatPhone(school.phone)}`}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {school.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {school.director_email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Email</p>
                          <div className="flex items-center gap-2">
                            <a 
                              href={`mailto:${school.director_email}`}
                              className="text-purple-600 hover:text-purple-700 break-all"
                            >
                              {school.director_email}
                            </a>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => copyEmail(school.director_email!)}
                                    className="p-1.5 hover:bg-gray-100 rounded flex-shrink-0"
                                  >
                                    {emailCopied ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {emailCopied ? 'Copied!' : 'Copy email'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Website */}
                    {school.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Website</p>
                          <a
                            href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 break-all"
                          >
                            <span className="sm:hidden">Visit Website</span>
                            <span className="hidden sm:inline">{school.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Social Media Links */}
                    {school.social_links && Object.keys(school.social_links).length > 0 && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Social Media</p>
                          <TooltipProvider delayDuration={200}>
                            <SocialLinksDisplay socialLinks={school.social_links} />
                          </TooltipProvider>
                        </div>
                      </div>
                    )}

                    {/* Grade Levels */}
                    {school.grade_levels && (
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Grade Levels</p>
                          <p className="text-gray-600">{school.grade_levels}</p>
                        </div>
                      </div>
                    )}

                    {/* Accreditation - Using ServiceTag */}
                    {accreditationCodes.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 mb-2">Accreditation</p>
                          <TooltipProvider delayDuration={200}>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {accreditationCodes.map((code) => (
                                <ServiceTag 
                                  key={code} 
                                  slug={code} 
                                  type="accreditation" 
                                />
                              ))}
                            </div>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Scholarships Card - Using ServiceTag for consistent styling */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Accepted Scholarships
                  </h2>
                  
                  {scholarshipSlugs.length === 0 ? (
                    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-gray-600 text-sm sm:text-base">
                        This school does not currently participate in Florida scholarship programs.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Contact the school directly to inquire about tuition assistance options.
                      </p>
                    </div>
                  ) : (
                    <TooltipProvider delayDuration={200}>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {scholarshipSlugs.map((slug) => (
                          <ServiceTag 
                            key={slug} 
                            slug={slug} 
                            type="scholarship" 
                            size="lg"
                          />
                        ))}
                      </div>
                    </TooltipProvider>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Map (Desktop only) & Quick Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Desktop Map - Hidden on mobile (shown above) */}
              {hasCoordinates && (
                <Card className="border-none shadow-xl overflow-hidden hidden lg:block">
                  <div className="h-[300px] relative">
                    {!MapComponent ? (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                      </div>
                    ) : (
                      <MapComponent.MapContainer
                        center={[school.latitude!, school.longitude!]}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <MapComponent.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent.Marker position={[school.latitude!, school.longitude!]}>
                          <MapComponent.Popup>
                            <div className="text-center">
                              <p className="font-bold text-sm">{toTitleCase(school.name)}</p>
                              <p className="text-xs text-gray-600">{school.city}, FL</p>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      </MapComponent.MapContainer>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {school.phone && (
                      <a href={`tel:${formatPhone(school.phone)}`} className="block">
                        <Button variant="outline" className="w-full justify-start h-11 sm:h-10">
                          <Phone className="w-4 h-4 mr-2" />
                          Call School
                        </Button>
                      </a>
                    )}
                    {school.director_email && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-11 sm:h-10"
                        onClick={() => copyEmail(school.director_email!)}
                      >
                        {emailCopied ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            Email Copied!
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Copy Email
                          </>
                        )}
                      </Button>
                    )}
                    {school.website && (
                      <a 
                        href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full justify-start h-11 sm:h-10">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}