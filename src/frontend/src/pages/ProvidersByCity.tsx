import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
// `Map` is aliased: the bare name would shadow the global Map constructor used to tally chips.
import { ArrowRight, Crosshair, List, Map as MapIcon, MapPin, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  'adult-day-training': { label: 'Adult Day Training', explainer: 'adult-day-training' },
  'animal-therapy': { label: 'Animal Therapy', explainer: 'animal-therapy' },
  'autism-travel': { label: 'Autism Travel', explainer: 'autism-travel' },
  'executive-function-coaching': { label: 'Executive Function Coaching', explainer: 'executive-function-coaching' },
  'feeding-therapy': { label: 'Feeding Therapy', explainer: 'feeding-therapy' },
  'financial-planning': { label: 'Financial Planning', explainer: 'financial-planning' },
  'group-therapy': { label: 'Group Therapy', explainer: 'group-therapy' },
  'in-home-nursing': { label: 'In-Home Nursing', explainer: 'in-home-nursing' },
  'life-skills': { label: 'Life Skills', explainer: 'life-skills' },
  'mobile-services': { label: 'Mobile Services', explainer: 'mobile-services' },
  'music-therapy': { label: 'Music Therapy', explainer: 'music-therapy' },
  'occupational-therapy': { label: 'Occupational Therapy', explainer: 'occupational-therapy' },
  'parent-coaching': { label: 'Parent Coaching', explainer: 'parent-coaching' },
  'physical-therapy': { label: 'Physical Therapy', explainer: 'physical-therapy' },
  'prevocational-training': { label: 'Prevocational Training', explainer: 'prevocational-training' },
  'recreation-programs': { label: 'Recreation Programs', explainer: 'recreation-programs' },
  'respite-care': { label: 'Respite Care', explainer: 'respite-care' },
  'speech-therapy': { label: 'Speech Therapy', explainer: 'speech-therapy' },
  'support-groups': { label: 'Support Groups', explainer: 'support-groups' },
  'supported-employment': { label: 'Supported Employment', explainer: 'supported-employment' },
  'supported-living': { label: 'Supported Living', explainer: 'supported-living' },
  'tutoring': { label: 'Tutoring', explainer: 'tutoring' },
};

// Chips are derived from the values actually present on the page, so an unmapped slug renders
// de-slugged rather than disappearing — a missing label must never silently drop a filter.
const INSURANCE_LABELS: Record<string, string> = {
  'accepts-most-insurances': 'Accepts Most Insurances',
  'florida-medicaid': 'Florida Medicaid',
  'medicare': 'Medicare',
  'aetna': 'Aetna',
  'cigna': 'Cigna',
  'tricare': 'TRICARE',
  'humana': 'Humana',
  'florida-blue': 'Florida Blue',
  'unitedhealthcare': 'UnitedHealthcare',
  'sunshine-health': 'Sunshine Health',
  'early-steps': 'Early Steps',
  'childrens-medical-services': 'CMS - Sunshine',
  'avmed': 'AvMed',
  'oscar': 'Oscar Health',
  'allegiance': 'Allegiance',
  'evernorth': 'Evernorth',
  'wellcare': 'WellCare',
  'molina': 'Molina',
  'florida-kidcare': 'Florida KidCare',
  'florida-healthcare-plans': 'Florida Healthcare Plans',
  'simply-healthcare': 'Simply Healthcare',
  'community-care-plan': 'Community Care Plan',
  'curative': 'Curative',
};

const deSlug = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const NEARBY_THRESHOLD = 10;

