import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Globe,
  Navigation,
  Baby,
  Copy,
  Check,
  ExternalLink,
  CheckCircle,
  Building2,
  Shield,
  Users,
  FileText,
  Stethoscope,
  Languages,
  Star
} from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';
import ServiceTag from '@/components/ServiceTag';
import type { PPECCenter } from '@/lib/supabase';
import { SERVICE_DEFINITIONS } from '@/lib/serviceDefinitions';

// Service slug mapping (database slug -> display slug for ServiceTag)
const serviceDisplayInfo: Record<string, { slug: string }> = {
  'aba': { slug: 'aba-therapy' },
  'speech-therapy': { slug: 'speech-therapy' },
  'occupational-therapy': { slug: 'occupational-therapy' },
  'physical-therapy': { slug: 'physical-therapy' },
  'feeding-therapy': { slug: 'feeding-therapy' },
  'music-therapy': { slug: 'music-therapy' },
  'dir-floortime': { slug: 'dir-floortime' },
  'skilled-nursing': { slug: 'skilled-nursing' },
  'respiratory-care': { slug: 'respiratory-care' },
  'transportation': { slug: 'transportation' },
  'art-therapy': { slug: 'art-therapy' },
  'afterschool-program': { slug: 'afterschool-program' },
  'respite-care': { slug: 'respite-care' },
  'life-skills': { slug: 'life-skills' },
  'pet-therapy': { slug: 'pet-therapy' },
  'group-therapy': { slug: 'group-therapy' },
  'virtual-therapy': { slug: 'virtual-therapy' },
  'mobile-services': { slug: 'mobile-services' },
  'parent-coaching': { slug: 'parent-coaching' },
  'tutoring': { slug: 'tutoring' },
  'support-groups': { slug: 'support-groups' },
  'ados-testing': { slug: 'ados-testing' },
  'executive-function-coaching': { slug: 'executive-function-coaching' },
};

// Feature badge definitions (matches DaycareCard.tsx)
const featureBadgeDefs: { key: string; label: string; tooltip: string; link?: string }[] = [
  { key: 'autism_specific', label: 'Autism Specific', tooltip: 'Specialized program designed specifically for children on the autism spectrum' },
  { key: 'inclusive_classroom', label: 'Inclusive Classroom', tooltip: 'Inclusive classroom environment for children with and without special needs' },
  { key: 'on_site_therapy', label: 'On-Site Therapy', tooltip: 'Therapy services (speech, OT, etc.) available on-site' },
  { key: 'aba_on_site', label: 'ABA on Site', tooltip: 'Applied Behavior Analysis therapy provided on-site', link: '/resources/services/aba-therapy' },
  { key: 'sensory_room', label: 'Sensory Room', tooltip: 'Dedicated sensory room for sensory processing support' },
  { key: 'accepts_medicaid', label: 'Accepts Medicaid', tooltip: 'Accepts Florida Medicaid for payment' },
  { key: 'accepts_scholarships', label: 'Accepts Scholarships', tooltip: 'Accepts Florida scholarship programs (e.g., Gardiner) for tuition' },
  { key: 'vpk_provider', label: 'VPK Provider', tooltip: 'Voluntary Prekindergarten Education Program provider — free pre-K for 4-year-olds' },
  { key: 'early_intervention', label: 'Early Intervention', tooltip: 'Participates in early intervention programs for infants and toddlers' },
  { key: 'head_start', label: 'Head Start', tooltip: 'Federally-funded Head Start program for low-income families' },
  { key: 'transportation_provided', label: 'Transportation', tooltip: 'Transportation services available for enrolled children' },
  { key: 'sliding_scale_fees', label: 'Sliding Scale', tooltip: 'Offers sliding scale fees based on family income' },
];

