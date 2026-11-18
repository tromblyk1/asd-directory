import { useState, type FormEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useSiteStats } from "@/hooks/useSiteStats";
import { getStripeLink, isStripeLinkConfigured } from "@/lib/stripeLinks";

const starSvg = (
  <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
);
const starGray = (
  <svg className="w-3.5 h-3.5 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
);
const cameraSvg = (cls: string) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const checkSvg = (
  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const phoneSvg = (
  <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
);
const globeSvg = (
  <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
);
const mapPinSvg = (
  <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const emailSvg = (
  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);

const VerifiedBadge = () => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
    {checkSvg}Verified
  </span>
);

const Stars = () => (
  <div className="flex items-center gap-0.5">
    {starSvg}{starSvg}{starSvg}{starSvg}{starGray}
    <span className="text-xs text-gray-500 ml-1">(47)</span>
  </div>
);

const ServiceBadges = () => (
  <div className="flex flex-wrap gap-1.5">
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">ABA Therapy</span>
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Speech Therapy</span>
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Parent Coaching</span>
  </div>
);

const InsuranceBadges = () => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Insurance Accepted</p>
    <div className="flex flex-wrap gap-1.5">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Florida Medicaid</span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Aetna</span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">Florida Blue</span>
    </div>
  </div>
);

const SocialIcons = () => (
  <div className="flex items-center gap-3 pt-1">
    <span className="text-gray-400 hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
    <span className="text-gray-400 hover:text-pink-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></span>
    <span className="text-gray-400 hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></span>
    <span className="text-gray-400 hover:text-red-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></span>
  </div>
);

function smoothScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Search Result Cards ───────────────────────────────────────────────

function StandardSearchCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">Sunshine ABA & Behavioral Health</h4>
              <p className="text-sm text-gray-500 mt-0.5">Orange County</p>
              <div className="mt-1 flex items-center gap-1.5">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <Stars />
              </div>
            </div>
            <VerifiedBadge />
          </div>
          <ServiceBadges />
          <InsuranceBadges />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">{phoneSvg}<span>(407) 555-0142</span></div>
            <div className="flex items-center text-gray-600">{globeSvg}<span className="truncate">Visit Website</span></div>
            <div className="flex items-start text-gray-600 sm:col-span-2">{mapPinSvg}<span>1234 Therapy Lane, Orlando, FL 32801</span></div>
          </div>
          <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-teal-600 text-teal-600">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BasicSearchCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full" style={{ border: "2px solid #d97706" }}>
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 shadow-sm">&#11088; Featured</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0 pr-24">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">Sunshine ABA & Behavioral Health</h4>
              <p className="text-sm text-gray-500 mt-0.5">Orange County</p>
              <div className="mt-1 flex items-center gap-1.5">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <Stars />
              </div>
            </div>
            <VerifiedBadge />
          </div>
          <ServiceBadges />
          <InsuranceBadges />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
            <div className="flex items-center text-gray-600">{globeSvg}Visit Website</div>
            <div className="flex items-start text-gray-600 sm:col-span-2">{mapPinSvg}1234 Therapy Lane, Orlando, FL 32801</div>
          </div>
          <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-teal-600 text-teal-600">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnhancedSearchCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full" style={{ border: "2px solid #d97706" }}>
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 shadow-sm">&#11088; Featured</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="w-full h-36 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            {cameraSvg("w-10 h-10 text-gray-400 mb-2")}
            <span className="text-sm font-semibold text-gray-400">Your Clinic Photo</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">Sunshine ABA & Behavioral Health</h4>
              <p className="text-sm text-gray-500 mt-0.5">Orange County</p>
              <div className="mt-1 flex items-center gap-1.5">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <Stars />
              </div>
            </div>
            <VerifiedBadge />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida.</p>
          <ServiceBadges />
          <InsuranceBadges />
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
            <div className="flex items-start text-gray-600">{mapPinSvg}1234 Therapy Lane, Orlando, FL 32801</div>
          </div>
          <SocialIcons />
          <a href="#" className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            Visit Website
          </a>
          <div className="flex justify-end pt-3 mt-1 border-t border-gray-100">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-teal-600 text-teal-600">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumSearchCard() {
  return (
    <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-full" style={{ border: "3px solid transparent", backgroundImage: "linear-gradient(to bottom, #fffbeb, #ffffff 40%, #fffbeb), linear-gradient(135deg, #f59e0b, #d97706, #b45309, #d97706, #f59e0b)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-100 text-amber-800 border border-amber-400 shadow-md">&#11088; Premium Partner</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-3">
          <div className="w-full h-44 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            {cameraSvg("w-12 h-12 text-gray-400 mb-2")}
            <span className="text-sm font-semibold text-gray-400">Your Clinic Photo</span>
            <span className="text-xs text-gray-300 mt-0.5">Large format — Premium only</span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-xl font-bold text-gray-900 leading-tight">Sunshine ABA & Behavioral Health</h4>
              <p className="text-sm text-gray-500 mt-0.5">Orange County</p>
              <div className="mt-1 flex items-center gap-1.5">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <Stars />
              </div>
            </div>
            <VerifiedBadge />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida. Our BCBAs design individualized treatment plans that empower families.</p>
          <ServiceBadges />
          <InsuranceBadges />
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
            <div className="flex items-start text-gray-600">{mapPinSvg}1234 Therapy Lane, Orlando, FL 32801</div>
            <div className="flex items-center text-gray-600">{emailSvg}info@sunshineaba.com</div>
          </div>
          <SocialIcons />
          <a href="#" className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            Visit Website
          </a>
          <div className="flex justify-end pt-3 mt-1 border-t border-gray-100">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-teal-600 text-teal-600">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: "Will this actually bring me a client?",
    a: "We can't promise a number, and we won't pretend to. What we can show you is that families are already arriving (the Google Search numbers are at the top of this page), and most of them are looking up a specific provider or school by name. Featured works on what happens next. Your listing is the one that stands out when they land on it, and your practice is listed first on our service + city pages. For most practices, one new client covers more than a full year of Featured, and billing is month to month, so you can cancel anytime.",
  },
  {
    q: "Where exactly do Featured listings appear first?",
    a: "On our service + city pages (for example, ADOS testing in Orlando) and in the main Find Providers results, Featured listings are shown above every standard listing. Premium is listed first, then Enhanced, then Basic. One exception: when a family filters by insurance, providers confirmed to accept that plan are grouped first, and Featured listings lead within each group.",
  },
  {
    q: "What do I need to provide?",
    a: "For Basic, nothing extra. We upgrade your existing listing. For Enhanced and Premium, we'll ask for a clinic photo or logo and the description you want families to read. We handle the rest, and your listing is upgraded within 48 hours.",
  },
  {
    q: "Can I change tiers or cancel?",
    a: "Yes. There's no long-term contract. You can change tiers or cancel at any time. If you upgrade during your Founding Partner period, you keep the discounted rate on your new tier.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqItems.map((item, i) => (
        <Collapsible key={i} open={openIndex === i} onOpenChange={(open) => setOpenIndex(open ? i : null)}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left bg-white rounded-lg border border-gray-200 px-6 py-4 hover:bg-gray-50 transition-colors group">
            <span className="text-base font-semibold text-gray-900 pr-4">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 pb-4 pt-2 text-gray-600 leading-relaxed">
            {item.a}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

// ─── Pricing Check SVG ─────────────────────────────────────────────────

const pricingCheck = (
  <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

// ─── Primary CTA ───────────────────────────────────────────────────────

function PrimaryCta({ onDark = false }: { onDark?: boolean }) {
  return (
    <button
      onClick={() => smoothScroll("pricing")}
      className={
        "inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-colors shadow-lg " +
        (onDark ? "bg-white text-teal-700 hover:bg-teal-50" : "bg-teal-600 text-white hover:bg-teal-700")
      }
    >
      Choose Your Featured Tier
    </button>
  );
}

// ─── "Get the details by email" form ───────────────────────────────────

function DetailsByEmailForm() {
  const [form, setForm] = useState({ name: "", practice: "", email: "", company: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("https://floridaautismservices.com/api/send-featured-inquiry-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          practice_name: form.practice,
          email: form.email,
          company: form.company,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-center text-gray-700 font-medium">
        Thanks. We'll email you the details shortly.
      </p>
    );
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        type="text"
        required
        placeholder="Your name"
        aria-label="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <input
        type="text"
        required
        placeholder="Practice name"
        aria-label="Practice name"
        value={form.practice}
        onChange={(e) => setForm({ ...form, practice: e.target.value })}
        className={inputClass}
      />
      <input
        type="email"
        required
        placeholder="Email"
        aria-label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass}
      />
      {/* Honeypot: hidden from people, filled by bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="hidden"
      />
      <div className="sm:col-span-3 text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-md border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Email me the details"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600 mt-3">
            That didn't go through. Please email info@floridaautismservices.com instead.
          </p>
        )}
      </div>
    </form>
  );
}


// ─── Main Page Component ───────────────────────────────────────────────

export default function FeaturedListings() {
  const stats = useSiteStats();
  const founderSlots = Math.max(0, parseInt(stats.founder_slots_remaining, 10) || 0);
  const founderActive = founderSlots > 0;
  const basicMonthlyKey = founderActive ? ("basic_monthly_founder" as const) : ("basic_monthly_standard" as const);
  const basicAnnualKey = founderActive ? ("basic_annual_founder" as const) : ("basic_annual_standard" as const);
  const basicMonthlyHref = isStripeLinkConfigured(basicMonthlyKey)
    ? getStripeLink(basicMonthlyKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Basic%20Featured";
  const basicAnnualHref = isStripeLinkConfigured(basicAnnualKey)
    ? getStripeLink(basicAnnualKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Basic%20Annual";
  const enhancedMonthlyKey = founderActive ? ("enhanced_monthly_founder" as const) : ("enhanced_monthly_standard" as const);
  const enhancedAnnualKey = founderActive ? ("enhanced_annual_founder" as const) : ("enhanced_annual_standard" as const);
  const premiumMonthlyKey = founderActive ? ("premium_monthly_founder" as const) : ("premium_monthly_standard" as const);
  const premiumAnnualKey = founderActive ? ("premium_annual_founder" as const) : ("premium_annual_standard" as const);
  const enhancedMonthlyHref = isStripeLinkConfigured(enhancedMonthlyKey)
    ? getStripeLink(enhancedMonthlyKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Enhanced%20Featured";
  const enhancedAnnualHref = isStripeLinkConfigured(enhancedAnnualKey)
    ? getStripeLink(enhancedAnnualKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Enhanced%20Annual";
  const premiumMonthlyHref = isStripeLinkConfigured(premiumMonthlyKey)
    ? getStripeLink(premiumMonthlyKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Premium%20Partner";
  const premiumAnnualHref = isStripeLinkConfigured(premiumAnnualKey)
    ? getStripeLink(premiumAnnualKey)
    : "mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Premium%20Annual";

  return (
    <div>
      {/* SECTION 1: Headline */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-100 mb-4">
            For Florida autism service providers
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            When Families Land on Your Listing, Make It the One They Act On
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-3xl mx-auto">
            Families are already finding provider listings in our directory. Featured makes yours stand out, and lists your practice first on our service + city pages.
          </p>
        </div>
      </section>

      {/* SECTION 2: Proof */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Families Are Already Here</h2>
          <p className="text-gray-500 mb-8 text-base">
            Most of our traffic is families searching for a specific provider or school by name.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600">{stats.featured_impressions_3mo}</div>
              <div className="text-sm text-gray-500 mt-2">Search Impressions &bull; 3 Months</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600">{stats.featured_clicks_3mo}</div>
              <div className="text-sm text-gray-500 mt-2">Clicks from Google Search &bull; 3 Months</div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600">{stats.hero_providers_count}</div>
              <div className="text-sm text-gray-500 mt-2">Providers Listed</div>
            </div>
          </div>
          <p className="text-gray-600 mt-6">
            That's about <strong className="text-gray-900">{stats.featured_impressions_per_month} impressions</strong> and{" "}
            <strong className="text-gray-900">{stats.featured_clicks_per_month} clicks</strong> every month.
          </p>
          <p className="text-xs text-gray-400 mt-2">Source: Google Search Console &bull; last 3 months</p>
          <div className="mt-10">
            <PrimaryCta />
          </div>
        </div>
      </section>

      {/* SECTION 3: What you get */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">The listing families act on</h3>
              <p className="text-gray-600">
                A gold border and Featured badge set your listing apart, in search results and on your own page. Enhanced and Premium add your photo or logo, your description, and a prominent "Visit Website" button right on the search card.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">First on service + city pages</h3>
              <p className="text-gray-600">
                Featured providers are listed first on pages like ADOS testing in Orlando, ahead of every standard listing.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">First in provider search</h3>
              <p className="text-gray-600">
                The same order holds when families browse the main Find Providers results: Premium first, then Enhanced, then Basic, then everyone else.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mt-16 mb-3">How Your Listing Looks in Search Results</h3>
          <p className="text-gray-500 text-center mb-10">Same provider, four levels.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-bold text-gray-500 text-center mb-3">Standard — Free</p>
              <StandardSearchCard />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Basic — $29/mo</p>
              <BasicSearchCard />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Enhanced — $59/mo</p>
              <EnhancedSearchCard />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 text-center mb-3">&#11088; Premium — $99/mo</p>
              <PremiumSearchCard />
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 8: Pricing */}
      <section id="pricing" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{founderActive ? 'Founding Partner Pricing' : 'Featured Listing Pricing'}</h2>
            {founderActive && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-sm mb-4">
                &#128640; Founding Partner — {founderSlots} of 10 Spots Left
              </div>
            )}
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {founderActive
                ? "Be one of the first featured providers on FloridaAutismServices.com and lock in half-price rates before they're gone."
                : 'Feature your practice on FloridaAutismServices.com and get seen by the families searching for you.'}
            </p>
            <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
              Pricing is per location. Multi-location practices receive volume discounts (<a href="#multi-location" className="text-teal-600 underline hover:text-teal-700">see below</a>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basic Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Stand out from the crowd</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{founderActive ? '$15' : '$29'}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  {founderActive && (
                    <div className="text-sm text-gray-400 mt-1">
                      <span className="line-through">$29/mo</span>
                      <span className="ml-2 text-green-600 font-semibold">Save 48%</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Gold border and <strong>&#11088; Featured</strong> badge on search card <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Listed <strong>above all standard listings</strong> on service + city pages and in provider search</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Social media links</strong> on your detail page</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href={basicMonthlyHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>

            {/* Enhanced (highlighted) */}
            <div className="bg-white rounded-xl border-2 border-teal-500 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden flex flex-col relative">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2">
                Recommended
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enhanced Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Maximum impact per dollar</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{founderActive ? '$30' : '$59'}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  {founderActive && (
                    <div className="text-sm text-gray-400 mt-1">
                      <span className="line-through">$59/mo</span>
                      <span className="ml-2 text-green-600 font-semibold">Save 49%</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Everything in Basic, <strong>plus:</strong></span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Logo or photo</strong> on your search card <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Your <strong>description shown on the search card</strong></span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Prominent <strong>"Visit Website"</strong> button on the search card</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Social media links</strong> on the search card</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Listed <strong>ahead of Basic</strong> listings</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href={enhancedMonthlyHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Partner</h3>
                <p className="text-gray-500 text-sm mb-6">The full showcase experience</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{founderActive ? '$50' : '$99'}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  {founderActive && (
                    <div className="text-sm text-gray-400 mt-1">
                      <span className="line-through">$99/mo</span>
                      <span className="ml-2 text-green-600 font-semibold">Save 49%</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Everything in Enhanced, <strong>plus:</strong></span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Larger photo</strong> on search card <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>&#11088; Premium Partner</strong> badge + gold gradient border</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Full description</strong> on the search card, not shortened</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Listed <strong>first</strong>, ahead of every other tier</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href={premiumMonthlyHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            {founderActive
              ? 'Founding Partner rates are locked in for 12 months. After that, standard pricing applies. Cancel anytime.'
              : 'Cancel anytime.'}
          </p>

          {/* Multi-Location Volume Discounts */}
          <div id="multi-location" className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-8 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">Multi-Location Volume Discounts</h3>
              <p className="text-gray-500 text-center mb-8">Multiple locations? The more you list, the more you save. Each location gets priority placement in their local search results.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-teal-200 p-5 text-center">
                  <div className="text-2xl font-extrabold text-teal-700 mb-1">10% off</div>
                  <div className="text-sm text-gray-600">per location</div>
                  <div className="mt-3 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full px-3 py-1 inline-block">2–3 locations</div>
                </div>
                <div className="bg-white rounded-lg border border-teal-200 p-5 text-center">
                  <div className="text-2xl font-extrabold text-teal-700 mb-1">20% off</div>
                  <div className="text-sm text-gray-600">per location</div>
                  <div className="mt-3 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full px-3 py-1 inline-block">4–6 locations</div>
                </div>
                <div className="bg-white rounded-lg border border-teal-200 p-5 text-center">
                  <div className="text-2xl font-extrabold text-teal-700 mb-1">25% off</div>
                  <div className="text-sm text-gray-600">per location</div>
                  <div className="mt-3 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full px-3 py-1 inline-block">7+ locations</div>
                </div>
              </div>

              {/* Example calculation */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg mx-auto">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Example: 7 Locations at Basic Featured</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Regular price</span>
                    <span className="text-gray-400 line-through">$29/location × 7 = $203/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>With 25% volume discount</span>
                    <span className="font-medium text-gray-700">$152/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="font-semibold text-teal-700">With Founding Partner 50% off</span>
                    <span className="font-bold text-teal-700 text-base">$76/mo</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">That's just $10.86/location/month for priority placement across 7 service areas.</p>
              </div>

              <div className="text-center mt-8">
                <a
                  href="mailto:contact@floridaautismservices.com?subject=Multi-Location%20Featured%20Listing%20Inquiry"
                  className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md"
                >
                  Get Multi-Location Pricing →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Billing Discount */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-green-100 text-green-700 text-lg sm:text-2xl lg:text-3xl font-extrabold mb-6 shadow-sm">15% Annual Billing Discount</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Save 15% with Annual Billing</h2>
            <p className="text-gray-500 text-lg">Pay annually and save 15% across all tiers. Same features, lower cost.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Annual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basic Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>
                {founderActive && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                    <div className="text-3xl font-extrabold text-gray-900">$153<span className="text-base font-medium text-gray-500">/year</span></div>
                    <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$12.75/mo</span></div>
                    <div className="text-sm text-gray-400 mt-1 line-through">$15/mo billed monthly</div>
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $27/year</div>
                  </div>
                )}
                <div className={founderActive ? "border-t border-gray-100 pt-5" : ""}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$296<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$24.65/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$29/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $52/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href={basicAnnualHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>

            {/* Enhanced Annual */}
            <div className="bg-white rounded-xl border-2 border-teal-500 shadow-xl overflow-hidden flex flex-col relative">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2">
                Best Value
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enhanced Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>
                {founderActive && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                    <div className="text-3xl font-extrabold text-gray-900">$306<span className="text-base font-medium text-gray-500">/year</span></div>
                    <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$25.50/mo</span></div>
                    <div className="text-sm text-gray-400 mt-1 line-through">$30/mo billed monthly</div>
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $54/year</div>
                  </div>
                )}
                <div className={founderActive ? "border-t border-gray-100 pt-5" : ""}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$602<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$50.15/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$59/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $106/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href={enhancedAnnualHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>

            {/* Premium Annual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Partner</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>
                {founderActive && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                    <div className="text-3xl font-extrabold text-gray-900">$510<span className="text-base font-medium text-gray-500">/year</span></div>
                    <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$42.50/mo</span></div>
                    <div className="text-sm text-gray-400 mt-1 line-through">$50/mo billed monthly</div>
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $90/year</div>
                  </div>
                )}
                <div className={founderActive ? "border-t border-gray-100 pt-5" : ""}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$1,010<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$84.15/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$99/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $178/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href={premiumAnnualHref} className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  {founderActive ? 'Lock In This Rate' : 'Get Started'}
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">
            {founderActive
              ? 'Annual billing is paid upfront. Founding Partner annual rates are locked in for the first year.'
              : 'Annual billing is paid upfront.'}
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">What's Included at Each Tier</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">What each tier actually changes on your listing</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Basic</th>
                  <th className="text-center py-3 px-4 text-teal-700 font-bold bg-teal-50 rounded-t-lg">Enhanced</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Gold border & badge", free: false, basic: "Featured", enhanced: "Featured", premium: "Premium Partner" },
                  { feature: "Position on service + city pages and in provider search", free: "After Featured", basic: "Above standard", enhanced: "Above Basic", premium: "First" },
                  { feature: "Photo or logo on search card and detail page", free: false, basic: false, enhanced: true, premium: "Larger" },
                  { feature: "Description length (listing page)", free: "200 characters", basic: "500", enhanced: "1,000", premium: "Unlimited" },
                  { feature: "Description shown on search card", free: false, basic: false, enhanced: "3 lines", premium: "Full" },
                  { feature: 'Prominent "Visit Website" button on search card', free: false, basic: false, enhanced: true, premium: true },
                  { feature: "Social media links", free: false, basic: "Detail page", enhanced: "Card and detail page", premium: "Card and detail page" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.free === 'string' ? <span className="font-semibold text-gray-500">{row.free}</span> : row.free ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">&mdash;</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.basic === 'string' ? <span className="font-semibold text-gray-700">{row.basic}</span> : row.basic ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">&mdash;</span>}
                    </td>
                    <td className="py-3 px-4 text-center bg-teal-50/50">
                      {typeof row.enhanced === 'string' ? <span className="font-semibold text-teal-700">{row.enhanced}</span> : row.enhanced ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">&mdash;</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.premium === 'string' ? <span className="font-bold text-teal-700">{row.premium}</span> : row.premium ? <Check className="w-5 h-5 text-teal-600 mx-auto" /> : <span className="text-gray-300">&mdash;</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA after tiers */}
      <section className="bg-white pb-20 px-4">
        <div className="text-center">
          <PrimaryCta />
        </div>
      </section>

      {/* ROI line */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug">
            For most practices, one new client found through the directory covers more than a full year of Featured.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Questions Providers Ask
          </h2>
          <FAQSection />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
            {founderActive
              ? `${founderSlots} Founding Partner Spots Left at Half Price`
              : 'Make Your Listing the One Families Act On'}
          </h2>
          <p className="text-lg text-teal-50 mb-10">
            Pick a tier and check out in a couple of minutes. Your listing is upgraded within 48 hours.
          </p>
          <PrimaryCta onDark />
        </div>
      </section>

      {/* Not ready yet */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-base font-semibold text-gray-800 text-center mb-4">
            Not ready yet? Get the details by email
          </h2>
          <DetailsByEmailForm />
        </div>
      </section>
    </div>
  );
}
