import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Star, Play, Ticket, ChevronLeft, ChevronRight, Clock, Sparkles, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { Button as MovingBorderButton } from "../ui/moving-border";

export default function HeroCarousel({ movies, onOpenTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;
  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[85vh] min-h-[550px] max-h-[750px] bg-slate-950 overflow-hidden">
      
      {/* Background Image Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={currentMovie.backdrop}
            alt={currentMovie.title}
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-110"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/70 to-transparent w-full md:w-3/4" />
        </motion.div>
      </AnimatePresence>

      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          
          {/* Text Content */}
          <motion.div
            key={`text-${currentMovie.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-8 space-y-5"
          >
            {/* Language & Genre Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm shadow-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {currentMovie.language}
              </span>
              {(Array.isArray(currentMovie.genre) ? currentMovie.genre : [currentMovie.genre]).map((g, idx) => (
                <span key={`${currentMovie.id || 'hero'}-genre-${g}-${idx}`} className="px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-800 text-xs font-semibold">
                  {g}
                </span>
              ))}
            </div>

            {/* Movie Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-heading tracking-tight drop-shadow-lg leading-none">
              {currentMovie.title}
            </h1>

            {/* Meta info bar */}
            <div className="flex items-center space-x-6 text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30 text-cyan-300 font-bold shadow-sm">
                <Star className="w-4 h-4 fill-current text-cyan-400" />
                <span>{currentMovie.rating} / 10</span>
              </div>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4" />
                {currentMovie.duration}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                {currentMovie.certification}
              </span>
            </div>

            {/* Description Synopsis */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3">
              {currentMovie.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {currentMovie.status === "coming_soon" ? (
                <MovingBorderButton
                  as={Link}
                  to={`/movie/${currentMovie.id}`}
                  variant="cyan"
                  borderRadius="1rem"
                  containerClassName="h-13 min-w-[200px]"
                  className="bg-cyan-600/90 hover:bg-cyan-500 text-slate-950 font-black tracking-wider uppercase text-sm flex items-center gap-2.5"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Explore Movie Details</span>
                </MovingBorderButton>
              ) : (
                <MovingBorderButton
                  id={`hero-book-tickets-btn-${currentMovie.id}`}
                  onClick={() => {
                    requireAuth(
                      () => navigate(`/theatres/${currentMovie.id}`),
                      {
                        title: "Sign or Register To Experience Movies",
                        subtitle: `Sign in or register to book your showtimes and seats for "${currentMovie.title}".`,
                        movie: currentMovie
                      }
                    );
                  }}
                  variant="cyan"
                  borderRadius="1rem"
                  containerClassName="h-13 min-w-[210px]"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider uppercase text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/20"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Book Tickets Now</span>
                </MovingBorderButton>
              )}

              <MovingBorderButton
                id={`hero-watch-trailer-btn-${currentMovie.id}`}
                onClick={() => onOpenTrailer && onOpenTrailer(currentMovie)}
                variant="cyan"
                borderRadius="1rem"
                containerClassName="h-13 min-w-[170px]"
                className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold tracking-wider uppercase text-sm flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/40 shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Watch Trailer</span>
              </MovingBorderButton>

              <button
                id={`hero-wishlist-btn-${currentMovie.id}`}
                onClick={() => toggleWishlist(currentMovie.id, currentMovie.title)}
                className={`p-3.5 rounded-2xl border flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg active:scale-95 ${
                  isWishlisted(currentMovie.id)
                    ? "bg-rose-500/20 border-rose-500/80 text-rose-300 hover:bg-rose-500/30"
                    : "bg-slate-900/80 border-slate-700 text-white hover:border-rose-400 hover:text-rose-300"
                }`}
                title={isWishlisted(currentMovie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label={isWishlisted(currentMovie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted(currentMovie.id) ? "fill-rose-500 text-rose-500" : "text-rose-400"}`} />
              </button>
            </div>
          </motion.div>

          {/* Floating Poster (Desktop) - Medium Size */}
          <motion.div
            key={`poster-${currentMovie.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:block md:col-span-4"
          >
            <div className="relative group max-w-[210px] lg:max-w-[230px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-700/60 shadow-2xl shadow-cyan-500/10">
              <img
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-3">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)}
          className="p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-cyan-400 tracking-widest px-2">
          {currentIndex + 1} / {movies.length}
        </span>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)}
          className="p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
