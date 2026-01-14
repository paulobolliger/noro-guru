import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'white';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-noro-gold text-noro-dark hover:shadow-[0_0_10px_#D4AF37] hover:scale-105 focus:ring-noro-gold',
        secondary: 'bg-transparent border border-noro-turquoise text-noro-turquoise hover:bg-noro-turquoise hover:text-noro-dark hover:shadow-[0_0_15px_rgba(29,211,192,0.3)] hover:scale-105 focus:ring-noro-turquoise',
        outline: 'bg-transparent border border-noro-text-secondary text-noro-text-secondary hover:border-noro-turquoise hover:text-noro-turquoise focus:ring-noro-text-secondary',
        ghost: 'bg-transparent text-noro-blue hover:text-noro-turquoise hover:bg-noro-turquoise/10 focus:ring-noro-turquoise',
        white: 'bg-white text-noro-primary hover:bg-noro-light hover:shadow-lg focus:ring-white',
    };

    const sizes = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-10 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    // Simple class merging manually since we don't have clsx/tailwind-merge installed yet
    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
