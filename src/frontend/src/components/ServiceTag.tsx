import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link, useNavigate } from 'react-router-dom';

// REMOVED: TooltipProvider import - now provided by parent component
// This prevents 24,000+ TooltipProvider instances when rendering 3000 providers

// Service, Insurance, and Scholarship Metadata
const SERVICE_METADATA: Record<string, {
  name: string;
  description: string;
  color: string;
  type: 'service' | 'insurance' | 'scholarship' | 'accreditation';
  externalUrl?: string;
}> = {
  // Services (Blue - matches education page)
  'aba-therapy': {
    name: 'ABA Therapy',
    description: 'Evidence-based therapy using behavioral principles to teach skills and reduce challenging behaviors',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'speech-therapy': {
    name: 'Speech Therapy',
    description: 'Helps with verbal communication, language comprehension, and social communication skills',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'occupational-therapy': {
    name: 'Occupational Therapy',
    description: 'Addresses sensory processing, fine motor skills, self-care, and adaptive strategies for daily activities',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'physical-therapy': {
    name: 'Physical Therapy',
    description: 'Strengthens gross motor skills, balance, coordination, and physical mobility',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'feeding-therapy': {
    name: 'Feeding Therapy',
    description: 'Addresses food selectivity, oral motor challenges, and sensory sensitivities around eating',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'music-therapy': {
    name: 'Music Therapy',
    description: 'Uses music interventions to support communication, emotional regulation, and social interaction',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'dir-floortime': {
    name: 'DIR/Floortime',
    description: 'Child-led play therapy focusing on emotional connections and developmental milestones',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'inpp': {
    name: 'INPP',
    description: 'Neurophysiological development program',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'aac': {
    name: 'AAC',
    description: 'Augmentative and Alternative Communication',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'respite-care': {
    name: 'Respite Care',
    description: 'Provides temporary relief for family caregivers through trained support workers',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'life-skills': {
    name: 'Life Skills',
    description: 'Teaches practical skills like cooking, money management, personal hygiene, and community navigation',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'residential-program': {
    name: 'Residential Program',
    description: '24-hour care with comprehensive services for individuals needing intensive support',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'pet-therapy': {
    name: 'Pet Therapy',
    description: 'Therapeutic interventions with trained animals to reduce anxiety and motivate engagement',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'pharmacogenetic-testing': {
    name: 'Pharmacogenetic Testing',
    description: 'Genetic testing for medication response',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'autism-travel': {
    name: 'Autism Travel',
    description: 'Specialized travel services',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'executive-function-coaching': {
    name: 'Executive Function Coaching',
    description: 'Develops planning, organization, time management, and self-regulation skills',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'parent-coaching': {
    name: 'Parent Coaching',
    description: 'Trains caregivers in evidence-based techniques to support their child at home',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'tutoring': {
    name: 'Tutoring',
    description: 'Individualized educational instruction adapted for neurodivergent learning styles',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'group-therapy': {
    name: 'Group Therapy',
    description: 'Structured peer groups for practicing social interactions and relationship-building',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'ados-testing': {
    name: 'ADOS Testing',
    description: 'Gold standard diagnostic assessment tool administered by trained clinicians',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'faith-based': {
    name: 'Faith-Based Support',
    description: 'Religious community support',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'support-groups': {
    name: 'Support Groups',
    description: 'Connects families and self-advocates sharing lived experiences for mutual support',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'virtual-therapy': {
    name: 'Virtual Therapy',
    description: 'Remote therapy sessions via secure video platforms for convenient access from home',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'mobile-services': {
    name: 'Mobile Services',
    description: 'Therapists travel to your home, school, or community location',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'transportation': {
    name: 'Transportation',
    description: 'Transportation assistance for individuals with disabilities',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'skilled-nursing': {
    name: 'Skilled Nursing',
    description: 'Licensed nursing care including medication administration and medical monitoring',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'respiratory-care': {
    name: 'Respiratory Care',
    description: 'Respiratory therapy including oxygen management and breathing treatments',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'art-therapy': {
    name: 'Art Therapy',
    description: 'Creative expression through visual arts to support emotional and developmental growth',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },
  'afterschool-program': {
    name: 'Afterschool Program',
    description: 'Structured afternoon programming providing social, academic, and recreational support',
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    type: 'service',
  },

  // Insurance (Purple - matches education page)
  'accepts-most-insurances': {
    name: 'Accepts Most Insurances',
    description: 'This provider accepts most major insurance plans — contact them to verify your specific coverage',
    color: 'bg-white text-purple-700 border-2 border-purple-300 hover:bg-purple-50',
    type: 'insurance',
  },
  'florida-medicaid': {
    name: 'Florida Medicaid',
    description: 'State healthcare coverage program',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'medicare': {
    name: 'Medicare',
    description: 'Federal health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'aetna': {
    name: 'Aetna',
    description: 'Private health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'cigna': {
    name: 'Cigna',
    description: 'Private health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'tricare': {
    name: 'TRICARE',
    description: 'Military health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'humana': {
    name: 'Humana',
    description: 'Private health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'florida-blue': {
    name: 'Florida Blue',
    description: 'Florida Blue Cross Blue Shield',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'unitedhealthcare': {
    name: 'UnitedHealthcare',
    description: 'Private health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'florida-healthcare-plans': {
    name: 'Florida Healthcare Plans',
    description: 'Regional health insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'wellcare': {
    name: 'WellCare',
    description: 'Managed care insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'molina-healthcare': {
    name: 'Molina Healthcare',
    description: 'Managed care insurance',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'sunshine-health': {
    name: 'Sunshine Health',
    description: 'Florida Medicaid plan',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'early-steps': {
    name: 'Early Steps',
    description: 'Florida early intervention program for infants and toddlers (birth to 36 months)',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'childrens-medical-services': {
    name: 'CMS - Sunshine',
    description: 'Children\'s Medical Services - Florida program for children with special healthcare needs, administered through Sunshine Health',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'avmed': {
    name: 'AvMed',
    description: 'Florida-based nonprofit health insurer offering Medicare, individual, and employer group plans with autism coverage',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'oscar': {
    name: 'Oscar Health',
    description: 'Tech-forward health insurer offering individual and family plans with autism therapy coverage in Florida',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'allegiance': {
    name: 'Allegiance',
    description: 'Third-party administrator for self-funded health plans, a Cigna subsidiary',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'evernorth': {
    name: 'Evernorth',
    description: 'Cigna\'s behavioral health division offering autism and mental health services',
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },
  'florida-kidcare': {
    name: 'Florida KidCare',
    description: "Children's health insurance",
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    type: 'insurance',
  },

  // Scholarships (Green - matches education page)
  'pep': {
    name: 'PEP',
    description: 'Personalized Education Program',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },
  'pep-scholarship': {
    name: 'PEP Scholarship',
    description: 'Personalized Education Program',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },
  'fes-ua': {
    name: 'FES-UA',
    description: 'Florida Empowerment Scholarship - Unique Abilities',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },
  'fes-eo': {
    name: 'FES-EO',
    description: 'Florida Empowerment Scholarship - Educational Options',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },
  'ftc': {
    name: 'FTC',
    description: 'Florida Tax Credit Scholarship',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },
  'ftc-scholarship': {
    name: 'FTC Scholarship',
    description: 'Florida Tax Credit Scholarship',
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    type: 'scholarship',
  },

  // Accreditations (Amber/Orange - matches color scheme)
  'cognia': {
    name: 'COGNIA',
    description: 'Cognia (formerly AdvancED/SACS) - Global nonprofit accrediting organization',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'acsi': {
    name: 'ACSI',
    description: 'Association of Christian Schools International',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'fcis': {
    name: 'FCIS',
    description: 'Florida Council of Independent Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'faccs': {
    name: 'FACCS',
    description: 'Florida Association of Christian Colleges and Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'cgacs': {
    name: 'CGACS',
    description: 'Christian Gospel Assembly of Churches Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'flocs': {
    name: 'FLOCS',
    description: 'Florida League of Christian Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'aisf': {
    name: 'AISF',
    description: 'Association of Independent Schools of Florida',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'fccpsa': {
    name: 'FCCPSA',
    description: 'Florida Conference of Catholic Parochial Schools Association',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'csf': {
    name: 'CSF',
    description: 'Christian Schools of Florida',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'flga-lcms': {
    name: 'FLGA-LCMS',
    description: 'Florida-Georgia District Lutheran Church Missouri Synod',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'acts': {
    name: 'ACTS',
    description: 'Association of Christian Teachers and Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'cita': {
    name: 'CITA',
    description: 'Commission on International and Trans-Regional Accreditation',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'nipsa': {
    name: 'NIPSA',
    description: 'National Independent Private Schools Association',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'welssa': {
    name: 'WELSSA',
    description: 'Wisconsin Evangelical Lutheran Synod School Accreditation',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'cobis': {
    name: 'COBIS',
    description: 'Council of British International Schools',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'ams': {
    name: 'AMS',
    description: 'American Montessori Society',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'fkc': {
    name: 'FKC',
    description: 'Florida Kindergarten Council',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'icaa': {
    name: 'ICAA',
    description: 'International Christian Accrediting Association',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'ncsa': {
    name: 'NCSA',
    description: 'National Christian School Association',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'csi': {
    name: 'CSI',
    description: 'Christian Schools International',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
  'fccap': {
    name: 'FCCAP',
    description: 'Florida Coalition of Christian Private Schools Accreditation',
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    type: 'accreditation',
  },
};

type ServiceTagProps = {
  slug: string;
  type: 'service' | 'insurance' | 'scholarship' | 'accreditation';
  size?: 'sm' | 'lg';
};

const ServiceTag: React.FC<ServiceTagProps> = ({ slug, type, size = 'sm' }) => {
  const navigate = useNavigate();
  const metadata = SERVICE_METADATA[slug];

  if (!metadata) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to top before navigating
    window.scrollTo(0, 0);
    // Navigate to the resource page
    navigate(`/resources/${type}s/${slug}`);
  };

  // Size classes
  const sizeClasses = size === 'lg' 
    ? 'text-sm px-3 py-1.5 font-semibold' 
    : 'text-xs font-medium';

  // REMOVED: TooltipProvider wrapper - now provided by parent component (findproviders.tsx)
  // This prevents creating 24,000+ TooltipProvider instances when rendering providers
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/resources/${type}s/${slug}`}
          onClick={handleClick}
          className="inline-block"
        >
          <Badge
            variant="outline"
            className={`${metadata.color} cursor-pointer ${sizeClasses} transition-colors`}
          >
            {metadata.name}
          </Badge>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{metadata.description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ServiceTag;