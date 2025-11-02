import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

type HoverBubbleProps = {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export const HoverBubble: React.FC<HoverBubbleProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { lowSensoryMode } = useAccessibility();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  const isBubbleVisible = !lowSensoryMode && isVisible;

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={content}
    >
      {children || <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 cursor-help" />}

      {isBubbleVisible && (
        <div
          className={`
            absolute ${positionClasses[position]}
            inline-block
            bg-slate-800 dark:bg-slate-700 text-white text-sm
            rounded-lg px-3 py-2 shadow-lg
            whitespace-nowrap sm:whitespace-normal
            leading-snug
            min-w-[18rem] sm:min-w-[20rem]
            max-w-[28rem]
            break-normal`}
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-slate-800 dark:border-slate-700 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};
