import React, { useState } from "react";
import { 
  Bike, 
  Car, 
  Bus, 
  Users, 
  Sparkles, 
  Check, 
  X,
  Clock3,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Vehicle options with playful BookMyShow-style descriptors and icons
 */
const SEAT_VEHICLE_OPTIONS = [
  { count: 1, label: "Cycle", emoji: "🚲", icon: Bike, desc: "Solo cinephile" },
  { count: 2, label: "Scooter", emoji: "🛵", icon: Bike, desc: "Movie date" },
  { count: 3, label: "Auto", emoji: "🛺", icon: Car, desc: "Trio squad" },
  { count: 4, label: "Car", emoji: "🚗", icon: Car, desc: "Family & Friends" },
  { count: 5, label: "SUV", emoji: "🚙", icon: Car, desc: "Squad night" },
  { count: 6, label: "Van", emoji: "🚐", icon: Car, desc: "Extended gang" },
  { count: 7, label: "Mini Bus", emoji: "🚐", icon: Bus, desc: "Party group" },
  { count: 8, label: "Bus", emoji: "🚌", icon: Bus, desc: "Mega reunion" },
  { count: 9, label: "Tour Bus", emoji: "🚌", icon: Bus, desc: "Fan club group" },
  { count: 10, label: "Double Decker", emoji: "🚌", icon: Bus, desc: "Housefull crew" }
];

/**
 * BookMyShowSeatCountModal
 * 
 * Authentic BookMyShow "How Many Seats?" modal with vehicle selectors,
 * real-time price tier availability chips, and quick seat locking.
 */
export default function BookMyShowSeatCountModal({
  isOpen,
  onClose,
  initialCount = 2,
  onConfirm,
  categoryStats = {},
  theatreName = "Cinema",
  movieTitle = "Movie"
}) {
  const [selectedCount, setSelectedCount] = useState(initialCount);

  if (!isOpen) return null;

  const currentOption = SEAT_VEHICLE_OPTIONS.find(o => o.count === selectedCount) || SEAT_VEHICLE_OPTIONS[1];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedCount);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900 to-[#070b14] p-6 shadow-2xl text-slate-100 selection:bg-cyan-500 selection:text-slate-950"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-rose-400" /> BookMyShow Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                How many seats?
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {movieTitle} • <strong className="text-cyan-400 font-bold">{theatreName}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vehicle Feature Showcase Banner */}
          <div className="my-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center relative overflow-hidden">
            <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
              {currentOption.emoji}
            </div>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span>{selectedCount} {selectedCount === 1 ? "Ticket" : "Tickets"}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-bold">{currentOption.label}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {currentOption.desc}
            </p>
          </div>

          {/* Seat Number Number-Pill Grid (1 to 10) */}
          <div className="space-y-2 mb-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Select Quantity</span>
              <span className="text-cyan-400 font-mono font-bold">Max 10 seats</span>
            </label>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {SEAT_VEHICLE_OPTIONS.map((opt) => {
                const isSelected = opt.count === selectedCount;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setSelectedCount(opt.count)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)] font-black scale-105"
                        : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-black">{opt.count}</span>
                    <span className="text-[10px] opacity-75">{opt.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Price Category Chips (BookMyShow Style) */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Price Categories Available</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Status
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(categoryStats).map(([catName, data]) => {
                const isFillingFast = data.available < data.total * 0.35;
                return (
                  <div
                    key={catName}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 truncate">{catName}</span>
                      <span className="font-mono font-black text-cyan-400">₹{data.price}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className={isFillingFast ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                        {isFillingFast ? "FILLING FAST" : "AVAILABLE"}
                      </span>
                      <span className="text-slate-500 font-mono">{data.available} left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-cyan-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Select {selectedCount} {selectedCount === 1 ? "Seat" : "Seats"}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
