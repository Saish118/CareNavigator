import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { SelectInput } from "../components/inputs/SelectInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  const validateForm = () => {
    if (!fullName || fullName.trim() === "") {
      setErrorMessage("Full Name is required.");
      return false;
    }

    if (!email || email.trim() === "") {
      setErrorMessage("Email Address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!phone || phone.trim() === "") {
      setErrorMessage("Mobile Number is required.");
      return false;
    }

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 6 || cleanPhone.length > 14) {
      setErrorMessage("Please enter a valid mobile phone number.");
      return false;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await registerUser(fullName, email, password, phone, bloodGroup, countryCode);
      addToast("Account registered successfully! Welcome to CareNavigator.", "success");
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking authentication status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Register" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create CareNavigator Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Register your emergency profile for instant hospital bed holds & resource clearance.
          </p>
        </div>

        {/* User-friendly Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <TextInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sai Joshi"
            required
            disabled={isSubmitting}
          />

          {/* Email Address */}
          <TextInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isSubmitting}
          />

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={isSubmitting}
                className="h-11 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.country})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9511276511"
                required
                disabled={isSubmitting}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Blood Group */}
          <SelectInput
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]}
            disabled={isSubmitting}
          />

          {/* Password */}
          <PasswordInput
            label="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <PrimaryButton
            type="submit"
            size="lg"
            fullWidth
            icon={isSubmitting ? Loader2 : UserPlus}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
