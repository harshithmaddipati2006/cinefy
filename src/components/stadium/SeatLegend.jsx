import React from "react";
import { Accessibility, Crown, Lock, Check } from "lucide-react";

export default function SeatLegend() {
  const legendItems = [
    { label: "Lower Stand (Dark Blue)", color: "bg-blue-700 border-blue-500 text-white font-black", icon: null },
    { label: "Upper Stand (Royal Blue)", color: "bg-blue-500 border-blue-400 text-white font-black", icon: null },
    { label: "VIP & Presidential (Deep Navy)", color: "bg-slate-900 border-blue-900 text-blue-200", icon: <Crown className="w-2.5 h-2.5 text-sky-400" /> },
    { label: "Selected Seat", color: "bg-emerald-500 border-emerald-400 text-slate-950 font-black", icon: <Check className="w-2.5 h-2.5 stroke-[3]" /> },
    { label: "Booked", color: "bg-slate-700 border-slate-600 text-slate-400 opacity-70", icon: null },
    { label: "Blocked / Locked", color: "bg-slate-900 border-slate-800 text-slate-500", icon: <Lock className="w-2 h-2" /> },
    { label: "Wheelchair Area", color: "bg-sky-950 border-sky-600 text-sky-300", icon: <Accessibility className="w-2.5 h-2.5 text-sky-400" /> }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-1">
        Seat Legend:
      </span>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-4 h-4 rounded-md border flex items-center justify-center shadow-sm ${item.color}`}>
            {item.icon}
          </span>
          <span className="text-slate-300 font-bold text-[11px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
