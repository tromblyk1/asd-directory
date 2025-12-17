import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar, MapPin, Clock, Users, Search,
    ExternalLink, Star, Filter, X, ChevronDown
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { EventVerificationBadge } from "@/components/EventVerificationBadge";

type EventCategory = 'sensory_friendly' | 'support_group' | 'educational' | 'social' | 'fundraiser' | 'professional_development' | 'recreational' | 'other';

const categoryColors: Record<EventCategory, string> = {
    sensory_friendly: "bg-purple-100 text-purple-800 border-purple-200",
    support_group: "bg-blue-100 text-blue-800 border-blue-200",
    educational: "bg-green-100 text-green-800 border-green-200",
    social: "bg-orange-100 text-orange-800 border-orange-200",
    fundraiser: "bg-pink-100 text-pink-800 border-pink-200",
    professional_development: "bg-indigo-100 text-indigo-800 border-indigo-200",
    recreational: "bg-cyan-100 text-cyan-800 border-cyan-200",
    other: "bg-gray-100 text-gray-800 border-gray-200",
};

const categoryNames: Record<string, string> = {
    sensory_friendly: "Sensory-Friendly",
    support_group: "Support Groups",
    educational: "Educational",
    social: "Social",
    fundraiser: "Fundraiser",
    professional_development: "Professional Development",
    recreational: "Recreational",
    other: "Other"
};

