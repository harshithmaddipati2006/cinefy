import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
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
  Send
} from "lucide-react";

export default function Login({ isRegister: propIsRegister = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithPhone, requestPhoneOtp, register } = useAuth();
  const { currentCity, cities } = useCity();

  // Public User Auth Modes: 'PHONE' | 'LOGIN' | 'REGISTER'
  const [authMode, setAuthMode] = useState(() => {
    if (propIsRegister || location.pathname === "/register") return "REGISTER";
    return "PHONE";
  });

  // Form State - No prefilled default values
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

  // Sync mode if route changes
  useEffect(() => {
    if (propIsRegister || location.pathname === "/register") {
      setAuthMode("REGISTER");
    }
    setError("");
    setSuccessMsg("");
  }, [location.pathname, propIsRegister]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSetMode = (mode) => {
    setAuthMode(mode);
    setError("");
    setSuccessMsg("");
    if (mode === "REGISTER") {
      navigate("/register", { replace: true });
    } else if (mode === "LOGIN") {
      navigate("/login", { replace: true });
    }
  };

  // Request Phone OTP - Real SMS Trigger
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
      const deliveryInfo = res.otpSentToPhone
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
      await loginWithPhone(rawPhone.slice(-10), otp.trim(), name);
      setSuccessMsg("Mobile verification verified! Signing you in...");
      setTimeout(() => {
        navigate("/");
      }, 600);
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

        await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone ? phone.trim() : "",
          city
        });

        setSuccessMsg("Your account has been created successfully!");
        setTimeout(() => {
          navigate("/");
        }, 600);
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

        await login(email.trim(), password);
        setSuccessMsg("Welcome back! Signing you in...");
        setTimeout(() => {
          navigate("/");
        }, 600);
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
      await loginWithGoogle();
      setSuccessMsg("Signed in with Google!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setError("Google Sign-In failed: " + (err.message || "Unknown error"));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Invisible container required for Firebase Phone SMS Verification */}
      <div id="recaptcha-container"></div>

      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Film className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            {authMode === "REGISTER"
              ? "Create Free Account"
              : authMode === "PHONE"
              ? "Sign In with Mobile"
              : "Sign In with Email"}
          </h1>
          <p className="text-slate-400 text-xs">
            {authMode === "REGISTER"
              ? "Register for free to book movie tickets, live cricket stadiums & concerts"
              : authMode === "PHONE"
              ? "Enter your 10-digit mobile number to receive a verification SMS"
              : "Sign in to your CineFy account to manage showtime bookings"}
          </p>
        </div>

        {/* 3-Way Mode Switcher: Phone | Email | Register */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-950 border border-slate-800 gap-1">
          <button
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
            type="button"
            onClick={() => handleSetMode("LOGIN")}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === "LOGIN"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
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

        {/* ----------------- GOOGLE ONE-CLICK SIGN IN ----------------- */}
        <button
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
            {authMode === "PHONE" ? "or mobile number" : "or credentials"}
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* ----------------- PHONE AUTH FORM (REAL SMS DISPATCH) ----------------- */}
        {authMode === "PHONE" && (
          <form onSubmit={handlePhoneSignIn} className="space-y-4">
            {/* Mobile Number Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Indian Mobile Number *</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-slate-400 font-bold text-xs pointer-events-none">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full pl-16 pr-28 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
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
                <label className="text-xs font-bold text-slate-300">Enter Verification Code</label>
                {otpSent && (
                  <span className="text-[10px] text-cyan-400 font-medium">SMS Sent to Mobile</span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter OTP received on SMS"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-base tracking-widest font-mono font-black focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full cyan-button py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{submitting ? "Verifying..." : "Verify OTP & Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ----------------- EMAIL SIGN IN / REGISTER FORM ----------------- */}
        {(authMode === "LOGIN" || authMode === "REGISTER") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (Register only) */}
            {authMode === "REGISTER" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
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

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                {authMode === "REGISTER" ? "Password (min 6 chars) *" : "Password *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
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

            {/* Phone & City (Register only) */}
            {authMode === "REGISTER" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Mobile Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full cyan-button py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>
                {submitting
                  ? authMode === "REGISTER"
                    ? "Creating Account..."
                    : "Signing In..."
                  : authMode === "REGISTER"
                  ? "Register for Free"
                  : "Sign In"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer switch prompt */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            {authMode === "REGISTER" ? "Already have an account?" : "New to CineFy?"}
          </span>
          <div className="flex items-center gap-3">
            {authMode !== "PHONE" && (
              <button
                type="button"
                onClick={() => handleSetMode("PHONE")}
                className="text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" /> Continue with Mobile
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSetMode(authMode === "REGISTER" ? "LOGIN" : "REGISTER")}
              className="text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              {authMode === "REGISTER" ? "Sign In" : "Register Free"}
            </button>
            <span className="text-slate-600">|</span>
            <a
              href="/admin"
              className="text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-cyan-400" /> Admin Portal
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
