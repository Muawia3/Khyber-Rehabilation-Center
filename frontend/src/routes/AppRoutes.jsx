import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout, AdminLayout } from '../layouts';
import { ProtectedRoute } from './ProtectedRoute';
import {
  HomePage,
  AboutPage,
  TreatmentPage,
  SkillsPage,
  BusinessPage,
  ProductsPage,
  SuccessStoriesPage,
  ProfilesPage,
  LeadershipPage,
  ContactPage,
  NotFoundPage,
} from '../pages';
import {
  AdminDashboardPage,
  AdminContentPage,
  AdminLeadershipPage,
  AdminInquiriesPage,
  AdminLoginPage,
} from '../admin';
import { ROUTES } from './routeConstants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Portal Routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.PUBLIC.HOME} element={<HomePage />} />
        <Route path={ROUTES.PUBLIC.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.PUBLIC.PROFILES} element={<ProfilesPage />} />
        <Route path={ROUTES.PUBLIC.LEADERSHIP} element={<LeadershipPage />} />
        <Route path={ROUTES.PUBLIC.TREATMENT} element={<TreatmentPage />} />
        <Route path={ROUTES.PUBLIC.SKILLS} element={<SkillsPage />} />
        <Route path={ROUTES.PUBLIC.BUSINESS} element={<BusinessPage />} />
        <Route path={ROUTES.PUBLIC.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PUBLIC.SUCCESS_STORIES} element={<SuccessStoriesPage />} />
        <Route path={ROUTES.PUBLIC.CONTACT} element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login Route (Standalone UI) */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

      {/* Admin Dashboard Protected Layout (Guarded by ProtectedRoute) */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.ROOT} element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="leadership" element={<AdminLeadershipPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
