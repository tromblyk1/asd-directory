import { useEffect, useMemo, useState } from 'react';
import { supabase, type Provider } from '../lib/supabase';
import { Search, MapPin, Phone, Filter, ExternalLink } from 'lucide-react';
import { useProviderRatings, type ProviderRating } from '../hooks/useProviderRatings';
import { StarRating } from './StarRating';

type ProviderSearchProps = {
  initialSearch?: string;
};

type InsuranceFilters = {
  medicaid: boolean;
  medicare: boolean;
  florida_blue: boolean;
  unitedhealthcare: boolean;
  aetna: boolean;
  cigna: boolean;
  tricare: boolean;
  humana: boolean;
};

type ServiceFilters = {
  aba: boolean;
  speech: boolean;
  ot: boolean;
  pt: boolean;
  respite: boolean;
  life_skills: boolean;
  residential: boolean;
  pet_therapy: boolean;
};

type ApplyFilterParams = {
  providers: Provider[];
  searchTerm: string;
  cityFilter: string;
  insuranceFilters: InsuranceFilters;
  serviceFilters: ServiceFilters;
};

type InsuranceKey = keyof InsuranceFilters;
type ServiceKey = keyof ServiceFilters;

const INSURANCE_FIELD_MAP: Record<InsuranceKey, keyof Provider> = {
  medicaid: 'accepts_medicaid',
  medicare: 'accepts_medicare',
  florida_blue: 'accepts_florida_blue',
  unitedhealthcare: 'accepts_unitedhealthcare',
  aetna: 'accepts_aetna',
  cigna: 'accepts_cigna',
  tricare: 'accepts_tricare',
  humana: 'accepts_humana',
};

const SERVICE_FIELD_MAP: Record<ServiceKey, string> = {
  aba: 'ABA',
  speech: 'Speech',
  ot: 'Occupational',
  pt: 'Physical',
  respite: 'Respite',
  life_skills: 'Life Skills',
  residential: 'Residential',
  pet_therapy: 'Pet Therapy',
};

const SERVICE_BOOLEAN_MAP: Partial<Record<ServiceKey, Array<keyof Provider>>> = {
  aba: ['aba'],
  speech: ['speech'],
  ot: ['ot'],
  pt: ['pt'],
  respite: ['respite_care'],
  life_skills: ['life_skills', 'life_skills_development'],
  residential: ['residential'],
  pet_therapy: ['pet_therapy'],
};

const SERVICE_TOKEN_MAP: Record<string, ServiceKey> = {
  aba: 'aba',
  abatherapy: 'aba',
  'appliedbehavioranalysis': 'aba',
  speech: 'speech',
  speechtherapy: 'speech',
  speechlanguage: 'speech',
  st: 'speech',
  slp: 'speech',
  ot: 'ot',
  occupationaltherapy: 'ot',
  occupational: 'ot',
  pt: 'pt',
  physicaltherapy: 'pt',
  physical: 'pt',
  respite: 'respite',
  respitecare: 'respite',
  lifeskills: 'life_skills',
  life: 'life_skills',
  socialskills: 'life_skills',
  lifeskillsdevelopment: 'life_skills',
  residential: 'residential',
  residentialsupports: 'residential',
  pets: 'pet_therapy',
  pettherapy: 'pet_therapy',
};

const formatReviewCount = (count: number) => (count >= 5 ? '5+' : count.toLocaleString());

