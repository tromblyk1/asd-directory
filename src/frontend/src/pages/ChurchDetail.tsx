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
  Church,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Users,
  Baby,
  User,
  Clock
} from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Church table structure from Supabase
interface ChurchData {
  id: string | number;
  slug: string | null;
  ChurchName: string;
  Denomination: string | null;
  Website: string | null;
  AccommodationSnippet: string | null;
  AccommodationTags: string | null;
  SensoryRoom: boolean | null;
  AlternativeService: boolean | null;
  ChildrenProgram: boolean | null;
  AdultProgram: boolean | null;
  ContactEmail: string | null;
  Phone: string | null;
  Street: string | null;
  City: string | null;
  County: string | null;
  State: string | null;
  ZIP: string | null;
  Lat: number | null;
  Lon: number | null;
  LastVerifiedDate: string | null;
  SourceURL: string | null;
  created_at: string | null;
}

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Tooltip definitions for church tags
const tagTooltips: Record<string, string> = {
  'sensory friendly': 'Environment designed to minimize sensory overload with reduced noise, lighting adjustments, and calm spaces',
  'sensory room': 'Dedicated space with sensory equipment for decompression and regulation',
  'quiet space': 'Designated quiet area available for those who need a break',
  'buddy system': 'Trained volunteers paired one-on-one with individuals who need extra support',
  'alternative service': 'Modified worship service with sensory accommodations',
  'children\'s program': 'Special needs programming available for children',
  'adult program': 'Special needs programming available for adults',
  'community events': 'Church participates in community disability/autism events',
  'adult bible study': 'Bible study group specifically for adults with special needs',
};

const getTagTooltip = (tag: string): string => {
  const normalizedTag = tag.toLowerCase().trim();
  return tagTooltips[normalizedTag] || 'Accommodation provided to support accessibility needs';
};