export default function DaycareDetail() {
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

  const { data: daycare, isLoading, error } = useQuery({
    queryKey: ['daycare', slug],
    queryFn: async () => {
      // Try ppec_centers first
      const { data: ppecData } = await supabase
        .from('ppec_centers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (ppecData) return ppecData as PPECCenter;

      // Fall back to daycares table
      const { data: daycareData, error } = await supabase
        .from('daycares')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!daycareData) throw new Error('Not found');
      return daycareData as PPECCenter;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (error || !daycare) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 sm:p-12 text-center">
            <Baby className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Daycare Not Found</h2>
            <p className="text-gray-600 mb-6">
              The daycare you're looking for could not be found.
            </p>
            <Link to="/find-daycares">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Find Daycares
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasCoordinates = daycare.latitude && daycare.longitude;
  const services = daycare.services || [];
  const languages = daycare.languages || [];
  const activeFeatures = featureBadgeDefs.filter(f => (daycare as any)[f.key] === true);

  const getServiceSlug = (service: string): string => {
    const info = serviceDisplayInfo[service];
    return info?.slug || service;
  };

  return (
    <>
      <Helmet>
        <title>{daycare.name ? `${daycare.name} | Florida Autism Services` : 'Daycare Details | Florida Autism Services'}</title>
        <meta name="description" content={daycare.name ? `${daycare.name} in ${daycare.city || 'Florida'}. Licensed childcare center. Find contact info, location, and details.` : 'View daycare details on Florida Autism Services Directory.'} />
        <link rel="canonical" href={`https://floridaautismservices.com/daycare/${slug}`} />
        <meta property="og:title" content={daycare.name || 'Daycare Details'} />
        <meta property="og:description" content={daycare.name ? `${daycare.name} - Childcare center in ${daycare.city || 'Florida'}` : 'View daycare details'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://floridaautismservices.com/daycare/${slug}`} />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ChildCare",
            "name": daycare.name || '',
            "address": { "@type": "PostalAddress", "streetAddress": daycare.address || '', "addressLocality": daycare.city || '', "addressRegion": "FL", "postalCode": daycare.zip_code || '', "addressCountry": "US" },
            "telephone": daycare.phone || undefined,
            "url": daycare.website || `https://floridaautismservices.com/daycare/${slug}`,
            "geo": hasCoordinates ? { "@type": "GeoCoordinates", "latitude": daycare.latitude, "longitude": daycare.longitude } : undefined
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-8 sm:pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to="/find-daycares">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 -ml-2 sm:ml-0 text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Find Daycares
              </Button>
            </Link>

            {/* Badges in header */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {daycare.profit_status && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                  {daycare.profit_status}
                </Badge>
              )}
              {daycare.licensed_beds && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                  {daycare.licensed_beds} Licensed Beds
                </Badge>
              )}
              {daycare.license_status && (
                <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                  {daycare.license_status}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-start sm:items-center gap-2 sm:gap-3">
              <span className="flex-1">{daycare.name}</span>
              {daycare.verified === true && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 flex-shrink-0 mt-1 sm:mt-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified center</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h1>
            <p className="text-orange-100 text-base sm:text-lg">
              {daycare.city}{daycare.county ? `, ${daycare.county} County` : ''}, {daycare.state || 'FL'}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact & Details Card */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Center Information</h2>

                  <div className="space-y-4">
                    {/* Address */}
                    {(daycare.address || daycare.city) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="text-gray-600 break-words">
                            {daycare.address && <>{daycare.address}<br /></>}
                            {daycare.address2 && <>{daycare.address2}<br /></>}
                            {daycare.city}, {daycare.state || 'FL'} {daycare.zip_code}
                          </p>
                          {hasCoordinates && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${daycare.latitude},${daycare.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm mt-1"
                            >
                              <Navigation className="w-3 h-3" />
                              Get Directions
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {daycare.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <a
                            href={`tel:${formatPhone(daycare.phone)}`}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            {daycare.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Website */}
                    {daycare.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                          <a
                            href={daycare.website.startsWith('http') ? daycare.website : `https://${daycare.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Social Media Links - Featured only */}
                    {daycare.featured && (daycare.facebook_url || daycare.instagram_url || daycare.youtube_url || daycare.linkedin_url || daycare.x_url || daycare.tiktok_url) && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Social Media</p>
                          <TooltipProvider delayDuration={200}>
                            <SocialLinksDisplay socialLinks={{
                              ...(daycare.facebook_url && { facebook: daycare.facebook_url }),
                              ...(daycare.instagram_url && { instagram: daycare.instagram_url }),
                              ...(daycare.youtube_url && { youtube: daycare.youtube_url }),
                              ...(daycare.linkedin_url && { linkedin: daycare.linkedin_url }),
                              ...(daycare.x_url && { twitter: daycare.x_url }),
                              ...(daycare.tiktok_url && { tiktok: daycare.tiktok_url }),
                            }} />
                          </TooltipProvider>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {daycare.description && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{daycare.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feature Badges Card */}
              {activeFeatures.length > 0 && (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      Program Features
                    </h2>
                    <TooltipProvider delayDuration={200}>
                      <div className="flex flex-wrap gap-2">
                        {activeFeatures.map(({ key, label, tooltip, link }) => (
                          <Tooltip key={key}>
                            {link ? (
                              <TooltipTrigger asChild>
                                <Link to={link}>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium cursor-pointer transition-colors bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                                  >
                                    {label}
                                  </Badge>
                                </Link>
                              </TooltipTrigger>
                            ) : (
                              <TooltipTrigger asChild>
                                <span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium cursor-help bg-blue-100 text-blue-800 border-blue-200"
                                  >
                                    {label}
                                  </Badge>
                                </span>
                              </TooltipTrigger>
                            )}
                            <TooltipContent side="top" className="max-w-xs">
                              <p>{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              )}

              {/* Services Card */}
              {services.length > 0 && (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-orange-600" />
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

              {/* Languages Card */}
              {languages.length > 0 && (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Languages className="w-5 h-5 text-orange-600" />
                      Languages Accommodated
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-base">{languages.join(', ')}</p>
                  </CardContent>
                </Card>
              )}

              {/* Center Details Card */}
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Center Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {daycare.licensed_beds && (
                      <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Licensed Beds</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{daycare.licensed_beds}</p>
                      </div>
                    )}
                    {daycare.profit_status && (
                      <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Organization Type</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{daycare.profit_status}</p>
                      </div>
                    )}
                    {daycare.county && (
                      <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">County</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{daycare.county}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* License Information Card */}
              {(daycare.license_number || daycare.ahca_number || daycare.license_status || daycare.license_effective_date || daycare.license_expiration_date) && (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-600" />
                      License Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {daycare.license_number && (
                        <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">License Number</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{daycare.license_number}</p>
                        </div>
                      )}
                      {daycare.ahca_number && (
                        <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">AHCA Number</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{daycare.ahca_number}</p>
                        </div>
                      )}
                      {daycare.license_status && (
                        <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">License Status</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{daycare.license_status}</p>
                        </div>
                      )}
                      {daycare.license_effective_date && (
                        <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Effective Date</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{new Date(daycare.license_effective_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {daycare.license_expiration_date && (
                        <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Expiration Date</p>
                          <p className="text-base font-bold text-gray-900 mt-1">{new Date(daycare.license_expiration_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Map */}
              {hasCoordinates && (
                <Card className="border-none shadow-xl overflow-hidden">
                  <div className="h-[250px] sm:h-[300px] relative">
                    {!MapComponent ? (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                      </div>
                    ) : (
                      <MapComponent.MapContainer
                        center={[daycare.latitude!, daycare.longitude!]}
                        zoom={14}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <MapComponent.TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapComponent.Marker position={[daycare.latitude!, daycare.longitude!]}>
                          <MapComponent.Popup>
                            <div className="text-center">
                              <p className="font-bold text-sm">{daycare.name}</p>
                              <p className="text-xs text-gray-600">{daycare.city}, FL</p>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      </MapComponent.MapContainer>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${daycare.latitude},${daycare.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
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
                    {daycare.phone && (
                      <a href={`tel:${formatPhone(daycare.phone)}`} className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Center
                        </Button>
                      </a>
                    )}
                    {daycare.website && (
                      <a
                        href={daycare.website.startsWith('http') ? daycare.website : `https://${daycare.website}`}
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
                    {hasCoordinates && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${daycare.latitude},${daycare.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full justify-start">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Find Similar Daycares */}
              {services.length > 0 && (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Find Similar Daycares</h3>
                    <div className="space-y-2">
                      {services.slice(0, 3).map((service) => {
                        const def = Object.values(SERVICE_DEFINITIONS).find(d => d.slug === service || d.slug === getServiceSlug(service));
                        const title = def?.title || service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        return (
                          <Link
                            key={service}
                            to={`/find-daycares?service=${service}${daycare.county ? `&county=${daycare.county}` : ''}`}
                            className="block"
                          >
                            <Button variant="outline" className="w-full justify-start text-left">
                              <Stethoscope className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">More {title} daycares</span>
                            </Button>
                          </Link>
                        );
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
