import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, CheckCircle, Copy, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { StarRating } from '@/components/StarRating';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';
import type { ProviderRating } from '@/hooks/useProviderRatings';

// Provider type matching resources table structure
export interface ProviderResource {
  id: string | number;
  slug: string | null;
  name: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zip_code: string | null;
  address?: string | null;
  address1?: string | null;
  address2?: string | null;
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
  google_place_id?: string | null;
  social_links?: Record<string, string> | null;
}

interface ProviderCardProps {
  provider: ProviderResource;
  rating?: ProviderRating | null;
}

// Service badge definitions - BLUE colors
const serviceBadges: Record<string, { label: string; tooltip: string; link: string }> = {
  'aba': { label: 'ABA Therapy', tooltip: 'Applied Behavior Analysis - Evidence-based therapy for autism', link: '/resources/services/aba-therapy' },
  'aba-therapy': { label: 'ABA Therapy', tooltip: 'Applied Behavior Analysis - Evidence-based therapy for autism', link: '/resources/services/aba-therapy' },
  'speech': { label: 'Speech Therapy', tooltip: 'Speech-language pathology for communication skills', link: '/resources/services/speech-therapy' },
  'speech-therapy': { label: 'Speech Therapy', tooltip: 'Speech-language pathology for communication skills', link: '/resources/services/speech-therapy' },
  'ot': { label: 'Occupational Therapy', tooltip: 'Daily living skills and sensory processing therapy', link: '/resources/services/occupational-therapy' },
  'occupational-therapy': { label: 'Occupational Therapy', tooltip: 'Daily living skills and sensory processing therapy', link: '/resources/services/occupational-therapy' },
  'pt': { label: 'Physical Therapy', tooltip: 'Motor skills and movement therapy', link: '/resources/services/physical-therapy' },
  'physical-therapy': { label: 'Physical Therapy', tooltip: 'Motor skills and movement therapy', link: '/resources/services/physical-therapy' },
  'feeding': { label: 'Feeding Therapy', tooltip: 'Help with eating difficulties and food aversions', link: '/resources/services/feeding-therapy' },
  'feeding-therapy': { label: 'Feeding Therapy', tooltip: 'Help with eating difficulties and food aversions', link: '/resources/services/feeding-therapy' },
  'music-therapy': { label: 'Music Therapy', tooltip: 'Therapeutic music interventions for development', link: '/resources/services/music-therapy' },
  'dir-floortime': { label: 'DIR/Floortime', tooltip: 'Developmental, Individual Difference, Relationship-based therapy', link: '/resources/services/floor-time' },
  'inpp': { label: 'INPP', tooltip: 'Institute for Neuro-Physiological Psychology movement programs', link: '/resources/services/inpp' },
  'aac': { label: 'AAC', tooltip: 'Augmentative and Alternative Communication devices and training', link: '/resources/services/aac' },
  'respite-care': { label: 'Respite Care', tooltip: 'Temporary caregiver relief services', link: '/resources/services/respite-care' },
  'life-skills': { label: 'Life Skills', tooltip: 'Daily living and independence training', link: '/resources/services/life-skills' },
  'residential-program': { label: 'Residential Program', tooltip: 'Full-time residential care and support', link: '/resources/services/residential-program' },
  'pet-therapy': { label: 'Pet Therapy', tooltip: 'Animal-assisted therapeutic interventions', link: '/resources/services/pet-therapy' },
  'pharmacogenetic-testing': { label: 'Pharmacogenetic Testing', tooltip: 'Genetic testing for medication response', link: '/resources/services/pharmacogenetic-testing' },
  'autism-travel': { label: 'Autism Travel', tooltip: 'Travel assistance and autism-friendly trip planning', link: '/resources/services/autism-travel' },
  'executive-function-coaching': { label: 'Executive Function', tooltip: 'Coaching for planning, organization, and self-regulation', link: '/resources/services/executive-function-coaching' },
  'parent-coaching': { label: 'Parent Coaching', tooltip: 'Training and support for parents and caregivers', link: '/resources/services/parent-coaching' },
  'tutoring': { label: 'Tutoring', tooltip: 'Academic support and educational assistance', link: '/resources/services/tutoring' },
  'group-therapy': { label: 'Group Therapy', tooltip: 'Social skills groups and peer interaction therapy', link: '/resources/services/group-therapy' },
  'ados-testing': { label: 'ADOS Testing', tooltip: 'Autism Diagnostic Observation Schedule evaluation', link: '/resources/services/ados-testing' },
  'support-groups': { label: 'Support Groups', tooltip: 'Peer support meetings for families', link: '/resources/services/support-groups' },
  'virtual-therapy': { label: 'Virtual Therapy', tooltip: 'Telehealth and online therapy services', link: '/resources/services/virtual-therapy' },
  'mobile-services': { label: 'Mobile Services', tooltip: 'In-home or on-site therapy services', link: '/resources/services/mobile-services' },
};

