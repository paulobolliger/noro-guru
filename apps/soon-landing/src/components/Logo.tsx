import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  showSubmark?: boolean;
  lightMode?: boolean;
}

export default function Logo({
  className = '',
  showWordmark = true,
  showSubmark = true,
  lightMode = false
}: LogoProps) {
  return (
    <div className={`flex items-center select-none group/logo ${className}`} id="noro-logo-component">
      <img
        src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1780108595/copy_of_captura_de_tela_2026-05-29_232740-removebg-preview_efky7aaa.png"
        alt="NORO Intelligent Core Logo"
        referrerPolicy="no-referrer"
        className="h-12 md:h-14 w-auto object-contain group-hover/logo:scale-[1.03] transition-transform duration-300 ease-out"
      />
    </div>
  );
}

