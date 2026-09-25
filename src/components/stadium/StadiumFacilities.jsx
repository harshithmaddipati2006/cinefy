import React from "react";
import { Utensils, Coffee, Bath, HeartPulse, Car, ShieldCheck, Sparkles, Trophy } from "lucide-react";

export default function StadiumFacilities({ stadium }) {
  const facilities = [
    { name: "Gourmet F&B Food Courts", icon: Utensils, desc: "Samosas, Biryani, Cold Drinks, Domino's Pizza & Coffee counters", color: "text-cyan-400" },
    { name: "Clean AC Washrooms", icon: Bath, desc: "Available behind every stand block concourse level", color: "text-cyan-400" },
    { name: "Medical & First Aid", icon: HeartPulse, desc: "24x7 Paramedics & Ambulance at Gate 3 & Gate 8", color: "text-rose-400" },
    { name: "Multi-Level Car Parking", icon: Car, desc: `${stadium.name} Reserved Parking with valet at VIP Gate`, color: "text-emerald-400" },
    { name: "Player & VIP Pavilion", icon: Trophy, desc: "AC Glass Suites with 5-star catering and player dressing rooms", color: "text-purple-400" }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Stadium Concourse Facilities ({stadium.city})
        </span>
        <span className="text-[10px] text-slate-400 font-bold">Official {stadium.shortName} Infrastructure</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {facilities.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-1">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${f.color} shrink-0`} />
                <span className="text-xs font-bold text-white leading-tight">{f.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
