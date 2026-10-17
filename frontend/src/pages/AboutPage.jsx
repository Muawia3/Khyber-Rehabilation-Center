import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button } from '../components';
import { useDocumentTitle, useSiteContent } from '../hooks';
import logoImg from '../assets/logo.jpeg';

export const AboutPage = () => {
  useDocumentTitle('About Our Center & Mission');
  const { about, navbar } = useSiteContent();

  const logoSrc = navbar?.logoUrl || logoImg;
  const brandName = navbar?.brandName || 'Khyber Rehabilitation Center';
  const brandSubtitle = navbar?.brandSubtitle || 'Peshawar, Khyber Pakhtunkhwa';

  const valuesList = about?.values || [
    { id: 'v1', title: '1. Dignity & Respect', desc: 'Every patient is treated with unconditional human empathy, confidentiality, and respect, free from shame.' },
    { id: 'v2', title: '2. Clinical Excellence', desc: 'Evidence-based medical detoxification protocols, licensed clinical psychologists, and safe withdrawal supervision.' },
    { id: 'v3', title: '3. Economic Empowerment', desc: 'Rehabilitation without financial independence is incomplete; we teach tangible, marketable skills.' },
    { id: 'v4', title: '4. Family-Centered Healing', desc: 'Addiction affects the whole household. We actively engage families in guided counseling and reconciliation.' },
    { id: 'v5', title: '5. Relapse Prevention', desc: 'Long-term aftercare support, continuous mentoring, and peer alumni networks ensure endurance.' },
    { id: 'v6', title: '6. Transparency & Ethics', desc: 'Honest communication with patient families regarding prognosis, treatment progress, and facility operations.' },
  ];

  return (
    <div className="about-page">
      {/* Page Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle={about?.bannerSubtitle || 'About Our Institution'}
            title={about?.bannerTitle || 'Khyber Rehabilitation Center, Peshawar'}
            description={about?.bannerDesc || 'A dedicated clinical rehabilitation and human empowerment facility committed to restoring health and rebuilding lives.'}
          />
        </div>
      </section>

      {/* Introduction & Philosophy */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-12)' }}>
            <div>
              <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>
                {about?.storyBadge || 'Our Story & Purpose'}
              </span>
              <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', margin: 'var(--spacing-3) 0 var(--spacing-5)', fontWeight: 800 }}>
                {about?.storyTitle || 'Compassionate Rehabilitation Grounded in Dignity'}
              </h2>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-4)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                {about?.storyP1 || 'Located in Peshawar, Khyber Pakhtunkhwa, Khyber Rehabilitation Center was established with an unwavering conviction: that every person caught in the cycle of substance dependence, psychological hardship, or social marginalization deserves dignified, compassionate, and clinically rigorous care.'}
              </p>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                {about?.storyP2 || 'Rather than treating addiction solely as a clinical symptom, our center addresses the full person: physical detoxification, mental and psychological healing, moral rejuvenation, and sustainable vocational empowerment.'}
              </p>
              <div
                className="glass-card"
                style={{
                  padding: 'var(--spacing-4) var(--spacing-5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                }}
              >
                <span style={{ fontSize: '20px' }}>🏛️</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                  {about?.storyNotice || 'Operating under structured governance and healthcare ethics in Peshawar, Khyber Pakhtunkhwa.'}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                className="glass-card"
                style={{
                  padding: 'var(--spacing-10)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid rgba(1, 156, 220, 0.25)',
                }}
              >
                <img
                  src={logoSrc}
                  alt={brandName}
                  style={{ maxHeight: '190px', margin: '0 auto var(--spacing-5)', objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(1, 156, 220, 0.2))' }}
                />
                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.4rem', fontWeight: 800 }}>{brandName}</h3>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', marginTop: '4px', fontWeight: 600 }}>
                  📍 {brandSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', borderBottom: '1px solid rgba(1, 156, 220, 0.15)' }}>
        <div className="container">
          <div className="grid-2">
            <Card variant="highlight" hoverable>
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
                {about?.missionTitle || 'Our Mission'}
              </h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 'var(--font-size-sm)' }}>
                {about?.missionDesc || 'To provide world-class, clinically guided addiction detoxification, psychiatric psychotherapy, and trade skill craftsmanship (Fabric Cut Work and small business enterprise) in Peshawar. We commit to upholding patient dignity, ensuring zero discrimination, and guiding every recovered individual toward autonomous self-sufficiency.'}
              </p>
            </Card>

            <Card variant="highlight" hoverable>
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
                {about?.visionTitle || 'Our Vision'}
              </h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 'var(--font-size-sm)' }}>
                {about?.visionDesc || 'To establish Khyber Pakhtunkhwa’s premier model for comprehensive psychiatric and addiction rehabilitation—where clinical excellence and sustainable economic empowerment intersect, eradicating stigma and proving that every human being can rebuild an honorable life.'}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="container">
          <SectionHeader
            subtitle={about?.valuesBadge || 'Institutional Principles'}
            title={about?.valuesTitle || 'Core Values Guiding Our Care'}
            description={about?.valuesSubtitle || 'The foundational principles that guide every doctor, psychologist, nurse, and staff member at our facility.'}
          />
          <div className="grid-3">
            {valuesList.map((val) => (
              <Card key={val.id} variant="light-blue" hoverable>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)', fontWeight: 800 }}>
                  {val.title}
                </h4>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>
                  {val.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Leadership CTA */}
      <section className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', textAlign: 'center' }}>
        <div className="container">
          <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>
            Transparent Governance
          </span>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>
            {about?.govTitle || 'Institutional Leadership & Organizational Structure'}
          </h2>
          <p style={{ color: 'var(--color-gray-600)', maxWidth: '680px', margin: '0 auto var(--spacing-8)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            {about?.govDesc || 'Our center operates with an accountable hierarchy under clinical psychologists, medical specialists, and vocational trade directors.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <Link to="/leadership">
              <Button variant="primary" size="lg" className="btn-pill">
                Explore Leadership Org Chart →
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="btn-pill">
                Contact Admissions Office
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
