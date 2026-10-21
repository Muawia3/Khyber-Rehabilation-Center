import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Button, Card, RecoveryVideoSection } from '../components';
import { useDocumentTitle, useSiteContent } from '../hooks';
import { contentService } from '../services/contentService';
import { getFullImageUrl } from '../utils/imageUrl';
import { animateHeroEntrance, cleanupGsapContext } from '../utils/gsapAnimations';
import logoImg from '../assets/logo.jpeg';
import heroVisualImg from '../assets/hero_hope_recovery.jpg';
import clinicalDetoxImg from '../assets/clinical_detox_visual.jpg';
import vocationalSkillsImg from '../assets/vocational_skills_visual.jpg';
import './HomePage.css';

export const HomePage = () => {
  useDocumentTitle('Home - Restoring Health, Rebuilding Lives');
  const heroRef = useRef(null);

  const {
    hero,
    homepageSections,
    homepageIntro,
    homepageStages,
    homepageTreatmentSec,
    homepageSkillsSec,
    homepageStoriesSec,
    homepageCtaSec,
    navbar,
    contact,
  } = useSiteContent();

  const [treatments, setTreatments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Load live items for showcases
    contentService.getTreatments().then((r) => setTreatments((r?.data || []).slice(0, 3))).catch(() => { });
    contentService.getSkills().then((r) => setSkills((r?.data || []).slice(0, 3))).catch(() => { });
    contentService.getAnnouncements().then((r) => setAnnouncements((r?.data || []).slice(0, 2))).catch(() => { });
    contentService.getStories(true).then((r) => setStories((r?.data || []).slice(0, 2))).catch(() => { });
  }, []);

  // Run GSAP entrance animation for Hero section
  useEffect(() => {
    const ctx = animateHeroEntrance(heroRef.current);
    return () => cleanupGsapContext(ctx);
  }, []);

  // Sort and filter active sections
  const activeSections = [...(homepageSections || [])]
    .filter((sec) => sec.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Dynamic 4-Stage Recovery Roadmap
  const stagesList = [
    {
      step: homepageStages?.stage1Step || '01',
      phaseTag: 'Phase 01 • Clinical Stabilization',
      title: homepageStages?.stage1Title || 'Medical Assessment & Detoxification',
      description:
        homepageStages?.stage1Desc ||
        'Direct medical supervision by qualified doctors and round-the-clock nursing care to manage withdrawal symptoms safely and with dignity.',
      outcome: 'Safe Clinical Detox & Vitals Normalization',
    },
    {
      step: homepageStages?.stage2Step || '02',
      phaseTag: 'Phase 02 • Cognitive Renewal',
      title: homepageStages?.stage2Title || 'Psychotherapy & Spiritual Counseling',
      description:
        homepageStages?.stage2Desc ||
        'Clinical psychology sessions combined with moral and ethical guidance from our dedicated religious teacher.',
      outcome: 'Trauma Resolution & Relapse Defense',
    },
    {
      step: homepageStages?.stage3Step || '03',
      phaseTag: 'Phase 03 • Vocational Craftsmanship',
      title: homepageStages?.stage3Title || 'Fabric Cut Work & Vocational Skills',
      description:
        homepageStages?.stage3Desc ||
        'Specialized fabric cutting, pattern designing, and textile tailoring skills to empower patients with marketable craftsmanship.',
      outcome: 'Artisan Mastery & Practical Trade Skills',
    },
    {
      step: homepageStages?.stage4Step || '04',
      phaseTag: 'Phase 04 • Sustainable Autonomy',
      title: homepageStages?.stage4Title || 'Small Business Empowerment & Reintegration',
      description:
        homepageStages?.stage4Desc ||
        'Sustainable livelihood pathways including Loader Rickshaw, Chinchi Rickshaw, and Livestock management for 150+ recovered alumni.',
      outcome: 'Self-Sustaining Economic Reintegration',
    },
  ];

  // Renderers for standard and custom sections
  const renderSection = (sec) => {
    switch (sec.type) {
      case 'hero':
        return (
          <section
            key={sec.id}
            ref={heroRef}
            className="hero-section bg-noise"
          >
            {/* Atmospheric Lighting Beacons */}
            <div className="hero-ambient-orb-1"></div>
            <div className="hero-ambient-orb-2"></div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="hero-grid">
                <div className="hero-content">
                  {/* Telemetry and Status Meta Row */}
                  <div className="hero-meta-row hero-badge-wrap">
                    <span className="hero-live-pill">
                      <span className="pulse-dot"></span>
                      {hero?.badgeTop || '24/7 Inpatient Care'}
                    </span>
                    <span className="hero-telemetry-badge">
                      📍 34.1213° N, 71.6388° E • Peshawar
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                      {hero?.badge || '150+ Patients Recovered • 85+ Programs'}
                    </span>
                  </div>

                  {/* Expressive Editorial Headline */}
                  <h1 className="hero-title-main hero-title-anim">
                    {hero?.title ? (
                      hero.title
                    ) : (
                      <>
                        Restoring Dignity.
                        <br />
                        <span className="hero-title-gradient">Rebuilding Lives in Peshawar.</span>
                      </>
                    )}
                  </h1>

                  {/* Subtitle */}
                  <p className="hero-description hero-sub-anim">
                    {hero?.subtitle ||
                      'Khyber Rehabilitation Center provides compassionate, evidence-based addiction treatment, psychiatric rehabilitation, and vocational skills development in Peshawar.'}
                  </p>

                  {/* Magnetic Call to Action Buttons */}
                  <div className="hero-cta-group hero-btns-anim">
                    <Link to={hero?.primaryBtnLink || '/contact'}>
                      <Button variant="primary" size="lg" className="btn-pill btn-magnetic">
                        {hero?.primaryBtnText || '24/7 Confidential Admission'}
                      </Button>
                    </Link>
                    <Link to={hero?.secondaryBtnLink || '/treatment'}>
                      <Button variant="outline" size="lg" className="btn-pill btn-magnetic">
                        {hero?.secondaryBtnText || 'Explore Our Programs'}
                      </Button>
                    </Link>
                    <a href={contact?.whatsappLink || 'https://wa.me/?text=Hello'} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" size="lg" className="btn-pill btn-magnetic">
                        {hero?.whatsappBtnText || 'WhatsApp Support'}
                      </Button>
                    </a>
                  </div>

                  {/* Clinical Trust Badges */}
                  <div className="hero-trust-strip hero-trust-anim">
                    <div className="trust-item">
                      <div className="trust-icon-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <span className="trust-label">{hero?.badge1 || '100% Confidential Medical Care'}</span>
                    </div>
                    <div className="trust-item">
                      <div className="trust-icon-wrap">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <span className="trust-label">{hero?.badge2 || 'Emergency 24/7 Admissions'}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Visual Composition with Layered Satellite Badges */}
                <div className="hero-visual-canvas">
                  {/* Floating Satellite Chips (Desktop absolute, mobile flex) */}
                  <div className="hero-chips-wrap">
                    <div className="hero-floating-chip hero-floating-chip-1">
                      <span className="floating-icon-cyan">✨</span>
                      <span>150+ Recovered Alumni</span>
                    </div>
                    <div className="hero-floating-chip hero-floating-chip-2">
                      <span className="floating-icon-cyan">🛡️</span>
                      <span>100% Medical Confidentiality</span>
                    </div>
                  </div>

                  {/* Centerpiece Frosted Card */}
                  <div className="hero-visual-card">
                    <div className="hero-visual-media-frame">
                      <img
                        src={
                          hero?.heroImage && !hero.heroImage.includes('WhatsAppImage2026-10-12')
                            ? getFullImageUrl(hero.heroImage)
                            : heroVisualImg
                        }
                        alt="Khyber Rehabilitation Center - Pathway to Sobriety & Recovery"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = heroVisualImg;
                        }}
                        className="hero-visual-img"
                        loading="eager"
                      />
                      <div className="hero-visual-badge-overlay">
                        <span className="hero-overlay-tag">
                          <span>🌱</span> Pathway of Dignity & Recovery
                        </span>
                      </div>
                    </div>

                    <div className="hero-visual-info">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                        <img
                          src={navbar?.logoUrl || logoImg}
                          alt="KRC Crest"
                          style={{ width: '26px', height: '26px', objectFit: 'contain', borderRadius: '4px', background: '#ffffff', padding: '2px', border: '1px solid rgba(1, 156, 220, 0.25)' }}
                        />
                        <h3 className="hero-visual-title" style={{ margin: 0 }}>
                          {navbar?.brandName || 'Khyber Rehabilitation Center'}
                        </h3>
                      </div>
                      <p className="hero-visual-sub">
                        📍 {navbar?.topBarText || 'Naguman, Charsadda Road, Near Gulbela Peshawar'}
                      </p>
                      <div className="hero-mission-box">
                        <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '3px' }}>
                          {hero?.cardMissionLabel || 'Clinical Mission:'}
                        </strong>
                        {hero?.cardMissionText ||
                          'Healing body, mind, and spirit through medical supervision, psychological counseling, and vocational trades.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'announcements':
        if (!announcements || announcements.length === 0) return null;
        return (
          <section key={sec.id} className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.15)', padding: 'var(--spacing-8) 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-5)' }}>
                <span style={{ fontSize: '22px' }}>📢</span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-gray-900)', fontWeight: 800 }}>
                  Active Center Notices & Announcements
                </h3>
              </div>
              <div className="notice-strip-container">
                {announcements.map((a) => (
                  <div key={a.id} className="notice-card">
                    <span className="glow-badge" style={{ fontSize: '10px', padding: '2px 10px', alignSelf: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                      {a.category || 'Official Notice'}
                    </span>
                    <h4 style={{ fontSize: '1.08rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)', fontWeight: 700 }}>
                      {a.title}
                    </h4>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                      {a.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'intro':
        return (
          <React.Fragment key={sec.id}>
            <section className="section-padding bg-white bg-noise">
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-12)' }}>
                  <div>
                    <SectionHeader
                      align="left"
                      subtitle={homepageIntro?.badge || 'Our Mission in Peshawar'}
                      title={homepageIntro?.title || 'A Dignified Path Toward Permanent Sobriety'}
                      description={
                        homepageIntro?.description ||
                        'At Khyber Rehabilitation Center, we treat individuals suffering from addiction and mental health challenges with unconditional empathy and clinical rigor.'
                      }
                    />
                    <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)', lineHeight: 1.8, fontSize: 'var(--font-size-md)' }}>
                      {homepageIntro?.paragraphText ||
                        'Addiction is a chronic disease requiring structured medical stabilization, psychiatric psychotherapy, family counseling, and socio-economic support. Our multidisciplinary team works tirelessly to restore self-respect.'}
                    </p>
                    <Link to={homepageIntro?.btnLink || '/about'}>
                      <Button variant="outline" size="md" className="btn-pill btn-magnetic">
                        {homepageIntro?.btnText || 'Learn More About Our Center →'}
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <div className="glass-card" style={{ padding: 'var(--spacing-8)' }}>
                      <div className="intro-pillars-banner">
                        <img
                          src={clinicalDetoxImg}
                          alt="Clinical Detoxification & Patient Healthcare"
                          className="intro-pillars-banner-img"
                          loading="lazy"
                        />
                        <div className="intro-pillars-banner-overlay">
                          <span>🛡️ Medically Supervised Inpatient Care • 24/7 Monitoring</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-6)', fontWeight: 800 }}>
                        {homepageIntro?.pillarsTitle || 'Our Three Core Pillars'}
                      </h3>
                      <div className="pillar-card-wrap">
                        <div className="pillar-item">
                          <div className="pillar-num">01</div>
                          <div className="pillar-content">
                            <h4>{homepageIntro?.pillar1Title || 'Medical Detoxification'}</h4>
                            <p>{homepageIntro?.pillar1Desc || 'Supervised clinical withdrawal in safe residential facilities with 24/7 vitals surveillance.'}</p>
                          </div>
                        </div>
                        <div className="pillar-item">
                          <div className="pillar-num">02</div>
                          <div className="pillar-content">
                            <h4>{homepageIntro?.pillar2Title || 'Psychological Psychotherapy'}</h4>
                            <p>{homepageIntro?.pillar2Desc || 'Cognitive Behavioral Therapy (CBT), trauma counseling, and personalized relapse prevention plans.'}</p>
                          </div>
                        </div>
                        <div className="pillar-item">
                          <div className="pillar-num">03</div>
                          <div className="pillar-content">
                            <h4>{homepageIntro?.pillar3Title || 'Fabric Cut Work & Small Businesses'}</h4>
                            <p>{homepageIntro?.pillar3Desc || 'Specialized Fabric Cut Work craftsmanship and sustainable small businesses (Loader Rickshaws, Chinchi Rickshaws, Livestock) empowering patients with self-reliance.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Cinematic Recovery Video Story Section */}
            <RecoveryVideoSection />
          </React.Fragment>
        );

      case 'video':
        return <RecoveryVideoSection key={sec.id} />;

      case 'treatment':
        return (
          <section key={sec.id} className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)' }}>
            <div className="container">
              <SectionHeader
                subtitle={homepageTreatmentSec?.badge || 'Clinical Care & Recovery'}
                title={homepageTreatmentSec?.title || 'Structured Treatment Programs'}
                description={
                  homepageTreatmentSec?.description ||
                  'Evidence-based clinical rehabilitation programs designed to ensure safety and sustainable healing in Peshawar.'
                }
              />
              <div className="grid-3">
                {treatments.length > 0 ? (
                  treatments.map((t) => (
                    <Card key={t.id} variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>
                        {t.category || 'Inpatient Detox'}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)' }}>
                        {t.title}
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-6)' }}>
                        {t.summary || (t.description ? t.description.slice(0, 115) + '...' : '')}
                      </p>
                      <Link to="/treatment">
                        <Button variant="outline" size="sm" className="btn-pill btn-magnetic">Program Details →</Button>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Clinical Stage 1</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Medical Detoxification</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Supervised somatic detox protocols under direct medical observation in Peshawar.
                      </p>
                      <Link to="/treatment">
                        <Button variant="outline" size="sm" className="btn-pill">Learn More →</Button>
                      </Link>
                    </Card>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Clinical Stage 2</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Individual Psychotherapy</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Evidence-based behavioral therapy, trauma counseling, and trigger management.
                      </p>
                      <Link to="/treatment">
                        <Button variant="outline" size="sm" className="btn-pill">Learn More →</Button>
                      </Link>
                    </Card>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Reintegration</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Family Reconciliation</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Structured mediation to heal broken relationships and create an enduring recovery ecosystem.
                      </p>
                      <Link to="/treatment">
                        <Button variant="outline" size="sm" className="btn-pill">Learn More →</Button>
                      </Link>
                    </Card>
                  </>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-10)' }}>
                <Link to={homepageTreatmentSec?.btnLink || '/treatment'}>
                  <Button variant="primary" size="lg" className="btn-pill btn-magnetic">
                    {homepageTreatmentSec?.btnText || 'View All Treatment Programs'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );

      case 'stages':
        return (
          <section key={sec.id} className="section-padding bg-white bg-noise">
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <SectionHeader
                subtitle={homepageStages?.badge || 'Roadmap to Freedom'}
                title={homepageStages?.title || 'The Four-Stage Recovery Pathway'}
                description={
                  homepageStages?.description ||
                  'Our multidisciplinary framework guiding individuals from physical withdrawal to economic autonomy in Peshawar.'
                }
              />
              <div className="roadmap-container">
                {/* Connecting Track Line */}
                <div className="roadmap-track-rail"></div>

                <div className="roadmap-grid">
                  {stagesList.map((stg) => (
                    <div key={stg.step} className="roadmap-card">
                      <div className="roadmap-step-badge">{stg.step}</div>
                      <span className="roadmap-phase-tag">{stg.phaseTag}</span>
                      <h3 className="roadmap-card-title">{stg.title}</h3>
                      <p className="roadmap-card-desc">{stg.description}</p>
                      <div className="roadmap-outcome-pill">
                        <span>🎯</span>
                        <span>{stg.outcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'skills':
        return (
          <section key={sec.id} className="section-padding bg-mesh" style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)' }}>
            <div className="container">
              <SectionHeader
                subtitle={homepageSkillsSec?.badge || 'Trade Skills & Sustainable Livelihood'}
                title={homepageSkillsSec?.title || 'Fabric Cut Work & Vocational Empowerment'}
                description={
                  homepageSkillsSec?.description ||
                  'Recovering patients learn specialized Fabric Cut Work, precision pattern drafting, cutwork embroidery, and tailoring.'
                }
              />

              {/* Master Craft Spotlight Box */}
              <div className="craft-spotlight-box">
                <div className="craft-spotlight-visual">
                  <img
                    src={vocationalSkillsImg}
                    alt="Fabric Cut Work Workshop & Vocational Tailoring"
                    className="craft-spotlight-img"
                    loading="lazy"
                  />
                  <div className="craft-spotlight-badge">
                    <span>✂️ Master Trade Atelier</span>
                  </div>
                </div>

                <div className="craft-spotlight-content">
                  <span className="tag-pill">🎨 Specialized Master Atelier</span>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-gray-900)', marginTop: '8px', marginBottom: '6px', fontWeight: 800 }}>
                    Fabric Cut Work Workshop — Crafting Pride & Marketable Skills
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65 }}>
                    Recovering individuals rebuild neurological focus and mental calm through intricate fabric cutwork, eyelet needlework, and complete garment assembly. Finished handcrafted textiles are featured in our catalog.
                  </p>
                  <div className="craft-tag-row">
                    <span className="telemetry-badge" style={{ fontSize: '11px' }}>✂️ Precision Scissor Drafting</span>
                    <span className="telemetry-badge" style={{ fontSize: '11px' }}>🪡 Cutwork Needlework</span>
                    <span className="telemetry-badge" style={{ fontSize: '11px' }}>👔 Bespoke Tailoring</span>
                  </div>
                  <div style={{ marginTop: 'var(--spacing-5)' }}>
                    <Link to="/products">
                      <Button variant="primary" size="md" className="btn-pill btn-magnetic">
                        View Handcrafted Catalog →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid-3">
                {skills.length > 0 ? (
                  skills.map((s) => (
                    <Card key={s.id} variant="white" hoverable>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                        <span className="glow-badge" style={{ fontSize: '10px' }}>{s.category || 'Fabric Cut Work'}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                          ⏱️ {s.duration || '3 Months'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)' }}>
                        {s.title}
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-6)' }}>
                        {s.description?.slice(0, 115) + '...'}
                      </p>
                      <Link to="/skills">
                        <Button variant="outline" size="sm" className="btn-pill btn-magnetic">Learn More →</Button>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Trade Module 1</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Pattern Drafting & Precision Cutting</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Geometric patterns, fabric scaling, and precision scissor cutting.
                      </p>
                      <Link to="/skills">
                        <Button variant="outline" size="sm" className="btn-pill">Module Details →</Button>
                      </Link>
                    </Card>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Trade Module 2</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Hand & Machine Cutwork Embroidery</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Floral motifs, eyelet openwork, and fine artistic needlework.
                      </p>
                      <Link to="/skills">
                        <Button variant="outline" size="sm" className="btn-pill">Module Details →</Button>
                      </Link>
                    </Card>
                    <Card variant="white" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>Trade Module 3</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gray-900)' }}>Garment Stitching & Assembly</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', marginTop: '8px', lineHeight: 1.65, marginBottom: 'var(--spacing-5)' }}>
                        Sewing machine operation and complete apparel tailoring.
                      </p>
                      <Link to="/skills">
                        <Button variant="outline" size="sm" className="btn-pill">Module Details →</Button>
                      </Link>
                    </Card>
                  </>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-10)' }}>
                <Link to={homepageSkillsSec?.btnLink || '/skills'}>
                  <Button variant="primary" size="lg" className="btn-pill btn-magnetic">
                    {homepageSkillsSec?.btnText || 'Explore All Skill Programs'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );

      case 'stories':
        return (
          <section key={sec.id} className="section-padding bg-white bg-noise">
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <SectionHeader
                subtitle={homepageStoriesSec?.badge || '150+ Recovered Patients Milestone'}
                title={homepageStoriesSec?.title || 'Stories of Recovery & Reintegration'}
                description={
                  homepageStoriesSec?.description ||
                  'Celebrating over 150+ patients recovered and 85+ programs completed through clinical detoxification, Fabric Cut Work, and small-business units in Peshawar.'
                }
              />
              <div className="grid-2">
                {stories.length > 0 ? (
                  stories.map((st) => (
                    <Card key={st.id} variant="light-blue" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>
                        {st.recoveryPeriod || '2+ Years Clean'}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)' }}>
                        "{st.title}"
                      </h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.7, marginBottom: 'var(--spacing-4)' }}>
                        {st.story?.slice(0, 160) + '...'}
                      </p>
                      <strong style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', display: 'block' }}>
                        — {st.patientIdentifier || 'Center Graduate (Naguman Charsadda Road, Peshawar)'}
                      </strong>
                    </Card>
                  ))
                ) : (
                  <>
                    <Card variant="light-blue" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>150+ Patients Milestone</span>
                      <h3 style={{ fontSize: '1.2rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)' }}>
                        From Addiction to Fabric Cut Work Mastery
                      </h3>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>
                        With 24/7 medical supervision and training in our Fabric Cut Work workshop, recovering individuals regain their focus and rebuild family honor.
                      </p>
                    </Card>
                    <Card variant="light-blue" hoverable>
                      <span className="glow-badge" style={{ fontSize: '10px', marginBottom: 'var(--spacing-3)' }}>85+ Programs Completed</span>
                      <h3 style={{ fontSize: '1.2rem', margin: 'var(--spacing-2) 0', color: 'var(--color-gray-900)' }}>
                        Dignified Living Through Loader Rickshaw Fleet
                      </h3>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>
                        Our graduates operate commercial goods transit and passenger routes across Peshawar and Charsadda Road with sustained financial independence.
                      </p>
                    </Card>
                  </>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-10)' }}>
                <Link to={homepageStoriesSec?.btnLink || '/success-stories'}>
                  <Button variant="outline" size="md" className="btn-pill btn-magnetic">
                    {homepageStoriesSec?.btnText || 'Read Full Stories →'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={sec.id} className="cta-banner-glass">
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <span className="tag-pill" style={{ marginBottom: 'var(--spacing-3)', background: 'rgba(1, 156, 220, 0.12)' }}>
                🏥 Immediate Intake & Guidance
              </span>
              <h2 className="cta-title-main">
                {homepageCtaSec?.title || 'Ready to Take the First Step Toward Recovery?'}
              </h2>
              <p style={{ color: 'var(--color-gray-600)', maxWidth: '680px', margin: '0 auto var(--spacing-8)', fontSize: '1.15rem', lineHeight: 1.7 }}>
                {homepageCtaSec?.description ||
                  'Our medical team and admissions counselors are available 24/7 in Peshawar to assist you with compassionate, strictly confidential intake.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                <Link to={homepageCtaSec?.primaryBtnLink || '/contact'}>
                  <Button variant="primary" size="lg" className="btn-pill btn-magnetic">
                    {homepageCtaSec?.primaryBtnText || 'Contact Admissions Office'}
                  </Button>
                </Link>
                <a href={contact?.whatsappLink || 'https://wa.me/?text=Hello'} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" size="lg" className="btn-pill btn-magnetic">
                    {homepageCtaSec?.whatsappBtnText || 'WhatsApp Helpline'}
                  </Button>
                </a>
              </div>
            </div>
          </section>
        );

      // Custom Reusable Section Types created by Admin
      case 'custom_cta':
        return (
          <section
            key={sec.id}
            className={`section-padding ${sec.bg === 'light-blue' ? 'bg-mesh' : 'bg-white'}`}
            style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)', textAlign: 'center' }}
          >
            <div className="container">
              {sec.badge && <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)', display: 'inline-block' }}>{sec.badge}</span>}
              <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.5rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>
                {sec.title}
              </h2>
              {sec.content && (
                <p style={{ color: 'var(--color-gray-600)', maxWidth: '720px', margin: '0 auto var(--spacing-8)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  {sec.content}
                </p>
              )}
              {sec.buttonText && (
                <Link to={sec.buttonLink || '/contact'}>
                  <Button variant="primary" size="lg" className="btn-pill btn-magnetic">{sec.buttonText}</Button>
                </Link>
              )}
            </div>
          </section>
        );

      case 'custom_text':
        return (
          <section
            key={sec.id}
            className={`section-padding ${sec.bg === 'light-blue' ? 'bg-mesh' : 'bg-white'}`}
            style={{ borderTop: '1px solid rgba(1, 156, 220, 0.15)' }}
          >
            <div className="container">
              {sec.badge && <span className="glow-badge" style={{ marginBottom: 'var(--spacing-2)' }}>{sec.badge}</span>}
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-gray-900)', margin: 'var(--spacing-2) 0 var(--spacing-4)', fontWeight: 800 }}>
                {sec.title}
              </h2>
              <div style={{ color: 'var(--color-gray-700)', lineHeight: 1.85, fontSize: 'var(--font-size-base)', whiteSpace: 'pre-line' }}>
                {sec.content}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return <div className="home-page">{activeSections.map((sec) => renderSection(sec))}</div>;
};
