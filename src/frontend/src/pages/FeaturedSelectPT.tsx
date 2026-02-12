import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const IMG = "/images/Partners/select-pt";

const smoothScroll = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const checkIcon = (
  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const starIcon = (
  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

export default function FeaturedSelectPT() {
  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: Hero */}
      <section className="relative overflow-hidden h-[550px] sm:h-[700px] lg:h-[750px]">
        <div className="absolute inset-0">
          <img
            src={`${IMG}/select_op-all-website-hero-image.jpg`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 to-teal-900/75" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 sm:pb-10 lg:pb-14 px-4 sm:px-6 text-center">
          <img
            src={`${IMG}/logo-white-gradient-bg--select-physical-therapy.png`}
            alt="Select Physical Therapy"
            className="h-36 sm:h-72 lg:h-96 mx-auto mb-2 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            Featured Partnership Proposal
          </h1>
          <p className="text-lg sm:text-xl text-teal-100 max-w-3xl mx-auto mb-6">
            Connecting Your <span className="font-bold text-white">55 Florida Locations</span> with Families Searching for Autism Services
          </p>
          <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white text-base sm:text-xl font-bold mb-10 shadow-lg">
            <svg className="w-6 h-6 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
            300% traffic growth in the last month
          </div>
          <div>
            <button
              onClick={() => smoothScroll("pricing")}
              className="inline-flex items-center px-8 py-3.5 text-base font-semibold rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
            >
              View Partnership Pricing
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Opportunity */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">Why Florida Autism Services?</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg">
            Families across Florida rely on FloridaAutismServices.com not only to find autism therapy providers, but also for our extensive educational resources, school listings, faith-based community resources, and event calendar. Your impressive pediatric therapy services are already listed in our directory. Now let's make sure families can actually find you among the 3,700+ providers — and growing — competing for their attention.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-4xl font-extrabold text-teal-700 mb-2">3,700+</div>
              <div className="text-gray-600 font-medium">Providers Listed</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-4xl font-extrabold text-teal-700 mb-2">30%+</div>
              <div className="text-gray-600 font-medium">Monthly Growth</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-4xl font-extrabold text-teal-700 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Autism-Focused Traffic</div>
            </div>
          </div>

          {/* Traffic Growth Chart — visual proof */}
          <div className="mt-14 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Our Growth Speaks for Itself</h3>
            <p className="text-gray-500 mb-8 text-base max-w-2xl mx-auto">Real data from Google Search Console — families are finding us, and the numbers are accelerating every month.</p>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">
              <h4 className="text-base font-semibold text-gray-700 mb-1">FloridaAutismServices.com — Search Impressions</h4>
              <p className="text-sm text-gray-400 mb-6">Google Search Console · Last 5 Months</p>
              <svg viewBox="0 0 500 260" className="w-full" aria-label="Growth chart showing monthly search impressions from October 2025 to February 2026">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="60" y1={40 + i * 45} x2="470" y2={40 + i * 45} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                {/* Y-axis labels */}
                <text x="55" y="44" textAnchor="end" className="text-[11px]" fill="#9ca3af">80K</text>
                <text x="55" y="89" textAnchor="end" className="text-[11px]" fill="#9ca3af">60K</text>
                <text x="55" y="134" textAnchor="end" className="text-[11px]" fill="#9ca3af">40K</text>
                <text x="55" y="179" textAnchor="end" className="text-[11px]" fill="#9ca3af">20K</text>
                <text x="55" y="224" textAnchor="end" className="text-[11px]" fill="#9ca3af">0</text>
                {/* Area fill */}
                <defs>
                  <linearGradient id="selectPtTealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d="M 162.5 219.5 L 265 216.6 L 367.5 118.8 L 470 40 L 470 220 L 162.5 220 Z"
                  fill="url(#selectPtTealGrad)"
                />
                {/* Solid line */}
                <polyline
                  points="60,219.9 162.5,219.5 265,216.6 367.5,118.8 470,40"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {[
                  [60, 219.9],
                  [162.5, 219.5],
                  [265, 216.6],
                  [367.5, 118.8],
                  [470, 40],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={i === 4 ? 6 : 4} fill={i === 4 ? "white" : "#14b8a6"} stroke="#14b8a6" strokeWidth="2" />
                ))}
                {/* Latest month annotation */}
                <text x="470" y="30" textAnchor="middle" fill="#0d9488" className="text-[11px]" fontWeight="600">Feb 2026</text>
                {/* X-axis labels */}
                <text x="60" y="242" textAnchor="middle" className="text-[11px]" fill="#6b7280">Oct</text>
                <text x="162.5" y="242" textAnchor="middle" className="text-[11px]" fill="#6b7280">Nov</text>
                <text x="265" y="242" textAnchor="middle" className="text-[11px]" fill="#6b7280">Dec</text>
                <text x="367.5" y="242" textAnchor="middle" className="text-[11px]" fill="#6b7280">Jan</text>
                <text x="470" y="242" textAnchor="middle" className="text-[11px]" fill="#6b7280">Feb</text>
              </svg>
              <div className="mt-6 bg-white shadow-md rounded-lg border-l-4 border-teal-500 px-5 py-4 text-left">
                <div className="text-lg font-bold text-gray-900">300% Traffic Growth</div>
                <div className="text-sm text-gray-500 mt-1">130K total impressions in the last 90 days</div>
              </div>
              <p className="text-xs text-gray-400 mt-4">Source: Google Search Console — FloridaAutismServices.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Pediatric Services */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Select Physical Therapy's Autism-Specific Services</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <img src={`${IMG}/select-pt-kids-logo.png`} alt="Select Kids" className="h-20 sm:h-28" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "select-pt-pediatric-physical-therapy.jpg", title: "Physical Therapy", desc: "Gross motor skills, balance, coordination, and mobility for children on the spectrum" },
              { img: "select-pt-occupational-therapy.jpg", title: "Occupational Therapy", desc: "Fine motor skills, sensory processing, self-care, and adaptive coping strategies" },
              { img: "select-pt-speech-therapy.jpg", title: "Speech Therapy", desc: "Communication, language development, social pragmatics, and articulation" },
              { img: "select-pt-specialized-pediatric-services-children.jpg", title: "Feeding Therapy", desc: "Helping children master mealtime skills and address feeding challenges for children with sensory issues and oral motor deficits" },
              { img: "select-pt-specialized-pediatric-services-children.jpg", title: "Social Skills Group Therapy", desc: "Group therapy sessions to help children improve social interaction, turn-taking, and communication skills with peers" },
              { img: "select-pt-specialized-pediatric-services-children.jpg", title: "Specialized Programs", desc: "Multidisciplinary pediatric programs tailored for neurodivergent children" },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <img src={`${IMG}/${s.img}`} alt={s.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: VIP Partnership Offer */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-amber-400/20 border-2 border-amber-400/40 text-amber-200 text-xl sm:text-2xl lg:text-3xl font-extrabold shadow-2xl">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-3 sm:mr-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
              VIP Exclusive
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-5 tracking-tight">Exclusive 1-Year Founding Partner Rate for Select Physical Therapy</h2>
          <p className="text-teal-100 text-center mb-12 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Given your 55 locations across Florida, we're extending our Founding Partner rate (50% off) for a <span className="font-bold text-white">full year</span>—while everyone else only gets 6 months. You're among the first major providers we're launching Featured Listings with, and this extended offer gives you time to see the full value of enhanced visibility across all your locations.
          </p>
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/25 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <h3 className="font-bold text-2xl mb-8 text-center">VIP Partnership Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: starIcon, text: "Full year Founding Partner rate (50% off) — standard is 6 months" },
                { icon: starIcon, text: "Priority support & dedicated partnership contact" },
                { icon: starIcon, text: "Custom listing optimization for each location" },
                { icon: starIcon, text: "First access to new features and enhancements" },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/10 rounded-xl p-5 border border-white/10">
                  {b.icon}
                  <span className="text-base sm:text-lg">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Now Launching */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-8 py-3 rounded-full bg-teal-100 text-teal-700 text-lg sm:text-xl lg:text-2xl font-bold mb-6 shadow-sm">
              New Product Launch
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Listings — Now Launching</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-10">
              We're introducing Featured Listings as a new way for therapy providers to stand out in search results on Florida's largest autism resource directory. As one of our launch partners, Select Physical Therapy will benefit from:
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 sm:p-10 max-w-3xl mx-auto">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">{checkIcon}<span className="text-base">Exclusive Founding Partner pricing (<strong>50% off for full year</strong> vs 6 months for others)</span></li>
              <li className="flex items-start gap-3">{checkIcon}<span className="text-base">VIP Partner status with ongoing discounted rates after Year 1</span></li>
              <li className="flex items-start gap-3">{checkIcon}<span className="text-base">Priority support and dedicated partnership contact</span></li>
              <li className="flex items-start gap-3">{checkIcon}<span className="text-base">First access to new features as we enhance the platform</span></li>
              <li className="flex items-start gap-3">{checkIcon}<span className="text-base">Custom listing optimization for each location</span></li>
            </ul>
            <p className="mt-6 text-gray-500 text-sm italic text-center">This is a ground-floor opportunity to establish visibility before Featured Listings becomes widely adopted.</p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION 1: Standard Pricing */}
      <section id="pricing" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Standard Featured Listings Pricing</h2>
            <p className="text-gray-500 text-lg">Per-location monthly pricing for Featured Listings on FloridaAutismServices.com</p>
          </div>
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 sm:p-6 text-center mb-12 max-w-3xl mx-auto">
            <p className="text-amber-800 text-lg sm:text-xl font-bold">This is our standard pricing for Featured Listings. Keep reading below — YOU WON'T BE PAYING THIS!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: "Basic Featured", sub: "Stand out from the crowd", price: 29, total: 1595 },
              { tier: "Enhanced Featured", sub: "Maximum impact per dollar", price: 59, total: 3245 },
              { tier: "Premium Partner", sub: "The full showcase experience", price: 99, total: 5445 },
            ].map((t) => (
              <div key={t.tier} className="bg-white rounded-xl border border-gray-200 shadow-md p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{t.tier}</h3>
                <p className="text-gray-500 text-sm mb-6">{t.sub}</p>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">${t.price}</div>
                <div className="text-gray-500 mb-4">/location/mo</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">55 locations</span>
                    <span className="font-semibold text-gray-900">${t.total.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <ChevronDown className="w-10 h-10 text-teal-600 animate-bounce" />
          </div>
        </div>
      </section>

      {/* PRICING SECTION 2: 25% Volume Discount */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-green-100 text-green-700 text-lg sm:text-2xl lg:text-3xl font-extrabold mb-6 shadow-sm">25% Volume Discount</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">As a 55-Location Organization, You Qualify For Our Maximum Volume Discount</h2>
            <p className="text-gray-500 text-lg">Standard maximum discount for organizations with 7+ locations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: "Basic Featured", price: 29, discounted: 22, total: 1210 },
              { tier: "Enhanced Featured", price: 59, discounted: 44, total: 2420 },
              { tier: "Premium Partner", price: 99, discounted: 74, total: 4070 },
            ].map((t) => (
              <div key={t.tier} className="bg-white rounded-xl border border-gray-200 shadow-md p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t.tier}</h3>
                <div className="text-gray-400 line-through text-2xl mb-1">${t.price}/loc/mo</div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">${t.discounted}</div>
                <div className="text-gray-500 mb-2">/location/mo</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4">25% off</div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">55 locations</span>
                    <span className="font-semibold text-gray-900">${t.total.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 sm:p-6 text-center mt-10 max-w-3xl mx-auto">
            <p className="text-amber-800 text-lg sm:text-xl font-bold">BUT WAIT — as a VIP Founding Partner, you get EVEN MORE. Keep reading.</p>
          </div>
          <div className="flex justify-center mt-8">
            <ChevronDown className="w-10 h-10 text-teal-600 animate-bounce" />
          </div>
        </div>
      </section>

      {/* PRICING SECTION 3: VIP Exclusive Founding Partner Offer */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-5 sm:px-10 py-3 sm:py-4 rounded-full bg-amber-400/20 border-2 border-amber-400/40 text-amber-200 text-base sm:text-2xl lg:text-3xl font-extrabold shadow-2xl mb-8">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 mr-2 sm:mr-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
              VIP Exclusive Founding Partner Offer
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Your Actual Pricing as a VIP Partner</h2>
            <p className="text-teal-100 text-lg sm:text-xl max-w-3xl mx-auto">These exclusive benefits are only available to Select Physical Therapy as a premier launch partner</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
              <div className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-2">VIP Exclusive Perk</div>
              <div className="text-white font-bold text-lg">30% VIP Volume Discount</div>
              <div className="text-teal-200 text-sm mt-1">Standard max is 25% — you get an extra 5% off</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
              <div className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-2">VIP Exclusive Perk</div>
              <div className="text-white font-bold text-lg">50% Founding Partner Rate — Full Year</div>
              <div className="text-teal-200 text-sm mt-1">Standard founders get 6 months — you get 12</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic VIP */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basic Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Stand out from the crowd</p>
                <div className="mb-2">
                  <div className="text-gray-400 line-through text-lg">$29/loc/mo</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">$20</span>
                    <span className="text-gray-500">/location/mo</span>
                  </div>
                  <div className="inline-flex items-center mt-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-sm">30% VIP volume discount</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 my-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">55 locations</span>
                    <span className="font-medium text-gray-800">$1,100/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-teal-200 pt-2">
                    <span className="text-teal-700 font-bold">Year 1 (50% Founder)</span>
                    <span className="font-extrabold text-teal-700 text-base">$550/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-500">Year 2+ (35% VIP)</span>
                    <span className="font-medium text-gray-600">$990/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{checkIcon}<span>Guaranteed position <strong>#4-6</strong> in search results</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Gold border & <strong>Featured</strong> badge</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Enhanced visibility in county searches</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Monthly performance reports</span></li>
                </ul>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Basic%20Featured"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
                >
                  Select This Tier
                </a>
              </div>
            </div>

            {/* Enhanced VIP */}
            <div className="bg-white rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden flex flex-col relative">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2">
                Best Value
              </div>
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enhanced Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Maximum impact per dollar</p>
                <div className="mb-2">
                  <div className="text-gray-400 line-through text-lg">$59/loc/mo</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">$41</span>
                    <span className="text-gray-500">/location/mo</span>
                  </div>
                  <div className="inline-flex items-center mt-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-sm">30% VIP volume discount</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 my-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">55 locations</span>
                    <span className="font-medium text-gray-800">$2,255/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-teal-200 pt-2">
                    <span className="text-teal-700 font-bold">Year 1 (50% Founder)</span>
                    <span className="font-extrabold text-teal-700 text-base">$1,128/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-500">Year 2+ (35% VIP)</span>
                    <span className="font-medium text-gray-600">$2,029/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2 text-base font-bold text-teal-700"><span>Everything in Basic, PLUS:</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Guaranteed position <strong>#2-3</strong> in search results</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span><strong>Clinic photos</strong> on listing cards</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span><strong>"Why Choose Us"</strong> highlighted section</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Prominent <strong>"Visit Website"</strong> button</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Social media integration</span></li>
                </ul>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Enhanced%20Featured"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md"
                >
                  Select This Tier
                </a>
              </div>
            </div>

            {/* Premium VIP */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Partner</h3>
                <p className="text-gray-500 text-sm mb-6">The full showcase experience</p>
                <div className="mb-2">
                  <div className="text-gray-400 line-through text-lg">$99/loc/mo</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">$69</span>
                    <span className="text-gray-500">/location/mo</span>
                  </div>
                  <div className="inline-flex items-center mt-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-sm">30% VIP volume discount</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 my-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">55 locations</span>
                    <span className="font-medium text-gray-800">$3,795/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-teal-200 pt-2">
                    <span className="text-teal-700 font-bold">Year 1 (50% Founder)</span>
                    <span className="font-extrabold text-teal-700 text-base">$1,898/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-500">Year 2+ (35% VIP)</span>
                    <span className="font-medium text-gray-600">$3,416/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2 text-base font-bold text-teal-700"><span>Everything in Basic & Enhanced, PLUS:</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span><strong>Pinned to #1</strong> in all search results</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span><strong>Video testimonials</strong> on detail page</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Extended descriptions (unlimited length)</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Priority support & dedicated account contact</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>First access to beta features</span></li>
                  <li className="flex items-start gap-2">{checkIcon}<span>Custom branding options (coming soon)</span></li>
                </ul>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Premium%20Partner"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
                >
                  Select This Tier
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION 4: Annual Billing Discount */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-green-100 text-green-700 text-lg sm:text-2xl lg:text-3xl font-extrabold mb-6 shadow-sm">15% Annual Billing Discount</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Save 15% with Annual Billing</h2>
            <p className="text-gray-500 text-lg">Pay annually and save 15% across all tiers. Same features, lower cost.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Annual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basic Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>

                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Year 1 — Founding Partner</div>
                  <div className="text-3xl font-extrabold text-gray-900">$5,610<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$467.50/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$550/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $990/year</div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year 2+ — VIP Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$10,098<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$841.50/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$990/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $1,782/year</div>
                </div>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Basic%20Featured%20Annual"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
                >
                  Select This Tier
                </a>
              </div>
            </div>

            {/* Enhanced Annual */}
            <div className="bg-white rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden flex flex-col relative">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2">
                Best Value
              </div>
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enhanced Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>

                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Year 1 — Founding Partner</div>
                  <div className="text-3xl font-extrabold text-gray-900">$11,506<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$958.83/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$1,128/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $2,030/year</div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year 2+ — VIP Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$20,696<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$1,724.67/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$2,029/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $3,652/year</div>
                </div>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Enhanced%20Featured%20Annual"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md"
                >
                  Select This Tier
                </a>
              </div>
            </div>

            {/* Premium Annual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
              <div className="p-5 sm:p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Partner</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>

                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Year 1 — Founding Partner</div>
                  <div className="text-3xl font-extrabold text-gray-900">$19,360<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$1,613.33/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$1,898/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $3,416/year</div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year 2+ — VIP Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$34,843<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$2,903.58/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$3,416/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $6,149/year</div>
                </div>
              </div>
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry%20-%20Premium%20Partner%20Annual"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors"
                >
                  Select This Tier
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: What You Get */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3">What Featured Listings Include for Each Location</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Each of your <span className="font-semibold text-gray-700">55 locations</span> gets priority placement in their local market</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Basic</th>
                  <th className="text-center py-3 px-4 text-teal-700 font-bold bg-teal-50 rounded-t-lg">Enhanced</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Search result position", basic: "#4-6", enhanced: "#2-3", premium: "#1" },
                  { feature: "Gold border & Featured badge", basic: true, enhanced: true, premium: true },
                  { feature: "County search visibility", basic: true, enhanced: true, premium: true },
                  { feature: "Monthly performance reports", basic: true, enhanced: true, premium: true },
                  { feature: "Clinic photos on listings", basic: false, enhanced: true, premium: true },
                  { feature: '"Why Choose Us" section', basic: false, enhanced: true, premium: true },
                  { feature: '"Visit Website" button', basic: false, enhanced: true, premium: true },
                  { feature: "Social media links", basic: false, enhanced: true, premium: true },
                  { feature: "Pinned to #1 in all results", basic: false, enhanced: false, premium: true },
                  { feature: "Video testimonials", basic: false, enhanced: false, premium: true },
                  { feature: "Extended descriptions (unlimited)", basic: false, enhanced: false, premium: true },
                  { feature: "Priority support & dedicated contact", basic: false, enhanced: false, premium: true },
                  { feature: "First access to beta features", basic: false, enhanced: false, premium: true },
                  { feature: "Custom branding options", basic: false, enhanced: false, premium: true },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.basic === 'string' ? <span className="font-semibold text-gray-700">{row.basic}</span> : row.basic ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center bg-teal-50/50">
                      {typeof row.enhanced === 'string' ? <span className="font-semibold text-teal-700">{row.enhanced}</span> : row.enhanced ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.premium === 'string' ? <span className="font-bold text-teal-700">{row.premium}</span> : row.premium ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION: ROI */}
      <style>{`
        @keyframes roiGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(20,184,166,0.3), 0 0 80px rgba(20,184,166,0.15); }
          50% { box-shadow: 0 0 60px rgba(20,184,166,0.5), 0 0 120px rgba(20,184,166,0.3); }
        }
        @keyframes roiStatPulse {
          0%, 100% { text-shadow: 0 0 30px rgba(13,148,136,0.3); }
          50% { text-shadow: 0 0 60px rgba(13,148,136,0.5), 0 0 100px rgba(13,148,136,0.25); }
        }
        @keyframes roiBadgeGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(34,211,238,0.2), 0 0 24px rgba(34,211,238,0.1); }
          50% { box-shadow: 0 0 24px rgba(34,211,238,0.4), 0 0 48px rgba(34,211,238,0.2); }
        }
      `}</style>
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400" />

        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[900px] h-[900px] rounded-full bg-teal-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center px-8 py-3 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-lg font-bold uppercase tracking-widest mb-12 backdrop-blur-sm" style={{ animation: 'roiBadgeGlow 3s ease-in-out infinite' }}>
            <span className="mr-3 text-2xl">&#128202;</span>
            Backed by Research
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-8" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)' }}>What's the Real ROI?</h2>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Children with autism use PT, OT, and speech therapy at <span className="font-bold text-white">11–16&#215; the rate</span> of non-ASD peers — and they stay in therapy for years, not weeks. Here's what peer-reviewed research says about the value of every new family that finds you.
          </p>

          {/* 4 stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-20 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 mb-2">$10,279</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per child per year</div>
              <p className="text-sm text-gray-400 leading-relaxed">Average annual outpatient spending per child with treated ASD</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">AHRQ MEPS, 2025 &#179;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cyan-400 mb-2">11–16&#215;</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">higher utilization</div>
              <p className="text-sm text-gray-400 leading-relaxed">ASD children use PT, OT, and speech services at 11–16&#215; the rate of non-ASD peers ages 3–9</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">Cummings et al., JADD 2016 &#178;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 mb-2">$33</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per Google Ads lead</div>
              <p className="text-sm text-gray-400 leading-relaxed">Average cost per lead for PT keywords on Google Ads — and that's just for the lead, not the patient</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">LocaliQ Healthcare Benchmarks, 2026 &#8308;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400 mb-2">$21</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per month, per location</div>
              <p className="text-sm text-gray-400 leading-relaxed">Your Founding Partner Enhanced Featured Listing on FloridaAutismServices.com — running 24/7/365</p>
            </div>
          </div>

          {/* Giant stat callout */}
          <div className="relative mx-auto max-w-3xl rounded-2xl hover:scale-[1.02] transition-transform duration-300" style={{ animation: 'roiGlow 3s ease-in-out infinite' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-10 sm:p-12 lg:p-14 text-gray-900 text-center">
              <div className="text-[6rem] sm:text-[8rem] lg:text-[10rem] font-extrabold text-teal-600 leading-none mb-4" style={{ animation: 'roiStatPulse 4s ease-in-out infinite' }}>1–2</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">new families</div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                As few as <strong className="text-gray-900">1–2 new families</strong> finding Select Physical Therapy through FloridaAutismServices.com could potentially cover your <strong className="text-gray-900">entire Featured Listing investment</strong> — across all <strong className="text-gray-900">55 Florida locations</strong> — for the full year.
              </p>
            </div>
          </div>

          {/* "That's not a typo" callout */}
          <div className="mt-14 mx-auto max-w-3xl border-l-4 border-teal-400 bg-white/5 rounded-r-xl p-6 sm:p-8 text-left">
            <div className="text-xl sm:text-2xl font-bold text-white mb-3">That's not a typo.</div>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-3">
              The math works because pediatric ASD patients have exceptionally high lifetime value — and 82% of patients use online directories and reviews when choosing a provider.
            </p>
            <p className="text-base sm:text-lg font-bold text-teal-400">
              Your Featured Listing works 24/7, 365&nbsp;days&nbsp;a&nbsp;year.
            </p>
          </div>

          {/* Download ROI Brief */}
          <div className="mt-14 text-center">
            <a
              href="/select-pt-roi-brief.pdf"
              target="_blank"
              className="inline-flex items-center px-5 sm:px-8 py-4 bg-white text-slate-800 text-base sm:text-lg font-semibold rounded-xl border border-white/20 hover:bg-teal-50 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span className="mr-3 text-xl">&#128196;</span>
              View the Full ROI Brief
            </a>
            <p className="text-sm text-gray-400 mt-3">Peer-reviewed research, federal health data, and the complete ROI analysis</p>
          </div>

          {/* Citations */}
          <div className="mt-12 mx-auto max-w-4xl border-t border-white/10 pt-8 text-left">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="block mb-1">&#185; Cidav et al., <em>Journal of Autism and Developmental Disorders</em> (2013). Medicaid FFS claims analysis, 45,948 children with ASD. PMC4771520</span>
              <span className="block mb-1">&#178; Cummings et al., <em>Journal of Autism and Developmental Disorders</em> (2016). 8,325 ASD cases vs 83,195 matched controls, five major health systems. PMC4747787</span>
              <span className="block mb-1">&#179; AHRQ Medical Expenditure Panel Survey, Statistical Brief #565 (Monnet &amp; Zuvekas, 2025). National health expenditures for children with treated ASD, 2018–2022.</span>
              <span className="block">&#8308; LocaliQ Healthcare Search Advertising Benchmarks (2026). Aggregated U.S. healthcare search campaign data across 16 specialties.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Connect with More Florida Families?
          </h2>
          <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
            Let's discuss how Featured Listings can help Select Physical Therapy reach more families across all 55 Florida locations.
          </p>
          <a
            href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry"
            className="inline-flex items-center px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
          >
            Schedule a Partnership Discussion
          </a>
          <p className="mt-6 text-teal-200 text-sm">
            Or email us directly at{" "}
            <a href="mailto:contact@floridaautismservices.com?subject=Select%20PT%20Partnership%20Inquiry" className="underline text-white hover:text-teal-100">
              contact@floridaautismservices.com
            </a>
          </p>
          <p className="mt-4 text-teal-300 text-xs italic">This exclusive offer is available for a limited time</p>
        </div>
      </section>
    </div>
  );
}
