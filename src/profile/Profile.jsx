import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import MyBookingsSection from "../components/profile/MyBookingsSection";
import { User, Mail, Phone, MapPin, Ticket, Heart, LogOut, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { user, logout, linkedPhone = "+91 83176 25528" } = useAuth();
  const { selectedCity } = useCity();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-heading">Please Sign In</h2>
        <p className="text-slate-400 text-xs">Sign in to manage your profile, saved wishlist, and digital tickets.</p>
        <button onClick={() => navigate("/login")} className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase shadow-lg shadow-cyan-500/20">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      
      {/* Header Profile Card */}
      <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl shadow-cyan-500/20 shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white font-heading">{user.name}</h1>
            {user.role === "admin" && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="px-5 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold text-xs uppercase flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Embedded My Bookings Section */}
      <MyBookingsSection isEmbedded={true} />

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Info */}
        <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-heading">Personal Information</h3>
          
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Phone Number</span>
              <span className="font-bold text-white font-mono">{linkedPhone}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Preferred Location</span>
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {selectedCity}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-heading">Quick Shortcuts</h3>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/movies")}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-cyan-400" />
                Explore Cinema Showtimes
              </span>
              <span>→</span>
            </button>

            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-left flex items-center justify-between text-xs font-bold text-cyan-400 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  Access Admin Dashboard
                </span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

