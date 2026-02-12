import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  Search, Church, Heart, Stethoscope,
  GraduationCap, ArrowRight, MapPin,
  Calendar, Shield, BookOpen, School, FileText,
  Sparkles, Baby
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const categories = [
  {
    title: "Find Providers",
    icon: Stethoscope,
    color: "from-teal-500 to-cyan-600",
    description: "Healthcare & therapy services",
    link: "/providers",
  },
  {
    title: "Find Schools",
    icon: School,
    color: "from-purple-500 to-indigo-600",
    description: "Private schools statewide",
    link: "/schools",
  },
  {
    title: "Find Daycares",
    icon: Baby,
    color: "from-orange-500 to-amber-600",
    description: "Medical daycare centers",
    link: "/find-daycares",
  },
  {
    title: "Faith Communities",
    icon: Church,
    color: "from-rose-500 to-pink-600",
    description: "Welcoming worship spaces",
    link: createPageUrl("FaithResources"),
  },
  {
    title: "Educational Resources",
    icon: GraduationCap,
    color: "from-orange-500 to-red-600",
    description: "Services, insurance & scholarships",
    link: "/resources",
  },
  {
    title: "Guides",
    icon: FileText,
    color: "from-blue-500 to-teal-600",
    description: "In-depth articles for families",
    link: "/guides",
  },
  {
    title: "Stories & News",
    icon: BookOpen,
    color: "from-orange-500 to-purple-600",
    description: "Community updates",
    link: createPageUrl("Blog"),
  },
  {
    title: "Events Calendar",
    icon: Calendar,
    color: "from-green-500 to-blue-600",
    description: "Upcoming activities",
    link: createPageUrl("Events"),
  },
];

export default function Home() {
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        return await base44.entities.Event.list('date', 10);
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    },
    initialData: [],
  });

  const upcomingEventsFiltered = upcomingEvents.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date >= today;
  }).slice(0, 3);

  // Schema.org structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Florida Autism Services Directory",
    "description": "Comprehensive directory connecting Florida families with autism-friendly resources, providers, schools, and faith communities statewide.",
    "url": "https://floridaautismservices.com",
    "logo": "https://floridaautismservices.com/logo.png",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@floridaautismservices.com",
      "availableLanguage": ["English", "Spanish"]
    },
    "areaServed": {
      "@type": "State",
      "name": "Florida",
      "containedInPlace": {
        "@type": "Country",
        "name": "United States"
      }
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Florida Autism Services Directory",
    "url": "https://floridaautismservices.com",
    "description": "Your trusted guide to neurodivergent-friendly resources across Florida.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://floridaautismservices.com/providers?search={search_term_string}",
      "query-input": "required name=search_term_string"
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
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Florida Autism Services Directory | Find Autism-Friendly Resources Statewide</title>
        <meta name="description" content="Florida's comprehensive directory connecting families with autism-friendly providers, schools, faith communities, and resources. Find ABA therapy, special education, sensory-friendly services across all 67 Florida counties." />
        <meta name="keywords" content="Florida autism services, autism resources Florida, ABA therapy Florida, autism-friendly schools, sensory-friendly churches, autism providers, special needs resources, neurodivergent support Florida" />
        <link rel="canonical" href="https://floridaautismservices.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Florida Autism Services Directory" />
        <meta property="og:description" content="Find autism-friendly providers, schools, faith communities, and resources across Florida. Your trusted guide to neurodivergent-friendly support statewide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Florida Autism Services Directory" />
        <meta name="twitter:description" content="Find autism-friendly providers, schools, faith communities, and resources across Florida." />
        
        {/* Additional SEO */}
        <meta name="geo.region" content="US-FL" />
        <meta name="geo.placename" content="Florida" />
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="pb-12 sm:pb-16 lg:pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 opacity-95" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200')] bg-cover bg-center opacity-10" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="max-w-3xl">
              <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-xs sm:text-sm px-3 sm:px-4 py-1">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                Florida's Premier ASD Resource Hub
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Find Support.<br />
                Build Community.<br />
                <span className="text-blue-100">Thrive Together.</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-blue-50 leading-relaxed">
                Your trusted guide to neurodivergent-friendly resources across Florida.
                Connecting families with welcoming faith communities, understanding healthcare providers,
                inclusive programs, and supportive services.
              </p>

              {/* New Guide Announcement */}
              <Link to="/blog/speech-therapy-autism-guide" className="inline-block mt-6 sm:mt-8">
                <div className="group flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 hover:bg-white/25 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">New Guide</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-100 transition-colors">
                      Speech Therapy for Autism: What to Expect
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            </div>

              {/* Help Us Improve Notice - hidden on mobile */}
              <div className="hidden lg:block max-w-[340px] mt-8 lg:mt-0 flex-shrink-0">
                <div className="bg-[#FEF9C3] border border-yellow-300 rounded-xl px-4 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold">⚠️ Help Us Improve</span> — We're enhancing our directory data. If you notice outdated or erroneous info, please{' '}
                    <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      report it here
                    </Link>
                    ! Include the provider name and as much detail as possible so we can quickly identify and fix the listing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-auto">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAFBFF"/>
            </svg>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 lg:-mt-12 relative z-10" aria-label="Quick statistics">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Card className="border-none shadow-lg sm:shadow-xl bg-white">
              <CardContent className="p-4 sm:pt-6 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">7,000+</p>
                    <p className="text-sm sm:text-base text-gray-600">Resources Statewide</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg sm:shadow-xl bg-white">
              <CardContent className="p-4 sm:pt-6 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">Verified</p>
                    <p className="text-sm sm:text-base text-gray-600">Trusted & Updated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg sm:shadow-xl bg-white">
              <CardContent className="p-4 sm:pt-6 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">Free</p>
                    <p className="text-sm sm:text-base text-gray-600">Always Accessible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-label="Resource categories">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Explore Resources by Category
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Find exactly what you need, right in your community
            </p>
          </div>

          {/* First row - 4 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.title} to={category.link}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-none h-full cursor-pointer overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
                    <div className="flex items-center gap-2 mt-3 sm:mt-4 text-blue-600 font-medium text-sm sm:text-base">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Second row - 4 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(4, 8).map((category) => (
              <Link key={category.title} to={category.link}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-none h-full cursor-pointer overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
                    <div className="flex items-center gap-2 mt-3 sm:mt-4 text-blue-600 font-medium text-sm sm:text-base">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        {upcomingEventsFiltered.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-label="Upcoming events">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Upcoming Events
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                Join sensory-friendly events across Florida
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {upcomingEventsFiltered.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-shadow border-none">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">{event.time}</p>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">{event.city}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link to={createPageUrl("Events")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-lg text-sm sm:text-base px-6 sm:px-8">
                  View All Events
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20" aria-label="Call to action">
          <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-green-600 overflow-hidden">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center text-white relative">
              <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-20 sm:-mr-32 -mt-20 sm:-mt-32" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24" aria-hidden="true" />
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  Help Us Grow This Community
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-blue-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Know a neurodivergent-friendly resource we should include? 
                  Your contribution helps families find the support they need.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                  <Link to={createPageUrl("SubmitResource")}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl w-full sm:w-auto text-sm sm:text-base">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                      Submit a Resource
                    </Button>
                  </Link>
                  <Link to="/submit-event">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl w-full sm:w-auto text-sm sm:text-base">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                      Submit an Event
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Donate")}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl w-full sm:w-auto text-sm sm:text-base">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                      Support Our Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}