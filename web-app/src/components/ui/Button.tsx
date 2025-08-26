import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-brand-secondary text-white hover:bg-emerald-600 focus:ring-emerald-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  const finalClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${(disabled || isLoading) ? disabledClasses : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={finalClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
