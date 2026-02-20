import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, GraduationCap, Church, Building2, Globe, Copy, Check, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';

export interface School {
  id: string;
  slug: string | null;
  name: string;
  school_code: string | null;
  district: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  director_name: string | null;
  director_email: string | null;
  website: string | null;
  fes_eo_participant: boolean;
  ftc_participant: boolean;
  fes_ua_participant: boolean;
  pep_participant: boolean;
  is_nonprofit: boolean;
  is_religious: boolean;
  denomination: string | null;
  grade_levels: string | null;
  accreditation: string | null;
  latitude: number | null;
  longitude: number | null;
  // Social media links
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
  featured?: boolean | null;
  social_links?: Record<string, string> | null;
}

interface SchoolCardProps {
  school: School;
}

// Scholarship badge definitions - ALL GREEN for consistency with education page
const scholarshipBadges = [
  { 
    key: 'fes_ua_participant', 
    label: 'FES-UA', 
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    tooltip: 'Family Empowerment Scholarship for Unique Abilities - For students with disabilities including autism',
    link: '/resources/scholarships/fes-ua'
  },
  { 
    key: 'fes_eo_participant', 
    label: 'FES-EO', 
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    tooltip: 'Family Empowerment Scholarship for Educational Options - Income-based school choice scholarship',
    link: '/resources/scholarships/fes-eo'
  },
  { 
    key: 'ftc_participant', 
    label: 'FTC', 
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    tooltip: 'Florida Tax Credit Scholarship - For low-income families seeking private school options',
    link: '/resources/scholarships/ftc'
  },
  { 
    key: 'pep_participant', 
    label: 'PEP', 
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    tooltip: 'Personalized Education Program - Flexible funding for customized learning plans',
    link: '/resources/scholarships/pep'
  },
];

// Denomination definitions with tooltips and links to individual pages
const denominationInfo: Record<string, { tooltip: string; link: string }> = {
  'BAPTIST': { 
    tooltip: 'Baptist Christian school emphasizing biblical teaching and traditional values',
    link: '/resources/denominations/baptist'
  },
  'CATHOLIC': { 
    tooltip: 'Catholic school following the teachings of the Roman Catholic Church',
    link: '/resources/denominations/catholic'
  },
  'NON-DENOMINATIONAL': { 
    tooltip: 'Christian school not affiliated with a specific denomination',
    link: '/resources/denominations/non-denominational'
  },
  'LUTHERAN': { 
    tooltip: 'Lutheran Christian school in the Protestant Reformation tradition',
    link: '/resources/denominations/lutheran'
  },
  'METHODIST': { 
    tooltip: 'Methodist Christian school in the Wesleyan tradition',
    link: '/resources/denominations/methodist'
  },
  'PRESBYTERIAN': { 
    tooltip: 'Presbyterian Christian school in the Reformed tradition',
    link: '/resources/denominations/presbyterian'
  },
  'EPISCOPAL': { 
    tooltip: 'Episcopal school in the Anglican tradition',
    link: '/resources/denominations/episcopalian'
  },
  'EPISCOPALIAN': { 
    tooltip: 'Episcopal school in the Anglican tradition',
    link: '/resources/denominations/episcopalian'
  },
  'JEWISH': { 
    tooltip: 'Jewish school with Hebrew language and religious education',
    link: '/resources/denominations/jewish'
  },
  'SEVENTH DAY ADVENTIST': { 
    tooltip: 'Seventh-day Adventist school emphasizing holistic education',
    link: '/resources/denominations/seventh-day-adventist'
  },
  'ASSEMBLIES OF GOD': { 
    tooltip: 'Assemblies of God Pentecostal Christian school',
    link: '/resources/denominations/assemblies-of-god'
  },
  'CHURCH OF GOD': { 
    tooltip: 'Church of God Christian school in Pentecostal/Holiness tradition',
    link: '/resources/denominations/church-of-god'
  },
  'PENTECOSTAL': { 
    tooltip: 'Pentecostal Christian school emphasizing spiritual gifts',
    link: '/resources/denominations/pentecostal'
  },
  'ISLAMIC/MUSLIM': { 
    tooltip: 'Islamic school with Quran studies and Arabic language education',
    link: '/resources/denominations/islamic'
  },
  'NAZARENE': { 
    tooltip: 'Church of the Nazarene school in the Wesleyan-Holiness tradition',
    link: '/resources/denominations/nazarene'
  },
  'MULTI/ INTER/ TRANS-DENOMINATIONAL': { 
    tooltip: 'Christian school welcoming students from multiple denominations',
    link: '/resources/denominations/multi-denominational'
  },
  'OTHER': { 
    tooltip: 'Religious school with other denominational affiliation',
    link: '/resources/denominations/other-religious'
  },
};

