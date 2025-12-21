import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Church, Search, MapPin, Phone, Globe, Heart,
    Users, CalendarDays, CheckCircle, Filter, Map, List,
    X, ChevronDown, ChevronUp, Navigation
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Church table structure from Supabase
interface ChurchData {
    id: string | number;
    slug: string | null;
    ChurchName: string;
    Denomination: string | null;
    Website: string | null;
    AccommodationSnippet: string | null;
    AccommodationTags: string | null;
    SensoryRoom: boolean | null;
    AlternativeService: boolean | null;
    ChildrenProgram: boolean | null;
    AdultProgram: boolean | null;
    ContactEmail: string | null;
    Phone: string | null;
    Street: string | null;
    City: string | null;
    County: string | null;
    State: string | null;
    ZIP: string | null;
    Lat: number | null;
    Lon: number | null;
    LastVerifiedDate: string | null;
    SourceURL: string | null;
    created_at: string | null;
}

// Mapped resource for display
interface Resource {
    id: string | number;
    slug: string | null;
    name: string;
    city?: string;
    county?: string;
    address?: string;
    denomination?: string;
    description?: string;
    accommodations?: string[];
    programs?: string[];
    phone?: string;
    website?: string;
    verified?: boolean;
    lat?: number | null;
    lon?: number | null;
}

