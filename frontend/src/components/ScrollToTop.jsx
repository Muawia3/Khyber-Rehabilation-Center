import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ScrollToTop - Global Navigation Scroll Manager
 * 
 * Automatically scrolls to top (0, 0) whenever route pathname changes,
 * whether from footer, navbar, buttons, cards, or browser back/forward buttons.
 * Avoids unnecessary jumps on repeated clicks to the current route.
 * Accurately supports hash targets (e.g. #ceo) and refreshes GSAP ScrollTrigger.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  // Set browser history scroll restoration to manual so browser back/forward
  // navigation doesn't erroneously retain scrolled footer positions on new pages
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const isNewRoute = prevPathRef.current !== pathname;

    if (isNewRoute) {
      if (!hash) {
        // Immediate instant scroll to top on page change
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } else {
        // If there is an anchor hash (e.g. /profiles#ceo), wait for DOM mount then scroll to element
        setTimeout(() => {
          const targetId = hash.replace('#', '');
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }
        }, 60);
      }

      // Refresh GSAP ScrollTrigger triggers after layout settles
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          try {
            ScrollTrigger.refresh();
          } catch {
            // Silently ignore if ScrollTrigger is not mounted yet
          }
        });
      }

      prevPathRef.current = pathname;
    } else if (hash) {
      // Same-page hash navigation (e.g. clicking a section anchor while already on that page)
      const targetId = hash.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // If user clicks the exact same link without a hash, do NOT scroll (respects current view)
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
