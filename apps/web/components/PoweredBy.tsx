import React from 'react';
import { useTranslation } from '../i18n/context';

interface PoweredByProps {
  navigateTo?: (page: string) => void;
}

const PoweredBy: React.FC<PoweredByProps> = ({ navigateTo }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (navigateTo) {
      navigateTo('');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 hover:opacity-80 transition text-sm whitespace-nowrap"
      title="Designed by Norotec Cloud"
    >
      <span className="bg-gradient-to-r from-[#1db8a3] via-[#31a49b] to-[#1db8a3] bg-clip-text text-transparent font-medium">
        Designed by
      </span>
      <img
        src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1786903473/norotec-cloud-logo.png"
        alt="Norotec Cloud"
        className="h-9 object-contain"
      />
    </button>
  );
};

export default PoweredBy;
