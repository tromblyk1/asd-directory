import { useState } from "react";
import { ChevronDown, ArrowUp, Eye, Shield, Check } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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

const WhyChooseUs = () => (
  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
    <h4 className="text-sm font-bold text-teal-800 mb-2 flex items-center gap-1.5">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Why Choose Us
    </h4>
    <ul className="text-sm text-teal-700 space-y-1.5">
      <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">&bull;</span> Board-certified BCBAs with 10+ years of experience</li>
      <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">&bull;</span> In-clinic, in-home, and telehealth options</li>
      <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">&bull;</span> Family-centered approach with free parent training workshops</li>
    </ul>
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

// ─── Detail Page Cards ─────────────────────────────────────────────────

function StandardDetailCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-5">
        <h4 className="text-xl font-bold">Sunshine ABA & Behavioral Health</h4>
        <p className="text-teal-100 text-sm mt-1">1234 Therapy Lane, Orlando, FL 32801 &bull; Orange County</p>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <VerifiedBadge />
          <div className="flex items-center gap-1">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {starSvg}
            <span className="text-sm text-gray-600 font-medium">4.0</span>
            <span className="text-xs text-gray-400">(47 reviews)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida.</p>
        <ServiceBadges />
        <div className="mt-3"><InsuranceBadges /></div>
        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
          <div className="flex items-center text-gray-600">{globeSvg}Visit Website</div>
        </div>
      </div>
    </div>
  );
}

function BasicDetailCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full" style={{ border: "2px solid #d97706" }}>
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-5 relative">
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 shadow-sm">&#11088; Featured</span>
        </div>
        <h4 className="text-xl font-bold">Sunshine ABA & Behavioral Health</h4>
        <p className="text-teal-100 text-sm mt-1">1234 Therapy Lane, Orlando, FL 32801 &bull; Orange County</p>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <VerifiedBadge />
          <div className="flex items-center gap-1">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {starSvg}
            <span className="text-sm text-gray-600 font-medium">4.0</span>
            <span className="text-xs text-gray-400">(47 reviews)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida.</p>
        <ServiceBadges />
        <div className="mt-3"><InsuranceBadges /></div>
        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
          <div className="flex items-center text-gray-600">{globeSvg}Visit Website</div>
        </div>
      </div>
    </div>
  );
}

function EnhancedDetailCard() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full" style={{ border: "2px solid #d97706" }}>
      <div className="relative">
        <div className="w-full h-48 bg-gray-100 border-b-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
          {cameraSvg("w-12 h-12 text-gray-400 mb-2")}
          <span className="text-base font-semibold text-gray-400">Your Clinic Photo or Logo</span>
          <span className="text-xs text-gray-300 mt-1">Displayed prominently at the top of your page</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 shadow-sm">&#11088; Featured</span>
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-1">Sunshine ABA & Behavioral Health</h4>
        <p className="text-sm text-gray-500 mb-3">1234 Therapy Lane, Orlando, FL 32801 &bull; Orange County</p>
        <div className="flex items-center gap-2 mb-4">
          <VerifiedBadge />
          <div className="flex items-center gap-1">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {starSvg}
            <span className="text-sm text-gray-600 font-medium">4.0</span>
            <span className="text-xs text-gray-400">(47 reviews)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida. Our board-certified BCBAs design individualized treatment plans.</p>
        <WhyChooseUs />
        <ServiceBadges />
        <div className="mt-3"><InsuranceBadges /></div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4 mt-4 mb-4">
          <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
          <div className="flex items-center text-gray-600">{emailSvg}info@sunshineaba.com</div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Follow Us</span>
          <SocialIcons />
        </div>
        <a href="#" className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          Visit Website
        </a>
      </div>
    </div>
  );
}

