import React, { useState } from "react";
import {
  Activity,
  Stethoscope,
  BedDouble,
  Navigation,
  Flame,
  Search,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  User,
  SlidersHorizontal,
  Bookmark,
  HeartPulse,
  Ambulance,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// Buttons
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { IconButton } from "../components/buttons/IconButton";

// Cards
import { DoctorCard } from "../components/cards/DoctorCard";
import { AnalyticsCard } from "../components/cards/AnalyticsCard";
import { ReviewCard } from "../components/cards/ReviewCard";
import { AppointmentCard } from "../components/cards/AppointmentCard";
import { FeatureCard } from "../components/cards/FeatureCard";

// Inputs
import { SearchBar } from "../components/inputs/SearchBar";
import { SearchWithFilters } from "../components/inputs/SearchWithFilters";
import { TextInput } from "../components/inputs/TextInput";
import { SelectInput } from "../components/inputs/SelectInput";
import { DatePicker } from "../components/inputs/DatePicker";
import { PasswordInput } from "../components/inputs/PasswordInput";

// Status
import { BedAvailabilityBadge } from "../components/status/BedAvailabilityBadge";
import { ICUAvailabilityBadge } from "../components/status/ICUAvailabilityBadge";
import { AmbulanceStatusBadge } from "../components/status/AmbulanceStatusBadge";
import { WaitingTimeBadge } from "../components/status/WaitingTimeBadge";
import { RatingStars } from "../components/status/RatingStars";
import { HospitalStatusIndicator } from "../components/status/HospitalStatusIndicator";

// Dashboard
import { StatisticCard } from "../components/dashboard/StatisticCard";
import { ActivityCard } from "../components/dashboard/ActivityCard";
import { NotificationCard } from "../components/dashboard/NotificationCard";
import { RecentAppointmentCard } from "../components/dashboard/RecentAppointmentCard";

// UI
import { Modal } from "../components/common/Modal";
import { useToast } from "../components/ui/ToastNotification";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Pagination } from "../components/ui/Pagination";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Tabs } from "../components/ui/Tabs";
import { Accordion } from "../components/ui/Accordion";
import { Tooltip } from "../components/ui/Tooltip";

