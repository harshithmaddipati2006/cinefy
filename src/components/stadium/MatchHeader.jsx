import React from "react";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Shield,
  ChevronLeft,
  X,
  Building2,
  Users,
  Timer,
  Sparkles,
  Layers,
  Camera,
  Compass
} from "lucide-react";
import { useStadiumRealtimeLocation } from "./useStadiumRealtimeLocation";

export default function MatchHeader({
  match,
  activeStadium,
  onChangeStadium,
  stadiumPresets,
  lockTimer,
  zoomLevel,
  onNavigateBack,
  selectedSeatsCount,
  onCloseModal,
  onOpenBeginnerGuide
}) {
  const { distanceFormatted, status: gpsStatus, refreshLocation, stadiumData } = useStadiumRealtimeLocation(activeStadium);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 p-4 sm:p-6 backdrop-blur-xl relative z-30 space-y-4">
      
      {/* Top Utility Bar & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex items-center gap-2">
          {zoomLevel !== "OVERVIEW" && (
            <button
              onClick={onNavigateBack}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-black transition-all flex items-center gap-1.5 border border-slate-700 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                {zoomLevel === "SEATS" ? "Back to Block View" : "Back to Stadium Overview"}
              </span>
            </button>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" /> {match.tournament || "ICC International Cricket 2026"}
            </span>
            <button
              onClick={refreshLocation}
              className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-cyan-500/25 transition-all shadow-sm"
              title="Real-time distance from your current location to stadium (Click to refresh)"
            >
              <Navigation className={`w-3 h-3 text-cyan-400 ${gpsStatus === "active" ? "animate-pulse" : ""}`} />
              <span>
                {gpsStatus === "active" && distanceFormatted
                  ? `Live GPS: ${distanceFormatted}`
                  : gpsStatus === "loading"
                  ? "Locating distance..."
                  : match.distanceFromUser || `${activeStadium.city || "Venue"} Match Arena`}
              </span>
              {gpsStatus === "active" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </button>
          </div>
        </div>

        {/* Lock Countdown & Close */}
        <div className="flex items-center gap-3">
          {onOpenBeginnerGuide && (
            <button
              onClick={onOpenBeginnerGuide}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-cyan-300 text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Stadium Guide</span>
            </button>
          )}

          {selectedSeatsCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black flex items-center gap-1.5 animate-pulse">
              <Timer className="w-4 h-4 text-rose-400" />
              <span>Seat Hold Lock: <strong className="font-mono text-white">{formatTimer(lockTimer)}</strong></span>
            </div>
          )}

          {/* Stadium Layout Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-bold hidden sm:inline">Stadium Model:</span>
            <select
              value={activeStadium.id}
              onChange={(e) => onChangeStadium(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {stadiumPresets.map((st) => (
                <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                  {st.shortName} ({st.city})
                </option>
              ))}
            </select>
          </div>

          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Match Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
        
        {/* Teams Matchup Visual with Big Country Thumbnails */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/90 px-5 py-3 rounded-2xl border border-slate-800 shadow-xl">
            {/* Team A */}
            <div className="flex items-center gap-3">
              {match.teamALogo ? (
                <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-xl overflow-hidden shadow-lg border border-cyan-400/40 bg-slate-950 shrink-0">
                  <img src={match.teamALogo} alt={match.teamA} className="w-full h-full object-cover" />
                </div>
              ) : null}
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-heading tracking-wider">{match.teamACode || match.teamA || "IND"}</span>
                <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">{match.teamA || "India"}</p>
              </div>
            </div>

            {/* Glowing VS Badge */}
            <div className="flex flex-col items-center px-2">
              <span className="text-xs font-black text-cyan-300 uppercase px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 shadow-sm">
                VS
              </span>
            </div>

            {/* Team B */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-heading tracking-wider">{match.teamBCode || match.teamB || "AUS"}</span>
                <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">{match.teamB || "Australia"}</p>
              </div>
              {match.teamBLogo ? (
                <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-xl overflow-hidden shadow-lg border border-cyan-400/40 bg-slate-950 shrink-0">
                  <img src={match.teamBLogo} alt={match.teamB} className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {match.isLiveNow ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>LIVE MATCH</span>
                </span>
              ) : null}
              {match.liveScore && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                  {match.liveScore}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight">
              {match.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-bold text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {activeStadium.name}, {activeStadium.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {match.date || "20 August 2026"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {match.time || "07:30 PM"}
              </span>
              {match.matchType && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{match.matchType}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stadium Capacity & Quick Info */}
        <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Total Stadium Capacity</span>
            <p className="text-sm font-black text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> {activeStadium.capacity} Seats
            </p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Available Tickets</span>
            <p className="text-sm font-black text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> {activeStadium.availableTickets} Available
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
