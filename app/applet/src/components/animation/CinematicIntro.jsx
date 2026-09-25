import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Calendar, Music, Trophy, ChevronRight, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import { LampContainer } from "../ui/lamp";
import { Button as MovingBorderButton } from "../ui/moving-border";

// Web Audio API synthesized cinematic theatre chime / hum
function playCinematicChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Sub-bass cinematic rumble
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(55, now); // A1 note
    subOsc.frequency.exponentialRampToValueAtTime(110, now + 1.8);
    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.5);

    // Warm cinematic chord (golden triad: A - C# - E)
    const freqs = [220, 277.18, 329.63, 440, 554.37];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.05);

      gain.gain.setValueAtTime(0.0001, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.6 + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.2);
      osc.stop(now + 2.8);
    });
  } catch (e) {
    // Audio autoplay restrictions or errors silently caught
  }
}

const CATEGORIES = [
  { id: "movies", label: "Movies", icon: Film, color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  { id: "events", label: "Events", icon: Calendar, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  { id: "concerts", label: "Concerts", icon: Music, color: "text-yellow-300", border: "border-yellow-400/30", bg: "bg-yellow-400/10" },
  { id: "sports", label: "Stadiums", icon: Trophy, color: "text-amber-300", border: "border-amber-400/30", bg: "bg-amber-400/10" },
];

export default function CinematicIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const hasTriggeredAudio = useRef(false);

  // Trigger cinematic chime once on mount if enabled
  useEffect(() => {
    if (soundEnabled && !hasTriggeredAudio.current) {
      hasTriggeredAudio.current = true;
      playCinematicChime();
    }
  }, [soundEnabled]);

  // Smooth progress countdown (4 seconds total duration)
  useEffect(() => {
    const totalDuration = 4200; // 4.2s
    const stepTime = 50;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (stepTime / totalDuration) * 100;
        if (next >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleEnter = () => {
    if (soundEnabled) {
      playCinematicChime();
    }
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden select-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)", transition: { duration: 0.7, ease: "easeInOut" } }}
      >
        {/* Subtle background ambient cinema grid & particles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b18_0%,_#050811_90%)] pointer-events-none" />
        
        {/* Cinematic Film Grain & Spotlight Overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_30%,_rgba(234,179,8,0.15)_0%,_transparent_70%)] pointer-events-none" />

        {/* Lamp Container Animation with Dual Conic Golden Spotlight Beams */}
        <LampContainer className="min-h-screen">
          {/* Top Brand Tag / Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
            <span>Official Cinema & Entertainment Hub</span>
          </motion.div>

          {/* Grand CineFy Title */}
          <motion.h1
            initial={{ opacity: 0.4, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-2 bg-gradient-to-b from-white via-yellow-200 to-amber-500 py-3 bg-clip-text text-center text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-transparent drop-shadow-[0_10px_35px_rgba(234,179,8,0.35)]"
          >
            CINEFY
          </motion.h1>

          {/* Tagline & Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="mt-1 text-sm sm:text-base md:text-lg font-semibold tracking-[0.22em] text-yellow-200/90 uppercase text-center drop-shadow-md"
          >
            Feel The Cinema • Live The Moment
          </motion.p>

          {/* Category Badges Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-xl px-4"
          >
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75 + idx * 0.08 }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl ${cat.bg} border ${cat.border} ${cat.color} text-xs font-bold tracking-wide backdrop-blur-md shadow-sm`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Enter Button with Moving Border */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <MovingBorderButton
              borderRadius="1.75rem"
              variant="amber"
              hoverOnly={false}
              duration={2000}
              onClick={handleEnter}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_45px_rgba(234,179,8,0.7)] transition-all cursor-pointer"
            >
              <span>Explore CineFy</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </MovingBorderButton>
          </motion.div>
        </LampContainer>

        {/* Top Controls: Sound Toggle & Quick Skip */}
        <div className="absolute top-6 right-6 z-[10000] flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playCinematicChime();
            }}
            className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-yellow-400 hover:border-yellow-500/40 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title={soundEnabled ? "Mute Intro Audio" : "Unmute Intro Audio"}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-yellow-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Skip Button with radial progress indicator */}
          <button
            onClick={handleEnter}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 hover:border-yellow-500/50 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer shadow-lg"
          >
            <span>Skip</span>
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-4 h-4 -rotate-90">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-700"
                  fill="none"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-yellow-400 transition-all duration-75"
                  fill="none"
                  strokeDasharray="37.7"
                  strokeDashoffset={37.7 - (37.7 * progress) / 100}
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Bottom Ambient Notice */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10000] text-[11px] font-medium tracking-widest text-slate-500 uppercase flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
          <span>India's Premier Cinema & Arena Ticket Platform</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
