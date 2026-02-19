import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Users, CheckCircle, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Unified type for merged daycares + ppec_centers records
export interface DaycareListItem {
  id: string | number;
  record_type: 'daycare' | 'ppec';
  name: string | null;
  slug: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean | null;
  // Daycare-specific
  ages_served?: string | null;
  capacity?: number | null;
  hours?: string | null;
  is_nonprofit?: boolean | null;
  inclusive_classroom?: boolean | null;
  autism_specific?: boolean | null;
  sensory_room?: boolean | null;
  on_site_therapy?: boolean | null;
  aba_on_site?: boolean | null;
  allows_outside_therapists?: boolean | null;
  early_intervention?: boolean | null;
  vpk_provider?: boolean | null;
  head_start?: boolean | null;
  accepts_scholarships?: boolean | null;
  accepts_medicaid?: boolean | null;
  sliding_scale_fees?: boolean | null;
  transportation_provided?: boolean | null;
  before_after_care?: boolean | null;
  summer_camp?: boolean | null;
  parent_training?: boolean | null;
  languages?: string[] | null;
  rating?: number | null;
  user_ratings_total?: number | null;
  image_url?: string | null;
  // PPEC-specific
  licensed_beds?: number | null;
  services?: string[] | null;
  profit_status?: string | null;
  // Social
  facebook_url?: string | null;
  instagram_url?: string | null;
  x_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
  tiktok_url?: string | null;
}

interface DaycareCardProps {
  daycare: DaycareListItem;
  distance?: number | null;
}

// Service badge definitions - BLUE colors (matches ProviderCard pattern)
const serviceBadges: Record<string, { label: string; tooltip: string; link: string }> = {
  'aba': { label: 'ABA Therapy', tooltip: 'Applied Behavior Analysis - Evidence-based therapy for autism', link: '/resources/services/aba-therapy' },
  'aba-therapy': { label: 'ABA Therapy', tooltip: 'Applied Behavior Analysis - Evidence-based therapy for autism', link: '/resources/services/aba-therapy' },
  'speech-therapy': { label: 'Speech Therapy', tooltip: 'Speech-language pathology for communication skills', link: '/resources/services/speech-therapy' },
  'occupational-therapy': { label: 'Occupational Therapy', tooltip: 'Daily living skills and sensory processing therapy', link: '/resources/services/occupational-therapy' },
  'physical-therapy': { label: 'Physical Therapy', tooltip: 'Motor skills and movement therapy', link: '/resources/services/physical-therapy' },
  'feeding-therapy': { label: 'Feeding Therapy', tooltip: 'Help with eating difficulties and food aversions', link: '/resources/services/feeding-therapy' },
  'music-therapy': { label: 'Music Therapy', tooltip: 'Therapeutic music interventions for development', link: '/resources/services/music-therapy' },
  'dir-floortime': { label: 'DIR/Floortime', tooltip: 'Developmental, Individual Difference, Relationship-based therapy', link: '/resources/services/floor-time' },
  'skilled-nursing': { label: 'Skilled Nursing', tooltip: 'Licensed nursing care including medication administration and medical monitoring', link: '/resources/services/skilled-nursing' },
  'respiratory-care': { label: 'Respiratory Care', tooltip: 'Respiratory therapy including oxygen management and breathing treatments', link: '/resources/services/respiratory-care' },
  'respite-care': { label: 'Respite Care', tooltip: 'Temporary caregiver relief services', link: '/resources/services/respite-care' },
  'life-skills': { label: 'Life Skills', tooltip: 'Daily living and independence training', link: '/resources/services/life-skills' },
  'pet-therapy': { label: 'Pet Therapy', tooltip: 'Animal-assisted therapeutic interventions', link: '/resources/services/pet-therapy' },
  'group-therapy': { label: 'Group Therapy', tooltip: 'Social skills groups and peer interaction therapy', link: '/resources/services/group-therapy' },
  'virtual-therapy': { label: 'Virtual Therapy', tooltip: 'Telehealth and online therapy services', link: '/resources/services/virtual-therapy' },
  'mobile-services': { label: 'Mobile Services', tooltip: 'In-home or on-site therapy services', link: '/resources/services/mobile-services' },
  'transportation': { label: 'Transportation', tooltip: 'Transportation assistance for individuals with disabilities', link: '/resources/services/transportation' },
  'art-therapy': { label: 'Art Therapy', tooltip: 'Creative expression through visual arts for emotional and developmental growth', link: '/resources/services/art-therapy' },
  'afterschool-program': { label: 'Afterschool Program', tooltip: 'Structured afternoon programming with social, academic, and recreational support', link: '/resources/services/afterschool-program' },
  'parent-coaching': { label: 'Parent Coaching', tooltip: 'Training and support for parents and caregivers', link: '/resources/services/parent-coaching' },
  'tutoring': { label: 'Tutoring', tooltip: 'Academic support and educational assistance', link: '/resources/services/tutoring' },
  'support-groups': { label: 'Support Groups', tooltip: 'Peer support meetings for families', link: '/resources/services/support-groups' },
  'ados-testing': { label: 'ADOS Testing', tooltip: 'Autism Diagnostic Observation Schedule evaluation', link: '/resources/services/ados-testing' },
  'executive-function-coaching': { label: 'Executive Function', tooltip: 'Coaching for planning, organization, and self-regulation', link: '/resources/services/executive-function-coaching' },
};

