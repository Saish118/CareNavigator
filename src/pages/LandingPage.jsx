import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  BedDouble,
  Navigation,
  Flame,
  PhoneCall,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  HeartPulse,
  Clock,
  Lock,
  UserCheck,
  MapPin,
  Building2,
  Activity,
  Heart,
  Wind,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Compass,
} from "lucide-react";

// Context & Services
import { useEmergency } from "../context/EmergencyContext";
import { hospitalService } from "../services/hospitalService";

// Components
import { FeatureCard } from "../components/cards/FeatureCard";
import { ReviewCard } from "../components/cards/ReviewCard";
import { Accordion } from "../components/ui/Accordion";
import { HospitalDetailModal } from "../components/hospital/HospitalDetailModal";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { userLocation, requestUserLocation } = useEmergency();

  const [nearestHospital, setNearestHospital] = useState(null);
  const [loadingHospital, setLoadingHospital] = useState(true);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState(null);

  // Fetch nearest hospital dynamically from actual dataset using userLocation
  useEffect(() => {
    let isMounted = true;
    const loadNearest = async () => {
      setLoadingHospital(true);
      try {
        const data = await hospitalService.getHospitals({}, userLocation);
        if (isMounted && data && data.length > 0) {
          setNearestHospital(data[0]);
        }
      } catch (err) {
        console.warn("⚠️ Could not load nearest hospital for homepage:", err);
      } finally {
        if (isMounted) setLoadingHospital(false);
      }
    };
    loadNearest();
    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  // 1. Core Capabilities Cards
  const featuresData = [
    {
      title: "Nearby Hospital Discovery",
      description: "Discover verified government empanelled hospitals, specialized medical care, and facilities by distance and location.",
      icon: Sparkles,
      path: "/hospitals",
    },
    {
      title: "City & Location Filtering",
      description: "Filter hospitals by cities across Maharashtra or enable GPS 'Near Me' mode for instant location-based discovery.",
      icon: MapPin,
      path: "/hospitals",
    },
    {
      title: "Emergency Services Directory",
      description: "Direct contact numbers for national emergency hotlines, hospital emergency desks, and local medical support.",
      icon: PhoneCall,
      path: "/map",
    },
    {
      title: "AI-Assisted Symptom Triage",
      description: "Interactive symptom evaluation guided by Gemini AI to assess emergency urgency and recommend appropriate care.",
      icon: Flame,
      path: "/triage",
    },
    {
      title: "Official Hospital Profiles",
      description: "View complete verified hospital information including address, phone numbers, empanelled status, and available departments.",
      icon: Building2,
      path: "/hospitals",
    },
    {
      title: "Google Maps Navigation",
      description: "Get turn-by-turn directions, route maps, and estimated travel time directly to your selected healthcare facility.",
      icon: Navigation,
      path: "/map",
    },
  ];

  // Supported Hospital Specialties Data
  const specialtiesData = [
    { name: "Cardiology", icon: Heart, count: "Verified Care", color: "text-rose-600 bg-rose-50 border-rose-100" },
    { name: "Neurology", icon: Activity, count: "Specialized", color: "text-purple-600 bg-purple-50 border-purple-100" },
    { name: "Orthopaedics", icon: Stethoscope, count: "Trauma Care", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { name: "Pediatrics", icon: HeartPulse, count: "Child Care", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { name: "Emergency Care", icon: Zap, count: "24/7 Available", color: "text-amber-600 bg-amber-50 border-amber-100" },
    { name: "General Medicine", icon: Building2, count: "Empanelled", color: "text-sky-600 bg-sky-50 border-sky-100" },
    { name: "Pulmonology", icon: Wind, count: "Respiratory", color: "text-teal-600 bg-teal-50 border-teal-100" },
    { name: "General Surgery", icon: Building2, count: "Empanelled", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Enable Location or Choose City",
      description: "Use 'Near Me' mode with browser GPS or select a specific city to filter nearby medical centers.",
      icon: MapPin,
    },
    {
      step: "02",
      title: "Discover Matching Hospitals",
      description: "Search by medical specialty, facility name, insurance program, or required emergency services.",
      icon: Search,
    },
    {
      step: "03",
      title: "AI-Assisted Symptom Triage",
      description: "Complete a brief 4-step symptom questionnaire to receive urgency guidance and care recommendations.",
      icon: Flame,
    },
    {
      step: "04",
      title: "Get Directions & Call ER",
      description: "Navigate directly using Google Maps or call emergency desks for immediate medical assistance.",
      icon: Navigation,
    },
  ];

  // Why Choose CareNavigator
  const whyChooseUsData = [
    {
      title: "Official Government Data",
      description: "Directly sourced from official Government of Maharashtra empanelled hospital registries.",
      icon: ShieldCheck,
    },
    {
      title: "Location-Based Discovery",
      description: "Haversine geographic distance calculations ensure nearby hospitals rank first for your position.",
      icon: MapPin,
    },
    {
      title: "AI-Assisted Symptom Triage",
      description: "Powered by Gemini AI with deterministic clinical fallback for safe, structured urgency assessment.",
      icon: Flame,
    },
    {
      title: "Verified Facility Contacts",
      description: "Clean phone numbers, street addresses, and verified location mapping for every hospital.",
      icon: PhoneCall,
    },
    {
      title: "Privacy & Zero Ad-Tracking",
      description: "CareNavigator operates securely without tracking personal medical queries or selling health data.",
      icon: Lock,
    },
    {
      title: "Responsive & Intuitive Interface",
      description: "Clean healthcare design system engineered for fast response on desktop, tablet, and mobile.",
      icon: UserCheck,
    },
  ];

  // Testimonials
  const testimonialsData = [
    {
      patientName: "Rajesh Patil",
      hospitalName: "Patient • Kopargaon",
      rating: 5,
      date: "Verified Record",
      comment:
        "CareNavigator quickly located empanelled hospitals right near Kopargaon when we needed urgent medical assistance. The Google Maps directions were instant.",
      verified: true,
    },
    {
      patientName: "Priya Deshmukh",
      hospitalName: "Family Member • Nashik",
      rating: 5,
      date: "Verified Record",
      comment:
        "Finding specialized pediatric and general surgery facilities in Nashik was effortless. The city filter and specialty search worked seamlessly.",
      verified: true,
    },
    {
      patientName: "Amit Shinde",
      hospitalName: "Healthcare Coordinator • Pune",
      rating: 5,
      date: "Verified Record",
      comment:
        "The Emergency Map and Gemini AI symptom triage provide clear, structured guidance during urgent situations without confusion.",
      verified: true,
    },
  ];

  // FAQ Section
  const faqData = [
    {
      title: "How does CareNavigator find nearby hospitals?",
      content:
        "CareNavigator uses your browser's GPS coordinates to calculate exact Haversine geographic distances to verified government empanelled hospitals in Maharashtra.",
    },
    {
      title: "How does the AI Symptom Triage work?",
      content:
        "CareNavigator collects your answers in a 4-step questionnaire and sends them to Google Gemini AI to analyze urgency level (Red Emergency to Green Mild) alongside deterministic clinical triage rules.",
    },
    {
      title: "Are the hospital phone numbers and addresses verified?",
      content:
        "Yes. All hospital records, addresses, phone numbers, and cities come directly from official Government of Maharashtra empanelled hospital registries.",
    },
    {
      title: "Can I search for hospitals in a specific city?",
      content:
        "Yes! Use the City / Location dropdown on the Hospitals page to filter facilities by Pune, Nashik, Ahilyanagar, Kopargaon, and 20+ other Maharashtra cities.",
    },
    {
      title: "Is CareNavigator free to use?",
      content:
        "Yes, CareNavigator is completely free for patients, family members, and emergency responders.",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-6 lg:pt-8 lg:pb-8 bg-gradient-to-b from-sky-50/70 via-blue-50/30 to-white overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-50 -z-10" />
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-[650px] h-[650px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-24 -left-24 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT COLUMN: Headline, Subtitle, Find Hospitals CTA */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-black border border-blue-200/80 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span>Maharashtra Government Empanelled Hospital Discovery</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-950 tracking-tight leading-[1.15] break-words">
                Find the Right{" "}
                <br className="hidden sm:inline" />
                Hospital,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500">
                  Right When
                </span>{" "}
                <br className="hidden sm:inline" />
                You Need It.
              </h1>

              {/* Updated Subtitle */}
              <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover nearby hospitals, emergency services, specialized care, and healthcare resources — all in one place.
              </p>

              {/* Primary CTA Button (Find Hospitals) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1 w-full">
                <button
                  onClick={() => navigate("/hospitals")}
                  className="w-full sm:w-[320px] max-w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 rounded-xl bg-white/10 shrink-0">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="block font-black text-sm leading-tight">Find Hospitals</span>
                      <span className="block text-[11px] text-blue-100 font-medium">Search Nearby & Cities</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>

              {/* Updated Feature Checkmark Highlights */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-between gap-y-2.5 gap-x-4 text-[11px] sm:text-xs font-bold text-slate-700 w-full">
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nearby Hospital Discovery</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emergency Navigation</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI Symptom Triage</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Specialized Care Search</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC REAL "NEARBY HOSPITAL" CARD */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end w-full max-w-full">
              <div className="relative w-full max-w-[640px] bg-[#0b1329] rounded-3xl sm:rounded-[36px] p-4.5 sm:p-7 shadow-2xl border border-slate-800/90 text-white space-y-5 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Dashboard Header */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 font-black text-[11px] sm:text-xs text-slate-200 tracking-wider truncate">
                    <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate">NEARBY HOSPITAL DISCOVERY</span>
                  </div>
                  {userLocation ? (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 text-[10px] sm:text-[11px] flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      GPS Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/30 text-[10px] sm:text-[11px] flex items-center gap-1 shrink-0">
                      📍 Near Me
                    </span>
                  )}
                </div>

                {/* Real Hospital Data Card */}
                {loadingHospital ? (
                  <div className="relative z-10 py-12 text-center text-slate-400 space-y-3">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-semibold">Finding nearest verified hospital...</p>
                  </div>
                ) : nearestHospital ? (
                  <div className="relative z-10 space-y-4">
                    {/* Hospital Card Layout */}
                    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                        <div className="space-y-1 min-w-0">
                          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-extrabold text-[10px] rounded-md border border-blue-500/30 uppercase tracking-wide inline-block">
                            Official Government Empanelled
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-white leading-tight break-words">
                            {nearestHospital.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="truncate">{nearestHospital.city}, {nearestHospital.district}</span>
                          </div>
                        </div>

                        {nearestHospital.distanceKm != null ? (
                          <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-left sm:text-right shrink-0 self-start sm:self-auto">
                            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Distance</span>
                            <strong className="text-sm sm:text-base font-black text-emerald-300">
                              {nearestHospital.distanceKm} km
                            </strong>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-left sm:text-right shrink-0 self-start sm:self-auto">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Location</span>
                            <strong className="text-xs font-bold text-slate-300">
                              {nearestHospital.city}
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* Hospital Details Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Address</span>
                          <p className="text-slate-200 font-medium truncate">{nearestHospital.address}</p>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Contact</span>
                          <p className="text-slate-200 font-semibold truncate">{nearestHospital.phone || "Official Desk"}</p>
                        </div>
                      </div>

                      {/* Specialties Row */}
                      {nearestHospital.specialties && nearestHospital.specialties.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified Specialties</span>
                          <div className="flex flex-wrap gap-1.5">
                            {nearestHospital.specialties.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-800/90 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700/80">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => setSelectedHospitalForDetail(nearestHospital)}
                        className="w-full sm:w-1/2 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>View Hospital Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate("/hospitals")}
                        className="w-full sm:w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer text-center"
                      >
                        Explore All Hospitals
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Fallback when location permission denied / unavailable */
                  <div className="relative z-10 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white">Find hospitals near you</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Enable browser location access to discover the closest verified government medical center in your vicinity.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={requestUserLocation}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        📍 Use My Location
                      </button>
                      <button
                        onClick={() => navigate("/hospitals")}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                      >
                        Browse All Hospitals
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION BAR */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">150+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Empanelled Hospitals</strong>
                <span className="text-[11px] text-slate-400 font-medium">Maharashtra Network</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">26+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Cities Monitored</strong>
                <span className="text-[11px] text-slate-400 font-medium">Location-based discovery</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">24/7</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Emergency Navigation</strong>
                <span className="text-[11px] text-slate-400 font-medium">Google Maps routing</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">120+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Specialties Covered</strong>
                <span className="text-[11px] text-slate-400 font-medium">Specialized care search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Core Capabilities) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full">
            <Sparkles className="w-4 h-4" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Rapid Medical Response
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Everything patients, family members, and ER responders need for verified hospital discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feat, i) => (
            <FeatureCard
              key={i}
              title={feat.title}
              description={feat.description}
              icon={feat.icon}
              onClick={() => navigate(feat.path)}
            />
          ))}
        </div>
      </section>

      {/* 4. SUPPORTED HOSPITAL SPECIALTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-200">
            <Stethoscope className="w-4 h-4 text-emerald-600" /> Clinical Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Supported Hospital Specialties
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Discover specialized medical care across regional partner hospitals in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {specialtiesData.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(`/hospitals?q=${encodeURIComponent(spec.name)}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer space-y-3 text-center group"
              >
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border ${spec.color} group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {spec.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
                    {spec.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How CareNavigator Works
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              4 fast steps from emergency symptom onset to direct hospital discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-blue-400">{s.step}</span>
                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE CARENAVIGATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
            Key Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose CareNavigator
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Built with medical precision, privacy focus, and real-time emergency routing technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsData.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            User Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trusted by Patients & Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((rev, i) => (
            <ReviewCard key={i} review={rev} />
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion items={faqData} />
      </section>

      {/* 9. CALL-TO-ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Explore Nearby Hospitals?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-medium">
              Discover verified empanelled hospitals, search by cities, or evaluate emergency symptoms today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/hospitals")}
              className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Explore Hospitals
            </button>

            <button
              onClick={() => navigate("/triage")}
              className="w-full sm:w-auto px-6 py-3 bg-blue-950 text-white hover:bg-slate-950 font-bold text-sm rounded-xl border border-blue-400/60 shadow-lg transition-all cursor-pointer"
            >
              AI Symptom Triage
            </button>
          </div>
        </div>
      </section>

      {/* HOSPITAL DETAIL MODAL INTEGRATION */}
      {selectedHospitalForDetail && (
        <HospitalDetailModal
          hospital={selectedHospitalForDetail}
          onClose={() => setSelectedHospitalForDetail(null)}
        />
      )}
    </div>
  );
};
