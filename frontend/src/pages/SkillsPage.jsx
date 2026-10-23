import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, Alert, LoadingSpinner } from '../components';
import { useDocumentTitle } from '../hooks';
import { contentService } from '../services/contentService';

export const SkillsPage = () => {
  useDocumentTitle('Vocational Skills & Training');
  const [dbSkills, setDbSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getSkills()
      .then((res) => {
        if (isMounted) {
          setDbSkills(res?.data || []);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiError(err.message || 'Unable to connect to vocational skills service.');
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
    <div className="skills-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Vocational Empowerment"
            title="Fabric Cut Work & Vocational Training Programs"
            description="Empowering individuals in recovery with specialized Fabric Cut Work, precision pattern drafting, artistic cutwork embroidery, and professional garment construction in Peshawar."
          />
        </div>
      </section>

      {/* Why Vocational Training Matters */}
      <section className="section-padding bg-white">
        <div className="container">
          {apiError && import.meta.env.DEV && (
            <Alert type="warning" title="Development Status Notice">
              <strong>Server Notice:</strong> {apiError} (Displaying offline curriculum outline until PostgreSQL connection is active)
            </Alert>
          )}

          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-12)' }}>
            <div>
              <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>Purposeful Recovery</span>
              <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', margin: 'var(--spacing-3) 0 var(--spacing-5)', fontWeight: 800 }}>
                Fabric Cut Work: Bridging Healing with Economic Self-Reliance
              </h2>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-4)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                Clinical recovery heals the body, but idleness and financial distress post-discharge are among
                the leading causes of addiction relapse. At Khyber Rehabilitation Center, our specialized <strong>Fabric Cut Work</strong> training
                serves as an integral pillar of purposeful rehabilitation.
              </p>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                Through guided pattern drafting, scissor precision, and cutwork embroidery, recovering individuals restore their focus, develop disciplined daily work habits,
                and graduate with marketable artisan skills to support their households with honor and dignity.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                <Link to="/business">
                  <Button variant="primary" size="md" className="btn-pill">Small Business Units (Rickshaw & Livestock)</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="md" className="btn-pill">Inquire About Training (0300-7335962)</Button>
                </Link>
              </div>
            </div>

            <Card variant="light-blue">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>
                Core Pillars of Fabric Cut Work:
              </h3>
              <ul style={{ paddingLeft: 'var(--spacing-4)', color: 'var(--color-gray-700)', lineHeight: 1.85, fontSize: 'var(--font-size-sm)' }}>
                <li style={{ marginBottom: 'var(--spacing-2)' }}><strong>Artistic Therapeutic Focus:</strong> Replaces compulsive urges with disciplined, beautiful needle and fabric crafting.</li>
                <li style={{ marginBottom: 'var(--spacing-2)' }}><strong>High Market Demand:</strong> Fabric Cut Work and embroidery command premium value across Peshawar and KP textile markets.</li>
                <li style={{ marginBottom: 'var(--spacing-2)' }}><strong>Dignified Livelihood:</strong> Equips graduates to join stitching workshops, earn fair wages, or set up home-based tailoring.</li>
                <li><strong>Self-Esteem & Pride:</strong> Crafting finished, wearable art restores personal dignity and community respect.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Vocational Training Workshops */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', borderBottom: '1px solid rgba(1, 156, 220, 0.15)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Training Modules"
            title="Fabric Cut Work Training Modules"
            description="Hands-on craft disciplines taught by experienced master artisans within safe, fully equipped center facilities at Naguman, Charsadda Road, Peshawar."
          />

          {loading ? (
            <LoadingSpinner text="Fetching training programs from database..." />
          ) : dbSkills.length > 0 ? (
            <div className="grid-3">
              {dbSkills.map((item) => (
                <Card key={item.id} variant="highlight" hoverable>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="glow-badge" style={{ fontSize: '10px' }}>{item.category}</span>
                    {item.duration && (
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                        &bull; {item.duration}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Pattern Drafting & Precision Cutting
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Mastering geometric pattern designs, garment scaling, grain alignment, and razor-sharp scissor cutting for fine fabrics.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Fabric Cut Work</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Hand & Machine Cutwork Embroidery
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Artistic cutwork openwork borders, floral motifs, eyelet embroidery, and reinforced edge finishing for designer garments.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Fabric Cut Work</span>
              </Card>

              <Card variant="highlight" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                  Garment Assembly & Tailoring
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                  Sewing machine mastery, assembling cutwork panels into complete suits, kurtas, and home textiles with high market standards.
                </p>
                <span className="glow-badge" style={{ fontSize: '10px' }}>Fabric Cut Work</span>
              </Card>
            </div>
          )}

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
            <span>ℹ️</span> <strong>Course Schedule:</strong> Detailed course curriculum hours and workshop schedules are coordinated during patient rehabilitation intake.
          </div>
        </div>
      </section>
    </div>
  );
};
