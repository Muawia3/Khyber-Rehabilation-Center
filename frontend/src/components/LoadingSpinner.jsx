import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-circle" aria-label="Loading indicator"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};
