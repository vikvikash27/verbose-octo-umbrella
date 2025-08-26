import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// A simple container component with a consistent card-like appearance.
// It's used to wrap sections of content, tables, and forms.
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;