import React from 'react';
import { CheckCircle, Mail, Heart, Home, Shield } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const DonateSuccessPage: React.FC<Props> = ({ onNavigate }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <section className="text-center space-y-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-3xl p-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Thank You for Your Donation!</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Your generosity helps Florida families find the autism services they need
        </p>
      </section>

      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400 text-lg mb-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>Your payment was processed securely through Stripe</span>
        </div>
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400 text-lg mb-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>A tax receipt has been sent to your email</span>
        </div>
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400 text-lg mb-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <span>Your donation is helping families right now</span>
        </div>
        {sessionId && (
          <p className="text-sm text-slate-500 dark:text-slate-500 text-center mt-4">Confirmation ID: {sessionId}</p>
        )}
      </div>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-8">What Happens Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <Mail className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">Check Your Email</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              You'll receive a detailed tax receipt within 5 minutes. Please save this for your records.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <Heart className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">Donor Recognition</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you opted in, your name will appear in our Hall of Supporters within 24 hours.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
            <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">Stay Connected</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              We'll send you quarterly updates showing how your donation is making a difference.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center">
        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 inline-block mr-2" />
        <span className="text-blue-800 dark:text-blue-300 text-sm">
          🔒 Your payment information was processed securely. We never see or store your credit card details.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate('home')}
          className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Homepage
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          View Our Impact
        </button>
      </div>
    </div>
  );
};