function PremiumDetailCard() {
  return (
    <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-full" style={{ border: "3px solid transparent", backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #f59e0b, #d97706, #b45309, #d97706, #f59e0b)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
      <div className="relative">
        <div className="w-full h-56 bg-gray-100 border-b flex flex-col items-center justify-center">
          {cameraSvg("w-14 h-14 text-gray-400 mb-2")}
          <span className="text-base font-semibold text-gray-400">Your Clinic Photo or Logo</span>
          <span className="text-xs text-gray-300 mt-1">Full-width hero showcase — Premium only</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-100 text-amber-800 border border-amber-400 shadow-md">&#11088; Premium Partner</span>
        </div>
      </div>
      <div className="p-6" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 40%, #fffbeb 100%)" }}>
        <h4 className="text-2xl font-bold text-gray-900 mb-1">Sunshine ABA & Behavioral Health</h4>
        <p className="text-sm text-gray-500 mb-3">1234 Therapy Lane, Orlando, FL 32801 &bull; Orange County</p>
        <div className="flex items-center gap-2 mb-4">
          <VerifiedBadge />
          <div className="flex items-center gap-1">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {starSvg}
            <span className="text-sm text-gray-600 font-medium">4.0</span>
            <span className="text-xs text-gray-400">(47 reviews)</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">Sunshine ABA & Behavioral Health provides compassionate, evidence-based ABA therapy for children and teens on the autism spectrum across Central Florida. Our board-certified BCBAs design individualized treatment plans that empower families.</p>
        <WhyChooseUs />
        <ServiceBadges />
        <div className="mt-3"><InsuranceBadges /></div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4 mt-4 mb-4">
          <div className="flex items-center text-gray-600">{phoneSvg}(407) 555-0142</div>
          <div className="flex items-center text-gray-600">{emailSvg}info@sunshineaba.com</div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Follow Us</span>
          <SocialIcons />
        </div>
        <a href="#" className="inline-flex items-center justify-center w-full px-4 py-3 text-base font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          Visit Website
        </a>
      </div>
    </div>
  );
}

// ─── Search Position Visual ────────────────────────────────────────────

const positionData = [
  {
    key: "standard",
    label: "Standard",
    description: "Your listing appears in standard order based on relevance",
    bars: [
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-gray-200", w: "w-11/12" },
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-teal-200 border border-teal-300", w: "w-11/12", you: true },
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-gray-200", w: "w-10/12" },
    ],
  },
  {
    key: "basic",
    label: "Basic",
    description: "Your listing appears above all standard listings",
    bars: [
      { cls: "bg-gradient-to-r from-amber-200 to-yellow-100 border border-amber-300 opacity-50", w: "w-full" },
      { cls: "bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 opacity-50", w: "w-11/12" },
      { cls: "bg-amber-100 border border-amber-300", w: "w-full", you: true },
      { cls: "bg-gray-200", w: "w-11/12" },
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-gray-200", w: "w-10/12" },
    ],
  },
  {
    key: "enhanced",
    label: "Enhanced",
    description: "Your listing appears above Basic and Standard listings",
    bars: [
      { cls: "bg-gradient-to-r from-amber-200 to-yellow-100 border border-amber-300 opacity-50", w: "w-full" },
      { cls: "bg-amber-100 border border-amber-300", w: "w-full", you: true },
      { cls: "bg-amber-50 border border-amber-200 opacity-50", w: "w-11/12" },
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-gray-200", w: "w-11/12" },
      { cls: "bg-gray-200", w: "w-10/12" },
    ],
  },
  {
    key: "premium",
    label: "Premium",
    description: "Your listing is pinned to the top of all search results",
    bars: [
      { cls: "bg-gradient-to-r from-amber-300 to-yellow-200 border border-amber-400 shadow-sm", w: "w-full", you: true, youLabel: "You (#1)" },
      { cls: "bg-amber-100 border border-amber-200 opacity-50", w: "w-11/12" },
      { cls: "bg-amber-50 border border-amber-200 opacity-40", w: "w-full" },
      { cls: "bg-gray-200", w: "w-11/12" },
      { cls: "bg-gray-200", w: "w-full" },
      { cls: "bg-gray-200", w: "w-10/12" },
    ],
  },
];

