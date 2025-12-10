import React, { useState } from 'react';
import { Trophy, Award, Star, Heart, ExternalLink } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  businessName?: string;
  website?: string;
  tier: 'friend' | 'supporter' | 'advocate' | 'champion';
  amount: number;
  frequency: 'once' | 'monthly';
  joinDate: string;
}

export const HallOfSupportersSection: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'friend' | 'supporter' | 'advocate' | 'champion'>('champion');
  const [donors, setDonors] = useState<Donor[]>([]);

  const getTierName = (tier: string): string => {
    const names = { champion: 'Champion', advocate: 'Advocate', supporter: 'Supporter', friend: 'Friend' };
    return names[tier as keyof typeof names] || tier;
  };

  const filteredDonors = donors.filter((d) => d.tier === activeTier);

  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-4">Hall of Supporters</h2>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center mb-8">
        Thank you to our generous donors who make this work possible
      </p>

      <div className="flex justify-center gap-2 mb-6 sm:mb-8 flex-wrap">
        <button
          onClick={() => setActiveTier('champion')}
          className={
            activeTier === 'champion'
              ? 'px-4 py-2 sm:px-6 sm:py-3 bg-teal-500 text-white font-semibold rounded-lg'
              : 'px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
          }
        >
          Champions
        </button>
        <button
          onClick={() => setActiveTier('advocate')}
          className={
            activeTier === 'advocate'
              ? 'px-4 py-2 sm:px-6 sm:py-3 bg-teal-500 text-white font-semibold rounded-lg'
              : 'px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
          }
        >
          Advocates
        </button>
        <button
          onClick={() => setActiveTier('supporter')}
          className={
            activeTier === 'supporter'
              ? 'px-4 py-2 sm:px-6 sm:py-3 bg-teal-500 text-white font-semibold rounded-lg'
              : 'px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
          }
        >
          Supporters
        </button>
        <button
          onClick={() => setActiveTier('friend')}
          className={
            activeTier === 'friend'
              ? 'px-4 py-2 sm:px-6 sm:py-3 bg-teal-500 text-white font-semibold rounded-lg'
              : 'px-4 py-2 sm:px-6 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
          }
        >
          Friends
        </button>
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4">
            Be the first {getTierName(activeTier)}! Your support makes a difference.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
          >
            Donate Now
          </button>
        </div>
      )}

      {activeTier === 'champion' && filteredDonors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 shadow-lg rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-purple-200 dark:border-purple-800"
            >
              <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {donor.businessName || donor.name}
              </h3>
              {donor.website && (
                <a
                  href={donor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-400 text-sm font-medium hover:underline mb-2"
                >
                  Visit Website <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <div className="inline-block px-3 py-1 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full mb-2">
                Champion Supporter
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supporter since{' '}
                {new Date(donor.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTier === 'advocate' && filteredDonors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 shadow-md rounded-lg p-4 sm:p-6 border-2 border-orange-200 dark:border-orange-800"
            >
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                {donor.businessName || donor.name}
              </h3>
              {donor.website && (
                <a
                  href={donor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-orange-700 dark:text-orange-400 text-sm font-medium hover:underline mb-2"
                >
                  Visit Website <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <div className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-xs font-semibold rounded-full mb-2">
                Advocate Supporter
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supporter since{' '}
                {new Date(donor.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTier === 'supporter' && filteredDonors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/30 shadow rounded-lg p-3 sm:p-4 border border-teal-200 dark:border-teal-800"
            >
              <Star className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                {donor.businessName || donor.name}
              </h3>
              {donor.website && (
                <a
                  href={donor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 text-xs font-medium hover:underline mb-1"
                >
                  Visit Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <div className="inline-block px-2 py-1 bg-teal-200 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-semibold rounded-full mb-1">
                Supporter
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Since {new Date(donor.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTier === 'friend' && filteredDonors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
            >
              <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400 inline-block mr-2" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {donor.businessName || donor.name}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Since {new Date(donor.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-8">
        All donors listed have given permission to be publicly recognized. Anonymous donors are not shown here but are
        equally valued.
      </p>
    </section>
  );
};