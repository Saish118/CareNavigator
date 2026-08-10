import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  BedDouble,
  Activity,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { hospitalService } from "../../services/hospitalService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";

export const AdminHospitalFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    type: "Multispecialty",
    description: "",
    specialtiesInput: "Cardiology, Emergency Medicine, General Surgery",

    // Location
    address: "",
    area: "",
    city: "Kopargaon",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "",
    latitude: "19.8916",
    longitude: "74.4795",

    // Contact
    phone: "",
    altPhone: "",
    erDirectPhone: "",
    telephone: "",
    email: "",
    website: "",

    // Capacity
    totalBeds: "50",
    icuBeds: "10",
    nicuBeds: "4",
    picuBeds: "2",

    // Services
    isOpen247: true,
    emergencyReady: true,
    hasAmbulanceFleet: true,
    hasBloodBank: true,
    hasPharmacy: true,
    hasLab: true,
    hasCtMri: true,
    hasMri: false,
    hasXray: true,
    hasIcu: true,
    hasOpTheatre: true,

    // OPD Timings
    opdHours: {
      monday: { open: true, from: "09:00", to: "20:00" },
      tuesday: { open: true, from: "09:00", to: "20:00" },
      wednesday: { open: true, from: "09:00", to: "20:00" },
      thursday: { open: true, from: "09:00", to: "20:00" },
      friday: { open: true, from: "09:00", to: "20:00" },
      saturday: { open: true, from: "09:00", to: "18:00" },
      sunday: { open: false, from: "09:00", to: "13:00" },
    },

    // Verification
    verificationType: "Government Facility ID",
    verificationNumber: "",
    verificationNotes: "",
    verificationStatus: isEditMode ? "verified" : "pending",
    published: isEditMode ? true : false,

    // Images
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
    additionalImagesInput: "",
  });

  // Load existing hospital if in Edit mode
  useEffect(() => {
    if (isEditMode) {
      let isMounted = true;
      const loadHospital = async () => {
        setLoading(true);
        try {
          const fetched = await hospitalService.getHospitalById(id);
          if (fetched && isMounted) {
            setFormData({
              name: fetched.name || "",
              type: fetched.type || fetched.category || "Multispecialty",
              description: fetched.description || fetched.tagline || "",
              specialtiesInput: Array.isArray(fetched.specialties)
                ? fetched.specialties.join(", ")
                : "General Medicine",

              address: fetched.address || "",
              area: fetched.area || "",
              city: fetched.city || "Kopargaon",
              district: fetched.district || "Ahmednagar",
              state: fetched.state || "Maharashtra",
              pincode: fetched.pincode || "",
              latitude: fetched.latitude || fetched.coordinates?.lat || "",
              longitude: fetched.longitude || fetched.coordinates?.lng || "",

              phone: fetched.phone || "",
              altPhone: fetched.altPhone || "",
              erDirectPhone: fetched.erDirectPhone || "",
              telephone: fetched.telephone || "",
              email: fetched.email || "",
              website: fetched.website || "",

              totalBeds: fetched.beds?.total ? String(fetched.beds.total) : "50",
              icuBeds: fetched.beds?.icu?.available != null ? String(fetched.beds.icu.available) : "10",
              nicuBeds: fetched.beds?.nicu != null ? String(fetched.beds.nicu) : "0",
              picuBeds: fetched.beds?.picu != null ? String(fetched.beds.picu) : "0",

              isOpen247: fetched.isOpen247 ?? true,
              emergencyReady: fetched.emergencyReady ?? true,
              hasAmbulanceFleet: fetched.hasAmbulanceFleet ?? true,
              hasBloodBank: fetched.hasBloodBank ?? true,
              hasPharmacy: fetched.hasPharmacy ?? true,
              hasLab: fetched.hasLab ?? true,
              hasCtMri: fetched.hasCtMri ?? true,
              hasMri: fetched.hasMri ?? false,
              hasXray: fetched.hasXray ?? true,
              hasIcu: fetched.hasIcu ?? true,
              hasOpTheatre: fetched.hasOpTheatre ?? true,

              opdHours: fetched.opdHours || {
                monday: { open: true, from: "09:00", to: "20:00" },
                tuesday: { open: true, from: "09:00", to: "20:00" },
                wednesday: { open: true, from: "09:00", to: "20:00" },
                thursday: { open: true, from: "09:00", to: "20:00" },
                friday: { open: true, from: "09:00", to: "20:00" },
                saturday: { open: true, from: "09:00", to: "18:00" },
                sunday: { open: false, from: "09:00", to: "13:00" },
              },

              verificationType: fetched.verificationType || "Government Facility ID",
              verificationNumber: fetched.verificationNumber || "",
              verificationNotes: fetched.verificationNotes || "",
              verificationStatus: fetched.verificationStatus || "verified",
              published: fetched.published !== false,

              image: fetched.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
              additionalImagesInput: Array.isArray(fetched.additionalImages)
                ? fetched.additionalImages.join(", ")
                : "",
            });
          }
        } catch (err) {
          addToast("Failed to load hospital record: " + err.message, "error");
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadHospital();
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

    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      addToast("Please complete required fields (Hospital Name, Address, City).", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const specialtiesList = formData.specialtiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const additionalImagesList = formData.additionalImagesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const latNum = parseFloat(formData.latitude);
      const lngNum = parseFloat(formData.longitude);

      const totalBedsNum = parseInt(formData.totalBeds, 10) || 50;
      const icuBedsNum = parseInt(formData.icuBeds, 10) || 10;
      const nicuBedsNum = parseInt(formData.nicuBeds, 10) || 0;
      const picuBedsNum = parseInt(formData.picuBeds, 10) || 0;

      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.type,
        tagline: formData.description.trim() || `${formData.type} Facility in ${formData.city}`,
        description: formData.description.trim(),
        specialties: specialtiesList,

        address: formData.address.trim(),
        area: formData.area.trim(),
        city: formData.city.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),

        latitude: !isNaN(latNum) ? latNum : null,
        longitude: !isNaN(lngNum) ? lngNum : null,
        coordinates: {
          lat: !isNaN(latNum) ? latNum : 19.8916,
          lng: !isNaN(lngNum) ? lngNum : 74.4795,
        },

        phone: formData.phone.trim(),
        altPhone: formData.altPhone.trim(),
        erDirectPhone: formData.erDirectPhone.trim() || formData.phone.trim(),
        telephone: formData.telephone.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),

        beds: {
          total: totalBedsNum,
          icu: { available: icuBedsNum },
          nicu: nicuBedsNum,
          picu: picuBedsNum,
        },

        isOpen247: formData.isOpen247,
        emergencyReady: formData.emergencyReady,
        hasAmbulanceFleet: formData.hasAmbulanceFleet,
        hasBloodBank: formData.hasBloodBank,
        hasPharmacy: formData.hasPharmacy,
        hasLab: formData.hasLab,
        hasCtMri: formData.hasCtMri,
        hasMri: formData.hasMri,
        hasXray: formData.hasXray,
        hasIcu: formData.hasIcu,
        hasOpTheatre: formData.hasOpTheatre,

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
        await hospitalService.updateHospital(id, payload, currentUser);
        addToast("Hospital updated successfully.", "success");
      } else {
        await hospitalService.addHospital(payload, currentUser);
        addToast("Hospital added successfully.", "success");
      }

      navigate("/admin/hospitals");
    } catch (err) {
      console.error("💥 Hospital Form Save Error:", err);
      addToast("Failed to save hospital: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold">Loading hospital record data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => navigate("/admin/hospitals")}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hospitals Table
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isEditMode ? "Edit Hospital Facility" : "Add New Hospital Facility"}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Complete facility registration details for MediNAV discovery and emergency verification.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A — BASIC INFORMATION */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-sky-400" /> Section A — Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Hospital Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kopargaon General & Super Specialty Hospital"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Hospital Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Trust">Trust</option>
                <option value="Multispecialty">Multispecialty</option>
                <option value="Specialty Hospital">Specialty Hospital</option>
                <option value="Teaching Hospital">Teaching Hospital</option>
                <option value="Trauma Centre">Trauma Centre</option>
                <option value="Clinic">Clinic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Medical Specialties (comma separated)
              </label>
              <input
                type="text"
                name="specialtiesInput"
                value={formData.specialtiesInput}
                onChange={handleChange}
                placeholder="Cardiology, Pediatrics, ICU"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description / Tagline
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Provide a brief clinical summary of facility services, trauma readiness, and care specializations..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION B — LOCATION */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-emerald-400" /> Section B — Location Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, landmark, building number"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
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
                placeholder="e.g. Sambhaji Chowk"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Latitude (for Haversine Distance)
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="19.8916"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Longitude (for Haversine Distance)
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="74.4795"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION C — CONTACT */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-amber-400" /> Section C — Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 02423 222280"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Emergency Phone</label>
              <input
                type="text"
                name="erDirectPhone"
                value={formData.erDirectPhone}
                onChange={handleChange}
                placeholder="e.g. 02423 227107"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telephone / Landline</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="STD code + landline"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@hospital.org"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://hospital.org"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION D — CAPACITY */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BedDouble className="w-5 h-5 text-purple-400" /> Section D — Hospital Bed Capacity
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Total Beds</label>
              <input
                type="number"
                name="totalBeds"
                value={formData.totalBeds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Available ICU Beds</label>
              <input
                type="number"
                name="icuBeds"
                value={formData.icuBeds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">NICU Beds</label>
              <input
                type="number"
                name="nicuBeds"
                value={formData.nicuBeds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">PICU Beds</label>
              <input
                type="number"
                name="picuBeds"
                value={formData.picuBeds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION E — SERVICES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-rose-400" /> Section E — Clinical Services & Facilities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              { name: "isOpen247", label: "24/7 Emergency Casualty" },
              { name: "emergencyReady", label: "Trauma Resuscitation Desk" },
              { name: "hasAmbulanceFleet", label: "Ambulance Fleet Onsite" },
              { name: "hasBloodBank", label: "Blood Bank Onsite" },
              { name: "hasPharmacy", label: "24/7 Pharmacy" },
              { name: "hasLab", label: "Clinical Pathology Lab" },
              { name: "hasCtMri", label: "CT Scanner" },
              { name: "hasMri", label: "MRI Imaging" },
              { name: "hasXray", label: "X-Ray Diagnostic" },
              { name: "hasIcu", label: "Intensive Care Unit (ICU)" },
              { name: "hasOpTheatre", label: "Operation Theatre (OT)" },
            ].map((srv) => (
              <label
                key={srv.name}
                className="flex items-center gap-2.5 p-3 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors"
              >
                <input
                  type="checkbox"
                  name={srv.name}
                  checked={formData[srv.name]}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-900 border-slate-600"
                />
                <span className="font-semibold text-slate-200">{srv.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION F — OPD TIMINGS */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-sky-400" /> Section F — OPD Operating Hours
          </h2>

          <div className="space-y-2 text-xs">
            {Object.keys(formData.opdHours).map((day) => {
              const dayData = formData.opdHours[day];
              return (
                <div
                  key={day}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700"
                >
                  <span className="font-bold text-white uppercase w-24">{day}</span>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayData.open}
                      onChange={(e) => handleOpdChange(day, "open", e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-600"
                    />
                    <span className={dayData.open ? "text-emerald-400 font-bold" : "text-slate-500 font-medium"}>
                      {dayData.open ? "Open" : "Closed"}
                    </span>
                  </label>

                  {dayData.open && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={dayData.from}
                        onChange={(e) => handleOpdChange(day, "from", e.target.value)}
                        className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        value={dayData.to}
                        onChange={(e) => handleOpdChange(day, "to", e.target.value)}
                        className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-mono"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION G — VERIFICATION & PUBLISHING */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Section G — Verification & Publishing Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Document Type
              </label>
              <select
                name="verificationType"
                value={formData.verificationType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Government Facility ID">Government Facility ID</option>
                <option value="Hospital Registration Number">Hospital Registration Number</option>
                <option value="GSTIN">GSTIN</option>
                <option value="Trust Registration">Trust Registration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Number / License ID
              </label>
              <input
                type="text"
                name="verificationNumber"
                value={formData.verificationNumber}
                onChange={handleChange}
                placeholder="Reg / License ID number"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Status
              </label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 w-full cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-600"
                />
                <div>
                  <span className="font-bold text-white text-xs block">Publish to Public Discovery</span>
                  <span className="text-[10px] text-slate-400 block">
                    Make this facility visible on public MediNAV search
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION H — IMAGES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-sky-400" /> Section H — Facility Image Assets
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Primary Hospital Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Additional Image URLs (comma separated)
              </label>
              <input
                type="text"
                name="additionalImagesInput"
                value={formData.additionalImagesInput}
                onChange={handleChange}
                placeholder="https://..., https://..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate("/admin/hospitals")}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Hospital Changes" : "Create Hospital Record"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
