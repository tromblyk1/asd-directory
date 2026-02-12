import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, ChevronDown, ChevronUp, GraduationCap, Filter, Map, List, Navigation, Phone, MapPin, Crosshair, RefreshCw } from 'lucide-react';
import { SchoolCard, School } from '../components/SchoolCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const SCHOOLS_PER_PAGE = 50;
const DEFAULT_SEARCH_RADIUS = 25; // miles
const MAX_SEARCH_RADIUS = 50; // miles - cap for dynamic radius
const MAX_MAP_SCHOOLS = 500;

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

// Denomination options with display labels
const denominationOptions = [
  { value: 'NON-DENOMINATIONAL', label: 'Non-Denominational' },
  { value: 'BAPTIST', label: 'Baptist' },
  { value: 'CATHOLIC', label: 'Catholic' },
  { value: 'PENTECOSTAL', label: 'Pentecostal' },
  { value: 'JEWISH', label: 'Jewish' },
  { value: 'ASSEMBLIES OF GOD', label: 'Assemblies of God' },
  { value: 'LUTHERAN', label: 'Lutheran' },
  { value: 'SEVENTH DAY ADVENTIST', label: 'Seventh Day Adventist' },
  { value: 'EPISCOPALIAN', label: 'Episcopalian' },
  { value: 'METHODIST', label: 'Methodist' },
  { value: 'CHURCH OF GOD', label: 'Church of God' },
  { value: 'ISLAMIC/MUSLIM', label: 'Islamic / Muslim' },
  { value: 'PRESBYTERIAN', label: 'Presbyterian' },
  { value: 'MULTI/ INTER/ TRANS-DENOMINATIONAL', label: 'Multi-Denominational' },
  { value: 'NAZARENE', label: 'Nazarene' },
  { value: 'OTHER', label: 'Other Religious' },
];

// Accreditation options with full names
const accreditationOptions = [
  { value: 'COGNIA', label: 'COGNIA', fullName: 'Cognia (formerly AdvancED)' },
  { value: 'FCCAP', label: 'FCCAP', fullName: 'Florida Coalition of Christian Private Schools Accreditation' },
  { value: 'FCIS', label: 'FCIS', fullName: 'Florida Council of Independent Schools' },
  { value: 'FACCS', label: 'FACCS', fullName: 'Florida Association of Christian Colleges and Schools' },
  { value: 'FLOCS', label: 'FLOCS', fullName: 'Florida League of Christian Schools' },
  { value: 'CGACS', label: 'CGACS', fullName: 'Christian and Gospel Accrediting Commission Schools' },
  { value: 'AISF', label: 'AISF', fullName: 'Association of Independent Schools of Florida' },
  { value: 'FCCPSA', label: 'FCCPSA', fullName: 'Florida Catholic Conference Private School Accreditation' },
  { value: 'ACSI', label: 'ACSI', fullName: 'Association of Christian Schools International' },
  { value: 'CSF', label: 'CSF', fullName: 'Christian Schools of Florida' },
  { value: 'FLGA-LCMS', label: 'FLGA-LCMS', fullName: 'Florida-Georgia District Lutheran Church Missouri Synod' },
  { value: 'ACTS', label: 'ACTS', fullName: 'Association of Christian Teachers and Schools' },
  { value: 'NIPSA', label: 'NIPSA', fullName: 'National Independent Private Schools Association' },
  { value: 'CITA', label: 'CITA', fullName: 'Commission on International and Trans-Regional Accreditation' },
  { value: 'WELSSA', label: 'WELSSA', fullName: 'Wisconsin Evangelical Lutheran Synod School Accreditation' },
  { value: 'COBIS', label: 'COBIS', fullName: 'Council of British International Schools' },
  { value: 'AMS', label: 'AMS', fullName: 'American Montessori Society' },
  { value: 'FKC', label: 'FKC', fullName: 'Florida Kindergarten Council' },
  { value: 'ICAA', label: 'ICAA', fullName: 'International Christian Accrediting Association' },
  { value: 'NCSA', label: 'NCSA', fullName: 'National Christian School Association' },
  { value: 'CSI', label: 'CSI', fullName: 'Christian Schools International' },
];

// Grade level options
const gradeOptions = [
  { value: 'PREKINDERGARTEN', label: 'Pre-K' },
  { value: 'KINDERGARTEN', label: 'Kindergarten' },
  { value: 'ELEMENTARY', label: 'Elementary' },
  { value: 'MIDDLE', label: 'Middle School' },
  { value: 'HIGH', label: 'High School' },
];

