import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS, APP_NAME, CONTACT_INFO } from '../utils/constants';
import { useSiteContent } from '../hooks';
import { Button } from './Button';
import logoImg from '../assets/logo.jpeg';
import './Navbar.css';

export const Navbar = () => {
  const { navbar } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  let brandName = navbar?.brandName || 'Khyber Rehabilitation Center';
  let brandSubtitle = navbar?.brandSubtitle || 'Peshawar';

  if (brandName === 'Khyber Rehabilitation') {
    brandName = 'Khyber Rehabilitation Center';
  }
  if (brandSubtitle === 'Center, Peshawar' || brandSubtitle === 'Center Peshawar') {
    brandSubtitle = 'Peshawar';
  }
  const logoSrc = navbar?.logoUrl || logoImg;
  const topBarBadge = navbar?.topBarBadge || 'Admissions 24/7';
  const topBarText = navbar?.topBarText || 'Peshawar, Khyber Pakhtunkhwa';
  const emergencyPhone = navbar?.emergencyPhone || CONTACT_INFO.phoneDisplay;
  const whatsappUrl = navbar?.whatsappLink || CONTACT_INFO.whatsappLink;
  const actionBtnText = navbar?.actionButtonText || 'Get Help';
  const actionBtnLink = navbar?.actionButtonLink || '/contact';
  const showLeadership = navbar?.showLeadershipButton !== false;
  const leadershipText = navbar?.leadershipButtonText || 'Our Leadership';
  const showTopBar = navbar?.showTopBar === true;

  const links = (navbar?.navLinks || NAV_LINKS)
    .filter((l) => l.isVisible !== false && l.name !== 'Profiles' && l.name !== 'Profile' && l.path !== '/profiles')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  // Close dropdown and menu on pathname change
  useEffect(() => {
    setDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  // Track window scroll for active glassmorphism contrast enhancement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Top Notification Bar for Healthcare Trust & Emergency Notice (Controlled via Admin) */}
      {showTopBar && (
        <div className="top-bar">
          <div className="container top-bar-container">
            <div className="top-bar-left">
              <span className="top-bar-badge">{topBarBadge}</span>
              <span className="top-bar-text">{topBarText}</span>
            </div>
            <div className="top-bar-right">
              <span className="top-bar-helpline">Emergency Support: <strong>{emergencyPhone}</strong></span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="top-bar-whatsapp"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="container header-container">
        <Link to="/" className="brand-logo-link" onClick={closeMenu}>
          <img src={logoSrc} alt={brandName} className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">{brandName}</span>
            <span className="brand-subtitle">{brandSubtitle}</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={`main-nav ${isOpen ? 'is-open' : ''}`}>
          <ul className="nav-list">
            {links.map((link) => {
              if (link.hasDropdown || link.name === 'Profiles') {
                const isProfilesActive = location.pathname.startsWith('/profiles');
                return (
                  <li
                    key={link.id || link.path}
                    className={`nav-item dropdown-item ${dropdownOpen ? 'is-dropdown-open' : ''}`}
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="dropdown-trigger-wrapper">
                      <NavLink
                        to={link.path}
                        onClick={closeMenu}
                        className={`nav-link dropdown-toggle ${isProfilesActive ? 'active' : ''}`}
                      >
                        {link.name}
                      </NavLink>
                      <button
                        type="button"
                        className="dropdown-chevron-btn"
                        onClick={toggleDropdown}
                        aria-expanded={dropdownOpen}
                        aria-label="Toggle Profiles menu"
                      >
                        <svg
                          className={`dropdown-chevron ${dropdownOpen ? 'rotate' : ''}`}
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>

                    {/* Profiles Dropdown Menu */}
                    <div className={`nav-dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                      {/* Top Parent: CEO Profile */}
                      <div className="dropdown-parent-section">
                        <Link
                          to="/profiles#ceo"
                          onClick={closeMenu}
                          className="dropdown-parent-link"
                        >
                          <div className="parent-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                          </div>
                          <div className="parent-info">
                            <div className="parent-header-row">
                              <span className="parent-title">CEO Profile</span>
                              <span className="parent-badge">Top / Parent</span>
                            </div>
                            <span className="parent-role">Chief Executive Officer & Founder</span>
                          </div>
                        </Link>
                      </div>

                      {/* Divider / Label for Departmental Children */}
                      <div className="dropdown-section-title">
                        <span>Center Leadership & Departments</span>
                      </div>

                      {/* Child Options List */}
                      <ul className="dropdown-children-list">
                        <li className="dropdown-child-item">
                          <Link to="/profiles#medical" onClick={closeMenu} className="dropdown-child-link">
                            <span className="child-bullet">•</span>
                            <div className="child-content">
                              <span className="child-name">Medical & Clinical Team</span>
                              <span className="child-role">Psychiatrists & Detoxification</span>
                            </div>
                          </Link>
                        </li>
                        <li className="dropdown-child-item">
                          <Link to="/profiles#psychology" onClick={closeMenu} className="dropdown-child-link">
                            <span className="child-bullet">•</span>
                            <div className="child-content">
                              <span className="child-name">Psychologists & Counselors</span>
                              <span className="child-role">Psychotherapy & Behavioral Care</span>
                            </div>
                          </Link>
                        </li>
                        <li className="dropdown-child-item">
                          <Link to="/profiles#vocational" onClick={closeMenu} className="dropdown-child-link">
                            <span className="child-bullet">•</span>
                            <div className="child-content">
                              <span className="child-name">Vocational Instructors</span>
                              <span className="child-role">Skill Development & Mentors</span>
                            </div>
                          </Link>
                        </li>
                        <li className="dropdown-child-item">
                          <Link to="/profiles#administration" onClick={closeMenu} className="dropdown-child-link">
                            <span className="child-bullet">•</span>
                            <div className="child-content">
                              <span className="child-name">Administrative Staff</span>
                              <span className="child-role">Inpatient Operations & Support</span>
                            </div>
                          </Link>
                        </li>
                      </ul>

                      {/* Dropdown Bottom Link */}
                      <div className="dropdown-footer">
                        <Link to="/profiles" onClick={closeMenu} className="dropdown-footer-link">
                          View All Profiles & Hierarchy →
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.id || link.path} className="nav-item">
                  <NavLink
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            })}

            {/* Mobile-only item for Leadership */}
            {showLeadership && (
              <li className="nav-item mobile-only-nav-item">
                <NavLink
                  to="/leadership"
                  onClick={closeMenu}
                  className={({ isActive }) => `mobile-leadership-link ${isActive ? 'active' : ''}`}
                >
                  <span className="mobile-leadership-icon">🏛️</span>
                  <div className="mobile-leadership-info">
                    <span className="mobile-leadership-title">{leadershipText}</span>
                    <span className="mobile-leadership-sub">CEO & Institutional Hierarchy</span>
                  </div>
                  <span className="mobile-leadership-arrow">→</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <Link to={actionBtnLink} onClick={closeMenu}>
            <Button variant="outline" size="sm">
              {actionBtnText}
            </Button>
          </Link>

          {showLeadership && (
            <Link to="/leadership" onClick={closeMenu} className="leadership-btn-navlink">
              <Button
                variant="primary"
                size="sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{leadershipText}</span>
              </Button>
            </Link>
          )}

          <button
            className={`mobile-toggle ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
