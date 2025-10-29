import React from 'react';

export const PassportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2Z" />
        <path d="M5 3v18" />
        <path d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M12 21v-6" />
        <path d="M18 6h3" />
        <path d="M18 12h3" />
        <path d="M18 18h3" />
    </svg>
);
