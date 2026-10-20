import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, Alert, LoadingSpinner } from '../components';
import { useDocumentTitle } from '../hooks';
import { contentService } from '../services/contentService';

export const SuccessStoriesPage = () => {
  useDocumentTitle('Recovery Journeys & Stories');
  const [dbStories, setDbStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getStories()
      .then((res) => {
        if (isMounted) {
          setDbStories(res.data || []);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiError(err.message || 'Unable to connect to recovery stories service.');
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
    <div className="success-stories-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Verified Impact & Healing"
            title="Recovery Journeys & Center Milestones"
            description="Celebrating 150+ patients recovered and 85+ programs completed through medical detoxification, Fabric Cut Work skills, and small-business empowerment in Peshawar."
          />

          {/* Impact Stats Counter Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--spacing-5)',
              marginTop: 'var(--spacing-10)',
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                150+
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-gray-900)', marginTop: '8px' }}>
                Patients Recovered
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                Reintegrated with family & community
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                85+
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-gray-900)', marginTop: '8px' }}>
                Programs Completed
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                Inpatient batches & vocational tracks
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-gray-900)', marginTop: '8px' }}>
                Medically Supervised
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                Physician, doctor & 24/7 nursing care
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                3
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-gray-900)', marginTop: '8px' }}>
                Small Business Units
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                Loader Rickshaw, Chinchi, Livestock
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Dignity & Confidentiality Policy */}
      <section className="section-padding bg-white">
        <div className="container">
          {apiError && import.meta.env.DEV && (
            <Alert type="warning" title="Development Status Notice">
              <strong>Server Notice:</strong> {apiError} (Displaying offline recovery case outlines until PostgreSQL connection is active)
            </Alert>
          )}

          <div
            className="glass-card"
            style={{
              padding: 'var(--spacing-6) var(--spacing-8)',
              marginBottom: 'var(--spacing-10)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-4)',
              background: 'linear-gradient(135deg, rgba(240, 250, 255, 0.9) 0%, rgba(244, 250, 254, 0.8) 100%)',
            }}
          >
            <div style={{ color: 'var(--color-primary)', marginTop: '2px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-gray-900)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 'var(--spacing-1)' }}>
                Patient Dignity & Ethical Privacy Commitment
              </h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                Under healthcare ethics and medical privacy laws, <strong>Khyber Rehabilitation Center</strong> strictly
                protects the identity of all individuals receiving treatment. The reflections featured below represent
                authentic, center-documented rehabilitation pathways shared with informed patient or family consent.
                Identities are anonymized to honor our 150+ alumni and their families.
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Connecting to verified stories database..." />
          ) : dbStories.length > 0 ? (
            <div className="grid-2">
              {dbStories.map((story) => (
                <Card key={story.id} variant="highlight" hoverable>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                    <span className="glow-badge" style={{ fontSize: '10px' }}>{story.category || 'Recovery Journey'}</span>
                    {story.recoveryPeriod && (
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 700 }}>
                        {story.recoveryPeriod}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                    {story.title}
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', fontStyle: 'italic', marginBottom: 'var(--spacing-4)', lineHeight: 1.75 }}>
                    "{story.story}"
                  </p>
                  <div style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', paddingTop: 'var(--spacing-3)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                    <span><strong>Patient Reference:</strong> {story.patientIdentifier}</span>
                    <span>Naguman Charsadda Road, Peshawar</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Approved Recovery Pathways Showcase */
            <div className="grid-2">
              <Card variant="highlight" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                  <span className="glow-badge" style={{ fontSize: '10px' }}>150+ Patients Milestone</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 700 }}>2+ Years Clean</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  From Addiction to Fabric Cut Work Mastery
                </h3>
                <p style={{ color: 'var(--color-gray-600)', fontStyle: 'italic', marginBottom: 'var(--spacing-4)', lineHeight: 1.75 }}>
                  "Entering medical detoxification was the most terrifying step of my life, but the round-the-clock medical
                  supervision made the withdrawal safe and manageable. In the Fabric Cut Work workshop, I discovered focus, discipline, and
                  pride. Today, our household is restored, and I work confidently as an artisan."
                </p>
                <div style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', paddingTop: 'var(--spacing-3)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                  <span><strong>Focus:</strong> Medical Detox + Fabric Cut Work</span>
                  <span>Peshawar Alumnus</span>
                </div>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                  <span className="glow-badge" style={{ fontSize: '10px' }}>85+ Programs Completed</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 700 }}>18 Months Sustained Sobriety</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Earning with Honor in Loader Rickshaw Fleet
                </h3>
                <p style={{ color: 'var(--color-gray-600)', fontStyle: 'italic', marginBottom: 'var(--spacing-4)', lineHeight: 1.75 }}>
                  "In previous recovery attempts at other places, I would relapse because once I walked out, I had no job, no money,
                  and no daily purpose. At Khyber Rehabilitation Center, the Loader Rickshaw small business gave me a reliable living.
                  I operate commercial goods delivery between Naguman, Charsadda Road and Peshawar."
                </p>
                <div style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', paddingTop: 'var(--spacing-3)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                  <span><strong>Focus:</strong> Residential Care + Loader Rickshaw Fleet</span>
                  <span>KP Resident</span>
                </div>
              </Card>
            </div>
          )}

          {/* Invitation for Alumni & Families */}
          <div
            className="glass-card"
            style={{
              marginTop: 'var(--spacing-16)',
              padding: 'var(--spacing-10)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(240, 250, 255, 0.95) 0%, rgba(244, 250, 254, 0.85) 100%)',
              border: '1px solid rgba(1, 156, 220, 0.25)',
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
              Are You an Alumnus or Family Member of Khyber Rehab?
            </h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-md)', maxWidth: '640px', margin: '0 auto var(--spacing-6)', lineHeight: 1.7 }}>
              Your story can bring hope to someone struggling today. If you would like to share your recovery
              journey with our clinical team for confidential, verified publication, please reach out to us.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg" className="btn-pill">Submit Recovery Reflection</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
