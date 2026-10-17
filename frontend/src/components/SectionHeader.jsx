import React from 'react';
import './SectionHeader.css';

export const SectionHeader = ({ subtitle, title, description, align = 'center' }) => {
  return (
    <div className={`section-header section-header-${align}`}>
      {subtitle && <span className="section-badge">{subtitle}</span>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-desc">{description}</p>}
    </div>
  );
};
