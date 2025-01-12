import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    label: string;
    isDisabled?: boolean;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
    customClasses?: string;
    type?: 'button' | 'submit'
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    label,
    isDisabled = false,
    variant = 'primary',
    icon,
    customClasses = '',
    type
}) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const primaryClasses = isDisabled
        ? "bg-blue-400 text-white cursor-not-allowed"
        : "bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg";
    const secondaryClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses} ${customClasses}`}
            disabled={isDisabled}

        >
            {icon}
            {label}
        </button>
    );
};


