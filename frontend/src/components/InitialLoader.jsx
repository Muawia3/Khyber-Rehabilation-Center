import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSiteContent } from '../hooks';
import { prefersReducedMotion } from '../utils/gsapAnimations';
import logoImg from '../assets/logo.jpeg';
import './InitialLoader.css';

/**
 * InitialLoader - Award-Winning Initial Screen Loader
 * 
 * Displayed only on initial page load / refresh while app content initializes.
 * Automatically dismissed smoothly using GSAP once ready.
 * Respects prefers-reduced-motion, prevents layout shifts, and never blocks navigation.
 */
export const InitialLoader = ({ onComplete }) => {
  const { navbar } = useSiteContent();
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef(null);
  const hasTriggeredExit = useRef(false);

  const brandName = navbar?.brandName || 'Khyber Rehabilitation Center';
  const logoSrc = navbar?.logoUrl || logoImg;

  // Lock body scroll while loader is visible
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMounted]);

  // Entrance & Progress Bar GSAP animation
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.initial-loader-logo-shield',
        { scale: 0.8, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.initial-loader-title',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.3'
        )
        .fromTo(
          '.initial-loader-subtitle',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35 },
          '-=0.25'
        )
        .fromTo(
          '.initial-loader-progress-fill',
          { width: '0%' },
          { width: '100%', duration: 2.2, ease: 'power1.inOut' },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth exit after exactly ~3 seconds (target: 3 to 4 seconds)
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsMounted(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      if (hasTriggeredExit.current || !containerRef.current) return;
      hasTriggeredExit.current = true;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsMounted(false);
          },
        });

        tl.to('.initial-loader-content', {
          scale: 0.95,
          y: -12,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onStart: () => {
              onComplete?.();
            },
          },
          '-=0.15'
        );
      }, containerRef);
    }, 3000); // 3 seconds total loader presence

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="initial-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label="Loading Khyber Rehabilitation Center"
    >
      <div className="initial-loader-glow"></div>

      <div className="initial-loader-content">
        {/* Frosted Logo Shield */}
        <div className="initial-loader-logo-shield">
          <img
            src={logoSrc}
            alt={brandName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = logoImg;
            }}
            className="initial-loader-logo-img"
          />
        </div>

        {/* Brand Typography */}
        <h1 className="initial-loader-title">{brandName}</h1>
        <p className="loader-brand-subtitle initial-loader-subtitle">
          Peshawar • Restoring Health, Rebuilding Lives
        </p>

        {/* Animated Progress Indicator */}
        <div className="initial-loader-progress-track">
          <div className="initial-loader-progress-fill"></div>
        </div>

        {/* Live Operational Badge */}
        <div className="initial-loader-status-pill">
          <span className="pulse-dot"></span>
          <span>24/7 Clinical Admissions Online</span>
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
