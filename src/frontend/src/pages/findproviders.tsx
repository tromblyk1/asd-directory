import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, ChevronDown, Filter, Map, List, Navigation, Phone, MapPin, Crosshair, RefreshCw, Stethoscope, ChevronUp } from 'lucide-react';
import { ProviderCard, ProviderResource } from '@/components/ProviderCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useProviderRatings } from '@/hooks/useProviderRatings';

const PROVIDERS_PER_PAGE = 50;
const DEFAULT_SEARCH_RADIUS = 25; // miles
const MAX_MAP_PROVIDERS = 500;

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

// Service options for filtering - ONLY values that exist in the database
const serviceOptions = [
  { value: 'aba', label: 'ABA Therapy', description: 'Applied Behavior Analysis', tooltip: 'Evidence-based therapy using behavioral principles to teach skills and reduce challenging behaviors' },
  { value: 'speech-therapy', label: 'Speech Therapy', description: 'Communication support', tooltip: 'Helps with verbal communication, language comprehension, and social communication skills' },
  { value: 'occupational-therapy', label: 'Occupational Therapy', description: 'Daily living skills', tooltip: 'Addresses sensory processing, fine motor skills, self-care, and adaptive strategies for daily activities' },
  { value: 'physical-therapy', label: 'Physical Therapy', description: 'Motor development', tooltip: 'Strengthens gross motor skills, balance, coordination, and physical mobility' },
  { value: 'feeding-therapy', label: 'Feeding Therapy', description: 'Eating difficulties support', tooltip: 'Addresses food selectivity, oral motor challenges, and sensory sensitivities around eating' },
  { value: 'music-therapy', label: 'Music Therapy', description: 'Therapeutic music', tooltip: 'Uses music interventions to support communication, emotional regulation, and social interaction' },
  { value: 'dir-floortime', label: 'DIR/Floortime', description: 'Developmental therapy', tooltip: 'Child-led play therapy focusing on emotional connections and developmental milestones' },
  { value: 'life-skills', label: 'Life Skills', description: 'Independence training', tooltip: 'Teaches practical skills like cooking, money management, personal hygiene, and community navigation' },
  { value: 'respite-care', label: 'Respite Care', description: 'Family relief care', tooltip: 'Provides temporary relief for family caregivers through trained support workers' },
  { value: 'pet-therapy', label: 'Pet Therapy', description: 'Animal-assisted therapy', tooltip: 'Therapeutic interventions with trained animals to reduce anxiety and motivate engagement' },
  { value: 'parent-coaching', label: 'Parent Coaching', description: 'Family support', tooltip: 'Trains caregivers in evidence-based techniques to support their child at home' },
  { value: 'tutoring', label: 'Tutoring', description: 'Academic support', tooltip: 'Individualized educational instruction adapted for neurodivergent learning styles' },
  { value: 'group-therapy', label: 'Group Therapy', description: 'Social skills groups', tooltip: 'Structured peer groups for practicing social interactions and relationship-building' },
  { value: 'ados-testing', label: 'ADOS Testing', description: 'Autism diagnostic evaluation', tooltip: 'Gold standard diagnostic assessment tool administered by trained clinicians' },
  { value: 'executive-function-coaching', label: 'Executive Function Coaching', description: 'Organization skills', tooltip: 'Develops planning, organization, time management, and self-regulation skills' },
  { value: 'residential-program', label: 'Residential Program', description: 'Live-in support', tooltip: '24-hour care with comprehensive services for individuals needing intensive support' },
  { value: 'support-groups', label: 'Support Groups', description: 'Peer support meetings', tooltip: 'Connects families and self-advocates sharing lived experiences for mutual support' },
  { value: 'virtual-therapy', label: 'Virtual Therapy', description: 'Telehealth services', tooltip: 'Remote therapy sessions via secure video platforms for convenient access from home' },
  { value: 'mobile-services', label: 'Mobile Services', description: 'In-home or on-site services', tooltip: 'Therapists travel to your home, school, or community location' },
];

