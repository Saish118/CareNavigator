import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Loader2, Phone, Mail, ShieldCheck, RefreshCw } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { registerUserStep1SendOtp, registerUserStep2VerifyAndLink, sendPhoneOtp } from "../services/authService";

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
  const [password, setPassword] = useState("");

  // Flow & Verification State
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [createdUser, setCreatedUser] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Clean up reCAPTCHA instance on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
      setErrorMessage("Phone Number is required.");
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

  // Handle Step 1: Create Email Account & Send Phone OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await registerUserStep1SendOtp(
        {
          name: fullName,
          email: email,
          password: password,
          phone: phone,
          countryCode: countryCode,
        },
        "recaptcha-container"
      );

      setCreatedUser(res.user);
      setConfirmationResult(res.confirmationResult);
      setFormattedPhone(res.formattedPhone);
      setStep("otp");
      setResendCooldown(30);
      addToast(`Account initiated! Verification code sent to ${res.formattedPhone}`, "info");
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp(formattedPhone, "recaptcha-container");
      setConfirmationResult(res.confirmationResult);
      setResendCooldown(30);
      addToast(`New verification code sent to ${formattedPhone}`, "success");
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Step 2: Verify OTP & Link Phone Credential to SAME Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (!confirmationResult || !createdUser) {
      setErrorMessage("Session expired. Please start registration again.");
      setStep("form");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUserStep2VerifyAndLink({
        user: createdUser,
        confirmationResult: confirmationResult,
        otpCode: otpCode,
        name: fullName,
        email: email,
        formattedPhone: formattedPhone,
      });

      addToast("Account registered and phone verified successfully! Welcome to CareNavigator.", "success");
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
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>

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
            Register with Email & Phone number linked to a single secure account.
          </p>
        </div>

        {/* User-friendly Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        {step === "form" ? (
          /* STEP 1: Registration Inputs */
          <form onSubmit={handleSubmitForm} className="space-y-4">
            {/* Full Name */}
            <TextInput
              label="Full Name *"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sai Joshi"
              required
              disabled={isSubmitting}
            />

            {/* Email Address */}
            <TextInput
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isSubmitting}
            />

            {/* Phone Number with Country Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Phone Number *</label>
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
                  placeholder="e.g. 98765 43210"
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <PasswordInput
              label="Create Password *"
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
              {isSubmitting ? "Creating Account & Sending OTP..." : "Create Account & Verify Phone"}
            </PrimaryButton>
          </form>
        ) : (
          /* STEP 2: OTP Verification & Linking */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-900 block">Verify Your Mobile Number</span>
              <p className="text-xs text-emerald-700 font-medium">
                SMS code sent to <strong className="font-extrabold">{formattedPhone}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtpCode("");
                  setErrorMessage("");
                }}
                className="text-[11px] font-bold text-emerald-600 hover:underline pt-0.5 inline-block cursor-pointer"
              >
                Change Registration Details
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 text-center">6-Digit SMS OTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                autoFocus
                required
                disabled={isSubmitting}
                className="w-full h-12 text-center text-xl tracking-[0.4em] font-mono font-extrabold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              fullWidth
              icon={isSubmitting ? Loader2 : ShieldCheck}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying OTP & Linking Account..." : "Verify OTP & Complete Registration"}
            </PrimaryButton>

            <div className="text-center pt-1">
              {resendCooldown > 0 ? (
                <span className="text-xs text-slate-400 font-medium">
                  Resend OTP in <strong className="text-slate-600">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
                </button>
              )}
            </div>
          </form>
        )}

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