const sortProvidersForDisplay = (
  providers: Provider[],
  ratings: Record<string, ProviderRating>
) => {
  const withIndex = providers.map((provider, index) => ({
    provider,
    index,
    rating:
      provider.google_place_id ? ratings[provider.google_place_id] : undefined,
  }));

  withIndex.sort((a, b) => {
    const hasRatingA = !!(a.rating && a.rating.review_count > 0);
    const hasRatingB = !!(b.rating && b.rating.review_count > 0);

    if (hasRatingA && !hasRatingB) return -1;
    if (!hasRatingA && hasRatingB) return 1;

    if (hasRatingA && hasRatingB) {
      if (b.rating!.avg_rating !== a.rating!.avg_rating) {
        return b.rating!.avg_rating - a.rating!.avg_rating;
      }
      if (b.rating!.review_count !== a.rating!.review_count) {
        return b.rating!.review_count - a.rating!.review_count;
      }
    }

    const nameA = a.provider.provider_name ?? '';
    const nameB = b.provider.provider_name ?? '';
    const nameCompare = nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    if (nameCompare !== 0) {
      return nameCompare;
    }

    return a.index - b.index;
  });

  return withIndex.map(({ provider }) => provider);
};

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
  >
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.29h6.53a5.6 5.6 0 01-2.38 3.66v3h3.85c2.25-2.07 3.49-5.12 3.49-8.68z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.85-3a7.17 7.17 0 01-10.79-3.77H1.29v3.11A12 12 0 0012 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.31 14.33a7.2 7.2 0 01-.38-2.33c0-.81.14-1.6.38-2.33V6.56H1.29a12 12 0 000 10.89l4.02-3.12z"
    />
    <path
      fill="#EA4335"
      d="M12 4.73c1.76 0 3.34.61 4.58 1.81l3.42-3.42C17.97 1.24 15.24 0 12 0A12 12 0 001.29 6.56l4.02 3.11A7.17 7.17 0 0112 4.73z"
    />
  </svg>
);

const INSURANCE_OPTIONS: Array<{ key: InsuranceKey; label: string }> = [
  { key: 'medicaid', label: 'Medicaid' },
  { key: 'medicare', label: 'Medicare' },
  { key: 'florida_blue', label: 'Florida Blue' },
  { key: 'unitedhealthcare', label: 'UnitedHealthcare' },
  { key: 'aetna', label: 'Aetna' },
  { key: 'cigna', label: 'Cigna' },
  { key: 'tricare', label: 'Tricare' },
  { key: 'humana', label: 'Humana' },
];

const SERVICE_OPTIONS: Array<{ key: ServiceKey; label: string }> = [
  { key: 'aba', label: 'ABA Therapy' },
  { key: 'speech', label: 'Speech Therapy' },
  { key: 'ot', label: 'Occupational Therapy' },
  { key: 'pt', label: 'Physical Therapy' },
  { key: 'respite', label: 'Respite Care' },
  { key: 'life_skills', label: 'Life Skills Programs' },
  { key: 'residential', label: 'Residential Supports' },
  { key: 'pet_therapy', label: 'Pet Therapy' },
];

const ALL_SERVICE_KEYS: ServiceKey[] = SERVICE_OPTIONS.map(({ key }) => key);

const INSURANCE_BADGE_CLASSES: Record<InsuranceKey, string> = {
  medicaid: 'bg-green-100 text-green-800',
  medicare: 'bg-blue-100 text-blue-800',
  florida_blue: 'bg-indigo-100 text-indigo-800',
  unitedhealthcare: 'bg-purple-100 text-purple-800',
  aetna: 'bg-pink-100 text-pink-800',
  cigna: 'bg-teal-100 text-teal-800',
  tricare: 'bg-orange-100 text-orange-800',
  humana: 'bg-lime-100 text-lime-800',
};

const ADDITIONAL_INSURANCE_BADGES: Array<{
  field: keyof Provider;
  label: string;
  className: string;
}> = [
  {
    field: 'accepts_florida_healthcare_plans',
    label: 'Florida Healthcare Plans',
    className: 'bg-amber-100 text-amber-800',
  },
];

const SERVICE_BADGE_CLASSES: Partial<Record<ServiceKey, string>> = {
  aba: 'bg-amber-100 text-amber-800',
  speech: 'bg-sky-100 text-sky-800',
  ot: 'bg-purple-100 text-purple-800',
  pt: 'bg-rose-100 text-rose-800',
  respite: 'bg-lime-100 text-lime-800',
  life_skills: 'bg-violet-100 text-violet-800',
  residential: 'bg-slate-200 text-slate-800',
  pet_therapy: 'bg-orange-100 text-orange-800',
};

const DEFAULT_SERVICE_BADGE_CLASS = 'bg-teal-100 text-teal-800';
const ADDITIONAL_SERVICE_BADGE_CLASS = DEFAULT_SERVICE_BADGE_CLASS;

const NORMALIZED_CITY_MAX_LENGTH = 40;

const normalizeCity = (value?: string | null): string => (value ?? '').trim();

const formatCityLabel = (value: string): string =>
  value
    .split(/\s+/)
    .map((segment) =>
      segment.length > 0
        ? segment[0].toUpperCase() + segment.slice(1).toLowerCase()
        : segment,
    )
    .join(' ');

