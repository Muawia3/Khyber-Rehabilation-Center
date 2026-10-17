import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, LoadingSpinner, Alert, LeadershipTree } from '../components';
import { useDocumentTitle } from '../hooks';
import { leadershipService } from '../services';
import { APP_NAME, CONTACT_INFO } from '../utils/constants';

export const LeadershipPage = () => {
  useDocumentTitle('Our Leadership & Organizational Hierarchy');
  const [treeData, setTreeData] = useState([]);
  const [flatMembers, setFlatMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeadership();
  }, []);

  const loadLeadership = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadershipService.getLeadershipTree();
      if (response && response.data) {
        setTreeData(response.data.tree || []);
        setFlatMembers(response.data.flat || []);
      }
    } catch (err) {
      console.error('Failed to load leadership data:', err);
      setError('Unable to load latest leadership data from database. Displaying standard institutional structure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leadership-page">
      {/* 1. Page Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Institutional Governance & Reporting Hierarchy"
            title="Our Leadership & Organizational Structure"
            description="Clear clinical governance, medical accountability, and multi-tier institutional structure at Khyber Rehabilitation Center, Peshawar."
          />
        </div>
      </section>

      {/* 2. Main Tree & Organizational Hierarchy Section */}
      <section className="section-padding bg-white">
        <div className="container">
          {error && (
            <Alert type="info" style={{ marginBottom: 'var(--spacing-6)' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
              <LoadingSpinner size="lg" message="Loading organizational hierarchy structure..." />
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
                <span className="glow-badge" style={{ marginBottom: 'var(--spacing-2)' }}>
                  👑 CEO-Led Executive Hierarchy
                </span>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-xs)', marginTop: '8px' }}>
                  Click on any leader card to view their complete profile, qualifications, and department responsibilities.
                </p>
              </div>

              {/* Recursive Organizational Tree with Connecting Lines */}
              <LeadershipTree tree={treeData} />
            </div>
          )}
        </div>
      </section>

      {/* 3. Governance Principles & Accountability */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', borderBottom: '1px solid rgba(1, 156, 220, 0.15)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Healthcare Ethics & Governance"
            title="Institutional Governance Standards"
            description="Our multi-tier structure guarantees that clinical decisions, detoxification safety, and ethical care are continually supervised."
          />

          <div className="grid-3">
            <Card variant="white" hoverable>
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)' }}>
                Executive Accountability
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65 }}>
                The Chief Executive Officer (CEO) and Board maintain continuous oversight over hospital policies,
                legal compliance, and patient welfare standards.
              </p>
            </Card>

            <Card variant="white" hoverable>
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)' }}>
                Direct Medical Supervision
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65 }}>
                Every clinical protocol is directed by registered psychiatrists and medical officers, guaranteeing
                medically-safe withdrawal without physical harm.
              </p>
            </Card>

            <Card variant="white" hoverable>
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)' }}>
                24/7 Operations Oversight
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65 }}>
                Facility administrators ensure hygienic living quarters, nutritional diet plans, security, and
                round-the-clock emergency support for all inpatients.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Contact CTA */}
      <section className="section-padding bg-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
            Have Inquiries for Our Leadership or Medical Board?
          </h2>
          <p
            style={{
              color: 'var(--color-gray-600)',
              maxWidth: '680px',
              margin: '0 auto var(--spacing-8)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            Our administration is available for formal admissions, institutional partnerships, and confidential consultations in Peshawar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <Link to="/contact">
              <Button variant="primary" size="lg" className="btn-pill">
                Contact Leadership Office
              </Button>
            </Link>
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="btn-pill">
                WhatsApp Emergency Desk
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
