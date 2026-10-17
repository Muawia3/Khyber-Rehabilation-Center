import React from 'react';
import './Card.css';

export const Card = ({
  children,
  variant = 'default', // 'default' | 'light-blue' | 'highlight'
  hoverable = false,
  className = '',
  ...props
}) => {
  const variantClass = variant !== 'default' ? `card-${variant}` : '';
  const hoverClass = hoverable ? 'card-hoverable' : '';
  
  return (
    <div className={`card ${variantClass} ${hoverClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