export default function ChurchDetail() {
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

  const { data: church, isLoading, error } = useQuery({
    queryKey: ['church', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as ChurchData;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (error || !church) {
    return (
      <>
        <Helmet>
          <title>Church Not Found | Florida Autism Services Directory</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-6 sm:p-12 text-center">
              <Church className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Church Not Found</h2>
              <p className="text-gray-600 mb-6">
                The faith community you're looking for could not be found.
              </p>
              <Link to="/faith">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Faith Communities</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const hasCoordinates = church.Lat && church.Lon;

  // Parse AccommodationTags (pipe-delimited)
  const accommodationTags: string[] = church.AccommodationTags
    ? church.AccommodationTags.split('|').map(t => t.trim()).filter(Boolean)
    : [];

  // Build SEO content
  const churchName = church.ChurchName;
  const cityName = church.City || 'Florida';

  const pageTitle = `${churchName} | Autism-Friendly Church in ${cityName}, FL`;
  const pageDescription = `${churchName} is an autism-friendly faith community in ${cityName}, Florida${church.Denomination ? ` (${church.Denomination})` : ''}. ${church.AccommodationSnippet || 'Welcoming and inclusive worship environment.'}`;
  const canonicalUrl = `https://floridaautismservices.com/churches/${slug}`;

  // Schema.org PlaceOfWorship structured data
  const churchSchema = {
    "@context": "https://schema.org",
    "@type": "PlaceOfWorship",
    "name": churchName,
    "description": church.AccommodationSnippet || `Autism-friendly faith community in ${cityName}, Florida`,
    "url": canonicalUrl,
    ...(church.Website && { "sameAs": church.Website.startsWith('http') ? church.Website : `https://${church.Website}` }),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": church.State || "FL",
      "addressCountry": "US",
      ...(church.Street && { "streetAddress": church.Street }),
      ...(church.ZIP && { "postalCode": church.ZIP })
    },
    ...(church.Phone && { "telephone": church.Phone }),
    ...(church.ContactEmail && { "email": church.ContactEmail }),
    ...(hasCoordinates && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": church.Lat,
        "longitude": church.Lon
      }
    }),
    ...(church.Denomination && { "additionalType": church.Denomination }),
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
        "name": "Faith Communities",
        "item": "https://floridaautismservices.com/faith"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": churchName,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${churchName}, autism friendly church ${cityName}, ${church.Denomination ? church.Denomination + ' church, ' : ''}sensory friendly worship, special needs ministry Florida`} />
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
            <meta name="geo.position" content={`${church.Lat};${church.Lon}`} />
            <meta name="geo.region" content="US-FL" />
            <meta name="geo.placename" content={cityName} />
          </>
        )}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(churchSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-8 sm:pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/faith">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 -ml-2 sm:ml-0">
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Faith Communities</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>

            {/* Header Badges */}
            <TooltipProvider delayDuration={200}>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {church.Denomination && (
                  <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                    {church.Denomination}
                  </Badge>
                )}
                {church.LastVerifiedDate && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm cursor-help">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last verified: {new Date(church.LastVerifiedDate).toLocaleDateString()}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
              {churchName}
            </h1>
            <p className="text-rose-100 text-base sm:text-lg">
              {church.City}{church.County ? `, ${church.County} County` : ''}, {church.State || 'FL'}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Mobile Map - Shows first on mobile only */}
            {hasCoordinates && (
              <div className="lg:hidden">
                <Card className="border-none shadow-xl overflow-hidden">
                  <div className="h-[200px] sm:h-[250px] relative">
                    {!MapComponent ? (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
                      </div>
                    ) : (
                      <MapComponent.MapContainer
                        center={[church.Lat!, church.Lon!]}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <MapComponent.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent.Marker position={[church.Lat!, church.Lon!]}>
                          <MapComponent.Popup>
                            <div className="text-center">
                              <p className="font-bold text-sm">{churchName}</p>
                              <p className="text-xs text-gray-600">{church.City}, FL</p>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      </MapComponent.MapContainer>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${church.Lat},${church.Lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-rose-600 hover:bg-rose-700">
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
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Church Information</h2>

                  <div className="space-y-4 sm:space-y-5">
                    {/* Address */}
                    {church.Street && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600 break-words">{church.Street}</p>
                          <p className="text-gray-600">{church.City}, {church.State || 'FL'} {church.ZIP}</p>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {church.Phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a
                            href={`tel:${formatPhone(church.Phone)}`}
                            className="text-rose-600 hover:text-rose-700"
                          >
                            {church.Phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {church.ContactEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Email</p>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${church.ContactEmail}`}
                              className="text-rose-600 hover:text-rose-700 break-all"
                            >
                              {church.ContactEmail}
                            </a>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => copyEmail(church.ContactEmail!)}
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
                    {church.Website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Website</p>
                          <a
                            href={church.Website.startsWith('http') ? church.Website : `https://${church.Website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 break-all"
                          >
                            <span className="sm:hidden">Visit Website</span>
                            <span className="hidden sm:inline">{church.Website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {church.AccommodationSnippet && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{church.AccommodationSnippet}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Programs & Features Card */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600" />
                    Programs & Features
                  </h2>

                  <TooltipProvider delayDuration={200}>
                    {/* Program Tags */}
                    {(church.ChildrenProgram || church.AdultProgram) && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Programs:</p>
                        <div className="flex flex-wrap gap-2">
                          {church.ChildrenProgram && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm cursor-help">
                                  Children's Program
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{getTagTooltip("children's program")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {church.AdultProgram && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm cursor-help">
                                  Adult Program
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{getTagTooltip("adult program")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accommodation Tags */}
                    {(church.SensoryRoom || church.AlternativeService || accommodationTags.length > 0) && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Accommodations:</p>
                        <div className="flex flex-wrap gap-2">
                          {church.SensoryRoom && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-3 py-1 text-sm cursor-help">
                                  Sensory Room
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{getTagTooltip("sensory room")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {church.AlternativeService && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-3 py-1 text-sm cursor-help">
                                  Alternative Service
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{getTagTooltip("alternative service")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {accommodationTags.map((tag, idx) => (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-3 py-1 text-sm cursor-help">
                                  {toTitleCase(tag)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{getTagTooltip(tag)}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    )}
                  </TooltipProvider>

                  {!church.SensoryRoom && !church.AlternativeService && !church.ChildrenProgram && !church.AdultProgram && accommodationTags.length === 0 && (
                    <p className="text-gray-500 text-sm">No specific programs or accommodations listed. Contact the church for more information.</p>
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
                      </div>
                    ) : (
                      <MapComponent.MapContainer
                        center={[church.Lat!, church.Lon!]}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <MapComponent.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent.Marker position={[church.Lat!, church.Lon!]}>
                          <MapComponent.Popup>
                            <div className="text-center">
                              <p className="font-bold text-sm">{churchName}</p>
                              <p className="text-xs text-gray-600">{church.City}, FL</p>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      </MapComponent.MapContainer>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${church.Lat},${church.Lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-rose-600 hover:bg-rose-700">
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
                    {church.Phone && (
                      <a href={`tel:${formatPhone(church.Phone)}`} className="block">
                        <Button variant="outline" className="w-full justify-start h-11 sm:h-10">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Church
                        </Button>
                      </a>
                    )}
                    {church.ContactEmail && (
                      <Button
                        variant="outline"
                        className="w-full justify-start h-11 sm:h-10"
                        onClick={() => copyEmail(church.ContactEmail!)}
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
                    {church.Website && (
                      <a
                        href={church.Website.startsWith('http') ? church.Website : `https://${church.Website}`}
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
