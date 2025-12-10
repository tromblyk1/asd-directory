import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Stethoscope, Shield, GraduationCap, 
  ArrowRight, Heart, Users
} from 'lucide-react';

const servicesList = [
  { slug: 'aba-therapy', name: 'ABA Therapy', description: 'Applied Behavior Analysis' },
  { slug: 'speech-therapy', name: 'Speech Therapy', description: 'Communication and language' },
  { slug: 'occupational-therapy', name: 'Occupational Therapy', description: 'Daily living skills' },
  { slug: 'physical-therapy', name: 'Physical Therapy', description: 'Motor skill development' },
  { slug: 'feeding-therapy', name: 'Feeding Therapy', description: 'Eating and nutrition support' },
  { slug: 'music-therapy', name: 'Music Therapy', description: 'Therapeutic music interventions' },
  { slug: 'group-therapy', name: 'Social Skills Groups', description: 'Peer interaction and socialization' },
  { slug: 'ados-testing', name: 'ADOS Testing', description: 'Autism diagnostic assessment' },
];

const insurancesList = [
  { slug: 'florida-medicaid', name: 'Florida Medicaid', description: 'State Medicaid program' },
  { slug: 'aetna', name: 'Aetna', description: 'Private insurance' },
  { slug: 'cigna', name: 'Cigna', description: 'Private insurance' },
  { slug: 'unitedhealthcare', name: 'United Healthcare', description: 'Private insurance' },
  { slug: 'florida-blue', name: 'Florida Blue', description: 'BCBS of Florida' },
  { slug: 'sunshine-health', name: 'Sunshine Health', description: 'Medicaid managed care' },
  { slug: 'wellcare', name: 'WellCare', description: 'Medicaid and Medicare' },
  { slug: 'medicare', name: 'Medicare', description: 'Federal health insurance' },
];

const scholarshipsList = [
  { slug: 'fes-ua', name: 'FES-UA', description: 'Unique Abilities scholarship' },
  { slug: 'fes-eo', name: 'FES-EO', description: 'Educational Opportunities' },
  { slug: 'hope', name: 'HOPE Scholarship', description: 'For bullying situations' },
  { slug: 'ftc', name: 'FTC Scholarship', description: 'Florida Tax Credit' },
  { slug: 'pep', name: 'PEP', description: 'Personalized Education Program' },
];