const toComparableCity = (value?: string | null): string => {
  const normalized = normalizeCity(value);
  if (!normalized) {
    return '';
  }
  return formatCityLabel(normalized).toLowerCase();
};

const normalizeZipValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const asString = String(value).trim();
  if (asString === '') {
    return '';
  }

  return asString.replace(/\.0+$/, '');
};

const normalizeServiceLabel = (value: string) =>
  value
    .split(/\s+/)
    .map((segment) => {
      if (segment.length === 0) {
        return segment;
      }
      if (segment === segment.toUpperCase() && /[A-Z]/.test(segment)) {
        return segment;
      }
      return segment[0].toUpperCase() + segment.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();

const isAffirmative = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return false;
    }
    return (
      normalized === 'yes' ||
      normalized === 'true' ||
      normalized === 'y' ||
      normalized === '1' ||
      normalized.startsWith('yes')
    );
  }
  return false;
};

const splitServiceString = (value: string): string[] =>
  value
    .split(/[,|/;]+/)
    .map((segment) => segment.replace(/\s+/g, ' ').trim())
    .filter((segment) => segment.length > 0);

const extractServiceTokens = (provider: Provider): string[] => {
  const tokens = new Set<string>();

  if (typeof provider.service_type === 'string' && provider.service_type.trim().length > 0) {
    splitServiceString(provider.service_type).forEach((token) => tokens.add(token));
  }

  if (Array.isArray(provider.service_types)) {
    provider.service_types
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .forEach((value) => splitServiceString(value).forEach((token) => tokens.add(token)));
  }

  return Array.from(tokens);
};

const getServiceBadges = (provider: Provider) => {
  const badges: Array<{ label: string; className: string }> = [];
  const added = new Set<string>();
  const tokens = extractServiceTokens(provider);

  const sanitizeKey = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '');

  const addBadge = (label: string, className: string) => {
    const normalized = normalizeServiceLabel(label);
    if (!normalized) {
      return;
    }
    const key = sanitizeKey(normalized);
    if (added.has(key)) {
      return;
    }
    badges.push({ label: normalized, className });
    added.add(key);
  };

  ALL_SERVICE_KEYS.forEach((serviceKey) => {
    const label = SERVICE_OPTIONS.find((option) => option.key === serviceKey)?.label ?? SERVICE_FIELD_MAP[serviceKey];
    const booleanFields = SERVICE_BOOLEAN_MAP[serviceKey] ?? [];
    const hasBooleanMatch = booleanFields.some((field) => isAffirmative(provider[field]));
    const searchLabel = SERVICE_FIELD_MAP[serviceKey].toLowerCase();
    const hasTokenMatch = tokens.some((token) => token.toLowerCase().includes(searchLabel));
    const hasNameMatch =
      typeof provider.provider_name === 'string' &&
      provider.provider_name.toLowerCase().includes(searchLabel);

    if (hasBooleanMatch || hasTokenMatch) {
      const badgeClass = SERVICE_BADGE_CLASSES[serviceKey] ?? DEFAULT_SERVICE_BADGE_CLASS;
      addBadge(label, badgeClass);
    } else if (hasNameMatch) {
      const badgeClass = SERVICE_BADGE_CLASSES[serviceKey] ?? DEFAULT_SERVICE_BADGE_CLASS;
      addBadge(label, badgeClass);
    }
  });

  const knownServiceKeys = new Set(
    ALL_SERVICE_KEYS.map((serviceKey) => {
      const label = SERVICE_OPTIONS.find((option) => option.key === serviceKey)?.label ?? SERVICE_FIELD_MAP[serviceKey];
      return sanitizeKey(label);
    }),
  );

  tokens.forEach((token) => {
    const sanitized = sanitizeKey(token);
    const mappedKey = SERVICE_TOKEN_MAP[sanitized];

    if (mappedKey) {
      const label = SERVICE_OPTIONS.find((option) => option.key === mappedKey)?.label ?? SERVICE_FIELD_MAP[mappedKey];
      const badgeClass = SERVICE_BADGE_CLASSES[mappedKey] ?? DEFAULT_SERVICE_BADGE_CLASS;
      addBadge(label, badgeClass);
      return;
    }

    if (!knownServiceKeys.has(sanitized)) {
      addBadge(token, ADDITIONAL_SERVICE_BADGE_CLASS);
    }
  });

  return badges;
};

