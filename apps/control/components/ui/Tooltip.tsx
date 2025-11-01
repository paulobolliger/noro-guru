// components/ui/Tooltip.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export function Tooltip({ 
  content, 
  children, 
  side = 'right', 
  delayDuration = 300 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovering) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delayDuration);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering, delayDuration]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 ${positionClasses[side]}
            noro-card px-3 py-2 text-xs font-medium text-primary
            whitespace-nowrap max-w-xs
            animate-in fade-in duration-150
            pointer-events-none
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Shortcut badge para tooltips
export function ShortcutBadge({ keys }: { keys: string[] }) {
  return (
    <div className="flex gap-1 mt-1">
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="px-1.5 py-0.5 text-[10px] font-semibold bg-surface-alt border border-default rounded"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
