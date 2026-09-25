import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import { MapPin, Calendar, Film, Star, Clock, Sparkles, ArrowLeft, Play, Info } from "lucide-react";

export default function TheatreDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();
  const { requireAuth } = useAuth();

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [loading, setLoading] = useState(true);

  // Dynamically generate next 10 days booking window
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
      if (i === 0) {
        label = "Today";
      } else if (i === 1) {
        label = "Tomorrow";
      } else {
        label = `${dayOfWeek}, ${dateNum} ${month}`;
      }

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
    fetchTheatresAndMovie();
  }, [movieId, selectedCity, selectedDate]);

  const fetchTheatresAndMovie = async () => {
    try {
      setLoading(true);
      const [movRes, thRes] = await Promise.all([
        API.get(`/movies/${movieId}`),
        API.get(`/theatres?city=${encodeURIComponent(selectedCity)}&movieId=${movieId}&date=${encodeURIComponent(selectedDate)}`)
      ]);
      setMovie(movRes.data.movie || movRes.data);
      const thData = thRes.data;
      if (thData && Array.isArray(thData.theatres)) {
        setTheatres(thData.theatres);
      } else if (Array.isArray(thData)) {
        setTheatres(thData);
      } else {
        setTheatres([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isComingSoon = movie && movie.status === "coming_soon";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span>/</span>
        <Link to="/" className="hover:text-cyan-400">Movies</Link>
        <span>/</span>
        <span className="text-white">{movie ? movie.title : "Showtimes"}</span>
      </div>

      {/* Header Info */}
      {movie && (
        <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-2xl shadow-lg border border-slate-700/80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-heading">{movie.title}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/20">
                  {movie.certification}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {movie.language || "Telugu, Hindi"} • {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "Action, Drama"} • {movie.duration || "2h 45m"}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-slate-400">City: <strong className="text-cyan-400">{selectedCity || "Tenali"}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold">10-Day Advance Booking Active</span>
              </div>
            </div>
          </div>

          {/* Quick Details Link */}
          <Link
            to={`/movie/${movie.id}`}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Movie Synopsis & Cast</span>
          </Link>
        </div>
      )}

      {/* If Coming Soon Movie, Show Clean Upcoming Notification Banner */}
      {isComingSoon ? (
        <div className="bg-slate-900/90 rounded-3xl p-8 sm:p-12 border border-cyan-500/40 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
              Upcoming Release
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">{movie.title}</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              This movie is scheduled to release in cinemas on <strong className="text-cyan-400">{movie.releaseDate || "Coming Soon"}</strong>.
              Advance ticket booking will go live 3–5 days prior to release.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={`/movie/${movie.id}`}
              className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg transition-all group"
            >
              <span className="w-6 h-6 rounded-full bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 transition-colors">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span>Watch Trailer & Cast Info</span>
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Now Showing Movies
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 10-Day Booking Date Ribbon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" /> Select Booking Date (10 Days Available)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Showing next 10 calendar days</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.label;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDate(d.label)}
                    className={`flex flex-col items-center justify-center min-w-[85px] sm:min-w-[100px] py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25 scale-105"
                        : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
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

          {/* Theatres Listing */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" /> Theatres in <span className="cyan-gradient-text">{selectedCity}</span>
              </h2>
              <span className="text-xs text-slate-400">{theatres.length} multiplexes found</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={`th-skeleton-${i}`} className="h-40 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : theatres.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-sm space-y-3">
                <p>No active shows scheduled in <strong className="text-white">{selectedCity}</strong> for <span className="text-cyan-400">{selectedDate}</span>.</p>
                <p className="text-xs text-slate-500">Try selecting another date from the 10-day calendar above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {theatres.map((th, thIdx) => {
                  const theatreKey = th.id || th.theatreId || `th-${thIdx}`;
                  return (
                  <div key={theatreKey} className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800/80 hover:border-slate-700 transition-all space-y-5 shadow-lg">
                    
                    {/* Theatre Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white font-heading">{th.name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{th.address} • <span className="text-cyan-400 font-medium">{th.distance} away</span></p>
                      </div>

                      {/* Facilities Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {th.facilities && th.facilities.map((f, fIdx) => (
                          <span key={`fac-${theatreKey}-${f}-${fIdx}`} className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Screens & Showtimes */}
                    <div className="space-y-4">
                      {th.shows && th.shows.length > 0 ? (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                          <div className="sm:w-48 shrink-0 space-y-1">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                              {th.screens && Array.isArray(th.screens) ? th.screens.join(", ") : "Main Auditoriums"}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {th.formats && Array.isArray(th.formats) ? th.formats.join(" • ") : "4K Dolby Atmos"}
                            </p>
                            <Link
                              to={`/theatres?theatreId=${encodeURIComponent(th.theatreId || th.id)}`}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold block pt-1"
                            >
                              Explore Cinema Schedule →
                            </Link>
                          </div>

                          <div className="flex flex-wrap gap-3 flex-1">
                            {th.shows.map((show, sIdx) => {
                              const showId = show.id || show.showId || `sh-${theatreKey}-${sIdx}`;
                              const showTimeStr = show.time || "07:30 PM";
                              const regPrice = show.priceRegular || show.pricing?.regular || 150;
                              const recPrice = show.priceRecliner || show.pricing?.recliner || 450;
                              const currentMovieId = movie?.id || movieId;
                              const isPassed = show.realtimeStatus === "PASSED" || show.isPast;
                              const isLive = show.realtimeStatus === "NOW_SHOWING" || show.isLive;
                              const isImminent = show.realtimeStatus === "STARTS_SOON";
                              const isFastFilling = show.realtimeStatus === "FAST_FILLING";

                              return (
                                <button
                                  key={showId}
                                  disabled={isPassed || isLive}
                                  onClick={() => {
                                    requireAuth(
                                      () => {
                                        navigate(
                                          `/seats?showId=${encodeURIComponent(showId)}&movieId=${encodeURIComponent(currentMovieId)}&theatreName=${encodeURIComponent(th.name || th.theatreName)}&showTime=${encodeURIComponent(showTimeStr)}&showDate=${encodeURIComponent(selectedDate)}&screenName=${encodeURIComponent(show.screenName || "Screen 1")}&format=${encodeURIComponent(show.format || "4K Dolby Atmos")}`
                                        );
                                      },
                                      {
                                        title: "Sign or Register To Experience Movies",
                                        subtitle: `Sign in or register to select your seats for ${movie?.title || "this movie"} at ${th.name || th.theatreName} (${showTimeStr}).`,
                                        movie: movie
                                      }
                                    );
                                  }}
                                  className={`group px-3.5 py-2 rounded-2xl border text-left transition-all min-w-[120px] flex flex-col justify-between ${
                                    isPassed
                                      ? "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                                      : isLive
                                      ? "bg-purple-950/30 border-purple-800/40 text-purple-300 cursor-not-allowed"
                                      : isImminent
                                      ? "bg-cyan-500/10 border-cyan-500 hover:bg-cyan-500/20 text-white cursor-pointer shadow-lg shadow-cyan-500/10"
                                      : isFastFilling
                                      ? "bg-rose-950/20 border-rose-800/50 hover:border-rose-500 text-white cursor-pointer"
                                      : "bg-slate-900 border-slate-800 hover:border-cyan-400 hover:bg-cyan-500/10 text-white cursor-pointer"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className={`text-xs font-black ${isPassed ? "text-slate-600" : "text-white group-hover:text-cyan-400"}`}>
                                      {showTimeStr}
                                    </span>
                                    {show.language && (
                                      <span className="text-[9px] font-bold text-cyan-400 px-1 rounded bg-cyan-950/60 border border-cyan-800/30">
                                        {show.language}
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1 space-y-0.5">
                                    <span className="block text-[9px] text-slate-400 truncate">
                                      {show.screenName || show.format || "4K Dolby Atmos"}
                                    </span>
                                    <div className="flex items-center justify-between text-[9px] font-semibold pt-0.5">
                                      <span className="text-cyan-400 font-bold">₹{regPrice}</span>
                                      {isPassed ? (
                                        <span className="text-slate-600">Finished</span>
                                      ) : isLive ? (
                                        <span className="text-purple-400 font-bold">Running</span>
                                      ) : isImminent ? (
                                        <span className="text-cyan-400 font-bold">Starts Soon</span>
                                      ) : isFastFilling ? (
                                        <span className="text-rose-400 font-bold">Fast Filling</span>
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
                      ) : (
                        (th.screens || []).map((scr, scrIdx) => {
                          const isObj = typeof scr === "object" && scr !== null;
                          const scrKey = isObj ? (scr.id || scr.name || `scr-${scrIdx}`) : `scr-${scr}-${scrIdx}`;
                          const scrName = isObj ? (scr.name || `Screen ${scrIdx + 1}`) : scr;
                          const scrType = isObj ? (scr.type || "Dolby Atmos 4K") : "Dolby Atmos 4K";
                          const showList = (isObj && (scr.shows || scr.showtimes)) || [];
                          return (
                            <div key={`screen-sec-${theatreKey}-${scrKey}`} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                              <div className="sm:w-48 shrink-0">
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{scrName}</span>
                                <p className="text-[10px] text-slate-400 mt-0.5">{scrType}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 flex-1">
                                {showList.length > 0 ? (
                                  showList.map((show, sIdx) => {
                                    const showId = show.id || show.showId || `sh-${theatreKey}-${scrKey}-${selectedDate}-${sIdx}`;
                                    const showTimeStr = show.time || "07:30 PM";
                                    const regPrice = show.priceRegular || show.pricing?.regular || 150;
                                    const recPrice = show.priceRecliner || show.pricing?.recliner || 450;
                                    const currentMovieId = movie?.id || movieId;

                                    return (
                                      <button
                                        key={showId}
                                        onClick={() => {
                                          requireAuth(
                                            () => {
                                              navigate(`/seats?showId=${encodeURIComponent(showId)}&movieId=${encodeURIComponent(currentMovieId)}&theatreName=${encodeURIComponent(th.name)}&showTime=${encodeURIComponent(showTimeStr)}&showDate=${encodeURIComponent(selectedDate)}`);
                                            },
                                            {
                                              title: "Sign or Register To Experience Movies",
                                              subtitle: `Sign in or register to select your seats for ${movie?.title || "this movie"} at ${th.name} (${showTimeStr}).`,
                                              movie: movie
                                            }
                                          );
                                        }}
                                        className="group px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-500/10 text-center transition-all cursor-pointer shadow"
                                      >
                                        <span className="block text-xs font-bold text-white group-hover:text-cyan-400">{showTimeStr}</span>
                                        <span className="block text-[10px] text-slate-400 mt-0.5">₹{regPrice} - ₹{recPrice}</span>
                                      </button>
                                    );
                                  })
                                ) : (
                                  <span className="text-xs text-slate-500 italic py-2">Showtimes updating shortly...</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                );})}
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}
