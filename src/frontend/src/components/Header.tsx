import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Volume2, VolumeX, Heart } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { DonateModal } from './DonateModal';
import logoImage from '../assets/images/logo-rainbow-small.png';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const { darkMode, lowSensoryMode, toggleDarkMode, toggleLowSensoryMode } = useAccessibility();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'providers', label: 'Find Providers' },
    { id: 'churches', label: 'Faith-Based Support' },
    { id: 'resources', label: 'Resources' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-slate-900/95 backdrop-blur-sm border-b border-blue-100/50 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group transition-colors"
            aria-label="Go to homepage"
          >
            <img
              src={logoImage}
              alt="Florida Autism Services - connecting families to autism services"
              className="h-[50px] max-h-[50px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-lg font-semibold leading-tight text-slate-800 dark:text-slate-100">Florida Autism Services</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Connecting families to support</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === item.id
                    ? 'bg-teal-100/60 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('donate')}
              className="hidden md:flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Support our mission"
            >
              <Heart className="w-4 h-4" />
              <span>Support</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleLowSensoryMode}
              className="p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
              aria-label={lowSensoryMode ? 'Disable low sensory mode' : 'Enable low sensory mode'}
            >
              {lowSensoryMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-100/50 dark:border-slate-800 bg-white dark:bg-slate-900">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${currentPage === item.id
                    ? 'bg-teal-100/60 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setDonateModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg"
            >
              <Heart className="w-4 h-4" />
              <span>Support Our Mission</span>
            </button>
          </nav>
        </div>
      )}

      <DonateModal isOpen={donateModalOpen} onClose={() => setDonateModalOpen(false)} />
    </header>
  );
};
