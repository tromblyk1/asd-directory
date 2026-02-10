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
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white text-lg sm:text-xl font-bold mb-10 shadow-lg">
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-5 tracking-tight">Exclusive 1-Year Founding Partner Rate for Select Physical Therapy</h2>
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

      {/* SECTION 7: What You Get */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3">What Featured Listings Include for Each Location</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Each of your <span className="font-semibold text-gray-700">55 locations</span> gets priority placement in their local market</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
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
            className="inline-flex items-center px-10 py-4 text-lg font-semibold rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
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
