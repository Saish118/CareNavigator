import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { PageHeader } from "../components/common/PageHeader";
import { Footer } from "../components/layout/Footer";
import { MobileNav } from "../components/layout/MobileNav";
import { MobileNavbar } from "../components/navigation/MobileNavbar";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white max-w-full overflow-x-hidden">
      {/* Mobile Header */}
      <MobileNavbar />

      {/* Top Header Navbar */}
      <Navbar />

      {/* Reusable Global Page Header */}
      <PageHeader />

      {/* Main Route Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Thumb Nav */}
      <MobileNav />
    </div>
  );
};
