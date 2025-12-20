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

// Tooltip definitions for church tags
const tagTooltips: Record<string, string> = {
    'sensory friendly': 'Environment designed to minimize sensory overload with reduced noise, lighting adjustments, and calm spaces',
    'sensory room': 'Dedicated space with sensory equipment for decompression and regulation',
    'quiet space': 'Designated quiet area available for those who need a break',
    'buddy system': 'Trained volunteers paired one-on-one with individuals who need extra support',
    'alternative service': 'Modified worship service with sensory accommodations',
    'children\'s program': 'Special needs programming available for children',
    'adult program': 'Special needs programming available for adults',
    'community events': 'Church participates in community disability/autism events',
    'adult bible study': 'Bible study group specifically for adults with special needs',
};

const getTagTooltip = (tag: string): string => {
    const normalizedTag = tag.toLowerCase().trim();
    return tagTooltips[normalizedTag] || 'Accommodation provided to support accessibility needs';
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

                                                        {/* Programs with Tooltips */}
                                                        {programs.length > 0 && (
                                                            <div className="mb-3 sm:mb-4">
                                                                <p className="text-xs font-semibold text-gray-700 mb-2">Programs:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {programs.map((program: string, idx: number) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm cursor-help">
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

                                                        {/* Accommodations with Tooltips */}
                                                        {accommodations.length > 0 && (
                                                            <div className="mb-3 sm:mb-4">
                                                                <p className="text-xs font-semibold text-gray-700 mb-2">Accommodations:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {accommodations.slice(0, 4).map((acc: string, idx: number) => (
                                                                        <Tooltip key={idx}>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-3 py-1 text-sm cursor-help">
                                                                                    {toTitleCase(acc)}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-xs">
                                                                                <p>{getTagTooltip(acc)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                    {accommodations.length > 4 && (
                                                                        <span className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-3 py-1 text-sm">
                                                                            +{accommodations.length - 4} more
                                                                        </span>
                                                                    )}
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