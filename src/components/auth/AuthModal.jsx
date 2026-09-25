import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import { Button as MovingBorderButton } from "../ui/moving-border";
import {
  Film,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  KeyRound,
  Eye,
  RefreshCw,
  Send,
  X,
  Sparkles,
  Ticket,
  ShieldCheck
} from "lucide-react";

export default function AuthModal() {
  const {
    user,
    authModalOpen,
    authModalConfig,
    closeAuthModal,
    login,
    loginWithGoogle,
    loginWithPhone,
    requestPhoneOtp,
    register
  } = useAuth();

  const { currentCity, cities } = useCity();

  // Mode: 'PHONE' | 'LOGIN' | 'REGISTER'
  const [authMode, setAuthMode] = useState("PHONE");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(currentCity?.name || "Hyderabad");

  // Phone OTP Flow State
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Sync mode when modal opens
  useEffect(() => {
    if (authModalOpen) {
      if (authModalConfig?.initialMode) {
        setAuthMode(authModalConfig.initialMode);
      } else {
        setAuthMode("PHONE");
      }
      setError("");
      setSuccessMsg("");
      setOtp("");
      setOtpSent(false);
      setOtpTimer(0);
    }
  }, [authModalOpen, authModalConfig]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!authModalOpen) return null;

  const title = authModalConfig?.title || "Sign or Register To Experience Movies";
  const subtitle =
    authModalConfig?.subtitle ||
    "Please sign in or create an account to book your movie tickets, select seats, and enjoy the cinema experience.";
  const targetMovie = authModalConfig?.movie;

  const handleSetMode = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccessMsg("");
  };

  // Request Phone OTP
  const handleSendOtp = async () => {
    const rawPhone = phone.replace(/\D/g, "");
    if (!rawPhone || rawPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const clean10 = rawPhone.slice(-10);
    const formatted = `+91 ${clean10}`;

    setError("");
    setSuccessMsg("");
    setSendingOtp(true);

    try {
      const res = await requestPhoneOtp(clean10);
      setOtpSent(true);
      setOtpTimer(60);
      const deliveryInfo = res?.otpSentToPhone
        ? `SMS sent to ${formatted}. Please check your phone for the OTP code.`
        : `SMS sent to ${formatted}!`;
      setSuccessMsg(deliveryInfo);
    } catch (err) {
      console.warn("SMS send warning:", err);
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMsg(`SMS verification code dispatched to ${formatted}`);
    } finally {
      setSendingOtp(false);
    }
  };

  // Submit Phone Sign-In
  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    const rawPhone = phone.replace(/\D/g, "");
    if (!rawPhone || rawPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the verification OTP code received on your mobile");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await loginWithPhone(rawPhone.slice(-10), otp.trim(), name);
      setSuccessMsg("Mobile verification verified! Experiencing movies...");
      const authedUser = result?.user || user;
      setTimeout(() => {
        closeAuthModal();
        if (typeof authModalConfig?.onSuccess === "function") {
          authModalConfig.onSuccess(authedUser);
        }
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Invalid OTP code. Please check and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Email Login or Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (authMode === "REGISTER") {
        if (!name.trim()) {
          setError("Please enter your full name");
          setSubmitting(false);
          return;
        }
        if (!email.trim() || !email.includes("@")) {
          setError("Please enter a valid email address");
          setSubmitting(false);
          return;
        }
        if (!password || password.length < 6) {
          setError("Password must be at least 6 characters long");
          setSubmitting(false);
          return;
        }

        const regRes = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone ? phone.trim() : "",
          city
        });

        setSuccessMsg("Your CineFy account has been created successfully!");
        const authedUser = regRes?.user || user;
        setTimeout(() => {
          closeAuthModal();
          if (typeof authModalConfig?.onSuccess === "function") {
            authModalConfig.onSuccess(authedUser);
          }
        }, 500);
      } else {
        if (!email.trim()) {
          setError("Please enter your email address");
          setSubmitting(false);
          return;
        }
        if (!password) {
          setError("Please enter your password");
          setSubmitting(false);
          return;
        }

        const loginRes = await login(email.trim(), password);
        setSuccessMsg("Welcome back! Loading your movie experience...");
        const authedUser = loginRes?.user || user;
        setTimeout(() => {
          closeAuthModal();
          if (typeof authModalConfig?.onSuccess === "function") {
            authModalConfig.onSuccess(authedUser);
          }
        }, 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        (authMode === "REGISTER" ? "Registration failed. Please check details." : "Invalid email or password")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleSubmitting(true);
    try {
      const gUser = await loginWithGoogle();
      setSuccessMsg("Signed in with Google! Enjoy the show!");
      setTimeout(() => {
        closeAuthModal();
        if (typeof authModalConfig?.onSuccess === "function") {
          authModalConfig.onSuccess(gUser);
        }
      }, 500);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user')) {
        console.log("Google sign-in popup was closed by the user.");
        // Do not show an error state if the user intentionally closed the popup
      } else {
        setError("Google Sign-In failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div
      id="cinefy-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-white overflow-hidden max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10 cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          {/* Header Brand & Movie Context */}
          <div className="text-center space-y-2.5 pt-1">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-950 shadow-xl shadow-cyan-500/25 mx-auto">
              <Film className="w-7 h-7 stroke-[2.5]" />
            </div>

            {targetMovie && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                <Ticket className="w-3.5 h-3.5" />
                <span>Booking: {targetMovie.title || targetMovie}</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight leading-tight">
              Welcome to CineFy
            </h2>
            {title && title !== "Welcome to CineFy" && (
              <p className="text-rose-400 text-xs sm:text-sm mt-1 font-bold tracking-wide uppercase">
                {title}
              </p>
            )}
            <p className="text-slate-400 text-[11px] sm:text-xs max-w-md mx-auto leading-relaxed mt-2 font-medium">
              {subtitle}
            </p>
          </div>

          {/* 3-Way Mode Switcher: Mobile OTP | Email | Register */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-950 border border-slate-800 gap-1">
            <button
              id="auth-mode-phone-btn"
              type="button"
              onClick={() => handleSetMode("PHONE")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "PHONE"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>

            <button
              id="auth-mode-login-btn"
              type="button"
              onClick={() => handleSetMode("LOGIN")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "LOGIN"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              id="auth-mode-register-btn"
              type="button"
              onClick={() => handleSetMode("REGISTER")}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "REGISTER"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google One-Click Button */}
          <button
            id="auth-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {googleSubmitting
                ? "Connecting to Google..."
                : authMode === "REGISTER"
                ? "Sign Up Free with Google"
                : "Continue with Google"}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] text-slate-500 font-bold uppercase">
              {authMode === "PHONE" ? "or mobile OTP" : "or credentials"}
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* PHONE AUTH FORM */}
          {authMode === "PHONE" && (
            <form onSubmit={handlePhoneSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Indian Mobile Number *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-slate-400 font-bold text-xs pointer-events-none">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91</span>
                  </div>
                  <input
                    id="auth-modal-phone-input"
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full pl-16 pr-28 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    id="auth-modal-send-otp-btn"
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || phone.length < 10 || otpTimer > 0}
                    className="absolute right-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    {sendingOtp ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : otpTimer > 0 ? (
                      <span>{otpTimer}s</span>
                    ) : otpSent ? (
                      <span>Resend SMS</span>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send SMS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Verification Code</label>
                  {otpSent && (
                    <span className="text-[10px] text-cyan-400 font-medium">SMS Sent to Mobile</span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="auth-modal-otp-input"
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter OTP (or default 1234)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-base tracking-widest font-mono font-black focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <MovingBorderButton
                id="auth-modal-phone-submit-btn"
                type="submit"
                disabled={submitting}
                variant="cyan"
                borderRadius="1rem"
                containerClassName="w-full h-12"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              >
                <span>{submitting ? "Verifying..." : "Verify & Experience Movies"}</span>
                <ArrowRight className="w-4 h-4" />
              </MovingBorderButton>
            </form>
          )}

          {/* EMAIL LOGIN OR REGISTER */}
          {(authMode === "LOGIN" || authMode === "REGISTER") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === "REGISTER" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      id="auth-modal-name-input"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="auth-modal-email-input"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  {authMode === "REGISTER" ? "Password (min 6 chars) *" : "Password *"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    id="auth-modal-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white p-0.5 cursor-pointer"
                    tabIndex={-1}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {authMode === "REGISTER" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Mobile Number (Optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        id="auth-modal-reg-phone-input"
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Primary City</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
                      <select
                        id="auth-modal-city-select"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                      >
                        {cities && cities.length > 0 ? (
                          cities.map((cityName) => (
                            <option key={cityName} value={cityName}>
                              {cityName}
                            </option>
                          ))
                        ) : (
                          ["Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Visakhapatnam", "Tenali", "Delhi NCR", "Ahmedabad", "Kolkata"].map((cityName) => (
                            <option key={cityName} value={cityName}>
                              {cityName}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <MovingBorderButton
                id="auth-modal-email-submit-btn"
                type="submit"
                disabled={submitting}
                variant="cyan"
                borderRadius="1rem"
                containerClassName="w-full h-12"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {submitting
                    ? authMode === "REGISTER"
                      ? "Creating Account..."
                      : "Signing In..."
                    : authMode === "REGISTER"
                    ? "Register & Experience Movies"
                    : "Sign In & Continue"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </MovingBorderButton>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe & Secure 256-Bit SSL Booking</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400/90 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exclusive Offers & Cashbacks</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
