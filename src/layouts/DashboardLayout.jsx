import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import { PageHeader } from "../components/common/PageHeader";
import { Footer } from "../components/layout/Footer";
import { MobileNav } from "../components/layout/MobileNav";
import { MobileNavbar } from "../components/navigation/MobileNavbar";
import { SOSModal } from "../components/emergency/SOSModal";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation for Dashboard Pages */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <MobileNavbar />

        {/* Header Navbar */}
        <Navbar />

        {/* Reusable Global Page Header */}
        <PageHeader />

        {/* Main Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Thumb Nav */}
        <MobileNav />
      </div>

      {/* Global Emergency SOS Overlay */}
      <SOSModal />
    </div>
  );
};
