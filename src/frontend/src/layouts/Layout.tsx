import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Heart, Home, Church, Calendar, BookOpen, FileText,
  Plus, DollarSign, Menu, X, Search, Phone, Mail, GraduationCap, Info, MessageSquare, School, CalendarPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Find Providers",
    url: "/providers",
    icon: Search,
  },
  {
    title: "Find Schools",
    url: "/schools",
    icon: School,
  },
  {
    title: "Faith Communities",
    url: createPageUrl("FaithResources"),
    icon: Church,
  },
  {
    title: "Educational Resources",
    url: "/resources",
    icon: GraduationCap,
  },
  {
    title: "Guides",
    url: "/guides",
    icon: FileText,
  },
  {
    title: "Stories & News",
    url: createPageUrl("Blog"),
    icon: BookOpen,
  },
  {
    title: "Events Calendar",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "Submit Resource",
    url: "/submit",
    icon: Plus,
  },
  {
    title: "Submit Event",
    url: "/submit-event",
    icon: CalendarPlus,
  },
  {
    title: "Donate",
    url: createPageUrl("Donate"),
    icon: DollarSign,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-[1100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Left Side */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Florida Autism Services" 
                className="h-12 w-auto"
              />
              <div className="hidden xl:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Florida Autism Services</h1>
                <p className="text-xs text-gray-600">Your guide to neurodivergent-friendly resources</p>
              </div>
            </Link>
            
            {/* Navigation - Right Side */}
            <nav className="flex flex-wrap items-center justify-end gap-1.5">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    location.pathname === item.url
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-blue-100 sticky top-0 z-[1100] shadow-sm">
        <div className="px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Florida Autism Services" 
                className="h-9 sm:h-10 w-auto"
              />
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">FL Autism Services</h1>
              </div>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-blue-100 bg-white max-h-[calc(100vh-60px)] overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 border-b border-blue-50 active:bg-blue-50 ${
                  location.pathname === item.url
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-green-900 text-white mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Florida Autism Services" 
                  className="h-8 sm:h-10 w-auto"
                />
                <h3 className="text-lg sm:text-xl font-bold">Florida Autism Services</h3>
              </div>
              <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                Connecting Florida's neurodivergent community with resources, support, and understanding.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li><Link to="/providers" className="text-blue-100 hover:text-white transition-colors">Find Providers</Link></li>
                <li><Link to="/schools" className="text-blue-100 hover:text-white transition-colors">Find Schools</Link></li>
                <li><Link to={createPageUrl("FaithResources")} className="text-blue-100 hover:text-white transition-colors">Faith Communities</Link></li>
                <li><Link to="/resources" className="text-blue-100 hover:text-white transition-colors">Educational Resources</Link></li>
                <li><Link to="/guides" className="text-blue-100 hover:text-white transition-colors">Guides</Link></li>
                <li><Link to={createPageUrl("Events")} className="text-blue-100 hover:text-white transition-colors">Events</Link></li>
                <li><Link to={createPageUrl("Blog")} className="text-blue-100 hover:text-white transition-colors">Stories & News</Link></li>
                <li><Link to="/about" className="text-blue-100 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Get Involved</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li><Link to={createPageUrl("Donate")} className="text-blue-100 hover:text-white transition-colors">Support Our Mission</Link></li>
                <li><Link to="/submit" className="text-blue-100 hover:text-white transition-colors">Submit Resource</Link></li>
                <li><Link to="/submit-event" className="text-blue-100 hover:text-white transition-colors">Submit Event</Link></li>
                <li><Link to="/contact" className="text-blue-100 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/featured" className="text-blue-100 hover:text-white transition-colors">For Providers</Link></li>
              </ul>
              <div className="mt-4 sm:mt-6 space-y-2">
                <a href="tel:3213003447" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm sm:text-base">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>(321) 300-3447</span>
                </a>
                <a href="mailto:info@floridaautismservices.com" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm sm:text-base">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">info@floridaautismservices.com</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-6 sm:pt-8 text-center text-blue-100 text-sm sm:text-base">
            <p>&copy; 2025 Florida Autism Services. Built with love for the neurodivergent community.</p>
            <p className="mt-2 text-xs sm:text-sm">Celebrating neurodiversity across the Sunshine State</p>
          </div>
        </div>
      </footer>
    </div>
  );
}