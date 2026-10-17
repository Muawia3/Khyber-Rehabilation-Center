import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';
import { useDocumentTitle } from '../hooks';
import logoImg from '../assets/logo.jpeg';
import { APP_NAME } from '../utils/constants';

export const NotFoundPage = () => {
  useDocumentTitle('404 - Page Not Found');
  return (
    <div className="not-found-page section-padding bg-mesh" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: 'var(--spacing-12) var(--spacing-8)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <img
            src={logoImg}
            alt={APP_NAME}
            style={{ height: '84px', margin: '0 auto var(--spacing-6)', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(1, 156, 220, 0.2))' }}
          />
          <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>Error 404</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--color-gray-900)', margin: 'var(--spacing-2) 0 var(--spacing-4)', fontWeight: 800 }}>
            Page Not Found
          </h1>
          <p style={{ maxWidth: '520px', margin: '0 auto var(--spacing-8)', color: 'var(--color-gray-600)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            We could not locate the page you requested. The page might have been updated, relocated,
            or the link entered may be incomplete.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
            <Link to="/">
              <Button variant="primary" size="lg" className="btn-pill">Return to Homepage</Button>
            </Link>
            <Link to="/treatment">
              <Button variant="outline" size="lg" className="btn-pill">Explore Treatment Programs</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="btn-pill">Admissions & Helpline</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
