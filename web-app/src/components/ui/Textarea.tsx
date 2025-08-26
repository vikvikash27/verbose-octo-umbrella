import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const baseClasses = "block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className={containerClassName}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <textarea
        id={id}
        name={id}
        className={`${baseClasses} ${error ? errorClasses : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
