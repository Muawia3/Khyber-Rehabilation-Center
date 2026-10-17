import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animate Hero section elements on load with high-end editorial reveals
 */
export const animateHeroEntrance = (container) => {
  if (!container || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    // Telemetry and badge entrance
    tl.from('.hero-badge-wrap, .telemetry-strip', {
      opacity: 0,
      y: -24,
      duration: 0.8,
      stagger: 0.1,
    })
      // Headline reveal with slight rotation and scale
      .from(
        '.hero-title-anim',
        {
          opacity: 0,
          y: 45,
          duration: 1.1,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      // Subtitle reveal
      .from(
        '.hero-sub-anim',
        {
          opacity: 0,
          y: 25,
          duration: 0.8,
        },
        '-=0.6'
      )
      // Call to action buttons
      .from(
        '.hero-btns-anim',
        {
          opacity: 0,
          y: 25,
          duration: 0.7,
        },
        '-=0.5'
      )
      // Trust badges
      .from(
        '.hero-trust-anim',
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        '-=0.4'
      )
      // Hero visual layered composition
      .from(
        '.hero-visual-card',
        {
          opacity: 0,
          scale: 0.9,
          y: 40,
          rotationY: -8,
          duration: 1.2,
          ease: 'power3.out',
        },
        '-=0.9'
      )
      // Floating chips on the hero visual
      .from(
        '.hero-floating-chip',
        {
          opacity: 0,
          scale: 0.7,
          y: 20,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        },
        '-=0.6'
      );

    // Continuous floating motion only on devices with fine pointer hover to prevent touch conflicts
    const isFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isFinePointer) {
      // Subtle continuous floating motion for visual card
      gsap.to('.hero-visual-card', {
        y: '-=10',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });

      // Floating chips floating at offset frequencies
      gsap.to('.hero-floating-chip-1', {
        y: '-=8',
        x: '+=4',
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
      });

      gsap.to('.hero-floating-chip-2', {
        y: '+=6',
        x: '-=4',
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.6,
      });
    }
  }, container);

  return ctx;
};

/**
 * ScrollTrigger reveal for standard section containers
 */
export const animateSectionReveal = (sectionRef) => {
  if (!sectionRef || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    gsap.from(sectionRef, {
      scrollTrigger: {
        trigger: sectionRef,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 45,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, sectionRef);

  return ctx;
};

/**
 * Stagger reveal for cards in a grid
 */
export const animateStaggerGrid = (containerRef, itemSelector = '.card') => {
  if (!containerRef || prefersReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const items = containerRef.querySelectorAll(itemSelector);
    if (!items || items.length === 0) return;

    gsap.from(items, {
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
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
