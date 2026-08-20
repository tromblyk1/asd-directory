import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ProviderCard, type ProviderResource } from '@/components/ProviderCard';
import { useProviderRatings } from '@/hooks/useProviderRatings';
import cityPages from '@/data/pseo/cityPages.json';
import cityCoordinates from '@/data/cityCoordinates.json';

interface CityPage {
  service: string;
  city: string;
  citySlug: string;
  cityName: string;
  providers: number;
  band: string;
}

const PAGES = cityPages as CityPage[];
const COORDS = cityCoordinates as Record<string, { latitude: number; longitude: number }>;

const SERVICE_LABELS: Record<string, { label: string; explainer: string }> = {
  'aac': { label: 'AAC', explainer: 'aac' },
  'aba': { label: 'ABA Therapy', explainer: 'aba-therapy' },
  'ados-testing': { label: 'ADOS Testing', explainer: 'ados-testing' },
  'animal-therapy': { label: 'Animal Therapy', explainer: 'animal-therapy' },
  'executive-function-coaching': { label: 'Executive Function Coaching', explainer: 'executive-function-coaching' },
  'feeding-therapy': { label: 'Feeding Therapy', explainer: 'feeding-therapy' },
  'group-therapy': { label: 'Group Therapy', explainer: 'group-therapy' },
  'life-skills': { label: 'Life Skills', explainer: 'life-skills' },
  'mobile-services': { label: 'Mobile Services', explainer: 'mobile-services' },
  'music-therapy': { label: 'Music Therapy', explainer: 'music-therapy' },
  'occupational-therapy': { label: 'Occupational Therapy', explainer: 'occupational-therapy' },
  'parent-coaching': { label: 'Parent Coaching', explainer: 'parent-coaching' },
  'physical-therapy': { label: 'Physical Therapy', explainer: 'physical-therapy' },
  'respite-care': { label: 'Respite Care', explainer: 'respite-care' },
  'speech-therapy': { label: 'Speech Therapy', explainer: 'speech-therapy' },
  'support-groups': { label: 'Support Groups', explainer: 'support-groups' },
  'tutoring': { label: 'Tutoring', explainer: 'tutoring' },
};

const NEARBY_THRESHOLD = 10;

