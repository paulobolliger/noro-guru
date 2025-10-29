
import React from 'react';

export const LoadingSpinner: React.FC<{ size?: string }> = ({ size = 'w-12 h-12' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-indigo-500`}></div>
  );
};
