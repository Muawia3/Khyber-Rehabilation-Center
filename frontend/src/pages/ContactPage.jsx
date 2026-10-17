import React, { useState } from 'react';
import { SectionHeader, Card, Button, Alert } from '../components';
import { useDocumentTitle, useSiteContent } from '../hooks';
import { CONTACT_INFO } from '../utils/constants';
import { inquiryService } from '../services/inquiryService';

export const ContactPage = () => {
  useDocumentTitle('Contact & Admissions Helpline');
  const { contact } = useSiteContent();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    inquiryType: 'Admission & Detox',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await inquiryService.submitContactForm(formData);
      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        inquiryType: 'Admission & Detox',
        message: '',
      });
    } catch (err) {
      setSubmitError(
        err.message || 'An error occurred while submitting your inquiry. Please try again or call our helpline.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const address = contact?.address || CONTACT_INFO.addressDisplay;
  const phone = contact?.phone || CONTACT_INFO.phoneDisplay;
  const whatsapp = contact?.whatsapp || CONTACT_INFO.whatsappDisplay;
  const whatsappLink = contact?.whatsappLink || CONTACT_INFO.whatsappLink;
  const email = contact?.email || CONTACT_INFO.email;
  const hours = contact?.hours || CONTACT_INFO.hours;
  const bannerTitle = contact?.bannerTitle || 'Contact Khyber Rehabilitation Center';
  const bannerSubtitle = contact?.bannerSubtitle || 'Admissions & Helpline';
  const [mapProvider, setMapProvider] = useState('google');
  const [copyStatus, setCopyStatus] = useState(false);

  const bannerDesc = contact?.bannerDesc || 'Our admissions coordinators and medical team in Peshawar are available 24/7 for confidential consultations, guidance, and intake assistance.';
  const confidentialityNotice = contact?.confidentialityNotice || 'All calls, messages, and inquiries submitted to Khyber Rehabilitation Center are strictly confidential. Inpatient admissions are accepted 24 hours a day, 7 days a week.';
  const locationNote = contact?.locationNote || 'Our center is located at Naguman, Charsadda Rd, Near Gulbella, Peshawar, Pakistan. Dedicated transport assistance and patient reception are coordinated 24/7 via 0300-7335962.';
  const verifiedMapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.748680789726!2d71.6362626763489!3d34.12130727313203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93f005f326fff%3A0x6b7e8f86574a6d55!2sKHYBER%20REHABILITATION%20CENTRE!5e0!3m2!1sen!2spk!5m2!1sen!2spk';
  const osmMapEmbedUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=71.6288376%2C34.1163073%2C71.6488376%2C34.1263073&layer=mapnik&marker=34.1213073%2C71.6388376';
  const googleMapsDirectUrl = 'https://www.google.com/maps/place/KHYBER+REHABILITATION+CENTRE/@34.1213073,71.6388376,17z/data=!3m1!4b1!4m6!3m5!1s0x38d93f005f326fff:0x6b7e8f86574a6d55!8m2!3d34.1213073!4d71.6388376!16s%2Fg%2F11vpnm_xcm';
  const googleDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=34.1213073,71.6388376';

  const rawMapUrl = contact?.mapEmbedUrl;
  const mapEmbedUrl = (rawMapUrl && (rawMapUrl.includes('0x38d93f005f326fff') || rawMapUrl.includes('KHYBER') || rawMapUrl.includes('google.com/maps')))
    ? rawMapUrl.replace('!4v1710000000000', '')
    : verifiedMapEmbedUrl;

  const currentEmbedUrl = mapProvider === 'osm' ? osmMapEmbedUrl : mapEmbedUrl;

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText('4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan (34.121307, 71.638838)');
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2500);
  };

  return (
    <div className="contact-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle={bannerSubtitle}
            title={bannerTitle}
            description={bannerDesc}
          />
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="section-padding bg-white">
        <div className="container">
          {/* Emergency / Medical Notice Alert */}
          {confidentialityNotice && (
            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <Alert type="info" title="Immediate Care & Confidentiality Notice">
                {confidentialityNotice}
              </Alert>
            </div>
          )}

          <div className="grid-2" style={{ gap: 'var(--spacing-12)', alignItems: 'start' }}>
            {/* Contact Details & Center Info Column */}
            <div>
              <Card variant="light-blue" style={{ marginBottom: 'var(--spacing-8)' }}>
                <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>Center Coordinates</span>
                <h3 style={{ fontSize: '1.35rem', margin: 'var(--spacing-2) 0 var(--spacing-5)', color: 'var(--color-gray-900)', fontWeight: 800 }}>
                  Direct Contact Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--color-primary)', marginTop: '2px', background: 'rgba(1, 156, 220, 0.1)', padding: '8px', borderRadius: '50%' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>Center Facility Location:</strong>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
                        {address}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--color-primary)', marginTop: '2px', background: 'rgba(1, 156, 220, 0.1)', padding: '8px', borderRadius: '50%' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>Admissions & Emergency Line:</strong>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
                        <a href={`tel:${phone}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>{phone}</a>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                    <div style={{ color: '#25D366', marginTop: '2px', background: 'rgba(37, 211, 102, 0.12)', padding: '8px', borderRadius: '50%' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>WhatsApp Support Line:</strong>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', margin: '2px 0 var(--spacing-3)' }}>
                        {whatsapp}
                      </p>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="whatsapp" size="sm" className="btn-pill">Open WhatsApp Consultation</Button>
                      </a>
                    </div>
                  </div>

                  {email && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--color-primary)', marginTop: '2px', background: 'rgba(1, 156, 220, 0.1)', padding: '8px', borderRadius: '50%' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>Email Address:</strong>
                        <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
                          <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
                        </p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--color-primary)', marginTop: '2px', background: 'rgba(1, 156, 220, 0.1)', padding: '8px', borderRadius: '50%' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: 'var(--font-size-sm)' }}>Care Timings:</strong>
                      <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
                        {hours}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map & Facility Location Interactive Section */}
              <Card variant="white" hoverable style={{ padding: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="glow-badge" style={{ marginBottom: '4px' }}>GPS Verified Facility</span>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--color-gray-900)', margin: '4px 0 0', fontWeight: 800 }}>
                      Center Location & Map
                    </h4>
                  </div>

                  {/* Map Provider Selector */}
                  <div style={{ display: 'inline-flex', background: 'rgba(1, 156, 220, 0.08)', borderRadius: 'var(--radius-full)', padding: '3px', border: '1px solid rgba(1, 156, 220, 0.2)' }}>
                    <button
                      type="button"
                      onClick={() => setMapProvider('google')}
                      style={{
                        background: mapProvider === 'google' ? 'var(--gradient-brand-vibrant)' : 'transparent',
                        color: mapProvider === 'google' ? '#fff' : 'var(--color-gray-700)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🗺️ Google Maps
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapProvider('osm')}
                      style={{
                        background: mapProvider === 'osm' ? 'var(--gradient-brand-vibrant)' : 'transparent',
                        color: mapProvider === 'osm' ? '#fff' : 'var(--color-gray-700)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🌍 OpenStreetMap
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6, marginBottom: 'var(--spacing-4)' }}>
                  {locationNote}
                </p>

                {/* Quick Action Navigation Bar */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--spacing-3)' }}>
                  <a
                    href={googleMapsDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-badge"
                    style={{
                      textDecoration: 'none',
                      fontSize: '11px',
                      background: 'linear-gradient(135deg, rgba(1, 156, 220, 0.15), rgba(0, 119, 170, 0.2))',
                      color: 'var(--color-primary-dark)',
                      border: '1px solid rgba(1, 156, 220, 0.35)',
                    }}
                  >
                    <span>📍 Open in Google Maps</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-badge"
                    style={{
                      textDecoration: 'none',
                      fontSize: '11px',
                      background: 'rgba(37, 211, 102, 0.12)',
                      color: '#128c7e',
                      border: '1px solid rgba(37, 211, 102, 0.3)',
                    }}
                  >
                    <span>🚗 Get Directions</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLocation}
                    className="glow-badge"
                    style={{
                      border: '1px solid rgba(1, 156, 220, 0.25)',
                      background: copyStatus ? 'rgba(16, 185, 129, 0.15)' : '#ffffffd9',
                      color: copyStatus ? '#065f46' : 'var(--color-gray-700)',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    <span>{copyStatus ? '✓ Coordinates Copied!' : '📋 Copy Plus Code (4JCQ+GGG)'}</span>
                  </button>
                </div>

                {/* Map Display Frame */}
                {currentEmbedUrl && (
                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '340px', border: '1.5px solid rgba(1, 156, 220, 0.25)', boxShadow: 'var(--shadow-sm)', position: 'relative', background: '#f0f8fd' }}>
                    <iframe
                      src={currentEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Khyber Rehabilitation Center Map Location"
                    />
                  </div>
                )}

                {/* Helpful note for visitors */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'var(--color-gray-500)', flexWrap: 'wrap', gap: '6px' }}>
                  <span>Coordinates: 34.121307° N, 71.638838° E • Naguman, Charsadda Rd, Peshawar</span>
                  {mapProvider === 'google' && (
                    <button
                      type="button"
                      onClick={() => setMapProvider('osm')}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '11px', fontWeight: 600 }}
                    >
                      Map not loading? Switch to OpenStreetMap
                    </button>
                  )}
                </div>
              </Card>
            </div>

            {/* Confidential Inquiry Form */}
            <div>
              <Card variant="highlight">
                <span className="glow-badge" style={{ marginBottom: 'var(--spacing-3)' }}>Confidential Inquiry</span>
                <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)', margin: 'var(--spacing-2) 0 var(--spacing-5)', color: 'var(--color-gray-900)', fontWeight: 800 }}>
                  Send an Inquiry or Consultation Request
                </h3>

                {submitError && (
                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <Alert
                      type="danger"
                      title="Submission Notice"
                      onClose={() => setSubmitError(null)}
                    >
                      {submitError}
                    </Alert>
                  </div>
                )}

                {submitted ? (
                  <div
                    className="glass-card"
                    style={{
                      padding: 'var(--spacing-8)',
                      textAlign: 'center',
                      background: 'rgba(236, 253, 245, 0.9)',
                      borderColor: '#a7f3d0',
                    }}
                  >
                    <div style={{ color: 'var(--color-success)', fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>
                      ✓
                    </div>
                    <h4 style={{ color: '#065f46', marginBottom: 'var(--spacing-2)', fontWeight: 800 }}>Thank You for Reaching Out</h4>
                    <p style={{ color: '#047857', fontSize: 'var(--font-size-sm)', lineHeight: 1.65, marginBottom: 'var(--spacing-6)' }}>
                      Your confidential consultation request has been securely recorded. Our clinical intake coordinator
                      in Peshawar will review your inquiry and respond discreetly via your phone number.
                    </p>
                    <Button variant="secondary" size="md" className="btn-pill" onClick={() => setSubmitted(false)}>
                      Submit Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fullName">Full Name (or Guardian Name) *</label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Ahmad Khan"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Contact Phone / Mobile Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        disabled={isSubmitting}
                        placeholder="+92 3XX XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <span className="form-help">🔒 We never share your phone number with third parties.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address (Optional)</label>
                      <input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        placeholder="e.g. contact@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="inquiryType">Reason for Inquiry *</label>
                      <select
                        id="inquiryType"
                        disabled={isSubmitting}
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      >
                        <option value="Admission & Detox">Immediate Inpatient Admission / Detoxification</option>
                        <option value="Psychological Therapy">Psychological Counseling & Therapy</option>
                        <option value="Vocational Training">Vocational Training & Skills Enrollment</option>
                        <option value="Product Order">Vocational Craft / Product Order</option>
                        <option value="Family Support">Family Mediation & Guidance</option>
                        <option value="General Information">General Center Information</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">Confidential Message / Details *</label>
                      <textarea
                        id="message"
                        rows={4}
                        required
                        disabled={isSubmitting}
                        placeholder="Please describe how we can assist you or your family member..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="btn-pill"
                      disabled={isSubmitting}
                      style={{ width: '100%', marginTop: 'var(--spacing-3)' }}
                    >
                      {isSubmitting ? 'Submitting Confidential Request...' : 'Submit Confidential Request'}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
