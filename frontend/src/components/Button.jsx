import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'secondary' | 'whatsapp' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
