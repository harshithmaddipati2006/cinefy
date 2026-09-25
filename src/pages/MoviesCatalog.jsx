import React, { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import MovieCard from "../components/movie/MovieCard";
import TrailerModal from "../components/movie/TrailerModal";
import { LANGUAGES, GENRES } from "../data/seedData";
import { useCity } from "../context/CityContext";
import { useWishlist } from "../context/WishlistContext";
import { processMoviesWithRealtimeRelease, enrichMovieWithRealtimeRelease } from "../utils/releaseEngine";
import { Film, Filter, Search, Flame, MapPin, Sparkles } from "lucide-react";
import { subscribeToLiveMovies } from "../services/firebase";

export default function MoviesCatalog() {
  const [rawMovies, setRawMovies] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [isLiveSynced, setIsLiveSynced] = useState(false);
  const { selectedCity, autoDetectEnabled, detectLocation, detecting } = useCity();

  // 1. Initial fallback load from backend API / seed cache
  useEffect(() => {
    let isMounted = true;
    const fetchInitialMovies = async () => {
      try {
        const res = await API.get("/movies");
        const data = res.data;
        let rawList = [];
        if (data && Array.isArray(data.movies)) {
          rawList = data.movies;
        } else if (Array.isArray(data)) {
          rawList = data;
        }
        if (isMounted && rawList.length > 0) {
          setRawMovies((prev) => (prev.length === 0 ? rawList : prev));
          setLoading(false);
        }
      } catch (err) {
        console.warn("Notice: Initial movies fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitialMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time Firestore snapshot listener
  // Automatically reflects any updates on the admin side (add, edit, delete) in real time without refreshing
  useEffect(() => {
    const unsubscribe = subscribeToLiveMovies(
      (liveMovies) => {
        if (Array.isArray(liveMovies)) {
          setRawMovies(liveMovies);
          setIsLiveSynced(true);
          setLoading(false);
        }
      },
      (err) => {
        console.warn("Real-time movie subscription notice:", err);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // 3. Reactively compute displayed movies whenever rawMovies or any filter changes
  const movies = useMemo(() => {
    let filtered = [...rawMovies];

    if (selectedStatus !== "All") {
      filtered = filtered.filter((m) => m.status === selectedStatus);
    }

    if (selectedLanguage !== "All") {
      filtered = filtered.filter(
        (m) =>
          (m.language && m.language.toLowerCase() === selectedLanguage.toLowerCase()) ||
          (Array.isArray(m.languages) && m.languages.some((l) => l.toLowerCase() === selectedLanguage.toLowerCase()))
      );
    }

    if (selectedGenre !== "All") {
      filtered = filtered.filter((m) => {
        if (Array.isArray(m.genre)) return m.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
        return m.genre && m.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (Array.isArray(m.genre) ? m.genre.join(" ") : m.genre || "").toLowerCase().includes(q) ||
          (m.language && m.language.toLowerCase().includes(q)) ||
          (Array.isArray(m.cast) && m.cast.some((c) => (c.name || "").toLowerCase().includes(q))) ||
          (m.director && m.director.toLowerCase().includes(q))
      );
    }

    const { allMovies } = processMoviesWithRealtimeRelease(filtered);
    return allMovies;
  }, [rawMovies, selectedStatus, selectedLanguage, selectedGenre, searchQuery]);

  const handleToggleWishlist = (id, title) => {
    toggleWishlist(id, title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading flex items-center gap-3">
              <Film className="w-8 h-8 text-cyan-400" />
              <span>Movie Catalogue</span>
            </h1>

            {/* Live Firestore real-time indicator */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isLiveSynced
                  ? "bg-emerald-950/70 border border-emerald-800/80 text-emerald-400"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
              title={isLiveSynced ? "Connected to live Firestore real-time updates" : "Connecting to live catalog..."}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveSynced ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span>{isLiveSynced ? "Live Catalog Synced" : "Connecting..."}</span>
            </div>

            <button
              onClick={detectLocation}
              disabled={detecting}
              className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Auto-detect or switch location"
            >
              <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${detecting ? "animate-spin" : ""}`} />
              <span>{selectedCity}</span>
              {autoDetectEnabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Explore all currently showing and upcoming theatrical blockbusters ({rawMovies.length} total releases live)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search movie title or cast..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Status Category Tabs */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setSelectedStatus("All")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
            selectedStatus === "All"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          }`}
        >
          All Movies
        </button>
        <button
          onClick={() => setSelectedStatus("now_showing")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            selectedStatus === "now_showing"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Now Showing</span>
        </button>
        <button
          onClick={() => setSelectedStatus("coming_soon")}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            selectedStatus === "coming_soon"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Upcoming Releases</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filters:</span>
        </div>

        {/* Language Filter */}
        <div className="flex-1 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-medium">Language:</span>
          <button
            onClick={() => setSelectedLanguage("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLanguage === "All"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
            }`}
          >
            All
          </button>
          {LANGUAGES.map((lang) => (
            <button
              key={`catalog-lang-${lang}`}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLanguage === lang
                  ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Genre Filter */}
        <div className="flex-1 flex flex-wrap gap-2 items-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
          <span className="text-xs text-slate-500 font-medium">Genre:</span>
          <button
            onClick={() => setSelectedGenre("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGenre === "All"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
            }`}
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              key={`catalog-genre-${g}`}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGenre === g
                  ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`catalog-skeleton-${i}`} className="aspect-[3/3.9] bg-slate-900/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400">
          No movies matching your selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id ? `catalog-movie-${movie.id}-${idx}` : `catalog-movie-idx-${idx}`}
              movie={movie}
              onOpenTrailer={(m) => setActiveTrailerMovie(m)}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(movie.id)}
            />
          ))}
        </div>
      )}

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal
          movie={activeTrailerMovie}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}

    </div>
  );
}
