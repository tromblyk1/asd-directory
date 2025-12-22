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

const platformConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  facebook: { icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
  youtube: { icon: Youtube, label: 'YouTube', color: 'hover:text-red-600' },
  twitter: { icon: Twitter, label: 'Twitter/X', color: 'hover:text-sky-500' },
  tiktok: { icon: Music, label: 'TikTok', color: 'hover:text-gray-900' },
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

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonPadding = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
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
                className={`${buttonPadding} rounded-md text-gray-400 ${config.color} transition-colors`}
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
