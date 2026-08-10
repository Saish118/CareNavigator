import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Droplet,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";
import { useToast } from "../../components/ui/ToastNotification";
import { useAuth } from "../../context/AuthContext";

export const AdminBloodBankFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Charitable / Red Cross",
    description: "",
    licenseNumber: "",

    // Location
    address: "",
    area: "",
    city: "Kopargaon",
    district: "Ahmednagar",
    state: "Maharashtra",
    pincode: "423601",
    latitude: "19.8916",
    longitude: "74.4795",

    // Contact
    phone: "",
    erDirectPhone: "",
    telephone: "",
    email: "",
    website: "",

    // Blood Stock
    bloodStock: {
      "A+": "10",
      "A-": "2",
      "B+": "15",
      "B-": "3",
      "O+": "20",
      "O-": "4",
      "AB+": "8",
      "AB-": "1",
    },

    // Components Toggles
    hasPrbc: true,
    hasFfp: true,
    hasPlatelets: true,
    hasCryo: true,
    hasSdp: false,

    // Facilities
    isOpen247: true,
    hasComponentFacility: true,
    hasApheresisUnit: true,
    hasMobileDonationVan: true,
    hasDeliveryAmbulance: true,

    // Operating Hours
    opdHours: {
      monday: { open: true, from: "00:00", to: "23:59" },
      tuesday: { open: true, from: "00:00", to: "23:59" },
      wednesday: { open: true, from: "00:00", to: "23:59" },
      thursday: { open: true, from: "00:00", to: "23:59" },
      friday: { open: true, from: "00:00", to: "23:59" },
      saturday: { open: true, from: "00:00", to: "23:59" },
      sunday: { open: true, from: "00:00", to: "23:59" },
    },

    // Verification
    verificationType: "FDA License",
    verificationNumber: "",
    verificationNotes: "",
    verificationStatus: isEditMode ? "verified" : "pending",
    published: isEditMode ? true : false,

    // Image
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    additionalImagesInput: "",
  });

  useEffect(() => {
    if (isEditMode) {
      let isMounted = true;
      const loadBloodBank = async () => {
        setLoading(true);
        try {
          const fetched = await bloodBankService.getBloodBankById(id);
          if (fetched && isMounted) {
            const stock = fetched.bloodGroupStock || {};
            const comps = fetched.componentsAvailable || [];

            setFormData({
              name: fetched.name || "",
              type: fetched.type || fetched.category || "Charitable / Red Cross",
              description: fetched.description || "",
              licenseNumber: fetched.verificationNumber || fetched.licenseNumber || "",

              address: fetched.address || "",
              area: fetched.area || "",
              city: fetched.city || "Kopargaon",
              district: fetched.district || "Ahmednagar",
              state: fetched.state || "Maharashtra",
              pincode: fetched.pincode || "",
              latitude: fetched.latitude || fetched.coordinates?.lat || "",
              longitude: fetched.longitude || fetched.coordinates?.lng || "",

              phone: fetched.phone || "",
              erDirectPhone: fetched.erDirectPhone || "",
              telephone: fetched.telephone || "",
              email: fetched.email || "",
              website: fetched.website || "",

              bloodStock: {
                "A+": stock["A+"] != null ? String(stock["A+"]) : "0",
                "A-": stock["A-"] != null ? String(stock["A-"]) : "0",
                "B+": stock["B+"] != null ? String(stock["B+"]) : "0",
                "B-": stock["B-"] != null ? String(stock["B-"]) : "0",
                "O+": stock["O+"] != null ? String(stock["O+"]) : "0",
                "O-": stock["O-"] != null ? String(stock["O-"]) : "0",
                "AB+": stock["AB+"] != null ? String(stock["AB+"]) : "0",
                "AB-": stock["AB-"] != null ? String(stock["AB-"]) : "0",
              },

              hasPrbc: comps.includes("PRBC"),
              hasFfp: comps.includes("FFP"),
              hasPlatelets: comps.includes("Platelet Concentrate"),
              hasCryo: comps.includes("Cryoprecipitate"),
              hasSdp: comps.includes("SDP"),

              isOpen247: fetched.isOpen247 ?? true,
              hasComponentFacility: fetched.hasComponentFacility ?? true,
              hasApheresisUnit: fetched.hasApheresisUnit ?? false,
              hasMobileDonationVan: fetched.hasMobileDonationVan ?? false,
              hasDeliveryAmbulance: fetched.hasDeliveryAmbulance ?? true,

              opdHours: fetched.opdHours || {
                monday: { open: true, from: "00:00", to: "23:59" },
                tuesday: { open: true, from: "00:00", to: "23:59" },
                wednesday: { open: true, from: "00:00", to: "23:59" },
                thursday: { open: true, from: "00:00", to: "23:59" },
                friday: { open: true, from: "00:00", to: "23:59" },
                saturday: { open: true, from: "00:00", to: "23:59" },
                sunday: { open: true, from: "00:00", to: "23:59" },
              },

              verificationType: fetched.verificationType || "FDA License",
              verificationNumber: fetched.verificationNumber || "",
              verificationNotes: fetched.verificationNotes || "",
              verificationStatus: fetched.verificationStatus || "verified",
              published: fetched.published !== false,

              image: fetched.image || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
              additionalImagesInput: Array.isArray(fetched.additionalImages)
                ? fetched.additionalImages.join(", ")
                : "",
            });
          }
        } catch (err) {
          addToast("Failed to load blood bank record: " + err.message, "error");
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadBloodBank();
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

  const handleStockChange = (group, val) => {
    setFormData((prev) => ({
      ...prev,
      bloodStock: {
        ...prev.bloodStock,
        [group]: val,
      },
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
      addToast("Please complete required fields (Blood Bank Name, Address, City).", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const latNum = parseFloat(formData.latitude);
      const lngNum = parseFloat(formData.longitude);

      const stockParsed = {};
      Object.keys(formData.bloodStock).forEach((grp) => {
        stockParsed[grp] = parseInt(formData.bloodStock[grp], 10) || 0;
      });

      const componentsList = [];
      if (formData.hasPrbc) componentsList.push("PRBC");
      if (formData.hasFfp) componentsList.push("FFP");
      if (formData.hasPlatelets) componentsList.push("Platelet Concentrate");
      if (formData.hasCryo) componentsList.push("Cryoprecipitate");
      if (formData.hasSdp) componentsList.push("SDP");

      const additionalImagesList = formData.additionalImagesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.type,
        description: formData.description.trim(),
        licenseNumber: formData.verificationNumber.trim() || formData.licenseNumber.trim(),

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
        erDirectPhone: formData.erDirectPhone.trim() || formData.phone.trim(),
        telephone: formData.telephone.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),

        bloodGroupStock: stockParsed,
        componentsAvailable: componentsList,

        isOpen247: formData.isOpen247,
        hasComponentFacility: formData.hasComponentFacility,
        hasApheresisUnit: formData.hasApheresisUnit,
        hasMobileDonationVan: formData.hasMobileDonationVan,
        hasDeliveryAmbulance: formData.hasDeliveryAmbulance,

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
        await bloodBankService.updateBloodBank(id, payload, currentUser);
        addToast(`Blood Bank "${payload.name}" updated successfully.`, "success");
      } else {
        const created = await bloodBankService.addBloodBank(payload, currentUser);
        console.log("✅ Blood Bank creation verified in Cloud Firestore:", created);
        addToast(`Blood Bank "${created.name}" created and saved to Firestore.`, "success");
      }

      navigate("/admin/blood-banks");
    } catch (err) {
      console.error("💥 Firestore Blood Bank Save Error:", err);
      addToast("Failed to save blood bank to Cloud Firestore: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold">Loading blood bank record data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={() => navigate("/admin/blood-banks")}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blood Banks Table
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isEditMode ? "Edit Blood Bank Center" : "Add New Blood Bank Center"}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Register blood transfusion center, stock availability, components, and FDA credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION A — BASIC INFORMATION */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Droplet className="w-5 h-5 text-rose-400" /> Section A — Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Blood Bank / Center Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Indian Red Cross Society Blood Centre"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category / Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Charitable / Red Cross">Charitable / Red Cross</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Hospital-Attached">Hospital-Attached</option>
                <option value="Standalone">Standalone</option>
                <option value="Trust">Trust</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                FDA License Number
              </label>
              <input
                type="text"
                name="verificationNumber"
                value={formData.verificationNumber}
                onChange={handleChange}
                placeholder="FDA/MH/BB-XXXX"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description / Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Details regarding voluntary donation camps, transfusion facilities, component separation..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
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
                placeholder="e.g. 02423 222340"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Emergency Helpline</label>
              <input
                type="text"
                name="erDirectPhone"
                value={formData.erDirectPhone}
                onChange={handleChange}
                placeholder="Direct 24/7 Helpline"
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
                placeholder="bloodbank@redcross.org"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION D — BLOOD GROUP AVAILABILITY & COMPONENTS */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Droplet className="w-5 h-5 text-rose-500" /> Section D — Blood Group Stock Units
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((grp) => (
              <div key={grp} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <label className="block font-black text-rose-400 text-xs">{grp} Units Available</label>
                <input
                  type="number"
                  value={formData.bloodStock[grp]}
                  onChange={(e) => handleStockChange(grp, e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
                />
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Available Blood Components:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { name: "hasPrbc", label: "Packed Red Blood Cells (PRBC)" },
                { name: "hasFfp", label: "Fresh Frozen Plasma (FFP)" },
                { name: "hasPlatelets", label: "Platelet Concentrate" },
                { name: "hasCryo", label: "Cryoprecipitate" },
                { name: "hasSdp", label: "Single Donor Platelets (SDP)" },
              ].map((cmp) => (
                <label
                  key={cmp.name}
                  className="flex items-center gap-2.5 p-3 bg-slate-800/60 rounded-xl border border-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={cmp.name}
                    checked={formData[cmp.name]}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-600"
                  />
                  <span className="font-semibold text-slate-200">{cmp.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION E — FACILITIES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-sky-400" /> Section E — Infrastructure & Facilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: "isOpen247", label: "24/7 Emergency Dispatch Desk" },
              { name: "hasComponentFacility", label: "Component Separation Facility" },
              { name: "hasApheresisUnit", label: "Apheresis Unit Onsite" },
              { name: "hasMobileDonationVan", label: "Mobile Donation Bus / Van" },
              { name: "hasDeliveryAmbulance", label: "Cold-Chain Blood Delivery Service" },
            ].map((f) => (
              <label
                key={f.name}
                className="flex items-center gap-2.5 p-3 bg-slate-800/80 rounded-xl border border-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={f.name}
                  checked={formData[f.name]}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-600"
                />
                <span className="font-semibold text-slate-200">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION F — OPERATING HOURS */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-sky-400" /> Section F — Operating Hours
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
                      className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-600"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="FDA License">FDA License</option>
                <option value="State Blood Transfusion Council ID">State Blood Transfusion Council ID</option>
                <option value="NACO Registration">NACO Registration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Verification Status
              </label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
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
                  <span className="font-bold text-white text-xs block">Publish to Public Website</span>
                  <span className="text-[10px] text-slate-400 block">
                    Only verified + published blood banks will appear on the public portal
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION H — IMAGES */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-rose-400" /> Section H — Facility Image Assets
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Image URL</label>
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
            onClick={() => navigate("/admin/blood-banks")}
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
                <span>{isEditMode ? "Save Blood Bank Changes" : "Create Blood Bank Record"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
