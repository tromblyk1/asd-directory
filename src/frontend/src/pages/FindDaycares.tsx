import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, ChevronDown, Filter, Map, List, Navigation, Phone, MapPin, Crosshair, RefreshCw, Baby, ChevronUp, HeartPulse, GraduationCap, ArrowRight } from 'lucide-react';
import { DaycareCard } from '@/components/DaycareCard';
import type { DaycareListItem } from '@/components/DaycareCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const DAYCARES_PER_PAGE = 50;
const DEFAULT_SEARCH_RADIUS = 25; // miles
const MAX_MAP_DAYCARES = 500;

// Haversine formula to calculate distance between two coordinates in miles
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Feature filter options (boolean fields from daycares table)
const featureFilterOptions = [
  { value: 'on_site_therapy', label: 'On-Site Therapy' },
  { value: 'aba_on_site', label: 'ABA on Site' },
  { value: 'accepts_scholarships', label: 'Accepts Scholarships' },
  { value: 'accepts_medicaid', label: 'Accepts Medicaid' },
  { value: 'vpk_provider', label: 'VPK Provider' },
  { value: 'inclusive_classroom', label: 'Inclusive Classroom' },
  { value: 'autism_specific', label: 'Autism Specific' },
];

export default function FindDaycares() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [agesServedSearch, setAgesServedSearch] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState<'all' | 'daycare' | 'ppec'>('all');
  const [countySearchTerm, setCountySearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(DAYCARES_PER_PAGE);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Location-based map state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'denied' | 'success'>('idle');
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState(DEFAULT_SEARCH_RADIUS);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const mapRef = useRef<any>(null);

  // Load map dynamically when needed
  useEffect(() => {
    if (viewMode === 'map' && typeof window !== 'undefined' && !MapComponent) {
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      Promise.all([
        import('react-leaflet'),
        import('leaflet'),
      ]).then(([module, L]) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        setMapComponent(() => module);
      });
    }
  }, [viewMode, MapComponent]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(DAYCARES_PER_PAGE);
  }, [searchTerm, selectedCounties, selectedFeatures, agesServedSearch, recordTypeFilter]);

  // Fetch from BOTH daycares and ppec_centers tables
  const { data: allDaycares = [], isLoading } = useQuery({
    queryKey: ['daycares-and-ppec'],
    queryFn: async () => {
      // Fetch daycares table (paginated for large datasets)
      let daycareRecords: DaycareListItem[] = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('daycares')
          .select('*')
          .order('name', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          console.error('Error fetching daycares:', error);
          throw error;
        }

        if (!data || data.length === 0) break;

        daycareRecords = [
          ...daycareRecords,
          ...data.map((d: any) => ({ ...d, record_type: 'daycare' as const })),
        ];

        if (data.length < pageSize) break;
        from += pageSize;
      }

      // Fetch ppec_centers table
      const { data: ppecData, error: ppecError } = await supabase
        .from('ppec_centers')
        .select('*')
        .order('name', { ascending: true });

      if (ppecError) {
        console.error('Error fetching PPEC centers:', ppecError);
        throw ppecError;
      }

      const ppecRecords: DaycareListItem[] = (ppecData || []).map((p: any) => ({
        ...p,
        record_type: 'ppec' as const,
      }));

      // Merge and sort by name
      const merged = [...daycareRecords, ...ppecRecords].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );

      console.log(`✅ Loaded ${daycareRecords.length} daycares + ${ppecRecords.length} PPEC centers = ${merged.length} total`);
      return merged;
    },
  });

  // Stats
  const daycareCount = useMemo(() => allDaycares.filter(d => d.record_type === 'daycare').length, [allDaycares]);
  const ppecCount = useMemo(() => allDaycares.filter(d => d.record_type === 'ppec').length, [allDaycares]);

  // Memoize counties
  const counties = useMemo(() => {
    return [...new Set(
      allDaycares
        .map(d => d.county)
        .filter(Boolean)
        .map(county => toTitleCase(county as string))
    )].sort();
  }, [allDaycares]);

  // Memoize filtered counties
  const filteredCounties = useMemo(() => {
    return counties.filter(county =>
      county.toLowerCase().includes(countySearchTerm.toLowerCase())
    );
  }, [counties, countySearchTerm]);

  // Filter daycares
  const filteredDaycares = useMemo(() => {
    return allDaycares.filter(daycare => {
      // Record type filter
      if (recordTypeFilter === 'daycare' && daycare.record_type !== 'daycare') return false;
      if (recordTypeFilter === 'ppec' && daycare.record_type !== 'ppec') return false;

      // Search filter
      const matchesSearch = !searchTerm ||
        daycare.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        daycare.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        daycare.county?.toLowerCase().includes(searchTerm.toLowerCase());

      // County filter
      const matchesCounty = selectedCounties.length === 0 ||
        selectedCounties.some(county =>
          toTitleCase(daycare.county || '').includes(county)
        );

      // Ages served filter (text search)
      const matchesAges = !agesServedSearch ||
        daycare.ages_served?.toLowerCase().includes(agesServedSearch.toLowerCase());

      // Feature filters (boolean AND - must have ALL selected features)
      const matchesFeatures = selectedFeatures.length === 0 ||
        selectedFeatures.every(feature =>
          (daycare as any)[feature] === true
        );

      return matchesSearch && matchesCounty && matchesAges && matchesFeatures;
    });
  }, [allDaycares, searchTerm, selectedCounties, agesServedSearch, selectedFeatures, recordTypeFilter]);

  // Request user's location
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setSearchCenter([latitude, longitude]);
        setLocationStatus('success');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Handle map move
  const handleMapMove = (center: [number, number]) => {
    if (!searchCenter) return;

    const distance = calculateDistance(
      searchCenter[0], searchCenter[1],
      center[0], center[1]
    );

    if (distance > 5) {
      setMapCenter(center);
      setShowSearchAreaButton(true);
    } else {
      setShowSearchAreaButton(false);
    }
  };

  // Search the current map area
  const searchThisArea = () => {
    if (mapCenter) {
      setSearchCenter(mapCenter);
      setShowSearchAreaButton(false);
    }
  };

  // Clear location search
  const clearLocationSearch = () => {
    setSearchCenter(null);
    setUserLocation(null);
    setMapCenter(null);
    setLocationStatus('idle');
    setShowSearchAreaButton(false);
  };

  // Map event handler component
  const MapEventHandler = ({ onMove }: { onMove: (center: [number, number]) => void }) => {
    const map = MapComponent?.useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        onMove([center.lat, center.lng]);
      },
    });
    return null;
  };

  // Auto-zoom to user location
  const MapCenterUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = MapComponent?.useMap();

    React.useEffect(() => {
      if (map && center && searchCenter) {
        map.flyTo(center, zoom, { duration: 1 });
      }
    }, [map, center, zoom]);

    return null;
  };

  // Auto-zoom to fit county filter results
  const MapBoundsUpdater = ({
    daycares: mapDaycares,
    hasCountyFilters,
    hasOtherFilters
  }: {
    daycares: DaycareListItem[];
    hasCountyFilters: boolean;
    hasOtherFilters: boolean;
  }) => {
    const map = MapComponent?.useMap();

    React.useEffect(() => {
      if (!map || searchCenter || !hasCountyFilters || hasOtherFilters || mapDaycares.length === 0) {
        return;
      }

      const coords = mapDaycares
        .filter(d => d.latitude && d.longitude)
        .map(d => [Number(d.latitude), Number(d.longitude)] as [number, number]);

      if (coords.length === 0) return;

      map.fitBounds(coords, {
        padding: [50, 50],
        maxZoom: 12,
        duration: 1
      });
    }, [map, mapDaycares, hasCountyFilters, hasOtherFilters]);

    return null;
  };

  // Get display center for map
  const displayMapCenter = useMemo(() => {
    if (mapCenter) return mapCenter;
    if (searchCenter) return searchCenter;
    return [27.9944024, -81.7602544] as [number, number]; // Florida center
  }, [mapCenter, searchCenter]);

  // Location-filtered daycares (for map display)
  const locationFilteredDaycares = useMemo(() => {
    if (!searchCenter) return [];

    return filteredDaycares.filter(daycare => {
      if (!daycare.latitude || !daycare.longitude) return false;
      const distance = calculateDistance(
        searchCenter[0], searchCenter[1],
        Number(daycare.latitude), Number(daycare.longitude)
      );
      return distance <= searchRadius;
    });
  }, [filteredDaycares, searchCenter, searchRadius]);

  // Daycares with coordinates for map
  const mappableDaycares = useMemo(() => {
    if (searchCenter) {
      return locationFilteredDaycares;
    }
    return filteredDaycares.filter(d => d.latitude && d.longitude);
  }, [filteredDaycares, locationFilteredDaycares, searchCenter]);

  // Determine if map should render
  const shouldRenderMap = useMemo(() => {
    if (searchCenter) {
      return locationFilteredDaycares.length <= MAX_MAP_DAYCARES;
    }

    const hasOnlyCountyFilters = selectedCounties.length > 0 &&
      selectedFeatures.length === 0 &&
      !agesServedSearch;

    if (hasOnlyCountyFilters) {
      return filteredDaycares.length <= 1500;
    }

    return filteredDaycares.length <= MAX_MAP_DAYCARES;
  }, [filteredDaycares, locationFilteredDaycares, searchCenter, selectedCounties, selectedFeatures, agesServedSearch]);

  // Visible daycares with pagination
  const visibleDaycares = useMemo(() => {
    return filteredDaycares.slice(0, visibleCount);
  }, [filteredDaycares, visibleCount]);

  // Distance calculations for visible daycares
  const daycareDistances = useMemo(() => {
    if (!userLocation) return {};
    const distances: Record<string, number> = {};
    visibleDaycares.forEach(d => {
      if (d.latitude && d.longitude) {
        distances[`${d.record_type}-${d.id}`] = calculateDistance(
          userLocation[0], userLocation[1],
          Number(d.latitude), Number(d.longitude)
        );
      }
    });
    return distances;
  }, [visibleDaycares, userLocation]);

  const hasMoreDaycares = visibleCount < filteredDaycares.length;
  const remainingCount = filteredDaycares.length - visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + DAYCARES_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedCounties([]);
    setSelectedFeatures([]);
    setAgesServedSearch('');
    setRecordTypeFilter('all');
    setSearchTerm('');
    setCountySearchTerm('');
    setVisibleCount(DAYCARES_PER_PAGE);
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties(prev =>
      prev.includes(county) ? prev.filter(c => c !== county) : [...prev, county]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const activeFiltersCount = selectedCounties.length + selectedFeatures.length +
    (agesServedSearch ? 1 : 0) + (recordTypeFilter !== 'all' ? 1 : 0);

  // Filter panel content (shared between mobile drawer and desktop sidebar)
  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm font-medium text-orange-900">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* 3-Way Type Toggle */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Type
          </h4>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setRecordTypeFilter('all')}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                recordTypeFilter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Show All
            </button>
            <button
              onClick={() => setRecordTypeFilter('daycare')}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium border-x border-gray-200 transition-colors ${
                recordTypeFilter === 'daycare'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Daycares
            </button>
            <button
              onClick={() => setRecordTypeFilter('ppec')}
              className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                recordTypeFilter === 'ppec'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              PPEC
            </button>
          </div>
        </div>

        {/* Ages Served */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Ages Served
          </h4>
          <Input
            type="text"
            placeholder="e.g., infant, toddler, 3-5..."
            value={agesServedSearch}
            onChange={(e) => setAgesServedSearch(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Feature Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Features
          </h4>
          <div className="space-y-2">
            {featureFilterOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${value}`}
                  checked={selectedFeatures.includes(value)}
                  onCheckedChange={() => toggleFeature(value)}
                />
                <Label
                  htmlFor={`feature-${value}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Counties Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Counties ({counties.length})
          </h4>
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search counties..."
              value={countySearchTerm}
              onChange={(e) => setCountySearchTerm(e.target.value)}
              className="pl-8 py-1 text-sm"
            />
          </div>
          <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
            {filteredCounties.map((county) => (
              <div key={county} className="flex items-center space-x-2">
                <Checkbox
                  id={`county-${county}`}
                  checked={selectedCounties.includes(county)}
                  onCheckedChange={() => toggleCounty(county)}
                />
                <Label
                  htmlFor={`county-${county}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {county}
                </Label>
              </div>
            ))}
            {filteredCounties.length === 0 && (
              <p className="text-sm text-gray-500 italic">No counties found</p>
            )}
          </div>
        </div>
      </div>

      {/* Clear All Filters */}
      {(searchTerm || selectedCounties.length > 0 || selectedFeatures.length > 0 || agesServedSearch || recordTypeFilter !== 'all' || userLocation) && (
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCounties([]);
            setSelectedFeatures([]);
            setAgesServedSearch('');
            setRecordTypeFilter('all');
            setCountySearchTerm('');
            setUserLocation(null);
            setLocationStatus('idle');
            setSearchCenter(null);
            setSearchRadius(DEFAULT_SEARCH_RADIUS);
            setMapCenter(null);
            setShowSearchAreaButton(false);
            setVisibleCount(DAYCARES_PER_PAGE);
          }}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <>
      <Helmet>
        <title>Find Daycares & PPEC Centers in Florida | Florida Autism Services</title>
        <meta name="description" content="Search autism-friendly daycares and Prescribed Pediatric Extended Care (PPEC) centers across Florida. Filter by inclusive classrooms, on-site therapy, ABA, Medicaid, VPK, and more." />
        <meta name="keywords" content="autism daycare Florida, PPEC centers Florida, inclusive daycare autism, ABA daycare, special needs childcare Florida, VPK provider autism" />
        <link rel="canonical" href="https://floridaautismservices.com/find-daycares" />
        <meta property="og:title" content="Find Daycares & PPEC Centers in Florida" />
        <meta property="og:description" content="Search autism-friendly daycares and PPEC centers across Florida. Filter by inclusive classrooms, therapy, Medicaid, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/find-daycares" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Find Daycares & PPEC Centers in Florida",
            "description": "Search autism-friendly daycares and PPEC centers across Florida",
            "url": "https://floridaautismservices.com/find-daycares",
            "isPartOf": { "@type": "WebSite", "name": "Florida Autism Services Directory", "url": "https://floridaautismservices.com" },
            "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
              { "@type": "ListItem", "position": 2, "name": "Find Daycares", "item": "https://floridaautismservices.com/find-daycares" }
            ]}
          })}
        </script>
      </Helmet>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Baby className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Find Daycares</h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-orange-50">
            Search autism-friendly daycares and PPEC centers across Florida
          </p>
          <TooltipProvider delayDuration={200}>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-help transition-colors">
                    {daycareCount.toLocaleString()} Daycares
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Licensed childcare centers across Florida</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/guides/childcare-options-autism-florida" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                    {ppecCount.toLocaleString()} PPEC Centers
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Prescribed Pediatric Extended Care centers for medically complex children</p>
                  <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                </TooltipContent>
              </Tooltip>
              <span className="bg-white/30 px-2 sm:px-3 py-1 rounded-full font-medium">
                {allDaycares.length.toLocaleString()} Total
              </span>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* ESE Pre-K Informational Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <Link to="/blog/florida-ese-prek-guide" className="block group">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md p-4 sm:p-6 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Most Florida Families Use Free Public ESE Pre-K</h2>
                <p className="text-orange-100 text-xs sm:text-sm leading-relaxed">
                  Florida's public school system offers free Exceptional Student Education (ESE) Pre-K classrooms for children ages 3–5 with autism and developmental delays — available in every county through your local school district. Because of this statewide program, private inclusive daycare options are very limited. Learn about all your childcare options including ESE Pre-K, PPEC centers, Head Start, and scholarship-funded programs.
                </p>
                <span className="inline-flex items-center gap-1 mt-2 sm:mt-3 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                  Read Our Childcare Guide
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Search and View Toggle */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, city, or county..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 py-5 sm:py-6 text-base sm:text-lg shadow-sm"
            />
          </div>
          <div className="flex gap-2 justify-between sm:justify-start">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex-1 sm:flex-none"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                size="default"
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                size="default"
              >
                <Map className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="lg:hidden mb-4 sm:mb-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <FilterContent />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="border-none shadow-lg sticky top-6">
              <CardContent className="p-6">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  <FilterContent />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <p className="text-sm sm:text-base text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {viewMode === 'list' ? visibleDaycares.length : mappableDaycares.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900">
                  {filteredDaycares.length.toLocaleString()}
                </span>{' '}
                results
                {allDaycares.length > 0 && filteredDaycares.length !== allDaycares.length && (
                  <span className="text-xs sm:text-sm ml-2">({allDaycares.length.toLocaleString()} total)</span>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto" />
                <p className="mt-4 text-gray-600">Loading daycares...</p>
              </div>
            ) : filteredDaycares.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="py-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <TooltipProvider delayDuration={200}>
                <div className="space-y-3 sm:space-y-4">
                  {visibleDaycares.map((daycare) => (
                    <DaycareCard
                      key={`${daycare.record_type}-${daycare.id}`}
                      daycare={daycare}
                      distance={daycareDistances[`${daycare.record_type}-${daycare.id}`] ?? null}
                    />
                  ))}
                </div>
                {hasMoreDaycares && (
                  <div className="mt-6 sm:mt-8 text-center">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      size="lg"
                      className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
                    >
                      <ChevronDown className="w-5 h-5 mr-2" />
                      Load {Math.min(DAYCARES_PER_PAGE, remainingCount)} More
                      <span className="ml-2 text-gray-500">({remainingCount.toLocaleString()} remaining)</span>
                    </Button>
                  </div>
                )}
                {!hasMoreDaycares && filteredDaycares.length > DAYCARES_PER_PAGE && (
                  <div className="mt-6 sm:mt-8 text-center text-gray-500">
                    <p>Showing all {filteredDaycares.length.toLocaleString()} results</p>
                  </div>
                )}
              </TooltipProvider>
            ) : (
              /* Map View */
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
                {!MapComponent ? (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                  </div>
                ) : !shouldRenderMap ? (
                  <div className="h-full flex flex-col items-center justify-center bg-gray-100 p-6 sm:p-8 text-center">
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Too many results to display</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Use your location or filters to narrow down results to {MAX_MAP_DAYCARES} or fewer.
                    </p>
                    <Button onClick={requestUserLocation} disabled={locationStatus === 'loading'}>
                      <Crosshair className="w-4 h-4 mr-2" />
                      Use My Location
                    </Button>
                  </div>
                ) : (
                  <>
                    <MapComponent.MapContainer
                      center={displayMapCenter}
                      zoom={searchCenter ? 10 : 7}
                      className="h-full w-full"
                      ref={mapRef}
                    >
                      <MapComponent.TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapEventHandler onMove={handleMapMove} />
                      <MapCenterUpdater center={displayMapCenter} zoom={searchCenter ? 10 : 7} />
                      <MapBoundsUpdater
                        daycares={mappableDaycares}
                        hasCountyFilters={selectedCounties.length > 0}
                        hasOtherFilters={selectedFeatures.length > 0 || !!agesServedSearch}
                      />

                      {/* User location marker */}
                      {userLocation && (
                        <MapComponent.CircleMarker
                          center={userLocation}
                          radius={8}
                          fillColor="#ea580c"
                          fillOpacity={1}
                          stroke={true}
                          color="#ffffff"
                          weight={3}
                        >
                          <MapComponent.Popup>
                            <p className="font-semibold">Your Location</p>
                          </MapComponent.Popup>
                        </MapComponent.CircleMarker>
                      )}

                      {/* Search radius circle */}
                      {searchCenter && (
                        <MapComponent.Circle
                          center={searchCenter}
                          radius={searchRadius * 1609.34}
                          fillColor="#ea580c"
                          fillOpacity={0.1}
                          stroke={true}
                          color="#ea580c"
                          weight={2}
                          dashArray="5, 5"
                        />
                      )}

                      {/* Daycare markers */}
                      {mappableDaycares.map((daycare) => (
                        <MapComponent.Marker
                          key={`${daycare.record_type}-${daycare.id}`}
                          position={[Number(daycare.latitude), Number(daycare.longitude)]}
                        >
                          <MapComponent.Tooltip
                            direction="top"
                            offset={[0, -20]}
                            opacity={0.95}
                          >
                            <div className="text-center">
                              <p className="font-bold text-sm">{daycare.name}</p>
                              <p className="text-xs text-gray-600">{daycare.city}, FL</p>
                              {daycare.record_type === 'ppec' && (
                                <p className="text-xs text-rose-600 font-semibold mt-1">PPEC Center</p>
                              )}
                            </div>
                          </MapComponent.Tooltip>
                          <MapComponent.Popup>
                            <div className="p-2 min-w-[200px] sm:min-w-[240px]">
                              <Link to={`/daycare/${daycare.slug}`} className="hover:text-orange-600 transition-colors">
                                <h3 className="font-bold text-sm mb-1 hover:underline">{daycare.name}</h3>
                              </Link>
                              <p className="text-xs text-gray-600 mb-2">
                                {daycare.city}, {daycare.state || 'FL'}
                              </p>
                              {daycare.record_type === 'ppec' && (
                                <Link
                                  to="/guides/childcare-options-autism-florida"
                                  className="inline-flex items-center text-xs bg-rose-100 text-rose-800 hover:bg-rose-200 px-1.5 py-0.5 rounded mb-2 transition-colors font-semibold"
                                >
                                  <HeartPulse className="w-3 h-3 mr-1" />
                                  PPEC Center
                                </Link>
                              )}
                              {daycare.ages_served && (
                                <p className="text-xs text-blue-600 mb-2">Ages: {daycare.ages_served}</p>
                              )}
                              {daycare.licensed_beds && (
                                <p className="text-xs text-orange-600 mb-2">
                                  {daycare.licensed_beds} Licensed Beds
                                </p>
                              )}
                              <div className="flex gap-2">
                                {daycare.phone && (
                                  <a href={`tel:${daycare.phone.replace(/[^0-9]/g, '')}`}>
                                    <Button size="sm" variant="outline" className="text-xs">
                                      <Phone className="w-3 h-3 mr-1" />
                                      Call
                                    </Button>
                                  </a>
                                )}
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ""}&destination=${daycare.latitude},${daycare.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm" variant="outline" className="text-xs">
                                    <Navigation className="w-3 h-3 mr-1" />
                                    Directions
                                  </Button>
                                </a>
                              </div>
                            </div>
                          </MapComponent.Popup>
                        </MapComponent.Marker>
                      ))}
                    </MapComponent.MapContainer>

                    {/* Map Stats Overlay */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-[1000]">
                      <Card className="shadow-lg border-none">
                        <CardContent className="p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-medium">
                            <span className="text-orange-600 font-bold">{mappableDaycares.length.toLocaleString()}</span> on map
                          </p>
                          {searchCenter && (
                            <p className="text-xs text-gray-500">
                              Within {searchRadius}mi
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search This Area Button */}
                    {showSearchAreaButton && (
                      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                        <Button
                          onClick={searchThisArea}
                          className="bg-orange-600 hover:bg-orange-700 shadow-lg text-sm"
                          size="sm"
                        >
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Search This Area
                        </Button>
                      </div>
                    )}

                    {/* Location Controls */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-[1000] flex flex-col sm:flex-row gap-2">
                      {searchCenter && (
                        <Button
                          onClick={clearLocationSearch}
                          variant="outline"
                          size="sm"
                          className="bg-white shadow-lg text-xs sm:text-sm"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Clear Location</span>
                        </Button>
                      )}
                      <Button
                        onClick={requestUserLocation}
                        disabled={locationStatus === 'loading'}
                        variant="outline"
                        size="sm"
                        className={`bg-white shadow-lg text-xs sm:text-sm ${
                          locationStatus === 'success' ? 'border-green-500 text-green-700' :
                          locationStatus === 'denied' ? 'border-red-500 text-red-700' : ''
                        }`}
                      >
                        {locationStatus === 'loading' ? (
                          <>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
                            <span className="hidden sm:inline">Locating...</span>
                          </>
                        ) : locationStatus === 'success' ? (
                          <>
                            <Crosshair className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Located</span>
                          </>
                        ) : (
                          <>
                            <Crosshair className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden sm:inline">My Location</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