const toTitleCase = (str: string): string => {
    return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Normalize string for comparison (lowercase, remove hyphens/spaces)
const normalizeForComparison = (str: string): string => {
    return str.toLowerCase().replace(/[-_\s]+/g, '');
};

// Accommodation filter options with tooltips
const accommodationOptions = [
    { value: 'sensory-friendly', label: 'Sensory Friendly', tooltip: 'Environment designed to minimize sensory overload' },
    { value: 'sensory-room', label: 'Sensory Room', tooltip: 'Dedicated space with sensory equipment for decompression' },
    { value: 'quiet-space', label: 'Quiet Space', tooltip: 'Designated quiet area for those who need a break' },
    { value: 'buddy-system', label: 'Buddy System', tooltip: 'Trained volunteers paired one-on-one with individuals' },
    { value: 'respite-care', label: 'Respite Care', tooltip: 'Temporary care program giving caregivers a break' },
    { value: 'alternative-service', label: 'Alternative Service', tooltip: 'Modified worship service with sensory accommodations' },
    { value: 'adapted-curriculum', label: 'Adapted Curriculum', tooltip: 'Modified teaching materials for different learning needs' },
    { value: 'adult-program', label: 'Adult Program', tooltip: 'Special needs programming for adults' },
    { value: 'children-program', label: "Children's Program", tooltip: 'Special needs programming for children' },
    { value: 'special-needs-ministry', label: 'Special Needs Ministry', tooltip: 'Dedicated ministry serving individuals with disabilities' },
    { value: 'trained-volunteers', label: 'Trained Volunteers', tooltip: 'Staff trained to support individuals with special needs' },
    { value: 'asl-interpretation', label: 'ASL Interpretation', tooltip: 'Sign language interpretation available' },
    { value: 'visual-supports', label: 'Visual Supports', tooltip: 'Visual schedules and aids to support understanding' },
];

// Tooltip definitions for card display
const tagTooltips: Record<string, string> = {
    'sensory friendly': 'Environment designed to minimize sensory overload',
    'sensory room': 'Dedicated space with sensory equipment for decompression',
    'quiet space': 'Designated quiet area for those who need a break',
    'buddy system': 'Trained volunteers paired one-on-one with individuals',
    'alternative service': 'Modified worship service with sensory accommodations',
    'respite care': 'Temporary care program giving caregivers a break',
    'adapted curriculum': 'Modified teaching materials for different learning needs',
    'adult program': 'Special needs programming for adults',
    "children's program": 'Special needs programming for children',
    'special needs ministry': 'Dedicated ministry serving individuals with disabilities',
    'trained volunteers': 'Staff trained to support individuals with special needs',
    'asl interpretation': 'Sign language interpretation available',
    'visual supports': 'Visual schedules and aids to support understanding',
};

const getTagTooltip = (tag: string): string => {
    const normalizedTag = tag.toLowerCase().trim();
    return tagTooltips[normalizedTag] || 'Accommodation provided to support accessibility needs';
};

export default function FaithResources() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [selectedDenominations, setSelectedDenominations] = useState<string[]>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
    const [citySearchTerm, setCitySearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [MapComponent, setMapComponent] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);

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

    // Helper to map church data to display resource
    const mapChurchToResource = (church: ChurchData): Resource => {
        // Parse AccommodationTags (pipe-delimited string)
        const accommodations: string[] = [];
        if (church.AccommodationTags) {
            accommodations.push(...church.AccommodationTags.split('|').map(t => t.trim()).filter(Boolean));
        }
        if (church.SensoryRoom) accommodations.push('Sensory Room');
        if (church.AlternativeService) accommodations.push('Alternative Service');

        // Build programs array from boolean fields
        const programs: string[] = [];
        if (church.ChildrenProgram) programs.push("Children's Program");
        if (church.AdultProgram) programs.push('Adult Program');

        return {
            id: church.id,
            slug: church.slug,
            name: church.ChurchName,
            city: church.City || undefined,
            county: church.County || undefined,
            address: church.Street || undefined,
            denomination: church.Denomination || undefined,
            description: church.AccommodationSnippet || undefined,
            accommodations,
            programs,
            phone: church.Phone || undefined,
            website: church.Website || undefined,
            verified: !!church.LastVerifiedDate,
            lat: church.Lat,
            lon: church.Lon,
        };
    };

    const { data: resources = [], isLoading, error, refetch } = useQuery({
        queryKey: ['faith-resources', 'churches'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('churches')
                .select('*')
                .order('ChurchName', { ascending: true });

            if (error) throw error;
            return (data as ChurchData[]).map(mapChurchToResource);
        },
        initialData: [],
        staleTime: 0,
        refetchOnMount: true,
    });

    // Memoize cities
    const cities = useMemo(() => {
        return [...new Set(
            resources
                .map(r => r.city)
                .filter((city): city is string => Boolean(city))
        )].sort();
    }, [resources]);

    // Filtered cities for search
    const filteredCities = useMemo(() => {
        return cities.filter(city =>
            city.toLowerCase().includes(citySearchTerm.toLowerCase())
        );
    }, [cities, citySearchTerm]);

    // Memoize denominations
    const denominations = useMemo(() => {
        return [...new Set(
            resources
                .map(r => r.denomination)
                .filter((denom): denom is string => Boolean(denom))
        )].sort();
    }, [resources]);

    // Check if resource has accommodation (case-insensitive, normalized comparison)
    const hasAccommodation = (resource: Resource, accommodationValue: string): boolean => {
        const allAccommodations = [...(resource.accommodations || []), ...(resource.programs || [])];
        const normalizedFilter = normalizeForComparison(accommodationValue);

        return allAccommodations.some(acc => {
            const normalizedAcc = normalizeForComparison(acc);
            return normalizedAcc.includes(normalizedFilter) || normalizedFilter.includes(normalizedAcc);
        });
    };

    // Filter resources
    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            // Search filter
            const matchesSearch = !searchTerm ||
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.denomination?.toLowerCase().includes(searchTerm.toLowerCase());

            // City filter
            const matchesCity = selectedCities.length === 0 ||
                selectedCities.includes(resource.city || '');

            // Denomination filter
            const matchesDenomination = selectedDenominations.length === 0 ||
                selectedDenominations.includes(resource.denomination || '');

            // Accommodation filter (must have ALL selected accommodations)
            const matchesAccommodation = selectedAccommodations.length === 0 ||
                selectedAccommodations.every(acc => hasAccommodation(resource, acc));

            return matchesSearch && matchesCity && matchesDenomination && matchesAccommodation;
        });
    }, [resources, searchTerm, selectedCities, selectedDenominations, selectedAccommodations]);

    // Mappable resources (have coordinates)
    const mappableResources = useMemo(() => {
        return filteredResources.filter(r => r.lat && r.lon);
    }, [filteredResources]);

    const clearFilters = () => {
        setSelectedCities([]);
        setSelectedDenominations([]);
        setSelectedAccommodations([]);
        setSearchTerm('');
        setCitySearchTerm('');
    };

    const toggleCity = (city: string) => {
        setSelectedCities(prev =>
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        );
    };

    const toggleDenomination = (denom: string) => {
        setSelectedDenominations(prev =>
            prev.includes(denom) ? prev.filter(d => d !== denom) : [...prev, denom]
        );
    };

    const toggleAccommodation = (accommodation: string) => {
        setSelectedAccommodations(prev =>
            prev.includes(accommodation) ? prev.filter(a => a !== accommodation) : [...prev, accommodation]
        );
    };

    const activeFiltersCount = selectedCities.length + selectedDenominations.length + selectedAccommodations.length;

    // Filter panel content
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
                <div className="mb-4 p-3 bg-rose-50 rounded-lg">
                    <p className="text-sm font-medium text-rose-900">
                        {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {/* Accommodations Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Accommodations ({accommodationOptions.length})
                    </h4>
                    <TooltipProvider delayDuration={200}>
                        <div className="space-y-2">
                            {accommodationOptions.map(({ value, label, tooltip }) => (
                                <Tooltip key={value}>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-2 cursor-help">
                                            <Checkbox
                                                id={`accommodation-${value}`}
                                                checked={selectedAccommodations.includes(value)}
                                                onCheckedChange={() => toggleAccommodation(value)}
                                            />
                                            <Label
                                                htmlFor={`accommodation-${value}`}
                                                className="text-sm font-normal cursor-pointer flex-1"
                                            >
                                                {label}
                                            </Label>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs bg-rose-600 text-white border-rose-700 hidden lg:block">
                                        <p className="font-medium">{tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
                </div>

                {/* Denominations Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Denominations ({denominations.length})
                    </h4>
                    <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
                        {denominations.map((denom) => (
                            <div key={denom} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`denom-${denom}`}
                                    checked={selectedDenominations.includes(denom)}
                                    onCheckedChange={() => toggleDenomination(denom)}
                                />
                                <Label
                                    htmlFor={`denom-${denom}`}
                                    className="text-sm font-normal cursor-pointer flex-1"
                                >
                                    {denom}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities Filter */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Cities ({cities.length})
                    </h4>
                    <div className="relative mb-3">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search cities..."
                            value={citySearchTerm}
                            onChange={(e) => setCitySearchTerm(e.target.value)}
                            className="pl-8 py-1 text-sm"
                        />
                    </div>
                    <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
                        {filteredCities.map((city) => (
                            <div key={city} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`city-${city}`}
                                    checked={selectedCities.includes(city)}
                                    onCheckedChange={() => toggleCity(city)}
                                />
                                <Label
                                    htmlFor={`city-${city}`}
                                    className="text-sm font-normal cursor-pointer flex-1"
                                >
                                    {city}
                                </Label>
                            </div>
                        ))}
                        {filteredCities.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No cities found</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    // SEO structured data
    const faithSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Autism-Friendly Faith Communities in Florida",
        "description": "Find churches and worship spaces in Florida that welcome neurodivergent individuals.",
        "url": "https://floridaautismservices.com/faith",
        "numberOfItems": resources.length,
    };

    return (
        <>
            <Helmet>
                <title>Autism-Friendly Churches & Faith Communities | Florida</title>
                <meta name="description" content={`Find ${resources.length}+ autism-friendly churches and faith communities across Florida.`} />
                <link rel="canonical" href="https://floridaautismservices.com/faith" />
                <script type="application/ld+json">{JSON.stringify(faithSchema)}</script>
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-8 sm:py-10 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Church className="w-8 h-8 sm:w-10 sm:h-10" />
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcoming Faith Communities</h1>
                        </div>
                        <p className="text-base sm:text-lg lg:text-xl text-rose-100">
                            Find churches and worship spaces that embrace neurodiversity across Florida
                        </p>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                                <Heart className="w-3 h-3 inline mr-1" />
                                Sensory-Friendly
                            </span>
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                                <Users className="w-3 h-3 inline mr-1" />
                                Trained Staff
                            </span>
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                                <CalendarDays className="w-3 h-3 inline mr-1" />
                                Special Programs
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
                                placeholder="Search by name, city, or denomination..."
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
                                    <span className="ml-2 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                            </Button>

                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('list')}
                                    className={viewMode === 'list' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                                    size="default"
                                >
                                    <List className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">List</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'map' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('map')}
                                    className={viewMode === 'map' ? 'bg-rose-600 hover:bg-rose-700' : ''}
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
                                        {viewMode === 'list' ? filteredResources.length : mappableResources.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-gray-900">
                                        {resources.length}
                                    </span>{' '}
                                    faith communities
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto" />
                                    <p className="mt-4 text-gray-600">Loading faith communities...</p>
                                </div>
                            ) : error ? (
                                <Card className="border-none shadow-lg">
                                    <CardContent className="py-12 text-center">
                                        <div className="text-red-500 mb-4 text-2xl">⚠️</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Communities</h3>
                                        <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
                                        <Button onClick={() => refetch()}>Try Again</Button>
                                    </CardContent>
                                </Card>
                            ) : filteredResources.length === 0 ? (
                                <Card className="border-none shadow-lg">
                                    <CardContent className="py-12 text-center">
                                        <Church className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No faith communities found</h3>
                                        <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                                        <Button onClick={clearFilters}>Clear Filters</Button>
                                    </CardContent>
                                </Card>
                            ) : viewMode === 'list' ? (
                                <TooltipProvider delayDuration={200}>
                                    <div className="space-y-3 sm:space-y-4">
                                        {filteredResources.map((resource) => {
                                            const accommodations = resource.accommodations || [];
                                            const programs = resource.programs || [];

                                            return (
                                                <Card key={resource.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                                                    <CardContent className="p-4 sm:p-6">
                                                        {/* Card header */}
                                                        <div className="flex items-start justify-between gap-2 mb-3">
                                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <Church className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <Link to={`/churches/${resource.slug}`}>
                                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2">
                                                                            {resource.name}
                                                                        </h3>
                                                                    </Link>
                                                                    {resource.denomination && (
                                                                        <p className="text-xs sm:text-sm text-gray-600">{resource.denomination}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {resource.verified && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="inline-flex items-center bg-green-100 text-green-800 border border-green-200 rounded-full px-2 py-0.5 text-xs cursor-help flex-shrink-0">
                                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                                            <span className="hidden sm:inline">Verified</span>
                                                                            <span className="sm:hidden">✓</span>
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="max-w-xs">
                                                                        <p>Verified by Florida Autism Services</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>

                                                        {resource.description && (
                                                            <p className="text-gray-700 mb-3 line-clamp-2 text-sm">{resource.description}</p>
                                                        )}

                                                        {/* Programs */}
                                                        {programs.length > 0 && (
                                                            <div className="mb-3">
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {programs.map((program, idx) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 text-xs cursor-help">
                                                                                    {toTitleCase(program)}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-xs">
                                                                                <p>{getTagTooltip(program)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Accommodations */}
                                                        {accommodations.length > 0 && (
                                                            <div className="mb-3">
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {accommodations.slice(0, 4).map((acc, idx) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-2.5 py-0.5 text-xs cursor-help">
                                                                                    {toTitleCase(acc)}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-xs">
                                                                                <p>{getTagTooltip(acc)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                    {accommodations.length > 4 && (
                                                                        <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-2.5 py-0.5 text-xs">
                                                                            +{accommodations.length - 4} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Contact Info */}
                                                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 border-t pt-3">
                                                            {resource.city && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {resource.city}, FL
                                                                </span>
                                                            )}
                                                            {resource.phone && (
                                                                <a href={`tel:${resource.phone}`} className="flex items-center gap-1 hover:text-rose-600">
                                                                    <Phone className="w-3 h-3" />
                                                                    {resource.phone}
                                                                </a>
                                                            )}
                                                            {resource.website && (
                                                                <a href={resource.website.startsWith('http') ? resource.website : `https://${resource.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-rose-600">
                                                                    <Globe className="w-3 h-3" />
                                                                    Website
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* View Details Button */}
                                                        <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
                                                            <Link to={`/churches/${resource.slug}`}>
                                                                <Button variant="outline" size="sm" className="text-sm text-rose-600 border-rose-600 hover:bg-rose-50">
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </TooltipProvider>
                            ) : (
                                /* Map View */
                                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
                                    {!MapComponent ? (
                                        <div className="h-full flex items-center justify-center bg-gray-100">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
                                        </div>
                                    ) : (
                                        <>
                                            <MapComponent.MapContainer
                                                center={[27.9944024, -81.7602544]}
                                                zoom={7}
                                                className="h-full w-full"
                                            >
                                                <MapComponent.TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />

                                                {/* Church markers */}
                                                {mappableResources.map((resource) => (
                                                    <MapComponent.Marker
                                                        key={resource.id}
                                                        position={[Number(resource.lat), Number(resource.lon)]}
                                                    >
                                                        <MapComponent.Tooltip
                                                            direction="top"
                                                            offset={[0, -20]}
                                                            opacity={0.95}
                                                        >
                                                            <div className="text-center">
                                                                <p className="font-bold text-sm">{resource.name}</p>
                                                                <p className="text-xs text-gray-600">{resource.city}, FL</p>
                                                                {resource.denomination && (
                                                                    <p className="text-xs text-rose-600">{resource.denomination}</p>
                                                                )}
                                                            </div>
                                                        </MapComponent.Tooltip>
                                                        <MapComponent.Popup>
                                                            <div className="p-2 min-w-[200px]">
                                                                <Link to={`/churches/${resource.slug}`} className="hover:text-rose-600 transition-colors">
                                                                    <h3 className="font-bold text-sm mb-1 hover:underline">{resource.name}</h3>
                                                                </Link>
                                                                {resource.denomination && (
                                                                    <p className="text-xs text-gray-600 mb-1">{resource.denomination}</p>
                                                                )}
                                                                <p className="text-xs text-gray-600 mb-2">
                                                                    {resource.city}, FL
                                                                </p>

                                                                <div className="flex gap-2">
                                                                    {resource.phone && (
                                                                        <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}>
                                                                            <Button size="sm" variant="outline" className="text-xs">
                                                                                <Phone className="w-3 h-3 mr-1" />
                                                                                Call
                                                                            </Button>
                                                                        </a>
                                                                    )}
                                                                    <a
                                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lon}`}
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
                                                            <span className="text-rose-600 font-bold">{mappableResources.length}</span> on map
                                                        </p>
                                                    </CardContent>
                                                </Card>
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
