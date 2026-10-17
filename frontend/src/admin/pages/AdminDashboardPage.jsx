import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Alert, LoadingSpinner } from '../../components';
import { useDocumentTitle } from '../../hooks';
import { contentService } from '../../services/contentService';

export const AdminDashboardPage = () => {
  useDocumentTitle('Admin Dashboard');
  const [stats, setStats] = useState(null);
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState(null);

  const fetchDashboardData = () => {
    let isMounted = true;
    setLoading(true);
    setApiNotice(null);

    Promise.allSettled([
      contentService.getDashboardStats(),
      contentService.checkHealth(),
    ]).then(([statsRes, healthRes]) => {
      if (!isMounted) return;

      if (healthRes.status === 'fulfilled') {
        setHealthInfo(healthRes.value.data);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      } else {
        const errorMsg =
          statsRes.reason?.message ||
          'Database unreachable. Real metrics will display once PostgreSQL is connected.';
        setApiNotice(errorMsg);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metrics = stats?.metrics;
  const recentInquiries = stats?.recentInquiries || [];

  return (
    <div className="admin-dashboard-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-8)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-3)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-gray-900)', fontWeight: 800 }}>
            System Dashboard
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginTop: '3px' }}>
            Live clinical database overview and inquiry monitoring &bull; Khyber Rehabilitation Center
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" size="sm" className="btn-pill" onClick={fetchDashboardData}>
            🔄 Refresh Metrics
          </Button>
          <Link to="/admin/inquiries">
            <Button variant="primary" size="sm" className="btn-pill">
              Manage Patient Inquiries
            </Button>
          </Link>
        </div>
      </div>

      {apiNotice ? (
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <Alert type="warning" title="Database Notice">
            {apiNotice} (All figures represent real PostgreSQL records; no dummy or demo metrics are displayed)
          </Alert>
        </div>
      ) : healthInfo ? (
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <Alert
            type={healthInfo.database?.status === 'connected' ? 'success' : 'info'}
            title="System & Database Connectivity"
          >
            Backend API is <strong>Online</strong> &bull; Database Status:{' '}
            <strong>
              {healthInfo.database?.status === 'connected'
                ? 'PostgreSQL Connected (Live Database)'
                : 'Local Persistent Storage Active (PostgreSQL Offline)'}
            </strong>
          </Alert>
        </div>
      ) : null}

      {loading ? (
        <div style={{ padding: 'var(--spacing-12) 0', textAlign: 'center' }}>
          <LoadingSpinner text="Querying database metrics..." />
        </div>
      ) : (
        <>
          {/* Real Metrics Cards Grid */}
          <div className="grid-4" style={{ marginBottom: 'var(--spacing-8)' }}>
            <Card variant="light-blue" hoverable>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-600)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Total Inquiries
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  margin: 'var(--spacing-2) 0',
                  fontWeight: 800,
                }}
              >
                {metrics ? metrics.totalInquiries : 0}
              </h2>
              <span
                className="glow-badge"
                style={{
                  fontSize: '11px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderColor: '#fde68a',
                }}
              >
                {metrics ? `${metrics.pendingInquiries} Pending Review` : 'No database records'}
              </span>
            </Card>

            <Card variant="light-blue" hoverable>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-600)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Treatment Programs
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  margin: 'var(--spacing-2) 0',
                  fontWeight: 800,
                }}
              >
                {metrics ? metrics.treatmentPrograms : 0}
              </h2>
              <span
                className="glow-badge"
                style={{
                  fontSize: '11px',
                }}
              >
                Inpatient & Detox Modules
              </span>
            </Card>

            <Card variant="light-blue" hoverable>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-600)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Skills Training
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  margin: 'var(--spacing-2) 0',
                  fontWeight: 800,
                }}
              >
                {metrics ? metrics.skillPrograms : 0}
              </h2>
              <span
                className="glow-badge"
                style={{
                  fontSize: '11px',
                }}
              >
                Vocational Trades
              </span>
            </Card>

            <Card variant="light-blue" hoverable>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-gray-600)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Published Products
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--color-primary)',
                  margin: 'var(--spacing-2) 0',
                  fontWeight: 800,
                }}
              >
                {metrics ? metrics.publishedProducts : 0}
              </h2>
              <span
                className="glow-badge"
                style={{
                  fontSize: '11px',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  borderColor: '#a7f3d0',
                }}
              >
                Workshop Catalog
              </span>
            </Card>
          </div>

          {/* Secondary Metric Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-8)',
            }}
          >
            <Card style={{ padding: 'var(--spacing-5)' }} hoverable>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                Active Announcements
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gray-900)', marginTop: '4px' }}>
                {metrics ? metrics.activeAnnouncements : 0}
              </div>
            </Card>
            <Card style={{ padding: 'var(--spacing-5)' }} hoverable>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                Business Initiatives
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gray-900)', marginTop: '4px' }}>
                {metrics ? metrics.businessInitiatives : 0}
              </div>
            </Card>
            <Card style={{ padding: 'var(--spacing-5)' }} hoverable>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                Consent-Approved Stories
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gray-900)', marginTop: '4px' }}>
                {metrics ? metrics.successStories : 0}
              </div>
            </Card>
          </div>

          {/* Recent Inquiries Preview Table */}
          <Card variant="white">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-5)',
                borderBottom: '1px solid rgba(1, 156, 220, 0.15)',
                paddingBottom: 'var(--spacing-4)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)', fontWeight: 800 }}>
                  Recent Patient Intake Inquiries
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: '2px 0 0 0' }}>
                  Live inquiries logged via the website contact form
                </p>
              </div>
              <Link
                to="/admin/inquiries"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                View Full Queue &rarr;
              </Link>
            </div>

            {recentInquiries.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '2px solid rgba(1, 156, 220, 0.18)',
                        color: 'var(--color-gray-600)',
                        fontSize: 'var(--font-size-xs)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Patient / Guardian</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Contact Phone</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Category</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Status</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Received</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background var(--transition-fast)' }}>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-3)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                          {inq.fullName}
                        </td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-3)', color: 'var(--color-gray-600)' }}>{inq.phone}</td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-3)', color: 'var(--color-gray-700)' }}>{inq.inquiryType}</td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>
                          <span
                            className="glow-badge"
                            style={{
                              backgroundColor: inq.status === 'PENDING' ? '#fef3c7' : '#d1fae5',
                              color: inq.status === 'PENDING' ? '#92400e' : '#065f46',
                              borderColor: inq.status === 'PENDING' ? '#fde68a' : '#a7f3d0',
                              fontSize: '11px',
                              padding: '2px 8px',
                            }}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-3) var(--spacing-3)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-gray-500)',
                          }}
                        >
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-3)' }}>
                          <Link to="/admin/inquiries">
                            <Button variant="outline" size="sm" className="btn-pill">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                  No intake inquiries recorded in the database yet. Patient requests submitted through the public Contact page will appear here automatically.
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
