import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Stethoscope,
  Copy,
  Check,
  ExternalLink,
  CheckCircle,
  Heart,
  DollarSign
} from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ServiceTag from '@/components/ServiceTag';
import { useProviderRating } from '@/hooks/useProviderRatings';
import { StarRating } from '@/components/StarRating';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';

// Provider type matching resources table structure
interface ProviderResource {
  id: string;
  slug: string | null;
  name: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zip_code: string | null;
  address?: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  services: string[] | null;
  insurances: string[] | null;
  scholarships: string[] | null;
  verified: boolean | null;
  description: string | null;
  resource_type: string | null;
  google_place_id: string | null;
  // Social media links
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
}

// Service slug mapping (database slug -> display info)
const serviceDisplayInfo: Record<string, { title: string; slug: string }> = {
  'aba': { title: 'ABA Therapy', slug: 'aba-therapy' },
  'speech-therapy': { title: 'Speech Therapy', slug: 'speech-therapy' },
  'occupational-therapy': { title: 'Occupational Therapy', slug: 'occupational-therapy' },
  'physical-therapy': { title: 'Physical Therapy', slug: 'physical-therapy' },
  'feeding-therapy': { title: 'Feeding Therapy', slug: 'feeding-therapy' },
  'music-therapy': { title: 'Music Therapy', slug: 'music-therapy' },
  'dir-floortime': { title: 'DIR/Floortime', slug: 'dir-floortime' },
  'inpp': { title: 'INPP', slug: 'inpp' },
  'aac': { title: 'AAC', slug: 'aac' },
  'respite-care': { title: 'Respite Care', slug: 'respite-care' },
  'life-skills': { title: 'Life Skills', slug: 'life-skills' },
  'residential-program': { title: 'Residential Program', slug: 'residential-program' },
  'pet-therapy': { title: 'Pet/Animal Therapy', slug: 'pet-therapy' },
  'pharmacogenetic-testing': { title: 'Pharmacogenetic Testing', slug: 'pharmacogenetic-testing' },
  'autism-travel': { title: 'Autism Travel', slug: 'autism-travel' },
  'executive-function-coaching': { title: 'Executive Function Coaching', slug: 'executive-function-coaching' },
  'parent-coaching': { title: 'Parent Coaching', slug: 'parent-coaching' },
  'tutoring': { title: 'Tutoring', slug: 'tutoring' },
  'group-therapy': { title: 'Group Therapy', slug: 'group-therapy' },
  'ados-testing': { title: 'ADOS Testing', slug: 'ados-testing' },
  'support-groups': { title: 'Support Groups', slug: 'support-groups' },
  'virtual-therapy': { title: 'Virtual Therapy', slug: 'virtual-therapy' },
  'mobile-services': { title: 'Mobile Services', slug: 'mobile-services' },
};

// Insurance slug mapping
const insuranceDisplayInfo: Record<string, { title: string; slug: string }> = {
  'accepts-most-insurances': { title: 'Accepts Most Insurances', slug: 'accepts-most-insurances' },
  'florida-medicaid': { title: 'Florida Medicaid', slug: 'florida-medicaid' },
  'medicare': { title: 'Medicare', slug: 'medicare' },
  'aetna': { title: 'Aetna', slug: 'aetna' },
  'cigna': { title: 'Cigna', slug: 'cigna' },
  'tricare': { title: 'TRICARE', slug: 'tricare' },
  'humana': { title: 'Humana', slug: 'humana' },
  'florida-blue': { title: 'Florida Blue', slug: 'florida-blue' },
  'unitedhealthcare': { title: 'UnitedHealthcare', slug: 'unitedhealthcare' },
  'wellcare': { title: 'WellCare', slug: 'wellcare' },
  'molina': { title: 'Molina', slug: 'molina-healthcare' },
  'sunshine-health': { title: 'Sunshine Health', slug: 'sunshine-health' },
  'florida-kidcare': { title: 'Florida KidCare', slug: 'florida-kidcare' },
};

// Scholarship slug mapping
const scholarshipDisplayInfo: Record<string, { title: string; slug: string; description: string }> = {
  'fes-ua': { title: 'FES-UA', slug: 'fes-ua', description: 'Florida Empowerment Scholarship - Unique Abilities' },
  'fes-eo': { title: 'FES-EO', slug: 'fes-eo', description: 'Florida Empowerment Scholarship - Educational Options' },
  'ftc': { title: 'FTC', slug: 'ftc', description: 'Florida Tax Credit Scholarship' },
  'pep': { title: 'PEP', slug: 'pep', description: 'Personalized Education Program' },
  'hope': { title: 'Hope Scholarship', slug: 'hope', description: 'School choice scholarship' },
};

