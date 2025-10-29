import React from 'react';

export const CircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 20.5 4.5 15H2v-2h2.5L10 8.5" />
        <path d="M14 3.5 19.5 9H22v2h-2.5L14 15.5" />
        <path d="m10 8.5 4 7" />
        <circle cx="12" cy="12" r="2" />
        <path d="M4.5 9H2v2h2.5" />
        <path d="M19.5 15H22v-2h-2.5" />
    </svg>
);
