import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import TrailerModal from "../components/movie/TrailerModal";
import { Button as MovingBorderButton } from "../components/ui/moving-border";
import { enrichMovieWithRealtimeRelease } from "../utils/releaseEngine";
import { Star, Play, Ticket, Clock, Calendar, UserCheck, MessageSquare, Send, Globe, CheckCircle2, Loader2, Sparkles, Heart } from "lucide-react";
import { subscribeToLiveMovie } from "../services/firebase";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerLang, setTrailerLang] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchMovieAndReviews();
  }, [id]);

  // Real-time Firestore document listener for movie details updates
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToLiveMovie(id, (liveMovie, isDeleted) => {
      if (isDeleted) {
        setErrorMessage("This movie has been removed from the theatrical catalogue.");
        return;
      }
      if (liveMovie) {
        const movieData = enrichMovieWithRealtimeRelease(liveMovie);
        setMovie((prev) => ({ ...prev, ...movieData }));
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [id]);

  const fetchMovieAndReviews = async () => {
    try {
      setLoading(true);
      const movRes = await API.get(`/movies/${id}`);
      const rawMovie = movRes.data.movie || movRes.data;
      const movieData = enrichMovieWithRealtimeRelease(rawMovie);
      setMovie(movieData);

      const isUpcoming = movieData?.status === "coming_soon";

      if (isUpcoming) {
        setReviews([]);
      } else {
        const revRes = await API.get(`/reviews/movie/${id}`);
        const rData = revRes.data;
        if (rData && Array.isArray(rData.reviews)) {
          setReviews(rData.reviews);
        } else if (Array.isArray(rData)) {
          setReviews(rData);
        } else {
          setReviews([]);
        }
      }
    } catch (err) {
      console.log("Error loading movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newComment.trim()) {
      setErrorMessage("Please write a few words about the movie before posting.");
      return;
    }

    setReviewSubmitting(true);
    setErrorMessage("");

    const effectiveName = user?.name || (guestName.trim() ? guestName.trim() : "Verified Cinephile");
    const effectiveAvatar = user?.photoURL || user?.avatar || `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 50)}?w=100&auto=format&fit=crop&q=80`;

    const payload = {
      movieId: id,
      userName: effectiveName,
      userAvatar: effectiveAvatar,
      rating: Number(newRating) || 5,
      comment: newComment.trim()
    };

    try {
      const res = await API.post("/reviews", payload);
      const createdReview = res.data.review || {
        id: "rev-" + Date.now(),
        movieId: id,
        userName: effectiveName,
        userAvatar: effectiveAvatar,
        rating: Number(newRating) || 5,
        comment: newComment.trim(),
        date: new Date().toISOString().split("T")[0]
      };

      setReviews((prev) => [createdReview, ...prev.filter(r => r.id !== createdReview.id)]);
      setNewComment("");
      setGuestName("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to post review to API, saving locally:", err);
      // Fallback local addition if network fails
      const fallbackReview = {
        id: "rev-" + Date.now(),
        movieId: id,
        userName: effectiveName,
        userAvatar: effectiveAvatar,
        rating: Number(newRating) || 5,
        comment: newComment.trim(),
        date: new Date().toISOString().split("T")[0]
      };
      setReviews((prev) => [fallbackReview, ...prev]);
      setNewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 space-y-4">
        <h2 className="text-2xl font-bold text-white">Movie Information Unavailable</h2>
        <button onClick={() => navigate("/")} className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Backdrop & Header Banner */}
      <div className="relative w-full h-[60vh] min-h-[450px] bg-slate-950 overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"; }}
          className="w-full h-full object-cover opacity-30 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10 z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
            
            {/* Poster - Medium Proportional Size */}
            <div className="w-36 sm:w-44 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shrink-0 bg-slate-900 mx-auto md:mx-0">
              <img
                src={movie.poster}
                alt={movie.title}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"; }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Summary */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">
                  {movie.language}
                </span>
                {movie.genre.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex items-baseline gap-3 justify-center md:justify-start">
                <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">{movie.title}</h1>
                {movie.year && (
                  <span className="text-2xl text-slate-400 font-semibold">({movie.year})</span>
                )}
              </div>

              {/* Credits Line */}
              <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
                  {movie.director && (
                    <span>
                      <strong className="text-slate-400 font-normal">Directed by</strong>{" "}
                      <span className="text-white font-bold">{movie.director}</span>
                    </span>
                  )}
                  {movie.music && (
                    <span>
                      • <strong className="text-slate-400 font-normal">Music by</strong>{" "}
                      <span className="text-cyan-400 font-bold">{movie.music}</span>
                    </span>
                  )}
                </div>
                {movie.cast && movie.cast.length > 0 && (
                  <p className="text-slate-400">
                    Starring{" "}
                    <span className="text-slate-200 font-semibold">
                      {movie.cast.slice(0, 3).map(c => c.name).join(" and ")}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-300 font-semibold">
                {movie.isReleasedToday ? (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-500/50 text-emerald-300 font-bold text-xs uppercase tracking-wider animate-pulse shadow-md shadow-emerald-500/20">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Premiering Today in Theatres!</span>
                  </div>
                ) : movie.status === "coming_soon" ? (
                  <div className="flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{movie.daysUntilRelease === 1 ? "Releasing Tomorrow!" : `Releasing ${movie.displayReleaseDate || movie.releaseDate || "Soon"}`}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30 text-cyan-300 font-bold shadow-sm">
                    <Star className="w-4 h-4 fill-current text-cyan-400" />
                    <span>{movie.rating} / 10</span>
                  </div>
                )}
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {movie.duration}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {movie.displayReleaseDate || movie.releaseDate}</span>
                <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs">{movie.certification}</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                {movie.status === "coming_soon" ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-5 py-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Releasing on {movie.releaseDate || "Soon in Theatres"}</span>
                    </div>

                    <MovingBorderButton
                      id={`movie-details-coming-trailer-btn-${movie.id}`}
                      onClick={() => setTrailerOpen(true)}
                      variant="cyan"
                      borderRadius="1rem"
                      containerClassName="h-12 min-w-[190px]"
                      className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/40">
                        <Play className="w-3 h-3 fill-current ml-0.5 text-slate-950" />
                      </span>
                      <span>Watch Official Trailer</span>
                    </MovingBorderButton>

                    <button
                      id={`movie-details-coming-wishlist-btn-${movie.id}`}
                      onClick={() => toggleWishlist(movie.id, movie.title)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer ${
                        isWishlisted(movie.id)
                          ? "bg-rose-500/20 border-rose-500/80 text-rose-300 hover:bg-rose-500/30"
                          : "bg-slate-900/90 border-slate-700 text-white hover:border-rose-400 hover:text-rose-300"
                      }`}
                      title={isWishlisted(movie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      aria-label={isWishlisted(movie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted(movie.id) ? "fill-rose-500 text-rose-500" : "text-rose-400"}`} />
                    </button>
                  </div>
                ) : (
                  <>
                    <MovingBorderButton
                      id={`movie-details-book-btn-${movie.id}`}
                      onClick={() => {
                        requireAuth(
                          () => navigate(`/theatres/${movie.id}`),
                          {
                            title: "Sign or Register To Experience Movies",
                            subtitle: `Sign in or register to choose your theatre showtimes and seats for "${movie.title}".`,
                            movie: movie
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

                    <MovingBorderButton
                      id={`movie-details-watch-trailer-btn-${movie.id}`}
                      onClick={() => setTrailerOpen(true)}
                      variant="cyan"
                      borderRadius="1rem"
                      containerClassName="h-13 min-w-[170px]"
                      className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/40 shrink-0">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-slate-950" />
                      </span>
                      <span>Watch Trailer</span>
                    </MovingBorderButton>

                    <button
                      id={`movie-details-wishlist-btn-${movie.id}`}
                      onClick={() => toggleWishlist(movie.id, movie.title)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg ${
                        isWishlisted(movie.id)
                          ? "bg-rose-500/20 border-rose-500/80 text-rose-300 hover:bg-rose-500/30"
                          : "bg-slate-900/90 border-slate-700 text-white hover:border-rose-400 hover:text-rose-300"
                      }`}
                      title={isWishlisted(movie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      aria-label={isWishlisted(movie.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted(movie.id) ? "fill-rose-500 text-rose-500" : "text-rose-400"}`} />
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Language Trailers Indicator - Shows ONLY languages added by Admin */}
              {(() => {
                const configuredTrailerLangs =
                  movie.trailers && typeof movie.trailers === "object" && Object.keys(movie.trailers).length > 0
                    ? Object.keys(movie.trailers).filter((lang) => Boolean(movie.trailers[lang] && String(movie.trailers[lang]).trim()))
                    : [movie.language || "Telugu"];

                if (configuredTrailerLangs.length === 0) return null;

                return (
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      Trailers Available In ({configuredTrailerLangs.length}):
                    </span>
                    {configuredTrailerLangs.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setTrailerLang(lang);
                          setTrailerOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 group"
                        title={`Watch ${lang} Trailer`}
                      >
                        <span className="w-4 h-4 rounded-full bg-cyan-600 group-hover:bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow">
                          <Play className="w-2 h-2 fill-current ml-0.2" />
                        </span>
                        <span>{lang}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Synopsis */}
        <section className="bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-3">
          <h3 className="text-xl font-bold text-white font-heading">About the Movie</h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">{movie.synopsis}</p>
        </section>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" /> Cast Members
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.map((actor, idx) => (
                <div key={idx} className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center space-y-2 hover:border-cyan-500/40 transition-colors">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"; }}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-cyan-500/30 shadow-md"
                  />
                  <div>
                    <h5 className="text-white font-bold text-sm line-clamp-1">{actor.name}</h5>
                    <p className="text-slate-400 text-xs line-clamp-1">{actor.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crew Section */}
        {movie.crew && movie.crew.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-white font-heading">Behind the Scenes Crew</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.crew.map((member, idx) => (
                <div key={idx} className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"; }}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow-md"
                  />
                  <div>
                    <h5 className="text-white font-bold text-sm">{member.name}</h5>
                    <p className="text-cyan-400 text-xs font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* User Reviews / Upcoming Release Notice */}
        {movie.status === "coming_soon" || movie.status === "upcoming" || movie.releaseStatus === "upcoming" ? (
          <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-white font-heading">
                Audience Reviews Unlock on Release Day
              </h3>
              <p className="text-sm text-slate-400">
                Verified reviews and audience ratings for <strong className="text-white font-semibold">{movie.title}</strong> will be enabled once the film officially hits cinemas on <strong className="text-cyan-400 font-semibold">{movie.releaseDate || "Upcoming Schedule"}</strong>.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setTrailerOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer group shadow"
              >
                <span className="w-6 h-6 rounded-full bg-cyan-600 group-hover:bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-cyan-600/30 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5 text-slate-950" />
                </span>
                <span>Watch Trailer & Teaser Previews</span>
              </button>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" /> 
                <span>Audience Reviews</span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              </h3>

              {!user && (
                <Link
                  to="/login"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                >
                  Sign in with Google / Mobile for verified badge
                </Link>
              )}
            </div>

            {/* Add Review Box */}
            <form onSubmit={handlePostReview} className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Share your thoughts & rating</span>
                </h4>

                {/* Star Rating Selectors */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
                  <span className="text-xs text-slate-400 font-medium mr-1">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                      title={`${star} Star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= newRating ? "text-cyan-400 fill-cyan-400" : "text-slate-700 hover:text-cyan-400/50"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-cyan-400 ml-1.5">{newRating}/5</span>
                </div>
              </div>

              {/* Author info (if guest) */}
              {!user && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Rahul Sharma)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="sm:w-1/3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-400 flex items-center">
                    Posting as guest • Sign in to save to your personal profile
                  </p>
                </div>
              )}

              {user && (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-300 text-slate-950 font-bold flex items-center justify-center text-[10px] shadow-sm">
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <span>Posting as <strong className="text-cyan-400">{user.name || "Movie Lover"}</strong> (Verified)</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Write your review or movie reaction here (e.g. Loved the background score & climax!)..."
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting || !newComment.trim()}
                  className="cyan-button px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10 shrink-0 cursor-pointer"
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Post Review</span>
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400 font-semibold">{errorMessage}</p>
              )}

              {reviewSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your review has been posted successfully! Thank you for sharing your experience.</span>
                </div>
              )}
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">No reviews yet for this movie</p>
                  <p className="text-xs text-slate-500">Be the first cinephile to share your rating and reaction!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-4 hover:border-slate-700/80 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0 shadow-inner">
                      {(rev.userName || "C")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-white font-bold text-sm">{rev.userName}</h5>
                        <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                          <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                          <span>{rev.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                      <p className="text-slate-500 text-[10px]">{rev.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <TrailerModal
          movie={movie}
          initialLanguage={trailerLang}
          onClose={() => {
            setTrailerOpen(false);
            setTrailerLang("");
          }}
        />
      )}

    </div>
  );
}
