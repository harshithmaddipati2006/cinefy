import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import TrailerModal from "../components/movie/TrailerModal";
import {
  MapPin,
  Calendar,
  Film,
  Search,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Navigation,
  ChevronRight,
  Tv,
  Volume2,
  Car,
  Accessibility,
  CheckCircle2,
  Flame,
  Star,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play
} from "lucide-react";

export default function TheatresExplorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedCity, autoDetectEnabled, detectLocation, detecting } = useCity();
  const { requireAuth } = useAuth();

  const selectedTheatreId = searchParams.get("theatreId") || "";
  const [theatres, setTheatres] = useState([]);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("All"); // All, Morning, Afternoon, Evening, Night
  const [selectedFormat, setSelectedFormat] = useState("All"); // All, IMAX, Atmos, 4K, Recliner
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate 10-day advance booking window
  const datesList = useMemo(() => {
    const days = [];
    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 10; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayOfWeek = dayNames[d.getDay()];
      const dateNum = d.getDate();
      const month = monthNames[d.getMonth()];
      const isoDate = d.toISOString().split("T")[0];

      let label = "";
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else label = `${dayOfWeek}, ${dateNum} ${month}`;

      days.push({
        id: `day-${i}`,
        index: i,
        label,
        dayOfWeek,
        dateNum,
        month,
        isoDate
      });
    }
    return days;
  }, []);

  useEffect(() => {
    fetchTheatres();
  }, [selectedCity, selectedDate]);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/theatres?city=${encodeURIComponent(selectedCity)}&date=${encodeURIComponent(selectedDate)}`
      );
      const data = res.data;
      if (data && Array.isArray(data.theatres)) {
        setTheatres(data.theatres);
      } else if (Array.isArray(data)) {
        setTheatres(data);
      } else {
        setTheatres([]);
      }
    } catch (err) {
      console.error("Error loading theatres:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter theatres based on search & format
  const filteredTheatres = useMemo(() => {
    return theatres.filter((th) => {
      // Search query filter (matches theatre name, locality, or running movies)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = th.name?.toLowerCase().includes(q);
        const matchesLocality = th.locality?.toLowerCase().includes(q) || th.address?.toLowerCase().includes(q);
        const matchesMovie = (th.runningMovies || []).some((m) => m.title?.toLowerCase().includes(q));
        if (!matchesName && !matchesLocality && !matchesMovie) return false;
      }

      // Format filter
      if (selectedFormat !== "All") {
        const fmt = selectedFormat.toLowerCase();
        const hasFormat = (th.screens || []).some(
          (s) =>
            s.name?.toLowerCase().includes(fmt) ||
            s.type?.toLowerCase().includes(fmt) ||
            (th.facilities || []).some((f) => f.toLowerCase().includes(fmt))
        );
        if (!hasFormat) return false;
      }

      return true;
    });
  }, [theatres, searchQuery, selectedFormat]);

  // Target theatre if specific theatre selected
  const focusedTheatre = selectedTheatreId
    ? theatres.find((t) => t.id === selectedTheatreId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      
      {/* Header & City Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading flex items-center gap-2">
                <span>Cinemas & Theatres in</span>{" "}
                <span className="cyan-gradient-text">{selectedCity}</span>
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Real-time schedules, movies running per screen, and live seat availability
              </p>
            </div>
          </div>
        </div>

        {/* Location switcher and search input */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all shadow"
            title="Auto-detect or switch location"
          >
            <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${detecting ? "animate-spin" : ""}`} />
            <span>City: <strong className="text-cyan-400 font-bold">{selectedCity}</strong></span>
            {autoDetectEnabled && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search cinema or movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 10-Day Booking Date Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" /> Choose Booking Date (10 Days Window)
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Live Schedule Synced
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {datesList.map((d) => {
            const isSelected = selectedDate === d.label;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.label)}
                className={`flex flex-col items-center justify-center min-w-[85px] sm:min-w-[105px] py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25 scale-105"
                    : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-white"
                }`}
              >
                <span className={`text-[10px] uppercase font-bold ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                  {d.index === 0 ? "Today" : d.index === 1 ? "Tomorrow" : d.dayOfWeek}
                </span>
                <span className={`text-base font-black my-0.5 ${isSelected ? "text-slate-950" : "text-white"}`}>
                  {d.dateNum}
                </span>
                <span className={`text-[10px] font-semibold ${isSelected ? "text-slate-800" : "text-slate-400"}`}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips: Format & Time Periods */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
        
        {/* Time of Day */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Time Slot:</span>
          {["All", "Morning", "Afternoon", "Evening", "Night"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPeriod === period
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-cyan-500/40"
              }`}
            >
              {period === "Morning" ? "Morning (9am-12pm)" :
               period === "Afternoon" ? "Matinee (12pm-4pm)" :
               period === "Evening" ? "Evening (4pm-8pm)" :
               period === "Night" ? "Night (8pm-12am)" : "All Slots"}
            </button>
          ))}
        </div>

        {/* Screen Formats */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Format:</span>
          {["All", "IMAX", "Atmos", "4K", "Recliner"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-cyan-500/40"
              }`}
            >
              {fmt === "All" ? "All Formats" : fmt === "Atmos" ? "Dolby Atmos" : fmt === "4K" ? "4K Laser" : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Theatres Listing with Running Movies per Screen */}
      <div className="space-y-8">
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredTheatres.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-sm space-y-3 max-w-xl mx-auto">
            <Film className="w-10 h-10 text-cyan-400 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-white">No Cinemas Matched Filters</h3>
            <p className="text-xs text-slate-400">
              No active shows match your selected time slot or format in <strong className="text-cyan-400">{selectedCity}</strong> for <span className="text-white">{selectedDate}</span>.
            </p>
            <button
              onClick={() => {
                setSelectedPeriod("All");
                setSelectedFormat("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTheatres.map((th) => {
              // Group movies running at this theatre
              const runningMoviesList = th.runningMovies || [];
              const allShows = th.allShows || [];

              return (
                <div
                  key={th.id}
                  id={th.id}
                  className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700/80 transition-all shadow-2xl space-y-6"
                >
                  
                  {/* Theatre Banner & Metadata Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                          {th.name}
                        </h2>
                        {th.rating && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                            <Star className="w-3 h-3 fill-current" /> {th.rating}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 text-[11px] font-bold border border-cyan-500/20">
                          {runningMoviesList.length} Movies Playing Today
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-xs flex items-center gap-2 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{th.address || `${th.locality}, ${selectedCity}`}</span>
                        {th.distance && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-cyan-400 font-semibold">{th.distance}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Facilities & Screen Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {th.facilities &&
                        th.facilities.slice(0, 4).map((f) => (
                          <span
                            key={f}
                            className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Movies Currently Running at This Theatre */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-cyan-400" /> Movies Running on Selected Date ({selectedDate})
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {th.screens ? `${th.screens.length} Auditoriums Active` : "Multi-Screen"}
                      </span>
                    </div>

                    {runningMoviesList.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No scheduled movie slots for this date.</p>
                    ) : (
                      <div className="space-y-6">
                        {runningMoviesList.map((movieEntry) => {
                          // Filter shows by period & format
                          const movieShows = (movieEntry.shows || []).filter((s) => {
                            if (selectedPeriod !== "All" && s.period !== selectedPeriod) return false;
                            if (selectedFormat !== "All") {
                              const fmt = selectedFormat.toLowerCase();
                              if (!s.format?.toLowerCase().includes(fmt) && !s.screenName?.toLowerCase().includes(fmt)) {
                                return false;
                              }
                            }
                            return true;
                          });

                          if (movieShows.length === 0 && (selectedPeriod !== "All" || selectedFormat !== "All")) {
                            return null;
                          }

                          return (
                            <div
                              key={movieEntry.id}
                              className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row gap-5 items-start transition-all hover:border-slate-700"
                            >
                              {/* Movie Thumbnail & Quick Info */}
                              <div className="flex items-start gap-4 shrink-0 sm:w-64">
                                <img
                                  src={movieEntry.poster}
                                  alt={movieEntry.title}
                                  className="w-16 h-24 object-cover rounded-xl shadow-md border border-slate-800 shrink-0"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80";
                                  }}
                                />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className="text-sm font-black text-white font-heading">
                                      {movieEntry.title}
                                    </h3>
                                    {movieEntry.certification && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-cyan-500/20">
                                        {movieEntry.certification}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400">
                                    {movieEntry.language} • {movieEntry.duration}
                                  </p>
                                  {movieEntry.genre && (
                                    <p className="text-[10px] text-slate-500">
                                      {Array.isArray(movieEntry.genre) ? movieEntry.genre.slice(0, 2).join(", ") : movieEntry.genre}
                                    </p>
                                  )}
                                  <div className="pt-1">
                                    <Link
                                      to={`/movie/${movieEntry.id}`}
                                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                                    >
                                      <span>Movie Details</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              {/* Showtimes Pill Buttons with Real-Time Status */}
                              <div className="flex-1 w-full space-y-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Available Showtimes & Screens
                                </span>
                                
                                <div className="flex flex-wrap gap-3">
                                  {movieShows.map((show) => {
                                    const isPassed = show.realtimeStatus === "PASSED" || show.isPast;
                                    const isLive = show.realtimeStatus === "NOW_SHOWING" || show.isLive;
                                    const isImminent = show.realtimeStatus === "STARTS_SOON";
                                    const isFastFilling = show.realtimeStatus === "FAST_FILLING";

                                    return (
                                      <button
                                        key={show.showId || show.id}
                                        disabled={isPassed || isLive}
                                        onClick={() => {
                                          requireAuth(
                                            () => {
                                              navigate(
                                                `/seats?showId=${encodeURIComponent(show.showId || show.id)}&movieId=${encodeURIComponent(movieEntry.id)}&theatreName=${encodeURIComponent(th.name)}&showTime=${encodeURIComponent(show.time)}&showDate=${encodeURIComponent(selectedDate)}&screenName=${encodeURIComponent(show.screenName || "Screen 1")}&format=${encodeURIComponent(show.format || "Dolby Atmos")}`
                                              );
                                            },
                                            {
                                              title: "Sign or Register To Experience Movies",
                                              subtitle: `Sign in or register to select your seats for "${movieEntry.title}" at ${th.name} (${show.time}).`,
                                              movie: movieEntry
                                            }
                                          );
                                        }}
                                        className={`group relative px-4 py-2.5 rounded-2xl border text-left transition-all cursor-pointer min-w-[130px] flex flex-col justify-between ${
                                          isPassed
                                            ? "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                                            : isLive
                                            ? "bg-purple-950/30 border-purple-800/40 text-purple-300 cursor-not-allowed"
                                            : isImminent
                                            ? "bg-cyan-500/10 border-cyan-500 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
                                            : isFastFilling
                                            ? "bg-rose-950/20 border-rose-800/50 hover:border-rose-500 text-white"
                                            : "bg-slate-900 border-slate-800 hover:border-cyan-400 hover:bg-cyan-500/10 text-white"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <span className={`text-xs font-black ${isPassed ? "text-slate-600" : "text-white group-hover:text-cyan-300"}`}>
                                            {show.time}
                                          </span>
                                          <span className="text-[9px] font-bold text-cyan-400 px-1 rounded bg-cyan-950/60 border border-cyan-800/30">
                                            {show.language || "Telugu"}
                                          </span>
                                        </div>

                                        <div className="mt-1 space-y-0.5">
                                          <span className="block text-[10px] text-slate-400 truncate">
                                            {show.screenName || show.format || "4K Dolby Atmos"}
                                          </span>
                                          
                                          <div className="flex items-center justify-between text-[9px] font-semibold pt-0.5">
                                            <span className="text-cyan-400 font-bold">
                                              ₹{show.priceRegular || show.pricing?.regular || 150}
                                            </span>
                                            
                                            {/* Status Badge */}
                                            {isPassed ? (
                                              <span className="text-slate-600 font-medium">Finished</span>
                                            ) : isLive ? (
                                              <span className="text-purple-400 font-bold animate-pulse">Running Now</span>
                                            ) : isImminent ? (
                                              <span className="text-cyan-400 font-bold">{show.statusLabel}</span>
                                            ) : isFastFilling ? (
                                              <span className="text-rose-400 font-bold">Filling Fast</span>
                                            ) : (
                                              <span className="text-emerald-400">Available</span>
                                            )}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal
          isOpen={Boolean(activeTrailerMovie)}
          movie={activeTrailerMovie}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}

    </div>
  );
}
