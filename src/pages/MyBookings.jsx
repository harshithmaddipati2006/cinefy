import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyBookingsSection from "../components/profile/MyBookingsSection";
import { Ticket, ArrowLeft, ShieldCheck, Film } from "lucide-react";

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/profile"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all font-semibold"
          >
            User Profile
          </Link>
          <Link
            to="/movies"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase text-[11px] transition-all shadow-md shadow-cyan-500/20"
          >
            Now Showing
          </Link>
        </div>
      </div>

      {/* Main My Bookings Section Component */}
      <MyBookingsSection isEmbedded={false} />

    </div>
  );
}