// Insurance badge definitions - PURPLE colors
const insuranceBadges: Record<string, { label: string; tooltip: string; link: string }> = {
  'florida-medicaid': { label: 'Florida Medicaid', tooltip: 'Florida Medicaid health coverage program', link: '/resources/insurances/florida-medicaid' },
  'floridamedicaid': { label: 'Florida Medicaid', tooltip: 'Florida Medicaid health coverage program', link: '/resources/insurances/florida-medicaid' },
  'medicaid': { label: 'Florida Medicaid', tooltip: 'Florida Medicaid health coverage program', link: '/resources/insurances/florida-medicaid' },
  'medicare': { label: 'Medicare', tooltip: 'Federal Medicare health insurance', link: '/resources/insurances/medicare' },
  'aetna': { label: 'Aetna', tooltip: 'Aetna health insurance plans', link: '/resources/insurances/aetna' },
  'cigna': { label: 'Cigna', tooltip: 'Cigna health insurance plans', link: '/resources/insurances/cigna' },
  'tricare': { label: 'TRICARE', tooltip: 'Military health care program', link: '/resources/insurances/tricare' },
  'humana': { label: 'Humana', tooltip: 'Humana health insurance plans', link: '/resources/insurances/humana' },
  'florida-blue': { label: 'Florida Blue', tooltip: 'Florida Blue Cross Blue Shield plans', link: '/resources/insurances/florida-blue' },
  'floridablue': { label: 'Florida Blue', tooltip: 'Florida Blue Cross Blue Shield plans', link: '/resources/insurances/florida-blue' },
  'bluecross': { label: 'Florida Blue', tooltip: 'Florida Blue Cross Blue Shield plans', link: '/resources/insurances/florida-blue' },
  'bcbs': { label: 'Florida Blue', tooltip: 'Florida Blue Cross Blue Shield plans', link: '/resources/insurances/florida-blue' },
  'unitedhealthcare': { label: 'UnitedHealthcare', tooltip: 'UnitedHealthcare insurance plans', link: '/resources/insurances/unitedhealthcare' },
  'united': { label: 'UnitedHealthcare', tooltip: 'UnitedHealthcare insurance plans', link: '/resources/insurances/unitedhealthcare' },
  'uhc': { label: 'UnitedHealthcare', tooltip: 'UnitedHealthcare insurance plans', link: '/resources/insurances/unitedhealthcare' },
  'wellcare': { label: 'WellCare', tooltip: 'WellCare health plans', link: '/resources/insurances/wellcare' },
  'well-care': { label: 'WellCare', tooltip: 'WellCare health plans', link: '/resources/insurances/wellcare' },
  'molina': { label: 'Molina', tooltip: 'Molina Healthcare plans', link: '/resources/insurances/molina-healthcare' },
  'molina-healthcare': { label: 'Molina', tooltip: 'Molina Healthcare plans', link: '/resources/insurances/molina-healthcare' },
  'molinahealthcare': { label: 'Molina', tooltip: 'Molina Healthcare plans', link: '/resources/insurances/molina-healthcare' },
  'sunshine-health': { label: 'Sunshine Health', tooltip: 'Sunshine Health Medicaid managed care', link: '/resources/insurances/sunshine-health' },
  'sunshinehealth': { label: 'Sunshine Health', tooltip: 'Sunshine Health Medicaid managed care', link: '/resources/insurances/sunshine-health' },
  'sunshine': { label: 'Sunshine Health', tooltip: 'Sunshine Health Medicaid managed care', link: '/resources/insurances/sunshine-health' },
  'florida-kidcare': { label: 'Florida KidCare', tooltip: "Florida children's health insurance program", link: '/resources/insurances/florida-kidcare' },
  'floridakidcare': { label: 'Florida KidCare', tooltip: "Florida children's health insurance program", link: '/resources/insurances/florida-kidcare' },
  'kidcare': { label: 'Florida KidCare', tooltip: "Florida children's health insurance program", link: '/resources/insurances/florida-kidcare' },
  'florida-healthcare-plans': { label: 'FL Healthcare Plans', tooltip: 'Florida Healthcare Plans', link: '/resources/insurances/florida-healthcare-plans' },
  'floridahealthcareplans': { label: 'FL Healthcare Plans', tooltip: 'Florida Healthcare Plans', link: '/resources/insurances/florida-healthcare-plans' },
  'early-steps': { label: 'Early Steps', tooltip: 'Florida early intervention program for infants and toddlers (birth to 36 months)', link: '/resources/insurances/early-steps' },
  'earlysteps': { label: 'Early Steps', tooltip: 'Florida early intervention program for infants and toddlers (birth to 36 months)', link: '/resources/insurances/early-steps' },
  'childrens-medical-services': { label: 'CMS - Sunshine', tooltip: 'Children\'s Medical Services - Florida program for children with special healthcare needs, administered through Sunshine Health', link: '/resources/insurances/childrens-medical-services' },
  'cms': { label: 'CMS - Sunshine', tooltip: 'Children\'s Medical Services - Florida program for children with special healthcare needs, administered through Sunshine Health', link: '/resources/insurances/childrens-medical-services' },
  'avmed': { label: 'AvMed', tooltip: 'Florida-based nonprofit health insurer with autism coverage', link: '/resources/insurances/avmed' },
  'oscar': { label: 'Oscar Health', tooltip: 'Tech-forward health insurer with autism therapy coverage in Florida', link: '/resources/insurances/oscar' },
  'allegiance': { label: 'Allegiance', tooltip: 'Third-party administrator for self-funded health plans, a Cigna subsidiary', link: '/resources/insurances/allegiance' },
  'evernorth': { label: 'Evernorth', tooltip: 'Cigna behavioral health division offering autism and mental health services', link: '/resources/insurances/evernorth' },
};

