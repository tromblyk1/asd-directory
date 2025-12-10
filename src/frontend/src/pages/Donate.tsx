import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Edit3, CheckCircle, FolderOpen, TrendingUp, Check } from 'lucide-react';
import { DonationImpactSection } from '@/components/DonationImpactSection';
import { HallOfSupportersSection } from '@/components/HallOfSupportersSection';

const STRIPE_LINKS = {
    oneTime: {
        10: 'https://donate.stripe.com/aFa9AMbSBbOF12o6UC3VC07',
        25: 'https://donate.stripe.com/3cI9AMcWF9Gx9yUgvc3VC0a',
        50: 'https://donate.stripe.com/00w00c09T1a15iE6UC3VC09',
        100: 'https://donate.stripe.com/aFaeV62i1cSJ7qMgvc3VC08',
        250: 'https://donate.stripe.com/cNi6oAbSB4md26s0we3VC06',
        custom: 'https://donate.stripe.com/aFaeV68Gp2e5fXidj03VC05',
    },
    monthly: {
        10: 'https://donate.stripe.com/00w9AM9Kt2e5fXibaS3VC01',
        25: 'https://donate.stripe.com/6oU00c9Kt05X5iE92K3VC04',
        50: 'https://donate.stripe.com/3cIfZa6yh1a18uQ0we3VC03',
        100: 'https://donate.stripe.com/14A00c1dX7yp9yUgvc3VC02',
        custom: 'https://donate.stripe.com/fZu6oA6yh5qh8uQceW3VC00',
    },
};

