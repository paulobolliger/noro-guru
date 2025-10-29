import React from 'react';

export const ConnectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.7 18.3c.9.9 2.1 1.4 3.3 1.4s2.4-.5 3.3-1.4c.9-.9 1.4-2.1 1.4-3.3s-.5-2.4-1.4-3.3" />
        <path d="M13.3 5.7c-.9-.9-2.1-1.4-3.3-1.4S7.6 4.8 6.7 5.7c-.9.9-1.4 2.1-1.4 3.3s.5 2.4 1.4 3.3" />
        <path d="m7 17-10-10" />
        <path d="m17 7 10 10" />
    </svg>
);
