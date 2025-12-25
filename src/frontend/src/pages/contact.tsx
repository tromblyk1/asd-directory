import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, Mail, Clock, Send, MessageSquare, 
  MapPin, CheckCircle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:info@floridaautismservices.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Florida Autism Services",
    "description": "Contact Florida Autism Services Directory for questions about autism resources, providers, schools, and services in Florida.",
    "url": "https://floridaautismservices.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Florida Autism Services Directory",
      "url": "https://floridaautismservices.com",
      "telephone": "+1-321-300-3447",
      "email": "info@floridaautismservices.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-321-300-3447",
        "contactType": "customer service",
        "email": "info@floridaautismservices.com",
        "areaServed": "US-FL",
        "availableLanguage": "English",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      },
      "areaServed": { "@type": "State", "name": "Florida" }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://floridaautismservices.com/contact" }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Florida Autism Services Directory",
    "description": "Comprehensive directory connecting Florida families with autism-friendly resources, providers, and schools statewide.",
    "url": "https://floridaautismservices.com",
    "telephone": "+1-321-300-3447",
    "email": "info@floridaautismservices.com",
    "areaServed": { "@type": "State", "name": "Florida" },
    "priceRange": "Free",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Florida Autism Services Directory</title>
        <meta name="description" content="Contact Florida Autism Services for questions about autism resources, providers, schools, and services across Florida. Call (321) 300-3447 or email us. Response within 1-2 business days." />
        <meta name="keywords" content="contact Florida autism services, autism help Florida, autism questions, autism support contact, autism directory contact" />
        <link rel="canonical" href="https://floridaautismservices.com/contact" />
        <meta property="og:title" content="Contact Us | Florida Autism Services" />
        <meta property="og:description" content="Questions about autism services in Florida? Contact us by phone at (321) 300-3447 or send us a message." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/contact" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Florida Autism Services" />
        <meta name="twitter:description" content="Questions about autism services in Florida? Contact us for assistance." />
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-12">
        {/* Hero Section - MOBILE OPTIMIZED */}
        <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 sm:py-10 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6" role="img" aria-label="Contact icon">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
              Contact Florida Autism Services
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-green-50 max-w-2xl mx-auto">
              Questions about autism resources in Florida? Reach out to our team for assistance with neurodivergent-friendly services.
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          {/* Mobile: stacked, LG: side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Form */}
            <section className="lg:col-span-2 order-2 lg:order-1" aria-label="Contact form">
              {submitted ? (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Message Sent Successfully
                    </h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      Thank you for contacting Florida Autism Services. We'll respond within 1-2 business days.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg border border-blue-200 h-11 sm:h-10"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-none shadow-xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send Us a Message</h2>

                    <Alert className="mb-4 sm:mb-6 bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-900 text-sm sm:text-base">
                        Have questions about autism resources, events, or services in Florida? Fill out our contact form below.
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div>
                        <Label htmlFor="name" className="text-sm sm:text-base">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                          aria-required="true"
                          autoComplete="name"
                          className="h-11 sm:h-10 mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          aria-required="true"
                          autoComplete="email"
                          className="h-11 sm:h-10 mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-sm sm:text-base">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          placeholder="What is this regarding?"
                          required
                          aria-required="true"
                          className="h-11 sm:h-10 mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Tell us how we can help with autism services and resources..."
                          rows={5}
                          required
                          aria-required="true"
                          className="mt-1"
                        />
                      </div>

                      <Button 
                        type="submit"
                        size="lg"
                        className="w-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg border border-blue-200 h-12 sm:h-11"
                        disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                        Send Message
                      </Button>

                      <p className="text-xs text-gray-500 text-center mt-2 sm:mt-3">
                        * Required fields
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Contact Information Sidebar */}
            <aside className="space-y-4 sm:space-y-6 order-1 lg:order-2" aria-label="Contact information">
              <Card className="border-none shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h2>
                  
                  <address className="space-y-3 sm:space-y-4 not-italic">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Phone</h3>
                        <a 
                          href="tel:3213003447" 
                          className="text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                          aria-label="Call Florida Autism Services at (321) 300-3447"
                        >
                          (321) 300-3447
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Email</h3>
                        <a 
                          href="mailto:info@floridaautismservices.com" 
                          className="text-blue-600 hover:text-blue-700 break-all text-xs sm:text-sm"
                          aria-label="Email Florida Autism Services"
                        >
                          info@floridaautismservices.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Response Time</h3>
                        <p className="text-xs sm:text-sm text-gray-600">1-2 business days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Service Area</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Serving families statewide across Florida</p>
                      </div>
                    </div>
                  </address>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-blue-50">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Need Immediate Help?</h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                    For urgent questions about autism services or resources, call us directly during business hours.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Hours:</strong> Monday - Friday, 9am - 5pm EST
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}