const distance = (a: string, b: string) => {
  const p = COORDS[a];
  const q = COORDS[b];
  if (!p || !q) return Number.POSITIVE_INFINITY;
  const dLat = (p.latitude - q.latitude) * 69;
  const dLng = (p.longitude - q.longitude) * 69 * Math.cos((p.latitude * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

export default function ProvidersByCity() {
  const { serviceSlug, citySlug } = useParams<{ serviceSlug: string; citySlug: string }>();

  const page = useMemo(
    () => PAGES.find((p) => p.service === serviceSlug && p.citySlug === citySlug) || null,
    [serviceSlug, citySlug]
  );

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers-by-city', page?.service, page?.city],
    enabled: !!page,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('resource_type', 'provider')
        .eq('canonical_city', page!.city)
        .contains('services', [page!.service])
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []) as ProviderResource[];
    },
  });

  // Featured tier ordering is paid placement and must hold on every page: every paying
  // tier outranks free listings, and higher tiers only outrank lower ones when both are present.
  const ordered = useMemo(() => {
    const tierOf = (p: ProviderResource): 'premium' | 'enhanced' | 'basic' | 'other' => {
      const t = (p.featured_tier || '').toLowerCase();
      if (t === 'premium') return 'premium';
      if (t === 'enhanced') return 'enhanced';
      if (t === 'basic') return 'basic';
      return 'other';
    };
    const featured = providers.filter((p) => p.featured);
    const nonFeatured = providers.filter((p) => !p.featured);

    const dateStr = new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed = ((seed << 5) - seed + dateStr.charCodeAt(i)) | 0;
    }
    const seededRandom = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed & 0x7fffffff) / 2147483647;
    };
    const shuffled = [...nonFeatured];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return [
      ...featured.filter((p) => tierOf(p) === 'premium'),
      ...featured.filter((p) => tierOf(p) === 'enhanced'),
      ...featured.filter((p) => tierOf(p) === 'basic'),
      ...featured.filter((p) => tierOf(p) === 'other'),
      ...shuffled,
    ];
  }, [providers]);

  const googlePlaceIds = useMemo(
    () => ordered.map((p) => p.google_place_id).filter((id): id is string => !!id),
    [ordered]
  );
  const { ratings } = useProviderRatings(googlePlaceIds);

  const zips = useMemo(
    () => [...new Set(providers.map((p) => p.zip_code).filter(Boolean))].sort(),
    [providers]
  );

  const sameCityServices = useMemo(
    () =>
      PAGES.filter((p) => p.citySlug === citySlug && p.service !== serviceSlug).sort(
        (a, b) => b.providers - a.providers
      ),
    [citySlug, serviceSlug]
  );

  const nearbyCities = useMemo(() => {
    if (!page || page.providers >= NEARBY_THRESHOLD) return [];
    return PAGES.filter((p) => p.service === page.service && p.citySlug !== page.citySlug)
      .map((p) => ({ ...p, miles: distance(page.city, p.city) }))
      .filter((p) => Number.isFinite(p.miles))
      .sort((a, b) => a.miles - b.miles)
      .slice(0, 5);
  }, [page]);

  if (!page) {
    return (
      <>
        <Helmet>
          <title>Page Not Found | Florida Autism Services</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">We don't have a page for that yet</h1>
          <p className="text-gray-600 mb-6">
            There aren't enough listed providers for that service and city to make a useful page.
            Search the full directory instead.
          </p>
          <Link to="/providers">
            <Button>Browse all providers</Button>
          </Link>
        </div>
      </>
    );
  }

  const meta = SERVICE_LABELS[page.service];
  const label = meta?.label || page.service;
  const title = `${label} in ${page.cityName}, FL`;
  const canonical = `https://floridaautismservices.com/providers/${page.service}/${page.citySlug}`;
  const count = providers.length;

  return (
    <>
      <Helmet>
        <title>{`${title} | Florida Autism Services`}</title>
        <meta
          name="description"
          content={`${count || page.providers} ${label} providers listed in ${page.cityName}, Florida. Phone numbers, websites and locations from the Florida Autism Services directory.`}
        />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Providers', item: 'https://floridaautismservices.com/providers' },
              { '@type': 'ListItem', position: 2, name: title, item: canonical },
            ],
          })}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/providers" className="hover:text-teal-600">Providers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {label} in {page.cityName}, Florida
        </h1>

        <p className="mt-3 text-lg sm:text-xl font-semibold text-gray-800">
          {isLoading ? 'Loading providers…' : `${count} ${count === 1 ? 'provider' : 'providers'} listed`}
          {zips.length > 0 && (
            <span> across {zips.length} ZIP {zips.length === 1 ? 'code' : 'codes'}</span>
          )}
        </p>

        {meta && (
          <p className="mt-4 text-sm text-gray-600">
            <Link to={`/resources/services/${meta.explainer}`} className="text-teal-600 hover:underline font-medium">
              What is {label}? <ArrowRight className="inline w-3.5 h-3.5" />
            </Link>
          </p>
        )}

        <div className="mt-8">
          {isLoading ? (
            <p className="text-gray-500">Loading…</p>
          ) : count === 0 ? (
            <p className="text-gray-600">
              No providers are currently listed. <Link to="/providers" className="text-teal-600 hover:underline">Browse the full directory</Link>.
            </p>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className="space-y-3 sm:space-y-4">
                {ordered.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                  />
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <Link to={`/providers?service=${page.service}`}>
            <Button variant="outline">Refine these results in the full directory</Button>
          </Link>
        </div>

        {sameCityServices.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Other services in {page.cityName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {sameCityServices.map((p) => (
                <Link
                  key={p.service}
                  to={`/providers/${p.service}/${p.citySlug}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-800 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {SERVICE_LABELS[p.service]?.label || p.service} ({p.providers})
                </Link>
              ))}
            </div>
          </div>
        )}

        {nearbyCities.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {label} in nearby cities
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearbyCities.map((p) => (
                <Link
                  key={p.citySlug}
                  to={`/providers/${p.service}/${p.citySlug}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {p.cityName} ({p.providers})
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
