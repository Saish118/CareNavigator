import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { PageHeader } from "../components/common/PageHeader";
import { Footer } from "../components/layout/Footer";
import { MobileNav } from "../components/layout/MobileNav";
import { MobileNavbar } from "../components/navigation/MobileNavbar";
import { SOSModal } from "../components/emergency/SOSModal";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Mobile Drawer Navigation */}
      <MobileNavbar />

      {/* Main Desktop Header Navbar */}
      <Navbar />

      {/* Reusable Global Page Header */}
      <PageHeader />

      {/* Dynamic Route Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Thumb Nav */}
      <MobileNav />

      {/* Global Emergency SOS Overlay */}
      <SOSModal />
    </div>
  );
};
