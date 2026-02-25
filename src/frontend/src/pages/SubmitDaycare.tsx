import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    CheckCircle, AlertCircle, Loader2, Baby
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Florida counties
const FLORIDA_COUNTIES = [
    "Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun",
    "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "DeSoto", "Dixie",
    "Duval", "Escambia", "Flagler", "Franklin", "Gadsden", "Gilchrist",
    "Glades", "Gulf", "Hamilton", "Hardee", "Hendry", "Hernando", "Highlands",
    "Hillsborough", "Holmes", "Indian River", "Jackson", "Jefferson", "Lafayette",
    "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison", "Manatee", "Marion",
    "Martin", "Miami-Dade", "Monroe", "Nassau", "Okaloosa", "Okeechobee",
    "Orange", "Osceola", "Palm Beach", "Pasco", "Pinellas", "Polk", "Putnam",
    "Santa Rosa", "Sarasota", "Seminole", "St. Johns", "St. Lucie", "Sumter",
    "Suwannee", "Taylor", "Union", "Volusia", "Wakulla", "Walton", "Washington"
];

// Profit status options
const PROFIT_STATUS_OPTIONS = [
    { value: 'For-Profit', label: 'For-Profit' },
    { value: 'Not-For-Profit', label: 'Not-For-Profit' },
];

export default function SubmitDaycare() {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        address2: "",
        city: "",
        county: "",
        state: "FL",
        zip_code: "",
        phone: "",
        email: "",
        website: "",
        licensed_beds: "",
        profit_status: "",
        owner: "",
        admin_ceo: "",
        license_number: "",
        description: "",
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

        const submissionData = {
            type: 'daycare',
            name: formData.name,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            county: formData.county,
            state: formData.state,
            zip_code: formData.zip_code,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            licensed_beds: formData.licensed_beds ? parseInt(formData.licensed_beds) : null,
            profit_status: formData.profit_status || null,
            owner: formData.owner || null,
            admin_ceo: formData.admin_ceo || null,
            license_number: formData.license_number || null,
            description: formData.description,
            submitter_name: formData.submitter_name,
            submitter_email: formData.submitter_email,
            submitter_relationship: formData.submitter_relationship,
        };

        try {
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

            setSubmitted(true);
            setFormData({
                name: "",
                address: "",
                address2: "",
                city: "",
                county: "",
                state: "FL",
                zip_code: "",
                phone: "",
                email: "",
                website: "",
                licensed_beds: "",
                profit_status: "",
                owner: "",
                admin_ceo: "",
                license_number: "",
                description: "",
                submitter_name: "",
                submitter_email: "",
                submitter_relationship: "",
            });
        } catch (err) {
            console.error('Error submitting daycare:', err);
            setError('Failed to submit daycare. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                            We've received your daycare submission and will review it within 2-3 business days.
                            Once verified, it will be added to our directory to help families across Florida.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => setSubmitted(false)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500"
                        >
                            Submit Another Daycare
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
        <Helmet>
            <title>Submit a Daycare | Florida Autism Services Directory</title>
            <meta name="description" content="Submit a daycare or PPEC center to the Florida Autism Services Directory. Help Florida families find autism-friendly childcare options." />
            <link rel="canonical" href="https://floridaautismservices.com/submit-daycare" />
            <meta property="og:title" content="Submit a Daycare | Florida Autism Services" />
            <meta property="og:description" content="Help us build Florida's most comprehensive autism-friendly childcare directory by submitting a daycare or PPEC center." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://floridaautismservices.com/submit-daycare" />
            <meta name="robots" content="index, follow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-8 sm:py-10 lg:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Baby className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Submit a Daycare</h1>
                            <p className="text-base sm:text-lg lg:text-xl text-orange-50">
                                Help families find autism-friendly childcare in Florida
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Listing Promo Banner */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                <a href="/featured-daycares" className="block bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
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
                <Alert className="mb-8 bg-orange-50 border-orange-200">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-900">
                        Know a daycare or PPEC center that serves children with autism? Share it with our community!
                        All submissions are reviewed to ensure accuracy before being added to the directory.
                    </AlertDescription>
                </Alert>

                <Card className="border-none shadow-xl">
                    <CardHeader className="border-b">
                        <CardTitle className="text-2xl">Daycare Information</CardTitle>
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

                            {/* Daycare Details */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Daycare / Center Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="e.g., Sunshine PPEC Center"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description / Additional Notes</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Describe the center, services offered, specializations, and how it supports children with autism..."
                                        rows={4}
                                    />
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
                                    <Label htmlFor="address2">Address Line 2</Label>
                                    <Input
                                        id="address2"
                                        value={formData.address2}
                                        onChange={(e) => handleChange("address2", e.target.value)}
                                        placeholder="Suite, Unit, Building, etc."
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
                                    <Label htmlFor="county">County</Label>
                                    <Select
                                        value={formData.county}
                                        onValueChange={(value) => handleChange("county", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select county" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FLORIDA_COUNTIES.map((county) => (
                                                <SelectItem key={county} value={county}>
                                                    {county}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                        placeholder="contact@daycare.com"
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

                            {/* Center Details */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Center Details</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="licensed_beds">Licensed Beds / Capacity</Label>
                                        <Input
                                            id="licensed_beds"
                                            type="number"
                                            value={formData.licensed_beds}
                                            onChange={(e) => handleChange("licensed_beds", e.target.value)}
                                            placeholder="e.g., 30"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="profit_status">Profit Status</Label>
                                        <Select
                                            value={formData.profit_status}
                                            onValueChange={(value) => handleChange("profit_status", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROFIT_STATUS_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="owner">Owner Name</Label>
                                        <Input
                                            id="owner"
                                            value={formData.owner}
                                            onChange={(e) => handleChange("owner", e.target.value)}
                                            placeholder="Owner or organization name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="admin_ceo">Administrator / CEO</Label>
                                        <Input
                                            id="admin_ceo"
                                            value={formData.admin_ceo}
                                            onChange={(e) => handleChange("admin_ceo", e.target.value)}
                                            placeholder="Administrator or CEO name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="license_number">License Number</Label>
                                    <Input
                                        id="license_number"
                                        value={formData.license_number}
                                        onChange={(e) => handleChange("license_number", e.target.value)}
                                        placeholder="AHCA license number (if known)"
                                    />
                                </div>
                            </div>

                            {/* Submitter Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-lg text-gray-900">Your Information</h3>
                                <p className="text-sm text-gray-600">
                                    We may contact you if we need clarification about this daycare
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
                                    <Label htmlFor="submitter_relationship">Your Relationship to Daycare</Label>
                                    <Input
                                        id="submitter_relationship"
                                        value={formData.submitter_relationship}
                                        onChange={(e) => handleChange("submitter_relationship", e.target.value)}
                                        placeholder="Parent, Staff Member, Owner, etc."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg py-6"
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
                                            Submit Daycare
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
