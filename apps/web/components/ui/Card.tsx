import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'bordered';
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hoverEffect = true,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl p-8 transition-all duration-300';

    const variants = {
        default: 'bg-white shadow-noro-base',
        glass: 'bg-noro-gray-future/50 backdrop-blur border border-white/5',
        bordered: 'bg-transparent border border-noro-accent',
    };

    const hoverStyles = hoverEffect
        ? 'hover:border-noro-turquoise hover:shadow-noro-glow-turquoise hover:-translate-y-2'
        : '';

    const combinedClassName = `${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`;

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

export default Card;
