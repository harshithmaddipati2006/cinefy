import React from "react";
import { Check, Lock, Crown, Sparkles, Accessibility } from "lucide-react";

export default function StadiumSeat({
  seat,
  stand,
  block,
  isSelected,
  onSelect,
  onHover,
  onLeave
}) {
  const { id, number, row, status, isVip, isPremium, isWheelchair, price } = seat;

  const isBooked = status === "booked";
  const isBlocked = status === "blocked";
  const isDisabled = isBooked || isBlocked;

  const seatEffectiveColor = seat?.color || block?.color || (seat?.tier === "upper" ? "#f97316" : "#ea580c");
  const isLightColor = seatEffectiveColor === "#ffffff" || seatEffectiveColor === "#ffedd5" || seatEffectiveColor === "#f1f5f9";

  let bgClasses = "font-black hover:brightness-110 transition-all shadow-sm";
  let inlineStyles = {};

  if (isSelected) {
    bgClasses = "bg-emerald-500 border-emerald-400 text-white font-black shadow-lg shadow-emerald-500/40 scale-110 z-10 ring-2 ring-white";
  } else if (isBooked) {
    bgClasses = "bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed opacity-40";
  } else if (isBlocked) {
    bgClasses = "bg-slate-800 border-rose-900 text-rose-400 cursor-not-allowed opacity-50";
  } else {
    // Dominant Orange / Deep Orange / Red-Orange seating
    inlineStyles = {
      backgroundColor: seatEffectiveColor,
      borderColor: isLightColor ? "#cbd5e1" : "rgba(255,255,255,0.4)",
      color: isLightColor ? "#0f172a" : "#ffffff"
    };
  }

  return (
    <button
      disabled={isDisabled}
      onClick={() => onSelect(seat)}
      onMouseEnter={() => onHover && onHover({ ...seat, standName: stand.name, blockName: block.name, gate: block.gate })}
      onMouseLeave={() => onLeave && onLeave()}
      title={`${block.name} • Row ${row} • Seat ${number} (₹${price})`}
      style={inlineStyles}
      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border text-[8.5px] font-black transition-all duration-200 flex items-center justify-center relative group/seat ${bgClasses}`}
    >
      {isSelected ? (
        <Check className="w-3 h-3 stroke-[3]" />
      ) : isBlocked ? (
        <Lock className="w-2.5 h-2.5" />
      ) : isWheelchair ? (
        <Accessibility className="w-2.5 h-2.5" />
      ) : isVip ? (
        <Crown className="w-2.5 h-2.5 text-slate-950 drop-shadow-sm" />
      ) : (
        <span>{number}</span>
      )}
    </button>
  );
}