export default function Donate() {
    const donateSchema = {
        "@context": "https://schema.org",
        "@type": "DonateAction",
        "name": "Donate to Florida Autism Services Directory",
        "description": "Support the Florida Autism Services Directory - a free resource connecting families with autism-friendly providers, schools, and services across Florida.",
        "recipient": {
            "@type": "Organization",
            "name": "Florida Autism Services Directory",
            "url": "https://floridaautismservices.com",
            "areaServed": { "@type": "State", "name": "Florida" }
        },
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://floridaautismservices.com/donate",
            "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
        }
    };

    const nonprofitSchema = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Florida Autism Services Directory",
        "description": "Free resource directory helping Florida families find autism-friendly providers, schools, faith communities, and support services.",
        "url": "https://floridaautismservices.com",
        "areaServed": { "@type": "State", "name": "Florida" },
        "potentialAction": { "@type": "DonateAction", "target": "https://floridaautismservices.com/donate" }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://floridaautismservices.com" },
            { "@type": "ListItem", "position": 2, "name": "Donate", "item": "https://floridaautismservices.com/donate" }
        ]
    };

    return (
        <>
            <Helmet>
                <title>Donate | Support Florida Autism Services Directory</title>
                <meta name="description" content="Support the Florida Autism Services Directory with a donation. 100% of contributions help maintain and expand our free resource connecting 7,000+ autism-friendly providers, schools, and services for Florida families." />
                <meta name="keywords" content="donate autism Florida, support autism families, autism charity Florida, autism nonprofit donation, help autism community" />
                <link rel="canonical" href="https://floridaautismservices.com/donate" />
                <meta property="og:title" content="Support Florida Autism Services Directory" />
                <meta property="og:description" content="Your donation helps maintain a free resource connecting Florida families with 7,000+ autism-friendly providers, schools, and services." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://floridaautismservices.com/donate" />
                <meta property="og:site_name" content="Florida Autism Services Directory" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Donate | Florida Autism Services" />
                <meta name="twitter:description" content="Support Florida's autism community. 100% of donations go to maintaining our free resource directory." />
                <script type="application/ld+json">{JSON.stringify(donateSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(nonprofitSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-teal-50 to-white pb-12 sm:pb-16">
                {/* Header - MOBILE OPTIMIZED */}
                <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-10 sm:py-14 lg:py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6" role="img" aria-label="Heart icon">
                            <Heart className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 animate-pulse" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
                            Support Our Mission
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
                            Your generosity helps us maintain and expand this vital resource for Florida's neurodivergent community.
                            Every contribution makes a real difference.
                        </p>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 lg:-mt-12">
                    {/* Impact Stats - MOBILE OPTIMIZED */}
                    <section className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-10 sm:mb-12 lg:mb-16 max-w-4xl mx-auto" aria-label="Impact statistics">
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3" aria-hidden="true">
                                <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">7,000+</p>
                            <p className="text-xs sm:text-sm text-slate-600">Resources Listed</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3" aria-hidden="true">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">100%</p>
                            <p className="text-xs sm:text-sm text-slate-600">Free Access</p>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3" aria-hidden="true">
                                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                            </div>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">Weekly</p>
                            <p className="text-xs sm:text-sm text-slate-600">Updates</p>
                        </div>
                    </section>

                    {/* Donation Options - MOBILE OPTIMIZED */}
                    <section className="mb-10 sm:mb-12 lg:mb-16" aria-labelledby="donation-heading">
                        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                            <h2 id="donation-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">
                                Choose Your Support Level
                            </h2>
                            <p className="text-base sm:text-lg text-slate-600">
                                Select an amount that works for you
                            </p>
                        </div>

                        {/* One-Time Donation */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 sm:mb-6">
                                One-Time Donation
                            </h3>
                            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                                {[10, 25, 50, 100, 250].map((amount) => (
                                    <a
                                        key={amount}
                                        href={STRIPE_LINKS.oneTime[amount as keyof typeof STRIPE_LINKS.oneTime]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-lg border-2 border-teal-500 bg-white px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md text-sm sm:text-base"
                                        aria-label={`Donate $${amount} one time`}
                                    >
                                        ${amount}
                                    </a>
                                ))}
                                <a
                                    href={STRIPE_LINKS.oneTime.custom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg border-2 border-dashed border-teal-400 bg-white px-2 sm:px-4 lg:px-6 py-3 sm:py-4 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:border-solid hover:shadow-md text-sm sm:text-base"
                                    aria-label="Donate a custom amount"
                                >
                                    <Edit3 className="h-4 w-4" aria-hidden="true" />
                                    <span>Custom</span>
                                </a>
                            </div>
                        </div>

                        {/* Monthly Donation */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" aria-hidden="true" />
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">
                                    Become a Monthly Supporter
                                </h3>
                            </div>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Recurring donations help us plan ahead and provide consistent support to families
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                {[10, 25, 50, 100].map((amount) => (
                                    <a
                                        key={amount}
                                        href={STRIPE_LINKS.monthly[amount as keyof typeof STRIPE_LINKS.monthly]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-lg border-2 border-amber-500 bg-white px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:shadow-md"
                                        aria-label={`Donate $${amount} per month`}
                                    >
                                        <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">${amount}</div>
                                        <div className="text-xs font-normal text-slate-600">per month</div>
                                    </a>
                                ))}
                            </div>
                            <a
                                href={STRIPE_LINKS.monthly.custom}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 sm:gap-2 w-full rounded-lg border-2 border-dashed border-amber-400 bg-white px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:border-solid hover:shadow-md text-sm sm:text-base"
                                aria-label="Donate a custom monthly amount"
                            >
                                <Edit3 className="h-4 w-4" aria-hidden="true" />
                                <span>Custom Monthly Amount</span>
                            </a>
                        </div>

                        <p className="text-center text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6">
                            Secure payment processing powered by Stripe - All donations support Florida families
                        </p>
                    </section>

                    <DonationImpactSection />

                    <div className="mt-10 sm:mt-12 lg:mt-16">
                        <HallOfSupportersSection />
                    </div>

                    {/* Transparency Section */}
                    <section className="mt-8 sm:mt-10 lg:mt-12 bg-green-50 border-2 border-green-200 rounded-xl p-5 sm:p-6 lg:p-8 text-center" aria-label="Donation transparency">
                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                        <p className="text-sm sm:text-base lg:text-lg text-slate-700">
                            <strong className="text-slate-900">100%</strong> of your donation goes directly to
                            maintaining and improving the Florida Autism Services Directory. We're committed to transparency and
                            efficiency.
                        </p>
                    </section>
                </main>
            </div>
        </>
    );
}