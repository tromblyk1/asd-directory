import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, Church as ChurchIcon, Clock } from 'lucide-react';
import { Church } from '../lib/supabase';
import { HoverBubble } from './HoverBubble';

type ChurchCardProps = {
  church: Church;
};

export const ChurchCard: React.FC<ChurchCardProps> = ({ church }) => {
  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <ChurchIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {church.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>{church.city}, {church.county} County</span>
          </div>
          {church.denomination && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
              {church.denomination}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
        {church.description}
      </p>

      {church.programs?.length ? (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1">
            <span>Programs for ASD</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {church.programs.map((program) => (
              <span
                key={program}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              >
                {program}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {church.features?.length ? (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Features</h4>
          <div className="flex flex-wrap gap-2">
            {church.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-1">
                <span className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded">
                  {feature}
                </span>
                <HoverBubble
                  content={
                    feature.includes('Sensory')
                      ? 'Accommodations for sensory sensitivities'
                      : feature.includes('Quiet')
                      ? 'Dedicated quiet space available'
                      : 'Specially designed for individuals with autism'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {church.service_times && (
        <div className="flex items-start space-x-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="w-4 h-4 mt-0.5" />
          <span>{church.service_times}</span>
        </div>
      )}

      <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm">
        {church.phone && (
          <a
            href={`tel:${church.phone}`}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label={`Call ${church.name}`}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {church.email && (
          <a
            href={`mailto:${church.email}`}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label={`Email ${church.name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {church.website && (
          <a
            href={church.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            aria-label={`Visit ${church.name} website`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};