// Scholarship options with descriptions
const scholarshipOptions = [
  { value: 'fes_ua', label: 'FES-UA', description: 'Unique Abilities', tooltip: 'Family Empowerment Scholarship for Unique Abilities - For students with disabilities including autism' },
  { value: 'fes_eo', label: 'FES-EO', description: 'Educational Options', tooltip: 'Family Empowerment Scholarship for Educational Options - Income-based school choice' },
  { value: 'ftc', label: 'FTC', description: 'Florida Tax Credit', tooltip: 'Florida Tax Credit Scholarship - For low-income families' },
  { value: 'pep', label: 'PEP', description: 'Personalized Education', tooltip: 'Personalized Education Program - Flexible funding for customized learning' },
];

export default function FindSchools() {
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(() => {
    const param = searchParams.get('county');
    return param ? param.split(',') : [];
  });
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>(() => {
    const param = searchParams.get('scholarship');
    return param ? param.split(',') : [];
  });
  const [selectedGrades, setSelectedGrades] = useState<string[]>(() => {
    const param = searchParams.get('grade');
    return param ? param.split(',') : [];
  });
  const [selectedDenominations, setSelectedDenominations] = useState<string[]>(() => {
    const param = searchParams.get('denomination');
    return param ? param.split(',').map(d => d.toUpperCase()) : [];
  });
  const [selectedAccreditations, setSelectedAccreditations] = useState<string[]>(() => {
    const param = searchParams.get('accreditation');
    return param ? param.split(',').map(a => a.toUpperCase()) : [];
  });
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(SCHOOLS_PER_PAGE);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
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
    setVisibleCount(SCHOOLS_PER_PAGE);
  }, [searchTerm, selectedDistricts, selectedScholarships, selectedGrades, selectedDenominations, selectedAccreditations]);

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      let allSchools: School[] = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .order('name', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          console.error('Error fetching schools:', error);
          throw error;
        }

        if (!data || data.length === 0) break;

        allSchools = [...allSchools, ...data];

        if (data.length < pageSize) break;
        from += pageSize;
      }

      console.log('✅ All schools loaded:', allSchools.length);
      return allSchools as School[];
    },
  });

  // Memoize districts (from district field, displayed as counties)
  const districts = useMemo(() => {
    return [...new Set(
      schools
        .map(s => s.district)
        .filter(Boolean)
        .map(district => toTitleCase(district as string))
    )].sort();
  }, [schools]);

  // Memoize filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter(district =>
      district.toLowerCase().includes(districtSearchTerm.toLowerCase())
    );
  }, [districts, districtSearchTerm]);

  // Calculate scholarship stats for header
  const scholarshipStats = useMemo(() => {
    const stats = { fes_ua: 0, fes_eo: 0, ftc: 0, pep: 0 };
    schools.forEach(s => {
      if (s.fes_ua_participant) stats.fes_ua++;
      if (s.fes_eo_participant) stats.fes_eo++;
      if (s.ftc_participant) stats.ftc++;
      if (s.pep_participant) stats.pep++;
    });
    return stats;
  }, [schools]);

  // Helper to check if school has grade level
  const schoolHasGrade = (school: School, grade: string): boolean => {
    const grades = school.grade_levels?.toUpperCase() || '';
    if (grade === 'PREKINDERGARTEN') return grades.includes('PK') || grades.includes('PRE');
    if (grade === 'KINDERGARTEN') return grades.includes('KG') || grades.includes('K-');
    if (grade === 'ELEMENTARY') return /[1-5]/.test(grades);
    if (grade === 'MIDDLE') return /[6-8]/.test(grades);
    if (grade === 'HIGH') return /(9|10|11|12)/.test(grades);
    return false;
  };

  // Filter schools
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // Search filter
      const matchesSearch = !searchTerm ||
        school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.denomination?.toLowerCase().includes(searchTerm.toLowerCase());

      // District filter (displayed as counties)
      const matchesDistrict = selectedDistricts.length === 0 ||
        selectedDistricts.some(district =>
          toTitleCase(school.district || '').includes(district)
        );

      // Scholarship filter
      const matchesScholarship = selectedScholarships.length === 0 ||
        selectedScholarships.some(scholarship => {
          if (scholarship === 'fes_ua') return school.fes_ua_participant;
          if (scholarship === 'fes_eo') return school.fes_eo_participant;
          if (scholarship === 'ftc') return school.ftc_participant;
          if (scholarship === 'pep') return school.pep_participant;
          return false;
        });

      // Grade filter
      const matchesGrade = selectedGrades.length === 0 ||
        selectedGrades.some(grade => schoolHasGrade(school, grade));

      // Denomination filter
      const matchesDenomination = selectedDenominations.length === 0 ||
        selectedDenominations.some(denom =>
          school.denomination?.toUpperCase().includes(denom)
        );

      // Accreditation filter
      const matchesAccreditation = selectedAccreditations.length === 0 ||
        selectedAccreditations.some(accred =>
          school.accreditation?.toUpperCase().includes(accred)
        );

      return matchesSearch && matchesDistrict && matchesScholarship && matchesGrade && matchesDenomination && matchesAccreditation;
    });
  }, [schools, searchTerm, selectedDistricts, selectedScholarships, selectedGrades, selectedDenominations, selectedAccreditations]);

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

  // Auto-zoom to fit district filter results
  const MapBoundsUpdater = ({
    schools,
    hasDistrictFilters,
    hasOtherFilters
  }: {
    schools: School[];
    hasDistrictFilters: boolean;
    hasOtherFilters: boolean;
  }) => {
    const map = MapComponent?.useMap();

    React.useEffect(() => {
      if (!map || searchCenter || !hasDistrictFilters || hasOtherFilters || schools.length === 0) {
        return;
      }

      const coords = schools
        .filter(s => s.latitude && s.longitude)
        .map(s => [Number(s.latitude), Number(s.longitude)] as [number, number]);

      if (coords.length === 0) return;

      map.fitBounds(coords, {
        padding: [50, 50],
        maxZoom: 12,
        duration: 1
      });
    }, [map, schools, hasDistrictFilters, hasOtherFilters]);

    return null;
  };

  // Get display center for map
  const displayMapCenter = useMemo(() => {
    if (mapCenter) return mapCenter;
    if (searchCenter) return searchCenter;
    return [27.9944024, -81.7602544] as [number, number]; // Florida center
  }, [mapCenter, searchCenter]);

  // Location-filtered schools (for map display)
  const locationFilteredSchools = useMemo(() => {
    if (!searchCenter) return [];

    return filteredSchools.filter(school => {
      if (!school.latitude || !school.longitude) return false;
      const distance = calculateDistance(
        searchCenter[0], searchCenter[1],
        Number(school.latitude), Number(school.longitude)
      );
      return distance <= searchRadius;
    });
  }, [filteredSchools, searchCenter, searchRadius]);

  // Schools with coordinates for map
  const mappableSchools = useMemo(() => {
    if (searchCenter) {
      return locationFilteredSchools;
    }
    return filteredSchools.filter(s => s.latitude && s.longitude);
  }, [filteredSchools, locationFilteredSchools, searchCenter]);

  // Determine if map should render
  const shouldRenderMap = useMemo(() => {
    if (searchCenter) {
      return locationFilteredSchools.length <= MAX_MAP_SCHOOLS;
    }

    const hasOnlyDistrictFilters = selectedDistricts.length > 0 &&
      selectedScholarships.length === 0 &&
      selectedGrades.length === 0 &&
      selectedDenominations.length === 0 &&
      selectedAccreditations.length === 0;

    if (hasOnlyDistrictFilters) {
      return filteredSchools.length <= 1500;
    }

    return filteredSchools.length <= MAX_MAP_SCHOOLS;
  }, [filteredSchools, locationFilteredSchools, searchCenter, selectedDistricts, selectedScholarships, selectedGrades, selectedDenominations, selectedAccreditations]);

  // Visible schools with pagination
  const visibleSchools = useMemo(() => {
    return filteredSchools.slice(0, visibleCount);
  }, [filteredSchools, visibleCount]);

  const hasMoreSchools = visibleCount < filteredSchools.length;
  const remainingCount = filteredSchools.length - visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + SCHOOLS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedDistricts([]);
    setSelectedScholarships([]);
    setSelectedGrades([]);
    setSelectedDenominations([]);
    setSelectedAccreditations([]);
    setSearchTerm('');
    setDistrictSearchTerm('');
    setVisibleCount(SCHOOLS_PER_PAGE);
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts(prev =>
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const toggleScholarship = (scholarship: string) => {
    setSelectedScholarships(prev =>
      prev.includes(scholarship) ? prev.filter(s => s !== scholarship) : [...prev, scholarship]
    );
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const toggleDenomination = (denomination: string) => {
    setSelectedDenominations(prev =>
      prev.includes(denomination) ? prev.filter(d => d !== denomination) : [...prev, denomination]
    );
  };

  const toggleAccreditation = (accreditation: string) => {
    setSelectedAccreditations(prev =>
      prev.includes(accreditation) ? prev.filter(a => a !== accreditation) : [...prev, accreditation]
    );
  };

  const activeFiltersCount = selectedDistricts.length + selectedScholarships.length + selectedGrades.length + selectedDenominations.length + selectedAccreditations.length;

  // Filter panel content (shared between mobile drawer and desktop sidebar)
  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-900">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Grade Levels */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Grade Levels
          </h4>
          <div className="space-y-2">
            {gradeOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`grade-${value}`}
                  checked={selectedGrades.includes(value)}
                  onCheckedChange={() => toggleGrade(value)}
                />
                <Label htmlFor={`grade-${value}`} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Denomination */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Denomination
          </h4>
          <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
            {denominationOptions.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`denomination-${value}`}
                  checked={selectedDenominations.includes(value)}
                  onCheckedChange={() => toggleDenomination(value)}
                />
                <Label htmlFor={`denomination-${value}`} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Scholarships Accepted
          </h4>
          <TooltipProvider delayDuration={200}>
            <div className="space-y-2">
              {scholarshipOptions.map(({ value, label, description, tooltip }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <div className="flex items-start space-x-2 cursor-help">
                      <Checkbox
                        id={`scholarship-${value}`}
                        checked={selectedScholarships.includes(value)}
                        onCheckedChange={() => toggleScholarship(value)}
                        className="mt-0.5"
                      />
                      <div>
                        <Label htmlFor={`scholarship-${value}`} className="text-sm font-medium cursor-pointer">
                          {label}
                        </Label>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
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

        {/* Accreditation */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Accreditation
          </h4>
          <TooltipProvider delayDuration={200}>
            <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
              {accreditationOptions.map(({ value, label, fullName }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-help">
                      <Checkbox
                        id={`accreditation-${value}`}
                        checked={selectedAccreditations.includes(value)}
                        onCheckedChange={() => toggleAccreditation(value)}
                      />
                      <Label htmlFor={`accreditation-${value}`} className="text-sm font-normal cursor-pointer flex-1">
                        {label}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs bg-purple-600 text-white border-purple-700 hidden lg:block">
                    <p className="font-medium">{fullName}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Counties */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Counties ({districts.length})
          </h4>
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search counties..."
              value={districtSearchTerm}
              onChange={(e) => setDistrictSearchTerm(e.target.value)}
              className="pl-8 py-1 text-sm"
            />
          </div>
          <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
            {filteredDistricts.map((district) => (
              <div key={district} className="flex items-center space-x-2">
                <Checkbox
                  id={`district-${district}`}
                  checked={selectedDistricts.includes(district)}
                  onCheckedChange={() => toggleDistrict(district)}
                />
                <Label htmlFor={`district-${district}`} className="text-sm font-normal cursor-pointer flex-1">
                  {district}
                </Label>
              </div>
            ))}
            {filteredDistricts.length === 0 && (
              <p className="text-sm text-gray-500 italic">No counties found</p>
            )}
          </div>
        </div>
      </div>

      {/* Clear All Filters */}
      {(searchTerm || selectedDistricts.length > 0 || selectedScholarships.length > 0 || selectedGrades.length > 0 || selectedDenominations.length > 0 || selectedAccreditations.length > 0 || userLocation) && (
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedDistricts([]);
            setSelectedScholarships([]);
            setSelectedGrades([]);
            setSelectedDenominations([]);
            setSelectedAccreditations([]);
            setDistrictSearchTerm('');
            setUserLocation(null);
            setLocationStatus('idle');
            setSearchCenter(null);
            setSearchRadius(DEFAULT_SEARCH_RADIUS);
            setMapCenter(null);
            setShowSearchAreaButton(false);
            setVisibleCount(SCHOOLS_PER_PAGE);
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
        <title>Find Private Schools for Autism in Florida | Florida Autism Services</title>
        <meta 
          name="description" 
          content="Search 3,600+ Florida private schools accepting autism scholarships. Filter by FES-UA, FES-EO, FTC, and PEP scholarship programs." 
        />
        <meta name="keywords" content="Florida private schools autism, FES-UA schools, autism scholarships Florida, special needs schools Florida, FES-EO schools, FTC scholarship schools" />
        <meta property="og:title" content="Find Private Schools for Autism in Florida" />
        <meta property="og:description" content="Search 3,600+ Florida private schools accepting autism scholarships. Filter by scholarship programs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/schools" />
        <link rel="canonical" href="https://floridaautismservices.com/schools" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Find Private Schools for Autism in Florida",
            "description": "Search Florida private schools accepting autism scholarships like FES-UA, FES-EO, FTC, and PEP",
            "url": "https://floridaautismservices.com/schools",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Florida Autism Services Directory",
              "url": "https://floridaautismservices.com"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Find Schools</h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100">
              Search Florida private schools - filter by autism scholarships and more
            </p>
            <TooltipProvider delayDuration={200}>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/resources/scholarships/fes-ua" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                      {scholarshipStats.fes_ua.toLocaleString()} FES-UA
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                    <p>Family Empowerment Scholarship for Unique Abilities - For students with disabilities including autism</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/resources/scholarships/fes-eo" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                      {scholarshipStats.fes_eo.toLocaleString()} FES-EO
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                    <p>Family Empowerment Scholarship for Educational Options - Income-based school choice scholarship</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/resources/scholarships/ftc" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                      {scholarshipStats.ftc.toLocaleString()} FTC
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                    <p>Florida Tax Credit Scholarship - For low-income families seeking private school options</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/resources/scholarships/pep" className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-colors">
                      {scholarshipStats.pep.toLocaleString()} PEP
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs hidden sm:block">
                    <p>Personalized Education Program - Flexible funding for customized learning plans</p>
                  </TooltipContent>
                </Tooltip>
                <span className="bg-white/30 px-2 sm:px-3 py-1 rounded-full font-medium">
                  {schools.length.toLocaleString()} Total
                </span>
              </div>
            </TooltipProvider>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by school name, city, county..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 py-5 sm:py-6 text-base sm:text-lg shadow-sm"
              />
            </div>
          </div>

          {/* Mobile Filter Toggle + View Toggle Row */}
          <div className="mb-4 sm:mb-6 flex gap-2 justify-between">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex-1 sm:flex-none"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="default"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                <List className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="default"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                <Map className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Map</span>
              </Button>
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

          {/* Main Layout: Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Desktop Sidebar - Filters */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <Card className="border-none shadow-lg sticky top-6">
                <CardContent className="p-6">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    <FilterContent />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - School Cards */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{visibleSchools.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{filteredSchools.length.toLocaleString()}</span> schools
                  {schools.length > 0 && filteredSchools.length !== schools.length && (
                    <span className="text-xs sm:text-sm ml-2">({schools.length.toLocaleString()} total)</span>
                  )}
                  {searchCenter && (
                    <span className="text-xs sm:text-sm ml-2 text-purple-600">
                      • {locationFilteredSchools.length} within {Math.round(searchRadius)} miles
                    </span>
                  )}
                </p>
              </div>

              {/* Map View */}
              {viewMode === 'map' && (
                <div className="mb-4 sm:mb-6">
                  <Card className="border-none shadow-lg overflow-hidden">
                    <div className="h-[400px] sm:h-[500px] lg:h-[600px] relative">
                      {!shouldRenderMap && !searchCenter ? (
                        <div className="h-full flex items-center justify-center bg-gray-100 relative">
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
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
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                                  <span className="hidden sm:inline">Locating...</span>
                                </>
                              ) : (
                                <>
                                  <Crosshair className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">Use My Location</span>
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="text-center p-6 sm:p-8">
                            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                              Too many schools to display
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-4">
                              Use your location or filters to narrow down results.
                            </p>
                            <Button
                              onClick={requestUserLocation}
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={locationStatus === 'loading'}
                            >
                              <Crosshair className="w-4 h-4 mr-2" />
                              Use My Location
                            </Button>
                          </div>
                        </div>
                      ) : !MapComponent ? (
                        <div className="h-full flex items-center justify-center bg-gray-100">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
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
                              schools={mappableSchools}
                              hasDistrictFilters={selectedDistricts.length > 0}
                              hasOtherFilters={selectedScholarships.length > 0 || selectedGrades.length > 0 || selectedDenominations.length > 0 || selectedAccreditations.length > 0}
                            />

                            {/* User location marker */}
                            {userLocation && (
                              <MapComponent.CircleMarker
                                center={userLocation}
                                radius={8}
                                fillColor="#7c3aed"
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
                                fillColor="#7c3aed"
                                fillOpacity={0.1}
                                stroke={true}
                                color="#7c3aed"
                                weight={2}
                                dashArray="5, 5"
                              />
                            )}

                            {/* School markers */}
                            {mappableSchools.map((school) => (
                              <MapComponent.Marker
                                key={school.id}
                                position={[Number(school.latitude), Number(school.longitude)]}
                              >
                                <MapComponent.Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                                  <div className="text-center">
                                    <p className="font-bold text-sm">{school.name}</p>
                                    <p className="text-xs text-gray-600">{school.city}</p>
                                  </div>
                                </MapComponent.Tooltip>
                                <MapComponent.Popup>
                                  <div className="p-2 min-w-[200px] sm:min-w-[240px]">
                                    <Link to={`/schools/${school.slug}`} className="hover:text-purple-600 transition-colors">
                                      <h3 className="font-bold text-sm mb-1 hover:underline">{school.name}</h3>
                                    </Link>
                                    <p className="text-xs text-gray-600 mb-2">
                                      {school.city}, FL
                                    </p>
                                    {/* Scholarships - GREEN */}
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {school.fes_ua_participant && (
                                        <Link to="/resources/scholarships/fes-ua" className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-1.5 py-0.5 rounded transition-colors">FES-UA</Link>
                                      )}
                                      {school.fes_eo_participant && (
                                        <Link to="/resources/scholarships/fes-eo" className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-1.5 py-0.5 rounded transition-colors">FES-EO</Link>
                                      )}
                                      {school.ftc_participant && (
                                        <Link to="/resources/scholarships/ftc" className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-1.5 py-0.5 rounded transition-colors">FTC</Link>
                                      )}
                                      {school.pep_participant && (
                                        <Link to="/resources/scholarships/pep" className="text-xs bg-green-100 text-green-800 hover:bg-green-200 px-1.5 py-0.5 rounded transition-colors">PEP</Link>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {school.phone && (
                                        <a href={`tel:${school.phone.replace(/[^0-9]/g, '')}`}>
                                          <Button size="sm" variant="outline" className="text-xs">
                                            <Phone className="w-3 h-3 mr-1" />
                                            Call
                                          </Button>
                                        </a>
                                      )}
                                      <a
                                        href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ""}&destination=${school.latitude},${school.longitude}`}
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
                                  <span className="text-purple-600 font-bold">{mappableSchools.length.toLocaleString()}</span> on map
                                </p>
                                {searchCenter && (
                                  <p className="text-xs text-gray-500">
                                    Within {Math.round(searchRadius)}mi
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </div>

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
                                <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                              ) : (
                                <>
                                  <Crosshair className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">{locationStatus === 'success' ? 'Located' : 'My Location'}</span>
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Search This Area Button */}
                          {showSearchAreaButton && (
                            <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                              <Button
                                onClick={searchThisArea}
                                className="bg-purple-600 hover:bg-purple-700 shadow-lg text-sm"
                                size="sm"
                              >
                                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Search This Area
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* List View - School Cards */}
              {viewMode === 'list' && (
                <>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
                      <p className="mt-4 text-gray-600">Loading schools...</p>
                    </div>
                  ) : filteredSchools.length === 0 ? (
                    <Card className="border-none shadow-lg">
                      <CardContent className="py-12 text-center">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No schools found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or search terms
                        </p>
                        <Button onClick={clearFilters}>Clear Filters</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <TooltipProvider delayDuration={200}>
                      <div className="space-y-3 sm:space-y-4">
                        {visibleSchools.map((school) => (
                          <SchoolCard key={school.id} school={school} />
                        ))}
                      </div>

                      {/* Load More Button */}
                      {hasMoreSchools && (
                        <div className="mt-6 sm:mt-8 text-center">
                          <Button
                            onClick={loadMore}
                            variant="outline"
                            size="lg"
                            className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
                          >
                            <ChevronDown className="w-5 h-5 mr-2" />
                            Load {Math.min(SCHOOLS_PER_PAGE, remainingCount)} More
                            <span className="ml-2 text-gray-500">
                              ({remainingCount.toLocaleString()} remaining)
                            </span>
                          </Button>
                        </div>
                      )}

                      {/* End of results */}
                      {!hasMoreSchools && filteredSchools.length > SCHOOLS_PER_PAGE && (
                        <div className="mt-6 sm:mt-8 text-center text-gray-500">
                          <p>Showing all {filteredSchools.length.toLocaleString()} schools</p>
                        </div>
                      )}
                    </TooltipProvider>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}