import React from 'react';

const NoroLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="noroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#5053C4' }} />
          <stop offset="100%" style={{ stopColor: '#1DD3C0' }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Rings */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#noroGradient)" strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="url(#noroGradient)" strokeWidth="2" opacity="0.5">
         <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="50" r="25" fill="none" stroke="url(#noroGradient)" strokeWidth="2" opacity="0.7">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 50 50"
          to="0 50 50"
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Core */}
      <circle cx="50" cy="50" r="10" fill="#1DD3C0" filter="url(#glow)">
        <animate
          attributeName="r"
          values="8; 12; 8"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8; 1; 0.8"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default NoroLogo;
