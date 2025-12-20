import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Church, Search, MapPin, Phone, Globe, Heart,
    Users, CalendarDays, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    address?: string;
    denomination?: string;
    description?: string;
    accommodations?: string[];
    programs?: string[];
    phone?: string;
    website?: string;
    verified?: boolean;
}

const toTitleCase = (str: string): string => {
    return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const getAccommodationTooltip = (accommodation: string): string => {
    const a = accommodation.toLowerCase().replace(/-/g, ' ');
    if (a.includes('sensory room') || a === 'sensory room') return 'Dedicated quiet space with calming activities for sensory regulation';
    if (a.includes('visual schedule')) return 'Picture-based schedules to help individuals understand what will happen next';
    if (a.includes('modified curriculum')) return 'Teaching materials adapted for different learning styles and needs';
    if (a.includes('specialized adult class')) return 'Classes specifically designed for adults with developmental disabilities';
    if (a.includes('softer acoustic') || a.includes('dimmed light')) return 'Reduced sensory stimulation during services';
    if (a.includes('flexible seating')) return 'Options to move, stand, or sit in different positions during service';
    if (a.includes('sensory bag')) return 'Bags with fidget tools, headphones, and other sensory supports';
    if (a.includes('sensory friendly environment')) return 'Overall environment designed to reduce sensory overload';
    if (a.includes('special needs ministry')) return 'Dedicated ministry team trained in autism and disability support';
    if (a.includes('multiple campus')) return 'Accommodations available across multiple church locations';
    if (a.includes('visual learning')) return 'Teaching methods using pictures, videos, and visual aids';
    if (a.includes('autism friendly worship')) return 'Worship services designed with autism needs in mind';
    if (a.includes('cognitive disability')) return 'Support for individuals with intellectual and developmental disabilities';
    if (a.includes('individualized care')) return 'One-on-one attention and personalized support';
    if (a.includes('trained volunteer')) return 'Volunteers trained in autism awareness and support techniques';
    if (a.includes('special needs room')) return 'Dedicated space for individuals who need extra support or breaks';
    if (a.includes('adapted curriculum')) return 'Lesson materials modified for different learning abilities';
    if (a.includes('special needs support')) return 'Ongoing support and resources for families affected by special needs';
    if (a.includes('neurodiversity acceptance')) return 'Culture of understanding and celebrating neurological differences';
    if (a.includes('accessible faith')) return 'Religious education and services made accessible to all abilities';
    if (a.includes('autism faith network')) return 'Partnership with network providing autism ministry resources and training';
    if (a === 'buddy' || a === 'buddy system') return 'One-on-one companion providing support during activities';
    if (a === 'buddy break') return 'Respite program providing breaks for caregivers with trained companion support';
    if (a === 'adaptive classroom') return 'Classroom environment modified for different learning styles and sensory needs';
    if (a === 'small ratio') return 'Small student-to-teacher ratio for individualized attention';
    if (a === 'sensory outlets') return 'Designated areas or items for sensory regulation (fidgets, movement spaces)';
    if (a === 'compression blanket') return 'Weighted blankets available for sensory regulation and calming';
    if (a === 'swing') return 'Therapeutic swings for sensory input and regulation';
    if (a === 'trampoline') return 'Trampolines for sensory movement and regulation';
    if (a === 'quiet space') return 'Designated quiet area for breaks from sensory stimulation';
    if (a === 'respite' || a === 'respite care') return 'Temporary care giving families a break from caregiving responsibilities';
    if (a === 'respite night') return 'Evening respite program allowing caregivers time for themselves';
    if (a === 'adult respite') return 'Respite services specifically for adults with disabilities';
    if (a === 'adult class' || a === 'adult program') return 'Classes and programs specifically for adults with autism';
    if (a === 'camps') return 'Special needs camps providing recreational activities and socialization';
    if (a === 'adaptive sports') return 'Sports activities adapted for individuals with disabilities';
    if (a === 'creative arts') return 'Art programs adapted for different abilities and sensory needs';
    if (a === 'job skills program') return 'Program teaching vocational and employment skills';
    if (a === 'special worship service') return 'Worship services specifically designed for individuals with special needs';
    if (a === 'alternative service times') return 'Worship times specifically designed to be sensory-friendly or less crowded';
    if (a === 'inclusive' || a === 'inclusive children') return 'Fully inclusive environment welcoming all abilities';
    if (a === 'trained volunteers') return 'Volunteers trained in autism awareness and support techniques';
    if (a === 'autism friendly') return 'Worship services designed with autism needs in mind';
    if (a === 'sensory friendly') return 'Overall environment designed to reduce sensory overload';
    if (a === 'individualized support') return 'One-on-one attention and personalized support';
    return 'Accommodation provided to support sensory and accessibility needs';
};

const getProgramTooltip = (program: string): string => {
    const p = program.toLowerCase().replace(/-/g, ' ');
    if (p.includes('champions room')) return 'Specialized care room with trained volunteers for children with special needs';
    if (p.includes('special needs care')) return 'Individualized care and support for individuals with special needs';
    if (p.includes('kids in action')) return 'Active program for children with sensory-friendly activities';
    if (p.includes('jesus cares')) return 'Ministry specifically designed for adults with intellectual disabilities';
    if (p.includes('adult program')) return 'Programs and activities designed for adults with autism';
    if (p.includes('children') && p.includes('program')) return 'Programming designed for children with autism and special needs';
    if (p.includes('children') && p.includes('ministry')) return 'Ministry focused on children with special needs';
    if (p.includes('sensory friendly')) return 'Services and activities with reduced sensory stimulation';
    if (p.includes('special worship')) return 'Worship services adapted for individuals with autism and cognitive disabilities';
    if (p.includes('visual support')) return 'Visual aids and schedules to support understanding';
    if (p.includes('autism awareness')) return 'Education and training on autism acceptance and support';
    if (p.includes('adapted')) return 'Modified programming to meet individual needs';
    if (p.includes('special needs ministry')) return 'Dedicated ministry serving individuals and families affected by special needs';
    return 'Special program offered by this faith community';
};

export default function FaithResources() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("all");
    const [selectedDenomination, setSelectedDenomination] = useState("all");

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
        if (church.ChildrenProgram) programs.push('Children\'s Program');
        if (church.AdultProgram) programs.push('Adult Program');

        return {
            id: church.id,
            slug: church.slug,
            name: church.ChurchName,
            city: church.City || undefined,
            address: church.Street || undefined,
            denomination: church.Denomination || undefined,
            description: church.AccommodationSnippet || undefined,
            accommodations,
            programs,
            phone: church.Phone || undefined,
            website: church.Website || undefined,
            verified: !!church.LastVerifiedDate,
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

    const cities: string[] = [...new Set(resources.map((r: Resource) => r.city).filter((city: string | undefined): city is string => Boolean(city)))].sort();
    const denominations: string[] = [...new Set(resources.map((r: Resource) => r.denomination).filter((denom: string | undefined): denom is string => Boolean(denom)))].sort();

    const filteredResources = resources.filter((resource: Resource) => {
        const matchesSearch = !searchTerm ||
            resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.denomination?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === "all" || resource.city === selectedCity;
        const matchesDenomination = selectedDenomination === "all" || resource.denomination === selectedDenomination;
        return matchesSearch && matchesCity && matchesDenomination;
    });

    // SEO structured data
    const faithSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Autism-Friendly Faith Communities in Florida",
        "description": "Find churches, synagogues, and worship spaces in Florida that welcome neurodivergent individuals with sensory-friendly accommodations, trained staff, and inclusive programs.",
        "url": "https://floridaautismservices.com/faith",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Welcoming Faith Communities",
            "description": "Churches and religious organizations in Florida with autism-friendly programs and accommodations",
            "numberOfItems": resources.length,
            "itemListElement": resources.slice(0, 10).map((resource, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "PlaceOfWorship",
                    "name": resource.name,
                    ...(resource.description && { "description": resource.description }),
                    ...(resource.city && {
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": resource.city,
                            "addressRegion": "FL",
                            "addressCountry": "US"
                        }
                    }),
                    ...(resource.phone && { "telephone": resource.phone }),
                    ...(resource.website && { "url": resource.website }),
                    ...(resource.denomination && { "additionalType": resource.denomination })
                }
            }))
        },
        "provider": {
            "@type": "Organization",
            "name": "Florida Autism Services Directory",
            "url": "https://floridaautismservices.com"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://floridaautismservices.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Faith Communities",
                "item": "https://floridaautismservices.com/faith"
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>Autism-Friendly Churches & Faith Communities | Florida</title>
                <meta name="description" content={`Find ${resources.length}+ autism-friendly churches and faith communities across Florida. Sensory-friendly worship, trained volunteers, special needs ministries, and inclusive programs welcoming neurodivergent individuals.`} />
                <meta name="keywords" content="autism friendly church Florida, sensory friendly church, special needs ministry, autism church program, neurodivergent worship, inclusive church, autism faith community, sensory friendly worship" />
                <link rel="canonical" href="https://floridaautismservices.com/faith" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Autism-Friendly Faith Communities | Florida" />
                <meta property="og:description" content={`Discover ${resources.length}+ welcoming churches and faith communities in Florida with sensory-friendly accommodations and special needs programs.`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://floridaautismservices.com/faith" />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Autism-Friendly Churches in Florida" />
                <meta name="twitter:description" content={`Find ${resources.length}+ autism-friendly churches and faith communities across Florida.`} />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(faithSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-12">
                {/* Hero Section - MOBILE OPTIMIZED */}
                <header className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-8 sm:py-10 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        {/* Mobile: stacked layout, Desktop: side-by-side */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0" role="img" aria-label="Church icon">
                                <Church className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">Welcoming Faith Communities</h1>
                                <p className="text-base sm:text-lg lg:text-xl text-rose-100">Find churches, synagogues, and worship spaces that embrace neurodiversity</p>
                            </div>
                        </div>
                        {/* Feature cards - MOBILE: horizontal scroll or stacked */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" aria-hidden="true" />
                                    <div>
                                        <p className="text-white font-semibold text-sm sm:text-base">Sensory-Friendly</p>
                                        <p className="text-rose-100 text-xs sm:text-sm">Accommodating spaces</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" aria-hidden="true" />
                                    <div>
                                        <p className="text-white font-semibold text-sm sm:text-base">Trained Staff</p>
                                        <p className="text-rose-100 text-xs sm:text-sm">Understanding volunteers</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                                    <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" aria-hidden="true" />
                                    <div>
                                        <p className="text-white font-semibold text-sm sm:text-base">Special Programs</p>
                                        <p className="text-rose-100 text-xs sm:text-sm">Inclusive ministries</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Search and Filters - MOBILE OPTIMIZED */}
                    <Card className="border-none shadow-lg mb-6 sm:mb-8">
                        <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="sm:col-span-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                                        <Input 
                                            type="text" 
                                            placeholder="Search communities..." 
                                            value={searchTerm} 
                                            onChange={(e) => setSearchTerm(e.target.value)} 
                                            className="pl-10 h-11 sm:h-10"
                                            aria-label="Search faith communities"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                                        <SelectTrigger aria-label="Filter by city" className="h-11 sm:h-10">
                                            <SelectValue placeholder="All Cities" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Cities</SelectItem>
                                            {cities.map((city: string) => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select value={selectedDenomination} onValueChange={setSelectedDenomination}>
                                        <SelectTrigger aria-label="Filter by denomination" className="h-11 sm:h-10">
                                            <SelectValue placeholder="All Denominations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Denominations</SelectItem>
                                            {denominations.map((denom: string) => (
                                                <SelectItem key={denom} value={denom}>{denom}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results count */}
                    <div className="mb-4 sm:mb-6">
                        <p className="text-gray-600 text-sm sm:text-base">
                            <span className="font-semibold text-gray-900">{filteredResources.length}</span> welcoming faith communities
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8 sm:py-12">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-rose-600 mx-auto" />
                            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading faith communities...</p>
                        </div>
                    ) : error ? (
                        <Card className="border-none shadow-lg">
                            <CardContent className="py-8 sm:py-12 text-center px-4">
                                <div className="text-red-500 mb-4 text-2xl" aria-hidden="true">⚠️</div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Communities</h2>
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">{error instanceof Error ? error.message : 'Unknown error'}</p>
                                <Button onClick={() => refetch()} className="h-11 sm:h-10">Try Again</Button>
                            </CardContent>
                        </Card>
                    ) : filteredResources.length === 0 ? (
                        <Card className="border-none shadow-lg">
                            <CardContent className="py-8 sm:py-12 text-center px-4">
                                <Church className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No faith communities found</h2>
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                    {resources.length === 0 ? "No faith communities loaded from database" : "Try adjusting your filters"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <section aria-label="Faith communities listing">
                            {/* MOBILE: single column, SM+: 2 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <TooltipProvider delayDuration={200}>
                                    {filteredResources.map((resource: Resource) => {
                                        const accommodations = resource.accommodations || [];
                                        const programs = resource.programs || [];

                                        return (
                                            <article key={resource.id}>
                                                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow group h-full">
                                                    <CardContent className="p-4 sm:p-6">
                                                        {/* Card header - responsive layout */}
                                                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                                                            <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                                                    <Church className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    {/* CLICKABLE CHURCH NAME */}
                                                                    <Link to={`/churches/${resource.slug}`}>
                                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors cursor-pointer hover:underline line-clamp-2">
                                                                            {resource.name}
                                                                        </h3>
                                                                    </Link>
                                                                    {resource.denomination && (
                                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{resource.denomination}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* VERIFIED BADGE WITH TOOLTIP */}
                                                            {resource.verified && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="inline-flex flex-shrink-0">
                                                                            <Badge className="bg-green-100 text-green-800 border-green-200 cursor-help text-xs">
                                                                                <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
                                                                                <span className="hidden sm:inline">Verified</span>
                                                                                <span className="sm:hidden">✓</span>
                                                                            </Badge>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="bg-green-800 text-white border-green-700 max-w-xs">
                                                                        <p className="text-xs font-semibold mb-1">✓ Verified Community</p>
                                                                        <p className="text-xs">This faith community has been verified by Florida Autism Services. Their autism-friendly programs and accommodations have been confirmed through direct contact or official documentation.</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>

                                                        {resource.description && (
                                                            <p className="text-gray-700 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">{resource.description}</p>
                                                        )}

                                                        {/* Accommodations with Tooltips */}
                                                        {accommodations.length > 0 && (
                                                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-rose-50 rounded-lg border border-rose-100">
                                                                <p className="text-xs font-semibold text-rose-900 mb-2">Neurodivergent-Friendly Features:</p>
                                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                    {accommodations.slice(0, 4).map((acc: string, idx: number) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="inline-flex">
                                                                                    <Badge variant="secondary" className="text-xs bg-white cursor-help">
                                                                                        {toTitleCase(acc)}
                                                                                    </Badge>
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="bg-rose-800 text-white border-rose-700 max-w-xs">
                                                                                <p className="text-xs">{getAccommodationTooltip(acc)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                    {accommodations.length > 4 && (
                                                                        <Badge variant="secondary" className="text-xs bg-white">+{accommodations.length - 4} more</Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Programs with Tooltips */}
                                                        {programs.length > 0 && (
                                                            <div className="mb-3 sm:mb-4">
                                                                <p className="text-xs font-semibold text-gray-700 mb-2">Programs:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {programs.slice(0, 3).map((program: string, idx: number) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="inline-flex">
                                                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs cursor-help">
                                                                                        {toTitleCase(program)}
                                                                                    </Badge>
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="bg-blue-800 text-white border-blue-700 max-w-xs">
                                                                                <p className="text-xs">{getProgramTooltip(program)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Contact Info */}
                                                        <address className="space-y-1.5 sm:space-y-2 border-t pt-3 sm:pt-4 not-italic">
                                                            {resource.address && (
                                                                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                                                    <div>
                                                                        <p>{resource.address}</p>
                                                                        <p>{resource.city}, FL</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!resource.address && resource.city && (
                                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <MapPin className="w-4 h-4" aria-hidden="true" />
                                                                    <span>{resource.city}, FL</span>
                                                                </div>
                                                            )}
                                                            {resource.phone && (
                                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <Phone className="w-4 h-4" aria-hidden="true" />
                                                                    <a href={`tel:${resource.phone}`} className="hover:text-rose-600">{resource.phone}</a>
                                                                </div>
                                                            )}
                                                            {resource.website && (
                                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <Globe className="w-4 h-4" aria-hidden="true" />
                                                                    <a href={resource.website} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 truncate">Visit Website</a>
                                                                </div>
                                                            )}
                                                        </address>

                                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                                                            <Link to={`/churches/${resource.slug}`}>
                                                                <Button className="w-full h-11 sm:h-10 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                                                                    View Full Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </article>
                                        );
                                    })}
                                </TooltipProvider>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}