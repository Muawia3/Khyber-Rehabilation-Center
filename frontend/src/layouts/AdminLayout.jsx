import React, { useContext } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';
import logoImg from '../assets/logo.jpeg';

export const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div
      className="admin-layout"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 15% 15%, rgba(1, 156, 220, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(87, 193, 237, 0.06) 0%, transparent 45%), #f4f9fd',
      }}
    >
      {/* Sidebar - Fixed & Sticky */}
      <aside
        className="admin-sidebar-scroll"
        style={{
          width: '270px',
          height: '100vh',
          maxHeight: '100vh',
          background: 'linear-gradient(180deg, rgba(9, 14, 26, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          color: 'var(--color-white)',
          padding: 'var(--spacing-6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderRight: '1px solid rgba(1, 156, 220, 0.28)',
          boxShadow: '4px 0 28px rgba(1, 156, 220, 0.12)',
          position: 'sticky',
          top: 0,
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 100,
        }}
      >
        <div>
          {/* Brand & Portal Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-8)' }}>
            <img
              src={logoImg}
              alt={APP_NAME}
              style={{
                height: '44px',
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-sm)',
                padding: '4px',
                boxShadow: '0 4px 12px rgba(1, 156, 220, 0.3)',
                border: '1px solid rgba(1, 156, 220, 0.3)',
              }}
            />
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', margin: 0, lineHeight: 1.2, fontWeight: 800 }}>
                Admin Portal
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontWeight: 600 }}>Peshawar Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <NavLink
              to="/admin"
              end
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--color-gray-400)',
                background: isActive ? 'var(--gradient-brand-vibrant)' : 'transparent',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 14px rgba(1, 156, 220, 0.35)' : 'none',
              })}
            >
              <span>📊</span> Dashboard Overview
            </NavLink>

            <NavLink
              to="/admin/inquiries"
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--color-gray-400)',
                background: isActive ? 'var(--gradient-brand-vibrant)' : 'transparent',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 14px rgba(1, 156, 220, 0.35)' : 'none',
              })}
            >
              <span>📬</span> Patient Inquiries
            </NavLink>

            <NavLink
              to="/admin/content"
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--color-gray-400)',
                background: isActive ? 'var(--gradient-brand-vibrant)' : 'transparent',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 14px rgba(1, 156, 220, 0.35)' : 'none',
              })}
            >
              <span>📑</span> Content Management (CMS)
            </NavLink>

            <NavLink
              to="/admin/leadership"
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--color-gray-400)',
                background: isActive ? 'var(--gradient-brand-vibrant)' : 'transparent',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 14px rgba(1, 156, 220, 0.35)' : 'none',
              })}
            >
              <span>🏛️</span> Manage Leadership
            </NavLink>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div>
          <div
            style={{
              padding: 'var(--spacing-4)',
              background: 'linear-gradient(135deg, rgba(1, 156, 220, 0.16) 0%, rgba(1, 156, 220, 0.05) 100%)',
              border: '1px solid rgba(1, 156, 220, 0.35)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 14px rgba(1, 156, 220, 0.12)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-white)' }}>
              {user?.fullName || 'System Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', wordBreak: 'break-all', marginTop: '2px' }}>
              {user?.email || 'admin@khyberrehab.edu.pk'}
            </div>
            <div
              style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: 800,
                backgroundColor: 'rgba(1, 156, 220, 0.25)',
                color: '#7ed6fb',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                border: '1px solid rgba(1, 156, 220, 0.3)',
              }}
            >
              <span className="pulse-dot"></span>
              {user?.role || 'ADMIN'}
            </div>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-gray-400)',
              fontSize: 'var(--font-size-xs)',
              marginBottom: 'var(--spacing-3)',
              textDecoration: 'none',
              padding: '6px 0',
              fontWeight: 600,
              transition: 'color var(--transition-fast)',
            }}
          >
            ↗ View Public Portal
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color var(--transition-fast)',
            }}
          >
            🔒 Sign Out of Session
          </button>
        </div>
      </aside>

      {/* Main Content Area - Independently Scrollable */}
      <div
        className="admin-main-scroll"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <header
          style={{
            height: '70px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            flexShrink: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(240, 249, 255, 0.85) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderBottom: '1px solid rgba(1, 156, 220, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-8)',
            boxShadow: '0 4px 20px -2px rgba(1, 156, 220, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)' }}>
              Khyber Rehabilitation Center
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>| Secure Staff Workspace</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span
              className="glow-badge"
              style={{
                fontSize: '11px',
                padding: '3px 10px',
              }}
            >
              <span className="pulse-dot"></span>
              Active Session
            </span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)', fontWeight: 700 }}>
              {user?.fullName || 'Administrator'}
            </span>
          </div>
        </header>

        <main style={{ padding: 'var(--spacing-8)', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
