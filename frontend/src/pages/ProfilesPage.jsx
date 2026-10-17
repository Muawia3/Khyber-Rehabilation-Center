import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SectionHeader, Card, Button } from '../components';
import { useDocumentTitle } from '../hooks';
import { APP_NAME, CONTACT_INFO } from '../utils/constants';

export const ProfilesPage = () => {
  useDocumentTitle('Our Leadership & Departmental Profiles');
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');

  // Handle smooth scroll when URL has anchor hash (e.g. /profiles#ceo or /profiles#doctor)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  const filterOptions = [
    { id: 'all', label: 'All Profiles' },
    { id: 'ceo', label: 'CEO (Gul Dast / Guldees)' },
    { id: 'chairman', label: 'Chairman' },
    { id: 'doctor', label: 'Doctor & Nurses' },
    { id: 'admin', label: 'Admin & Security' },
    { id: 'psychologist', label: 'Psychologist' },
    { id: 'religious', label: 'Religious Teacher' },
  ];

  return (
    <div className="profiles-page">
      {/* 1. Header Banner */}
      <section
        className="section-padding bg-light-blue"
        style={{ borderBottom: '1px solid var(--color-primary-100)' }}
      >
        <div className="container">
          <SectionHeader
            subtitle="Organizational Structure & Governance"
            title="Leadership & Departmental Profiles"
            description="Our multi-tier organizational structure in Peshawar: from CEO and Chairman oversight to medical doctors, nursing staff, administrative management, psychologists, and spiritual counselors."
          />

          {/* Quick Filter Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
              marginTop: 'var(--spacing-6)',
            }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  if (filter.id !== 'all') {
                    const el = document.getElementById(filter.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-primary)',
                  backgroundColor:
                    activeFilter === filter.id ? 'var(--color-primary)' : 'var(--color-white)',
                  color:
                    activeFilter === filter.id ? 'var(--color-white)' : 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-xs)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-4)' }}>
            <Link to="/leadership">
              <Button variant="outline" size="sm">
                View Interactive Family Tree / Hierarchy →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Top / Parent Profile: CEO Gul Dast / Guldees */}
      {(activeFilter === 'all' || activeFilter === 'ceo') && (
        <section
          id="ceo"
          className="section-padding bg-white"
          style={{ scrollMarginTop: '90px' }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                Top / Parent Node
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-gray-900)' }}>
                Chief Executive Officer (CEO)
              </h2>
              <p
                style={{
                  color: 'var(--color-gray-600)',
                  maxWidth: '700px',
                  margin: '0 auto',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Executive leadership guiding clinical vision, medical ethics, vocational training, and patient rehabilitation across Khyber Pakhtunkhwa.
              </p>
            </div>

            {/* Featured CEO Card */}
            <div
              style={{
                backgroundColor: 'var(--color-primary-50)',
                border: '2px solid var(--color-primary-200)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-8)',
                boxShadow: 'var(--shadow-md)',
                display: 'grid',
                gridTemplateColumns: 'minmax(240px, 320px) 1fr',
                gap: 'var(--spacing-8)',
                alignItems: 'center',
              }}
              className="ceo-card-responsive"
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto var(--spacing-4)',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-primary), #0077aa)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(1, 156, 220, 0.25)',
                    border: '4px solid var(--color-white)',
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, marginTop: '4px' }}>
                    Parent Node
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    color: 'var(--color-primary-dark)',
                    marginBottom: '4px',
                  }}
                >
                  Gul Dast / Guldees
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-gray-800)',
                    fontWeight: 700,
                  }}
                >
                  Chief Executive Officer (CEO) & Founder
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 'var(--spacing-2)',
                    fontSize: '11px',
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-primary)',
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-primary-200)',
                    fontWeight: 600,
                  }}
                >
                  Peshawar, Khyber Pakhtunkhwa
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Leadership Mission & Vision
                </span>
                <h4
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    margin: 'var(--spacing-2) 0 var(--spacing-4)',
                    color: 'var(--color-gray-900)',
                    lineHeight: 1.3,
                  }}
                >
                  "Upholding Patient Dignity Through Medical Rigor & Economic Self-Reliance"
                </h4>

                <p
                  style={{
                    color: 'var(--color-gray-700)',
                    lineHeight: 1.8,
                    marginBottom: 'var(--spacing-4)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  At Khyber Rehabilitation Center, Naguman Charsadda Road, Peshawar, our mandate is grounded in unconditional empathy, healthcare integrity, and practical empowerment. With over 150+ patients successfully recovered and 85+ programs completed, we have established a sanctuary where every individual is treated with utmost honor.
                </p>

                <p
                  style={{
                    color: 'var(--color-gray-700)',
                    lineHeight: 1.8,
                    marginBottom: 'var(--spacing-5)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  From medical detoxification supervised by our doctor and round-the-clock nursing staff to Fabric Cut Work craftsmanship and small-business units (Loader Rickshaws, Chinchi Rickshaws, and Livestock), we provide a comprehensive roadmap to lifelong independence.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 'var(--spacing-3)',
                    borderTop: '1px solid var(--color-primary-200)',
                    paddingTop: 'var(--spacing-4)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-xs)' }}>
                      Helpline:
                    </strong>
                    <p style={{ fontSize: '13px', color: 'var(--color-gray-800)', margin: 0, fontWeight: 600 }}>
                      0300-7335962
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-xs)' }}>
                      Email:
                    </strong>
                    <p style={{ fontSize: '13px', color: 'var(--color-gray-800)', margin: 0, fontWeight: 600 }}>
                      info.krcpeshawar@gmail.com
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-xs)' }}>
                      Location:
                    </strong>
                    <p style={{ fontSize: '12px', color: 'var(--color-gray-600)', margin: 0 }}>
                      Naguman, Charsadda Road, Peshawar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Chairman Profile */}
      {(activeFilter === 'all' || activeFilter === 'chairman') && (
        <section
          id="chairman"
          className="section-padding bg-light-blue"
          style={{ borderTop: '1px solid var(--color-primary-100)', scrollMarginTop: '90px' }}
        >
          <div className="container">
            <SectionHeader
              subtitle="Executive Management (Child to CEO)"
              title="Chairman of the Board & Executive Governance"
              description="Directly reporting to the CEO, the Chairman oversees the 4 foundational pillars: Medical Doctor & Nurses, Administration & Security, Clinical Psychology, and Religious Spiritual Mentorship."
            />

            <Card variant="white" hoverable style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary-50)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-primary-200)',
                    flexShrink: 0,
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="section-badge" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    Executive Administration
                  </span>
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', margin: '4px 0' }}>
                    Executive Chairman
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                    Reports directly to: CEO (Gul Dast / Guldees)
                  </p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                    Responsible for overarching operational coordination across clinical, administrative, psychological, and spiritual services. Ensures institutional policies, safety standards, and rehabilitation protocols are implemented flawlessly across all departments.
                  </p>
                  <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                    <span>📍 Naguman Charsadda Road, Peshawar</span>
                    <span>📞 0300-7335962</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 4. Branch 1: Doctor & 3 Nurses */}
      {(activeFilter === 'all' || activeFilter === 'doctor') && (
        <section
          id="doctor"
          className="section-padding bg-white"
          style={{ borderTop: '1px solid var(--color-gray-200)', scrollMarginTop: '90px' }}
        >
          <div className="container">
            <SectionHeader
              subtitle="Branch 1: Medical Directorate"
              title="Medical Doctor & Inpatient Nursing Chain"
              description="Direct medical supervision ensuring safe detoxification and around-the-clock vital surveillance: Doctor ➔ Nurse 1 ➔ Nurse 2 ➔ Nurse 3."
            />

            <div className="grid-2" style={{ marginBottom: 'var(--spacing-8)' }}>
              {/* Doctor Card */}
              <Card variant="light-blue" hoverable style={{ border: '2px solid var(--color-primary-300)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <span className="section-badge" style={{ fontSize: '10px' }}>Incharge Medical</span>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                      Chief Medical Officer (Doctor)
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Medical Director & Detoxification Specialist
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                      Supervises medical intake, clinical detoxification protocols, somatic stabilization, and pharmaceutical regimens to manage withdrawal safely without complications.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                      Supervises: Head Nurse (Nurse 1)
                    </div>
                  </div>
                </div>
              </Card>

              {/* Head Nurse (Nurse 1) */}
              <Card variant="white" hoverable>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>N1</span>
                  </div>
                  <div>
                    <span className="section-badge" style={{ fontSize: '10px' }}>Reports to: Doctor</span>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                      Head Nurse (Nurse 1)
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                      Inpatient Nursing Supervisor
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                      Supervises the clinical nursing team, administers scheduled medications, monitors vital charts, and coordinates inpatient nursing shifts.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                      Supervises: Staff Nurse (Nurse 2)
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Nurse 2 and Nurse 3 Chain */}
            <div className="grid-2">
              <Card variant="white" hoverable>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>N2</span>
                  </div>
                  <div>
                    <span className="section-badge" style={{ fontSize: '10px' }}>Reports to: Nurse 1</span>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                      Staff Nurse (Nurse 2)
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                      Inpatient Clinical Care
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                      Dedicated physical health surveillance, regular blood pressure/glucose checks, IV therapy assistance, and round-the-clock withdrawal monitoring.
                    </p>
                    <div style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                      Supervises: Inpatient Care Nurse (Nurse 3)
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="white" hoverable>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>N3</span>
                  </div>
                  <div>
                    <span className="section-badge" style={{ fontSize: '10px' }}>Reports to: Nurse 2</span>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                      Inpatient Care Nurse (Nurse 3)
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                      Bedside Care & Patient Comfort
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                      Provides compassionate bedside patient care, dietary hydration assistance, personal hygiene support, and 24/7 patient responsiveness.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* 5. Branch 2: Admin & Security Guards */}
      {(activeFilter === 'all' || activeFilter === 'admin') && (
        <section
          id="admin"
          className="section-padding bg-light-blue"
          style={{ borderTop: '1px solid var(--color-primary-100)', scrollMarginTop: '90px' }}
        >
          <div className="container">
            <SectionHeader
              subtitle="Branch 2: Administration & Facility Security"
              title="Administration & Security Directorate"
              description="Ensuring secure facilities, disciplined logistics, admissions screening, and 24/7 safety: Admin ➔ Security Guards ➔ SG Staff."
            />

            <div className="grid-3">
              {/* Admin */}
              <Card variant="white" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <span className="section-badge" style={{ fontSize: '10px' }}>Operations Head</span>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                  Director of Administration (Admin)
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                  Facility Operations & Admissions Desk
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                  Directs daily center logistics, inpatient admissions records, dietary nutrition, residential hygiene, and facility protocol management.
                </p>
                <div style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                  Supervises: Security Guards (Supervisor)
                </div>
              </Card>

              {/* Security Guards (Supervisor) */}
              <Card variant="white" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="section-badge" style={{ fontSize: '10px' }}>Security In-Charge</span>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                  Security Guards (Supervisor)
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                  Head of Facility Security
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                  Oversees entrance gate protocols, visitor registration, perimeter surveillance, and safety measures across the center grounds.
                </p>
                <div style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                  Supervises: Residential Security Guard (SG)
                </div>
              </Card>

              {/* SG */}
              <Card variant="white" hoverable>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-3)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <span className="section-badge" style={{ fontSize: '10px' }}>24/7 Gate & Ward</span>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-900)', margin: '4px 0 2px' }}>
                  Security Guard (SG Staff)
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-2)' }}>
                  Residential Facility Guard
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                  Maintains continuous vigilance at entrances, guards resident patient safety, verifies authorized personnel, and ensures peace on premises.
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* 6. Branch 3: Psychologist */}
      {(activeFilter === 'all' || activeFilter === 'psychologist') && (
        <section
          id="psychologist"
          className="section-padding bg-white"
          style={{ borderTop: '1px solid var(--color-gray-200)', scrollMarginTop: '90px' }}
        >
          <div className="container">
            <SectionHeader
              subtitle="Branch 3: Mental Health & Psychotherapy"
              title="Clinical Psychology Directorate"
              description="Evidence-based psychological counseling, Cognitive Behavioral Therapy (CBT), and trauma resolution for permanent addiction recovery."
            />

            <Card variant="light-blue" hoverable style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-primary-300)',
                    flexShrink: 0,
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="section-badge" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    Mental Health Directorate
                  </span>
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', margin: '4px 0' }}>
                    Clinical Psychologist
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                    Cognitive Behavioral Therapy (CBT) & Emotional Rebuilding
                  </p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                    Conducts individual psychological assessments, trauma therapy, behavioral restructuring, and relapse trigger identification. Guides recovering individuals toward internal emotional mastery and family reconciliation.
                  </p>
                  <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                    <span>🧠 Individual CBT & Group Counseling</span>
                    <span>📞 0300-7335962</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 7. Branch 4: Religious Teacher */}
      {(activeFilter === 'all' || activeFilter === 'religious') && (
        <section
          id="religious"
          className="section-padding bg-light-blue"
          style={{ borderTop: '1px solid var(--color-primary-100)', scrollMarginTop: '90px' }}
        >
          <div className="container">
            <SectionHeader
              subtitle="Branch 4: Spiritual Mentorship & Ethics"
              title="Religious Spiritual Mentorship"
              description="Nourishing the soul through moral guidance, Islamic ethics, prayer discipline, and spiritual reconciliation."
            />

            <Card variant="white" hoverable style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary-50)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-primary-200)',
                    flexShrink: 0,
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <span className="section-badge" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    Spiritual Guidance
                  </span>
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', margin: '4px 0' }}>
                    Religious Teacher
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-dark)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                    Spiritual Counselor & Islamic Ethics Mentor
                  </p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                    Provides daily spiritual reflections, moral rejuvenation, Islamic ethics, and spiritual counseling. Helps patients reconnect with inner faith, conscience, and familial duties to support lifelong sobriety.
                  </p>
                  <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                    <span>📖 Moral Rejuvenation & Spiritual Counseling</span>
                    <span>📍 Naguman Charsadda Road, Peshawar</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 8. Institutional Call to Action */}
      <section className="section-padding bg-white" style={{ borderTop: '1px solid var(--color-gray-200)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-2)' }}>
            Need to Consult Our Executive or Clinical Team?
          </h2>
          <p
            style={{
              color: 'var(--color-gray-600)',
              maxWidth: '650px',
              margin: '0 auto var(--spacing-6)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Our leadership, doctor, psychologists, and admissions staff at Naguman, Charsadda Road, Peshawar are available 24/7 for dignified patient intake, family consultations, and confidential inquiries.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <Link to="/contact">
              <Button variant="primary" size="md">
                Send Confidential Inquiry (0300-7335962)
              </Button>
            </Link>
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md">
                WhatsApp Emergency Desk
              </Button>
            </a>
            <Link to="/leadership">
              <Button variant="secondary" size="md">
                View Interactive Tree Structure
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