export default function EducationalResources() {
  // SEO structured data
  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Educational Resources for Autism in Florida",
    "description": "Comprehensive guides to autism services, insurance coverage, and educational scholarships in Florida. Learn about ABA therapy, speech therapy, Medicaid, and school choice programs.",
    "url": "https://floridaautismservices.com/resources",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Autism Resources Guide",
      "description": "Educational content about autism therapies, insurance options, and financial assistance programs in Florida",
      "numberOfItems": servicesList.length + insurancesList.length + scholarshipsList.length,
      "itemListElement": [
        ...servicesList.map((service, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "MedicalTherapy",
            "name": service.name,
            "description": service.description,
            "url": `https://floridaautismservices.com/resources/services/${service.slug}`
          }
        })),
        ...insurancesList.map((insurance, index) => ({
          "@type": "ListItem",
          "position": servicesList.length + index + 1,
          "item": {
            "@type": "HealthInsurancePlan",
            "name": insurance.name,
            "description": insurance.description,
            "url": `https://floridaautismservices.com/resources/insurances/${insurance.slug}`
          }
        })),
        ...scholarshipsList.map((scholarship, index) => ({
          "@type": "ListItem",
          "position": servicesList.length + insurancesList.length + index + 1,
          "item": {
            "@type": "EducationalOccupationalProgram",
            "name": scholarship.name,
            "description": scholarship.description,
            "url": `https://floridaautismservices.com/resources/scholarships/${scholarship.slug}`
          }
        }))
      ]
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
        "name": "Educational Resources",
        "item": "https://floridaautismservices.com/resources"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What autism therapy services are available in Florida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Florida offers various autism therapy services including ABA (Applied Behavior Analysis) therapy, speech therapy, occupational therapy, physical therapy, feeding therapy, music therapy, and social skills groups. ADOS testing is also available for autism diagnosis."
        }
      },
      {
        "@type": "Question",
        "name": "Does Florida Medicaid cover autism services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Florida Medicaid covers many autism services including ABA therapy, speech therapy, and occupational therapy. Coverage varies by plan, so check with your specific Medicaid managed care organization for details."
        }
      },
      {
        "@type": "Question",
        "name": "What scholarships are available for children with autism in Florida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Florida offers several school choice scholarships for students with autism including the FES-UA (Family Empowerment Scholarship for Unique Abilities), FES-EO (Educational Opportunities), FTC (Florida Tax Credit), PEP (Personalized Education Program), and HOPE scholarship for bullying situations."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Educational Resources | Autism Services, Insurance & Scholarships in Florida</title>
        <meta name="description" content="Learn about autism services in Florida including ABA therapy, speech therapy, occupational therapy. Understand insurance coverage from Medicaid, Aetna, Cigna and scholarship programs like FES-UA, FES-EO, and FTC." />
        <meta name="keywords" content="autism services Florida, ABA therapy Florida, autism insurance coverage, Florida autism scholarships, FES-UA, FES-EO, Florida Medicaid autism, speech therapy autism, occupational therapy autism" />
        <link rel="canonical" href="https://floridaautismservices.com/resources" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Educational Resources | Florida Autism Services" />
        <meta property="og:description" content="Comprehensive guides to autism services, insurance coverage, and educational scholarships in Florida." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://floridaautismservices.com/resources" />
        <meta property="og:site_name" content="Florida Autism Services Directory" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Autism Resources Guide | Florida" />
        <meta name="twitter:description" content="Learn about autism services, insurance, and scholarships in Florida." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(educationalSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-12">
        {/* Header - MOBILE OPTIMIZED */}
        <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 sm:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Mobile: stacked layout, Desktop: side-by-side */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0" role="img" aria-label="Book icon">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">
                  Educational Resources
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-orange-100">
                  Learn about autism services, insurance coverage, and financial assistance in Florida
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          {/* Services Section */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="services-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 id="services-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Therapy & Services</h2>
                <p className="text-gray-600 text-sm sm:text-base">Learn about different types of autism therapy and support services</p>
              </div>
            </div>

            {/* MOBILE: 2 cols, SM: 2 cols, MD: 2 cols, LG: 4 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {servicesList.map((service) => (
                <Link key={service.slug} to={`/resources/services/${service.slug}`}>
                  <article>
                    <Card className="h-full hover:shadow-lg transition-all border-none group cursor-pointer">
                      <CardContent className="p-3 sm:p-4 lg:p-5">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                          {service.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center text-xs sm:text-sm text-blue-600 font-medium">
                          <span>Learn more</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </div>
                      </CardContent>
                    </Card>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Insurance Section */}
          <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="insurance-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 id="insurance-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Insurance Coverage</h2>
                <p className="text-gray-600 text-sm sm:text-base">Understanding autism coverage with different insurance providers</p>
              </div>
            </div>

            {/* MOBILE: 2 cols, SM: 2 cols, MD: 2 cols, LG: 4 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {insurancesList.map((insurance) => (
                <Link key={insurance.slug} to={`/resources/insurances/${insurance.slug}`}>
                  <article>
                    <Card className="h-full hover:shadow-lg transition-all border-none group cursor-pointer">
                      <CardContent className="p-3 sm:p-4 lg:p-5">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors text-sm sm:text-base">
                          {insurance.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          {insurance.description}
                        </p>
                        <div className="flex items-center text-xs sm:text-sm text-purple-600 font-medium">
                          <span>View coverage</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </div>
                      </CardContent>
                    </Card>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Scholarships Section */}
          <section aria-labelledby="scholarships-heading">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 id="scholarships-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Education Scholarships</h2>
                <p className="text-gray-600 text-sm sm:text-base">Financial assistance programs for students with special needs in Florida</p>
              </div>
            </div>

            {/* MOBILE: 2 cols (with last item full width if odd), SM: 2 cols, LG: 3 cols */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {scholarshipsList.map((scholarship, index) => (
                <Link 
                  key={scholarship.slug} 
                  to={`/resources/scholarships/${scholarship.slug}`}
                  className={scholarshipsList.length % 2 !== 0 && index === scholarshipsList.length - 1 ? 'col-span-2 lg:col-span-1' : ''}
                >
                  <article>
                    <Card className="h-full hover:shadow-lg transition-all border-none group cursor-pointer">
                      <CardContent className="p-3 sm:p-4 lg:p-5">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors text-sm sm:text-base">
                          {scholarship.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          {scholarship.description}
                        </p>
                        <div className="flex items-center text-xs sm:text-sm text-green-600 font-medium">
                          <span>Learn more</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </div>
                      </CardContent>
                    </Card>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Section - MOBILE OPTIMIZED */}
          <section className="mt-10 sm:mt-12 lg:mt-16" aria-labelledby="cta-heading">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-orange-600 to-red-600 text-white overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-10 text-center relative">
                {/* Decorative circles - hidden on mobile for cleaner look */}
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 hidden sm:block" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-white/10 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24 hidden sm:block" aria-hidden="true" />
                
                <div className="relative z-10">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 opacity-80" aria-hidden="true" />
                  <h2 id="cta-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                    Ready to Find Providers?
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Now that you know about services, insurance, and scholarships, 
                    search our directory to find providers in your area.
                  </p>
                  <Link to="/providers">
                    <button className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg inline-flex items-center gap-2 shadow-xl transition-all h-12 sm:h-auto">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                      Find Providers
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}