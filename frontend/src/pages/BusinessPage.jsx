import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, Alert, LoadingSpinner } from '../components';
import { useDocumentTitle } from '../hooks';
import { contentService } from '../services/contentService';

export const BusinessPage = () => {
  useDocumentTitle('Business Units & Social Enterprise');
  const [dbBusiness, setDbBusiness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getBusiness()
      .then((res) => {
        if (isMounted) {
          setDbBusiness(res.data || []);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiError(err.message || 'Unable to connect to business initiatives service.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="business-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Social Enterprise Framework"
            title="Business Units & Economic Reintegration"
            description="Empowering recovering individuals through self-sustaining small-business initiatives that foster dignity, community integration, and long-term financial independence."
          />
        </div>
      </section>

      {/* The Social Enterprise Model */}
      <section className="section-padding bg-white">
        <div className="container">
          {apiError && import.meta.env.DEV && (
            <Alert type="warning" title="Development Status Notice">
              <strong>Server Notice:</strong> {apiError} (Displaying offline enterprise model until PostgreSQL connection is active)
            </Alert>
          )}

          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-12)' }}>
            <div>
              <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>Sustainable Healthcare</span>
              <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', margin: 'var(--spacing-3) 0 var(--spacing-5)', fontWeight: 800 }}>
                How Our Social Business Model Works
              </h2>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-4)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                Charity alone is often not enough to sustain long-term rehabilitation. At Khyber Rehabilitation Center,
                our small-business initiatives operate as a <strong>social enterprise</strong>—an innovative bridge
                between non-profit rehabilitation care and viable local economic productivity.
              </p>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                Patients who have successfully completed the medical detoxification and intensive therapy stages
                are invited to participate in productive business units. Here, they apply their vocational skills
                under professional supervision, creating real value for the local market in Peshawar.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                <Link to="/contact">
                  <Button variant="primary" size="md" className="btn-pill">Partner With Us</Button>
                </Link>
                <Link to="/skills">
                  <Button variant="outline" size="md" className="btn-pill">View Skill Programs</Button>
                </Link>
              </div>
            </div>

            <Card variant="light-blue">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>
                Where Do The Proceeds Go?
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                All revenue generated through our vocational business units is ethically channeled through three distinct funds:
              </p>
              <ul style={{ paddingLeft: 'var(--spacing-4)', color: 'var(--color-gray-700)', lineHeight: 1.85, fontSize: 'var(--font-size-sm)' }}>
                <li style={{ marginBottom: 'var(--spacing-2)' }}><strong>Trainee Fair-Wage Stipends:</strong> Recovering patients earn direct compensation, rebuilding their personal savings.</li>
                <li style={{ marginBottom: 'var(--spacing-2)' }}><strong>Patient Welfare & Medical Fund:</strong> Subsidizing treatment costs for underprivileged patients seeking admission.</li>
                <li><strong>Workshop Raw Materials:</strong> Procuring sustainable timber, fabric, and tools to maintain ongoing training.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Business Units */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', borderBottom: '1px solid rgba(1, 156, 220, 0.15)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Operational Units"
            title="Our Small-Business Units in Peshawar"
            description="Supervised micro-enterprises providing direct employment and sustainable earnings for recovering individuals in Peshawar and Charsadda Road."
          />

          {loading ? (
            <LoadingSpinner text="Fetching business initiatives from database..." />
          ) : dbBusiness.length > 0 ? (
            <div className="grid-3">
              {dbBusiness.map((unit) => (
                <Card key={unit.id} variant="highlight" hoverable>
                  <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                    {unit.name}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                    {unit.description}
                  </p>
                  {unit.category && <span className="glow-badge" style={{ fontSize: '10px' }}>{unit.category}</span>}
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Loader Rickshaw Logistics Fleet
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Commercial cargo transit and freight delivery service operating across Peshawar and Naguman Charsadda Road, providing safe logistics and steady income.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Small Business: Logistics</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Chinchi Rickshaw Passenger Transit
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Reliable local public transit routes connecting Naguman, Charsadda Road and central Peshawar, allowing recovered individuals to earn daily with dignity.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Small Business: Passenger Transit</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Livestock & Dairy Farming
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Sustainable dairy cattle and goat farming cooperative generating pure milk supply and hands-on agricultural trade management.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Small Business: Livestock Farming</span>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Corporate & Community Partnership */}
      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeader
            subtitle="Business Collaboration"
            title="Partner With Our Social Enterprise"
            description="We welcome corporate partnerships, wholesale bulk inquiries, and apprenticeships from the Peshawar business community."
          />
          <div className="grid-2">
            <Card variant="light-blue" hoverable>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
                Bulk Corporate Procurement
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: 'var(--spacing-5)' }}>
                Local businesses, hospitals, and educational institutions can procure uniforms, office woodwork,
                and corporate gift items directly from our workshops. Your purchase directly finances someone's medical recovery.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="btn-pill">Request Corporate Catalog</Button>
              </Link>
            </Card>

            <Card variant="light-blue" hoverable>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
                Employer Apprenticeship Network
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: 'var(--spacing-5)' }}>
                Become an accredited partner employer in Khyber Pakhtunkhwa. Offer post-recovery apprenticeships
                or entry-level employment to vetted, certified graduates who have completed full rehabilitation.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="btn-pill">Join Employer Network</Button>
              </Link>
            </Card>
          </div>

          <div
            className="glass-card"
            style={{
              marginTop: 'var(--spacing-8)',
              padding: 'var(--spacing-4) var(--spacing-6)',
              textAlign: 'center',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-primary-dark)',
            }}
          >
            <span>ℹ️</span> <strong>Partnership Registry:</strong> For official corporate partner inquiries or regional employer MoUs, please contact our admissions & outreach office.
          </div>
        </div>
      </section>
    </div>
  );
};
