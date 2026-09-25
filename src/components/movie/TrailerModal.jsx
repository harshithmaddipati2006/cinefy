import React, { useState } from "react";
import {
  X,
  Film,
  Globe,
  Volume2,
  ExternalLink,
  Play,
  Bell,
  BellRing,
  Calendar,
  Sparkles,
  Share2,
  CheckCircle,
  Clapperboard,
  Clock
} from "lucide-react";

/**
 * TrailerModal Component
 * For upcoming releases: Displays "Trailer Coming Soon in [Selected Language]" with interactive alerts.
 * For released movies with active trailers: Plays high-quality direct stream with language switching.
 * Strictly displays only the trailer languages configured/added by the Admin.
 */
export default function TrailerModal({ movie, onClose, initialLanguage }) {
  if (!movie) return null;

  const isUpcoming =
    movie.status === "coming_soon" ||
    movie.status === "upcoming" ||
    movie.releaseStatus === "upcoming";

  // Derive ONLY the trailer languages configured / added by Admin
  let adminConfiguredLanguages = [];
  if (movie.trailers && typeof movie.trailers === "object" && Object.keys(movie.trailers).length > 0) {
    adminConfiguredLanguages = Object.entries(movie.trailers)
      .filter(([lang, url]) => Boolean(url && typeof url === "string" && url.trim()))
      .map(([lang]) => lang.trim());
  }

  // If no language-keyed trailers object exists, fallback strictly to the movie's primary language
  if (adminConfiguredLanguages.length === 0) {
    if (movie.language) {
      adminConfiguredLanguages = [movie.language];
    } else if (Array.isArray(movie.languages) && movie.languages.length > 0) {
      adminConfiguredLanguages = [movie.languages[0]];
    } else {
      adminConfiguredLanguages = ["Telugu"];
    }
  }

  // Remove duplicates
  const allAvailableLanguages = Array.from(new Set(adminConfiguredLanguages));

  // Default selected language: prioritize initialLanguage, then movie.language if in list, else first available
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (initialLanguage && allAvailableLanguages.includes(initialLanguage)) {
      return initialLanguage;
    }
    if (movie.language && allAvailableLanguages.includes(movie.language)) {
      return movie.language;
    }
    return allAvailableLanguages[0] || "Telugu";
  });

  // State to track reminder subscription per language
  const [notifiedLanguages, setNotifiedLanguages] = useState({});
  const [notificationToast, setNotificationToast] = useState("");
  const [showTeaserPreview, setShowTeaserPreview] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);

  // Helper to extract clean video ID
  const extractVideoId = (rawUrl) => {
    if (!rawUrl) return "";
    if (rawUrl.includes("youtube.com/embed/")) {
      const parts = rawUrl.split("youtube.com/embed/")[1];
      return parts ? parts.split("?")[0].split("&")[0] : "";
    }
    if (rawUrl.includes("youtu.be/")) {
      const parts = rawUrl.split("youtu.be/")[1];
      return parts ? parts.split("?")[0].split("&")[0] : "";
    }
    if (rawUrl.includes("youtube.com/watch")) {
      try {
        const urlObj = new URL(rawUrl);
        return urlObj.searchParams.get("v") || "";
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  // Get current active trailer URL for selected language
  const rawActiveUrl =
    (movie.trailers && movie.trailers[selectedLanguage]) ||
    movie.trailerUrl ||
    (movie.trailers && Object.values(movie.trailers)[0]) ||
    "";

  const videoId = extractVideoId(rawActiveUrl);

  const directYouTubeWatchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : rawActiveUrl;

  const activeEmbedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1`
    : rawActiveUrl;

  // Handle "Notify Me" toggle
  const handleToggleNotify = (lang) => {
    const isNowActive = !notifiedLanguages[lang];
    setNotifiedLanguages((prev) => ({ ...prev, [lang]: isNowActive }));

    if (isNowActive) {
      setNotificationToast(`Notification Alert Set! You will be alerted as soon as the ${lang} trailer launches.`);
    } else {
      setNotificationToast(`Alert cancelled for ${lang} trailer release.`);
    }

    setTimeout(() => {
      setNotificationToast("");
    }, 4000);
  };

  // Handle Share
  const handleShare = () => {
    const shareText = `Watch out for the upcoming ${movie.title} official trailer in ${selectedLanguage}! Releasing in theatres on ${movie.releaseDate || "Soon"}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} - Bookings on CineFy`);
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 3000);
    }
  };

  // Check if we should show "Trailer Coming Soon"
  const isComingSoonForLang = isUpcoming && !showTeaserPreview;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 flex flex-col my-auto max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="px-3.5 py-3 sm:px-5 sm:py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isComingSoonForLang
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
            }`}>
              {isComingSoonForLang ? <Clapperboard className="w-5 h-5" /> : <Film className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm sm:text-base font-heading leading-tight truncate flex items-center gap-2">
                <span>{movie.title}</span>
                {isUpcoming && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] uppercase tracking-wider font-extrabold shrink-0">
                    Upcoming
                  </span>
                )}
              </h3>
              <p className="text-slate-400 text-[11px] sm:text-xs flex items-center gap-1.5 mt-0.5 truncate">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {isComingSoonForLang ? (
                  <span>
                    Theatrical Trailer: <strong className="text-cyan-300 font-black">Coming Soon in {selectedLanguage}</strong>
                  </span>
                ) : (
                  <span>
                    Official Trailer: <strong className="text-cyan-400">{selectedLanguage}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {videoId && !isComingSoonForLang && (
              <a
                href={directYouTubeWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-600 transition"
                title="Open in YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Trailer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Language Selection Tabs - Allows user to pick any language */}
        <div className="bg-slate-900/95 px-3.5 py-2.5 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs font-bold shrink-0 mr-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Language:</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {allAvailableLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang;

              return (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowTeaserPreview(false);
                  }}
                  className={`px-3 py-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? isUpcoming
                        ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 scale-105"
                        : "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 scale-105"
                      : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
                  }`}
                >
                  <span>{lang}</span>
                  {isSelected && (
                    <Play className="w-2.5 h-2.5 fill-current" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Feedback Toast Banner */}
        {notificationToast && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/30 px-4 py-2 text-cyan-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{notificationToast}</span>
            </div>
            <button
              onClick={() => setNotificationToast("")}
              className="text-cyan-400 hover:text-cyan-200 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Display: "Trailer Coming Soon" vs Active Video Player */}
        {isComingSoonForLang ? (
          /* ========================================================================= */
          /* 1. COMING SOON DISPLAY IN USER-SELECTED LANGUAGE                          */
          /* ========================================================================= */
          <div className="relative p-6 sm:p-10 bg-slate-950 flex flex-col items-center justify-center text-center overflow-hidden min-h-[380px] sm:min-h-[420px] grow">
            
            {/* Background Poster Ambient Glow */}
            {movie.backdrop || movie.poster ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 blur-md scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto space-y-5">
              
              {/* Animated Clapperboard Badge */}
              <div className="relative mx-auto w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-2xl shadow-cyan-500/20 group">
                <Clapperboard className="w-10 h-10 animate-bounce text-cyan-400" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
              </div>

              {/* Main Headline in User Selected Language */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>Release In Progress</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                  Trailer Coming Soon in <span className="text-cyan-400">{selectedLanguage}</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  The official theatrical trailer for <strong className="text-white">{movie.title}</strong> in{" "}
                  <strong className="text-cyan-300">{selectedLanguage}</strong> is currently being finalized in post-production and will premiere ahead of the theatrical release on{" "}
                  <strong className="text-cyan-400">{movie.releaseDate || "Upcoming Schedule"}</strong>.
                </p>
              </div>

              {/* Action Buttons: Notify Me & Share */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleToggleNotify(selectedLanguage)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xl ${
                    notifiedLanguages[selectedLanguage]
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20 hover:bg-emerald-400"
                      : "bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-cyan-500/20 hover:from-cyan-400 hover:to-cyan-500 hover:scale-105"
                  }`}
                >
                  {notifiedLanguages[selectedLanguage] ? (
                    <>
                      <BellRing className="w-4 h-4" />
                      <span>Alert Activated for {selectedLanguage}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Notify Me When {selectedLanguage} Trailer Drops</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  title="Share Announcement"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedAlert ? "Copied Link!" : "Share"}</span>
                </button>
              </div>

              {/* Optional Preview Video Toggle if teaser link exists */}
              {activeEmbedUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowTeaserPreview(true)}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 font-bold underline flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-cyan-400 fill-current" />
                    <span>Watch Available First Look / Glimpse Video</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. ACTIVE VIDEO PLAYER (FOR RELEASED TRAILERS OR PREVIEW MODE)            */
          /* ========================================================================= */
          <div className="relative aspect-video max-h-[58vh] bg-black flex items-center justify-center grow">
            {activeEmbedUrl ? (
              <iframe
                key={`${movie.id}-${selectedLanguage}-${showTeaserPreview ? "preview" : "live"}`}
                src={activeEmbedUrl}
                title={`${movie.title} (${selectedLanguage}) Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Clapperboard className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <h3 className="text-white font-bold text-base">
                  Trailer Coming Soon in {selectedLanguage}
                </h3>
                <p className="text-slate-400 text-xs max-w-sm">
                  Official stream for {selectedLanguage} is being encoded for theatrical distribution.
                </p>
                <button
                  onClick={() => handleToggleNotify(selectedLanguage)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            {isComingSoonForLang ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="truncate">
                  Selected language: <strong className="text-cyan-300">{selectedLanguage}</strong> (Trailer in preparation)
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">
                  Playing official trailer in <strong className="text-cyan-400">{selectedLanguage}</strong>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isUpcoming && showTeaserPreview && (
              <button
                onClick={() => setShowTeaserPreview(false)}
                className="text-xs text-cyan-400 hover:underline font-bold"
              >
                Back to Coming Soon Screen
              </button>
            )}

            {videoId && !isComingSoonForLang && (
              <a
                href={directYouTubeWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
