import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PPECCenter } from '@/lib/supabase';

interface DaycareCardProps {
  daycare: PPECCenter;
  distance?: number | null;
}

export const DaycareCard: React.FC<DaycareCardProps> = ({ daycare, distance }) => {
  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const addressParts = [
    daycare.address,
    daycare.city,
    daycare.state,
    daycare.zip_code
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/daycare/${daycare.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-orange-600 transition-colors cursor-pointer">
                  {daycare.name || 'Unknown Center'}
                </h3>
              </Link>
              {daycare.county && (
                <p className="text-sm text-gray-500 mt-0.5">{daycare.county} County</p>
              )}
              {!daycare.county && daycare.city && (
                <p className="text-sm text-gray-500 mt-0.5">{daycare.city}, {daycare.state || 'FL'}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {daycare.verified === true && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100" title="Verified center - information confirmed by Florida Autism Services">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
              {daycare.profit_status && (
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${
                    daycare.profit_status === 'Not-For-Profit'
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {daycare.profit_status}
                </Badge>
              )}
            </div>
          </div>

          {daycare.licensed_beds && (
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-xs font-medium bg-orange-50 text-orange-700 border-orange-200">
                <Users className="w-3 h-3 mr-1" />
                {daycare.licensed_beds} Licensed Beds
              </Badge>
            </div>
          )}

          {distance != null && (
            <p className="text-sm text-orange-600 font-medium">
              {distance.toFixed(1)} miles away
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {daycare.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${formatPhoneForLink(daycare.phone)}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {daycare.phone}
                </a>
              </div>
            )}

            {daycare.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={daycare.website.startsWith('http') ? daycare.website : `https://${daycare.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors truncate"
                >
                  Visit Website
                </a>
              </div>
            )}

            {fullAddress && (
              <div className="flex items-start text-gray-600 sm:col-span-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    {fullAddress}
                  </a>
                ) : (
                  <span>{fullAddress}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
            <Link to={`/daycare/${daycare.slug}`}>
              <Button variant="outline" size="sm" className="text-sm text-orange-600 border-orange-600 hover:bg-orange-50">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
