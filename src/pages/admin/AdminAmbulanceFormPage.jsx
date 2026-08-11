import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Ambulance,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Activity,
  HeartPulse,
  Zap,
} from "lucide-react";
import { ambulanceService } from "../../services/ambulanceService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";

export const AdminAmbulanceFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    providerName: "",
    ambulanceRegistrationNumber: "",
    ambulanceType: "ICU Ambulance",
    description: "",

    // Contact
    primaryPhone: "",
    emergencyPhone: "108",
    email: "",

    // Location
    address: "",
    area: "",
    city: "Kopargaon",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "423601",
    latitude: "19.8916",
    longitude: "74.4795",

    // Availability
    availabilityStatus: "Available",

    // Services / Equipment
    oxygen: true,
    ventilator: true,
    defibrillator: true,
    cardiacMonitor: true,
    stretcher: true,
    otherEquipment: "Suction Machine, Nebulizer, Syringe Pump",

    // Operating Hours
    isOpen247: true,
    opdHours: {
      monday: { open: true, from: "00:00", to: "23:59" },
      tuesday: { open: true, from: "00:00", to: "23:59" },
      wednesday: { open: true, from: "00:00", to: "23:59" },
      thursday: { open: true, from: "00:00", to: "23:59" },
      friday: { open: true, from: "00:00", to: "23:59" },
      saturday: { open: true, from: "00:00", to: "23:59" },
      sunday: { open: true, from: "00:00", to: "23:59" },
    },

    // Verification & Publishing
    // MANDATORY DEFAULT CREATION STATE: pending & published: false for new records
    verificationType: "State Transport Authority",
    verificationNumber: "",
    verificationNotes: "",
    verificationStatus: isEditMode ? "verified" : "pending",
    published: isEditMode ? true : false,

    // Image
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    additionalImagesInput: "",
  });

  useEffect(() => {
    if (isEditMode) {
      let isMounted = true;
      const loadAmbulance = async () => {
        setLoading(true);
        try {
          const fetched = await ambulanceService.getAmbulanceById(id);
          if (fetched && isMounted) {
            setFormData({
              providerName: fetched.providerName || "",
              ambulanceRegistrationNumber: fetched.ambulanceRegistrationNumber || "",
              ambulanceType: fetched.ambulanceType || "ICU Ambulance",
              description: fetched.description || "",

              primaryPhone: fetched.primaryPhone || "",
              emergencyPhone: fetched.emergencyPhone || "108",
              email: fetched.email || "",

              address: fetched.address || "",
              area: fetched.area || "",
              city: fetched.city || "Kopargaon",
              district: fetched.district || "Ahmednagar",
              state: fetched.state || "Maharashtra",
              pincode: fetched.pincode || fetched.pinCode || "",
              latitude: fetched.latitude || fetched.coordinates?.lat || "",
              longitude: fetched.longitude || fetched.coordinates?.lng || "",

              availabilityStatus: fetched.availabilityStatus || "Available",

              oxygen: fetched.oxygen ?? true,
              ventilator: fetched.ventilator ?? true,
              defibrillator: fetched.defibrillator ?? true,
              cardiacMonitor: fetched.cardiacMonitor ?? true,
              stretcher: fetched.stretcher ?? true,
              otherEquipment: Array.isArray(fetched.otherEquipment)
                ? fetched.otherEquipment.join(", ")
                : fetched.otherEquipment || "",

              isOpen247: fetched.isOpen247 ?? true,
              opdHours: fetched.opdHours || {
                monday: { open: true, from: "00:00", to: "23:59" },
                tuesday: { open: true, from: "00:00", to: "23:59" },
                wednesday: { open: true, from: "00:00", to: "23:59" },
                thursday: { open: true, from: "00:00", to: "23:59" },
                friday: { open: true, from: "00:00", to: "23:59" },
                saturday: { open: true, from: "00:00", to: "23:59" },
                sunday: { open: true, from: "00:00", to: "23:59" },
              },

              verificationType: fetched.verificationType || "State Transport Authority",
              verificationNumber: fetched.verificationNumber || "",
              verificationNotes: fetched.verificationNotes || "",
              verificationStatus: fetched.verificationStatus || "verified",
              published: fetched.published === true,

              image: fetched.image || "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
              additionalImagesInput: Array.isArray(fetched.additionalImages)
                ? fetched.additionalImages.join(", ")
                : "",
            });
          }
        } catch (err) {
          addToast("Failed to load ambulance record: " + err.message, "error");
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadAmbulance();
      return () => {
        isMounted = false;
      };
    }
  }, [id, isEditMode, addToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpdChange = (day, field, val) => {
    setFormData((prev) => ({
      ...prev,
      opdHours: {
        ...prev.opdHours,
        [day]: {
          ...prev.opdHours[day],
          [field]: val,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.providerName.trim() || !formData.address.trim() || !formData.city.trim()) {
      addToast("Please complete required fields (Provider Name, Address, City).", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const latNum = parseFloat(formData.latitude);
      const lngNum = parseFloat(formData.longitude);

      const additionalImagesList = formData.additionalImagesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        providerName: formData.providerName.trim(),
        ambulanceRegistrationNumber: formData.ambulanceRegistrationNumber.trim(),
        ambulanceType: formData.ambulanceType,
        description: formData.description.trim(),

        primaryPhone: formData.primaryPhone.trim(),
        emergencyPhone: formData.emergencyPhone.trim() || "108",
        email: formData.email.trim(),

        address: formData.address.trim(),
        area: formData.area.trim(),
        city: formData.city.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        pinCode: formData.pincode.trim(),

        latitude: !isNaN(latNum) ? latNum : null,
        longitude: !isNaN(lngNum) ? lngNum : null,
        coordinates: {
          lat: !isNaN(latNum) ? latNum : 19.8916,
          lng: !isNaN(lngNum) ? lngNum : 74.4795,
        },

        availabilityStatus: formData.availabilityStatus,

        oxygen: formData.oxygen,
        ventilator: formData.ventilator,
        defibrillator: formData.defibrillator,
        cardiacMonitor: formData.cardiacMonitor,
        stretcher: formData.stretcher,
        otherEquipment: formData.otherEquipment.trim(),

        isOpen247: formData.isOpen247,
        opdHours: formData.opdHours,

        verificationType: formData.verificationType,
        verificationNumber: formData.verificationNumber.trim(),
        verificationNotes: formData.verificationNotes.trim(),
        verificationStatus: formData.verificationStatus,
        published: formData.published,

        image: formData.image.trim(),
        additionalImages: additionalImagesList,
      };

      if (isEditMode) {
        await ambulanceService.updateAmbulance(id, payload, currentUser);
        addToast(`Ambulance "${payload.providerName}" updated successfully.`, "success");
      } else {
        const created = await ambulanceService.addAmbulance(payload, currentUser);
        console.log("✅ Ambulance creation verified in Cloud Firestore:", created);
        addToast(`Ambulance "${created.providerName}" created and saved to Firestore.`, "success");
      }

      navigate("/admin/ambulances");
    } catch (err) {
      console.error("💥 Firestore Ambulance Save Error:", err);
      addToast("Failed to save ambulance to Cloud Firestore: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold">Loading ambulance record data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => navigate("/admin/ambulances")}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Ambulances Table
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isEditMode ? "Edit Ambulance Unit" : "Add New Ambulance Unit"}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Register emergency ambulance provider, equipment specs, location, and dispatch status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A — BASIC INFORMATION */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Ambulance className="w-5 h-5 text-rose-400" /> Section A — Provider & Unit Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Ambulance Provider / Unit Name *
              </label>
              <input
                type="text"
                name="providerName"
                value={formData.providerName}
                onChange={handleChange}
                placeholder="e.g. Lifeline ICU Express Ambulance"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Registration Number (RTO)
              </label>
              <input
                type="text"
                name="ambulanceRegistrationNumber"
                value={formData.ambulanceRegistrationNumber}
                onChange={handleChange}
                placeholder="e.g. MH-17-AZ-1080"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Ambulance Type *
              </label>
              <select
                name="ambulanceType"
                value={formData.ambulanceType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
                <option value="ICU Ambulance">ICU Ambulance</option>
                <option value="Neonatal Ambulance">Neonatal Ambulance</option>
                <option value="Patient Transport">Patient Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description / Clinical Specs
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Specialized medical equipment, emergency paramedic staff, oxygen capabilities..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION B — CONTACT DETAILS */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-amber-400" /> Section B — Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleChange}
                placeholder="e.g. 02423-222340"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Emergency Dispatch Line</label>
              <input
                type="text"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="e.g. 108"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ambulance@lifeline.org"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION C — LOCATION & COORDINATES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-emerald-400" /> Section C — Depot / Station Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Station address or hospital depot"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Area / Locality</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Station Road"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Kopargaon"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Ahmednagar"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="423601"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="19.8916"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="74.4795"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION D — EQUIPMENT & SERVICES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <HeartPulse className="w-5 h-5 text-rose-500" /> Section D — Equipment & Services Specs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              { name: "oxygen", label: "Oxygen Cylinder & Pipeline" },
              { name: "ventilator", label: "Portable Cardiac Ventilator" },
              { name: "defibrillator", label: "Automated Defibrillator (AED)" },
              { name: "cardiacMonitor", label: "Multi-Para Cardiac Monitor" },
              { name: "stretcher", label: "Collapsible Stretcher System" },
              { name: "isOpen247", label: "24/7 Dispatch Readiness" },
            ].map((item) => (
              <label
                key={item.name}
                className="flex items-center gap-2.5 p-3 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-600"
                />
                <span className="font-semibold text-slate-200">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Other Specialized Equipment Notes
            </label>
            <input
              type="text"
              name="otherEquipment"
              value={formData.otherEquipment}
              onChange={handleChange}
              placeholder="e.g. Suction Machine, Nebulizer, Syringe Pump"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* SECTION E — DISPATCH AVAILABILITY & OPERATING HOURS */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-sky-400" /> Section E — Dispatch Availability Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Real-Time Availability Status *
              </label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer font-bold"
              >
                <option value="Available">Available (Ready to Dispatch)</option>
                <option value="On Call">On Call (Dispatched / En Route)</option>
                <option value="Busy">Busy (In Service)</option>
                <option value="Offline">Offline (Maintenance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION F — VERIFICATION & PUBLISHING */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Section F — Verification & Publishing Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Authority / Type
              </label>
              <select
                name="verificationType"
                value={formData.verificationType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="State Transport Authority">State Transport Authority (RTO)</option>
                <option value="Government Health Department">Government Health Department</option>
                <option value="Hospital Emergency Board">Hospital Emergency Board</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Status *
              </label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer font-bold"
              >
                <option value="pending">Pending (Unverified)</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Reference Number
              </label>
              <input
                type="text"
                name="verificationNumber"
                value={formData.verificationNumber}
                onChange={handleChange}
                placeholder="e.g. RTO-MH-AMB-4029"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Auditor Notes
              </label>
              <input
                type="text"
                name="verificationNotes"
                value={formData.verificationNotes}
                onChange={handleChange}
                placeholder="Audit notes or inspection credentials"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center pt-2">
              <label className="flex items-center gap-3 p-3.5 bg-slate-800 rounded-xl border border-slate-700 w-full cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-600"
                />
                <div>
                  <span className="font-bold text-white text-xs block">Publish to Emergency Map</span>
                  <span className="text-[10px] text-slate-400 block">
                    Only verified + published ambulances will appear on the public emergency map portal.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION G — IMAGES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-rose-400" /> Section G — Unit Image Assets
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Photo URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate("/admin/ambulances")}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Update Ambulance Unit" : "Create Ambulance Unit"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