// Scholarship badge definitions - GREEN colors
const scholarshipBadges: Record<string, { label: string; tooltip: string; link: string }> = {
  'fes-ua': { label: 'FES-UA', tooltip: 'Family Empowerment Scholarship for Unique Abilities - For students with disabilities including autism', link: '/resources/scholarships/fes-ua' },
  'fes-eo': { label: 'FES-EO', tooltip: 'Family Empowerment Scholarship for Educational Options - Income-based school choice', link: '/resources/scholarships/fes-eo' },
  'ftc': { label: 'FTC', tooltip: 'Florida Tax Credit Scholarship - For low-income families', link: '/resources/scholarships/ftc' },
  'pep': { label: 'PEP', tooltip: 'Personalized Education Program - Flexible funding for customized learning', link: '/resources/scholarships/pep' },
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, rating }) => {
  const [emailCopied, setEmailCopied] = useState(false);

  const normalizeKey = (str: string): string => {
    return str.toLowerCase().replace(/[-_\s]+/g, '');
  };

  const findBadgeInfo = <T extends { label: string; tooltip: string; link: string }>(
    value: string, 
    badges: Record<string, T>
  ): T | null => {
    if (badges[value]) return badges[value];
    if (badges[value.toLowerCase()]) return badges[value.toLowerCase()];
    
    const normalizedValue = normalizeKey(value);
    for (const [key, info] of Object.entries(badges)) {
      if (normalizeKey(key) === normalizedValue) return info;
      if (normalizeKey(info.label) === normalizedValue) return info;
    }
    return null;
  };

  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email.toLowerCase());
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const addressParts = [
    provider.address || provider.address1,
    provider.city,
    provider.state,
    provider.zip_code
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const services = provider.services || [];
  const insurances = provider.insurances || [];
  const scholarships = provider.scholarships || [];

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link to={`/providers/${provider.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-teal-600 transition-colors cursor-pointer">
                    {provider.name || 'Unknown Provider'}
                  </h3>
                </Link>
                {provider.county && (
                  <p className="text-sm text-gray-500 mt-0.5">{provider.county} County</p>
                )}
                {!provider.county && provider.city && (
                  <p className="text-sm text-gray-500 mt-0.5">{provider.city}, {provider.state || 'FL'}</p>
                )}
                {rating && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-4 h-4"
                    />
                    <StarRating 
                      rating={rating.avg_rating} 
                      reviewCount={rating.review_count}
                      size="sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {provider.verified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 cursor-help transition-colors">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Verified provider - information confirmed by Florida Autism Services</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {services.map((service) => {
                  const info = findBadgeInfo(service, serviceBadges);
                  if (!info) return (
                    <Badge 
                      key={service}
                      variant="outline" 
                      className="text-xs font-medium bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {service}
                    </Badge>
                  );
                  return (
                    <Tooltip key={service}>
                      <TooltipTrigger asChild>
                        <Link to={info.link}>
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium cursor-pointer transition-colors bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                          >
                            {info.label}
                          </Badge>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{info.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}

            {insurances.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Insurance Accepted
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {insurances.map((insurance) => {
                    const info = findBadgeInfo(insurance, insuranceBadges);
                    if (!info) return (
                      <Badge 
                        key={insurance}
                        variant="outline" 
                        className="text-xs font-medium bg-purple-100 text-purple-800 border-purple-200"
                      >
                        {insurance}
                      </Badge>
                    );
                    return (
                      <Tooltip key={insurance}>
                        <TooltipTrigger asChild>
                          <Link to={info.link}>
                            <Badge 
                              variant="outline" 
                              className="text-xs font-medium cursor-pointer transition-colors bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                            >
                              {info.label}
                            </Badge>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{info.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}

            {scholarships.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Scholarships Accepted
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {scholarships.map((scholarship) => {
                    const info = findBadgeInfo(scholarship, scholarshipBadges);
                    if (!info) return (
                      <Badge 
                        key={scholarship}
                        variant="outline" 
                        className="text-xs font-medium bg-green-100 text-green-800 border-green-200"
                      >
                        {scholarship}
                      </Badge>
                    );
                    return (
                      <Tooltip key={scholarship}>
                        <TooltipTrigger asChild>
                          <Link to={info.link}>
                            <Badge 
                              variant="outline" 
                              className="text-xs font-medium cursor-pointer transition-colors bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            >
                              {info.label}
                            </Badge>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{info.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {provider.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${formatPhoneForLink(provider.phone)}`}
                    className="hover:text-teal-600 transition-colors"
                  >
                    {provider.phone}
                  </a>
                </div>
              )}

              {provider.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a
                    href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-600 transition-colors truncate"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {fullAddress && (
                <div className="flex items-start text-gray-600 sm:col-span-2">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                  {googleMapsUrl ? (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-teal-600 transition-colors"
                    >
                      {fullAddress}
                    </a>
                  ) : (
                    <span>{fullAddress}</span>
                  )}
                </div>
              )}

              {!fullAddress && !provider.latitude && (
                <div className="flex items-start text-gray-400 sm:col-span-2">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="italic">Location unavailable</span>
                </div>
              )}

              {provider.email && (
                <div className="flex items-center text-gray-600 sm:col-span-2 group">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {provider.email.toLowerCase()}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyEmail(provider.email!)}
                        className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Copy email address"
                      >
                        {emailCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{emailCopied ? 'Copied!' : 'Copy email'}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {provider.social_links && Object.keys(provider.social_links).length > 0 && (
                <div className="flex items-center text-gray-600 sm:col-span-2">
                  <SocialLinksDisplay socialLinks={provider.social_links} size="sm" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
              <Link to={`/providers/${provider.slug}`}>
                <Button variant="outline" size="sm" className="text-sm text-teal-600 border-teal-600 hover:bg-teal-50">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};