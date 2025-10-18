import React from 'react';
import { X, Heart, DollarSign } from 'lucide-react';

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-t-2xl border-b border-amber-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Heart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Support Our Mission
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">Florida Autism Services is a free community resource.</strong>
              {' '}Your donations help us verify providers, maintain the site, expand our directory, and keep this resource accessible to all families navigating autism services in Florida.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Your Support Helps Us:</span>
            </h3>
            <ul className="space-y-3">
              {[
                'Verify and vet service providers for quality and legitimacy',
                'Maintain and improve the website infrastructure',
                'Expand the directory to reach more families',
                'Keep the site ad-free and accessible to everyone',
                'Develop new resources and educational content',
                'Provide timely updates on autism services and programs'
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="mt-1 p-1 bg-teal-100 dark:bg-teal-900/30 rounded">
                    <Heart className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Ways to Contribute
            </h3>
            <div className="space-y-3">
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => alert('PayPal integration coming soon! Thank you for your interest in supporting our mission.')}
              >
                Donate via PayPal
              </button>
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => alert('Stripe integration coming soon! Thank you for your interest in supporting our mission.')}
              >
                Donate via Credit Card
              </button>
            </div>
            <p className="text-xs text-center text-slate-500 dark:text-slate-500 pt-2">
              Secure payment processing • All donations support Florida families
            </p>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Questions about donations? <button onClick={onClose} className="text-teal-600 dark:text-teal-400 hover:underline">Contact us</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