export const DesignSystemPage = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [textVal, setTextVal] = useState("Sai Joshi");
  const [selectVal, setSelectVal] = useState("Cardiology");
  const [dateVal, setDateVal] = useState("2026-08-07");
  const [passVal, setPassVal] = useState("CareNav2026!");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-full border border-blue-200">
          <Sparkles className="w-4 h-4" /> CareNavigator Design System v1.0
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Reusable Medical Component Library
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl font-medium">
          A complete, production-ready design system built with React, Tailwind CSS, Framer Motion, and Lucide icons. Grounded in medical aesthetics: White, Blue (<code className="text-blue-600">#2563EB</code>), Green (<code className="text-emerald-600">#10B981</code>), rounded-xl cards, and soft shadows.
        </p>
      </div>

      {/* 1. BUTTONS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-blue-600 pl-3">
          1. Buttons & Actions
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={() => addToast("Primary Button clicked!", "info")}>
            Primary Action
          </PrimaryButton>
          <PrimaryButton icon={Calendar} onClick={() => addToast("Booking appointment...", "success")}>
            Book Appointment
          </PrimaryButton>
          <SecondaryButton onClick={() => addToast("Secondary clicked", "info")}>
            Secondary Button
          </SecondaryButton>
          <IconButton icon={Bookmark} title="Bookmark Hospital" onClick={() => addToast("Hospital Bookmarked", "success")} />
          <IconButton icon={PhoneCall} variant="danger" title="Call Emergency" onClick={() => addToast("Dialing ER...", "error")} />
          <IconButton icon={Sparkles} variant="primary" title="AI Match" />
        </div>
      </section>

      {/* 2. STATUS BADGES */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
          2. Status & Availability Badges
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
          <BedAvailabilityBadge available={14} total={40} type="General" />
          <BedAvailabilityBadge available={2} total={15} type="ICU" />
          <ICUAvailabilityBadge availableCount={5} />
          <ICUAvailabilityBadge availableCount={0} />
          <AmbulanceStatusBadge status="En Route to Patient" unitId="AMB-101" />
          <AmbulanceStatusBadge status="Available" unitId="AMB-204" />
          <WaitingTimeBadge minutes={5} />
          <WaitingTimeBadge minutes={28} />
          <RatingStars rating={4.8} reviewCount={320} />
          <HospitalStatusIndicator status="Operational" />
          <HospitalStatusIndicator status="Surge Capacity" />
          <HospitalStatusIndicator status="Diversion / Full" />
        </div>
      </section>

      {/* 3. INPUT COMPONENTS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-blue-600 pl-3">
          3. Input & Search Components
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Standard Search Bar</label>
              <SearchBar onSearch={(q) => addToast(`Search: ${q}`, "info")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Search with Filter Pills</label>
              <SearchWithFilters />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TextInput label="Patient Full Name" value={textVal} onChange={(e) => setTextVal(e.target.value)} required />
            <SelectInput
              label="Medical Specialty"
              value={selectVal}
              onChange={(e) => setSelectVal(e.target.value)}
              options={["Cardiology", "Trauma", "Neurology", "Pediatrics"]}
            />
            <DatePicker label="Appointment Date" value={dateVal} onChange={(e) => setDateVal(e.target.value)} />
            <PasswordInput label="Patient Portal Pass" value={passVal} onChange={(e) => setPassVal(e.target.value)} />
          </div>
        </div>
      </section>

      {/* 4. CARDS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-blue-600 pl-3">
          4. Cards & Information Displays
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DoctorCard onBookAppointment={(d) => addToast(`Booked ${d.name}`, "success")} />
          <AnalyticsCard />
          <ReviewCard />
          <AppointmentCard onCancel={() => addToast("Reservation cancelled", "warning")} />
          <FeatureCard onClick={() => addToast("Navigating to AI Triage", "info")} />
          <StatisticCard icon={TrendingUp} />
        </div>
      </section>

      {/* 5. DASHBOARD COMPONENTS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
          5. Dashboard Widgets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityCard />
          <NotificationCard onDismiss={() => addToast("Alert dismissed", "info")} />
          <RecentAppointmentCard />
        </div>
      </section>

      {/* 6. UI & LAYOUT COMPONENTS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-l-4 border-blue-600 pl-3">
          6. UI Primitives & Interactive Elements
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          {/* Breadcrumb & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <Breadcrumb />
            <Tabs activeTab={activeTab} onChange={(t) => setActiveTab(t)} />
          </div>

          {/* Trigger Toast & Modal Buttons */}
          <div className="flex items-center gap-3">
            <PrimaryButton onClick={() => setIsModalOpen(true)}>
              Open Animated Modal
            </PrimaryButton>
            <SecondaryButton onClick={() => addToast("Medical Toast Notification Triggered!", "success")}>
              Trigger Success Toast
            </SecondaryButton>
            <Tooltip content="Live 18 regional ERs active right now">
              <span className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
                Hover for Tooltip
              </span>
            </Tooltip>
          </div>

          {/* Accordion */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Accordion Component</h4>
            <Accordion />
          </div>

          {/* Skeletons & States */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Loading Skeleton</h4>
              <LoadingSkeleton variant="avatar" count={1} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Error State</h4>
              <ErrorState onRetry={() => addToast("Retrying connection...", "info")} />
            </div>
          </div>

          {/* Empty State */}
          <EmptyState
            title="No Booked Beds Found"
            description="You currently have no active hospital bed holds."
            actionLabel="Find Hospital"
            onAction={() => addToast("Searching hospitals...", "info")}
          />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={(p) => setCurrentPage(p)} />
        </div>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="CareNavigator Modal Dialog"
        subtitle="Accessible dialog component with backdrop blur"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 font-medium">
            This modal component supports keyboard ESC closing, click outside dismissal, and Framer Motion smooth spring transitions.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton onClick={() => setIsModalOpen(false)}>
              Close Modal
            </SecondaryButton>
            <PrimaryButton onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
