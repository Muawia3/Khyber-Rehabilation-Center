import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar" style={{ width: 'var(--sidebar-width)', padding: 'var(--spacing-4)' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/content">Content Management</NavLink>
        <NavLink to="/admin/leadership">Manage Leadership</NavLink>
        <NavLink to="/admin/inquiries">Inquiries</NavLink>
      </nav>
    </aside>
  );
};
