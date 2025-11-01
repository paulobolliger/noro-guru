import React from 'react';

interface SparklesIconProps {
  className?: string;
}

export const SparklesIcon: React.FC<SparklesIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v18" />
      <path d="m5 10 7-7 7 7" />
      <path d="m5 14 7 7 7-7" />
      <path d="M3 12h18" />
    </svg>
  );
};