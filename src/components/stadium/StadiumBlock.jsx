import React from "react";
import { Users, DoorOpen, Sparkles, ChevronRight, Crown, Shield } from "lucide-react";

export default function StadiumBlock({
  block,
  stand,
  isSelected,
  onSelectBlock,
  zoomLevel
}) {
  const { id, name, category, tier, gate, price, availableSeats, totalSeats, color } = block;

  return (
    <div
      onClick={() => onSelectBlock(block)}
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 group shadow-xl ${
        isSelected
          ? "bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/30 scale-[1.02]"
          : "bg-slate-950/90 border-slate-800 hover:border-cyan-400/60 hover:bg-slate-900/90"
      }`}
    >
      {/* Block Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-black text-cyan-300 uppercase">
              {block.id.toUpperCase()}
            </span>
            <h4 className="text-base font-black text-white group-hover:text-cyan-400 transition-colors font-heading">
              {name}
            </h4>
          </div>
          <p className="text-xs text-slate-400 font-bold mt-1">{tier} • {category}</p>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-cyan-400">₹{price.toLocaleString("en-IN")}</span>
          <p className="text-[10px] text-slate-500 uppercase font-bold">+ 18% GST</p>
        </div>
      </div>

      {/* Block Metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-300">
          <DoorOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Recommended: <strong>{gate}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300 text-right justify-end">
          <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Available: <strong className="text-emerald-400">{availableSeats}</strong> / {totalSeats}</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
        <span>Click to Select Curved Seats</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}
