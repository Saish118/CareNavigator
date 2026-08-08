import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  BedDouble,
  Navigation,
  Flame,
  Calendar,
  BarChart3,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  HeartPulse,
  Clock,
  Lock,
  UserCheck,
  Ambulance,
  PhoneCall,
  MapPin,
  Building2,
  Activity,
  Heart,
  Brain,
  Bone,
  Baby,
  Wind,
  Microscope,
  CheckCircle2,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

// Design system components
import { FeatureCard } from "../components/cards/FeatureCard";
import { ReviewCard } from "../components/cards/ReviewCard";
import { Accordion } from "../components/ui/Accordion";

export const LandingPage = () => {
  const navigate = useNavigate();

  // 1. Core Capabilities Cards
  const featuresData = [
    {
      title: "Hospital Resource Discovery",
      description: "Match specialized trauma centers evaluating required specialties, ER wait times, and accepted insurance.",
      icon: Sparkles,
      path: "/hospitals",
    },
    {
      title: "Live Bed Availability",
      description: "Real-time telemetry tracking ICU, ventilator, pediatric, and general bed counters inside every hospital card.",
      icon: BedDouble,
      path: "/hospitals",
    },
    {
      title: "Emergency Services Directory",
      description: "Verified contact numbers for national emergency hotlines, hospital ambulances, and private emergency providers.",
      icon: PhoneCall,
      path: "/map",
    },
    {
      title: "Search by Symptoms",
      description: "4-step clinical triage wizard outputting immediate severity guidance (Level 1 Red to Level 4 Green).",
      icon: Flame,
      path: "/triage",
    },
    {
      title: "Hospital Profiles",
      description: "View complete hospital information including specialties, facilities, available departments, ratings, contact details, and live resource status.",
      icon: Building2,
      path: "/hospitals",
    },
    {
      title: "Google Maps Navigation",
      description: "Get the fastest route, estimated travel time, and distance using Google Maps integration.",
      icon: MapPin,
      path: "/hospitals",
    },
  ];

  // Supported Hospital Specialties Section Data
  const specialtiesData = [
    { name: "Cardiology", icon: Heart, count: "85 Hospitals", color: "text-rose-600 bg-rose-50 border-rose-100" },
    { name: "Neurology", icon: Activity, count: "62 Hospitals", color: "text-purple-600 bg-purple-50 border-purple-100" },
    { name: "Orthopedics", icon: Stethoscope, count: "94 Hospitals", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { name: "Pediatrics", icon: HeartPulse, count: "78 Hospitals", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { name: "Emergency Medicine", icon: Zap, count: "120 Hospitals", color: "text-amber-600 bg-amber-50 border-amber-100" },
    { name: "Oncology", icon: Sparkles, count: "45 Hospitals", color: "text-sky-600 bg-sky-50 border-sky-100" },
    { name: "Pulmonology", icon: Wind, count: "58 Hospitals", color: "text-teal-600 bg-teal-50 border-teal-100" },
    { name: "General Surgery", icon: Building2, count: "110 Hospitals", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Enter Symptoms or Search",
      description: "Type your emergency symptoms or select required hospital specialties.",
      icon: Search,
    },
    {
      step: "02",
      title: "Hospital Resource Discovery",
      description: "Discover top hospitals by proximity, wait time, and ICU bed count.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Compare Bed Telemetry",
      description: "Review live bed counters, doctors on duty, and accepted insurance networks.",
      icon: BedDouble,
    },
    {
      step: "04",
      title: "Call ER or View Details",
      description: "Get direct phone numbers for emergency rooms and explore hospital details instantly.",
      icon: Navigation,
    },
  ];

  // Why Choose CareNavigator
  const whyChooseUsData = [
    {
      title: "Real-Time Information",
      description: "Telemetry updates hospital bed counts and ER wait times automatically.",
      icon: Clock,
    },
    {
      title: "Fast Emergency Support",
      description: "Emergency Services directory provides 24/7 access to regional Trauma centers and hotlines.",
      icon: Zap,
    },
    {
      title: "Hospital Resource Discovery",
      description: "Precision discovery rankings ensure patients reach hospitals with active specialized care.",
      icon: Sparkles,
    },
    {
      title: "Trusted Hospitals",
      description: "Network of 500+ verified Level 1 Trauma and Super-Specialty medical centers.",
      icon: ShieldCheck,
    },
    {
      title: "Secure Platform",
      description: "Privacy Focused & Encrypted Communication protecting user data.",
      icon: Lock,
    },
    {
      title: "Easy to Use",
      description: "Intuitive glassmorphic interface built for speed during critical emergency situations.",
      icon: UserCheck,
    },
  ];

  // Testimonials
  const testimonialsData = [
    {
      patientName: "Marcus Vance",
      hospitalName: "Patient",
      rating: 5,
      date: "3 days ago",
      comment:
        "CareNavigator helped us discover a cardiology ICU only 6 minutes away when my father had sudden chest discomfort. We found open beds in seconds.",
      verified: true,
    },
    {
      patientName: "Elena Rostova",
      hospitalName: "Family Member",
      rating: 5,
      date: "1 week ago",
      comment:
        "During a late-night emergency, being able to quickly find hospitals with open pediatric beds saved us critical time without driving around blindly.",
      verified: true,
    },
    {
      patientName: "David Miller",
      hospitalName: "Paramedic Response",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "The Emergency Services directory gave us instant access to verified hospital contacts and dispatch numbers during emergency transfers.",
      verified: true,
    },
  ];

  // FAQ Section
  const faqData = [
    {
      title: "Can I reserve a hospital bed?",
      content:
        "No. CareNavigator only displays live hospital resource availability. Final admission and bed allocation depend entirely on the hospital's medical staff and policies.",
    },
    {
      title: "How does CareNavigator discover the right hospital for me?",
      content:
        "Our platform analyzes your medical query or symptoms against real-time ICU bed availability, ER wait times, specialty departments, and travel distance to generate a percentage-based recommendation ranking.",
    },
    {
      title: "How accurate is the resource telemetry?",
      content:
        "Hospital telemetry feeds sync automatically to provide accurate, real-time counts for ICU, ventilator, pediatric, and general ward beds inside each hospital card.",
    },
    {
      title: "How do I access emergency hotlines and ambulance services?",
      content:
        "Click Emergency Map or Emergency Services directory in the navigation bar to view 24/7 verified hotline numbers and hospital ambulance contacts.",
    },
    {
      title: "Is CareNavigator free for patients?",
      content:
        "Yes, CareNavigator is completely free for patients and emergency responders to ensure rapid, unhindered access to life-saving medical care.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. REBUILT FULL-WIDTH HERO SECTION (90-92% Desktop Width, Premium SaaS Health-Tech Background) */}
      <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-sky-50/70 via-blue-50/30 to-white overflow-hidden">
        {/* Subtle Ambient Background Treatment: Dotted Matrix Grid + Soft Radial Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-50 -z-10" />
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-[650px] h-[650px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-24 -left-24 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* 2-Column Grid (48% / 52% Ratio, Balanced Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT COLUMN: Wider Container, Natural 3-Line Headline, Primary CTA Button */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-black border border-blue-200/80 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span>Real-Time Hospital Resource Discovery & Navigation</span>
              </div>

              {/* Headline: Formed Cleanly into 3 Natural Lines */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-950 tracking-tight leading-[1.12]">
                Find the Right<br className="hidden sm:inline" />
                Hospital,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500">
                  Right When
                </span><br className="hidden sm:inline" />
                You Need It.
              </h1>

              {/* Supporting Description (Occupies ~85-90% of Left Column) */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Real-time hospital resource discovery, ICU bed availability telemetry, live emergency navigation, and intelligent triage assistance to get critical patients the right care in seconds.
              </p>

              {/* Primary CTA Button (Find Hospitals) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate("/hospitals")}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="block font-black text-base leading-tight">Find Hospitals</span>
                      <span className="block text-xs text-blue-100 font-medium">Search Nearby & Compare ICU Beds</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform ml-2" />
                </button>
              </div>

              {/* Single Horizontal Row of Feature Indicators on Desktop */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-3 text-xs font-bold text-slate-700 max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live Bed Availability</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI-Powered Matching</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 Emergency Support</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-Specialty</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Larger 680px Wide Live Recommendation Health-Tech Dashboard */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[680px] bg-[#0b1329] rounded-[36px] p-6 sm:p-8 shadow-2xl border border-slate-800/90 text-white space-y-5 overflow-hidden">

                {/* Background Glows inside Dashboard */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Dashboard Header Bar */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-200 tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>LIVE HOSPITAL RECOMMENDATION</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 text-[11px] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    Live Active
                  </span>
                </div>

                {/* 3 Telemetry Pill Cards */}
                <div className="relative z-10 grid grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
                    <strong className="text-xl sm:text-2xl font-black text-emerald-400 block leading-none">98%</strong>
                    <span className="text-[11px] font-bold text-slate-400 block mt-1">AI Match</span>
                  </div>
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
                    <strong className="text-xl sm:text-2xl font-black text-slate-200 block leading-none">5 min</strong>
                    <span className="text-[11px] font-bold text-slate-400 block mt-1">Est. ER Wait</span>
                  </div>
                  <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
                    <strong className="text-xl sm:text-2xl font-black text-slate-200 block leading-none">1.8 km</strong>
                    <span className="text-[11px] font-bold text-slate-400 block mt-1">Nearest Hospital</span>
                  </div>
                </div>

                {/* Main Visual: Unified Map Vector + Hospital Card Layout */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch pt-1">

                  {/* Left Half: Vector Map Routing Visual */}
                  <div className="sm:col-span-6 relative bg-slate-900/95 rounded-2xl border border-slate-800 overflow-hidden min-h-[230px] flex items-center justify-center p-3">
                    {/* Dark Satellite Vector Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b60_1px,transparent_1px),linear-gradient(to_bottom,#1e293b60_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

                    <svg className="w-full h-full relative z-10" viewBox="0 0 240 180" fill="none">
                      {/* Map Building Layout */}
                      <rect x="20" y="30" width="45" height="32" rx="4" fill="#1e293b" opacity="0.7" />
                      <rect x="80" y="20" width="55" height="42" rx="4" fill="#1e293b" opacity="0.7" />
                      <rect x="150" y="35" width="45" height="30" rx="4" fill="#1e293b" opacity="0.7" />
                      <rect x="110" y="105" width="60" height="45" rx="4" fill="#1e293b" opacity="0.7" />

                      {/* Dashed Neon Green Route Beam */}
                      <path d="M 50 140 L 90 120 L 110 80 L 180 50 L 195 40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 4" className="animate-pulse" />

                      {/* User Location Beacon */}
                      <circle cx="50" cy="140" r="14" fill="#0284c7" fillOpacity="0.4" />
                      <circle cx="50" cy="140" r="7" fill="#38bdf8" />
                      <text x="50" y="165" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">You</text>

                      {/* Hospital Destination Beacon */}
                      <circle cx="195" cy="40" r="14" fill="#e11d48" fillOpacity="0.4" />
                      <circle cx="195" cy="40" r="8" fill="#f43f5e" />
                      <text x="195" y="44" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">+</text>
                    </svg>
                  </div>

                  {/* Right Half: Hospital Recommendation Details Card */}
                  <div className="sm:col-span-6 bg-slate-900/95 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-800">
                        <img
                          src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
                          alt="St. Jude Cardiac Institute"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-md shadow-md">
                          98% Match
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm leading-tight">St. Jude Cardiac Institute</h4>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          🛡️ Level 1 Trauma Center
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-1">
                          <span>★★★★★</span>
                          <span>4.9 (1420 reviews)</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs pt-1.5 border-t border-slate-800/80">
                        <div className="flex justify-between">
                          <span className="text-slate-400">ICU Beds</span>
                          <strong className="text-emerald-400 font-bold">4 Available</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ER Wait Time</span>
                          <strong className="text-rose-400 font-bold">5 mins</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Distance</span>
                          <strong className="text-sky-400 font-bold">1.8 km</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/hospitals")}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      View Full Details
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. STATS SECTION BAR (Full-Width Container Matching Hero Width) */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">

            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">500+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Partner Hospitals</strong>
                <span className="text-[11px] text-slate-400 font-medium">Across major cities</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">10,000+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">ICU Beds Monitored</strong>
                <span className="text-[11px] text-slate-400 font-medium">Real-time availability</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-none">300+</span>
                <strong className="text-xs font-bold text-slate-800 block mt-1">Emergency Services</strong>
                <span className="text-[11px] text-slate-400 font-medium">24/7 ambulance network</span>
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
                <span className="text-[11px] text-slate-400 font-medium">Multi-specialty care</span>
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
            Designed for Instant Medical Response
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Everything patients, family members, and ER teams need for rapid hospital discovery.
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

      {/* 5. HOW IT WORKS (4 STEPS) */}
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
              4 fast steps from emergency symptom onset to direct ICU resource discovery.
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
            Trusted by Patients, Families & Paramedics
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
              Ready to Explore Nearby Hospitals & ICU Availability?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-medium">
              Access real-time telemetry, discover specialized hospitals, or evaluate emergency symptoms today.
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
              Search by Symptoms
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
