import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AppProvider, SiteContentProvider } from './context';
import { AppRoutes } from './routes';
import { ScrollToTop, InitialLoader } from './components';

export const App = () => {
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);

  useEffect(() => {
    // Failsafe timer: ensures main page is guaranteed visible after 3.8s (under 4 seconds)
    const failsafe = setTimeout(() => {
      setIsLoaderFinished(true);
    }, 3800);
    return () => clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    // Ensure viewport starts at the top when initial loader concludes
    if (isLoaderFinished && typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [isLoaderFinished]);

  return (
    <BrowserRouter>
      {/* Global Navigation Scroll Manager (always scrolls to top on route change) */}
      <ScrollToTop />
      <AuthProvider>
        <AppProvider>
          <SiteContentProvider>
            {/* Premium Initial Loading Screen (shown only on initial open/refresh) */}
            <InitialLoader onComplete={() => setIsLoaderFinished(true)} />
            <div
              style={{
                opacity: isLoaderFinished ? 1 : 0,
                visibility: isLoaderFinished ? 'visible' : 'hidden',
                transition: 'opacity 0.4s ease-in-out',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <AppRoutes />
            </div>
          </SiteContentProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
