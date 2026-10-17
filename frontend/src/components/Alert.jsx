import React from 'react';
import './Alert.css';

export const Alert = ({
  type = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title,
  children,
  onClose,
  className = '',
}) => {
  return (
    <div className={`alert alert-${type} ${className}`.trim()} role="alert">
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          &times;
        </button>
      )}
    </div>
  );
};
