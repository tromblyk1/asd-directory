import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music } from 'lucide-react';
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
  youtube: { icon: Youtube, label: 'YouTube', bgColor: 'bg-red-100 hover:bg-red-200', textColor: 'text-red-600' },
  twitter: { icon: Twitter, label: 'Twitter/X', bgColor: 'bg-gray-100 hover:bg-gray-200', textColor: 'text-gray-700' },
  tiktok: { icon: Music, label: 'TikTok', bgColor: 'bg-gray-100 hover:bg-gray-200', textColor: 'text-gray-900' },
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
