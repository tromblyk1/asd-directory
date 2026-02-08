import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CheckCircle, AlertCircle, Loader2, FileText
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Service options for Healthcare Providers
const HEALTHCARE_SERVICES = [
    { value: 'aba', label: 'ABA Therapy' },
    { value: 'speech-therapy', label: 'Speech Therapy' },
    { value: 'occupational-therapy', label: 'Occupational Therapy' },
    { value: 'physical-therapy', label: 'Physical Therapy' },
    { value: 'feeding-therapy', label: 'Feeding Therapy' },
    { value: 'music-therapy', label: 'Music Therapy' },
    { value: 'pet-therapy', label: 'Pet/Animal Therapy' },
    { value: 'ados-testing', label: 'ADOS Testing / Diagnostics' },
    { value: 'dir-floortime', label: 'DIR/Floortime' },
    { value: 'group-therapy', label: 'Group Therapy' },
    { value: 'virtual-therapy', label: 'Virtual/Telehealth Services' },
    { value: 'mobile-services', label: 'Mobile/In-Home Services' },
];

// Support service options
const SUPPORT_SERVICES = [
    { value: 'respite-care', label: 'Respite Care' },
    { value: 'parent-coaching', label: 'Parent Coaching' },
    { value: 'life-skills', label: 'Life Skills / Daily Living' },
    { value: 'support-groups', label: 'Support Groups' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'executive-function-coaching', label: 'Executive Function Coaching' },
];

// Scholarship options for Schools
const SCHOLARSHIPS = [
    { value: 'fes-ua', label: 'FES-UA (Unique Abilities)' },
    { value: 'fes-eo', label: 'FES-EO (Educational Options)' },
    { value: 'ftc', label: 'FTC (Family Tax Credit)' },
    { value: 'pep', label: 'PEP (Personalized Education Program)' },
    { value: 'hope', label: 'Hope Scholarship' },
];

// Denomination options
const DENOMINATIONS = [
    { value: 'catholic', label: 'Catholic' },
    { value: 'baptist', label: 'Baptist' },
    { value: 'methodist', label: 'Methodist' },
    { value: 'lutheran', label: 'Lutheran' },
    { value: 'presbyterian', label: 'Presbyterian' },
    { value: 'episcopalian', label: 'Episcopalian' },
    { value: 'non-denominational', label: 'Non-Denominational' },
    { value: 'jewish', label: 'Jewish' },
    { value: 'assemblies-of-god', label: 'Assemblies of God' },
    { value: 'church-of-god', label: 'Church of God' },
    { value: 'seventh-day-adventist', label: 'Seventh-Day Adventist' },
];

// Accreditation options for Schools
const ACCREDITATIONS = [
    { value: 'cognia', label: 'Cognia (AdvancED/SACS)' },
    { value: 'acsi', label: 'ACSI' },
    { value: 'fcis', label: 'FCIS' },
    { value: 'ais', label: 'AIS' },
    { value: 'facs', label: 'FACS' },
    { value: 'cita', label: 'CITA' },
    { value: 'ams', label: 'AMS (Montessori)' },
];

// Grade level options for Schools
const GRADE_LEVELS = [
    { value: 'prek', label: 'Pre-K' },
    { value: 'k', label: 'Kindergarten' },
    { value: 'elementary', label: 'Elementary (1-5)' },
    { value: 'middle', label: 'Middle School (6-8)' },
    { value: 'high', label: 'High School (9-12)' },
];

// Insurance options for Healthcare Providers
const INSURANCES = [
    { value: 'florida-medicaid', label: 'Florida Medicaid' },
    { value: 'medicare', label: 'Medicare' },
    { value: 'aetna', label: 'Aetna' },
    { value: 'cigna', label: 'Cigna' },
    { value: 'florida-blue', label: 'Florida Blue' },
    { value: 'humana', label: 'Humana' },
    { value: 'unitedhealthcare', label: 'UnitedHealthcare' },
    { value: 'tricare', label: 'TRICARE' },
    { value: 'private-pay', label: 'Private Pay / Self-Pay' },
];