// Insurance options for filtering - ONLY values that exist in the database
const insuranceOptions = [
  { value: 'florida-medicaid', label: 'Florida Medicaid' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'aetna', label: 'Aetna' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'tricare', label: 'TRICARE' },
  { value: 'humana', label: 'Humana' },
  { value: 'florida-blue', label: 'Florida Blue' },
  { value: 'unitedhealthcare', label: 'UnitedHealthcare' },
  { value: 'sunshine-health', label: 'Sunshine Health' },
  { value: 'early-steps', label: 'Early Steps' },
  { value: 'childrens-medical-services', label: 'CMS - Sunshine' },
];

// Scholarship options for filtering - ONLY values that exist in the database
const scholarshipOptions = [
  { value: 'fes-ua', label: 'FES-UA', tooltip: 'Family Empowerment Scholarship for Unique Abilities - For students with disabilities including autism' },
  { value: 'fes-eo', label: 'FES-EO', tooltip: 'Family Empowerment Scholarship for Educational Options - Income-based school choice' },
  { value: 'ftc', label: 'FTC', tooltip: 'Florida Tax Credit Scholarship - For low-income families' },
  { value: 'pep', label: 'PEP', tooltip: 'Personalized Education Program - Flexible funding for customized learning' },
];

// Service display info for map popup (slug -> { label, description, resourceSlug })
const servicePopupInfo: Record<string, { label: string; description: string; slug: string }> = {
  'aba': { label: 'ABA', description: 'Applied Behavior Analysis therapy', slug: 'aba-therapy' },
  'speech-therapy': { label: 'Speech', description: 'Speech and language therapy', slug: 'speech-therapy' },
  'occupational-therapy': { label: 'OT', description: 'Occupational therapy', slug: 'occupational-therapy' },
  'physical-therapy': { label: 'PT', description: 'Physical therapy', slug: 'physical-therapy' },
  'feeding-therapy': { label: 'Feeding', description: 'Feeding and swallowing therapy', slug: 'feeding-therapy' },
  'music-therapy': { label: 'Music', description: 'Music therapy', slug: 'music-therapy' },
  'dir-floortime': { label: 'DIR', description: 'DIR/Floortime therapy', slug: 'dir-floortime' },
  'life-skills': { label: 'Life Skills', description: 'Life skills training', slug: 'life-skills' },
  'respite-care': { label: 'Respite', description: 'Respite care services', slug: 'respite-care' },
  'pet-therapy': { label: 'Pet', description: 'Pet/Animal therapy', slug: 'pet-therapy' },
  'parent-coaching': { label: 'Parent', description: 'Parent coaching', slug: 'parent-coaching' },
  'tutoring': { label: 'Tutoring', description: 'Academic tutoring', slug: 'tutoring' },
  'group-therapy': { label: 'Group', description: 'Group therapy', slug: 'group-therapy' },
  'ados-testing': { label: 'ADOS', description: 'ADOS diagnostic testing', slug: 'ados-testing' },
  'executive-function-coaching': { label: 'Exec Func', description: 'Executive function coaching', slug: 'executive-function-coaching' },
  'residential-program': { label: 'Residential', description: 'Residential program', slug: 'residential-program' },
  'virtual-therapy': { label: 'Virtual', description: 'Virtual/telehealth therapy', slug: 'virtual-therapy' },
  'mobile-services': { label: 'Mobile', description: 'Mobile services', slug: 'mobile-services' },
  'support-groups': { label: 'Support', description: 'Support groups', slug: 'support-groups' },
};

