import React from 'react';
import { Server, Shield, MapPin, BookOpen } from 'lucide-react';

export const DonationImpactSection: React.FC = () => (
  <section className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-4">
      How Your Donation Helps
    </h2>
    <p className="text-center text-slate-600 dark:text-slate-400 mb-12">
      Every dollar makes a difference for families in need
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
          <Server className="w-10 h-10 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 mb-3">
          Technology & Infrastructure
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Maintaining secure servers, database management, and ensuring 99.9% uptime so families can access resources 24/7.
        </p>
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
          $2,500/month average cost
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
          <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 mb-3">
          Provider Verification
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Manually verifying credentials, licenses, and quality of service for every provider in our directory to ensure families find trustworthy care.
        </p>
        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
          40 hours/week verification work
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
          <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 mb-3">
          Database Expansion
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Researching and adding new providers across Florida, especially in underserved rural areas, to ensure comprehensive statewide coverage.
        </p>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          100+ new providers added monthly
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
          <BookOpen className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 mb-3">
          Educational Resources
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Creating guides, articles, and resources to help families navigate the complex world of autism services, insurance, and support options.
        </p>
        <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
          New resource published weekly
        </p>
      </div>
    </div>
  </section>
);
