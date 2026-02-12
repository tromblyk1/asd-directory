import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, ChevronDown, Filter, Map, List, Navigation, Phone, MapPin, Crosshair, RefreshCw, Baby, ChevronUp } from 'lucide-react';
import { DaycareCard } from '@/components/DaycareCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { PPECCenter } from '@/lib/supabase';

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

// Profit status options for filtering
const profitStatusOptions = [
  { value: 'For-Profit', label: 'For-Profit' },
  { value: 'Not-For-Profit', label: 'Not-For-Profit' },
];

export default function FindDaycares() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedProfitStatus, setSelectedProfitStatus] = useState<string[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState('');
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

      import('react-leaflet').then((module) => {
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
  }, [searchTerm, selectedCounties, selectedProfitStatus, citySearchTerm]);

  // Query the ppec_centers table
  const { data: daycares = [], isLoading } = useQuery({
    queryKey: ['ppec-centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ppec_centers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching daycares:', error);
        throw error;
      }

      return (data || []) as PPECCenter[];
    },
  });

  // Memoize counties
  const counties = useMemo(() => {
    return [...new Set(
      daycares
        .map(d => d.county)
        .filter(Boolean)
        .map(county => toTitleCase(county as string))
    )].sort();
  }, [daycares]);

  // Memoize filtered counties
  const filteredCounties = useMemo(() => {
    return counties.filter(county =>
      county.toLowerCase().includes(countySearchTerm.toLowerCase())
    );
  }, [counties, countySearchTerm]);

  // Filter daycares
  const filteredDaycares = useMemo(() => {
    return daycares.filter(daycare => {
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

      // City filter
      const matchesCity = !citySearchTerm ||
        daycare.city?.toLowerCase().includes(citySearchTerm.toLowerCase());

      // Profit status filter
      const matchesProfitStatus = selectedProfitStatus.length === 0 ||
        selectedProfitStatus.includes(daycare.profit_status || '');

      return matchesSearch && matchesCounty && matchesCity && matchesProfitStatus;
    });
  }, [daycares, searchTerm, selectedCounties, citySearchTerm, selectedProfitStatus]);

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
    daycares: PPECCenter[];
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
      selectedProfitStatus.length === 0;

    if (hasOnlyCountyFilters) {
      return filteredDaycares.length <= 1500;
    }

    return filteredDaycares.length <= MAX_MAP_DAYCARES;
  }, [filteredDaycares, locationFilteredDaycares, searchCenter, selectedCounties, selectedProfitStatus]);

  // Visible daycares with pagination
  const visibleDaycares = useMemo(() => {
    return filteredDaycares.slice(0, visibleCount);
  }, [filteredDaycares, visibleCount]);

  // Distance calculations for visible daycares
  const daycareDistances = useMemo(() => {
    if (!userLocation) return {};
    const distances: Record<string | number, number> = {};
    visibleDaycares.forEach(d => {
      if (d.latitude && d.longitude) {
        distances[d.id] = calculateDistance(
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
    setSelectedProfitStatus([]);
    setSearchTerm('');
    setCitySearchTerm('');
    setCountySearchTerm('');
    setVisibleCount(DAYCARES_PER_PAGE);
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties(prev =>
      prev.includes(county) ? prev.filter(c => c !== county) : [...prev, county]
    );
  };

  const toggleProfitStatus = (status: string) => {
    setSelectedProfitStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const activeFiltersCount = selectedCounties.length + selectedProfitStatus.length + (citySearchTerm ? 1 : 0);

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
        {/* City Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            City
          </h4>
          <Input
            type="text"
            placeholder="Filter by city..."
            value={citySearchTerm}
            onChange={(e) => setCitySearchTerm(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Profit Status Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Profit Status
          </h4>
          <div className="space-y-2">
            {profitStatusOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`profit-${value}`}
                  checked={selectedProfitStatus.includes(value)}
                  onCheckedChange={() => toggleProfitStatus(value)}
                />
                <Label
                  htmlFor={`profit-${value}`}
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
    </>
  );

  return (
    <>
      <Helmet>
        <title>Find Daycares & PPEC Centers in Florida | Florida Autism Services</title>
        <meta name="description" content="Search autism-friendly daycares and Prescribed Pediatric Extended Care (PPEC) centers across Florida. Find licensed childcare facilities near you." />
        <meta name="keywords" content="PPEC centers Florida, autism daycare Florida, pediatric extended care, special needs daycare, childcare autism Florida" />
        <link rel="canonical" href="https://floridaautismservices.com/find-daycares" />
        <meta property="og:title" content="Find Daycares & PPEC Centers in Florida" />
        <meta property="og:description" content="Search autism-friendly daycares and PPEC centers across Florida." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/find-daycares" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
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
            Search licensed childcare and PPEC centers across Florida
          </p>
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">
              {daycares.length} Centers
            </span>
          </div>
        </div>
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
                  {filteredDaycares.length}
                </span>{' '}
                daycares
                {daycares.length > 0 && filteredDaycares.length !== daycares.length && (
                  <span className="text-xs sm:text-sm ml-2">({daycares.length} total)</span>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No daycares found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <div className="space-y-3 sm:space-y-4">
                {visibleDaycares.map((daycare) => (
                  <DaycareCard
                    key={daycare.id}
                    daycare={daycare}
                    distance={daycareDistances[daycare.id] ?? null}
                  />
                ))}
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
                      <span className="ml-2 text-gray-500">({remainingCount} remaining)</span>
                    </Button>
                  </div>
                )}
                {!hasMoreDaycares && filteredDaycares.length > DAYCARES_PER_PAGE && (
                  <div className="mt-6 sm:mt-8 text-center text-gray-500">
                    <p>Showing all {filteredDaycares.length} daycares</p>
                  </div>
                )}
              </div>
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
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Too many daycares to display</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Use your location or filters to narrow down results to {MAX_MAP_DAYCARES} or fewer daycares.
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
                        hasOtherFilters={selectedProfitStatus.length > 0}
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
                          key={daycare.id}
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
                              {daycare.licensed_beds && (
                                <p className="text-xs text-orange-600 mt-1">
                                  {daycare.licensed_beds} beds
                                </p>
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