// Insurance display info for map popup
const insurancePopupInfo: Record<string, { label: string; description: string; slug: string }> = {
  'florida-medicaid': { label: 'Medicaid', description: 'Florida Medicaid', slug: 'florida-medicaid' },
  'medicare': { label: 'Medicare', description: 'Medicare', slug: 'medicare' },
  'aetna': { label: 'Aetna', description: 'Aetna Insurance', slug: 'aetna' },
  'cigna': { label: 'Cigna', description: 'Cigna Insurance', slug: 'cigna' },
  'humana': { label: 'Humana', description: 'Humana Insurance', slug: 'humana' },
  'tricare': { label: 'TRICARE', description: 'Military TRICARE', slug: 'tricare' },
  'florida-blue': { label: 'FL Blue', description: 'Florida Blue', slug: 'florida-blue' },
  'unitedhealthcare': { label: 'UHC', description: 'UnitedHealthcare', slug: 'unitedhealthcare' },
  'sunshine-health': { label: 'Sunshine', description: 'Sunshine Health', slug: 'sunshine-health' },
  'early-steps': { label: 'Early Steps', description: 'Florida Early Intervention', slug: 'early-steps' },
  'childrens-medical-services': { label: 'CMS - Sunshine', description: 'Children\'s Medical Services', slug: 'childrens-medical-services' },
};

