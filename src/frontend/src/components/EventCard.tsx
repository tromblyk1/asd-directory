import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Calendar, Clock, MapPin, Users, DollarSign,
    ExternalLink, Mail, Star, Award, RefreshCw,
    Accessibility, Building2, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types/Event.types';
import { EventVerificationBadge } from '@/components/EventVerificationBadge';

interface EventCardProps {
    event: Event;
    isPast?: boolean;
}

const categoryColors = {
    sensory_friendly: 'bg-purple-100 text-purple-800 border-purple-200',
    support_group: 'bg-blue-100 text-blue-800 border-blue-200',
    educational: 'bg-green-100 text-green-800 border-green-200',
    social: 'bg-orange-100 text-orange-800 border-orange-200',
    fundraiser: 'bg-pink-100 text-pink-800 border-pink-200',
    professional_development: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    recreational: 'bg-teal-100 text-teal-800 border-teal-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const eventTypeColors = {
    conference: 'bg-blue-50 text-blue-700 border-blue-200',
    workshop: 'bg-green-50 text-green-700 border-green-200',
    'sensory-friendly': 'bg-purple-50 text-purple-700 border-purple-200',
    recreational: 'bg-teal-50 text-teal-700 border-teal-200',
    fundraising: 'bg-pink-50 text-pink-700 border-pink-200',
    celebration: 'bg-orange-50 text-orange-700 border-orange-200',
    athletic: 'bg-red-50 text-red-700 border-red-200',
};

const getCostBadgeColor = (cost?: string) => {
    if (!cost) return 'bg-gray-100 text-gray-700';
    const lowerCost = cost.toLowerCase();
    if (lowerCost.includes('free')) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
};

// Format registration text - remove "YES" prefix and clean up
const formatRegistrationText = (text?: string | null): { text: string; isRequired: boolean } => {
    if (!text) {
        return { text: 'Registration info not available', isRequired: false };
    }
    
    // Remove "YES - " or "YES" prefix
    let cleaned = text.replace(/^YES\s*-?\s*/i, '');
    
    // If it says "NO", make it clearer
    if (text.toLowerCase().includes('no') && (text.toLowerCase().includes('walk-in') || text.toLowerCase().includes('registration'))) {
        return { text: cleaned || 'Walk-ins welcome', isRequired: false };
    }
    
    return { text: cleaned || text, isRequired: true };
};

export const EventCard: React.FC<EventCardProps> = ({ event, isPast = false }) => {
    const categoryColor = categoryColors[event.category as keyof typeof categoryColors] || categoryColors.other;
    const eventTypeColor = eventTypeColors[event.event_type?.toLowerCase().replace(/\s+/g, '-') as keyof typeof eventTypeColors] || 'bg-gray-50 text-gray-700 border-gray-200';

    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow group h-full flex flex-col">
            {event.image_url && (
                <Link to={`/events/${event.slug}`}>
                    <div className="h-40 sm:h-48 overflow-hidden">
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>
            )}

            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {event.category && (
                        <Badge className={`${categoryColor} border`}>
                            {event.category.replace(/_/g, ' ')}
                        </Badge>
                    )}
                    {event.event_type && (
                        <Badge variant="outline" className={eventTypeColor}>
                            {event.event_type}
                        </Badge>
                    )}
                    {event.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                        </Badge>
                    )}
                    {event.ceu_available && (
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                            <Award className="w-3 h-3 mr-1" />
                            CEU
                        </Badge>
                    )}
                    {event.recurring && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            {event.recurring}
                        </Badge>
                    )}
                    <EventVerificationBadge
                        status={event.verification_status || 'unverified'}
                        source={event.verification_source}
                    />
                </div>

                {/* Title - Clickable */}
                <Link to={`/events/${event.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                        {event.title}
                    </h3>
                </Link>

                {/* Organizer */}
                {event.organizer && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{event.organizer}</span>
                    </div>
                )}

                {/* Date, Time, Location */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">
                            {format(new Date(event.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
                        </span>
                    </div>
                    {event.time && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{event.time}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                            {event.location && `${event.location}, `}{event.city}
                            {event.region && `, ${event.region}`}
                        </span>
                    </div>
                </div>

                {/* Cost & Registration */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {event.cost && (
                        <Badge className={`${getCostBadgeColor(event.cost)} border`}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            {event.cost.length > 30 ? event.cost.substring(0, 30) + '...' : event.cost}
                        </Badge>
                    )}
                    {(() => {
                        const regInfo = formatRegistrationText(event.registration_required);
                        return (
                            <Badge 
                                variant="outline" 
                                className={regInfo.isRequired 
                                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                                    : "bg-green-50 text-green-700 border-green-200"
                                }
                            >
                                {regInfo.text}
                            </Badge>
                        );
                    })()}
                </div>

                {/* Description */}
                {event.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {event.description}
                    </p>
                )}

                {/* Sensory Accommodations - Highlighted */}
                {event.sensory_accommodations && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                            <Accessibility className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-purple-900 mb-1">
                                    Sensory-Friendly Features:
                                </p>
                                <p className="text-sm text-purple-800 line-clamp-2">
                                    {event.sensory_accommodations}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Age Groups */}
                {event.age_groups && event.age_groups.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                            {event.age_groups.map((age, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    {age.replace(/_/g, ' ')}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons - Push to bottom */}
                <div className="mt-auto pt-4 border-t space-y-2">
                    {isPast ? (
                        <Badge variant="outline" className="w-full justify-center py-2">
                            Past Event
                        </Badge>
                    ) : (
                        <>
                            {/* View Details Button - Primary Action */}
                            <Link to={`/events/${event.slug}`} className="block">
                                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                    View Full Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                {event.registration_url && (
                                    <a
                                        href={event.registration_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button variant="outline" className="w-full text-sm">
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Register
                                        </Button>
                                    </a>
                                )}

                                {event.website && event.website !== event.registration_url && (
                                    <a
                                        href={event.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button variant="outline" className="w-full text-sm">
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Website
                                        </Button>
                                    </a>
                                )}

                                {event.contact_email && (
                                    <a
                                        href={`mailto:${event.contact_email}`}
                                        className="flex-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button variant="outline" className="w-full text-sm">
                                            <Mail className="w-3 h-3 mr-1" />
                                            Contact
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};