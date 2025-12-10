import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createPageUrl } from "@/utils";
import { 
  Heart, ArrowRight, MapPin, Calendar, Shield, 
  CheckCircle, Target, Eye, Users, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Florida Autism Services Directory",
    "description": "Learn about Florida Autism Services Directory - the comprehensive resource connecting Florida families with autism-friendly providers, schools, faith communities, and support services.",
    "url": "https://floridaautismservices.com/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Florida Autism Services Directory",
      "description": "Florida's premier resource hub connecting neurodivergent families with autism-friendly providers, schools, faith communities, and support services statewide.",
      "url": "https://floridaautismservices.com",
      "founder": { "@type": "Person", "name": "Keith", "jobTitle": "Registered Nurse" },
      "areaServed": { "@type": "State", "name": "Florida" },
      "knowsAbout": ["Autism Spectrum Disorder", "ABA Therapy", "Speech Therapy", "Occupational Therapy", "Special Education", "Florida Autism Services", "Neurodiversity"],
      "serviceType": ["Healthcare Provider Directory", "School Directory", "Faith Community Directory", "Event Calendar", "Educational Resources"]
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Florida Autism Services Directory",
    "url": "https://floridaautismservices.com",
    "description": "Comprehensive directory connecting Florida families with 7,000+ autism-friendly resources including healthcare providers, schools, and faith communities.",
    "founder": { "@type": "Person", "name": "Keith", "jobTitle": "Registered Nurse" },
    "areaServed": { "@type": "State", "name": "Florida" },
    "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "email": "floridaautismservices@gmail.com" },
    "sameAs": []
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
      { "@type": "ListItem", "position": 2, "name": "About", "item": "https://floridaautismservices.com/about" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>About Us | Florida Autism Services Directory</title>
        <meta name="description" content="Learn about Florida Autism Services Directory - connecting families with 7,000+ autism-friendly providers, schools, faith communities, and resources across Florida. Free, verified, and always accessible." />
        <meta name="keywords" content="about Florida autism services, autism directory Florida, autism resources Florida, autism support Florida, neurodivergent resources, autism community Florida" />
        <link rel="canonical" href="https://floridaautismservices.com/about" />
        <meta property="og:title" content="About Florida Autism Services Directory" />
        <meta property="og:description" content="Florida's premier resource hub connecting neurodivergent families with 7,000+ autism-friendly providers, schools, and services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/about" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Florida Autism Services" />
        <meta name="twitter:description" content="Connecting Florida families with 7,000+ autism-friendly resources statewide." />
        <script type="application/ld+json">{JSON.stringify(aboutSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Header - MOBILE OPTIMIZED */}
        <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 sm:py-10 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">About Us</h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100">
              The story behind Florida's most comprehensive autism resource directory
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          {/* Mission Statement */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="mission-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" aria-hidden="true" />
              </div>
              <h2 id="mission-heading" className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
              To connect Florida families with the autism-friendly resources, providers, and communities they need—all in one place, completely free.
            </p>
          </section>

          {/* Vision */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="vision-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" aria-hidden="true" />
              </div>
              <h2 id="vision-heading" className="text-xl sm:text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
              A Florida where no family has to navigate an autism diagnosis alone, where finding the right therapist, school, or support group is straightforward, and where every community has resources that truly understand and welcome neurodivergent individuals.
            </p>
          </section>

          {/* The Story */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="story-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" aria-hidden="true" />
              </div>
              <h2 id="story-heading" className="text-xl sm:text-2xl font-bold text-gray-900">The Story Behind This Directory</h2>
            </div>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700">
              <p className="mb-3 sm:mb-4">My name is Keith, and I'm a registered nurse here in Florida.</p>
              <p className="mb-3 sm:mb-4">Throughout my career in healthcare, I've seen firsthand how overwhelming it can be for families to navigate complex medical and support systems. But nothing prepared me for watching families in my own community struggle to find basic autism services.</p>
              <p className="mb-3 sm:mb-4">Parents spending countless hours searching Google. Calling provider after provider only to hear "we're not accepting new patients" or "we don't take that insurance." Driving hours across the state because they couldn't find local options. Missing out on programs simply because they didn't know they existed.</p>
              <p className="mb-3 sm:mb-4">I kept hearing the same thing: <em>"I wish there was just ONE place where I could find everything."</em></p>
              <p>So I decided to build it.</p>
            </div>
          </section>

          {/* What Makes Us Different */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="different-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" aria-hidden="true" />
              </div>
              <h2 id="different-heading" className="text-xl sm:text-2xl font-bold text-gray-900">What Makes This Directory Different</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Comprehensive</h3>
                  <p className="text-gray-700 text-sm sm:text-base">We don't just list a handful of providers. With over 7,000 resources including therapy providers, private schools, faith communities, and support services, this is the most complete autism resource directory in Florida.</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Florida-Focused</h3>
                  <p className="text-gray-700 text-sm sm:text-base">National directories often miss local gems. We focus exclusively on Florida—all 67 counties—because families need resources they can actually access.</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Actually Useful</h3>
                  <p className="text-gray-700 text-sm sm:text-base">We don't just give you a name and phone number. We work hard to provide details that matter—what insurance they accept, what scholarships apply, what services they offer—so you can spend less time making phone calls and more time getting your family the support they need.</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Free. Always.</h3>
                  <p className="text-gray-700 text-sm sm:text-base">This directory will never charge families. Period. Every parent deserves access to this information regardless of their financial situation.</p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Community-Powered</h3>
                  <p className="text-gray-700 text-sm sm:text-base">The best resources often come from word-of-mouth. Families and providers can submit resources they've discovered, helping the directory grow and stay current.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Tiles - MOBILE OPTIMIZED */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-label="Directory statistics">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-none shadow-xl bg-white">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">7,000+</p>
                      <p className="text-gray-600 text-sm sm:text-base">Resources Statewide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl bg-white">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">Verified</p>
                      <p className="text-gray-600 text-sm sm:text-base">Trusted & Updated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl bg-white">
                <CardContent className="p-4 sm:pt-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">Free</p>
                      <p className="text-gray-600 text-sm sm:text-base">Always Accessible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Our Values - MOBILE OPTIMIZED */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="values-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" aria-hidden="true" />
              </div>
              <h2 id="values-heading" className="text-xl sm:text-2xl font-bold text-gray-900">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Accessibility</h3>
                  <p className="text-gray-700 text-sm sm:text-base">Information should be free and easy to find for every family.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Accuracy</h3>
                  <p className="text-gray-700 text-sm sm:text-base">We verify resources and keep information updated because outdated info wastes families' precious time.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Compassion</h3>
                  <p className="text-gray-700 text-sm sm:text-base">Behind every search is a family looking for help. We build this directory with that reality in mind.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Inclusion</h3>
                  <p className="text-gray-700 text-sm sm:text-base">We believe every family deserves to find providers, schools, and communities that truly welcome and understand their loved ones.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section - MOBILE OPTIMIZED */}
          <section aria-labelledby="cta-heading">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-green-600 overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center text-white relative">
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 hidden sm:block" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-white/10 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24 hidden sm:block" aria-hidden="true" />
                
                <div className="relative z-10">
                  <h2 id="cta-heading" className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4">
                    Help Us Grow
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-blue-50 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
                    This directory grows through community support. If you know of a resource that should be listed, please submit it. If you've found this helpful, consider sharing it with another family or supporting our mission.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 sm:mb-8">
                    Together, we can make sure no Florida family has to navigate this journey alone.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 justify-center">
                    <Link to={createPageUrl("SubmitResource")}>
                      <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl h-12 sm:h-11">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                        Submit a Resource
                      </Button>
                    </Link>
                    <Link to="/submit-event">
                      <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl h-12 sm:h-11">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                        Submit an Event
                      </Button>
                    </Link>
                    <Link to={createPageUrl("Donate")}>
                      <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 shadow-xl h-12 sm:h-11">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                        Support Our Mission
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}