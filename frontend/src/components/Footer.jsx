import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks';
import logoImg from '../assets/logo.jpeg';
import './Footer.css';

export const Footer = () => {
  const { footer, navbar } = useSiteContent();

  const title = footer?.title || 'Khyber Rehabilitation Center';
  const tagline = footer?.tagline || 'Restoring Health, Rebuilding Lives';
  const aboutText = footer?.text || 'Dedicated to providing clinical detoxification, structured psychological therapy, vocational skills training, and community reintegration in Peshawar, Khyber Pakhtunkhwa.';
  const badgeText = footer?.badge || 'Restoring Health • Rebuilding Lives';
  const address = footer?.address || 'Peshawar, Khyber Pakhtunkhwa, Pakistan';
  const phone = footer?.phone || '+92 91 [Center Phone Number Pending]';
  const whatsappDisplay = footer?.whatsappDisplay || '+92 3XX [Center WhatsApp Pending]';
  const whatsappLink = footer?.whatsappLink || 'https://wa.me/?text=Hello%20Khyber%20Rehabilitation%20Center';
  const hours = footer?.hours || 'Inpatient Care: 24/7 | Clinical Consultations: Mon - Sat 9:00 AM - 5:00 PM';
  const copyright = footer?.copyright || `© ${new Date().getFullYear()} Khyber Rehabilitation Center, Peshawar. All rights reserved.`;
  const note = footer?.note || 'Confidential & Dignified Care';
  const logoSrc = navbar?.logoUrl || logoImg;

  // Use dynamic nav links from navbar configuration
  const visibleLinks = (navbar?.navLinks || [])
    .filter((l) => l.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand-header">
            <img src={logoSrc} alt={title} className="footer-logo" />
            <div>
              <h3 className="footer-title">{title}</h3>
              <p className="footer-tagline">{tagline}</p>
            </div>
          </div>
          <p className="footer-text">{aboutText}</p>
          <div className="footer-badge">{badgeText}</div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Programs & Navigation</h4>
          <ul className="footer-links">
            {visibleLinks.map((link) => (
              <li key={link.id || link.path}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
            {navbar?.showLeadershipButton !== false && (
              <li>
                <Link to="/leadership">Our Leadership</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Contact & Location Information */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Center Contact & Location</h4>
          <p className="footer-contact-item">
            <strong>Facility Location:</strong><br />
            {address}
          </p>
          <p className="footer-contact-item">
            <strong>Admissions & Emergency:</strong><br />
            {phone}
          </p>
          <p className="footer-contact-item">
            <strong>WhatsApp Consultation:</strong><br />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-link"
            >
              {whatsappDisplay} (Click to Chat)
            </a>
          </p>
          <p className="footer-contact-item">
            <strong>Operational Care:</strong><br />
            {hours}
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>{copyright}</p>
          <div className="footer-bottom-links">
            <span className="footer-note">{note}</span>
            <span className="footer-divider">&bull;</span>
            <Link to="/admin/login" className="admin-link">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
