import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  className?: string;
}

// A reusable badge component for displaying status labels.
// It accepts a color prop to change its appearance based on the status.
const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-slate-100 text-slate-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
