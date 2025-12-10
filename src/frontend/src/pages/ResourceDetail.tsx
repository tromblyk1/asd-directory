import React from "react";
import { Helmet } from "react-helmet-async";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin, Phone, Mail, Globe, ArrowLeft, Calendar,
    CheckCircle, Users, Clock, Navigation, Share2
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

export default function ResourceDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: resource, isLoading } = useQuery({
        queryKey: ['resource', id],
        queryFn: async () => {
            const result = await base44.entities.Resource.get(id!);
            return result;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!resource) {
        return (
            <>
                <Helmet>
                    <title>Resource Not Found | Florida Autism Services Directory</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Resource not found</h2>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </div>
                </div>
            </>
        );
    }

    const shareResource = () => {
        if (navigator.share) {
            navigator.share({
                title: resource.name,
                text: resource.description,
                url: window.location.href,
            });
        }
    };

    // SEO data
    const canonicalUrl = `https://floridaautismservices.com/resources/${id}`;
    const resourceName = resource.name || 'Faith Community Resource';
    const resourceDescription = resource.description 
        ? resource.description.substring(0, 160) 
        : `${resourceName} - An autism-friendly faith community in ${resource.city || 'Florida'}.`;

    // Schema.org structured data for faith community
    const resourceSchema = {
        "@context": "https://schema.org",
        "@type": "PlaceOfWorship",
        "name": resourceName,
        "description": resource.description || `Autism-friendly faith community in ${resource.city}, Florida`,
        ...(resource.address && {
            "address": {
                "@type": "PostalAddress",
                "streetAddress": resource.address,
                "addressLocality": resource.city,
                "addressRegion": "FL",
                ...(resource.zip_code && { "postalCode": resource.zip_code }),
                "addressCountry": "US"
            }
        }),
        ...(resource.phone && { "telephone": resource.phone }),
        ...(resource.email && { "email": resource.email }),
        ...(resource.website && { "url": resource.website }),
        ...(resource.latitude && resource.longitude && {
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": resource.latitude,
                "longitude": resource.longitude
            }
        }),
        ...(resource.denomination && { "additionalType": resource.denomination }),
        "isAccessibleForFree": true
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
                "name": "Faith Resources",
                "item": "https://floridaautismservices.com/faith-resources"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": resourceName,
                "item": canonicalUrl
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>{resourceName} | Florida Autism Services Directory</title>
                <meta name="description" content={resourceDescription} />
                <meta name="keywords" content={`${resourceName}, autism-friendly church, sensory-friendly worship, ${resource.city} autism, faith community autism Florida`} />
                <link rel="canonical" href={canonicalUrl} />
                
                {/* Open Graph */}
                <meta property="og:title" content={`${resourceName} | Florida Autism Services`} />
                <meta property="og:description" content={resourceDescription} />
                <meta property="og:type" content="place" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                {resource.image_url && <meta property="og:image" content={resource.image_url} />}
                
                {/* Twitter Card */}
                <meta name="twitter:card" content={resource.image_url ? "summary_large_image" : "summary"} />
                <meta name="twitter:title" content={resourceName} />
                <meta name="twitter:description" content={resourceDescription} />
                {resource.image_url && <meta name="twitter:image" content={resource.image_url} />}
                
                {/* Location meta */}
                {resource.city && <meta name="geo.placename" content={`${resource.city}, Florida`} />}
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(resourceSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-gray-50 pb-12">
                <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-6 sm:py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <Button variant="ghost" className="text-white hover:bg-white/20 mb-4" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                            Back
                        </Button>
                        
                        {/* Breadcrumb Navigation */}
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-blue-100 mb-2" aria-label="Breadcrumb">
                            <Link to="/" className="hover:text-white">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link to="/faith-resources" className="hover:text-white">Faith Resources</Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-white font-medium">{resourceName}</span>
                        </nav>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6">
                    <article>
                        <Card className="border-none shadow-xl">
                            <CardContent className="p-4 sm:p-6 lg:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                {resource.category?.replace(/_/g, ' ')}
                                            </Badge>
                                            {resource.verified && (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{resourceName}</h1>
                                        {resource.subcategory && <p className="text-lg text-gray-600">{resource.subcategory}</p>}
                                    </div>
                                    <Button onClick={shareResource} variant="outline" className="gap-2" aria-label="Share this resource">
                                        <Share2 className="w-4 h-4" aria-hidden="true" />
                                        Share
                                    </Button>
                                </div>

                                {resource.image_url && (
                                    <div className="mb-6 sm:mb-8 rounded-lg overflow-hidden">
                                        <img src={resource.image_url} alt={resourceName} className="w-full h-48 sm:h-64 object-cover" />
                                    </div>
                                )}

                                {resource.description && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="about-heading">
                                        <h2 id="about-heading" className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">About</h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
                                    </section>
                                )}

                                {resource.accommodations && resource.accommodations.length > 0 && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="accommodations-heading">
                                        <h2 id="accommodations-heading" className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Neurodivergent-Friendly Features</h2>
                                        <TooltipProvider delayDuration={200}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                {resource.accommodations.map((acc: string, idx: number) => (
                                                    <Tooltip key={idx}>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 cursor-help hover:bg-green-100 transition-colors">
                                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
                                                                <span className="text-gray-800">{toTitleCase(acc)}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-green-800 text-white border-green-700 max-w-xs">
                                                            <p className="text-xs">{getAccommodationTooltip(acc)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </TooltipProvider>
                                    </section>
                                )}

                                {resource.programs && resource.programs.length > 0 && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="programs-heading">
                                        <h2 id="programs-heading" className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Programs Offered</h2>
                                        <TooltipProvider delayDuration={200}>
                                            <div className="flex flex-wrap gap-2">
                                                {resource.programs.map((program: string, idx: number) => (
                                                    <Tooltip key={idx}>
                                                        <TooltipTrigger asChild>
                                                            <div className="inline-flex">
                                                                <Badge variant="secondary" className="text-sm py-2 px-4 cursor-help hover:bg-blue-100 transition-colors">
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
                                        </TooltipProvider>
                                    </section>
                                )}

                                {resource.age_groups && resource.age_groups.length > 0 && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="age-heading">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-5 h-5 text-gray-600" aria-hidden="true" />
                                            <h2 id="age-heading" className="text-xl font-bold text-gray-900">Age Groups Served</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {resource.age_groups.map((age: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-sm py-1 px-3">{age.replace(/_/g, ' ')}</Badge>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {resource.denomination && (
                                    <section className="mb-6 sm:mb-8" aria-labelledby="denomination-heading">
                                        <h2 id="denomination-heading" className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Denomination</h2>
                                        <p className="text-gray-700">{resource.denomination}</p>
                                    </section>
                                )}

                                <section className="border-t pt-8" aria-labelledby="contact-heading">
                                    <h2 id="contact-heading" className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <Card className="bg-gray-50 border-none">
                                            <CardContent className="p-4 sm:p-6 space-y-4">
                                                {resource.address && (
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" aria-hidden="true" />
                                                        <address className="not-italic">
                                                            <p className="font-medium text-gray-900 mb-1">Address</p>
                                                            <p className="text-gray-700">{resource.address}</p>
                                                            <p className="text-gray-700">{resource.city}, FL {resource.zip_code}</p>
                                                            {resource.latitude && resource.longitude && (
                                                                <a href={`https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`}
                                                                   target="_blank" rel="noopener noreferrer"
                                                                   className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2 text-sm">
                                                                    <Navigation className="w-4 h-4" aria-hidden="true" />
                                                                    Get Directions
                                                                </a>
                                                            )}
                                                        </address>
                                                    </div>
                                                )}
                                                {resource.hours && (
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" aria-hidden="true" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 mb-1">Hours</p>
                                                            <p className="text-gray-700">{resource.hours}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gray-50 border-none">
                                            <CardContent className="p-4 sm:p-6 space-y-4">
                                                {resource.phone && (
                                                    <div className="flex items-start gap-3">
                                                        <Phone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" aria-hidden="true" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 mb-1">Phone</p>
                                                            <a href={`tel:${resource.phone}`} className="text-blue-600 hover:text-blue-700">
                                                                {resource.phone}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                {resource.email && (
                                                    <div className="flex items-start gap-3">
                                                        <Mail className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" aria-hidden="true" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 mb-1">Email</p>
                                                            <a href={`mailto:${resource.email}`} className="text-blue-600 hover:text-blue-700 break-all">
                                                                {resource.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                                {resource.website && (
                                                    <div className="flex items-start gap-3">
                                                        <Globe className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" aria-hidden="true" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 mb-1">Website</p>
                                                            <a href={resource.website} target="_blank" rel="noopener noreferrer"
                                                               className="text-blue-600 hover:text-blue-700 break-all">
                                                                Visit Website
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </section>

                                {resource.accessibility_info && (
                                    <section className="border-t pt-8 mt-8" aria-labelledby="accessibility-heading">
                                        <h2 id="accessibility-heading" className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Accessibility & Parking</h2>
                                        <p className="text-gray-700 leading-relaxed">{resource.accessibility_info}</p>
                                    </section>
                                )}

                                {resource.last_verified_date && (
                                    <div className="border-t pt-6 mt-8">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" aria-hidden="true" />
                                            <time dateTime={resource.last_verified_date}>
                                                Last verified: {new Date(resource.last_verified_date).toLocaleDateString()}
                                            </time>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </article>

                    {resource.latitude && resource.longitude && (
                        <Card className="border-none shadow-xl mt-6">
                            <CardContent className="p-0">
                                <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0"
                                        title={`Map showing location of ${resourceName}`}
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${resource.latitude},${resource.longitude}&zoom=15`}
                                        allowFullScreen 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </>
    );
}