const getInsuranceBadges = (provider: Provider) => {
  const badges: Array<{ label: string; className: string }> = [];

  INSURANCE_OPTIONS.forEach(({ key, label }) => {
    const field = INSURANCE_FIELD_MAP[key];
    const value = provider[field];
    if (isAffirmative(value)) {
      badges.push({
        label,
        className: INSURANCE_BADGE_CLASSES[key] ?? 'bg-slate-100 text-slate-700',
      });
    }
  });

  ADDITIONAL_INSURANCE_BADGES.forEach(({ field, label, className }) => {
    if (isAffirmative(provider[field])) {
      badges.push({ label, className });
    }
  });

  return badges;
};

const isLikelyCityName = (value: string): boolean => {
  if (!value) return false;
  if (value.length > NORMALIZED_CITY_MAX_LENGTH) return false;
  if (/\d/.test(value)) return false;
  return true;
};

const createServiceFilterState = (activeKeys: ServiceKey[]): ServiceFilters => {
  const base: ServiceFilters = {
    aba: false,
    speech: false,
    ot: false,
    pt: false,
    respite: false,
    life_skills: false,
    residential: false,
    pet_therapy: false,
  };

  activeKeys.forEach((key) => {
    base[key] = true;
  });

  return base;
};

const parseInitialQuery = (value?: string): { term: string; services: ServiceKey[] } => {
  if (!value) {
    return { term: '', services: [] };
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    return { term: '', services: [] };
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('service=')) {
    const raw = trimmed.slice(trimmed.indexOf('=') + 1);
    const candidateKeys = raw
      .split(',')
      .map((segment) => segment.trim().toLowerCase())
      .filter(Boolean);

    const matchedKeys = candidateKeys.filter((key): key is ServiceKey =>
      ALL_SERVICE_KEYS.includes(key as ServiceKey)
    );

    if (matchedKeys.length > 0) {
      return { term: '', services: matchedKeys };
    }

    // If nothing matched, fall back to a plain text search using the provided value.
    return { term: raw, services: [] };
  }

  return { term: trimmed, services: [] };
};

const matchesServiceFilter = (provider: Provider, serviceKey: ServiceKey): boolean => {
  const searchLabel = SERVICE_FIELD_MAP[serviceKey].toLowerCase();

  const booleanFields = SERVICE_BOOLEAN_MAP[serviceKey] ?? [];
  const hasBooleanMatch = booleanFields.some((field) => {
    const value = provider[field];
    return isAffirmative(value);
  });
  if (hasBooleanMatch) {
    return true;
  }

  if (provider.provider_name?.toLowerCase().includes(searchLabel)) {
    return true;
  }

  const tokens = extractServiceTokens(provider);
  return tokens.some((value) => value.toLowerCase().includes(searchLabel));
};

const applyFilters = ({
  providers,
  searchTerm,
  cityFilter,
  insuranceFilters,
  serviceFilters,
}: ApplyFilterParams): Provider[] => {
  let filtered = providers;

  const trimmedSearch = searchTerm.trim().toLowerCase();
  if (trimmedSearch) {
    const tokens = trimmedSearch.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((provider) => {
      const name = provider.provider_name ?? '';
      const city = provider.city ?? '';
      const zip = normalizeZipValue(provider.zip);
      const state = provider.state ?? '';
      const serviceTokens = extractServiceTokens(provider).map((token) =>
        token.toLowerCase()
      );

      const matchesToken = (token: string) => {
        const lower = token.toLowerCase();
        const sanitized = lower.replace(/[^a-z0-9]/g, '');
        const isNumeric = /^[0-9]+$/.test(lower);

        const serviceMatch =
          serviceTokens.some((value) => value.includes(lower)) ||
          (sanitized in SERVICE_TOKEN_MAP
            ? matchesServiceFilter(provider, SERVICE_TOKEN_MAP[sanitized])
            : false);

        if (serviceMatch) {
          return true;
        }

        if (isNumeric) {
          return zip.includes(lower);
        }

        if (sanitized.length === 0) {
          return true;
        }

        return (
          name.toLowerCase().includes(lower) ||
          city.toLowerCase().includes(lower) ||
          state.toLowerCase().includes(lower) ||
          zip.includes(lower)
        );
      };

      return tokens.every(matchesToken);
    });
  }

  if (cityFilter) {
    const normalizedFilter = toComparableCity(cityFilter);
    filtered = filtered.filter((provider) => toComparableCity(provider.city) === normalizedFilter);
  }

  const activeInsurance = (Object.entries(insuranceFilters) as [InsuranceKey, boolean][])
    .filter(([, isActive]) => isActive)
    .map(([key]) => key);

  if (activeInsurance.length > 0) {
    filtered = filtered.filter((provider) =>
      activeInsurance.some((insuranceKey) => {
        const field = INSURANCE_FIELD_MAP[insuranceKey];
        const value = provider[field];
        return typeof value === 'string' && value.toLowerCase() === 'yes';
      }),
    );
  }

  const activeServices = (Object.entries(serviceFilters) as [ServiceKey, boolean][])
    .filter(([, isActive]) => isActive)
    .map(([key]) => key);

  if (activeServices.length > 0) {
    filtered = filtered.filter((provider) =>
      activeServices.every((serviceKey) => matchesServiceFilter(provider, serviceKey)),
    );
  }

  return filtered;
};