// Faith community accommodations
const FAITH_ACCOMMODATIONS = [
    { value: 'sensory-room', label: 'Sensory Room' },
    { value: 'quiet-space', label: 'Quiet Space' },
    { value: 'buddy-system', label: 'Buddy System' },
    { value: 'trained-volunteers', label: 'Trained Volunteers' },
    { value: 'visual-schedules', label: 'Visual Schedules' },
    { value: 'sensory-bags', label: 'Sensory Bags' },
    { value: 'flexible-seating', label: 'Flexible Seating' },
    { value: 'modified-curriculum', label: 'Modified Curriculum' },
    { value: 'sensory-friendly', label: 'Sensory-Friendly Environment' },
    { value: 'inclusive', label: 'Inclusive Services' },
];

// Faith community programs
const FAITH_PROGRAMS = [
    { value: 'respite-care', label: 'Respite Care / Buddy Break' },
    { value: 'special-needs-ministry', label: 'Special Needs Ministry' },
    { value: 'adult-program', label: 'Adult Program' },
    { value: 'childrens-program', label: "Children's Program" },
    { value: 'sensory-friendly-service', label: 'Sensory-Friendly Service' },
    { value: 'special-worship', label: 'Special Worship Service' },
    { value: 'camps', label: 'Camps' },
    { value: 'adaptive-sports', label: 'Adaptive Sports' },
    { value: 'job-skills', label: 'Job Skills Program' },
];

