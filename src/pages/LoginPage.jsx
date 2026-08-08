import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ArrowLeft, Loader2, Phone, Mail, ShieldCheck, RefreshCw } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/ToastNotification";
import { useAuth } from "../context/AuthContext";
import { loginUser, sendPhoneOtp, verifyPhoneOtp, clearRecaptchaVerifier } from "../services/authService";

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

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  // Auth Mode: "email" | "phone"
  const [authMethod, setAuthMethod] = useState("email");

  // Email State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone State
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpStep, setOtpStep] = useState("input"); // "input" | "verify"
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [formattedPhoneUsed, setFormattedPhoneUsed] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  // Clean up reCAPTCHA instance on unmount
  useEffect(() => {
    return () => {
      clearRecaptchaVerifier("recaptcha-container");
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

  // Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      addToast("Signed in successfully!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sending Phone OTP
  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");

    if (!phoneNumber || phoneNumber.trim() === "") {
      setErrorMessage("Please enter your mobile phone number.");
      return;
    }

    const cleanNum = phoneNumber.trim().replace(/\D/g, "");
    if (cleanNum.length < 6 || cleanNum.length > 14) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await sendPhoneOtp(phoneNumber, "recaptcha-container", countryCode);
      setConfirmationResult(res.confirmationResult);
      setFormattedPhoneUsed(res.formattedPhone);
      setOtpStep("verify");
      setResendCooldown(30);
      addToast(`OTP verification code sent to ${res.formattedPhone}`, "success");
    } catch (error) {
      console.error("❌ Login Page Send OTP Error:", error);
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Verifying Phone OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (!confirmationResult) {
      setErrorMessage("Session expired. Please request a new verification code.");
      setOtpStep("input");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyPhoneOtp(confirmationResult, otpCode);
      addToast("Phone verified & signed in successfully!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("❌ Login Page Verify OTP Error:", error);
      setErrorMessage(error.message);
      addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking authentication status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Container for Firebase Phone Auth reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Login" }]} />
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign In to CareNavigator</h1>
          <p className="text-xs text-slate-500 font-medium">
            Access your personal Medical profile, bed holds, and triage history.
          </p>
        </div>

        {/* Authentication Method Selector Tabs (Email vs Phone) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === "email"
                ? "bg-white text-blue-600 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email Address
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === "phone"
                ? "bg-white text-blue-600 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone Number
          </button>
        </div>

        {/* User-friendly Firebase Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* TAB 1: EMAIL & PASSWORD SIGN IN */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <TextInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isSubmitting}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <PrimaryButton
              type="submit"
              size="lg"
              fullWidth
              icon={isSubmitting ? Loader2 : LogIn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In to Account"}
            </PrimaryButton>
          </form>
        )}

        {/* TAB 2: PHONE NUMBER & OTP SIGN IN */}
        {authMethod === "phone" && (
          <div>
            {otpStep === "input" ? (
              /* Step 1: Input Mobile Phone Number */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={isSubmitting}
                      className="h-11 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 9511276511"
                      required
                      disabled={isSubmitting}
                      className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                    We will send a 6-digit SMS verification code to this mobile number.
                  </span>
                </div>

                <PrimaryButton
                  type="submit"
                  size="lg"
                  fullWidth
                  icon={isSubmitting ? Loader2 : Phone}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending OTP Code..." : "Send Verification Code"}
                </PrimaryButton>
              </form>
            ) : (
              /* Step 2: Input 6-Digit OTP Code */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center space-y-1">
                  <span className="text-xs font-bold text-blue-900 block">Verification Code Sent</span>
                  <p className="text-xs text-blue-700 font-medium">
                    Enter the 6-digit code sent to <strong className="font-extrabold">{formattedPhoneUsed}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep("input");
                      setOtpCode("");
                      setErrorMessage("");
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline pt-0.5 inline-block cursor-pointer"
                  >
                    Change Phone Number
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 text-center">6-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    autoFocus
                    required
                    disabled={isSubmitting}
                    className="w-full h-12 text-center text-xl tracking-[0.4em] font-mono font-extrabold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <PrimaryButton
                  type="submit"
                  size="lg"
                  fullWidth
                  icon={isSubmitting ? Loader2 : ShieldCheck}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying Code..." : "Verify Code & Sign In"}
                </PrimaryButton>

                <div className="text-center pt-1">
                  {resendCooldown > 0 ? (
                    <span className="text-xs text-slate-400 font-medium">
                      Resend code in <strong className="text-slate-600">{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSubmitting}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
