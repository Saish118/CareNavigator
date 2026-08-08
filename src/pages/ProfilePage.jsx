import React, { useState, useEffect } from "react";
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
  Activity,
} from "lucide-react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { HOSPITALS_DATA } from "../data/hospitalsData";
import { useBookmark } from "../context/BookmarkContext";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { EmergencyContactModal } from "../components/profile/EmergencyContactModal";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { savedHospitalIds, toggleSaveHospital } = useBookmark();
  const { currentUser } = useAuth();

  const [userDoc, setUserDoc] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Emergency Contact Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  // Subscribe to real-time Cloud Firestore document changes for currentUser.uid
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserDoc(docSnap.data());
        } else {
          setUserDoc(null);
        }
      },
      (error) => {
        console.error("Error subscribing to user Firestore document:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Auto-sync phone number from Firebase Auth to Firestore if missing in Firestore document
  useEffect(() => {
    if (!currentUser?.uid) return;
    const authPhone = currentUser.phoneNumber;
    if (authPhone && (!userDoc?.phone || userDoc.phone.trim() === "")) {
      const userRef = doc(db, "users", currentUser.uid);
      setDoc(userRef, { phone: authPhone, updatedAt: serverTimestamp() }, { merge: true }).catch((err) => {
        console.warn("Auto-sync phone to Firestore warning:", err);
      });
    }
  }, [currentUser, userDoc]);

  // Personal Information loaded dynamically from Firestore or fallback to "Not added yet"
  const userInfo = {
    name: userDoc?.name || currentUser?.displayName || "Not added yet",
    email: userDoc?.email || currentUser?.email || "Not added yet",
    phone: userDoc?.phone || currentUser?.phoneNumber || "Not added yet",
    dob: userDoc?.dateOfBirth || userDoc?.dob || "Not added yet",
    bloodGroup: userDoc?.bloodGroup || "Not added yet",
    city: userDoc?.city || "Not added yet",
    lastUpdated: userDoc?.updatedAt?.toDate
      ? userDoc.updatedAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Just now",
    avatar: currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  };

  // Emergency Contacts loaded dynamically from Firestore (empty array if not added yet)
  const emergencyContacts = Array.isArray(userDoc?.emergencyContacts) ? userDoc.emergencyContacts : [];

  // Medical Information Chips loaded from Firestore or fallback to "Not added yet"
  const medicalInfo = {
    bloodGroup: userDoc?.bloodGroup || "Not added yet",
    allergies: userDoc?.allergies && userDoc.allergies.length > 0 ? userDoc.allergies : ["Not added yet"],
    conditions: userDoc?.conditions && userDoc.conditions.length > 0 ? userDoc.conditions : ["Not added yet"],
    height: userDoc?.height ? `${userDoc.height} cm` : "Not added yet",
    weight: userDoc?.weight ? `${userDoc.weight} kg` : "Not added yet",
  };

  // Saved Hospitals using actual Hospital Discovery dataset
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
    setIsEditModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to remove this emergency contact?")) {
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const updatedContacts = emergencyContacts.filter((c) => c.id !== contactId);
      await setDoc(
        userRef,
        {
          emergencyContacts: updatedContacts,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      addToast("Emergency contact removed successfully.", "info");
    } catch (error) {
      console.error("Error removing emergency contact:", error);
      addToast(error.message || "Failed to remove emergency contact.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast("Signed out successfully", "success");
      navigate("/login");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 overflow-x-hidden">
      {/* CLEAN PAGE HEADING */}
      <div className="border-b border-slate-200/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Manage your personal information, saved hospitals, emergency contacts, medical information, and account settings.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
          CareNavigator Member
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN (Personal Info & Account Settings) */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. PERSONAL INFORMATION */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Personal Information
                </h2>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Last Updated: {userInfo.lastUpdated}
                </span>
              </div>

              <button
                onClick={handleEditProfile}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-3.5">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">{userInfo.name}</h3>
                <span className="text-xs font-semibold text-slate-500 block mt-0.5">{userInfo.city}</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md border border-emerald-200">
                  CareNavigator Member
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 pt-1 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5" /> Email:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.email}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5" /> Mobile:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.phone}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Date of Birth:
                </span>
                <strong className="text-slate-900 font-bold">{userInfo.dob}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                </span>
                <strong className="text-rose-700 font-black">{userInfo.bloodGroup}</strong>
              </div>
            </div>
          </div>

          {/* ACCOUNT SETTINGS */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Account Settings
            </h2>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <button
                onClick={() => addToast("Notification preferences active", "info")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" /> Notifications
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Active
                </span>
              </button>

              <button
                onClick={() => addToast("Language set to English (US)", "info")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Language
                </span>
                <span className="text-[10px] font-bold text-slate-600">English (US)</span>
              </button>

              <button
                onClick={() => navigate("/privacy")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Privacy Policy
                </span>
                <span className="text-[10px] font-bold text-emerald-700">Encrypted</span>
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" /> Help & Support
                </span>
                <span className="text-[10px] font-bold text-slate-600">24/7 Desk</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-2xl border border-rose-200 flex items-center justify-between transition-colors cursor-pointer pt-2.5 mt-1"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-600" /> Sign Out
                </span>
                <span className="text-[10px] font-bold text-rose-700">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Saved Hospitals, Emergency Contacts, Medical Info, Recent Activity) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SAVED HOSPITALS */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" /> Saved Hospitals
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {savedHospitals.length} Saved
              </span>
            </div>

            {savedHospitals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {savedHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-3.5 space-y-3 hover:shadow-md transition-shadow group flex flex-col justify-between"
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
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
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
              <div className="text-center py-6 text-slate-500 space-y-2">
                <Bookmark className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold">No saved hospitals yet.</p>
                <Link to="/hospitals" className="text-xs font-bold text-blue-600 hover:underline inline-block">
                  Explore Hospital Discovery →
                </Link>
              </div>
            )}
          </div>

          {/* EMERGENCY CONTACTS (Fully Driven by Firestore, Max 3, Edit/Delete, Primary Badge) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-600" /> Emergency Contacts
                </h2>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  {emergencyContacts.length >= 3
                    ? "Maximum 3 emergency contacts allowed."
                    : `${emergencyContacts.length} of 3 emergency contacts added.`}
                </span>
              </div>

              {emergencyContacts.length < 3 ? (
                <button
                  onClick={() => {
                    setContactToEdit(null);
                    setIsContactModalOpen(true);
                  }}
                  className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Contact
                </button>
              ) : (
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                  Max 3 Reached
                </span>
              )}
            </div>

            {emergencyContacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={contact.id || index}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          {contact.relationship || "Contact"}
                        </span>

                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => {
                              setContactToEdit(contact);
                              setIsContactModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Contact"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {contact.isPrimary && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-900 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-md">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Primary Contact
                        </span>
                      )}

                      <h3 className="font-extrabold text-slate-900 text-xs mt-1">{contact.name}</h3>
                      <p className="text-[11px] text-slate-600 font-mono font-semibold">{contact.phone}</p>
                    </div>

                    <a
                      href={contact.phone ? `tel:${contact.phone}` : "#"}
                      className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer mt-2"
                    >
                      <PhoneCall className="w-3 h-3" /> Call Contact
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 space-y-1.5 border border-dashed border-slate-200 rounded-2xl">
                <PhoneCall className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No emergency contacts added yet.</p>
                <button
                  onClick={() => {
                    setContactToEdit(null);
                    setIsContactModalOpen(true);
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  + Add First Emergency Contact
                </button>
              </div>
            )}
          </div>

          {/* MEDICAL INFORMATION */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-600" /> Medical Information
              </h2>
              <button
                onClick={handleEditProfile}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Update
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {medicalInfo.allergies.map((alg, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-rose-50 text-rose-800 font-bold rounded-lg border border-rose-200 text-[11px]">
                      ⚠️ {alg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                  Existing Medical Conditions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {medicalInfo.conditions.map((cond, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-amber-50 text-amber-900 font-bold rounded-lg border border-amber-200 text-[11px]">
                      🩺 {cond}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Type</span>
                  <strong className="text-xs font-black text-rose-700">{medicalInfo.bloodGroup}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Height</span>
                  <strong className="text-xs font-black text-slate-900">{medicalInfo.height}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Weight</span>
                  <strong className="text-xs font-black text-slate-900">{medicalInfo.weight}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" /> Recent Activity
            </h2>

            <div className="space-y-2.5">
              {recentActivities.map((act, i) => {
                const IconComp = act.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-xl border ${act.color} shrink-0`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold block leading-tight">{act.title}</strong>
                        <span className="text-[10px] text-slate-500 font-medium">{act.type}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        userDoc={userDoc}
      />

      {/* EMERGENCY CONTACT MODAL */}
      <EmergencyContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setContactToEdit(null);
        }}
        currentUser={currentUser}
        userDoc={userDoc}
        contactToEdit={contactToEdit}
      />
    </div>
  );
};