export default function FindProviders() {
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>(() => {
    const param = searchParams.get('county');
    return param ? param.split(',').map(c => toTitleCase(c)) : [];
  });
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    const param = searchParams.get('service');
    return param ? param.split(',') : [];
  });
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>(() => {
    const param = searchParams.get('insurance');
    return param ? param.split(',') : [];
  });
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>(() => {
    const param = searchParams.get('scholarship');
    return param ? param.split(',') : [];
  });
  const [countySearchTerm, setCountySearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PROVIDERS_PER_PAGE);
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
    setVisibleCount(PROVIDERS_PER_PAGE);
  }, [searchTerm, selectedCounties, selectedServices, selectedInsurances]);

  // Query the RESOURCES table where resource_type = 'provider'
  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers-resources'],
    queryFn: async () => {
      let allProviders: ProviderResource[] = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('resource_type', 'provider')
          .order('name', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          console.error('Error fetching providers:', error);
          throw error;
        }

        if (!data || data.length === 0) break;

        allProviders = [...allProviders, ...data];

        if (data.length < pageSize) break;
        from += pageSize;
      }

      console.log('✅ All providers loaded from resources table:', allProviders.length);
      return allProviders as ProviderResource[];
    },
  });

  // Memoize counties
  const counties = useMemo(() => {
    return [...new Set(
      providers
        .map(p => p.county)
        .filter(Boolean)
        .map(county => toTitleCase(county as string))
    )].sort();
  }, [providers]);

  // Memoize filtered counties
  const filteredCounties = useMemo(() => {
    return counties.filter(county =>
      county.toLowerCase().includes(countySearchTerm.toLowerCase())
    );
  }, [counties, countySearchTerm]);

  // Helper to normalize strings for comparison
  const normalizeForComparison = (str: string): string => {
    return str.toLowerCase().replace(/[-_\s]+/g, '');
  };

  // Helper to check if array contains any of the selected values (case-insensitive)
  const arrayContainsAny = (arr: string[] | null | undefined, selectedValues: string[]): boolean => {
    if (!arr || arr.length === 0 || selectedValues.length === 0) return selectedValues.length === 0;
    const normalizedArr = arr.map(normalizeForComparison);
    return selectedValues.some(selected => 
      normalizedArr.some(item => 
        item === normalizeForComparison(selected) ||
        item.includes(normalizeForComparison(selected)) ||
        normalizeForComparison(selected).includes(item)
      )
    );
  };

  // Calculate service stats for header
  const serviceStats = useMemo(() => {
    const stats = {
      aba: 0,
      speech: 0,
      ot: 0,
      pt: 0,
    };
    providers.forEach(p => {
      if (p.services) {
        if (p.services.some(s => normalizeForComparison(s).includes('aba'))) stats.aba++;
        if (p.services.some(s => normalizeForComparison(s).includes('speech'))) stats.speech++;
        if (p.services.some(s => normalizeForComparison(s).includes('occupational') || s === 'ot')) stats.ot++;
        if (p.services.some(s => normalizeForComparison(s).includes('physical') || s === 'pt')) stats.pt++;
      }
    });
    return stats;
  }, [providers]);

  // Filter providers
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Search filter
      const matchesSearch = !searchTerm || 
        provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.county?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // County filter
      const matchesCounty = selectedCounties.length === 0 ||
        selectedCounties.some(county => 
          toTitleCase(provider.county || '').includes(county)
        );
      
      // Service filter (array-based)
      const matchesService = selectedServices.length === 0 ||
        arrayContainsAny(provider.services, selectedServices);
      
      // Insurance filter (array-based)
      const matchesInsurance = selectedInsurances.length === 0 ||
        arrayContainsAny(provider.insurances, selectedInsurances);
      
      // Scholarship filter (array-based)
      const matchesScholarship = selectedScholarships.length === 0 ||
        arrayContainsAny(provider.scholarships, selectedScholarships);
      
      return matchesSearch && matchesCounty && matchesService && matchesInsurance && matchesScholarship;
    });
  }, [providers, searchTerm, selectedCounties, selectedServices, selectedInsurances, selectedScholarships]);

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

  // Auto-zoom to user location when "Use My Location" is clicked
  const MapCenterUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = MapComponent?.useMap();
    
    React.useEffect(() => {
      if (map && center && searchCenter) {
        // Only zoom if we have a search center (user clicked "Use My Location")
        map.flyTo(center, zoom, { duration: 1 });
      }
    }, [map, center, zoom]);
    
    return null;
  };

  // Auto-zoom to fit county filter results (only when no user location set)
  const MapBoundsUpdater = ({ 
    providers,
    hasCountyFilters, 
    hasOtherFilters 
  }: { 
    providers: ProviderResource[];
    hasCountyFilters: boolean;
    hasOtherFilters: boolean;
  }) => {
    const map = MapComponent?.useMap();
    
    React.useEffect(() => {
      // Only auto-zoom to county results if:
      // 1. User hasn't set their location (searchCenter is null)
      // 2. There are county filters applied
      // 3. There are NO other filters (services/insurance)
      // 4. There are providers to show
      if (!map || searchCenter || !hasCountyFilters || hasOtherFilters || providers.length === 0) {
        return;
      }
      
      const coords = providers
        .filter(p => p.latitude && p.longitude)
        .map(p => [Number(p.latitude), Number(p.longitude)] as [number, number]);
      
      if (coords.length === 0) return;
      
      // Fit map to show all filtered providers
      map.fitBounds(coords, { 
        padding: [50, 50], 
        maxZoom: 12,
        duration: 1
      });
    }, [map, providers, hasCountyFilters, hasOtherFilters]);
    
    return null;
  };

  // Get display center for map
  const displayMapCenter = useMemo(() => {
    if (mapCenter) return mapCenter;
    if (searchCenter) return searchCenter;
    return [27.9944024, -81.7602544] as [number, number]; // Florida center
  }, [mapCenter, searchCenter]);

  // Get provider services for map popup - returns objects with display info
  const getProviderServicesForPopup = (provider: ProviderResource) => {
    if (!provider.services) return [];
    return provider.services.slice(0, 4).map(s => ({
      key: s,
      ...(servicePopupInfo[s] || { label: s, description: s, slug: s })
    }));
  };

  // Get provider insurances for map popup - returns objects with display info
  const getProviderInsurancesForPopup = (provider: ProviderResource) => {
    if (!provider.insurances) return [];
    return provider.insurances.slice(0, 3).map(i => ({
      key: i,
      ...(insurancePopupInfo[i] || { label: i, description: i, slug: i })
    }));
  };

  // Get provider services for tooltip (simple string list)
  const getProviderServicesTooltip = (provider: ProviderResource): string[] => {
    if (!provider.services) return [];
    return provider.services.slice(0, 4).map(s => servicePopupInfo[s]?.label || s);
  };

  // Location-filtered providers (for map display)
  const locationFilteredProviders = useMemo(() => {
    if (!searchCenter) return [];
    
    return filteredProviders.filter(provider => {
      if (!provider.latitude || !provider.longitude) return false;
      const distance = calculateDistance(
        searchCenter[0], searchCenter[1],
        Number(provider.latitude), Number(provider.longitude)
      );
      return distance <= searchRadius;
    });
  }, [filteredProviders, searchCenter, searchRadius]);

  // Providers with coordinates for map
  const mappableProviders = useMemo(() => {
    if (searchCenter) {
      return locationFilteredProviders;
    }
    return filteredProviders.filter(p => p.latitude && p.longitude);
  }, [filteredProviders, locationFilteredProviders, searchCenter]);

  // Determine if map should render
  const shouldRenderMap = useMemo(() => {
    if (searchCenter) {
      return locationFilteredProviders.length <= MAX_MAP_PROVIDERS;
    }
    
    // Check if ONLY county filters are applied (no service or insurance filters)
    const hasOnlyCountyFilters = selectedCounties.length > 0 && 
      selectedServices.length === 0 && 
      selectedInsurances.length === 0;
    
    // If only county filters, allow up to 1500 providers (MapBoundsUpdater will zoom to fit)
    if (hasOnlyCountyFilters) {
      return filteredProviders.length <= 1500;
    }
    
    // Otherwise, use the 500 limit
    return filteredProviders.length <= MAX_MAP_PROVIDERS;
  }, [filteredProviders, locationFilteredProviders, searchCenter, selectedCounties, selectedServices, selectedInsurances]);

  // Visible providers with pagination
  const visibleProviders = useMemo(() => {
    return filteredProviders.slice(0, visibleCount);
  }, [filteredProviders, visibleCount]);

  // Get google_place_ids for visible providers to batch fetch ratings
  const visibleGooglePlaceIds = useMemo(() => {
    return visibleProviders
      .map(p => p.google_place_id)
      .filter((id): id is string => !!id);
  }, [visibleProviders]);

  // Batch fetch ratings for visible providers
  const { ratings } = useProviderRatings(visibleGooglePlaceIds);

  const hasMoreProviders = visibleCount < filteredProviders.length;
  const remainingCount = filteredProviders.length - visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + PROVIDERS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedCounties([]);
    setSelectedServices([]);
    setSelectedInsurances([]);
    setSearchTerm('');
    setCountySearchTerm('');
    setVisibleCount(PROVIDERS_PER_PAGE);
  };

  const toggleCounty = (county: string) => {
    setSelectedCounties(prev =>
      prev.includes(county) ? prev.filter(c => c !== county) : [...prev, county]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const toggleInsurance = (insurance: string) => {
    setSelectedInsurances(prev =>
      prev.includes(insurance) ? prev.filter(i => i !== insurance) : [...prev, insurance]
    );
  };

  const toggleScholarship = (scholarship: string) => {
    setSelectedScholarships(prev =>
      prev.includes(scholarship) ? prev.filter(s => s !== scholarship) : [...prev, scholarship]
    );
  };

  const activeFiltersCount = selectedCounties.length + selectedServices.length + selectedInsurances.length + selectedScholarships.length;

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
        <div className="mb-4 p-3 bg-teal-50 rounded-lg">
          <p className="text-sm font-medium text-teal-900">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Services Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Services ({serviceOptions.length})
          </h4>
          <TooltipProvider delayDuration={200}>
            <div className="space-y-2">
              {serviceOptions.map(({ value, label, tooltip }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-help">
                      <Checkbox
                        id={`service-${value}`}
                        checked={selectedServices.includes(value)}
                        onCheckedChange={() => toggleService(value)}
                      />
                      <Label
                        htmlFor={`service-${value}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {label}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs bg-blue-600 text-white border-blue-700 hidden lg:block">
                    <p className="font-medium">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Insurance Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Insurance ({insuranceOptions.length})
          </h4>
          <div className="space-y-2">
            {insuranceOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`insurance-${value}`}
                  checked={selectedInsurances.includes(value)}
                  onCheckedChange={() => toggleInsurance(value)}
                />
                <Label
                  htmlFor={`insurance-${value}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarship Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Scholarships ({scholarshipOptions.length})
          </h4>
          <TooltipProvider delayDuration={200}>
            <div className="space-y-2">
              {scholarshipOptions.map(({ value, label, tooltip }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-help">
                      <Checkbox
                        id={`scholarship-${value}`}
                        checked={selectedScholarships.includes(value)}
                        onCheckedChange={() => toggleScholarship(value)}
                      />
                      <Label
                        htmlFor={`scholarship-${value}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {label}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs bg-green-600 text-white border-green-700 hidden lg:block">
                    <p className="font-medium">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
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
        <title>Find Autism Healthcare Providers in Florida | Florida Autism Services</title>
        <meta name="description" content="Search 3,700+ autism-friendly healthcare providers across Florida. Find ABA therapists, speech therapists, occupational therapists, and specialists who accept Medicaid, insurance, and scholarships." />
        <meta name="keywords" content="autism providers Florida, ABA therapy near me, autism therapists Florida, speech therapy autism, occupational therapy autism, Florida Medicaid autism, autism specialists" />
        <link rel="canonical" href="https://floridaautismservices.com/providers" />
        <meta property="og:title" content="Find Autism Healthcare Providers in Florida" />
        <meta property="og:description" content="Search 3,700+ autism-friendly healthcare providers across Florida. Find therapists and specialists accepting Medicaid and insurance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/providers" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find Autism Healthcare Providers in Florida" />
        <meta name="twitter:description" content="Search 3,700+ autism-friendly healthcare providers across Florida." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Florida Autism Healthcare Providers Directory",
            "description": "Comprehensive directory of autism-friendly healthcare providers across Florida",
            "url": "https://floridaautismservices.com/providers",
            "isPartOf": { "@type": "WebSite", "name": "Florida Autism Services Directory", "url": "https://floridaautismservices.com" },
            "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
              { "@type": "ListItem", "position": 2, "name": "Find Providers", "item": "https://floridaautismservices.com/providers" }
            ]}
          })}
        </script>
      </Helmet>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Find Healthcare Providers</h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-teal-50">
            Search autism-friendly healthcare providers, therapists, and specialists across Florida
          </p>
          <TooltipProvider delayDuration={200}>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/resources/services/aba-therapy" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                    {serviceStats.aba.toLocaleString()} ABA
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Applied Behavior Analysis - Evidence-based therapy for autism spectrum disorder</p>
                  <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/resources/services/speech-therapy" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                    {serviceStats.speech.toLocaleString()} Speech
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Speech-language therapy for communication skills development</p>
                  <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/resources/services/occupational-therapy" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                    {serviceStats.ot.toLocaleString()} OT
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Occupational therapy for daily living skills and sensory processing</p>
                  <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/resources/services/physical-therapy" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                    {serviceStats.pt.toLocaleString()} PT
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                  <p>Physical therapy for motor skills and movement development</p>
                  <p className="text-xs text-gray-400 mt-1">Click to learn more</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
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
                <span className="ml-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                size="default"
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-teal-600 hover:bg-teal-700' : ''}
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
                  {viewMode === 'list' ? visibleProviders.length : mappableProviders.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900">
                  {filteredProviders.length}
                </span>{' '}
                providers
                {providers.length > 0 && filteredProviders.length !== providers.length && (
                  <span className="text-xs sm:text-sm ml-2">({providers.length} total)</span>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto" />
                <p className="mt-4 text-gray-600">Loading providers...</p>
              </div>
            ) : filteredProviders.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="py-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : viewMode === 'list' ? (
              <TooltipProvider delayDuration={200}>
                <div className="space-y-3 sm:space-y-4">
                  {visibleProviders.map((provider) => (
                    <ProviderCard 
                      key={provider.id} 
                      provider={provider}
                      rating={provider.google_place_id ? ratings[provider.google_place_id] : null}
                    />
                  ))}
                </div>
                {hasMoreProviders && (
                  <div className="mt-6 sm:mt-8 text-center">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      size="lg"
                      className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
                    >
                      <ChevronDown className="w-5 h-5 mr-2" />
                      Load {Math.min(PROVIDERS_PER_PAGE, remainingCount)} More
                      <span className="ml-2 text-gray-500">({remainingCount} remaining)</span>
                    </Button>
                  </div>
                )}
                {!hasMoreProviders && filteredProviders.length > PROVIDERS_PER_PAGE && (
                  <div className="mt-6 sm:mt-8 text-center text-gray-500">
                    <p>Showing all {filteredProviders.length} providers</p>
                  </div>
                )}
              </TooltipProvider>
            ) : (
              /* Map View */
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
                {!MapComponent ? (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                  </div>
                ) : !shouldRenderMap ? (
                  <div className="h-full flex flex-col items-center justify-center bg-gray-100 p-6 sm:p-8 text-center">
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Too many providers to display</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Use your location or filters to narrow down results to {MAX_MAP_PROVIDERS} or fewer providers.
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
                        providers={mappableProviders}
                        hasCountyFilters={selectedCounties.length > 0}
                        hasOtherFilters={selectedServices.length > 0 || selectedInsurances.length > 0}
                      />
                      
                      {/* User location marker */}
                      {userLocation && (
                        <MapComponent.CircleMarker
                          center={userLocation}
                          radius={8}
                          fillColor="#0d9488"
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
                          fillColor="#0d9488"
                          fillOpacity={0.1}
                          stroke={true}
                          color="#0d9488"
                          weight={2}
                          dashArray="5, 5"
                        />
                      )}

                      {/* Provider markers */}
                      {mappableProviders.map((provider) => (
                        <MapComponent.Marker
                          key={provider.id}
                          position={[Number(provider.latitude), Number(provider.longitude)]}
                        >
                          <MapComponent.Tooltip
                            direction="top"
                            offset={[0, -20]}
                            opacity={0.95}
                          >
                            <div className="text-center">
                              <p className="font-bold text-sm">{provider.name}</p>
                              <p className="text-xs text-gray-600">{provider.city}, FL</p>
                              {getProviderServicesTooltip(provider).length > 0 && (
                                <p className="text-xs text-teal-600 mt-1">
                                  {getProviderServicesTooltip(provider).join(' • ')}
                                </p>
                              )}
                            </div>
                          </MapComponent.Tooltip>
                          <MapComponent.Popup>
                            <div className="p-2 min-w-[200px] sm:min-w-[240px]">
                              <Link to={`/providers/${provider.id}`} className="hover:text-teal-600 transition-colors">
                                <h3 className="font-bold text-sm mb-1 hover:underline">{provider.name}</h3>
                              </Link>
                              <p className="text-xs text-gray-600 mb-2">
                                {provider.city}, {provider.state || 'FL'}
                              </p>
                              
                              {/* Services - BLUE with links */}
                              {getProviderServicesForPopup(provider).length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {getProviderServicesForPopup(provider).map((service) => (
                                    <Link
                                      key={service.key}
                                      to={`/resources/services/${service.slug}`}
                                      className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                    >
                                      {service.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                              
                              {/* Insurance - PURPLE with links */}
                              {getProviderInsurancesForPopup(provider).length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {getProviderInsurancesForPopup(provider).map((insurance) => (
                                    <Link
                                      key={insurance.key}
                                      to={`/resources/insurances/${insurance.slug}`}
                                      className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                    >
                                      {insurance.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                {provider.phone && (
                                  <a href={`tel:${provider.phone.replace(/[^0-9]/g, '')}`}>
                                    <Button size="sm" variant="outline" className="text-xs">
                                      <Phone className="w-3 h-3 mr-1" />
                                      Call
                                    </Button>
                                  </a>
                                )}
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ""}&destination=${provider.latitude},${provider.longitude}`}
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
                            <span className="text-teal-600 font-bold">{mappableProviders.length.toLocaleString()}</span> on map
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
                          className="bg-teal-600 hover:bg-teal-700 shadow-lg text-sm"
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
                            <div className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
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