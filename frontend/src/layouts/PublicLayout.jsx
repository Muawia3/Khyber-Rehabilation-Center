import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer, ScrollToTopButton } from '../components';

export const PublicLayout = () => {
  return (
    <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};
