import React from 'react';
import { MapPin, Phone, ExternalLink, CheckCircle } from 'lucide-react';
import { Provider } from '../lib/supabase';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { StarRating } from './StarRating';
import { useProviderRating } from '../hooks/useProviderRatings';
import { SERVICE_DEFINITIONS } from '../lib/serviceDefinitions';
import { HoverBubble } from './HoverBubble';

type ServiceDefinitionKey = keyof typeof SERVICE_DEFINITIONS;

type ProviderCardProps = {
  provider: Provider;
  onExpand?: () => void;
  onNavigate?: (page: string, data?: unknown) => void;
};

const SERVICE_RESOURCE_SLUGS: Partial<Record<ServiceDefinitionKey, string>> = {
  aba: "aba-therapy",
  speech: "speech-therapy",
  ot: "occupational-therapy",
  pt: "physical-therapy",
  feeding: "feeding-therapy",
  music_therapy: "music-therapy",
  inpp: "inpp",
  aac_speech: "aac",
  dir_floortime: "dir-floortime",
  respite_care: "respite-care",
  life_skills: "life-skills",
  residential_program: "residential-program",
  pet_therapy: "pet-therapy",
  pharmacogenetic_testing: "pharmacogenetic-testing",
  autism_travel: "autism-travel",
  executive_function_coaching: "executive-function-coaching",
  parent_coaching: "parent-coaching",
  tutoring: "tutoring",
  group_therapy: "group-therapy",
  ados_testing: "ados-testing",
  faith_based_support: "faith-based",
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onExpand, onNavigate }) => {
  const { lowSensoryMode } = useAccessibility();
  const { rating, loading: ratingLoading } = useProviderRating(provider.google_place_id || null);

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const findDefinitionKey = (value?: string | null): ServiceDefinitionKey | null => {
    if (!value) return null;
    const normalized = toSlug(value);

    for (const [key, def] of Object.entries(SERVICE_DEFINITIONS)) {
      const slugNormalized = toSlug(def.slug);
      const titleNormalized = toSlug(def.title);

      const matches =
        normalized === def.slug ||
        normalized === slugNormalized ||
        normalized === titleNormalized ||
        (slugNormalized && (normalized.startsWith(slugNormalized) || slugNormalized.startsWith(normalized))) ||
        (titleNormalized && (normalized.startsWith(titleNormalized) || titleNormalized.startsWith(normalized)));

      if (matches) {
        return key as ServiceDefinitionKey;
      }
    }

    return null;
  };

  const getServices = () => {
    const services = new Set<ServiceDefinitionKey>();
    const addService = (key: ServiceDefinitionKey | null | undefined) => {
      if (key && SERVICE_DEFINITIONS[key]) {
        services.add(key);
      }
    };

    const booleanFieldMap = [
      ['aba', 'aba'],
      ['speech', 'speech'],
      ['ot', 'ot'],
      ['pt', 'pt'],
      ['feeding', 'feeding'],
      ['music_therapy', 'music_therapy'],
      ['dir_floortime', 'dir_floortime'],
      ['inpp', 'inpp'],
      ['aac_speech', 'aac_speech'],
      ['respite_care', 'respite_care'],
      ['life_skills', 'life_skills'],
      ['life_skills_development', 'life_skills'],
      ['residential', 'residential_program'],
      ['residential_habilitation', 'residential_program'],
      ['support_groups', 'support_groups'],
      ['pet_therapy', 'pet_therapy'],
      ['church_support', 'church_support'],
      ['virtual_therapy', 'virtual_therapy'],
      ['ados_testing', 'ados_testing'],
      ['pharmacogenetic_testing', 'pharmacogenetic_testing'],
      ['autism_travel', 'autism_travel'],
      ['mobile_services', 'mobile_services'],
      ['executive_function_coaching', 'executive_function_coaching'],
      ['parent_coaching', 'parent_coaching'],
      ['tutoring', 'tutoring'],
      ['group_therapy', 'group_therapy'],
    ] as const;

    booleanFieldMap.forEach(([field, key]) => {
      const value = provider[field as keyof Provider];
      if (value) {
        addService(key);
      }
    });

    addService(findDefinitionKey(provider.service_type));

    if (Array.isArray(provider.service_types)) {
      provider.service_types.forEach((serviceType) => {
        addService(findDefinitionKey(serviceType));
      });
    }

    return Array.from(services);
  };

  const services = getServices();

  const isAffirmative = (value: Provider[keyof Provider]) => {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (!normalized) return false;
      return !['no', 'false', '0', 'n/a', 'na'].includes(normalized);
    }
    if (typeof value === 'number') {
      return value > 0;
    }
    return false;
  };

  const insuranceOptions: Array<{ key: keyof Provider; label: string }> = [
    { key: 'accepts_medicaid', label: 'Medicaid' },
    { key: 'accepts_medicare', label: 'Medicare' },
    { key: 'accepts_aetna', label: 'Aetna' },
    { key: 'accepts_cigna', label: 'Cigna' },
    { key: 'accepts_tricare', label: 'TRICARE' },
    { key: 'accepts_humana', label: 'Humana' },
    { key: 'accepts_florida_blue', label: 'Florida Blue' },
    { key: 'accepts_unitedhealthcare', label: 'UnitedHealthcare' },
    { key: 'accepts_florida_healthcare_plans', label: 'Florida Healthcare Plans' },
    { key: 'accepts_wellcare', label: 'WellCare' },
    { key: 'accepts_molina', label: 'Molina' },
    { key: 'accepts_sunshine_health', label: 'Sunshine Health' },
    { key: 'accepts_florida_kidcare', label: 'Florida KidCare' },
  ];

  const scholarshipOptions: Array<{ key: keyof Provider; label: string }> = [
    { key: 'accepts_pep', label: 'PEP Scholarship' },
    { key: 'accepts_fes_ua', label: 'FES UA' },
    { key: 'accepts_fes_eo', label: 'FES EO' },
    { key: 'accepts_ftc', label: 'Florida Tax Credit (FTC)' },
    { key: 'accepts_hope_scholarship', label: 'Hope Scholarship' },
  ];

  const insuranceCoverage = insuranceOptions
    .filter(({ key }) => isAffirmative(provider[key]))
    .map(({ label }) => label);

  const scholarshipCoverage = scholarshipOptions
    .filter(({ key }) => isAffirmative(provider[key]))
    .map(({ label }) => label);

  return (
    <div
      className={`bg-white/90 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md ${lowSensoryMode ? '' : 'transition-shadow duration-200'
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
            {provider.provider_name}
            {provider.verified && (
              <HoverBubble content="Verified provider — information confirmed by Florida Autism Services.">
                <CheckCircle className="w-5 h-5 text-green-500 cursor-help ml-1" />
              </HoverBubble>
            )}
            
          </h3>

          {/* Google Reviews Rating */}
          {ratingLoading ? (
            <div className="mb-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded"></div>
            </div>
          ) : rating ? (
            <div className="mb-2">
              <StarRating
                rating={rating.avg_rating}
                reviewCount={rating.review_count}
                size="sm"
              />
            </div>
          ) : null}

          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>
              {provider.city && provider.state
                ? `${provider.city}, ${provider.state}`
                : provider.city || 'Location not specified'}
              {provider.zip && ` ${provider.zip}`}
            </span>
          </div>
        </div>
      </div>

      {provider.street && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          {provider.street}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {services.map((serviceKey) => {
          const def = SERVICE_DEFINITIONS[serviceKey];
          if (!def) return null;

          const resourceSlug = SERVICE_RESOURCE_SLUGS[serviceKey] ?? def.slug;
          const canNavigate = Boolean(resourceSlug);

          return (
            <span
              key={serviceKey}
              title={def.short}
              onClick={() => {
                if (!canNavigate || !resourceSlug) {
                  return;
                }
                const path = `/resources/services/${resourceSlug}`;
                if (onNavigate) {
                  onNavigate(path);
                } else {
                  window.location.assign(path);
                }
              }}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                bg-teal-100/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300
                transition ${canNavigate ? "cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-800" : ""}`}
            >
              {def.title}
            </span>
          );
        })}
        {services.length === 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
            Services information not available
          </span>
        )}
      </div>


      {insuranceCoverage.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Insurance Accepted
          </p>
          <div className="flex flex-wrap gap-2">
            {insuranceCoverage.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {scholarshipCoverage.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Scholarships & Funding
          </p>
          <div className="flex flex-wrap gap-2">
            {scholarshipCoverage.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 text-sm">
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Call ${provider.provider_name}`}
              title={provider.phone}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{provider.phone}</span>
            </a>
          )}
          {provider.website && (
            <a
              href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Visit ${provider.provider_name} website`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
          )}
          {provider.scraped_website && !provider.website && (
            <a
              href={provider.scraped_website.startsWith('http') ? provider.scraped_website : `https://${provider.scraped_website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Visit ${provider.provider_name} website`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
          )}
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};