const findServiceBadgeInfo = (value: string): { label: string; tooltip: string; link: string } | null => {
  if (serviceBadges[value]) return serviceBadges[value];
  if (serviceBadges[value.toLowerCase()]) return serviceBadges[value.toLowerCase()];
  const normalized = value.toLowerCase().replace(/[-_\s]+/g, '');
  for (const [key, info] of Object.entries(serviceBadges)) {
    if (key.toLowerCase().replace(/[-_\s]+/g, '') === normalized) return info;
  }
  return null;
};

// Feature badge definitions
const featureBadgeDefs: { key: keyof DaycareListItem; label: string; tooltip: string }[] = [
  { key: 'autism_specific', label: 'Autism Specific', tooltip: 'Specialized program designed specifically for children on the autism spectrum' },
  { key: 'inclusive_classroom', label: 'Inclusive Classroom', tooltip: 'Inclusive classroom environment for children with and without special needs' },
  { key: 'on_site_therapy', label: 'On-Site Therapy', tooltip: 'Therapy services (speech, OT, etc.) available on-site' },
  { key: 'aba_on_site', label: 'ABA on Site', tooltip: 'Applied Behavior Analysis therapy provided on-site' },
  { key: 'sensory_room', label: 'Sensory Room', tooltip: 'Dedicated sensory room for sensory processing support' },
  { key: 'accepts_medicaid', label: 'Accepts Medicaid', tooltip: 'Accepts Florida Medicaid for payment' },
  { key: 'accepts_scholarships', label: 'Accepts Scholarships', tooltip: 'Accepts Florida scholarship programs (e.g., Gardiner) for tuition' },
  { key: 'vpk_provider', label: 'VPK Provider', tooltip: 'Voluntary Prekindergarten Education Program provider — free pre-K for 4-year-olds' },
  { key: 'early_intervention', label: 'Early Intervention', tooltip: 'Participates in early intervention programs for infants and toddlers' },
  { key: 'head_start', label: 'Head Start', tooltip: 'Federally-funded Head Start program for low-income families' },
  { key: 'transportation_provided', label: 'Transportation', tooltip: 'Transportation services available for enrolled children' },
  { key: 'sliding_scale_fees', label: 'Sliding Scale', tooltip: 'Offers sliding scale fees based on family income' },
];

export const DaycareCard: React.FC<DaycareCardProps> = ({ daycare, distance }) => {
  const formatPhoneForLink = (phone: string) => phone.replace(/[^0-9]/g, '');

  const addressParts = [
    daycare.address,
    daycare.city,
    daycare.state,
    daycare.zip_code
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  // Collect active feature badges
  const activeFeatures = featureBadgeDefs.filter(f => daycare[f.key] === true);

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          {/* Header: Name + Type/Verified badges */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/daycare/${daycare.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                  {daycare.name || 'Unknown Center'}
                </h3>
              </Link>
              {daycare.county && (
                <p className="text-sm text-gray-500 mt-0.5">{daycare.county} County</p>
              )}
              {!daycare.county && daycare.city && (
                <p className="text-sm text-gray-500 mt-0.5">{daycare.city}, {daycare.state || 'FL'}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* PPEC Badge - highly visible */}
              {daycare.record_type === 'ppec' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/guides/childcare-options-autism-florida">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border-2 border-rose-300 hover:bg-rose-200 cursor-pointer transition-colors">
                        <HeartPulse className="w-3.5 h-3.5 mr-1" />
                        PPEC Center
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>A Prescribed Pediatric Extended Care (PPEC) center provides medically complex daytime care for children with significant medical needs — this is not a traditional daycare setting.</p>
                    <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {daycare.verified === true && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 cursor-help">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>Verified center — information confirmed by Florida Autism Services</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Feature Badges */}
          {activeFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeFeatures.map(({ key, label, tooltip }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium cursor-help bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {label}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* PPEC Service Tags */}
          {daycare.record_type === 'ppec' && daycare.services && daycare.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {daycare.services.map((service) => {
                const info = findServiceBadgeInfo(service);
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

          {/* Ages Served / Licensed Beds */}
          {(daycare.ages_served || daycare.licensed_beds) && (
            <div className="flex flex-wrap gap-2">
              {daycare.ages_served && (
                <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                  Ages: {daycare.ages_served}
                </Badge>
              )}
              {daycare.licensed_beds && (
                <Badge variant="outline" className="text-xs font-medium bg-orange-50 text-orange-700 border-orange-200">
                  <Users className="w-3 h-3 mr-1" />
                  {daycare.licensed_beds} Licensed Beds
                </Badge>
              )}
            </div>
          )}

          {/* Distance */}
          {distance != null && (
            <p className="text-sm text-orange-600 font-medium">
              {distance.toFixed(1)} miles away
            </p>
          )}

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {daycare.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${formatPhoneForLink(daycare.phone)}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {daycare.phone}
                </a>
              </div>
            )}

            {daycare.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={daycare.website.startsWith('http') ? daycare.website : `https://${daycare.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors truncate"
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
                    className="hover:text-orange-600 transition-colors"
                  >
                    {fullAddress}
                  </a>
                ) : (
                  <span>{fullAddress}</span>
                )}
              </div>
            )}
          </div>

          {/* View Details */}
          <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
            <Link to={`/daycare/${daycare.slug}`}>
              <Button variant="outline" size="sm" className="text-sm text-orange-600 border-orange-600 hover:bg-orange-50">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