export default function SubmitResource() {
    const [formData, setFormData] = useState({
        resource_name: "",
        category: "",
        description: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        website: "",
        submitter_name: "",
        submitter_email: "",
        submitter_relationship: "",
        // Sub-category fields
        services: [] as string[],
        scholarships: [] as string[],
        denomination: "",
        denomination_other: "",
        accreditations: [] as string[],
        grade_levels: [] as string[],
        insurances: [] as string[],
        accommodations: [] as string[],
        programs: [] as string[],
        accommodations_other: "",
        programs_other: "",
        // Social media links (all optional)
        social_facebook: "",
        social_instagram: "",
        social_linkedin: "",
        social_youtube: "",
        social_tiktok: "",
        social_twitter: "",
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
        // Remove any existing protocol
        url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
        // Add https://
        if (url) {
            return `https://${url}`;
        }
        return value;
    };

    const handlePhoneBlur = () => {
        setFormData(prev => ({
            ...prev,
            phone: formatPhoneNumber(prev.phone)
        }));
    };

    const handleWebsiteBlur = () => {
        if (formData.website) {
            setFormData(prev => ({
                ...prev,
                website: formatWebsite(prev.website)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        // Prepare submission data
        const submissionData = {
            resource_name: formData.resource_name,
            category: formData.category,
            description: formData.description,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            submitter_name: formData.submitter_name,
            submitter_email: formData.submitter_email,
            submitter_relationship: formData.submitter_relationship,
            // Include sub-category data
            services: formData.services.length > 0 ? formData.services : null,
            scholarships: formData.scholarships.length > 0 ? formData.scholarships : null,
            denomination: formData.denomination === 'other' ? formData.denomination_other : formData.denomination,
            accreditations: formData.accreditations.length > 0 ? formData.accreditations : null,
            grade_levels: formData.grade_levels.length > 0 ? formData.grade_levels : null,
            insurances: formData.insurances.length > 0 ? formData.insurances : null,
            accommodations: formData.accommodations.length > 0 
                ? [...formData.accommodations, formData.accommodations_other].filter(Boolean) 
                : (formData.accommodations_other ? [formData.accommodations_other] : null),
            programs: formData.programs.length > 0
                ? [...formData.programs, formData.programs_other].filter(Boolean)
                : (formData.programs_other ? [formData.programs_other] : null),
            // Build social_links object from non-empty values only
            social_links: (() => {
                const links: Record<string, string> = {};
                if (formData.social_facebook.trim()) links.facebook = formData.social_facebook.trim();
                if (formData.social_instagram.trim()) links.instagram = formData.social_instagram.trim();
                if (formData.social_linkedin.trim()) links.linkedin = formData.social_linkedin.trim();
                if (formData.social_youtube.trim()) links.youtube = formData.social_youtube.trim();
                if (formData.social_tiktok.trim()) links.tiktok = formData.social_tiktok.trim();
                if (formData.social_twitter.trim()) links.twitter = formData.social_twitter.trim();
                return Object.keys(links).length > 0 ? links : null;
            })(),
        };

        try {
            // Send email notification via PHP backend (no database insert - you'll add manually after review)
            console.log('ðŸ“§ Sending resource submission notification...');
            const emailResponse = await fetch('https://floridaautismservices.com/api/send-submission-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!emailResponse.ok) {
                throw new Error('Failed to send submission');
            }
            
            console.log('Email notification sent successfully!');

            setSubmitted(true);
            setFormData({
                resource_name: "",
                category: "",
                description: "",
                address: "",
                city: "",
                phone: "",
                email: "",
                website: "",
                submitter_name: "",
                submitter_email: "",
                submitter_relationship: "",
                services: [],
                scholarships: [],
                denomination: "",
                denomination_other: "",
                accreditations: [],
                grade_levels: [],
                insurances: [],
                accommodations: [],
                programs: [],
                accommodations_other: "",
                programs_other: "",
                social_facebook: "",
                social_instagram: "",
                social_linkedin: "",
                social_youtube: "",
                social_tiktok: "",
                social_twitter: "",
            });
        } catch (err) {
            console.error('Error submitting resource:', err);
            setError('Failed to submit resource. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field: 'services' | 'scholarships' | 'accreditations' | 'grade_levels' | 'insurances' | 'accommodations' | 'programs', value: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...prev[field], value]
                : prev[field].filter(v => v !== value)
        }));
    };

    // Reset sub-categories when main category changes
    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value,
            services: [],
            scholarships: [],
            denomination: "",
            denomination_other: "",
            accreditations: [],
            grade_levels: [],
            insurances: [],
            accommodations: [],
            programs: [],
            accommodations_other: "",
            programs_other: "",
            social_facebook: "",
            social_instagram: "",
            social_linkedin: "",
            social_youtube: "",
            social_tiktok: "",
            social_twitter: "",
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
                            We've received your resource submission and will review it within 2-3 business days.
                            Once verified, it will be added to our directory to help families across Florida.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setSubmitted(false)}
                            className="bg-gradient-to-r from-blue-600 to-green-600"
                        >
                            Submit Another Resource
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
        <Helmet>
            <title>Submit a Resource | Florida Autism Services Directory</title>
            <meta name="description" content="Submit an autism-friendly provider, therapy center, school, or community resource to the Florida Autism Services Directory. Help Florida families find the support they need." />
            <link rel="canonical" href="https://floridaautismservices.com/submit" />
            <meta property="og:title" content="Submit a Resource | Florida Autism Services" />
            <meta property="og:description" content="Help us build Florida's most comprehensive autism services directory by submitting a resource." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://floridaautismservices.com/submit" />
            <meta name="robots" content="index, follow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 sm:py-10 lg:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Submit a Resource</h1>
                            <p className="text-base sm:text-lg lg:text-xl text-blue-50">
                                Help us build Florida's most comprehensive ASD directory
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Listing Promo Banner */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                <a href="/featured" className="block bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">⭐ Want to Stand Out? Get Featured!</h2>
                    <p className="text-amber-800 text-sm sm:text-base mb-4">
                        Featured providers get priority placement at the top of search results, clinic photos on their listing, and up to 5x more visibility. Founding Partner spots are limited — lock in half-price rates now.
                    </p>
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all text-sm sm:text-base">
                        See Featured Listing Options →
                    </span>
                </a>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <Alert className="mb-8 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                        Know a neurodivergent-friendly resource in Florida? Share it with our community!
                        All submissions are reviewed to ensure accuracy before being added to the directory.
                    </AlertDescription>
                </Alert>

                <Card className="border-none shadow-xl">
                    <CardHeader className="border-b">
                        <CardTitle className="text-2xl">Resource Information</CardTitle>
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

                            {/* Resource Details */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="resource_name">
                                        Resource Name *
                                    </Label>
                                    <Input
                                        id="resource_name"
                                        value={formData.resource_name}
                                        onChange={(e) => handleChange("resource_name", e.target.value)}
                                        placeholder="Church name, clinic name, school name, etc."
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category">
                                        Category *
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={handleCategoryChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="healthcare">Healthcare Provider</SelectItem>
                                            <SelectItem value="school">School</SelectItem>
                                            <SelectItem value="faith">Faith Community</SelectItem>
                                            <SelectItem value="support">Support Services</SelectItem>
                                            <SelectItem value="recreation">Recreation & Activities</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Healthcare Provider Sub-categories */}
                                {formData.category === 'healthcare' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <Label className="text-blue-900 font-semibold mb-3 block">
                                                Services Offered (select all that apply)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {HEALTHCARE_SERVICES.map((service) => (
                                                    <div key={service.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`service-${service.value}`}
                                                            checked={formData.services.includes(service.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('services', service.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`service-${service.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {service.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <Label className="text-purple-900 font-semibold mb-3 block">
                                                Insurances Accepted (if known)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {INSURANCES.map((insurance) => (
                                                    <div key={insurance.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`insurance-${insurance.value}`}
                                                            checked={formData.insurances.includes(insurance.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('insurances', insurance.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`insurance-${insurance.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {insurance.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Support Services Sub-categories */}
                                {formData.category === 'support' && (
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <Label className="text-purple-900 font-semibold mb-3 block">
                                            Services Offered (select all that apply)
                                        </Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {SUPPORT_SERVICES.map((service) => (
                                                <div key={service.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`support-${service.value}`}
                                                        checked={formData.services.includes(service.value)}
                                                        onCheckedChange={(checked) => 
                                                            handleCheckboxChange('services', service.value, checked as boolean)
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`support-${service.value}`}
                                                        className="text-sm text-gray-700 cursor-pointer"
                                                    >
                                                        {service.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* School Sub-categories */}
                                {formData.category === 'school' && (
                                    <div className="space-y-4">
                                        {/* Grade Levels */}
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <Label className="text-blue-900 font-semibold mb-3 block">
                                                Grade Levels (select all that apply)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {GRADE_LEVELS.map((grade) => (
                                                    <div key={grade.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`grade-${grade.value}`}
                                                            checked={formData.grade_levels.includes(grade.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('grade_levels', grade.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`grade-${grade.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {grade.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Scholarships */}
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <Label className="text-green-900 font-semibold mb-3 block">
                                                Scholarships Accepted (if known)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {SCHOLARSHIPS.map((scholarship) => (
                                                    <div key={scholarship.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`scholarship-${scholarship.value}`}
                                                            checked={formData.scholarships.includes(scholarship.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('scholarships', scholarship.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`scholarship-${scholarship.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {scholarship.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Denomination */}
                                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <Label className="text-indigo-900 font-semibold mb-3 block">
                                                Religious Affiliation (if applicable)
                                            </Label>
                                            <Select
                                                value={formData.denomination}
                                                onValueChange={(value) => handleChange("denomination", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select denomination (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Not Religious / Secular</SelectItem>
                                                    {DENOMINATIONS.map((denom) => (
                                                        <SelectItem key={denom.value} value={denom.value}>
                                                            {denom.label}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="other">Other (specify below)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formData.denomination === 'other' && (
                                                <Input
                                                    className="mt-2"
                                                    value={formData.denomination_other}
                                                    onChange={(e) => handleChange("denomination_other", e.target.value)}
                                                    placeholder="Enter denomination"
                                                />
                                            )}
                                        </div>

                                        {/* Accreditations */}
                                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                            <Label className="text-amber-900 font-semibold mb-3 block">
                                                Accreditations (if known)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {ACCREDITATIONS.map((accreditation) => (
                                                    <div key={accreditation.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`accreditation-${accreditation.value}`}
                                                            checked={formData.accreditations.includes(accreditation.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('accreditations', accreditation.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`accreditation-${accreditation.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {accreditation.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Faith Community Sub-categories */}
                                {formData.category === 'faith' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                                            <Label className="text-rose-900 font-semibold mb-3 block">
                                                Denomination
                                            </Label>
                                            <Select
                                                value={formData.denomination}
                                                onValueChange={(value) => handleChange("denomination", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select denomination (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DENOMINATIONS.map((denom) => (
                                                        <SelectItem key={denom.value} value={denom.value}>
                                                            {denom.label}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="other">Other (specify below)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formData.denomination === 'other' && (
                                                <Input
                                                    className="mt-2"
                                                    value={formData.denomination_other}
                                                    onChange={(e) => handleChange("denomination_other", e.target.value)}
                                                    placeholder="Enter denomination"
                                                />
                                            )}
                                        </div>

                                        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                                            <Label className="text-teal-900 font-semibold mb-3 block">
                                                Neurodivergent-Friendly Accommodations (select all that apply)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {FAITH_ACCOMMODATIONS.map((accommodation) => (
                                                    <div key={accommodation.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`accommodation-${accommodation.value}`}
                                                            checked={formData.accommodations.includes(accommodation.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('accommodations', accommodation.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`accommodation-${accommodation.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {accommodation.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <Input
                                                className="mt-3"
                                                value={formData.accommodations_other}
                                                onChange={(e) => handleChange("accommodations_other", e.target.value)}
                                                placeholder="Other accommodations not listed above..."
                                            />
                                        </div>

                                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <Label className="text-purple-900 font-semibold mb-3 block">
                                                Special Programs Offered (select all that apply)
                                            </Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {FAITH_PROGRAMS.map((program) => (
                                                    <div key={program.value} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`program-${program.value}`}
                                                            checked={formData.programs.includes(program.value)}
                                                            onCheckedChange={(checked) => 
                                                                handleCheckboxChange('programs', program.value, checked as boolean)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`program-${program.value}`}
                                                            className="text-sm text-gray-700 cursor-pointer"
                                                        >
                                                            {program.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <Input
                                                className="mt-3"
                                                value={formData.programs_other}
                                                onChange={(e) => handleChange("programs_other", e.target.value)}
                                                placeholder="Other programs not listed above..."
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="description">
                                        Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Please describe the resource, services offered, and how it supports the autism community..."
                                        required
                                        rows={5}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Be specific about accommodations and features that support neurodivergent individuals
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Location</h3>

                                <div>
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">
                                        City *
                                    </Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        placeholder="Orlando"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Contact Information</h3>

                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        onBlur={handlePhoneBlur}
                                        placeholder="(555) 123-4567"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Will be auto-formatted when you leave this field
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="contact@resource.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleChange("website", e.target.value)}
                                        onBlur={handleWebsiteBlur}
                                        placeholder="example.com"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Just type the domain - we'll add https:// automatically
                                    </p>
                                </div>
                            </div>

                            {/* Social Media Links (Optional) */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Social Media Links (Optional)</h3>
                                <p className="text-sm text-gray-600">
                                    Add any social media profiles for this resource
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="social_facebook">Facebook URL</Label>
                                        <Input
                                            id="social_facebook"
                                            value={formData.social_facebook}
                                            onChange={(e) => handleChange("social_facebook", e.target.value)}
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="social_instagram">Instagram URL</Label>
                                        <Input
                                            id="social_instagram"
                                            value={formData.social_instagram}
                                            onChange={(e) => handleChange("social_instagram", e.target.value)}
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                                        <Input
                                            id="social_linkedin"
                                            value={formData.social_linkedin}
                                            onChange={(e) => handleChange("social_linkedin", e.target.value)}
                                            placeholder="https://linkedin.com/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="social_youtube">YouTube URL</Label>
                                        <Input
                                            id="social_youtube"
                                            value={formData.social_youtube}
                                            onChange={(e) => handleChange("social_youtube", e.target.value)}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="social_tiktok">TikTok URL</Label>
                                        <Input
                                            id="social_tiktok"
                                            value={formData.social_tiktok}
                                            onChange={(e) => handleChange("social_tiktok", e.target.value)}
                                            placeholder="https://tiktok.com/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="social_twitter">Twitter/X URL</Label>
                                        <Input
                                            id="social_twitter"
                                            value={formData.social_twitter}
                                            onChange={(e) => handleChange("social_twitter", e.target.value)}
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submitter Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Your Information</h3>
                                <p className="text-sm text-gray-600">
                                    We may contact you if we need clarification about this resource
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
                                    <Label htmlFor="submitter_email">
                                        Your Email Address *
                                    </Label>
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
                                    <Label htmlFor="submitter_relationship">
                                        Your Relationship to Resource
                                    </Label>
                                    <Input
                                        id="submitter_relationship"
                                        value={formData.submitter_relationship}
                                        onChange={(e) => handleChange("submitter_relationship", e.target.value)}
                                        placeholder="Parent, Provider, Staff Member, etc."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Submit Resource
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