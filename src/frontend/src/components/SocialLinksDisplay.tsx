import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z"/>
  </svg>
);
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SocialLinksDisplayProps {
  socialLinks: Record<string, string> | null | undefined;
  size?: 'sm' | 'md';
  className?: string;
}

const platformConfig: Record<string, { icon: React.ElementType; label: string; bgColor: string; textColor: string }> = {
  facebook: { icon: Facebook, label: 'Facebook', bgColor: 'bg-blue-100 hover:bg-blue-200', textColor: 'text-blue-600' },
  instagram: { icon: Instagram, label: 'Instagram', bgColor: 'bg-pink-100 hover:bg-pink-200', textColor: 'text-pink-600' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', bgColor: 'bg-blue-100 hover:bg-blue-200', textColor: 'text-blue-700' },
  youtube: { icon: Youtube, label: 'YouTube', bgColor: 'bg-red-600 hover:bg-red-700', textColor: 'text-white' },
  twitter: { icon: XIcon, label: 'X', bgColor: 'bg-gray-900 hover:bg-black', textColor: 'text-white' },
  tiktok: { icon: TikTokIcon, label: 'TikTok', bgColor: 'bg-gray-900 hover:bg-black', textColor: 'text-white' },
};

export const SocialLinksDisplay: React.FC<SocialLinksDisplayProps> = ({
  socialLinks,
  size = 'md',
  className = ''
}) => {
  // Return null if no social links or empty object
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null;
  }

  // Filter out empty URLs and only include known platforms
  const validLinks = Object.entries(socialLinks).filter(
    ([platform, url]) => url && url.trim() !== '' && platformConfig[platform]
  );

  if (validLinks.length === 0) {
    return null;
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';
  const buttonSize = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {validLinks.map(([platform, url]) => {
        const config = platformConfig[platform];
        if (!config) return null;

        const Icon = config.icon;
        const href = url.startsWith('http') ? url : `https://${url}`;

        return (
          <Tooltip key={platform}>
            <TooltipTrigger asChild>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonSize} rounded-full ${config.bgColor} ${config.textColor} flex items-center justify-center transition-colors`}
                aria-label={`Visit ${config.label}`}
              >
                <Icon className={iconSize} />
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{config.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