// Accreditation definitions with full names, tooltips, and links
const accreditationInfo: Record<string, { fullName: string; tooltip: string; link: string }> = {
  'COGNIA': {
    fullName: 'Cognia (formerly AdvancED)',
    tooltip: 'Cognia is the largest community of education professionals in the world, providing accreditation and certification.',
    link: '/resources/accreditations/cognia'
  },
  'FCCAP': {
    fullName: 'Florida Coalition of Christian Private Schools Accreditation',
    tooltip: 'FCCAP provides accreditation services for Christian private schools in Florida.',
    link: '/resources/accreditations/fccap'
  },
  'FCIS': {
    fullName: 'Florida Council of Independent Schools',
    tooltip: 'FCIS is a nonprofit organization that accredits and supports independent schools throughout Florida.',
    link: '/resources/accreditations/fcis'
  },
  'FACCS': {
    fullName: 'Florida Association of Christian Colleges and Schools',
    tooltip: 'FACCS accredits Christian schools committed to academic excellence and biblical worldview.',
    link: '/resources/accreditations/faccs'
  },
  'FLOCS': {
    fullName: 'Florida League of Christian Schools',
    tooltip: 'FLOCS provides accreditation and support for Christian schools across Florida.',
    link: '/resources/accreditations/flocs'
  },
  'CGACS': {
    fullName: 'Christian and Gospel Accrediting Commission Schools',
    tooltip: 'CGACS accredits schools committed to Christian education and gospel-centered teaching.',
    link: '/resources/accreditations/cgacs'
  },
  'AISF': {
    fullName: 'Association of Independent Schools of Florida',
    tooltip: 'AISF supports and accredits independent schools committed to educational excellence.',
    link: '/resources/accreditations/aisf'
  },
  'FCCPSA': {
    fullName: 'Florida Catholic Conference Private School Accreditation',
    tooltip: 'FCCPSA accredits Catholic schools in Florida ensuring quality Catholic education.',
    link: '/resources/accreditations/fccpsa'
  },
  'ACSI': {
    fullName: 'Association of Christian Schools International',
    tooltip: 'ACSI is one of the largest Protestant educational organizations in the world.',
    link: '/resources/accreditations/acsi'
  },
  'CSF': {
    fullName: 'Christian Schools of Florida',
    tooltip: 'CSF provides accreditation and resources for Christian schools throughout Florida.',
    link: '/resources/accreditations/csf'
  },
  'FLGA-LCMS': {
    fullName: 'Florida-Georgia District Lutheran Church Missouri Synod',
    tooltip: 'FLGA-LCMS accredits Lutheran schools in the Florida-Georgia district.',
    link: '/resources/accreditations/flga-lcms'
  },
  'ACTS': {
    fullName: 'Association of Christian Teachers and Schools',
    tooltip: 'ACTS supports and accredits Christian schools focused on teacher development.',
    link: '/resources/accreditations/acts'
  },
  'NIPSA': {
    fullName: 'National Independent Private Schools Association',
    tooltip: 'NIPSA accredits independent private schools nationwide with rigorous standards.',
    link: '/resources/accreditations/nipsa'
  },
  'CITA': {
    fullName: 'Commission on International and Trans-Regional Accreditation',
    tooltip: 'CITA provides accreditation for schools with international and trans-regional focus.',
    link: '/resources/accreditations/cita'
  },
  'WELSSA': {
    fullName: 'Wisconsin Evangelical Lutheran Synod School Accreditation',
    tooltip: 'WELSSA accredits schools affiliated with the Wisconsin Evangelical Lutheran Synod.',
    link: '/resources/accreditations/welssa'
  },
  'COBIS': {
    fullName: 'Council of British International Schools',
    tooltip: 'COBIS accredits British international schools worldwide.',
    link: '/resources/accreditations/cobis'
  },
  'AMS': {
    fullName: 'American Montessori Society',
    tooltip: 'AMS accredits schools following the Montessori method of education.',
    link: '/resources/accreditations/ams'
  },
  'FKC': {
    fullName: 'Florida Kindergarten Council',
    tooltip: 'FKC accredits early childhood and kindergarten programs in Florida.',
    link: '/resources/accreditations/fkc'
  },
  'ICAA': {
    fullName: 'International Christian Accrediting Association',
    tooltip: 'ICAA provides international accreditation for Christian schools.',
    link: '/resources/accreditations/icaa'
  },
  'NCSA': {
    fullName: 'National Christian School Association',
    tooltip: 'NCSA accredits Christian schools committed to biblical education.',
    link: '/resources/accreditations/ncsa'
  },
  'CSI': {
    fullName: 'Christian Schools International',
    tooltip: 'CSI supports and accredits Christian schools with a Reformed perspective.',
    link: '/resources/accreditations/csi'
  },
};

