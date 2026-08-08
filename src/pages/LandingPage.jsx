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

  const statisticsData = [
    { label: "Partner Hospitals", value: "500+", icon: Stethoscope, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Available Beds", value: "10,000+", icon: BedDouble, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Active Ambulances", value: "300+", icon: Ambulance, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Patients Assisted", value: "50,000+", icon: HeartPulse, color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  const featuresData = [
    {
      title: "Hospital Resource Discovery",
      description: "Match specialized trauma centers evaluating required specialties, ER wait times, and accepted insurance.",
      icon: Sparkles,
      path: "/hospitals",
    },
    {
      title: "Live Bed Availability Telemetry",
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
      title: "Medical Passport & Saved Facilities",
      description: "Bookmarked hospitals and health records accessible instantly for quick emergency reference.",
      icon: Calendar,
      path: "/profile",
    },
    {
      title: "Regional Analytics Dashboard",
      description: "Healthcare command dashboard with 24-hour occupancy trends, ER arrival statistics, & blood inventory.",
      icon: BarChart3,
      path: "/analytics",
    },
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
      description: "HIPAA-compliant data encryption protecting patient identity and medical history.",
      icon: Lock,
    },
    {
      title: "Easy to Use",
      description: "Intuitive glassmorphic interface built for speed during critical emergency situations.",
      icon: UserCheck,
    },
  ];

  const testimonialsData = [
    {
      patientName: "Marcus Vance",
      hospitalName: "St. Jude Cardiac Center",
      rating: 5,
      date: "3 days ago",
      comment:
        "When my father had severe chest pain, CareNavigator discovered a cardiology ICU only 6 minutes away. The emergency details were ready before we even stepped into the ER.",
      verified: true,
    },
    {
      patientName: "Dr. Elena Rostova",
      hospitalName: "Metro Emergency Paramedic",
      rating: 5,
      date: "1 week ago",
      comment:
        "The Emergency Services Directory provides instant hotlines and ambulance fleet numbers when seconds count.",
      verified: true,
    },
    {
      patientName: "Sarah & David Miller",
      hospitalName: "Mercy Children's Hospital",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "The pediatric ICU telemetry gave us instant peace of mind during our toddler's respiratory crisis. Unbelievably fast and clean app experience.",
      verified: true,
    },
  ];

  const faqData = [
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
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black border border-blue-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Real-Time Hospital Resource Discovery & Navigation</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
                Find the Right Hospital,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-500">
                  Right When You Need It.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Real-time hospital resource discovery, ICU bed availability telemetry, and emergency services directory to get critical patients to the right care in seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <PrimaryButton
                  onClick={() => navigate("/hospitals")}
                  size="lg"
                  icon={Stethoscope}
                  className="w-full sm:w-auto"
                >
                  Find Hospitals
                </PrimaryButton>

                <EmergencySOSButton
                  onClick={triggerSos}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Emergency SOS
                </EmergencySOSButton>
              </div>
            </div>

            {/* Right Healthcare Visual Illustration Placeholder */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg h-[440px] bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 shadow-2xl border border-slate-700 overflow-hidden flex flex-col justify-between">
                {/* Visual pulse glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Header widget */}
                <div className="flex items-center justify-between text-xs text-white z-10 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80 backdrop-blur-md">
                  <div className="flex items-center gap-2 font-bold">
                    <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span>Emergency Telemetry Feed</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/40 text-[10px]">
                    Live Active
                  </span>
                </div>

                {/* SVG Route Illustration */}
                <svg className="w-full h-48 z-10" viewBox="0 0 400 200">
                  <path d="M 40 160 Q 150 40 360 100" stroke="#10b981" strokeWidth="6" fill="none" strokeDasharray="8 4" className="animate-pulse" />
                  <circle cx="40" cy="160" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="360" cy="100" r="18" fill="#e11d48" stroke="#ffffff" strokeWidth="3" />
                  <text x="65" y="165" fill="#38bdf8" fontSize="11" fontWeight="bold">Patient Location</text>
                  <text x="240" y="90" fill="#f43f5e" fontSize="11" fontWeight="bold">St. Jude Cardiac ICU (98% Recommended)</text>
                </svg>

                {/* Floating Hospital Card Mockup */}
                <div className="z-10 bg-white/95 text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200 backdrop-blur-md space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 text-sm">St. Jude Cardiac Institute</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                      98% Recommended
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>ER Wait: <strong className="text-rose-600">5 mins</strong></span>
                    <span>ICU Beds: <strong className="text-emerald-600">4 Open</strong></span>
                    <span>Distance: <strong className="text-blue-600">1.8 km</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-all"
              >
                <div className={`p-3.5 rounded-2xl border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 block">{stat.value}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full">
            <Sparkles className="w-4 h-4" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Instant Medical Response
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Everything patients, paramedics, and ER triage teams need during critical medical care.
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
            Built with medical precision, HIPAA compliance, and real-time emergency routing technology.
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
            Patient Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trusted by Patients & First Responders
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
              Access real-time telemetry, discover specialized hospitals, or register your Medical Passport ID today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/hospitals")}
              className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Explore Hospitals Near Me
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="w-full sm:w-auto px-6 py-3 bg-blue-950 text-white hover:bg-slate-950 font-bold text-sm rounded-xl border border-blue-400/60 shadow-lg transition-all cursor-pointer"
            >
              Create Medical Passport ID
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
