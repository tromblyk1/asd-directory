import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Calendar, MapPin, Clock, Users, ArrowLeft,
    ExternalLink, Share2, CheckCircle, AlertCircle, Info, Navigation, Globe, Mail,
    Facebook, Instagram, Twitter, Youtube, Linkedin
} from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/Event.types";


// Format registration text - handle YES/NO and provide context
const formatRegistrationText = (text?: string | null): string => {
    if (!text) return 'Registration information not available';

    const trimmed = text.trim();
    const lowerText = trimmed.toLowerCase();

    // Handle bare "YES" - provide meaningful context
    if (lowerText === 'yes') {
        return 'Registration is required for this event';
    }

    // Handle bare "NO"
    if (lowerText === 'no') {
        return 'No registration required - walk-ins welcome';
    }

    // Remove "YES - " or "YES" prefix if there's more text after
    let cleaned = trimmed.replace(/^YES\s*-?\s*/i, '');

    // If it says "NO", make it clearer
    if (lowerText.includes('no') && (lowerText.includes('walk-in') || lowerText.includes('registration'))) {
        return cleaned || 'Walk-ins welcome - No registration required';
    }

    return cleaned || trimmed;
};

// Helper to format category for display (capitalize properly)
const formatCategory = (category: string | null | undefined): string => {
    if (!category) return 'Other';
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
    if (categoryNames[category]) return categoryNames[category];
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

export default function EventDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [MapComponent, setMapComponent] = useState<any>(null);

    // Load map dynamically
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
    }, []);

    const { data: event, isLoading } = useQuery<Event>({
        queryKey: ['event', slug],
        queryFn: async () => {
            const events = await base44.entities.Event.filter({ slug });
            return events[0];
        },
        enabled: !!slug,
        staleTime: 0,
        refetchOnMount: true,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
        );
    }

    if (!event) {
        return (
            <>
                <Helmet>
                    <title>Event Not Found | Florida Autism Services Directory</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full">
                        <CardContent className="p-6 sm:p-12 text-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
                            <Link to="/events">
                                <Button>Back to Events</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const today = new Date().toISOString().split('T')[0];
    const isPast = event.date ? event.date < today : false;

    // Check if event is sold out by looking for "SOLD OUT" in title or description
    const isSoldOut =
        event.title?.toUpperCase().includes('SOLD OUT') ||
        event.description?.toUpperCase().includes('SOLD OUT') ||
        false;

    const shareEvent = () => {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description || '',
                url: window.location.href,
            });
        }
    };

    // Helper function to check if a URL is valid and non-empty
    const isValidUrl = (url: string | null | undefined): boolean => {
        if (!url) return false;
        const trimmed = url.trim();
        if (!trimmed) return false;
        // Basic check - starts with http or is a relative URL
        return trimmed.startsWith('http') || trimmed.startsWith('/');
    };

    // Determine which URL to use for "Event Website" button
    const getEventWebsiteUrl = () => {
        if (isValidUrl(event.website_url) && event.website_url !== event.registration_url) {
            return event.website_url;
        }
        if (isValidUrl(event.registration_url)) {
            return event.registration_url;
        }
        return null;
    };

    const eventWebsiteUrl = getEventWebsiteUrl();
    const hasValidWebsite = isValidUrl(event.website_url) && event.website_url !== event.registration_url;

    // Check if event only has social media as its source
    const hasSocialOnly = !event.website_url && !event.registration_url &&
        (event.facebook_url || event.instagram_url || event.x_url || event.youtube_url || event.linkedin_url || event.tiktok_url);

    const primarySocial = event.facebook_url ? { name: 'Facebook', url: event.facebook_url, icon: Facebook, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800', brandColor: '#1877F2' }
        : event.instagram_url ? { name: 'Instagram', url: event.instagram_url, icon: Instagram, bgColor: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-800', brandColor: '#E4405F' }
        : event.x_url ? { name: 'X (Twitter)', url: event.x_url, icon: Twitter, bgColor: 'bg-gray-100', borderColor: 'border-gray-300', textColor: 'text-gray-800', brandColor: '#000000' }
        : event.youtube_url ? { name: 'YouTube', url: event.youtube_url, icon: Youtube, bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800', brandColor: '#FF0000' }
        : event.linkedin_url ? { name: 'LinkedIn', url: event.linkedin_url, icon: Linkedin, bgColor: 'bg-sky-50', borderColor: 'border-sky-200', textColor: 'text-sky-800', brandColor: '#0A66C2' }
        : null;

    // SEO data
    const canonicalUrl = `https://floridaautismservices.com/events/${slug}`;
    const eventTitle = event.title || 'Autism-Friendly Event';
    const eventDescription = event.description 
        ? event.description.substring(0, 160) 
        : `${eventTitle} - A sensory-friendly event in ${event.city || 'Florida'}. Find autism-friendly events and activities across Florida.`;
    const eventDate = event.date ? new Date(event.date + 'T12:00:00') : new Date();
    const formattedDate = format(eventDate, 'MMMM d, yyyy');

    // Schema.org Event structured data
    const eventSchema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": eventTitle,
        "description": event.description || `Sensory-friendly event in ${event.city}, Florida`,
        "startDate": event.date,
        ...(event.time && { "doorTime": event.time }),
        "eventStatus": isPast ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": event.venue_name || event.city,
            "address": {
                "@type": "PostalAddress",
                ...(event.address && { "streetAddress": event.address }),
                "addressLocality": event.city,
                "addressRegion": event.state || "FL",
                ...(event.zip_code && { "postalCode": event.zip_code }),
                "addressCountry": "US"
            }
        },
        ...(event.organizer_name && {
            "organizer": {
                "@type": "Organization",
                "name": event.organizer_name
            }
        }),
        ...(event.image_url && { "image": event.image_url }),
        ...(event.registration_url && { "url": event.registration_url }),
        ...(event.cost_info && {
            "offers": {
                "@type": "Offer",
                "description": event.cost_info,
                "url": event.registration_url || canonicalUrl
            }
        }),
        "isAccessibleForFree": event.cost_info?.toLowerCase().includes('free') || false
    };

    // Breadcrumb schema
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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": eventTitle,
                "item": canonicalUrl
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>{eventTitle} | {formattedDate} | Florida Autism Services</title>
                <meta name="description" content={eventDescription} />
                <meta name="keywords" content={`${eventTitle}, autism event Florida, sensory-friendly event, ${event.city} autism, autism activities Florida`} />
                <link rel="canonical" href={canonicalUrl} />
                
                {/* Open Graph */}
                <meta property="og:title" content={`${eventTitle} | ${formattedDate}`} />
                <meta property="og:description" content={eventDescription} />
                <meta property="og:type" content="event" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                {event.image_url && <meta property="og:image" content={event.image_url} />}
                
                {/* Twitter Card */}
                <meta name="twitter:card" content={event.image_url ? "summary_large_image" : "summary"} />
                <meta name="twitter:title" content={`${eventTitle} | ${formattedDate}`} />
                <meta name="twitter:description" content={eventDescription} />
                {event.image_url && <meta name="twitter:image" content={event.image_url} />}
                
                {/* Event-specific meta */}
                <meta property="event:start_time" content={event.date} />
                {event.city && <meta name="geo.placename" content={`${event.city}, Florida`} />}
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(eventSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-8 sm:pb-12">
                {/* Header - Mobile optimized */}
                <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 sm:py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <Link to="/events">
                            <Button variant="ghost" className="text-white hover:bg-white/20 mb-3 sm:mb-4 -ml-2 sm:ml-0">
                                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" aria-hidden="true" />
                                <span className="hidden sm:inline">Back to Events</span>
                                <span className="sm:hidden">Back</span>
                            </Button>
                        </Link>
                        
                        {/* Breadcrumb Navigation - Hidden on mobile */}
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-green-100 mb-2" aria-label="Breadcrumb">
                            <Link to="/" className="hover:text-white">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link to="/events" className="hover:text-white">Events</Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-white font-medium truncate max-w-[200px]">{eventTitle}</span>
                        </nav>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
                    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <article>
                                <Card className="border-none shadow-xl">
                                    <CardContent className="p-4 sm:p-6 lg:p-8">
                                {/* Header Section */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm">
                                                {formatCategory(event.category)}
                                            </Badge>
                                            {event.featured && (
                                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm">
                                                    Featured
                                                </Badge>
                                            )}
                                            {isPast && (
                                                <Badge variant="outline" className="text-xs sm:text-sm">Past Event</Badge>
                                            )}
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                            {eventTitle}
                                        </h1>
                                    </div>

                                    <Button onClick={shareEvent} variant="outline" className="gap-2 self-start" aria-label="Share this event">
                                        <Share2 className="w-4 h-4" aria-hidden="true" />
                                        <span className="hidden sm:inline">Share</span>
                                    </Button>
                                </div>

                                {/* Image */}
                                {event.image_url && (
                                    <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden -mx-4 sm:mx-0">
                                        <img
                                            src={event.image_url}
                                            alt={`${eventTitle} event`}
                                            className="w-full h-48 sm:h-64 lg:h-96 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Key Details */}
                                <section className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100" aria-label="Event details">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0" aria-hidden="true">
                                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium">Date</p>
                                            <p className="text-base sm:text-lg font-bold text-gray-900">
                                                <time dateTime={event.date}>
                                                    <span className="hidden sm:inline">{format(new Date(event.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}</span>
                                                    <span className="sm:hidden">{format(new Date(event.date + 'T12:00:00'), 'EEE, MMM d, yyyy')}</span>
                                                </time>
                                            </p>
                                        </div>
                                    </div>

                                    {event.time && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0" aria-hidden="true">
                                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Time</p>
                                                <p className="text-base sm:text-lg font-bold text-gray-900">{event.time}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 sm:col-span-2">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0" aria-hidden="true">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                        </div>
                                        <address className="flex-1 not-italic min-w-0">
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Location</p>
                                            <div className="text-gray-900 text-sm sm:text-base">
                                                {event.venue_name && <p className="font-semibold truncate">{event.venue_name}</p>}
                                                {event.address && <p className="truncate">{event.address}</p>}
                                                <p>{event.city}, {event.state || 'FL'} {event.zip_code}</p>
                                            </div>
                                        </address>
                                    </div>
                                </section>

                                {/* Social-Only Event Callout */}
                                {hasSocialOnly && primarySocial && (
                                    <Alert className={`mb-6 sm:mb-8 ${primarySocial.bgColor} ${primarySocial.borderColor}`}>
                                        <primarySocial.icon className={`h-5 w-5 ${primarySocial.textColor}`} aria-hidden="true" />
                                        <AlertDescription>
                                            <div className="space-y-3">
                                                <p className={`font-semibold ${primarySocial.textColor} text-sm sm:text-base`}>
                                                    This event is only listed on {primarySocial.name}
                                                </p>
                                                <p className="text-gray-700 text-sm">
                                                    Visit the event page for the latest details, updates, and to connect with the organizer.
                                                </p>
                                                <a
                                                    href={primarySocial.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        className="text-white hover:opacity-90"
                                                        style={{ backgroundColor: primarySocial.brandColor }}
                                                    >
                                                        <primarySocial.icon className="w-4 h-4 mr-2" />
                                                        View on {primarySocial.name}
                                                        <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* REGISTRATION INFORMATION */}
                                {event.registration_required && (
                                    <Alert className={`mb-6 sm:mb-8 ${
                                        event.registration_required.toLowerCase().includes('no') 
                                            ? 'bg-green-50 border-green-200' 
                                            : 'bg-blue-50 border-blue-200'
                                    }`}>
                                        <Calendar className={`h-5 w-5 ${
                                            event.registration_required.toLowerCase().includes('no')
                                                ? 'text-green-600'
                                                : 'text-blue-600'
                                        }`} aria-hidden="true" />
                                        <AlertDescription>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className={`font-bold text-base sm:text-lg ${
                                                        event.registration_required.toLowerCase().includes('no')
                                                            ? 'text-green-900'
                                                            : 'text-blue-900'
                                                    }`}>
                                                        {formatRegistrationText(event.registration_required)}
                                                    </p>
                                                    {event.registration_method && (
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            <strong>How to Register:</strong> {event.registration_method}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {event.registration_details && (
                                                    <div className="p-3 bg-white/60 rounded border border-gray-200">
                                                        <p className="text-sm text-gray-800">{event.registration_details}</p>
                                                    </div>
                                                )}
                                                
                                                {event.registration_deadline && (
                                                    <p className="text-sm font-medium text-amber-700">
                                                        <Clock className="w-4 h-4 inline mr-1" aria-hidden="true" />
                                                        Deadline: {event.registration_deadline}
                                                    </p>
                                                )}
                                                
                                                {event.registration_url && !event.registration_required.toLowerCase().includes('no') && (
                                                    isSoldOut ? (
                                                        <Button disabled className="bg-gray-400 text-gray-200 cursor-not-allowed h-10 sm:h-9">
                                                            SOLD OUT
                                                        </Button>
                                                    ) : (
                                                        <a
                                                            href={event.registration_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block"
                                                        >
                                                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10 sm:h-9">
                                                                Register Now
                                                                <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                                                            </Button>
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Description */}
                                {event.description && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="about-heading">
                                        <h2 id="about-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About This Event</h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                                            {event.description}
                                        </p>
                                    </section>
                                )}

                                {/* Sensory-Friendly Features */}
                                {event.sensory_accommodations && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="sensory-heading">
                                        <h2 id="sensory-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Sensory-Friendly Features</h2>
                                        <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{event.sensory_accommodations}</p>
                                        </div>
                                    </section>
                                )}

                                {/* VERIFICATION ALERTS */}
                                {event.accommodations_verified && (
                                    <Alert className="mb-6 sm:mb-8 bg-green-50 border-green-200">
                                        <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                                        <AlertDescription>
                                            <div className="space-y-2">
                                                <p className="font-semibold text-green-900 text-sm sm:text-base">
                                                    Verified Accommodation Details
                                                </p>
                                                <p className="text-xs sm:text-sm text-green-800">
                                                    The sensory-friendly accommodations listed above have been verified from official event documentation.
                                                </p>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {!event.accommodations_verified && event.sensory_accommodations && (
                                    <Alert className="mb-6 sm:mb-8 bg-amber-50 border-amber-200">
                                        <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden="true" />
                                        <AlertDescription>
                                            <div className="space-y-3">
                                                <p className="font-semibold text-amber-900 text-sm sm:text-base">
                                                    Accommodation Details Not Publicly Specified
                                                </p>
                                                <p className="text-xs sm:text-sm text-amber-800">
                                                    While this event is advertised as sensory-friendly or autism-friendly, 
                                                    specific accommodation details are not published in official event materials.
                                                </p>
                                                <div className="mt-3 p-2 sm:p-3 bg-white/60 rounded border border-amber-200">
                                                    <p className="text-xs sm:text-sm font-medium text-amber-900 mb-2">
                                                        <Info className="w-4 h-4 inline mr-1" aria-hidden="true" />
                                                        Recommended Questions to Ask:
                                                    </p>
                                                    <ul className="text-xs sm:text-sm text-amber-800 space-y-1 ml-5 list-disc">
                                                        <li>What specific sensory accommodations are available?</li>
                                                        <li>Is there a quiet/calming space if my child becomes overwhelmed?</li>
                                                        <li>Are noise-canceling headphones provided or should we bring our own?</li>
                                                        <li className="hidden sm:list-item">Will there be reduced lighting or loud noises we should prepare for?</li>
                                                        <li className="hidden sm:list-item">Are staff trained in autism awareness and support?</li>
                                                        <li className="hidden sm:list-item">Can we arrive early for a quieter experience?</li>
                                                    </ul>
                                                </div>
                                                {event.organizer_email && (
                                                    <p className="text-xs sm:text-sm text-amber-800 mt-2">
                                                        Contact the organizers at{' '}
                                                        <a
                                                            href={`mailto:${event.organizer_email}`}
                                                            className="underline hover:text-amber-900 font-medium break-all"
                                                        >
                                                            {event.organizer_email}
                                                        </a>
                                                        {' '}to ask these questions before attending.
                                                    </p>
                                                )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Age Groups */}
                                {event.age_groups && event.age_groups.length > 0 && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="age-heading">
                                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" aria-hidden="true" />
                                            <h2 id="age-heading" className="text-xl sm:text-2xl font-bold text-gray-900">Age Groups</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {event.age_groups.map((age: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4">
                                                    {formatAgeGroup(age)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Action Buttons */}
                                {!isPast && (
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
                                        {event.registration_url && (
                                            isSoldOut ? (
                                                <div className="flex-1">
                                                    <Button disabled className="w-full bg-gray-400 text-gray-200 cursor-not-allowed text-base sm:text-lg py-5 sm:py-6 h-auto">
                                                        SOLD OUT
                                                    </Button>
                                                </div>
                                            ) : (
                                                <a
                                                    href={event.registration_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1"
                                                >
                                                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-base sm:text-lg py-5 sm:py-6 h-auto">
                                                        Register Now
                                                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
                                                    </Button>
                                                </a>
                                            )
                                        )}

                                        {eventWebsiteUrl && (
                                            <a
                                                href={eventWebsiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <Button variant="outline" className="w-full text-base sm:text-lg py-5 sm:py-6 h-auto">
                                                    <span className="hidden sm:inline">{hasValidWebsite ? 'Official Website' : 'Event Information'}</span>
                                                    <span className="sm:hidden">{hasValidWebsite ? 'Website' : 'Event Info'}</span>
                                                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" aria-hidden="true" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Contact & Links */}
                                <section className="border-t pt-6 sm:pt-8" aria-labelledby="contact-heading">
                                    <h2 id="contact-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact & Links</h2>
                                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                        <Card className="bg-gray-50 border-none">
                                            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                                {event.organizer_name && (
                                                    <div>
                                                        <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Organizer</p>
                                                        <p className="text-gray-700 text-sm sm:text-base">{event.organizer_name}</p>
                                                    </div>
                                                )}
                                                {event.organizer_email && (
                                                    <div>
                                                        <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Email</p>
                                                        <a
                                                            href={`mailto:${event.organizer_email}`}
                                                            className="text-blue-600 hover:text-blue-700 break-all text-sm sm:text-base"
                                                        >
                                                            {event.organizer_email}
                                                        </a>
                                                    </div>
                                                )}
                                                {event.organizer_phone && (
                                                    <div>
                                                        <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Phone</p>
                                                        <a
                                                            href={`tel:${event.organizer_phone}`}
                                                            className="text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                                                        >
                                                            {event.organizer_phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gray-50 border-none">
                                            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                                {eventWebsiteUrl && (
                                                    <div>
                                                        <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                            {hasValidWebsite ? 'Official Website' : 'Event Information'}
                                                        </p>
                                                        <a
                                                            href={eventWebsiteUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 break-all inline-flex items-center gap-2 text-sm sm:text-base"
                                                        >
                                                            Visit Website
                                                            <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                                        </a>
                                                    </div>
                                                )}
                                                {event.registration_url && (
                                                    <div>
                                                        <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Registration</p>
                                                        <a
                                                            href={event.registration_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 break-all inline-flex items-center gap-2 text-sm sm:text-base"
                                                        >
                                                            Registration Link
                                                            <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                                                        </a>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </section>

                                {/* Cost Info */}
                                {event.cost_info && (
                                    <section className="border-t pt-6 sm:pt-8 mt-6 sm:mt-8" aria-labelledby="cost-heading">
                                        <h2 id="cost-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Cost</h2>
                                        <p className="text-gray-700 text-base sm:text-lg">{event.cost_info}</p>
                                    </section>
                                )}
                                    </CardContent>
                                </Card>
                            </article>
                        </div>

                        {/* Sidebar - Map & Quick Actions */}
                        <div className="space-y-4 sm:space-y-6">
                            {event.latitude && event.longitude && (
                                <Card className="border-none shadow-xl overflow-hidden">
                                    <div className="h-[250px] sm:h-[300px] relative">
                                        {!MapComponent ? (
                                            <div className="h-full flex items-center justify-center bg-gray-100">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                                            </div>
                                        ) : (
                                            <MapComponent.MapContainer
                                                center={[event.latitude, event.longitude]}
                                                zoom={14}
                                                className="h-full w-full"
                                                scrollWheelZoom={false}
                                            >
                                                <MapComponent.TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <MapComponent.Marker position={[event.latitude, event.longitude]}>
                                                    <MapComponent.Popup>
                                                        <div className="text-center">
                                                            <p className="font-bold text-sm">{event.title}</p>
                                                            <p className="text-xs text-gray-600">{event.venue_name || event.city}, FL</p>
                                                        </div>
                                                    </MapComponent.Popup>
                                                </MapComponent.Marker>
                                            </MapComponent.MapContainer>
                                        )}
                                    </div>
                                    <CardContent className="p-3 sm:p-4">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full block"
                                        >
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Get Directions
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card className="border-none shadow-xl">
                                <CardContent className="p-4 sm:p-6">
                                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {event.registration_url && !isPast && (
                                            isSoldOut ? (
                                                <Button disabled className="w-full justify-start bg-gray-400 text-gray-200 cursor-not-allowed">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    SOLD OUT
                                                </Button>
                                            ) : (
                                                <a
                                                    href={event.registration_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Register Now
                                                    </Button>
                                                </a>
                                            )
                                        )}
                                        {event.website_url && (
                                            <a
                                                href={event.website_url.startsWith('http') ? event.website_url : `https://${event.website_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    Visit Website
                                                </Button>
                                            </a>
                                        )}
                                        {event.organizer_email && (
                                            <a
                                                href={`mailto:${event.organizer_email}`}
                                                className="block"
                                            >
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Contact Organizer
                                                </Button>
                                            </a>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={shareEvent}
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share Event
                                        </Button>

                                        {/* Follow the Organizer - Social Media Links */}
                                        {(event.facebook_url || event.instagram_url || event.x_url || event.youtube_url || event.linkedin_url || event.tiktok_url) && (
                                            <div className="pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Follow the Organizer</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {event.facebook_url && (
                                                        <a
                                                            href={event.facebook_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center transition-colors"
                                                            aria-label="Facebook"
                                                        >
                                                            <Facebook className="w-5 h-5 text-white" />
                                                        </a>
                                                    )}
                                                    {event.instagram_url && (
                                                        <a
                                                            href={event.instagram_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 flex items-center justify-center transition-opacity"
                                                            aria-label="Instagram"
                                                        >
                                                            <Instagram className="w-5 h-5 text-white" />
                                                        </a>
                                                    )}
                                                    {event.x_url && (
                                                        <a
                                                            href={event.x_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                                                            aria-label="X (Twitter)"
                                                        >
                                                            <Twitter className="w-5 h-5 text-white" />
                                                        </a>
                                                    )}
                                                    {event.youtube_url && (
                                                        <a
                                                            href={event.youtube_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-[#FF0000] hover:bg-[#CC0000] flex items-center justify-center transition-colors"
                                                            aria-label="YouTube"
                                                        >
                                                            <Youtube className="w-5 h-5 text-white" />
                                                        </a>
                                                    )}
                                                    {event.linkedin_url && (
                                                        <a
                                                            href={event.linkedin_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-[#0A66C2] hover:bg-[#004182] flex items-center justify-center transition-colors"
                                                            aria-label="LinkedIn"
                                                        >
                                                            <Linkedin className="w-5 h-5 text-white" />
                                                        </a>
                                                    )}
                                                    {event.tiktok_url && (
                                                        <a
                                                            href={event.tiktok_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                                                            aria-label="TikTok"
                                                        >
                                                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z"/>
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}