// Helper function to parse accreditation string into individual codes
const parseAccreditations = (accreditationString: string | null): string[] => {
  if (!accreditationString) return [];
  return accreditationString.split(',').map(a => a.trim().toUpperCase()).filter(Boolean);
};

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  
  const activeScholarships = scholarshipBadges.filter(s => school[s.key as keyof School]);
  const accreditations = parseAccreditations(school.accreditation);

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

  const fullAddress = [school.address, school.city, school.state, school.zip]
    .filter(Boolean)
    .join(', ');

  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const denominationUpper = school.denomination?.toUpperCase() || '';
  const denomInfo = denominationInfo[denominationUpper] || { 
    tooltip: `${school.denomination} religious school`,
    link: '/resources/denominations/other-religious'
  };

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Header: Name + Type Badges */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/schools/${school.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-purple-600 transition-colors cursor-pointer">
                  {school.name}
                </h3>
              </Link>
              {school.district && (
                <p className="text-sm text-gray-500 mt-0.5">{school.district} County</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Denomination Badge */}
              {school.is_religious && school.denomination && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={denomInfo.link || '/resources/services/faith-based'}>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors">
                        <Church className="w-3 h-3 mr-1" />
                        {school.denomination}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{denomInfo.tooltip}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Nonprofit Badge - TEAL color to distinguish from scholarships/services/insurance */}
              {school.is_nonprofit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/resources/school-types/nonprofit">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-100 cursor-pointer transition-colors">
                        <Building2 className="w-3 h-3 mr-1" />
                        Nonprofit
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>501(c)(3) nonprofit organization - May offer financial aid or sliding scale tuition</p>
                    <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Scholarship Badges - ALL GREEN */}
          {activeScholarships.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeScholarships.map(({ key, label, color, tooltip, link }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Link to={link}>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium cursor-pointer transition-colors ${color}`}
                      >
                        {label}
                      </Badge>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{tooltip}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {/* Grade Levels */}
            {school.grade_levels && (
              <div className="flex items-center text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>Grades: {school.grade_levels}</span>
              </div>
            )}

            {/* Phone */}
            {school.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${formatPhoneForLink(school.phone)}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {school.phone}
                </a>
              </div>
            )}

            {/* Website */}
            {school.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors truncate"
                >
                  Visit Website
                </a>
              </div>
            )}

            {/* Address */}
            {fullAddress && (
              <div className="flex items-start text-gray-600 sm:col-span-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {fullAddress}
                  </a>
                ) : (
                  <span>{fullAddress}</span>
                )}
              </div>
            )}

            {/* Director Email */}
            {school.director_email && (
              <div className="flex items-center text-gray-600 sm:col-span-2 group">
                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {school.director_email.toLowerCase()}
                </span>
                {school.director_name && (
                  <span className="text-gray-400 ml-1 truncate">
                    ({school.director_name})
                  </span>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyEmail(school.director_email!)}
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

            {school.featured && school.social_links && Object.keys(school.social_links).length > 0 && (
              <div className="flex items-center text-gray-600 sm:col-span-2">
                <SocialLinksDisplay socialLinks={school.social_links} size="sm" />
              </div>
            )}
          </div>

          {/* Accreditation Badges */}
          {accreditations.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  Accreditation:
                </span>
                {accreditations.map((code) => {
                  const info = accreditationInfo[code];
                  if (info) {
                    return (
                      <Tooltip key={code}>
                        <TooltipTrigger asChild>
                          <Link to={info.link}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer transition-colors">
                              {code}
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="font-medium">{info.fullName}</p>
                          <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  // Fallback for unknown accreditation codes
                  return (
                    <span 
                      key={code}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                    >
                      {code}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {/* View Details Button */}
          <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
            <Link to={`/schools/${school.slug}`}>
              <Button variant="outline" size="sm" className="text-sm text-purple-600 border-purple-600 hover:bg-purple-50">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};