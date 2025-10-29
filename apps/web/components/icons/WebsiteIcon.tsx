import React from 'react';

export const WebsiteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="14" x="3" y="3" rx="2" />
        <path d="M7 21h10" />
        <path d="M12 17v4" />
        <path d="m8 7 4 4 4-4" />
    </svg>
);
