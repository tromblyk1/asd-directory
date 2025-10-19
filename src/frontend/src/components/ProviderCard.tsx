import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { Provider } from '../lib/supabase';
import { HoverBubble } from './HoverBubble';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { StarRating } from './StarRating';
import { useProviderRating } from '../hooks/useProviderRatings';

type ProviderCardProps = {
  provider: Provider;
  onExpand?: () => void;
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onExpand }) => {
  const { lowSensoryMode } = useAccessibility();
  const { rating, loading: ratingLoading } = useProviderRating(provider.google_place_id || null);

  const normalizeServiceLabel = (value: string) =>
    value
      .split(/\s+/)
      .map((segment) =>
        segment.length > 0
          ? segment[0].toUpperCase() + segment.slice(1).toLowerCase()
          : segment
      )
      .join(' ');

  // Get all available services for this provider
  const getServices = () => {
    const services = new Set<string>();

    if (provider.service_type) {
      services.add(normalizeServiceLabel(provider.service_type));
    }

    if (Array.isArray(provider.service_types)) {
      provider.service_types
        .filter((label): label is string => typeof label === 'string' && label.trim().length > 0)
        .forEach((label) => services.add(normalizeServiceLabel(label)));
    }

    if (provider.aba) services.add('ABA Therapy');
    if (provider.speech) services.add('Speech Therapy');
    if (provider.ot) services.add('Occupational Therapy');
    if (provider.pt) services.add('Physical Therapy');
    if (provider.respite_care) services.add('Respite Care');
    if (provider.life_skills) services.add('Life Skills');
    if (provider.residential) services.add('Residential');
    if (provider.church_support) services.add('Faith-Based');
    if (provider.pet_therapy) services.add('Pet Therapy');

    return Array.from(services);
  };

  const services = getServices();

  return (
    <div
      className={`bg-white/90 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md ${
        lowSensoryMode ? '' : 'transition-shadow duration-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
            {provider.provider_name}
            {provider.verified && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </h3>
          
          {/* Google Reviews Rating */}
          {ratingLoading ? (
            <div className="mb-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 animate-pulse rounded"></div>
            </div>
          ) : rating ? (
            <div className="mb-2">
              <StarRating 
                rating={rating.avg_rating} 
                reviewCount={rating.review_count}
                size="sm"
              />
            </div>
          ) : null}
          
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>
              {provider.city && provider.state
                ? `${provider.city}, ${provider.state}`
                : provider.city || 'Location not specified'}
              {provider.zip && ` ${provider.zip}`}
            </span>
          </div>
        </div>
      </div>

      {provider.street && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          {provider.street}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {services.slice(0, 4).map((service) => (
          <span
            key={service}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
          >
            {service}
          </span>
        ))}
        {services.length > 4 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            +{services.length - 4} more
          </span>
        )}
        {services.length === 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
            Services information not available
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 text-sm">
          {provider.phone && (
            
              href={`tel:${provider.phone}`}
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Call ${provider.provider_name}`}
              title={provider.phone}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{provider.phone}</span>
            </a>
          )}
          {provider.website && (
            
              href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Visit ${provider.provider_name} website`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
          )}
          {provider.scraped_website && !provider.website && (
            
              href={provider.scraped_website.startsWith('http') ? provider.scraped_website : `https://${provider.scraped_website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={`Visit ${provider.provider_name} website`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
          )}
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};