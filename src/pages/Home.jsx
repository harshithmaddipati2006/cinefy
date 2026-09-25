import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import HeroCarousel from "../components/movie/HeroCarousel";
import MovieCard from "../components/movie/MovieCard";
import TrailerModal from "../components/movie/TrailerModal";
import ConcertSeatSelectionModal from "../components/ConcertSeatSelectionModal";
import StadiumSeatSelectionModal from "../components/StadiumSeatSelectionModal";
import { LANGUAGES, OFFERS, EVENTS as FALLBACK_EVENTS } from "../data/seedData";
import { useCity } from "../context/CityContext";
import { useWishlist } from "../context/WishlistContext";
import { processMoviesWithRealtimeRelease } from "../utils/releaseEngine";
import { subscribeToLiveMovies, getLiveMoviesFromFirestore } from "../services/firebase";
import {
  Flame,
  Calendar,
  MapPin,
  Sparkles,
  Music,
  Trophy,
  Ticket,
  Film,
  Tag,
  ArrowRight,
  Star,
  Clock,
  Compass,
  Zap,
  CheckCircle2,
  Copy,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [rawMoviesList, setRawMoviesList] = useState([]);
  const [events, setEvents] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [activeConcertEvent, setActiveConcertEvent] = useState(null);
  const [activeStadiumEvent, setActiveStadiumEvent] = useState(null);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { selectedCity, autoDetectEnabled, detectLocation, detecting } = useCity();

  // Initial fallback fetch
  useEffect(() => {
    fetchMovies();
  }, []);

  // Persistent real-time live movie updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToLiveMovies((liveMovies) => {
      if (Array.isArray(liveMovies) && liveMovies.length > 0) {
        setRawMoviesList(liveMovies);
        setLoading(false);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Compute movies based on selectedLanguage
  const movies = useMemo(() => {
    if (!rawMoviesList || rawMoviesList.length === 0) return [];
    if (selectedLanguage === "All") return rawMoviesList;
    return rawMoviesList.filter(
      (m) =>
        (m.language && m.language.toLowerCase() === selectedLanguage.toLowerCase()) ||
        (Array.isArray(m.languages) && m.languages.some((l) => l.toLowerCase() === selectedLanguage.toLowerCase()))
    );
  }, [rawMoviesList, selectedLanguage]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchTheatres();
  }, [selectedCity]);

  const fetchTheatres = async () => {
    try {
      const res = await API.get(`/theatres?city=${encodeURIComponent(selectedCity)}&date=Today`);
      const data = res.data;
      if (data && Array.isArray(data.theatres)) {
        setTheatres(data.theatres.slice(0, 4));
      } else if (Array.isArray(data)) {
        setTheatres(data.slice(0, 4));
      }
    } catch (err) {
      console.warn("Error loading home theatres:", err);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/movies");
      const data = res.data;
      if (data && Array.isArray(data.movies)) {
        setRawMoviesList((prev) => (prev.length === 0 ? data.movies : prev));
      } else if (Array.isArray(data)) {
        setRawMoviesList((prev) => (prev.length === 0 ? data : prev));
      } else {
        setRawMoviesList((prev) => (prev.length === 0 ? [] : prev));
      }
    } catch (err) {
      console.error("Error loading movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      const data = res.data;
      if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents(FALLBACK_EVENTS);
      }
    } catch (err) {
      console.warn("Using fallback events:", err);
      setEvents(FALLBACK_EVENTS);
    }
  };

  const handleToggleWishlist = (id, title) => {
    toggleWishlist(id, title);
  };

  const handleCopyOffer = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const {
    nowShowing,
    comingSoon,
    todayReleases
  } = processMoviesWithRealtimeRelease(movies);

  // Separate events categories
  const allEvents = events.length > 0 ? events : FALLBACK_EVENTS;
  const concertEvents = allEvents.filter((e) => e.category === "Concerts" || e.category === "Music");
  const sportsEvents = allEvents.filter((e) => e.category === "Sports");
  const comedyEvents = allEvents.filter((e) => e.category === "Events" || e.category === "Comedy" || e.category === "Theatre");

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Hero Carousel */}
      {nowShowing.length > 0 && (
        <HeroCarousel
          movies={nowShowing.slice(0, 6)}
          onOpenTrailer={(m) => setActiveTrailerMovie(m)}
        />
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-8 sm:pt-12">
        
        {/* 2. Section: Now Showing Movies with Language Filters */}
        <section className="space-y-6">
          {/* Language Industry Filters & Active Location Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">Languages:</span>
              <button
                onClick={() => setSelectedLanguage("All")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLanguage === "All"
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
                }`}
              >
                All Cinema
              </button>
              {LANGUAGES.map((lang) => (
                <button
                  key={`lang-${lang}`}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedLanguage === lang
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Quick Location Badge */}
            <button
              onClick={detectLocation}
              disabled={detecting}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all shrink-0"
              title="Auto-detect or change city"
            >
              <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${detecting ? "animate-spin" : ""}`} />
              <span>City: <strong className="text-cyan-400 font-bold">{selectedCity}</strong></span>
              {autoDetectEnabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Auto-Detect Active" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">Now Showing</h2>
                <p className="text-slate-400 text-xs">Book tickets for movies currently playing in multiplexes near you</p>
              </div>
            </div>

            <Link
              to="/movies"
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`loading-now-skeleton-${i}`} className="aspect-[3/3.9] bg-slate-900/60 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : nowShowing.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-sm">
              No movies currently available for language: <strong className="text-cyan-400">{selectedLanguage}</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {nowShowing.map((movie, idx) => (
                <MovieCard
                  key={movie.id ? `now-${movie.id}-${idx}` : `now-idx-${idx}`}
                  movie={movie}
                  onOpenTrailer={(m) => setActiveTrailerMovie(m)}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.includes(movie.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Section: Real-Time Cinemas & Theatres in Active City */}
        {theatres.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading flex items-center gap-2">
                    <span>Cinemas in</span> <span className="cyan-gradient-text">{selectedCity}</span>
                  </h2>
                  <p className="text-slate-400 text-xs">Live theatre schedules, auditoriums, and real-time movie timings</p>
                </div>
              </div>

              <Link
                to="/theatres"
                className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View All Cinemas</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {theatres.map((th) => {
                const runningCount = (th.runningMovies || []).length || (th.movies || []).length || 3;
                return (
                  <div
                    key={th.id}
                    className="bg-slate-900/70 p-6 rounded-3xl border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-black text-white font-heading group-hover:text-cyan-300 transition-colors">
                          {th.name}
                        </h3>
                        {th.rating && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shrink-0">
                            <Star className="w-3 h-3 fill-current" /> {th.rating}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{th.address || `${th.locality}, ${selectedCity}`}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 font-semibold">
                          {runningCount} Movies Playing Today
                        </span>
                        {th.screens && (
                          <span className="text-slate-500">
                            • {th.screens.length} Screens Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1">
                        {th.facilities &&
                          th.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                              {f}
                            </span>
                          ))}
                      </div>

                      <Link
                        to={`/theatres?theatreId=${encodeURIComponent(th.id)}`}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/10 transition-all"
                      >
                        <span>Schedule</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Section: Coming Soon Movies */}
        {comingSoon.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">Upcoming Releases</h2>
                  <p className="text-slate-400 text-xs">Upcoming theatrical release dates and official trailers</p>
                </div>
              </div>

              <Link
                to="/movies"
                className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>All Releases</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {comingSoon.map((movie, idx) => (
                <MovieCard
                  key={movie.id ? `coming-${movie.id}-${idx}` : `coming-idx-${idx}`}
                  movie={movie}
                  onOpenTrailer={(m) => setActiveTrailerMovie(m)}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.includes(movie.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Section: Live Sports & Stadium Matches */}
        {sportsEvents.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">Live Cricket & Sports Stadium Clashes</h2>
                  <p className="text-slate-400 text-xs">Reserve stadium stands for IPL matches, International T20s & ODIs</p>
                </div>
              </div>

              <Link
                to="/events?category=Sports"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View All Sports</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsEvents.slice(0, 3).map((match, idx) => (
                <div
                  key={match.id ? `sports-${match.id}-${idx}` : `sports-idx-${idx}`}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-xl group hover:shadow-emerald-500/10"
                >
                  {/* Match Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                      {match.sportType || "Cricket"} • {match.tournament || "Match"}
                    </span>
                    {match.isLiveNow ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        {match.date}
                      </span>
                    )}
                  </div>

                  {/* Team vs Team Face-off */}
                  <div className="flex items-center justify-around py-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <span className="text-3xl">{match.teamAFlag || "🏏"}</span>
                      <span className="font-black text-white text-sm">{match.teamA || "Team A"}</span>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-black text-xs">
                      VS
                    </div>

                    <div className="flex flex-col items-center space-y-1 text-center">
                      <span className="text-3xl">{match.teamBFlag || "🏏"}</span>
                      <span className="font-black text-white text-sm">{match.teamB || "Team B"}</span>
                    </div>
                  </div>

                  {/* Stadium Info */}
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2 text-slate-300 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{match.venue}, {match.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Starts at {match.time}</span>
                    </div>
                    {match.distanceFromUser && (
                      <p className="text-[11px] text-emerald-400 font-medium">
                        📍 {match.distanceFromUser}
                      </p>
                    )}
                  </div>

                  {/* Actions & Pricing */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Stands from</p>
                      <p className="text-lg font-black text-cyan-400">₹{match.price}</p>
                    </div>

                    <button
                      onClick={() => setActiveStadiumEvent(match)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Select Stand</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Section: Standup Comedy & Live Festivals */}
        {comedyEvents.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">Standup Comedy & Live Shows</h2>
                  <p className="text-slate-400 text-xs">Unfiltered humor, theatrical dramas, and cultural experiences</p>
                </div>
              </div>

              <Link
                to="/events?category=Events"
                className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View All Shows</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comedyEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={event.id ? `comedy-${event.id}-${idx}` : `comedy-idx-${idx}`}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-500/90 text-slate-950 font-bold text-xs">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white text-base font-heading group-hover:text-cyan-400 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Tickets from</p>
                        <p className="text-lg font-black text-cyan-400">₹{event.price}</p>
                      </div>

                      <button
                        onClick={() => setActiveConcertEvent(event)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Book Passes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Section: Exclusive Deals & Promos */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">Promotions & Card Offers</h2>
                <p className="text-slate-400 text-xs">Exclusive cashback & discount coupons for CineFy bookings</p>
              </div>
            </div>

            <Link
              to="/offers"
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All Offers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS.slice(0, 3).map((offer, idx) => {
              const isCopied = copiedCode === offer.code;
              return (
                <div
                  id={`home-offer-card-${offer.code.toLowerCase()}`}
                  key={offer.id || offer.code || `home-offer-${idx}`}
                  className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                        {offer.discountPercent}% OFF
                      </span>
                      <span className="text-[11px] text-slate-500">Till {offer.validTill}</span>
                    </div>
                    <h4 className="text-base font-bold text-white font-heading">{offer.title}</h4>
                    <p className="text-xs text-slate-400">{offer.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-dashed border-cyan-500/40 font-mono font-bold text-xs text-cyan-400">
                      {offer.code}
                    </div>
                    <button
                      onClick={() => handleCopyOffer(offer.code)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal
          movie={activeTrailerMovie}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}

      {/* Concert Ticket Selection Modal */}
      {activeConcertEvent && (
        <ConcertSeatSelectionModal
          event={activeConcertEvent}
          onClose={() => setActiveConcertEvent(null)}
          onBookingSuccess={(pass) => {
            setActiveConcertEvent(null);
            navigate(`/bookings`);
          }}
        />
      )}

      {/* Stadium Stand Selection Modal */}
      {activeStadiumEvent && (
        <StadiumSeatSelectionModal
          event={activeStadiumEvent}
          onClose={() => setActiveStadiumEvent(null)}
        />
      )}
    </div>
  );
}