export default function ProviderSearch({ initialSearch }: ProviderSearchProps) {
  const parsedInitial = parseInitialQuery(initialSearch);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState(parsedInitial.term);
  const [cityFilter, setCityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);

  const googlePlaceIds = useMemo(() => {
    const ids = new Set<string>();
    filteredProviders.forEach((provider) => {
      if (provider.google_place_id) {
        ids.add(provider.google_place_id);
      }
    });
    return Array.from(ids);
  }, [filteredProviders]);

  const {
    ratings: providerRatings,
    loading: ratingsLoading,
  } = useProviderRatings(googlePlaceIds);

  const sortedProviders = useMemo(
    () => sortProvidersForDisplay(filteredProviders, providerRatings),
    [filteredProviders, providerRatings],
  );
  
  // Insurance filters
  const [insuranceFilters, setInsuranceFilters] = useState<InsuranceFilters>({
    medicaid: false,
    medicare: false,
    florida_blue: false,
    unitedhealthcare: false,
    aetna: false,
    cigna: false,
    tricare: false,
    humana: false
  });
  
  // Service filters
  const [serviceFilters, setServiceFilters] = useState<ServiceFilters>(() =>
    createServiceFilterState(parsedInitial.services)
  );

  // Load providers from Supabase
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const pageSize = 1000;
        let pageStart = 0;
        const allProviders: Provider[] = [];

        while (true) {
          const { data, error } = await supabase
            .from('providers')
            .select(`
              id,
              provider_name,
              google_place_id,
              phone,
              website,
              address1,
              address2,
              city,
              state,
              zip,
              service_type,
              accepts_medicaid,
              accepts_medicare,
              accepts_florida_blue,
              accepts_unitedhealthcare,
              accepts_aetna,
              accepts_cigna,
              accepts_tricare,
              accepts_humana,
              accepts_florida_healthcare_plans,
              aba,
              speech,
              ot,
              pt,
              respite_care,
              life_skills,
              residential,
              church_support,
              pet_therapy
            `)
            .order('provider_name', { ascending: true })
            .range(pageStart, pageStart + pageSize - 1);

          if (error) {
            throw error;
          }

          if (!data || data.length === 0) {
            break;
          }

          const normalized = (data as Array<Record<string, unknown>>).map((raw) => {
            const zip = normalizeZipValue(raw['zip']);
            const id = raw['id'] != null ? String(raw['id']) : undefined;

            return {
              ...(raw as Provider),
              id,
              zip,
              google_place_id: raw['google_place_id'] != null ? String(raw['google_place_id']) : null,
            } as Provider;
          });

          allProviders.push(...normalized);

          if (data.length < pageSize) {
            break;
          }

          pageStart += pageSize;
        }

        setProviders(allProviders);
        setFilteredProviders(
          applyFilters({
            providers: allProviders,
            searchTerm,
            cityFilter,
            insuranceFilters,
            serviceFilters,
          }),
        );
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Apply filters whenever state changes
  useEffect(() => {
    setFilteredProviders(
      applyFilters({
        providers,
        searchTerm,
        cityFilter,
        insuranceFilters,
        serviceFilters,
      }),
    );
  }, [providers, searchTerm, cityFilter, insuranceFilters, serviceFilters]);

  useEffect(() => {
    const parsed = parseInitialQuery(initialSearch);
    setSearchTerm(parsed.term);
    setServiceFilters(createServiceFilterState(parsed.services));
  }, [initialSearch]);

const toggleInsurance = (key: InsuranceKey) => {
  setInsuranceFilters(prev => ({ ...prev, [key]: !prev[key] }));
};

const toggleService = (key: ServiceKey) => {
  setServiceFilters(prev => {
    if (prev[key]) {
      return createServiceFilterState([]);
    }
    return createServiceFilterState([key]);
  });
};

  const cities = [
    ...new Set(
      providers
        .map((provider) => normalizeCity(provider.city))
        .filter((city) => city.length > 0)
        .map(formatCityLabel)
        .filter(isLikelyCityName),
    ),
  ].sort((a, b) => a.localeCompare(b));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Florida Autism Services Directory</h1>
          <p className="text-blue-100">Find providers accepting your insurance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search providers or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
                {/* Insurance Filters */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">Insurance Accepted</h3>
                  <div className="space-y-2">
                    {INSURANCE_OPTIONS.map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={insuranceFilters[key]}
                          onChange={() => toggleInsurance(key)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Filters */}
                <div className="border-t pt-4">
                  <h3 className="font-bold text-lg mb-3">Services Offered</h3>
                  <div className="space-y-2">
                    {SERVICE_OPTIONS.map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={serviceFilters[key]}
                          onChange={() => toggleService(key)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Filters Count */}
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm text-gray-600">
                    <strong>{filteredProviders.length}</strong> of <strong>{providers.length}</strong> providers
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="space-y-4">
              {filteredProviders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600 text-lg">No providers match your filters</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              ) : (
                sortedProviders.map(provider => {
                  const serviceBadges = getServiceBadges(provider);
                  const insuranceBadges = getInsuranceBadges(provider);
                  const rating = provider.google_place_id
                    ? providerRatings[provider.google_place_id]
                    : undefined;
                  const shouldShowRatingSkeleton = ratingsLoading && !!provider.google_place_id;

                  return (
                    <div
                      key={provider.id ?? `${provider.provider_name}-${provider.city}`}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{provider.provider_name}</h3>
                          {provider.service_type && (
                            <p className="text-sm text-gray-600 mt-1">{provider.service_type}</p>
                          )}
                          {shouldShowRatingSkeleton ? (
                            <div className="mt-3 h-5 w-48 rounded-full bg-gray-200 animate-pulse"></div>
                          ) : rating ? (
                            <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-sm">
                              <span className="inline-flex items-center gap-1.5">
                                <GoogleLogo className="h-4 w-4" />
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                                  Google Reviews
                                </span>
                              </span>
                              <StarRating
                                rating={rating.avg_rating}
                                reviewCount={rating.review_count}
                                size="sm"
                                showCount={false}
                              />
                              <span className="text-sm font-semibold text-gray-900">
                                {rating.avg_rating.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({formatReviewCount(rating.review_count)})
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div className="text-sm">
                            <div>{provider.address1}</div>
                            {provider.address2 && <div className="text-gray-600">{provider.address2}</div>}
                            <div>
                              {provider.city}
                              {provider.state && `, ${provider.state}`}
                              {provider.zip && ` ${provider.zip}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone size={18} className="text-gray-400 flex-shrink-0" />
                            {provider.phone ? (
                              <a href={`tel:${provider.phone}`} className="text-blue-600 hover:underline">
                                {provider.phone}
                              </a>
                            ) : (
                              <span className="text-gray-500 italic">Phone not available</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <ExternalLink size={18} className="text-gray-400 flex-shrink-0" />
                            {provider.website ? (
                              <a
                                href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            ) : provider.scraped_website ? (
                              <a
                                href={provider.scraped_website.startsWith('http') ? provider.scraped_website : `https://${provider.scraped_website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            ) : (
                              <span className="text-gray-500 italic">Website not available</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {serviceBadges.length > 0 ? (
                          serviceBadges.map((badge) => (
                            <span
                              key={`${provider.id ?? provider.provider_name}-service-${badge.label}`}
                              className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Services information not available</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {insuranceBadges.length > 0 ? (
                          insuranceBadges.map((badge) => (
                            <span
                              key={`${provider.id ?? provider.provider_name}-insurance-${badge.label}`}
                              className={`px-3 py-1 text-xs rounded-full font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Insurance information not available</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
