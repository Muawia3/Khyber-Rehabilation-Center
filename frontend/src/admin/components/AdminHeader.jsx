import React from 'react';

export const AdminHeader = ({ title = 'Portal', user = 'Administrator' }) => {
  return (
    <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>{title}</h2>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>{user}</span>
    </header>
  );
};