export default function ProviderDetail() {
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

  const { data: provider, isLoading, error } = useQuery({
    queryKey: ['provider', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('slug', slug)
        .eq('resource_type', 'provider')
        .single();

      if (error) throw error;
      return data as ProviderResource;
    },
    enabled: !!slug,
  });

  // Fetch Google rating for this provider
  const { rating: providerRating } = useProviderRating(provider?.google_place_id || null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 sm:p-12 text-center">
            <Stethoscope className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h2>
            <p className="text-gray-600 mb-6">
              The provider you're looking for could not be found.
            </p>
            <Link to="/providers">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Find Providers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasCoordinates = provider.latitude && provider.longitude;
  const services = provider.services || [];
  const insurances = provider.insurances || [];
  const scholarships = provider.scholarships || [];

  // Get the ServiceTag slug for a service
  const getServiceSlug = (service: string): string => {
    const info = serviceDisplayInfo[service];
    return info?.slug || service;
  };

  // Get the ServiceTag slug for an insurance
  const getInsuranceSlug = (insurance: string): string => {
    const info = insuranceDisplayInfo[insurance];
    return info?.slug || insurance;
  };

  // Get the ServiceTag slug for a scholarship
  const getScholarshipSlug = (scholarship: string): string => {
    const info = scholarshipDisplayInfo[scholarship];
    return info?.slug || scholarship;
  };

  return (
    <>
      <Helmet>
        <title>{provider?.name ? `${provider.name} | Florida Autism Services` : 'Provider Details | Florida Autism Services'}</title>
        <meta name="description" content={provider?.name ? `${provider.name} in ${provider.city || 'Florida'}. ${services.length > 0 ? `Services: ${services.slice(0, 3).map(s => serviceDisplayInfo[s]?.title || s).join(', ')}.` : ''} Find contact info, location, and accepted insurance.` : 'View provider details on Florida Autism Services Directory.'} />
        <link rel="canonical" href={`https://floridaautismservices.com/providers/${slug}`} />
        <meta property="og:title" content={provider?.name || 'Provider Details'} />
        <meta property="og:description" content={provider?.name ? `${provider.name} - Autism services provider in ${provider.city || 'Florida'}` : 'View provider details'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://floridaautismservices.com/providers/${slug}`} />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={provider?.name || 'Provider Details'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": provider?.name || '',
            "address": { "@type": "PostalAddress", "addressLocality": provider?.city || '', "addressRegion": "FL", "addressCountry": "US" },
            "telephone": provider?.phone || undefined,
            "url": provider?.website || `https://floridaautismservices.com/providers/${slug}`,
            "geo": provider?.latitude && provider?.longitude ? { "@type": "GeoCoordinates", "latitude": provider.latitude, "longitude": provider.longitude } : undefined
          })}
        </script>
      </Helmet>
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-8 sm:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link to="/providers">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 -ml-2 sm:ml-0 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Find Providers
            </Button>
          </Link>
          
          {/* Service badges in header */}
          {services.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {services.slice(0, 4).map((service) => {
                const info = serviceDisplayInfo[service];
                return info ? (
                  <Badge key={service} className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                    {info.title}
                  </Badge>
                ) : null;
              })}
              {services.length > 4 && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                  +{services.length - 4} more
                </Badge>
              )}
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-start sm:items-center gap-2 sm:gap-3">
            <span className="flex-1">{provider.name}</span>
            {provider.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 flex-shrink-0 mt-1 sm:mt-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified provider</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h1>
          <p className="text-teal-100 text-base sm:text-lg">
            {provider.city}{provider.county ? `, ${provider.county} County` : ''}, {provider.state || 'FL'}
          </p>
          {providerRating && (
            <div className="mt-2 sm:mt-3 flex items-center gap-2">
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <StarRating 
                rating={providerRating.avg_rating} 
                reviewCount={providerRating.review_count}
                size="lg"
                className="text-white [&_span]:text-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact & Details Card */}
            <Card className="border-none shadow-xl">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Provider Information</h2>
                
                <div className="space-y-4">
                  {/* Address */}
                  {(provider.address || provider.city) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600 break-words">
                          {provider.address && <>{provider.address}<br /></>}
                          {provider.city}, {provider.state || 'FL'} {provider.zip_code}
                        </p>
                        {hasCoordinates && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${provider.latitude},${provider.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm mt-1"
                          >
                            <Navigation className="w-3 h-3" />
                            Get Directions
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {provider.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a 
                          href={`tel:${formatPhone(provider.phone)}`}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          {provider.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {provider.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">Email</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 break-all text-sm sm:text-base">{provider.email}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => copyEmail(provider.email!)}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                                  aria-label="Copy email"
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
                  {provider.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {(provider.facebook_url || provider.instagram_url || provider.twitter_url || provider.youtube_url || provider.linkedin_url) && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Social Media</p>
                        <TooltipProvider delayDuration={200}>
                          <SocialLinksDisplay socialLinks={{
                            ...(provider.facebook_url && { facebook: provider.facebook_url }),
                            ...(provider.instagram_url && { instagram: provider.instagram_url }),
                            ...(provider.twitter_url && { twitter: provider.twitter_url }),
                            ...(provider.youtube_url && { youtube: provider.youtube_url }),
                            ...(provider.linkedin_url && { linkedin: provider.linkedin_url }),
                          }} />
                        </TooltipProvider>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {provider.description && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{provider.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services Card - Using ServiceTag for consistent BLUE styling */}
            {services.length > 0 && (
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                    Services Offered
                  </h2>
                  <TooltipProvider delayDuration={200}>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <ServiceTag 
                          key={service} 
                          slug={getServiceSlug(service)} 
                          type="service" 
                        />
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            )}

            {/* Insurance Card - Using ServiceTag for consistent PURPLE styling */}
            {insurances.length > 0 && (
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-teal-600" />
                    Insurance Accepted
                  </h2>
                  <TooltipProvider delayDuration={200}>
                    <div className="flex flex-wrap gap-2">
                      {insurances.map((insurance) => (
                        <ServiceTag 
                          key={insurance} 
                          slug={getInsuranceSlug(insurance)} 
                          type="insurance" 
                        />
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            )}

            {/* Scholarships Card - Using ServiceTag for consistent GREEN styling */}
            {scholarships.length > 0 && (
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-teal-600" />
                    Scholarships & Funding Accepted
                  </h2>
                  <TooltipProvider delayDuration={200}>
                    <div className="flex flex-wrap gap-2">
                      {scholarships.map((scholarship) => (
                        <ServiceTag 
                          key={scholarship} 
                          slug={getScholarshipSlug(scholarship)} 
                          type="scholarship" 
                        />
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Map */}
          <div className="space-y-4 sm:space-y-6">
            {hasCoordinates && (
              <Card className="border-none shadow-xl overflow-hidden">
                <div className="h-[250px] sm:h-[300px] relative">
                  {!MapComponent ? (
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                    </div>
                  ) : (
                    <MapComponent.MapContainer
                      center={[provider.latitude!, provider.longitude!]}
                      zoom={14}
                      className="h-full w-full"
                      scrollWheelZoom={false}
                    >
                      <MapComponent.TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapComponent.Marker position={[provider.latitude!, provider.longitude!]}>
                        <MapComponent.Popup>
                          <div className="text-center">
                            <p className="font-bold text-sm">{provider.name}</p>
                            <p className="text-xs text-gray-600">{provider.city}, FL</p>
                          </div>
                        </MapComponent.Popup>
                      </MapComponent.Marker>
                    </MapComponent.MapContainer>
                  )}
                </div>
                <CardContent className="p-3 sm:p-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${provider.latitude},${provider.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
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
                  {provider.phone && (
                    <a href={`tel:${formatPhone(provider.phone)}`} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Provider
                      </Button>
                    </a>
                  )}
                  {provider.email && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => copyEmail(provider.email!)}
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
                  {provider.website && (
                    <a 
                      href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Find Similar Providers */}
            {services.length > 0 && (
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Find Similar Providers</h3>
                  <div className="space-y-2">
                    {services.slice(0, 3).map((service) => {
                      const info = serviceDisplayInfo[service];
                      return info ? (
                        <Link 
                          key={service} 
                          to={`/providers?service=${service}`}
                          className="block"
                        >
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Stethoscope className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">More {info.title} providers</span>
                          </Button>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}