function SearchPositionVisual() {
  const [active, setActive] = useState("standard");
  const data = positionData.find((d) => d.key === active)!;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-center gap-2 mb-6">
        {positionData.map((d) => (
          <button
            key={d.key}
            onClick={() => setActive(d.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              active === d.key
                ? "bg-teal-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="space-y-2">
          {data.bars.map((bar, i) => (
            <div key={i} className={`h-4 rounded-full ${bar.w} ${bar.cls} relative transition-all duration-300`}>
              {bar.you && (
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-xs font-bold text-amber-700 whitespace-nowrap ml-2">
                  &larr; {bar.youLabel || "You"}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">{data.description}</p>
      </div>
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: "How does Featured placement work?",
    a: "When families search for providers on FloridaAutismServices.com, Featured listings appear above standard results. Premium Partners are pinned to the very top, followed by Enhanced, then Basic. Within each tier, listings are ordered by relevance to the search.",
  },
  {
    q: "What do I need to provide?",
    a: "For Basic, nothing extra — we enhance your existing listing. For Enhanced and Premium, we'll ask for a clinic photo or logo and a short 'Why Choose Us' description (2-3 sentences). We handle the rest.",
  },
  {
    q: "Can I upgrade or downgrade my tier?",
    a: "Yes. You can change tiers at any time. If you upgrade during your Founding Partner period, you keep the discounted rate on your new tier.",
  },
  {
    q: "How is this different from Google Ads?",
    a: "Google Ads charges you per click and competes with every healthcare provider in your area. Featured Listings give you persistent, always-on visibility specifically to parents searching for autism services in Florida — for a flat monthly rate.",
  },
  {
    q: "What if I'm not happy with the results?",
    a: "There's no long-term contract. You can cancel anytime. We're confident the visibility speaks for itself, which is why we offer month-to-month billing.",
  },
  {
    q: "How do I get started?",
    a: "Just click any 'Lock In This Rate' button or email us at contact@floridaautismservices.com. We'll have your listing upgraded within 48 hours.",
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

// ─── Main Page Component ───────────────────────────────────────────────

export default function FeaturedListings() {
  return (
    <div>
      {/* SECTION 1: Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Get Found First by Florida Autism Families
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-3xl mx-auto mb-10">
            Featured listings put your practice at the top of search results on Florida's largest autism resource directory — so the families who need you can actually find you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 mb-10">
            <div className="px-6 sm:border-r sm:border-white/30">
              <p className="text-2xl font-bold">3,300+</p>
              <p className="text-teal-100 text-sm">Providers Listed</p>
            </div>
            <div className="px-6 sm:border-r sm:border-white/30">
              <p className="text-2xl font-bold">30%+</p>
              <p className="text-teal-100 text-sm">Growing Monthly</p>
            </div>
            <div className="px-6">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-teal-100 text-sm">Autism-Focused Traffic</p>
            </div>
          </div>
          <button
            onClick={() => smoothScroll("pricing")}
            className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
          >
            See Featured Listing Options &darr;
          </button>
        </div>
      </section>

      {/* SECTION 2: The Problem */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            You're Listed. But Are You Being Found?
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-6">
            <p>
              Right now, your practice is one of over 3,300 providers in our directory. When a parent in your county searches for ABA therapy, they see a long list of results. They click the first few. Maybe the first five. Then they pick up the phone.
            </p>
            <p className="font-semibold text-gray-800">
              The question is: are you in those first five?
            </p>
          </div>
        </div>
      </section>

      {/* Growth Chart — moved above pricing for urgency */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Growth Speaks for Itself</h2>
          <p className="text-gray-500 mb-8 text-base max-w-2xl mx-auto">Real data from Google Search Console — families are finding us, and the numbers are accelerating every month.</p>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Monthly Search Impressions</h3>
            <svg viewBox="0 0 500 260" className="w-full" aria-label="Growth chart showing monthly search impressions from October 2025 to February 2026">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="60" y1={40 + i * 45} x2="470" y2={40 + i * 45} stroke="#e5e7eb" strokeWidth="1" />
              ))}
              <text x="55" y="44" textAnchor="end" className="text-[11px]" fill="#9ca3af">80K</text>
              <text x="55" y="89" textAnchor="end" className="text-[11px]" fill="#9ca3af">60K</text>
              <text x="55" y="134" textAnchor="end" className="text-[11px]" fill="#9ca3af">40K</text>
              <text x="55" y="179" textAnchor="end" className="text-[11px]" fill="#9ca3af">20K</text>
              <text x="55" y="224" textAnchor="end" className="text-[11px]" fill="#9ca3af">0</text>
              <defs>
                <linearGradient id="featuredTealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d="M 162.5 219.5 L 265 216.6 L 367.5 118.8 L 470 40 L 470 220 L 162.5 220 Z" fill="url(#featuredTealGrad)" />
              <polyline points="60,219.9 162.5,219.5 265,216.6 367.5,118.8 470,40" fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {[[60, 219.9], [162.5, 219.5], [265, 216.6], [367.5, 118.8], [470, 40]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={i === 4 ? 6 : 4} fill={i === 4 ? "white" : "#14b8a6"} stroke="#14b8a6" strokeWidth="2" />
              ))}
              <text x="470" y="30" textAnchor="middle" fill="#0d9488" className="text-[11px]" fontWeight="600">Feb 2026</text>
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
            <p className="text-xs text-gray-400 mt-3 text-center">Source: Google Search Console — FloridaAutismServices.com</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Solution */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-14">
            Featured Listings Put You Where Families Look First
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                <ArrowUp className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Priority Placement</h3>
              <p className="text-gray-600">
                Your listing jumps above standard results. When families search for your services in your county, you're at the top — not buried on page two.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                <Eye className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Enhanced Visibility</h3>
              <p className="text-gray-600">
                Clinic photos, expanded descriptions, and a "Visit Website" button make your listing impossible to scroll past.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Premium Credibility</h3>
              <p className="text-gray-600">
                Featured and Premium Partner badges signal to families that you're an established, trusted provider.
              </p>
            </div>
          </div>
          <div className="text-center mt-14">
            <button
              onClick={() => smoothScroll("search-cards")}
              className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
            >
              See What Your Listing Could Look Like &darr;
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: Search Position Visual */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Where Featured Providers Appear in Search Results
          </h2>
          <p className="text-gray-500 text-lg text-center mb-10">Click each tier to see the difference.</p>
          <SearchPositionVisual />
        </div>
      </section>

      {/* SECTION 5: Search Result Cards */}
      <section id="search-cards" className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            How Your Listing Looks in Search Results
          </h2>
          <p className="text-gray-500 text-lg text-center mb-12">
            Same provider. Four visibility levels. See the difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-bold text-gray-500 text-center mb-3">Standard — Free</p>
              <div className="hover:-translate-y-1 transition-transform"><StandardSearchCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Basic — $29/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><BasicSearchCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Enhanced — $59/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><EnhancedSearchCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 text-center mb-3">&#11088; Premium — $99/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><PremiumSearchCard /></div>
            </div>
          </div>
          <div className="text-center mt-14">
            <button
              onClick={() => smoothScroll("pricing")}
              className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
            >
              Ready to Stand Out? See Pricing &darr;
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: Detail Page Cards */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            How Your Detail Page Looks to Families
          </h2>
          <p className="text-gray-500 text-lg text-center mb-12">
            When a parent clicks your listing, this is what they see.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-bold text-gray-500 text-center mb-3">Standard — Free</p>
              <div className="hover:-translate-y-1 transition-transform"><StandardDetailCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Basic — $29/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><BasicDetailCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 text-center mb-3">&#11088; Enhanced — $59/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><EnhancedDetailCard /></div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 text-center mb-3">&#11088; Premium — $99/mo</p>
              <div className="hover:-translate-y-1 transition-transform"><PremiumDetailCard /></div>
            </div>
          </div>
          <p className="text-center text-gray-500 italic mt-10 max-w-2xl mx-auto">
            Enhanced and Premium listings include clinic photos, a "Why Choose Us" section, and direct website links — everything a parent needs to choose you.
          </p>
        </div>
      </section>

      {/* SECTION 7: Why Now */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Our Traffic Is Growing. Your Opportunity Won't Last.
          </h2>
          <div className="text-gray-600 text-lg leading-relaxed space-y-6">
            <p>
              FloridaAutismServices.com traffic has grown over 300% in the last month alone. As more Florida families discover the directory, Featured Listings become more valuable — and more competitive.
            </p>
            <p>
              Right now, we're offering Founding Partner pricing to our first 10 providers. You lock in half-price rates for 6 months while the directory continues to grow around you.
            </p>
            <p className="font-semibold text-gray-800">
              Once the 10 spots are filled, this pricing is gone.
            </p>
          </div>
          <div className="mt-10">
            <button
              onClick={() => smoothScroll("pricing")}
              className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md"
            >
              Lock In Founding Partner Pricing &darr;
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: Pricing */}
      <section id="pricing" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Founding Partner Pricing</h2>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-sm mb-4">
              &#128640; Founding Partner — First 10 Providers Only
            </div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Be one of the first featured providers on FloridaAutismServices.com and lock in half-price rates before they're gone.
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
                    <span className="text-3xl font-extrabold text-gray-900">$15</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    <span className="line-through">$29/mo</span>
                    <span className="ml-2 text-green-600 font-semibold">Save 48%</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Gold border and <strong>&#11088; Featured</strong> badge on search card <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Sorted <strong>above all standard results</strong> in search</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Priority visibility in county and service searches</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Up to <strong>500 character</strong> description</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Basic%20Featured" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  Lock In This Rate
                </a>
              </div>
            </div>

            {/* Enhanced (highlighted) */}
            <div className="bg-white rounded-xl border-2 border-teal-500 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden flex flex-col relative">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2">
                Most Popular
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enhanced Featured</h3>
                <p className="text-gray-500 text-sm mb-6">Maximum impact per dollar</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">$30</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    <span className="line-through">$59/mo</span>
                    <span className="ml-2 text-green-600 font-semibold">Save 49%</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Everything in Basic, <strong>plus:</strong></span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Logo or photo</strong> on your search card <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>"Why Choose Us"</strong> highlighted section on your detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Prominent <strong>"Visit Website"</strong> button driving direct traffic</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Social media links</strong> (Facebook, Instagram, etc.)</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Up to <strong>1,000 character</strong> description</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Enhanced%20Featured" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md">
                  Lock In This Rate
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
                    <span className="text-3xl font-extrabold text-gray-900">$50</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    <span className="line-through">$99/mo</span>
                    <span className="ml-2 text-green-600 font-semibold">Save 49%</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">{pricingCheck}<span>Everything in Enhanced, <strong>plus:</strong></span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Full photo showcase</strong> on search results <em>and</em> detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Pinned to #1</strong> in all search results</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>&#11088; Premium Partner</strong> badge + gold gradient border</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Video testimonials</strong> on detail page</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span><strong>Unlimited</strong> description length</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Priority support</span></li>
                  <li className="flex items-start gap-2">{pricingCheck}<span>Custom branding options</span></li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Premium%20Partner" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  Lock In This Rate
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Founding Partner rates are locked in for 6 months. After that, standard pricing applies. Cancel anytime.
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
                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                  <div className="text-3xl font-extrabold text-gray-900">$153<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$12.75/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$15/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $27/year</div>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$296<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$24.65/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$29/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $52/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Basic%20Annual" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  Lock In This Rate
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
                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                  <div className="text-3xl font-extrabold text-gray-900">$306<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$25.50/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$30/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $54/year</div>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$602<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$50.15/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$59/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $106/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Enhanced%20Annual" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md">
                  Lock In This Rate
                </a>
              </div>
            </div>

            {/* Premium Annual */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Partner</h3>
                <p className="text-gray-500 text-sm mb-6">Annual billing</p>
                <div className="mb-6">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Founding Partner Rate</div>
                  <div className="text-3xl font-extrabold text-gray-900">$510<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$42.50/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$50/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $90/year</div>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Rate</div>
                  <div className="text-2xl font-extrabold text-gray-900">$1,010<span className="text-base font-medium text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500 mt-1">That's just <span className="font-semibold text-gray-700">$84.15/mo</span></div>
                  <div className="text-sm text-gray-400 mt-1 line-through">$99/mo billed monthly</div>
                  <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">Save $178/year</div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <a href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry%20-%20Premium%20Annual" className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors">
                  Lock In This Rate
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">
            Annual billing is paid upfront. Founding Partner annual rates are locked in for the first year.
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">What's Included at Each Tier</h2>
          <p className="text-gray-500 text-center mb-12 text-lg">Compare features across all Featured Listing tiers</p>

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
                  { feature: "County search visibility", free: true, basic: true, enhanced: true, premium: true },
                  { feature: "Search result position", free: "Alphabetical", basic: "#4-6", enhanced: "#2-3", premium: "#1" },
                  { feature: "Description limit", free: "250 chars", basic: "500 chars", enhanced: "1,000 chars", premium: "Unlimited" },
                  { feature: "Gold border & Featured badge", free: false, basic: true, enhanced: true, premium: true },
                  { feature: "Clinic photos on listings", free: false, basic: false, enhanced: true, premium: true },
                  { feature: '"Why Choose Us" section', free: false, basic: false, enhanced: true, premium: true },
                  { feature: '"Visit Website" button', free: false, basic: false, enhanced: true, premium: true },
                  { feature: "Social media links", free: false, basic: false, enhanced: true, premium: true },
                  { feature: "Pinned to #1", free: false, basic: false, enhanced: false, premium: true },
                  { feature: "Video testimonials", free: false, basic: false, enhanced: false, premium: true },
                  { feature: "Priority support", free: false, basic: false, enhanced: false, premium: true },
                  { feature: "Custom branding options", free: false, basic: false, enhanced: false, premium: true },
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

      {/* ROI Section */}
      <style>{`
        @keyframes featuredRoiGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(20,184,166,0.3), 0 0 80px rgba(20,184,166,0.15); }
          50% { box-shadow: 0 0 60px rgba(20,184,166,0.5), 0 0 120px rgba(20,184,166,0.3); }
        }
        @keyframes featuredRoiPulse {
          0%, 100% { text-shadow: 0 0 30px rgba(13,148,136,0.3); }
          50% { text-shadow: 0 0 60px rgba(13,148,136,0.5), 0 0 100px rgba(13,148,136,0.25); }
        }
        @keyframes featuredBadgeGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(34,211,238,0.2), 0 0 24px rgba(34,211,238,0.1); }
          50% { box-shadow: 0 0 24px rgba(34,211,238,0.4), 0 0 48px rgba(34,211,238,0.2); }
        }
      `}</style>
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[900px] h-[900px] rounded-full bg-teal-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-8 py-3 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-lg font-bold uppercase tracking-widest mb-12 backdrop-blur-sm" style={{ animation: 'featuredBadgeGlow 3s ease-in-out infinite' }}>
            <span className="mr-3 text-2xl">&#128202;</span>
            Backed by Research
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-8" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)' }}>What's the Real ROI?</h2>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
            Children with autism use PT, OT, and speech therapy at <span className="font-bold text-white">11&ndash;16&times; the rate</span> of non-ASD peers &mdash; and they stay in therapy for years, not weeks. Here's what peer-reviewed research says about the value of every new family that finds you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-20 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 mb-2">$10,279</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per child per year</div>
              <p className="text-sm text-gray-400 leading-relaxed">Average annual outpatient spending per child with treated ASD</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">AHRQ MEPS, 2025 &sup3;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cyan-400 mb-2">11&ndash;16&times;</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">higher utilization</div>
              <p className="text-sm text-gray-400 leading-relaxed">ASD children use PT, OT, and speech services at 11&ndash;16&times; the rate of non-ASD peers ages 3&ndash;9</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">Cummings et al., JADD 2016 &sup2;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 mb-2">$33</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per Google Ads lead</div>
              <p className="text-sm text-gray-400 leading-relaxed">Average cost per lead for healthcare on Google Ads &mdash; and that's just for the lead, not the patient</p>
              <span className="text-xs text-gray-500 mt-2 inline-block">LocaliQ Healthcare Benchmarks, 2026 &sup4;</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8 text-center hover:scale-[1.03] hover:border-white/25 transition-all duration-200">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400 mb-2">$15</div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-teal-300 uppercase mb-3">per month</div>
              <p className="text-sm text-gray-400 leading-relaxed">Your Founding Partner Featured Listing on FloridaAutismServices.com &mdash; running 24/7/365</p>
            </div>
          </div>

          <div className="relative mx-auto max-w-3xl rounded-2xl hover:scale-[1.02] transition-transform duration-300" style={{ animation: 'featuredRoiGlow 3s ease-in-out infinite' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-10 sm:p-12 lg:p-14 text-gray-900 text-center">
              <div className="text-[6rem] sm:text-[8rem] lg:text-[10rem] font-extrabold text-teal-600 leading-none mb-4" style={{ animation: 'featuredRoiPulse 4s ease-in-out infinite' }}>1&ndash;2</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">new families</div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                As few as <strong className="text-gray-900">1&ndash;2 new families</strong> finding your practice through FloridaAutismServices.com could potentially cover your <strong className="text-gray-900">entire Featured Listing investment</strong> for the full year &mdash; based on average outpatient therapy spending per ASD child.
              </p>
            </div>
          </div>

          <div className="mt-14 mx-auto max-w-3xl border-l-4 border-teal-400 bg-white/5 rounded-r-xl p-6 sm:p-8 text-left">
            <div className="text-xl sm:text-2xl font-bold text-white mb-3">That's not a typo.</div>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-3">
              The math works because pediatric ASD patients have exceptionally high lifetime value. At $10,279 per child per year in outpatient spending, even a single new family represents significant revenue &mdash; while your Founding Partner listing costs as little as $15/month. Compare that to $33 per <em>lead</em> on Google Ads, where you pay per click with no guaranteed conversion.
            </p>
            <p className="text-base sm:text-lg font-bold text-teal-400">
              Your Featured Listing works 24/7, 365&nbsp;days&nbsp;a&nbsp;year.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-4xl border-t border-white/10 pt-8 text-left">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sources &amp; Citations</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="block mb-1">&sup1; Cidav et al., <em>Journal of Autism and Developmental Disorders</em> (2013). Medicaid FFS claims analysis, 45,948 children with ASD. PMC4771520</span>
              <span className="block mb-1">&sup2; Cummings et al., <em>Journal of Autism and Developmental Disorders</em> (2016). 8,325 ASD cases vs 83,195 matched controls, five major health systems. PMC4747787</span>
              <span className="block mb-1">&sup3; AHRQ Medical Expenditure Panel Survey, Statistical Brief #565 (Monnet &amp; Zuvekas, 2025). National health expenditures for children with treated ASD, 2018&ndash;2022.</span>
              <span className="block mb-1">&sup4; LocaliQ Healthcare Search Advertising Benchmarks (2026). Aggregated U.S. healthcare search campaign data across 16 specialties.</span>
              <span className="block mb-1">Additional research: Florida Medicaid ASD therapy utilization (AHCA 2013), parent search behavior for autism services, therapy practice revenue impact of directory listings.</span>
              <span className="block">Full research briefs available at: perplexity_ltv_dr_report.md, patient_acquisition_cost_in_pediatric_therapy.md, multi-discipline_therapy_revenue_per_asd_child.md, therapy_practice_revenue_impact_of_directory-referral_listings.md, florida-specific_medicaid_therapy_utilization.md, parent_search_behavior_for_autism_services.md</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <FAQSection />
        </div>
      </section>

      {/* SECTION 10: Final CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
            10 Founding Partner Spots. Half-Price Rates. First Come, First Served.
          </h2>
          <p className="text-lg text-teal-50 mb-10">
            Join the first providers to get priority placement on Florida's largest autism resource directory.
          </p>
          <a
            href="mailto:contact@floridaautismservices.com?subject=Featured%20Listing%20Inquiry"
            className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg bg-white text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
          >
            Get Started — Email Us Today
          </a>
          <p className="text-teal-100 text-sm mt-6">
            Or email us directly at contact@floridaautismservices.com
          </p>
        </div>
      </section>
    </div>
  );
}
