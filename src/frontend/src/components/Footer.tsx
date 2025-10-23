import React, { useState } from 'react';
import { Mail, MapPin, Phone, Heart } from 'lucide-react';
import { DonateModal } from './DonateModal';
import logoImage from '../assets/images/logo-rainbow-small.png';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  return (
    <footer className="bg-gradient-to-br from-blue-50/20 to-teal-50/20 dark:bg-slate-900 border-t border-blue-100/50 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={logoImage}
                alt="Florida Autism Services - connecting families to autism services"
                className="h-[45px] max-h-[45px] w-auto object-contain"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-100">Florida Autism Services</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Connecting families to autism services and support across Florida.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('providers')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Find Providers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('churches')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Faith-Based Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Resources
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Submit a Provider
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDonateModalOpen(true)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors flex items-center space-x-1"
                >
                  <Heart className="w-4 h-4" />
                  <span>Support Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>floridaautismservices@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(321) 300-3447</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Serving all of Florida</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-100/50 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400 space-y-2 md:space-y-0">
            <p>&copy; {currentYear} Florida Autism Services. All rights reserved.</p>
            <div className="flex space-x-4">
              <button className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Accessibility
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">
            Disclaimer: This directory is provided for informational purposes. All listings are reviewed but not endorsed.
            Please verify credentials and services independently.
          </p>
        </div>
      </div>

      <DonateModal isOpen={donateModalOpen} onClose={() => setDonateModalOpen(false)} />
    </footer>
  );
};
