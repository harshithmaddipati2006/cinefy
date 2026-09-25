import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Calendar, Music, Trophy, ChevronRight, Sparkles } from "lucide-react";

const CATEGORIES = [
  {
    id: "movies",
    name: "MOVIES",
    tagline: "Blockbusters & Cinemas",
    icon: Film,
    iconColor: "text-yellow-400",
    boxBorder: "border-yellow-500/70",
    boxBg: "bg-yellow-500/10",
    titleColor: "text-yellow-400",
    glowColor: "rgba(234, 179, 8, 0.35)"
  },
  {
    id: "events",
    name: "EVENTS",
    tagline: "Standups & Live Shows",
    icon: Calendar,
    iconColor: "text-amber-400",
    boxBorder: "border-amber-500/70",
    boxBg: "bg-amber-500/10",
    titleColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.35)"
  },
  {
    id: "concerts",
    name: "CONCERTS",
    tagline: "Music Arena & Live Tours",
    icon: Music,
    iconColor: "text-pink-400",
    boxBorder: "border-pink-500/70",
    boxBg: "bg-pink-500/10",
    titleColor: "text-pink-400",
    glowColor: "rgba(244, 63, 94, 0.35)"
  },
  {
    id: "sports",
    name: "SPORTS",
    tagline: "Cricket Stadiums & Matches",
    icon: Trophy,
    iconColor: "text-emerald-400",
    boxBorder: "border-emerald-500/70",
    boxBg: "bg-emerald-500/10",
    titleColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.35)"
  }
];

export default function CinematicIntro({ onComplete }) {
  // Step 0: Movies
  // Step 1: Events
  // Step 2: Concerts
  // Step 3: Sports
  // Step 4: CINEFY Final Screen (Matches 00:04 & 00:05 in video)
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Each category card shows for ~850ms as seen in the video
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < 4) {
          return prev + 1;
        }
        clearInterval(interval);
        return 4;
      });
    }, 850);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // When CINEFY screen is reached, hold for 3.5s before auto-entering
    if (step === 4) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const currentCategory = step < 4 ? CATEGORIES[step] : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-[#070a14] flex flex-col items-center justify-center overflow-hidden select-none px-6 font-['Plus_Jakarta_Sans',sans-serif]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      >
        {/* Dynamic Ambient Glow matching the active category / golden finale */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
          style={{
            backgroundColor:
              step === 4
                ? "rgba(234, 179, 8, 0.22)"
                : currentCategory?.glowColor || "rgba(234, 179, 8, 0.15)"
          }}
        />

        {/* Category Cards Section (Steps 0 - 3) */}
        {step < 4 && currentCategory && (
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory.id}
                initial={{ opacity: 0, scale: 0.88, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col items-center justify-center px-10 py-8 rounded-2xl bg-[#0f1424]/90 border border-slate-700/60 backdrop-blur-xl shadow-2xl text-center min-w-[240px] sm:min-w-[270px]"
                style={{
                  boxShadow: `0 0 35px ${currentCategory.glowColor}`
                }}
              >
                {/* Small Rounded Icon Box */}
                <div
                  className={`w-12 h-12 rounded-xl ${currentCategory.boxBg} border ${currentCategory.boxBorder} flex items-center justify-center mb-4 shadow-inner`}
                >
                  <currentCategory.icon className={`w-6 h-6 ${currentCategory.iconColor}`} />
                </div>

                {/* Category Title with its authentic color (Yellow, Amber, Pink, Emerald) */}
                <h3
                  className={`text-2xl sm:text-3xl font-black tracking-wider uppercase ${currentCategory.titleColor} drop-shadow-md`}
                >
                  {currentCategory.name}
                </h3>

                {/* Crisp White Subtitle */}
                <p className="mt-1.5 text-xs sm:text-sm font-medium tracking-wide text-white/90">
                  {currentCategory.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Final CINEFY Stage (Step 4) - Exact match to 00:04 & 00:05 in Video */}
        {step === 4 && (
          <motion.div
            key="cinefy-video-matching-display"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full px-4"
          >
            {/* Top Pill: ✨ ALL-IN-ONE ENTERTAINMENT */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="px-4 py-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30" />
              <span>ALL-IN-ONE ENTERTAINMENT</span>
            </motion.div>

            {/* Grand Glowing C I N E F Y Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.16em] text-yellow-400 drop-shadow-[0_0_45px_rgba(234,179,8,0.8)] py-2"
            >
              CINEFY
            </motion.h1>

            {/* Category Row: MOVIES • EVENTS • CONCERTS • SPORTS (White text with Yellow Dots) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold tracking-[0.22em] text-white uppercase"
            >
              <span>MOVIES</span>
              <span className="text-yellow-400 font-extrabold">•</span>
              <span>EVENTS</span>
              <span className="text-yellow-400 font-extrabold">•</span>
              <span>CONCERTS</span>
              <span className="text-yellow-400 font-extrabold">•</span>
              <span>SPORTS</span>
            </motion.div>

            {/* EXPLORE NOW Button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="mt-8 px-8 py-2.5 rounded-full border border-yellow-400 bg-slate-950/80 hover:bg-yellow-400 text-yellow-400 hover:text-slate-950 text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:shadow-[0_0_30px_rgba(234,179,8,0.7)]"
            >
              <span>EXPLORE NOW</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Skip Button in Bottom Right (Matches Video exactly) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-yellow-500/30 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(234,179,8,0.2)]"
        >
          <span>SKIP</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