// Helper to format category for display (capitalize properly)
const formatCategory = (category: string | null | undefined): string => {
    if (!category) return 'Other';
    // Check if we have a mapped name first
    if (categoryNames[category]) return categoryNames[category];
    // Otherwise, format the raw value: replace underscores, capitalize each word
    return category
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Helper to format age groups for display (capitalize, remove hyphens)
const formatAgeGroup = (age: string): string => {
    return age
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export default function Events() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [timeFilter, setTimeFilter] = useState("upcoming");
    const [showFilters, setShowFilters] = useState(false);

    const { data: events = [], isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => base44.entities.Event.list('date', 500),
        initialData: [],
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const cities = [...new Set(events.map(e => e.city).filter(Boolean))].sort();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchTerm, selectedCategory, selectedCity, timeFilter]);

    const filteredEvents = useMemo(() => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2); // Only show events within 2 years
        const maxDateStr = maxDate.toISOString().split('T')[0];

        return events.filter(event => {
            // Filter out events with unrealistic future dates (likely data errors)
            if (event.date > maxDateStr) {
                return false;
            }

            const matchesSearch = !searchTerm ||
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.city?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
            const matchesCity = selectedCity === "all" || event.city === selectedCity;

            const isPast = event.date < today;
            const matchesTime = timeFilter === "all" ||
                (timeFilter === "upcoming" && !isPast) ||
                (timeFilter === "past" && isPast);

            return matchesSearch && matchesCategory && matchesCity && matchesTime;
        });
    }, [events, searchTerm, selectedCategory, selectedCity, timeFilter, today]);

    const groupedEvents = useMemo(() => {
        const groups: Record<string, typeof events> = {};
        filteredEvents.forEach(event => {
            const monthKey = format(new Date(event.date + 'T12:00:00'), 'MMMM yyyy');
            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(event);
        });
        return groups;
    }, [filteredEvents]);

    // Count active filters for badge
    const activeFilterCount = [
        selectedCategory !== "all",
        selectedCity !== "all",
        timeFilter !== "upcoming",
        searchTerm.length > 0
    ].filter(Boolean).length;

    // Count upcoming events for SEO
    const upcomingCount = events.filter(e => e.date >= today).length;

    // SEO structured data
    const eventsSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Autism Events Calendar - Florida",
        "description": "Find sensory-friendly events, support groups, and autism community gatherings across Florida. Searchable calendar of upcoming events for families and individuals affected by autism.",
        "url": "https://floridaautismservices.com/events",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredEvents.length,
            "itemListElement": filteredEvents.slice(0, 10).map((event, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Event",
                    "name": event.title,
                    "startDate": event.date,
                    "location": {
                        "@type": "Place",
                        "name": event.location,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": event.city,
                            "addressRegion": "FL",
                            "addressCountry": "US"
                        }
                    },
                    ...(event.description && { "description": event.description.substring(0, 200) }),
                    ...(event.registration_url && { "url": event.registration_url })
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
                "name": "Events",
                "item": "https://floridaautismservices.com/events"
            }
        ]
    };

    // Filter panel content - extracted as inline JSX to avoid focus issues
    const filterContent = (
        <>
            <h2 className="text-lg font-bold text-gray-900 mb-4 hidden lg:block">Filter Events</h2>

            {/* Search */}
            <div className="mb-4 lg:mb-6">
                <label htmlFor="event-search" className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="event-search"
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Time Filter */}
            <div className="mb-4 lg:mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Time</p>
                <div className="space-y-2">
                    {[
                        { value: "upcoming", label: "Upcoming" },
                        { value: "past", label: "Past Events" },
                        { value: "all", label: "All Events" }
                    ].map(option => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                                type="radio"
                                name="timeFilter"
                                value={option.value}
                                checked={timeFilter === option.value}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="w-4 h-4 text-green-600"
                            />
                            <span className="text-sm text-gray-600">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4 lg:mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === "all"}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-gray-600">All Categories</span>
                    </label>
                    {Object.entries(categoryNames).map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                                type="radio"
                                name="category"
                                value={value}
                                checked={selectedCategory === value}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-4 h-4 text-green-600"
                            />
                            <span className="text-sm text-gray-600">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* City Filter */}
            {cities.length > 0 && (
                <div className="mb-4 lg:mb-0">
                    <p className="text-sm font-medium text-gray-700 mb-2">City</p>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                        aria-label="Filter by city"
                    >
                        <option value="all">All Cities</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Results Count - Desktop only */}
            <div className="hidden lg:block mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">{filteredEvents.length}</span> events found
                </p>
            </div>
        </>
    );

    return (
        <>
            <Helmet>
                <title>Autism Events Calendar | Sensory-Friendly Events in Florida</title>
                <meta name="description" content={`Find ${upcomingCount}+ autism events in Florida. Sensory-friendly activities, support groups, educational workshops, and community gatherings for families affected by autism.`} />
                <meta name="keywords" content="autism events Florida, sensory friendly events, autism support groups, autism community events, autism workshops, autism fundraisers, autism family events, special needs events Florida" />
                <link rel="canonical" href="https://floridaautismservices.com/events" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Autism Events Calendar | Florida Autism Services" />
                <meta property="og:description" content={`Discover ${upcomingCount}+ upcoming autism events across Florida. Find sensory-friendly activities, support groups, and community gatherings near you.`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://floridaautismservices.com/events" />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Autism Events Calendar | Florida" />
                <meta name="twitter:description" content={`Find ${upcomingCount}+ autism events in Florida. Sensory-friendly activities and support groups.`} />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(eventsSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-8 sm:pb-12">
                {/* Header - Mobile optimized */}
                <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 sm:py-10 lg:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0" role="img" aria-label="Calendar icon">
                                <Calendar className="w-5 h-5 sm:w-8 sm:h-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Events Calendar</h1>
                                <p className="text-base sm:text-lg lg:text-xl text-green-50 truncate sm:whitespace-normal">
                                    <span className="hidden sm:inline">Sensory-friendly events and community gatherings across Florida</span>
                                    <span className="sm:hidden">Sensory-friendly events in Florida</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full justify-between h-11"
                        >
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter Events
                                {activeFilterCount > 0 && (
                                    <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5 min-w-[20px]">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                        
                        {/* Mobile Filter Panel */}
                        {showFilters && (
                            <Card className="mt-2 border-none shadow-lg">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="font-bold text-gray-900">Filters</h2>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowFilters(false)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {filterContent}
                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-green-600">{filteredEvents.length}</span> events
                                        </p>
                                        <Button
                                            onClick={() => setShowFilters(false)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Show Results
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="flex gap-6 lg:gap-8">
                        {/* LEFT SIDEBAR FILTERS - Desktop only */}
                        <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Event filters">
                            <Card className="border-none shadow-lg sticky top-8">
                                <CardContent className="p-6">
                                    {filterContent}
                                </CardContent>
                            </Card>
                        </aside>

                        {/* MAIN CONTENT */}
                        <section className="flex-1 min-w-0" aria-label="Events listing">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
                                    <p className="mt-4 text-gray-600">Loading events...</p>
                                </div>
                            ) : filteredEvents.length === 0 ? (
                                <Card className="border-none shadow-lg">
                                    <CardContent className="py-8 sm:py-12 text-center">
                                        <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            No events found
                                        </h2>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            Try adjusting your filters or search term
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6 sm:space-y-10">
                                    {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                                        <div key={month}>
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                {month}
                                            </h2>
                                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                                {monthEvents.map((event) => {
                                                    const isPast = event.date < today;
                                                    return (
                                                        <article key={event.id}>
                                                            <Card className={`border-none shadow-lg h-full ${isPast ? 'opacity-60' : ''} hover:shadow-xl transition-shadow group`}>
                                                                <CardContent className="p-4 sm:p-6">
                                                                    {/* Category & Registration badges */}
                                                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                                                                        <Badge className={`${categoryColors[event.category as EventCategory] || categoryColors.other} border text-xs`}>
                                                                            {formatCategory(event.category)}
                                                                        </Badge>

                                                                        {event.verified === true && <EventVerificationBadge accommodations_verified={event.accommodations_verified} />}

                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`text-xs ${(() => {
                                                                                const regText = (event.registration_required || '').toString().trim();
                                                                                if (!regText) return 'bg-gray-50 text-gray-700 border-gray-300';
                                                                                if (regText.toLowerCase().includes('no')) return 'bg-green-50 text-green-700 border-green-300';
                                                                                return 'bg-blue-50 text-blue-700 border-blue-300';
                                                                            })()}`}
                                                                        >
                                                                            {(() => {
                                                                                const regText = (event.registration_required || '').toString().trim();

                                                                                if (!regText) return 'Registration info not available';
                                                                                if (regText.toLowerCase().includes('no')) return 'Walk-ins Welcome';

                                                                                // Remove "YES - " or "YES" prefix
                                                                                const cleaned = regText.replace(/^YES\s*-?\s*/i, '').trim();

                                                                                // If cleaning removed everything, show generic text
                                                                                return cleaned || 'Registration Required';
                                                                            })()}
                                                                        </Badge>
                                                                    </div>

                                                                    {event.slug ? (
                                                                        <Link to={`/events/${event.slug}`}>
                                                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors cursor-pointer line-clamp-2">
                                                                                {event.title}
                                                                            </h3>
                                                                        </Link>
                                                                    ) : (
                                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                                                            {event.title}
                                                                        </h3>
                                                                    )}

                                                                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm text-gray-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                                                            <time dateTime={event.date} className="truncate">
                                                                                <span className="hidden sm:inline">{format(new Date(event.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}</span>
                                                                                <span className="sm:hidden">{format(new Date(event.date + 'T12:00:00'), 'EEE, MMM d, yyyy')}</span>
                                                                            </time>
                                                                        </div>
                                                                        {event.time && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                                                                <span>{event.time}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center gap-2">
                                                                            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                                                            <span className="truncate">{event.location}, {event.city}</span>
                                                                        </div>
                                                                    </div>

                                                                    {event.description && (
                                                                        <p className="text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                                                                            {event.description}
                                                                        </p>
                                                                    )}

                                                                    {event.age_groups && event.age_groups.length > 0 && (
                                                                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                                                            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {event.age_groups.map((age: string, idx: number) => (
                                                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                                                        {formatAgeGroup(age)}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {isPast ? (
                                                                        <Badge variant="outline" className="w-full justify-center">
                                                                            Past Event
                                                                        </Badge>
                                                                    ) : !event.registration_required || event.registration_required.toLowerCase().includes('no') ? (
                                                                        // Walk-ins or no registration info
                                                                        event.registration_url ? (
                                                                            <a
                                                                                href={event.registration_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="block"
                                                                            >
                                                                                <Button variant="outline" className="w-full h-10 sm:h-9">
                                                                                    <span className="hidden sm:inline">View Event Details</span>
                                                                                    <span className="sm:hidden">View Details</span>
                                                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                                                </Button>
                                                                            </a>
                                                                        ) : null
                                                                    ) : (
                                                                        // Registration IS required
                                                                        event.registration_url ? (
                                                                            <a
                                                                                href={event.registration_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="block"
                                                                            >
                                                                                <Button className="w-full h-10 sm:h-9 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                                                                    Register Now
                                                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                                                </Button>
                                                                            </a>
                                                                        ) : event.contact_email ? (
                                                                            <a href={`mailto:${event.contact_email}`}>
                                                                                <Button variant="outline" className="w-full h-10 sm:h-9">
                                                                                    Contact for Info
                                                                                </Button>
                                                                            </a>
                                                                        ) : null
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}