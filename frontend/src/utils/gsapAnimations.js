import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // Configure ScrollTrigger to handle fast scrolling gracefully
  ScrollTrigger.config({
    limitCallbacks: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  });
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animate Hero section elements on load with high-end editorial reveals
 * Immediately clears inline props on completion to ensure zero lingering opacity: 0
 * or transforms during fast scrolling.
 */
export const animateHeroEntrance = (container) => {
  if (!container || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.6 },
      onComplete: () => {
        // Clear all inline styles so elements are 100% visible and unconstrained during scrolling
        gsap.set(
          '.hero-badge-wrap, .telemetry-strip, .hero-title-anim, .hero-sub-anim, .hero-btns-anim, .hero-trust-anim, .hero-visual-card, .hero-floating-chip',
          { clearProps: 'all' }
        );
      },
    });

    // Telemetry and badge entrance
    tl.from('.hero-badge-wrap, .telemetry-strip', {
      opacity: 0,
      y: -16,
      duration: 0.5,
      stagger: 0.08,
      clearProps: 'all',
    })
      // Headline reveal
      .from(
        '.hero-title-anim',
        {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
        },
        '-=0.3'
      )
      // Subtitle reveal
      .from(
        '.hero-sub-anim',
        {
          opacity: 0,
          y: 18,
          duration: 0.5,
          clearProps: 'all',
        },
        '-=0.4'
      )
      // Call to action buttons
      .from(
        '.hero-btns-anim',
        {
          opacity: 0,
          y: 16,
          duration: 0.45,
          clearProps: 'all',
        },
        '-=0.35'
      )
      // Trust badges
      .from(
        '.hero-trust-anim',
        {
          opacity: 0,
          y: 14,
          duration: 0.4,
          clearProps: 'all',
        },
        '-=0.3'
      )
      // Hero visual card composition
      .from(
        '.hero-visual-card',
        {
          opacity: 0,
          scale: 0.94,
          y: 24,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'opacity,transform,scale',
        },
        '-=0.5'
      )
      // Floating chips on the hero visual
      .from(
        '.hero-floating-chip',
        {
          opacity: 0,
          scale: 0.8,
          y: 12,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          clearProps: 'opacity,transform,scale',
        },
        '-=0.4'
      );
  }, container);

  return ctx;
};

/**
 * ScrollTrigger reveal for standard section containers
 * Configured with fastScrollEnd and clearProps to never get stuck at opacity: 0
 */
export const animateSectionReveal = (sectionRef) => {
  if (!sectionRef || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    gsap.from(sectionRef, {
      scrollTrigger: {
        trigger: sectionRef,
        start: 'top 92%',
        toggleActions: 'play none none none',
        fastScrollEnd: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    });
  }, sectionRef);

  return ctx;
};

/**
 * Stagger reveal for cards in a grid
 * Fast scroll safe with immediate property clearing
 */
export const animateStaggerGrid = (containerRef, itemSelector = '.card') => {
  if (!containerRef || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const items = containerRef.querySelectorAll(itemSelector);
    if (!items || items.length === 0) return;

    gsap.from(items, {
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 90%',
        toggleActions: 'play none none none',
        fastScrollEnd: true,
      },
      opacity: 0,
      y: 25,
      scale: 0.98,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'opacity,transform,scale',
    });
  }, containerRef);

  return ctx;
};

/**
 * Clean up GSAP context safely
 */
export const cleanupGsapContext = (ctx) => {
  if (ctx && typeof ctx.revert === 'function') {
    ctx.revert();
  }
};
