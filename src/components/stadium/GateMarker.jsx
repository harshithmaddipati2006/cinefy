import React from "react";
import { Navigation, DoorOpen, ShieldAlert, Sparkles } from "lucide-react";

export default function GateMarker({ gate, position, isRecommended, onClick }) {
  const getPositionStyles = (pos) => {
    switch (pos) {
      case "top":
        return "top-1 left-1/2 -translate-x-1/2";
      case "bottom":
        return "bottom-1 left-1/2 -translate-x-1/2";
      case "left":
        return "left-1 top-1/2 -translate-y-1/2";
      case "right":
        return "right-1 top-1/2 -translate-y-1/2";
      case "top-left":
        return "top-8 left-12";
      case "top-right":
        return "top-8 right-12";
      case "bottom-left":
        return "bottom-8 left-12";
      case "bottom-right":
        return "bottom-8 right-12";
      default:
        return "";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`absolute z-20 px-2.5 py-1 rounded-xl font-mono text-[9px] font-black uppercase transition-all flex items-center gap-1 shadow-lg ${getPositionStyles(position)} ${
        isRecommended
          ? "bg-cyan-400 text-slate-950 border-2 border-cyan-300 ring-4 ring-cyan-400/30 animate-bounce scale-110"
          : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300"
      }`}
    >
      <DoorOpen className={`w-3 h-3 ${isRecommended ? "text-slate-950" : "text-cyan-400"}`} />
      <span>{gate.name}</span>
    </button>
  );
}
