import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface EventVerificationBadgeProps {
  status: 'verified' | 'unverified' | 'pending' | null;
  source?: string | null;
  specific_accommodations_published?: boolean | null;
}

export const EventVerificationBadge: React.FC<EventVerificationBadgeProps> = ({
  status,
  source,
  specific_accommodations_published,
}) => {
  const isVerified = status === 'verified';

  const tooltipContent = isVerified ? (
    <div className="text-xs">
      <p className="font-semibold mb-1">✓ Verified Accommodations</p>
      <p>Specific sensory accommodations confirmed from official sources.</p>
      {source && <p className="mt-1 text-green-100">Source: {source}</p>}
    </div>
  ) : (
    <div className="text-xs">
      <p className="font-semibold mb-1">⚠ Details Not Specified</p>
      <p>Contact organizer to confirm specific sensory accommodations available.</p>
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            <Badge
              variant="outline"
              className={
                isVerified
                  ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 cursor-help'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 cursor-help'
              }
            >
              {isVerified ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Details
                </>
              ) : (
                <>
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Details Not Specified
                </>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className={
            isVerified
              ? 'bg-green-800 text-white border-green-700'
              : 'bg-amber-800 text-white border-amber-700'
          }
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};