const distance = (a: string, b: string) => {
  const p = COORDS[a];
  const q = COORDS[b];
  if (!p || !q) return Number.POSITIVE_INFINITY;
  const dLat = (p.latitude - q.latitude) * 69;
  const dLng = (p.longitude - q.longitude) * 69 * Math.cos((p.latitude * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

type ZipCentroids = Record<string, [number, number]>;

// Every provider on this page is already in one city, so a city-scale fix cannot separate
// them. Without GPS the browser falls back to IP/WiFi triangulation, which would produce an
// authoritative-looking random reorder. Refuse anything coarser than ~5 miles.
const MAX_ACCURACY_METERS = 8000;

const milesBetween = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 3959 * 2 * Math.asin(Math.sqrt(h));
};

// Exact coordinates win; a ZIP centroid is a labelled fallback; anything else is unrankable
// and must be kept out of the comparator entirely.
const coordsFor = (p: ProviderResource, zips: ZipCentroids | null) => {
  if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
    return { lat: p.latitude, lng: p.longitude, approximate: false };
  }
  const zip = (p.zip_code || '').trim().match(/^\d{5}/)?.[0];
  const hit = zip && zips ? zips[zip] : undefined;
  return hit ? { lat: hit[0], lng: hit[1], approximate: true } : null;
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

  const [origin, setOrigin] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [zipInput, setZipInput] = useState('');
  const [zipError, setZipError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'denied' | 'imprecise'>('idle');
  const [zipCentroids, setZipCentroids] = useState<ZipCentroids | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // ~32 KB of ZIP centroids that most visitors never need. Loading it on first use keeps it
  // out of the initial payload of all 373 pages; it serves both the typed-ZIP lookup and the
  // missing-coordinate backfill, neither of which matters until a location is set.
  const loadZipCentroids = async (): Promise<ZipCentroids> => {
    if (zipCentroids) return zipCentroids;
    const mod = await import('@/data/flZipCentroids.json');
    const table = (mod.default ?? mod) as unknown as ZipCentroids;
    setZipCentroids(table);
    return table;
  };

  // Leaflet is ~150 KB and most visitors never open the map, so it loads on first toggle only.
  // The ZIP table comes with it: without it, every provider missing a real coordinate would
  // silently vanish from the map rather than appearing as an approximate marker.
  useEffect(() => {
    if (viewMode !== 'map' || typeof window === 'undefined' || MapComponent) return;

    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    void loadZipCentroids();
    import('react-leaflet').then((module) => setMapComponent(() => module));
  }, [viewMode, MapComponent]);

  const applyZip = async (e: FormEvent) => {
    e.preventDefault();
    const zip = zipInput.trim();
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Enter a 5-digit ZIP code.');
      return;
    }
    const table = await loadZipCentroids();
    const point = table[zip];
    if (!point) {
      setZipError(`We don't have a location for ${zip}.`);
      return;
    }
    setZipError(null);
    setGeoStatus('idle');
    setOrigin({ lat: point[0], lng: point[1], label: zip });
  };

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (position.coords.accuracy > MAX_ACCURACY_METERS) {
          setGeoStatus('imprecise');
          return;
        }
        await loadZipCentroids();
        setZipError(null);
        setGeoStatus('idle');
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'your location',
        });
      },
      () => setGeoStatus('denied'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const clearLocation = () => {
    setOrigin(null);
    setZipInput('');
    setZipError(null);
    setGeoStatus('idle');
  };

  // Chip vocabulary comes from this page's own records, never from a global option list, so a
  // chip can never return zero on arrival. The page's own service is excluded because every
  // record carries it by construction — the page IS that filter.
  const { insuranceChips, serviceChips } = useMemo(() => {
    const tally = (pick: (p: ProviderResource) => string[] | null) => {
      const counts = new Map<string, number>();
      for (const p of providers) {
        for (const v of pick(p) || []) counts.set(v, (counts.get(v) || 0) + 1);
      }
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, count }));
    };
    return {
      insuranceChips: tally((p) => p.insurances),
      serviceChips: tally((p) => p.services).filter((c) => c.value !== page?.service),
    };
  }, [providers, page?.service]);

  const matches = (p: ProviderResource, ins: string[], svc: string[]) =>
    (ins.length === 0 || ins.some((v) => (p.insurances || []).includes(v))) &&
    (svc.length === 0 || svc.every((v) => (p.services || []).includes(v)));

  const filteredProviders = useMemo(
    () => providers.filter((p) => matches(p, selectedInsurances, selectedServices)),
    [providers, selectedInsurances, selectedServices]
  );

  const hasFilters = selectedInsurances.length > 0 || selectedServices.length > 0;

  const clearFilters = () => {
    setSelectedInsurances([]);
    setSelectedServices([]);
  };

  // A chip that would empty the list is dimmed rather than hidden — a chip vanishing mid-click
  // moves the ones next to it and makes the row feel unstable.
  const wouldYield = (facet: 'ins' | 'svc', value: string) => {
    const ins = facet === 'ins' ? [...selectedInsurances, value] : selectedInsurances;
    const svc = facet === 'svc' ? [...selectedServices, value] : selectedServices;
    return providers.filter((p) => matches(p, ins, svc)).length;
  };

  const toggle = (facet: 'ins' | 'svc', value: string) => {
    const [list, set] =
      facet === 'ins'
        ? [selectedInsurances, setSelectedInsurances]
        : [selectedServices, setSelectedServices];
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  // Featured tier ordering is paid placement and must hold on every page: every paying
  // tier outranks free listings, and higher tiers only outrank lower ones when both are present.
  const { featuredOrdered, nonFeaturedRanked } = useMemo(() => {
    const tierOf = (p: ProviderResource): 'premium' | 'enhanced' | 'basic' | 'other' => {
      const t = (p.featured_tier || '').toLowerCase();
      if (t === 'premium') return 'premium';
      if (t === 'enhanced') return 'enhanced';
      if (t === 'basic') return 'basic';
      return 'other';
    };
    const featured = filteredProviders.filter((p) => p.featured);
    const nonFeatured = filteredProviders.filter((p) => !p.featured);

    // Free listings only: completeness ordering, shuffle breaks ties within a rank.
    const rankOf = (p: ProviderResource): number => {
      const v = !!p.verified;
      const w = !!p.website;
      if (v && w) return 0;
      if (v) return 1;
      if (w) return 2;
      return 3;
    };

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
    shuffled.sort((a, b) => rankOf(a) - rankOf(b));

    return {
      featuredOrdered: [
        ...featured.filter((p) => tierOf(p) === 'premium'),
        ...featured.filter((p) => tierOf(p) === 'enhanced'),
        ...featured.filter((p) => tierOf(p) === 'basic'),
        ...featured.filter((p) => tierOf(p) === 'other'),
      ],
      nonFeaturedRanked: shuffled,
    };
  }, [filteredProviders]);

  // Distance replaces the completeness sort within the non-featured remainder only; the paid
  // tier blocks above are never reordered. Providers without a usable coordinate are
  // partitioned out BEFORE sorting rather than given Infinity — Infinity minus Infinity is
  // NaN, and a NaN comparator silently leaves the whole array in an arbitrary order.
  const byDistance = useMemo(() => {
    if (!origin) return null;
    const locatable: { provider: ProviderResource; miles: number; approximate: boolean }[] = [];
    const unlocatable: ProviderResource[] = [];
    for (const provider of nonFeaturedRanked) {
      const c = coordsFor(provider, zipCentroids);
      if (!c) unlocatable.push(provider);
      else
        locatable.push({
          provider,
          miles: milesBetween(origin.lat, origin.lng, c.lat, c.lng),
          approximate: c.approximate,
        });
    }
    locatable.sort((a, b) => a.miles - b.miles);
    return { locatable, unlocatable };
  }, [origin, zipCentroids, nonFeaturedRanked]);

  const ordered = useMemo(
    () => [...featuredOrdered, ...nonFeaturedRanked],
    [featuredOrdered, nonFeaturedRanked]
  );

  // Exact and ZIP-derived points are kept apart all the way to the marker: they are drawn
  // differently, and conflating them would put a precise-looking dot on a whole ZIP code.
  const mapPoints = useMemo(() => {
    const points: { provider: ProviderResource; lat: number; lng: number; approximate: boolean }[] = [];
    for (const provider of ordered) {
      const c = coordsFor(provider, zipCentroids);
      if (c) points.push({ provider, lat: c.lat, lng: c.lng, approximate: c.approximate });
    }
    return points;
  }, [ordered, zipCentroids]);

  const approximateCount = mapPoints.filter((p) => p.approximate).length;

  const mapCenter = useMemo((): [number, number] => {
    if (mapPoints.length > 0) {
      const lat = mapPoints.reduce((s, p) => s + p.lat, 0) / mapPoints.length;
      const lng = mapPoints.reduce((s, p) => s + p.lng, 0) / mapPoints.length;
      return [lat, lng];
    }
    const c = page ? COORDS[page.city] : null;
    return c ? [c.latitude, c.longitude] : [27.9944, -81.7603];
  }, [mapPoints, page]);

  // MapContainer only reads center/zoom on mount, so fitting has to happen from inside it.
  const MapBoundsUpdater = ({ points }: { points: typeof mapPoints }) => {
    const map = MapComponent?.useMap();
    useEffect(() => {
      if (!map || points.length === 0) return;
      if (points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 13);
        return;
      }
      map.fitBounds(
        points.map((p) => [p.lat, p.lng] as [number, number]),
        { padding: [40, 40], maxZoom: 14 }
      );
    }, [map, points]);
    return null;
  };

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

        {count > 0 && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            {origin ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-gray-700">
                  Sorted by distance from <span className="font-semibold">{origin.label}</span>
                </p>
                <Button variant="ghost" size="sm" onClick={clearLocation}>
                  Clear
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <form onSubmit={applyZip} className="order-2 flex gap-2 sm:order-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="ZIP code"
                    aria-label="ZIP code to sort by distance"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
                    className="w-32 bg-white"
                  />
                  <Button type="submit" size="sm">
                    Sort by distance
                  </Button>
                </form>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useMyLocation}
                  disabled={geoStatus === 'loading'}
                  className="order-1 bg-white sm:order-2"
                >
                  <Crosshair className="mr-2 h-4 w-4" />
                  {geoStatus === 'loading' ? 'Locating…' : 'Use my location'}
                </Button>
              </div>
            )}
            {zipError && <p className="mt-2 text-sm text-red-600">{zipError}</p>}
            {geoStatus === 'denied' && (
              <p className="mt-2 text-sm text-gray-600">
                We couldn't get your location. Enter a ZIP code instead.
              </p>
            )}
            {geoStatus === 'imprecise' && (
              <p className="mt-2 text-sm text-gray-600">
                Your location isn't precise enough to rank providers inside one city. Enter a ZIP
                code instead.
              </p>
            )}
          </div>
        )}

        {count > 0 && (insuranceChips.length > 0 || serviceChips.length > 0) && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
            {insuranceChips.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Accepts insurance
                </p>
                <div className="flex flex-wrap gap-2">
                  {insuranceChips.map(({ value, count: n }) => {
                    const active = selectedInsurances.includes(value);
                    const dead = !active && wouldYield('ins', value) === 0;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggle('ins', value)}
                        disabled={dead}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          active
                            ? 'border-purple-300 bg-purple-100 font-semibold text-purple-800'
                            : dead
                              ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                              : 'border-purple-200 bg-white text-purple-800 hover:bg-purple-50'
                        }`}
                      >
                        {INSURANCE_LABELS[value] || deSlug(value)}
                        <span className={active ? 'ml-1 text-purple-600' : 'ml-1 text-gray-400'}>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {serviceChips.length > 0 && (
              <div className={insuranceChips.length > 0 ? 'mt-3 border-t border-gray-100 pt-3' : ''}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Also offers
                </p>
                <div className="flex flex-wrap gap-2">
                  {serviceChips.map(({ value, count: n }) => {
                    const active = selectedServices.includes(value);
                    const dead = !active && wouldYield('svc', value) === 0;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggle('svc', value)}
                        disabled={dead}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          active
                            ? 'border-blue-300 bg-blue-100 font-semibold text-blue-800'
                            : dead
                              ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                              : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50'
                        }`}
                      >
                        {SERVICE_LABELS[value]?.label || deSlug(value)}
                        <span className={active ? 'ml-1 text-blue-600' : 'ml-1 text-gray-400'}>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {hasFilters && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{filteredProviders.length}</span> of {count}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {count > 0 && (
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'list' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'map' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            </div>
          )}
          <Link to={`/providers?service=${page.service}`}>
            <Button variant="outline">Refine these results in the full directory</Button>
          </Link>
        </div>

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
          ) : filteredProviders.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <p className="text-gray-700">No providers match these filters.</p>
              <Button variant="outline" size="sm" className="mt-3 bg-white" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : viewMode === 'map' ? (
            <div>
              <div className="h-[480px] overflow-hidden rounded-lg border border-gray-200">
                {!MapComponent ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Loading map…
                  </div>
                ) : mapPoints.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <MapPin className="mb-3 h-10 w-10 text-gray-400" />
                    <p className="text-gray-600">
                      None of these providers have a mappable location yet.
                    </p>
                  </div>
                ) : (
                  <MapComponent.MapContainer
                    center={mapCenter}
                    zoom={11}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <MapComponent.TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapBoundsUpdater points={mapPoints} />
                    {mapPoints.map(({ provider, lat, lng, approximate }) => (
                      <MapComponent.CircleMarker
                        key={provider.id}
                        center={[lat, lng]}
                        radius={approximate ? 14 : 8}
                        fillColor="#0d9488"
                        fillOpacity={approximate ? 0.12 : 1}
                        stroke={true}
                        color={approximate ? '#0d9488' : '#ffffff'}
                        weight={approximate ? 2 : 3}
                        dashArray={approximate ? '4, 4' : undefined}
                      >
                        <MapComponent.Popup>
                          <p className="font-semibold">{provider.name}</p>
                          {provider.address && (
                            <p className="text-gray-600">{provider.address}</p>
                          )}
                          {approximate ? (
                            <p className="mt-1 italic text-gray-500">
                              Approximate — placed at the centre of ZIP {provider.zip_code}, not at
                              the provider's address.
                            </p>
                          ) : null}
                          {provider.slug && (
                            <Link
                              to={`/providers/${provider.slug}`}
                              className="mt-1 inline-block font-medium text-teal-600 hover:underline"
                            >
                              View details
                            </Link>
                          )}
                        </MapComponent.Popup>
                      </MapComponent.CircleMarker>
                    ))}
                  </MapComponent.MapContainer>
                )}
              </div>

              {MapComponent && mapPoints.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-600 ring-1 ring-gray-300" />
                    Exact address
                  </span>
                  {approximateCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-dashed border-teal-600 bg-teal-600/10" />
                      Approximate — ZIP code area only ({approximateCount})
                    </span>
                  )}
                  {ordered.length > mapPoints.length && (
                    <span>{ordered.length - mapPoints.length} not mappable</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className="space-y-3 sm:space-y-4">
                {featuredOrdered.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                  />
                ))}

                {byDistance
                  ? byDistance.locatable.map(({ provider, miles, approximate }) => (
                      <div key={provider.id}>
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-sm font-semibold text-teal-700">
                            <MapPin className="h-4 w-4" />
                            {approximate ? `~${Math.round(miles)} mi` : `${miles.toFixed(1)} mi`}
                          </span>
                          {approximate && (
                            <span className="text-xs text-gray-500">
                              approximate — based on ZIP code
                            </span>
                          )}
                        </div>
                        <ProviderCard
                          provider={provider}
                          rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                        />
                      </div>
                    ))
                  : nonFeaturedRanked.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                      />
                    ))}

                {byDistance && byDistance.unlocatable.length > 0 && (
                  <>
                    <h2 className="border-t border-gray-200 pt-6 text-sm font-semibold text-gray-700">
                      Distance unavailable ({byDistance.unlocatable.length})
                    </h2>
                    {byDistance.unlocatable.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                      />
                    ))}
                  </>
                )}
              </div>
            </TooltipProvider>
          )}
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
