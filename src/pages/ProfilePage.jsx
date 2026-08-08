import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  HeartPulse,
  Bookmark,
  Edit2,
  Trash2,
  PhoneCall,
  Clock,
  ShieldCheck,
  Bell,
  Globe,
  Lock,
  HelpCircle,
  LogOut,
  Star,
  ExternalLink,
  Plus,
  Building2,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useBookmark } from "../context/BookmarkContext";
import { useToast } from "../components/ui/ToastNotification";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { savedHospitalIds, toggleSaveHospital } = useBookmark();

  // State for user info
  const [userInfo, setUserInfo] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    dob: "Oct 14, 1990",
    bloodGroup: "O-Positive",
    city: "Central Metro City",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  });

  // State for emergency contacts (up to 3)
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "Elena Rivera", relationship: "Spouse", phone: "+1 (555) 987-6543" },
    { id: 2, name: "Dr. Marcus Vance", relationship: "Primary Physician", phone: "+1 (800) 555-0199" },
    { id: 3, name: "Carlos Rivera", relationship: "Brother", phone: "+1 (555) 432-8765" },
  ]);

  // Medical Info Chips
  const [medicalInfo] = useState({
    bloodGroup: "O+ (Donor)",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Mild Hypertension"],
    height: "178 cm",
    weight: "74 kg",
  });

  // Saved Hospitals list
  const savedHospitals = HOSPITALS_DATA.filter((h) => savedHospitalIds.includes(h.id));

  // Recent Activity Feed
  const recentActivities = [
    {
      type: "Searched Hospital",
      title: "St. Jude Metro Cardiac Center",
      time: "10 mins ago",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      type: "Completed AI Triage",
      title: "Chest Tightness Triage — Level 1 Protocol",
      time: "1 hour ago",
      icon: Activity,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      type: "Viewed Hospital",
      title: "Mercy General & Children's Center",
      time: "Yesterday",
      icon: Clock,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  const handleEditProfile = () => {
    addToast("Profile editing modal opened", "info");
  };

  const handleLogout = () => {
    addToast("Logged out successfully", "success");
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 overflow-x-hidden">
      {/* HERO HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-black rounded-full border border-blue-500/30">
          <User className="w-3.5 h-3.5" />
          <span>Patient Account</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
          Manage your personal information, saved hospitals, emergency contacts, medical details, and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN (Personal Info & Account Settings) */}
        <div className="lg:col-span-1 space-y-6">
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Personal Information
              </h2>
              <button
                onClick={handleEditProfile}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-4">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-md shrink-0"
              />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{userInfo.name}</h3>
                <span className="text-xs font-semibold text-slate-500 block mt-0.5">{userInfo.city}</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-200">
                  Verified Patient
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 pt-2 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.email}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.phone}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.dob}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                </span>
                <strong className="text-rose-700 font-black">{userInfo.bloodGroup}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 6: ACCOUNT SETTINGS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Account Settings
            </h2>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <button
                onClick={() => addToast("Notification preferences active", "info")}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" /> Notifications
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Active
                </span>
              </button>

              <button
                onClick={() => addToast("Language set to English (US)", "info")}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Language
                </span>
                <span className="text-[11px] font-bold text-slate-600">English (US)</span>
              </button>

              <button
                onClick={() => navigate("/privacy")}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Privacy Policy
                </span>
                <span className="text-[11px] font-bold text-emerald-700">Encrypted</span>
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" /> Help & Support
                </span>
                <span className="text-[11px] font-bold text-slate-600">24/7 Desk</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-2xl border border-rose-200 flex items-center justify-between transition-colors cursor-pointer pt-3 mt-2"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-600" /> Sign Out
                </span>
                <span className="text-[11px] font-bold text-rose-700">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Saved Hospitals, Emergency Contacts, Medical Info, Recent Activity) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 2: SAVED HOSPITALS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" /> Saved Hospitals
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {savedHospitals.length} Facilities
              </span>
            </div>

            {savedHospitals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 space-y-3 hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-800">
                        <img
                          src={hosp.image}
                          alt={hosp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-amber-400 font-bold text-[10px] rounded-md border border-white/10 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {hosp.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{hosp.name}</h3>

                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {hosp.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {hosp.distanceKm} km away
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <Link
                        to={`/hospital/${hosp.id}`}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        View Hospital <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => {
                          toggleSaveHospital(hosp.id);
                          addToast("Removed from saved hospitals", "info");
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold">No saved hospitals yet.</p>
                <Link to="/hospitals" className="text-xs font-bold text-blue-600 hover:underline inline-block">
                  Explore Hospital Discovery →
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 3: EMERGENCY CONTACTS (Up to 3) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" /> Emergency Contacts (Max 3)
              </h2>
              <button
                onClick={() => addToast("Add new emergency contact modal", "info")}
                className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      {contact.relationship}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{contact.name}</h3>
                    <p className="text-xs text-slate-600 font-mono font-semibold">{contact.phone}</p>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer mt-2"
                  >
                    <PhoneCall className="w-3 h-3" /> Call Contact
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: MEDICAL INFORMATION (Optional Chips) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" /> Medical Information
              </h2>
              <button
                onClick={() => addToast("Medical info updated", "success")}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Update
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-2">
                  {medicalInfo.allergies.map((alg, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-800 font-bold rounded-xl border border-rose-200">
                      ⚠️ {alg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                  Existing Medical Conditions
                </span>
                <div className="flex flex-wrap gap-2">
                  {medicalInfo.conditions.map((cond, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 font-bold rounded-xl border border-amber-200">
                      🩺 {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Type</span>
                  <strong className="text-sm font-black text-rose-700">{medicalInfo.bloodGroup}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Height</span>
                  <strong className="text-sm font-black text-slate-900">{medicalInfo.height}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Weight</span>
                  <strong className="text-sm font-black text-slate-900">{medicalInfo.weight}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: RECENT ACTIVITY */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" /> Recent User Activity
            </h2>

            <div className="space-y-3">
              {recentActivities.map((act, i) => {
                const IconComp = act.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${act.color} shrink-0`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold block">{act.title}</strong>
                        <span className="text-[11px] text-slate-500 font-medium">{act.type}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold shrink-0">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
