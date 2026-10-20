import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, Alert, LoadingSpinner, EmptyState } from '../components';
import { useDocumentTitle } from '../hooks';
import { CONTACT_INFO } from '../utils/constants';
import { contentService } from '../services/contentService';

export const TreatmentPage = () => {
  useDocumentTitle('Rehabilitation Treatment Programs');
  const [dbTreatments, setDbTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getTreatments()
      .then((res) => {
        if (isMounted) {
          setDbTreatments(res.data || []);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiError(err.message || 'Unable to connect to live treatment database.');
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
    <div className="treatment-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Clinical Healthcare & Rehabilitation"
            title="Evidence-Based Treatment Programs"
            description="Compassionate, medically supervised rehabilitation designed to safely detoxify, psychologically heal, and restore lasting wellbeing in Peshawar."
          />
        </div>
      </section>

      {/* Live Database Integration Section */}
      <section className="section-padding bg-white">
        <div className="container">
          {apiError && import.meta.env.DEV && (
            <Alert type="warning" title="Development Status Notice">
              <strong>Server Notice:</strong> {apiError} (Ensure PostgreSQL is running and backend is online at http://localhost:5000)
            </Alert>
          )}

          <SectionHeader
            subtitle="Inpatient & Clinical Services"
            title="Our Rehabilitation Programs in Peshawar"
            description="Every recovery journey begins with a personalized clinical assessment suited to the patient's physical and psychological needs."
          />

          {loading ? (
            <LoadingSpinner text="Connecting to clinical programs database..." />
          ) : dbTreatments.length > 0 ? (
            <div className="grid-3">
              {dbTreatments.map((item) => (
                <Card key={item.id} variant="highlight" hoverable>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                    {item.summary || item.description}
                  </p>
                  {item.category && <span className="glow-badge" style={{ fontSize: '10px' }}>{item.category}</span>}
                </Card>
              ))}
            </div>
          ) : (
            /* Baseline Clinical Framework */
            <div className="grid-3">
              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Medical Detoxification
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  24/7 medically monitored withdrawal management. Our medical staff ensures patient stabilization,
                  vital monitoring, and compassionate care to ease physical discomfort safely.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Phase 1 &bull; 24/7 Supervised</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Residential Inpatient Rehab
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  A peaceful, secure, and structured environment away from triggers. Includes daily therapeutic routines,
                  nutritious meal plans, physical exercise, and peer support communities.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Phase 2 &bull; Residential</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Psychological Counseling
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  Structured Cognitive Behavioral Therapy (CBT), motivational interviewing, trauma management,
                  and emotional regulation led by qualified psychologists.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Individual & Group Therapy</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Co-Occurring Disorders
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  Specialized psychiatric evaluation for concurrent mental health conditions such as severe depression,
                  anxiety, bipolar disorder, and PTSD alongside rehabilitation.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Dual Diagnosis Care</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Family Reconciliation & Therapy
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  Addiction strains family bonds. We offer structured mediation, family education on enabling behavior,
                  and guided sessions to rebuild domestic trust and harmony.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Family Support</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Relapse Prevention & Aftercare
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                  Recovery does not end at discharge. Our outpatient follow-ups, regular drug screening,
                  peer circles, and emergency counselor lines provide long-term protection.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Sustained Sobriety</span>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Treatment Approach & Methodology */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', borderBottom: '1px solid rgba(1, 156, 220, 0.15)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Clinical Methodology"
            title="Our Step-by-Step Treatment Process"
            description="A scientific, respectful protocol focused on sustainable rehabilitation."
          />
          <div className="grid-4">
            <Card variant="light-blue" hoverable>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-brand-vibrant)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: 'var(--spacing-3)', boxShadow: '0 4px 12px rgba(1, 156, 220, 0.3)' }}>
                1
              </div>
              <h4 style={{ margin: 'var(--spacing-2) 0', fontSize: '1.1rem', fontWeight: 800 }}>Intake & Diagnosis</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                Confidential health screening, toxicological assessment, medical history evaluation, and customized treatment plan design.
              </p>
            </Card>
            <Card variant="light-blue" hoverable>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-brand-vibrant)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: 'var(--spacing-3)', boxShadow: '0 4px 12px rgba(1, 156, 220, 0.3)' }}>
                2
              </div>
              <h4 style={{ margin: 'var(--spacing-2) 0', fontSize: '1.1rem', fontWeight: 800 }}>Medical Detox</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                Round-the-clock symptom management, physiological stabilization, and nutrition replenishments.
              </p>
            </Card>
            <Card variant="light-blue" hoverable>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-brand-vibrant)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: 'var(--spacing-3)', boxShadow: '0 4px 12px rgba(1, 156, 220, 0.3)' }}>
                3
              </div>
              <h4 style={{ margin: 'var(--spacing-2) 0', fontSize: '1.1rem', fontWeight: 800 }}>Therapy & Trades</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                Psychological healing and spiritual guidance combined with daily hands-on Fabric Cut Work and small business enterprise training.
              </p>
            </Card>
            <Card variant="light-blue" hoverable>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-brand-vibrant)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: 'var(--spacing-3)', boxShadow: '0 4px 12px rgba(1, 156, 220, 0.3)' }}>
                4
              </div>
              <h4 style={{ margin: 'var(--spacing-2) 0', fontSize: '1.1rem', fontWeight: 800 }}>Reintegration</h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                Step-down outpatient plans, family reunions, workplace transition, and alumni meetings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Confidential Helpline Banner */}
      <section className="section-padding bg-white">
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: 'var(--spacing-10)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--spacing-6)',
              background: 'linear-gradient(135deg, rgba(240, 250, 255, 0.95) 0%, rgba(244, 250, 254, 0.85) 100%)',
              border: '1px solid rgba(1, 156, 220, 0.25)',
            }}
          >
            <div>
              <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)', fontWeight: 800 }}>
                Need Guidance on Admission or Treatment Costs?
              </h3>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-md)', maxWidth: '620px' }}>
                Our medical coordinators are available 24 hours a day to answer family inquiries confidentially in Peshawar.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <Link to="/contact">
                <Button variant="primary" size="lg" className="btn-pill">Request Admission Consultation</Button>
              </Link>
              <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg" className="btn-pill">WhatsApp Helpline</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
