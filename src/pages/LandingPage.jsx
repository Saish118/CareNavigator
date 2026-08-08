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
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { EmergencySOSButton } from "../components/buttons/EmergencySOSButton";
import { FeatureCard } from "../components/cards/FeatureCard";
import { ReviewCard } from "../components/cards/ReviewCard";
import { Accordion } from "../components/ui/Accordion";
import { useEmergency } from "../context/EmergencyContext";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { triggerSos } = useEmergency();

  // 1. Realistic Platform Metrics
  const statisticsData = [
    { label: "Partner Hospitals", value: "500+", icon: Stethoscope, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "ICU Beds Monitored", value: "10,000+", icon: BedDouble, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Emergency Services", value: "300+", icon: Ambulance, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Specialties Covered", value: "120+", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  // 2. Core Capabilities Cards
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

  // 6. Why Choose CareNavigator
  const whyChooseUsData = [
    {
      title: "Real-Time Information",
      description: "Telemetry updates hospital bed counts and ER wait times automatically.",
      icon: Clock,
    },
    {
      title: "Fast Emergency Support",
      description: "One-tap SOS triggers immediate GPS location transmission to 3 nearest Trauma centers.",
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

  // 7. Realistic Testimonials
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

  // 8. FAQ Section
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
      title: "What happens when I press the Emergency SOS button?",
      content:
        "Pressing SOS connects directly to emergency dispatch (911 / 108) and displays direct hotlines for instant emergency assistance.",
    },
    {
      title: "Is CareNavigator free for patients?",
      content:
        "Yes, CareNavigator is completely free for patients and emergency responders to ensure rapid, unhindered access to life-saving medical care.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. REDESIGNED HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 bg-slate-900/5 overflow-hidden">
        {/* Ambient Subtle Background Gradient & Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/90 via-blue-50/40 to-white -z-10" />
        <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200/50 via-blue-100/30 to-transparent -z-10" />
        
        {/* Subtle Tech Grid Lines SVG Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Main Headline, Description, CTAs, Feature Highlights */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-black border border-blue-200/80 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                <span>Real-Time Hospital Resource Discovery & Navigation</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
                Find the Right Hospital,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-500">
                  Right When You Need It.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Real-time hospital resource discovery, ICU bed availability telemetry, and emergency services directory to get critical patients to the right care in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <PrimaryButton
                  onClick={() => navigate("/hospitals")}
                  size="lg"
                  icon={Stethoscope}
                  className="w-full sm:w-auto shadow-lg shadow-blue-500/20"
                >
                  Find Hospitals
                </PrimaryButton>

                <EmergencySOSButton
                  onClick={triggerSos}
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-rose-600/30"
                >
                  Emergency SOS
                </EmergencySOSButton>
              </div>

              {/* Compact Feature Highlights Row */}
              <div className="pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-3 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  "Live Bed Availability",
                  "AI-Powered Matching",
                  "24/7 Emergency Support",
                  "Multi-Specialty Coverage",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Premium Healthcare Technology Dashboard Card */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 text-white overflow-hidden space-y-5 group">
                
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Dashboard Header Bar */}
                <div className="relative z-10 flex items-center justify-between p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-100 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                    <span>LIVE HOSPITAL RECOMMENDATION</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold rounded-lg border border-emerald-500/30 text-[10px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    Live Active
                  </span>
                </div>

                {/* Key Metrics Chips Row */}
                <div className="relative z-10 grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Recommendation</span>
                    <strong className="text-xs sm:text-sm font-black text-emerald-400">98% AI Match</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-rose-500/30 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. ER Wait</span>
                    <strong className="text-xs sm:text-sm font-black text-rose-400">5 min wait</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-sky-500/30 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Proximity</span>
                    <strong className="text-xs sm:text-sm font-black text-sky-400">1.8 km nearest</strong>
                  </div>
                </div>

                {/* Route Vector Map Graphic Area */}
                <div className="relative z-10 bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <MapPin className="w-3.5 h-3.5" /> Patient Location (GPS)
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Navigation className="w-3 h-3 animate-bounce" /> Fast Route Active (6 mins)
                    </span>
                  </div>

                  <div className="relative h-28 w-full bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center p-2">
                    {/* SVG Vector Path */}
                    <svg className="w-full h-full" viewBox="0 0 360 100" fill="none">
                      <path d="M 0 25 H 360 M 0 50 H 360 M 0 75 H 360" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <path d="M 30 75 Q 180 15 330 45" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" className="animate-pulse" />
                      <circle cx="30" cy="75" r="10" fill="#0284c7" fillOpacity="0.3" />
                      <circle cx="30" cy="75" r="5" fill="#38bdf8" />
                      <circle cx="330" cy="45" r="12" fill="#e11d48" fillOpacity="0.3" />
                      <circle cx="330" cy="45" r="6" fill="#f43f5e" />
                    </svg>

                    <div className="absolute left-4 bottom-2 text-[10px] font-bold text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                      Sector 4, Metro City
                    </div>
                    <div className="absolute right-4 top-2 text-[10px] font-bold text-emerald-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                      St. Jude Cardiac ICU
                    </div>
                  </div>
                </div>

                {/* Floating Hospital Card Details Box */}
                <div className="relative z-10 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">St. Jude Metro Cardiac & Trauma Institute</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mt-0.5">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" /> 4.9 (1,420 reviews)
                        </span>
                        <span>•</span>
                        <span className="text-slate-300">Level 1 Trauma Center</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-black rounded-lg text-[10px] border border-emerald-500/40 shrink-0">
                      Top Match
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">ICU Beds</span>
                      <strong className="text-xs font-black text-emerald-400">4 Free Beds</strong>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">ER Wait</span>
                      <strong className="text-xs font-black text-rose-400">5 min wait</strong>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Distance</span>
                      <strong className="text-xs font-black text-sky-400">1.8 km away</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/hospitals")}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* 2. TRUSTED STATISTICS SECTION (Visually Connected Below Hero) */}
          <div className="pt-8 border-t border-slate-200/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {statisticsData.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className={`p-3 sm:p-3.5 rounded-2xl border ${stat.color} shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">{stat.value}</span>
                      <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                  </div>
                );
              })}
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

      {/* 9. NEW SECTION: SUPPORTED HOSPITAL SPECIALTIES */}
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

      {/* 4. HOW IT WORKS (4 STEPS) */}
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

      {/* 5. WHY CHOOSE CARENAVIGATOR */}
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

      {/* 6. TESTIMONIALS */}
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

      {/* 7. FAQ ACCORDION */}
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

      {/* 8. CALL-TO-ACTION SECTION */}
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
