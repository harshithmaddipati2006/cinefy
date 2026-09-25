import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Play, Ticket, Heart, Calendar, Info, Sparkles, Flame } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { Button as MovingBorderButton } from "../ui/moving-border";
import { enrichMovieWithRealtimeRelease } from "../../utils/releaseEngine";

export default function MovieCard({ movie: rawMovie, onOpenTrailer, onToggleWishlist, isWishlisted: propIsWishlisted }) {
  const movie = enrichMovieWithRealtimeRelease(rawMovie);
  const isComingSoon = movie.status === "coming_soon";
  const isReleasedToday = movie.isReleasedToday;
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { isWishlisted: ctxIsWishlisted, toggleWishlist: ctxToggleWishlist } = useWishlist();

  const isCurrentWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : ctxIsWishlisted(movie.id);

  const handleWishlistToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onToggleWishlist) {
      onToggleWishlist(movie.id);
    } else {
      ctxToggleWishlist(movie.id, movie.title);
    }
  };

  return (
    <div className="group relative bg-slate-900/60 rounded-3xl border border-slate-800/80 overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* Poster Container - Compact Medium Length */}
      <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="relative aspect-[3/3.9] overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Gentle bottom-only vignette for badge readability, keeping 70%+ of poster completely untouched */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Badges: Language & Today Release Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 items-start pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md text-cyan-300 font-bold text-xs px-3 py-1 rounded-full border border-cyan-500/30 shadow-md">
            {movie.language}
          </div>
          {isReleasedToday && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1 uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Released Today!</span>
            </div>
          )}
        </div>

        {/* Always-On-Top Prominent Wishlist Heart Button */}
        <button
          id={`movie-card-wishlist-top-btn-${movie.id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-30 cursor-pointer shadow-lg active:scale-90 ${
            isCurrentWishlisted
              ? "bg-rose-500 text-white shadow-rose-500/40 ring-2 ring-white/40 scale-105"
              : "bg-slate-950/80 text-slate-300 hover:text-rose-400 hover:bg-slate-900 border border-slate-700/80 hover:scale-110"
          }`}
          title={isCurrentWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isCurrentWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isCurrentWishlisted ? "fill-current text-white" : ""}`} />
        </button>

        {/* Rating or Release Badge - Fades out smoothly when action buttons slide up at the bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-10 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
          {isComingSoon ? (
            <>
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-200 font-bold text-xs">
                {movie.daysUntilRelease === 1
                  ? "Tomorrow"
                  : movie.daysUntilRelease && movie.daysUntilRelease <= 30
                  ? `In ${movie.daysUntilRelease} days`
                  : movie.displayReleaseDate || movie.releaseDate || "Coming Soon"}
              </span>
            </>
          ) : isReleasedToday ? (
            <>
              <Flame className="w-4 h-4 text-emerald-400 fill-current animate-bounce" />
              <span className="text-emerald-300 font-black text-xs">In Theatres Now</span>
            </>
          ) : (
            <>
              <Star className="w-4 h-4 text-cyan-400 fill-current" />
              <span className="text-white font-black text-sm">{movie.rating}</span>
              {movie.votes && <span className="text-slate-400 text-xs">({movie.votes})</span>}
            </>
          )}
        </div>

        {/* Hover Action Buttons: Slide up from the bottom without darkening, obscuring, or blurring the poster */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-6 pointer-events-none z-20 flex flex-col justify-end">
          <div className="w-full flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto">
            <MovingBorderButton
              id={`movie-card-trailer-btn-${movie.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenTrailer) onOpenTrailer(movie);
              }}
              variant="cyan"
              borderRadius="0.75rem"
              containerClassName="h-9 w-full shadow-2xl shadow-black/90"
              className="w-full py-1.5 px-3 bg-slate-950/95 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700/80"
            >
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/40">
                <Play className="w-2 h-2 fill-current ml-0.5" />
              </span>
              <span>Watch Trailer</span>
            </MovingBorderButton>

            {isComingSoon ? (
              <MovingBorderButton
                as={Link}
                to={`/movie/${movie.id}`}
                onClick={(e) => e.stopPropagation()}
                variant="cyan"
                borderRadius="0.75rem"
                containerClassName="h-9 w-full shadow-2xl shadow-black/90"
                className="w-full py-1.5 px-3 bg-cyan-600/95 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>View Details</span>
              </MovingBorderButton>
            ) : (
              <MovingBorderButton
                id={`movie-card-book-btn-${movie.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  requireAuth(
                    () => navigate(`/theatres/${movie.id}`),
                    {
                      title: "Sign or Register To Experience Movies",
                      subtitle: `Sign in or register to book your showtimes and tickets for "${movie.title}".`,
                      movie: movie
                    }
                  );
                }}
                variant="cyan"
                borderRadius="0.75rem"
                containerClassName="h-9 w-full shadow-2xl shadow-cyan-500/30"
                className="w-full py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </MovingBorderButton>
            )}
          </div>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={`/movie/${movie.id}`} className="flex-1">
              <h3 className="text-white font-bold text-lg font-heading group-hover:text-cyan-300 transition-colors line-clamp-1">
                {movie.title}
              </h3>
            </Link>
            <button
              onClick={handleWishlistToggle}
              className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isCurrentWishlisted
                  ? "text-rose-500 hover:text-rose-400"
                  : "text-slate-500 hover:text-rose-400"
              }`}
              title={isCurrentWishlisted ? "In Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isCurrentWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 font-medium">
            {movie.year && <span className="text-slate-300 font-semibold">{movie.year} • </span>}
            <span>{movie.language} • {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).join(" • ")}</span>
          </div>
          {movie.music && (
            <p className="text-cyan-400/90 text-xs mt-1 font-semibold truncate">
              Music: {movie.music}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">{movie.certification}</span>
          <span className={`font-semibold ${isReleasedToday ? "text-emerald-400" : isComingSoon ? "text-rose-400" : "text-cyan-400"}`}>
            {isReleasedToday
              ? "Premiering Today!"
              : isComingSoon
              ? (movie.daysUntilRelease === 1 ? "Releases Tomorrow" : `Releases ${movie.displayReleaseDate || movie.releaseDate || "Soon"}`)
              : "Now Showing"}
          </span>
        </div>
      </div>
    </div>
  );
}

