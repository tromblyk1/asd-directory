import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CheckCircle, AlertCircle, Loader2, CalendarPlus, Clock, MapPin, Users
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Event categories
const EVENT_CATEGORIES = [
    { value: 'support-group', label: 'Support Group' },
    { value: 'workshop', label: 'Workshop / Training' },
    { value: 'social', label: 'Social Event' },
    { value: 'conference', label: 'Conference' },
    { value: 'camp', label: 'Camp' },
    { value: 'sports', label: 'Sports / Recreation' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'fundraiser', label: 'Fundraiser' },
    { value: 'awareness', label: 'Awareness Event' },
    { value: 'other', label: 'Other' },
];

// Event types
const EVENT_TYPES = [
    { value: 'in-person', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual / Online' },
    { value: 'hybrid', label: 'Hybrid (In-Person + Virtual)' },
];

// Age groups
const AGE_GROUPS = [
    { value: 'toddlers', label: 'Toddlers (0-3)' },
    { value: 'children', label: 'Children (4-12)' },
    { value: 'teens', label: 'Teens (13-17)' },
    { value: 'young-adults', label: 'Young Adults (18-25)' },
    { value: 'adults', label: 'Adults (26+)' },
    { value: 'seniors', label: 'Seniors (65+)' },
    { value: 'parents', label: 'Parents / Caregivers' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'all-ages', label: 'All Ages' },
];

// Registration methods
const REGISTRATION_METHODS = [
    { value: 'online', label: 'Online Registration' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'in-person', label: 'In-Person / Walk-in' },
    { value: 'none', label: 'No Registration Required' },
];

// Florida regions
const FLORIDA_REGIONS = [
    { value: 'central', label: 'Central Florida' },
    { value: 'northeast', label: 'Northeast Florida' },
    { value: 'northwest', label: 'Northwest Florida (Panhandle)' },
    { value: 'southeast', label: 'Southeast Florida' },
    { value: 'southwest', label: 'Southwest Florida' },
    { value: 'tampa-bay', label: 'Tampa Bay Area' },
    { value: 'statewide', label: 'Statewide / Virtual' },
];

// Sensory accommodations
const SENSORY_ACCOMMODATIONS = [
    { value: 'quiet-space', label: 'Quiet Space Available' },
    { value: 'noise-reduction', label: 'Noise Reduction / Low Volume' },
    { value: 'dimmed-lights', label: 'Dimmed Lighting' },
    { value: 'sensory-kits', label: 'Sensory Kits Provided' },
    { value: 'small-groups', label: 'Small Group Size' },
    { value: 'visual-supports', label: 'Visual Supports / Schedules' },
    { value: 'breaks-allowed', label: 'Breaks Allowed' },
    { value: 'asd-trained-staff', label: 'ASD-Trained Staff' },
];

export default function SubmitEvent() {
    const [formData, setFormData] = useState({
        // Core event info
        title: "",
        description: "",
        date: "",
        time: "",
        // Location
        location: "", // venue name
        address: "",
        city: "",
        state: "FL",
        zip_code: "",
        region: "",
        // Event details
        category: "",
        event_type: "",
        age_groups: [] as string[],
        cost: "",
        // Organizer
        organizer: "",
        website: "",
        contact_email: "",
        // Registration
        registration_required: false,
        registration_method: "",
        registration_url: "",
        registration_deadline: "",
        registration_details: "",
        // Autism-specific
        sensory_accommodations: [] as string[],
        sensory_accommodations_other: "",
        ceu_available: false,
        // Recurring
        recurring: "",
        // Submitter
        submitter_name: "",
        submitter_email: "",
        submitter_relationship: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Format phone number on blur
    const formatPhoneNumber = (value: string): string => {
        const digits = value.replace(/\D/g, '');
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return value;
    };

    // Format website on blur
    const formatWebsite = (value: string): string => {
        if (!value) return value;
        let url = value.trim().toLowerCase();
        url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
        if (url) {
            return `https://${url}`;
        }
        return value;
    };

    const handleWebsiteBlur = (field: 'website' | 'registration_url') => {
        if (formData[field]) {
            setFormData(prev => ({
                ...prev,
                [field]: formatWebsite(prev[field])
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        // Combine sensory accommodations with "other" field
        const allAccommodations = formData.sensory_accommodations.length > 0 
            ? [...formData.sensory_accommodations, formData.sensory_accommodations_other].filter(Boolean)
            : (formData.sensory_accommodations_other ? [formData.sensory_accommodations_other] : []);

        try {
            // Send email notification via PHP backend (no database insert - you'll add manually after review)
            console.log('ðŸ“§ Sending event submission notification...');
            const emailResponse = await fetch('https://floridaautismservices.com/api/send-event-submission-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sensory_accommodations: allAccommodations,
                }),
            });

            if (!emailResponse.ok) {
                throw new Error('Failed to send submission');
            }
            
            console.log('Email notification sent successfully!');

            setSubmitted(true);
            // Reset form
            setFormData({
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                address: "",
                city: "",
                state: "FL",
                zip_code: "",
                region: "",
                category: "",
                event_type: "",
                age_groups: [],
                cost: "",
                organizer: "",
                website: "",
                contact_email: "",
                registration_required: false,
                registration_method: "",
                registration_url: "",
                registration_deadline: "",
                registration_details: "",
                sensory_accommodations: [],
                sensory_accommodations_other: "",
                ceu_available: false,
                recurring: "",
                submitter_name: "",
                submitter_email: "",
                submitter_relationship: "",
            });
        } catch (err) {
            console.error('Error submitting event:', err);
            setError('Failed to submit event. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field: 'age_groups' | 'sensory_accommodations', value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...prev[field], value]
                : prev[field].filter(v => v !== value)
        }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
                <Card className="max-w-2xl w-full border-none shadow-2xl">
                    <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Thank You for Your Submission!
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 mb-8">
                            We've received your event submission and will review it within 2-3 business days.
                            Once verified, it will be added to our events calendar to help families across Florida.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setSubmitted(false)}
                            className="bg-gradient-to-r from-green-600 to-blue-600"
                        >
                            Submit Another Event
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
        <Helmet>
            <title>Submit an Event | Florida Autism Services Directory</title>
            <meta name="description" content="Submit an autism-friendly event to the Florida Autism Services Directory. Share sensory-friendly activities, support groups, workshops, and community events with Florida families." />
            <link rel="canonical" href="https://floridaautismservices.com/submit-event" />
            <meta property="og:title" content="Submit an Event | Florida Autism Services" />
            <meta property="og:description" content="Share autism-friendly events with Florida families through our community directory." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://floridaautismservices.com/submit-event" />
            <meta name="robots" content="index, follow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 sm:py-10 lg:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <CalendarPlus className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Submit an Event</h1>
                            <p className="text-base sm:text-lg lg:text-xl text-green-50">
                                Share autism-friendly events with Florida families
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <Alert className="mb-8 bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                        Know about an autism-friendly event in Florida? Share it with our community!
                        All submissions are reviewed to ensure accuracy before being added to the calendar.
                    </AlertDescription>
                </Alert>

                <Card className="border-none shadow-xl">
                    <CardHeader className="border-b">
                        <CardTitle className="text-2xl">Event Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Display */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Basic Event Info */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Event Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        placeholder="e.g., Sensory-Friendly Movie Night"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Event Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Describe the event, what attendees can expect, and any autism-friendly features..."
                                        required
                                        rows={5}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <Label htmlFor="category">Event Category *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => handleChange("category", value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EVENT_CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="event_type">Event Type *</Label>
                                        <Select
                                            value={formData.event_type}
                                            onValueChange={(value) => handleChange("event_type", value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EVENT_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    Date & Time
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <Label htmlFor="date">Event Date *</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange("date", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="time">Event Time</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => handleChange("time", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="recurring">Recurring Event?</Label>
                                    <Input
                                        id="recurring"
                                        value={formData.recurring}
                                        onChange={(e) => handleChange("recurring", e.target.value)}
                                        placeholder="e.g., Every Saturday, Monthly on first Tuesday, etc."
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    Location
                                </h3>

                                <div>
                                    <Label htmlFor="location">Venue Name</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        placeholder="e.g., Orlando Science Center"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleChange("city", e.target.value)}
                                            placeholder="Orlando"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => handleChange("state", e.target.value)}
                                            placeholder="FL"
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="zip_code">ZIP Code</Label>
                                        <Input
                                            id="zip_code"
                                            value={formData.zip_code}
                                            onChange={(e) => handleChange("zip_code", e.target.value)}
                                            placeholder="32801"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="region">Florida Region</Label>
                                    <Select
                                        value={formData.region}
                                        onValueChange={(value) => handleChange("region", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FLORIDA_REGIONS.map((region) => (
                                                <SelectItem key={region.value} value={region.value}>
                                                    {region.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Audience & Cost */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-600" />
                                    Audience & Cost
                                </h3>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <Label className="text-blue-900 font-semibold mb-3 block">
                                        Who is this event for? (select all that apply)
                                    </Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {AGE_GROUPS.map((age) => (
                                            <div key={age.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`age-${age.value}`}
                                                    checked={formData.age_groups.includes(age.value)}
                                                    onCheckedChange={(checked) => 
                                                        handleCheckboxChange('age_groups', age.value, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={`age-${age.value}`}
                                                    className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                    {age.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="cost">Cost</Label>
                                    <Input
                                        id="cost"
                                        value={formData.cost}
                                        onChange={(e) => handleChange("cost", e.target.value)}
                                        placeholder="e.g., Free, $10, $25-50, Sliding scale"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ceu_available"
                                        checked={formData.ceu_available}
                                        onCheckedChange={(checked) => handleChange("ceu_available", checked as boolean)}
                                    />
                                    <label htmlFor="ceu_available" className="text-sm text-gray-700 cursor-pointer">
                                        CEUs available for professionals
                                    </label>
                                </div>
                            </div>

                            {/* Registration */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Registration</h3>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="registration_required"
                                        checked={formData.registration_required}
                                        onCheckedChange={(checked) => handleChange("registration_required", checked as boolean)}
                                    />
                                    <label htmlFor="registration_required" className="text-sm text-gray-700 cursor-pointer">
                                        Registration is required for this event
                                    </label>
                                </div>

                                {formData.registration_required && (
                                    <div className="space-y-4 pl-6 border-l-2 border-green-200">
                                        <div>
                                            <Label htmlFor="registration_method">Registration Method</Label>
                                            <Select
                                                value={formData.registration_method}
                                                onValueChange={(value) => handleChange("registration_method", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="How do people register?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {REGISTRATION_METHODS.map((method) => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="registration_url">Registration URL</Label>
                                            <Input
                                                id="registration_url"
                                                value={formData.registration_url}
                                                onChange={(e) => handleChange("registration_url", e.target.value)}
                                                onBlur={() => handleWebsiteBlur('registration_url')}
                                                placeholder="eventbrite.com/your-event"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="registration_deadline">Registration Deadline</Label>
                                            <Input
                                                id="registration_deadline"
                                                type="date"
                                                value={formData.registration_deadline}
                                                onChange={(e) => handleChange("registration_deadline", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="registration_details">Additional Registration Details</Label>
                                            <Textarea
                                                id="registration_details"
                                                value={formData.registration_details}
                                                onChange={(e) => handleChange("registration_details", e.target.value)}
                                                placeholder="Any special instructions for registration..."
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sensory Accommodations */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Sensory Accommodations</h3>

                                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <Label className="text-teal-900 font-semibold mb-3 block">
                                        What autism-friendly accommodations are available? (select all that apply)
                                    </Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {SENSORY_ACCOMMODATIONS.map((accommodation) => (
                                            <div key={accommodation.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`sensory-${accommodation.value}`}
                                                    checked={formData.sensory_accommodations.includes(accommodation.value)}
                                                    onCheckedChange={(checked) => 
                                                        handleCheckboxChange('sensory_accommodations', accommodation.value, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={`sensory-${accommodation.value}`}
                                                    className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                    {accommodation.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <Input
                                        className="mt-3"
                                        value={formData.sensory_accommodations_other}
                                        onChange={(e) => handleChange("sensory_accommodations_other", e.target.value)}
                                        placeholder="Other accommodations not listed above..."
                                    />
                                </div>
                            </div>

                            {/* Organizer Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Organizer Information</h3>

                                <div>
                                    <Label htmlFor="organizer">Organizer Name *</Label>
                                    <Input
                                        id="organizer"
                                        value={formData.organizer}
                                        onChange={(e) => handleChange("organizer", e.target.value)}
                                        placeholder="Organization or person hosting the event"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <Label htmlFor="website">Event/Organizer Website</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => handleChange("website", e.target.value)}
                                            onBlur={() => handleWebsiteBlur('website')}
                                            placeholder="example.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => handleChange("contact_email", e.target.value)}
                                            placeholder="events@organization.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submitter Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Your Information</h3>
                                <p className="text-sm text-gray-600">
                                    We may contact you if we need clarification about this event
                                </p>

                                <div>
                                    <Label htmlFor="submitter_name">Your Name</Label>
                                    <Input
                                        id="submitter_name"
                                        value={formData.submitter_name}
                                        onChange={(e) => handleChange("submitter_name", e.target.value)}
                                        placeholder="Jane Smith"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="submitter_email">Your Email Address *</Label>
                                    <Input
                                        id="submitter_email"
                                        type="email"
                                        value={formData.submitter_email}
                                        onChange={(e) => handleChange("submitter_email", e.target.value)}
                                        placeholder="jane@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="submitter_relationship">Your Relationship to Event</Label>
                                    <Input
                                        id="submitter_relationship"
                                        value={formData.submitter_relationship}
                                        onChange={(e) => handleChange("submitter_relationship", e.target.value)}
                                        placeholder="Organizer, Volunteer, Parent, etc."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarPlus className="w-5 h-5 mr-2" />
                                            Submit Event
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    By submitting, you confirm that the information provided is accurate to the best of your knowledge
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    );
}