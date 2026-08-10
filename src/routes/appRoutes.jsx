import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

// Lazy loading page components
const LandingPage = lazy(() => import("../pages/LandingPage").then((m) => ({ default: m.LandingPage })));
const UserDashboardPage = lazy(() => import("../pages/UserDashboardPage").then((m) => ({ default: m.UserDashboardPage })));
const RecommenderPage = lazy(() => import("../pages/RecommenderPage").then((m) => ({ default: m.RecommenderPage })));
const HospitalDetailPage = lazy(() => import("../pages/HospitalDetailPage").then((m) => ({ default: m.HospitalDetailPage })));
const MapPage = lazy(() => import("../pages/MapPage").then((m) => ({ default: m.MapPage })));
const TriagePage = lazy(() => import("../pages/TriagePage").then((m) => ({ default: m.TriagePage })));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })));
const ProfilePage = lazy(() => import("../pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const DesignSystemPage = lazy(() => import("../pages/DesignSystemPage").then((m) => ({ default: m.DesignSystemPage })));
const StaticInfoPage = lazy(() => import("../pages/StaticInfoPage").then((m) => ({ default: m.StaticInfoPage })));

const LoginPage = lazy(() => import("../pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../pages/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const AppointmentsPage = lazy(() => import("../pages/AppointmentsPage").then((m) => ({ default: m.AppointmentsPage })));
const BookAppointmentPage = lazy(() => import("../pages/BookAppointmentPage").then((m) => ({ default: m.BookAppointmentPage })));
const FavoritesPage = lazy(() => import("../pages/FavoritesPage").then((m) => ({ default: m.FavoritesPage })));
const SettingsPage = lazy(() => import("../pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage").then((m) => ({ default: m.NotificationsPage })));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

// Admin Panel Pages
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })));
const AdminHospitalsPage = lazy(() => import("../pages/admin/AdminHospitalsPage").then((m) => ({ default: m.AdminHospitalsPage })));
const AdminHospitalFormPage = lazy(() => import("../pages/admin/AdminHospitalFormPage").then((m) => ({ default: m.AdminHospitalFormPage })));
const AdminBloodBanksPage = lazy(() => import("../pages/admin/AdminBloodBanksPage").then((m) => ({ default: m.AdminBloodBanksPage })));
const AdminBloodBankFormPage = lazy(() => import("../pages/admin/AdminBloodBankFormPage").then((m) => ({ default: m.AdminBloodBankFormPage })));

const PageLoader = () => (
  <div className="max-w-7xl mx-auto p-8">
    <LoadingSkeleton variant="card" count={2} />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Public Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Public Pages - No Login Required */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/hospitals" element={<RecommenderPage />} />
          <Route path="/recommendations" element={<RecommenderPage />} />
          <Route path="/hospital/:id" element={<HospitalDetailPage />} />

          {/* Deprecated bed routes redirect to hospital discovery */}
          <Route path="/beds" element={<Navigate to="/hospitals" replace />} />
          <Route path="/bed-tracker" element={<Navigate to="/hospitals" replace />} />

          <Route path="/emergency" element={<MapPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/navigation" element={<MapPage />} />

          <Route path="/symptom-checker" element={<TriagePage />} />
          <Route path="/triage" element={<TriagePage />} />

          <Route path="/about" element={<StaticInfoPage />} />
          <Route path="/privacy" element={<StaticInfoPage />} />
          <Route path="/terms" element={<StaticInfoPage />} />
          <Route path="/contact" element={<StaticInfoPage />} />

          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>

        {/* Public Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Panel Layout Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Hospital Management */}
            <Route path="/admin/hospitals" element={<AdminHospitalsPage />} />
            <Route path="/admin/hospitals/new" element={<AdminHospitalFormPage />} />
            <Route path="/admin/hospitals/:id/edit" element={<AdminHospitalFormPage />} />

            {/* Blood Bank Management */}
            <Route path="/admin/blood-banks" element={<AdminBloodBanksPage />} />
            <Route path="/admin/blood-banks/new" element={<AdminBloodBankFormPage />} />
            <Route path="/admin/blood-banks/:id/edit" element={<AdminBloodBankFormPage />} />
          </Route>
        </Route>

        {/* Protected User Dashboard & Profile Layout Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments/book" element={<BookAppointmentPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
