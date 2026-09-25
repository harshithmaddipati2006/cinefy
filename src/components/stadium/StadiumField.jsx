import React from "react";
import { Sparkles, Trophy, Flame } from "lucide-react";

export default function StadiumField({ teamA = "IND", teamB = "AUS" }) {
  return (
    <div className="relative w-[340px] h-[240px] sm:w-[480px] sm:h-[320px] rounded-[100%] bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 border-4 border-cyan-400/80 shadow-2xl flex flex-col items-center justify-center select-none overflow-hidden group">
      
      {/* Turf Stripes Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
      
      {/* 30-Yard Fielding Circle */}
      <div className="w-[200px] h-[130px] sm:w-[300px] sm:h-[190px] rounded-[100%] border-2 border-dashed border-emerald-200/50 flex items-center justify-center relative">
        
        {/* Sight Screen North */}
        <div className="absolute top-1 w-14 sm:w-18 h-1.5 bg-white rounded shadow-md border border-slate-300 flex items-center justify-center">
          <span className="text-[6px] font-black text-slate-950 uppercase">NORTH SIGHT SCREEN</span>
        </div>

        {/* Sight Screen South */}
        <div className="absolute bottom-1 w-14 sm:w-18 h-1.5 bg-white rounded shadow-md border border-slate-300 flex items-center justify-center">
          <span className="text-[6px] font-black text-slate-950 uppercase">SOUTH SIGHT SCREEN</span>
        </div>

        {/* Player Dugout Left (Home Team) */}
        <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-blue-600/30 border border-blue-400/50 text-blue-300 text-[8px] font-black text-center shadow-lg backdrop-blur-sm z-20">
          <p className="text-[6px] uppercase text-blue-400 font-bold">HOME DUGOUT</p>
          {teamA}
        </div>

        {/* Player Dugout Right (Away Team) */}
        <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-red-600/30 border border-red-400/50 text-red-300 text-[8px] font-black text-center shadow-lg backdrop-blur-sm z-20">
          <p className="text-[6px] uppercase text-red-400 font-bold">AWAY DUGOUT</p>
          {teamB}
        </div>

        {/* Orientation Labels */}
        <div className="absolute inset-0 pointer-events-none p-1">
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-100 opacity-60">N</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-100 opacity-60">S</span>
          <span className="absolute left-1 top-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-100 opacity-60">W</span>
          <span className="absolute right-1 top-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-100 opacity-60">E</span>
          <span className="absolute top-[20%] left-[20%] text-[6px] font-bold text-emerald-100 opacity-40">NW</span>
          <span className="absolute top-[20%] right-[20%] text-[6px] font-bold text-emerald-100 opacity-40">NE</span>
          <span className="absolute bottom-[20%] left-[20%] text-[6px] font-bold text-emerald-100 opacity-40">SW</span>
          <span className="absolute bottom-[20%] right-[20%] text-[6px] font-bold text-emerald-100 opacity-40">SE</span>
        </div>

        {/* 22-Yard Central Pitch Strip */}
        <div className="w-12 h-28 sm:w-14 sm:h-36 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 rounded-md border-2 border-amber-600/90 shadow-2xl flex flex-col justify-between p-1.5 items-center relative z-10">
          
          {/* North Stumps & Bowling Crease */}
          <div className="w-full flex flex-col items-center space-y-0.5">
            <div className="w-8 h-0.5 bg-slate-950" />
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2 bg-amber-900 rounded-t" />
              <div className="w-0.5 h-2 bg-amber-900 rounded-t" />
              <div className="w-0.5 h-2 bg-amber-900 rounded-t" />
            </div>
          </div>

          {/* Center Pitch Text */}
          <div className="text-center my-auto">
            <span className="text-[7px] font-black text-slate-950 uppercase tracking-widest block rotate-90">
              22 YARD PITCH
            </span>
          </div>

          {/* South Stumps & Popping Crease */}
          <div className="w-full flex flex-col items-center space-y-0.5">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2 bg-amber-900 rounded-b" />
              <div className="w-0.5 h-2 bg-amber-900 rounded-b" />
              <div className="w-0.5 h-2 bg-amber-900 rounded-b" />
            </div>
            <div className="w-8 h-0.5 bg-slate-950" />
          </div>

        </div>

      </div>

      {/* Boundary Rope Marker Banner */}
      <div className="absolute bottom-2 px-3 py-0.5 rounded-full bg-slate-950/80 border border-emerald-400/40 text-[9px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1 shadow-md">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>72m Boundary Rope Field</span>
      </div>

    </div>
  );
}
