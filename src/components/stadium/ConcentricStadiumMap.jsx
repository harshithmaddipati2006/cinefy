import React, { useState, useRef, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Crown,
  Shield,
  Navigation,
  Info,
  Maximize2,
  CheckCircle,
  DoorOpen,
  MousePointer,
  Users,
  Camera,
  Layers,
  Compass,
  Check,
  X,
  Ticket,
  Ruler,
  MapPin
} from "lucide-react";
import {
  describeEllipticalArcSector,
  polarToElliptical,
  generateStadiumConfig,
  generateConcentricBlockSeats
} from "./StadiumGeometryEngine.js";
import { useStadiumRealtimeLocation } from "./useStadiumRealtimeLocation.js";

// Helper to create a straight-edged block (trapezoid) with radial gap for crisp aisles
const describeTrapezoidalBlock = (cx, cy, rStartInner, rStartOuter, rEndInner, rEndOuter, startAngle, endAngle, gap = 1.0) => {
  const effectiveStart = startAngle + gap;
  const effectiveEnd = endAngle - gap;
  const p1 = polarToElliptical(cx, cy, rStartInner, rStartOuter, effectiveStart);
  const p2 = polarToElliptical(cx, cy, rStartInner, rStartOuter, effectiveEnd);
  const p3 = polarToElliptical(cx, cy, rEndInner, rEndOuter, effectiveEnd);
  const p4 = polarToElliptical(cx, cy, rEndInner, rEndOuter, effectiveStart);

  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`;
};

// Helper to draw clean concentric horizontal row lines inside blocks
const describeConcentricRowArc = (cx, cy, radius, startAngle, endAngle, ellipseX = 1, ellipseY = 1, gap = 1.0) => {
  const effectiveStart = startAngle + gap;
  const effectiveEnd = endAngle - gap;
  const pStart = polarToElliptical(cx, cy, radius * ellipseX, radius * ellipseY, effectiveStart);
  const pEnd = polarToElliptical(cx, cy, radius * ellipseX, radius * ellipseY, effectiveEnd);
  const arcSweep = effectiveEnd - effectiveStart <= 180 ? "0" : "1";
  return `M ${pStart.x} ${pStart.y} A ${radius * ellipseX} ${radius * ellipseY} 0 ${arcSweep} 1 ${pEnd.x} ${pEnd.y}`;
};

// Backward-compatible describeBlock
const describeBlock = (cx, cy, rStartInner, rStartOuter, rEndInner, rEndOuter, startAngle, endAngle) => {
  return describeTrapezoidalBlock(cx, cy, rStartInner, rStartOuter, rEndInner, rEndOuter, startAngle, endAngle, 0.9);
};

export default function ConcentricStadiumMap({
  stadium,
  match,
  selectedBlock,
  onSelectBlock,
  onSelectStand,
  selectedSeats = [],
  onToggleSeat
}) {
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [showIndividualSeats, setShowIndividualSeats] = useState(true);
  const [showBoundaryMeters, setShowBoundaryMeters] = useState(true);
  const [showCanopies, setShowCanopies] = useState(true);
  const [tierFilter, setTierFilter] = useState("all"); // 'all' | 'lower' | 'upper' | 'vip'

  const {
    distanceFormatted,
    status: gpsStatus,
    refreshLocation,
    stadiumData
  } = useStadiumRealtimeLocation(stadium);

  const svgRef = useRef(null);

  // Generate procedural stadium config matching the uploaded Narendra Modi Stadium visual standard
  const numericCapacity = parseInt(String(stadium?.capacity || "100000").replace(/[^0-9]/g, "")) || 100000;
  const config = useMemo(() => {
    return generateStadiumConfig(stadium?.id || "amd-modi", numericCapacity);
  }, [stadium?.id, numericCapacity]);

  const {
    cx,
    cy,
    ellipseX = 1.0,
    ellipseY = 0.96,
    radii,
    innerBlocks = [],
    outerBlocks = [],
    southHospitality,
    gates = [],
    blocks = []
  } = config;

  // Generate procedural seats for all stadium blocks
  const allStadiumSeats = useMemo(() => {
    const seatsList = [];

    // 1. Lower Bowl seats
    innerBlocks.forEach((block) => {
      let rStart = radii.rInnerStart || 156;
      let rEnd = radii.rInnerEnd || 236;
      
      // Match stand rendering: North Corporate Box has empty space in front
      if (block.id === "blk-corp-n" || block.id === "amd-modi-corp") {
        rStart = rStart + (rEnd - rStart) * 0.65;
      }
      
      const bSeats = generateConcentricBlockSeats(block, cx, cy, ellipseX, ellipseY, rStart, rEnd);
      seatsList.push(...bSeats);
    });

    // 2. Upper Bowl seats
    outerBlocks.forEach((block) => {
      const rStart = radii.rOuterStart || 250;
      const rEnd = radii.rOuterEnd || 362;
      const bSeats = generateConcentricBlockSeats(block, cx, cy, ellipseX, ellipseY, rStart, rEnd);
      seatsList.push(...bSeats);
    });

    // 3. South Hospitality & Suites seats
    if (southHospitality?.hasGallery) {
      const stadId = config.id || stadium?.id || "stad";
      // Gallery seats
      if (southHospitality.gallery) {
        const gal = southHospitality.gallery;
        const galBlock = {
          id: `blk-${stadId}-pres-gallery`,
          name: gal.name || "PRESIDENT GALLERY",
          startAngle: southHospitality.startAngle,
          endAngle: southHospitality.endAngle,
          price: gal.price || 5500,
          gate: gal.gate || "GATE 1",
          isVip: true,
          tier: "hospitality",
          color: "#fce7f3"
        };
        const gSeats = generateConcentricBlockSeats(galBlock, cx, cy, ellipseX, ellipseY, gal.rStart || 248, gal.rEnd || 286);
        seatsList.push(...gSeats);
      }

      // Floor 4 Suites seats
      if (southHospitality.floor4) {
        const fl4 = southHospitality.floor4;
        const fl4Block = {
          id: `blk-${stadId}-suites-4`,
          name: fl4.name,
          startAngle: southHospitality.startAngle + 2,
          endAngle: southHospitality.endAngle - 2,
          price: fl4.price,
          gate: fl4.gate,
          isVip: true,
          tier: "hospitality",
          color: "#ffffff"
        };
        const s4Seats = generateConcentricBlockSeats(fl4Block, cx, cy, ellipseX, ellipseY, fl4.rStart, fl4.rEnd);
        seatsList.push(...s4Seats);
      }

      // Floor 5 Suites seats
      if (southHospitality.floor5) {
        const fl5 = southHospitality.floor5;
        const fl5Block = {
          id: `blk-${stadId}-suites-5`,
          name: fl5.name,
          startAngle: southHospitality.startAngle + 3,
          endAngle: southHospitality.endAngle - 3,
          price: fl5.price,
          gate: fl5.gate,
          isVip: true,
          tier: "hospitality",
          color: "#ffffff"
        };
        const s5Seats = generateConcentricBlockSeats(fl5Block, cx, cy, ellipseX, ellipseY, fl5.rStart, fl5.rEnd);
        seatsList.push(...s5Seats);
      }
    }

    return seatsList;
  }, [innerBlocks, outerBlocks, southHospitality, cx, cy, ellipseX, ellipseY, radii]);

  // Selected seat IDs set for fast O(1) lookup
  const selectedSeatIdsSet = useMemo(() => {
    return new Set(selectedSeats.map((s) => s.id || s.seatId));
  }, [selectedSeats]);

  // Zoom controls
  const handleZoomIn = () => setZoomScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 2.2));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.75));
  const handleResetZoom = () => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoomScale((prev) => Math.min(Math.max(Number((prev * factor).toFixed(2)), 0.75), 2.2));
  };

  // Drag Pan controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Quick Pick 2 Best Available Seats
  const handleQuickPickBestSeats = () => {
    if (!onToggleSeat) return;
    const availableLower = allStadiumSeats.filter(
      (s) => s.status === "available" && !selectedSeatIdsSet.has(s.id) && (s.tier === "lower" || s.tier === "premium")
    );
    if (availableLower.length >= 2) {
      onToggleSeat(availableLower[0]);
      onToggleSeat(availableLower[1]);
    }
  };

  // Boundary dimensions for the cricket field
  const boundaryDimensions = stadiumData?.boundaryDimensions || [
    { angle: 0, label: "Straight North", meters: 80, posLabel: "80m" },
    { angle: 45, label: "Deep Extra Cover", meters: 70, posLabel: "70m" },
    { angle: 90, label: "Deep Point", meters: 66, posLabel: "66m" },
    { angle: 135, label: "Deep Fine Leg", meters: 64, posLabel: "64m" },
    { angle: 180, label: "Straight South", meters: 80, posLabel: "80m" },
    { angle: 225, label: "Deep Backward Square", meters: 65, posLabel: "65m" },
    { angle: 270, label: "Deep Midwicket", meters: 72, posLabel: "72m" },
    { angle: 315, label: "Long Off", meters: 76, posLabel: "76m" }
  ];

  return (
    <div className="relative w-full bg-slate-950 rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-2xl flex flex-col items-center select-none overflow-hidden">
      
      {/* Top Map Controls & Stadium Header Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 z-20 mb-3">
        
        {/* Stadium Info Badge */}
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-white font-heading leading-tight flex flex-wrap items-center gap-2">
              <span>{stadium.name || config.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
                {stadium.capacity || "132,000"} Seats
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black border border-sky-500/30">
                Interactive Seating Map
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <span>{stadium.city || config.location}</span>
              <span>•</span>
              <span className="text-cyan-400 font-extrabold">Click any individual seat dot or stand to select</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Zoom Tools */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Real-Time Live User GPS Distance */}
          <button
            onClick={refreshLocation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              gpsStatus === "active" && distanceFormatted
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Real-time distance from your current GPS location to stadium (Click to refresh)"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${gpsStatus === "active" ? "animate-pulse" : ""}`} />
            <span>
              {gpsStatus === "active" && distanceFormatted
                ? `Live GPS: ${distanceFormatted}`
                : gpsStatus === "loading"
                ? "Locating distance..."
                : `${stadium.city || "Venue"} Arena`}
            </span>
            {gpsStatus === "active" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            )}
          </button>

          {/* Toggle Boundary Meters ON / OFF */}
          <button
            onClick={() => setShowBoundaryMeters((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showBoundaryMeters
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
            title="Toggle cricket ground boundary dimensions and meter measurements"
          >
            <Ruler className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Boundary Meters: <strong className={showBoundaryMeters ? "text-cyan-300 uppercase font-black" : "text-slate-400 font-black"}>{showBoundaryMeters ? "ON" : "OFF"}</strong>
            </span>
          </button>

          {/* Quick Best 2 Seats Pick */}
          <button
            onClick={handleQuickPickBestSeats}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Auto-select 2 best available seats in the lower bowl"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Best 2 Seats</span>
          </button>

          {/* Toggle Physical Seat Dots */}
          <button
            onClick={() => setShowIndividualSeats((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showIndividualSeats
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
            title="Toggle individual seat dots on stadium rings"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Seats: {showIndividualSeats ? "Visible" : "Hidden"}</span>
          </button>

          {/* Toggle Long-Span Steel Canopies */}
          {config?.hasCanopies && (
            <button
              onClick={() => setShowCanopies((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                showCanopies
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
              title="Toggle North & South Long-Span Steel Canopies (Uppal Stadium)"
            >
              <Shield className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span className="hidden sm:inline">Canopies: {showCanopies ? "Covered" : "Transparent"}</span>
              <span className="sm:hidden">Canopy</span>
            </button>
          )}

          {/* Jump to Stand Dropdown */}
          <select
            onChange={(e) => {
              const val = e.target.value;
              const found = blocks.find((b) => b.id === val);
              if (found && onSelectBlock) {
                onSelectBlock(found);
              }
            }}
            className="bg-slate-950 text-cyan-300 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">Select Stand / Block...</option>
            <optgroup label="Lower Bowl Stands">
              {innerBlocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (₹{b.price})
                </option>
              ))}
            </optgroup>
            <optgroup label="Upper Bowl Stands">
              {outerBlocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (₹{b.price})
                </option>
              ))}
            </optgroup>
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            <span className="text-[10px] font-black text-cyan-400 px-1.5">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-cyan-400 hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Seating Tier Legend & Seat Status Ribbon */}
      <div className="w-full bg-slate-900 rounded-xl px-4 py-2.5 border border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Tier Colors (Matching the reference uploaded map) */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-400 shadow-sm shrink-0" />
            <span className="font-bold text-white text-[11px]">Lower Stand Seats (White)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] border border-sky-400 shrink-0" />
            <span className="font-bold text-slate-200 text-[11px]">Upper Bowl</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#06b6d4] border border-cyan-400 shrink-0" />
            <span className="font-bold text-slate-200 text-[11px]">South Premium Stand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#db2777] border border-pink-400 shrink-0" />
            <span className="font-bold text-slate-200 text-[11px]">Corporate Box / VIP</span>
          </div>
        </div>

        {/* Seat Status Indicators */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40" />
            <span className="font-medium text-emerald-300">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="font-medium text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="font-medium text-slate-400">Booked</span>
          </div>
        </div>
      </div>

      {/* Selected Seats Quick Cart Strip (if any seats are selected) */}
      {selectedSeats.length > 0 && (
        <div className="w-full bg-emerald-950/70 border border-emerald-500/40 rounded-xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <div className="flex items-center gap-2 flex-wrap">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-200">
              {selectedSeats.length} {selectedSeats.length === 1 ? "Seat" : "Seats"} Selected:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedSeats.map((s) => (
                <span
                  key={s.id || s.seatId}
                  className="px-2 py-0.5 rounded-md bg-emerald-800/80 text-emerald-100 font-black text-[11px] border border-emerald-600 flex items-center gap-1"
                >
                  <span>{s.blockName?.replace("BLOCK ", "") || ""}-{s.row}{s.number} (₹{s.price})</span>
                  {onToggleSeat && (
                    <button
                      onClick={() => onToggleSeat(s)}
                      className="hover:text-rose-300 ml-0.5 cursor-pointer"
                      title="Remove Seat"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-black text-cyan-300 text-sm">
              Total: ₹{selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Main Interactive Concentric SVG Canvas with Rendered Seats */}
      <div
        className="relative w-full h-[580px] sm:h-[760px] bg-slate-100 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-300 flex items-center justify-center shadow-2xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
            transformOrigin: "center center"
          }}
        >
          {/* Define Patterns & Glows */}
          <defs>
            {/* Seating Density Row Pattern for Blocks in Architectural Overview */}
            <pattern id="row-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            
            {/* Field Turf Glow */}
            <radialGradient id="field-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>

            {/* Himalayan Mountain Sky Gradient */}
            <linearGradient id="himalayan-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.30" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ========================================================================= */}
          {/* 0. HIMALAYAN DHAULADHAR MOUNTAIN RANGE BACKDROP (HPCA DHARAMSHALA) */}
          {/* ========================================================================= */}
          {config?.hasDhauladharMountains && (
            <g id="himalayan-dhauladhar-backdrop" className="pointer-events-none">
              {/* Mountain Sky Atmospheric Gradient */}
              <rect x="0" y="0" width="1000" height="420" fill="url(#himalayan-sky)" />

              {/* Distant Snow Peaks (15,000+ ft Dhauladhar Summit Ridge) */}
              <polygon
                points="0,220 70,160 140,200 230,120 310,170 410,80 490,130 580,60 670,140 760,95 860,165 940,110 1000,180 1000,380 0,380"
                fill="#94a3b8"
                opacity="0.45"
              />

              {/* Mid-Ground Majestic Granite Rock Faces & Glistening Glacial Ridges */}
              <polygon
                points="0,260 90,190 170,230 270,130 360,200 460,90 530,160 620,70 710,150 820,110 910,180 1000,150 1000,420 0,420"
                fill="#334155"
                opacity="0.85"
              />

              {/* Brilliant White Snowcaps on Dhauladhar Peaks */}
              {/* Peak 1: NW Moon Peak (x: 270, y: 130) */}
              <polygon points="270,130 240,175 255,185 270,165 285,185 300,170" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <polygon points="270,130 285,185 270,165" fill="#f1f5f9" opacity="0.9" />

              {/* Peak 2: Central Matterhorn Summit (x: 460, y: 90) */}
              <polygon points="460,90 420,145 440,155 460,135 480,160 500,140" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <polygon points="460,90 480,160 460,135" fill="#e2e8f0" opacity="0.9" />

              {/* Peak 3: Dhauladhar Great Ridge (x: 620, y: 70) */}
              <polygon points="620,70 575,130 595,140 620,120 645,145 665,125" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <polygon points="620,70 645,145 620,120" fill="#e2e8f0" opacity="0.9" />

              {/* Peak 4: NE Indrahar Pass Snow Peak (x: 820, y: 110) */}
              <polygon points="820,110 780,155 800,165 820,145 840,170 860,150" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />

              {/* Sub-Alpine Deodar Cedar & Pine Forest Ridges at Foothills */}
              <polygon
                points="0,320 80,280 160,305 250,265 340,295 440,250 540,285 650,240 750,280 850,255 940,290 1000,270 1000,440 0,440"
                fill="#14532d"
                opacity="0.8"
              />

              {/* Individual Pine Tree Silhouettes around perimeter */}
              {[40, 110, 180, 260, 330, 410, 490, 570, 650, 730, 810, 890, 960].map((xPos, idx) => (
                <g key={`pine-${idx}`} transform={`translate(${xPos}, ${270 + (idx % 3) * 15})`}>
                  <polygon points="0,-18 -7,0 7,0" fill="#166534" />
                  <polygon points="0,-12 -9,6 9,6" fill="#15803d" />
                  <polygon points="0,-6 -11,12 11,12" fill="#14532d" />
                  <rect x="-1.5" y="12" width="3" height="6" fill="#78350f" />
                </g>
              ))}

              {/* Dhauladhar Range Identification Badge */}
              <g transform="translate(500, 32)">
                <rect x="-165" y="-12" width="330" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" opacity="0.95" />
                <text x="0" y="4" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.6">
                  DHAULADHAR RANGE • 15,000+ FT SNOW PEAKS (1,457M ASL)
                </text>
              </g>
            </g>
          )}

          {/* Outer Stadium Concourse / Footprint */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={410 * ellipseX}
            ry={410 * ellipseY}
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Subtle Outer Stadium Seating Bowl Shadow */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={396 * ellipseX}
            ry={396 * ellipseY}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* ========================================================================= */}
          {/* 1. OUTER TIER (UPPER BOWL - PASTEL SKY BLUE #c6e9fa) */}
          {/* ========================================================================= */}
          <g id="stadium-outer-tier">
            {outerBlocks.map((block) => {
              const rStart = radii.rOuterStart || 250;
              const rEnd = radii.rOuterEnd || 362;

              const pathD = describeBlock(
                cx, cy,
                rStart * ellipseX, rStart * ellipseY,
                rEnd * ellipseX, rEnd * ellipseY,
                block.startAngle, block.endAngle
              );

              const isHovered = hoveredBlock && hoveredBlock.id === block.id;
              const isSelected = selectedBlock && selectedBlock.id === block.id;

              const midAngle = (block.startAngle + block.endAngle) / 2;
              const labelRadius = rStart + (rEnd - rStart) * 0.58;
              const textPos = polarToElliptical(cx, cy, labelRadius * ellipseX, labelRadius * ellipseY, midAngle);

              return (
                <g key={block.id} className="group">
                  {/* Block Arc Sector Fill Background */}
                  <path
                    d={pathD}
                    fill={block.color || "#c6e9fa"}
                    stroke={isSelected ? "#0284c7" : isHovered ? "#38bdf8" : "#ffffff"}
                    strokeWidth={isSelected ? "3.5" : isHovered ? "2.5" : "2"}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-100"
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      if (onSelectBlock) onSelectBlock(block);
                    }}
                  />

                  {/* Visual Concentric Horizontal Row Lines for Architectural Blueprint */}
                  {(() => {
                    const rowLines = [];
                    const numRowArcs = 5;
                    for (let r = 1; r < numRowArcs; r++) {
                      const rRow = rStart + (rEnd - rStart) * (r / numRowArcs);
                      const arcPath = describeConcentricRowArc(cx, cy, rRow, block.startAngle, block.endAngle, ellipseX, ellipseY, 1.2);
                      rowLines.push(
                        <path
                          key={`outer-row-${r}`}
                          d={arcPath}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="0.9"
                          strokeDasharray="3 2"
                          opacity="0.75"
                          pointerEvents="none"
                        />
                      );
                    }
                    return rowLines;
                  })()}

                  {/* Radial Bay Divider Lines inside the block */}
                  {block.bays && block.bays.length > 1 && block.bays.map((bayNum, idx) => {
                    if (idx === 0) return null;
                    const bayAngle = block.startAngle + ((block.endAngle - block.startAngle) / block.bays.length) * idx;
                    const p1 = polarToElliptical(cx, cy, rStart * ellipseX, rStart * ellipseY, bayAngle);
                    const p2 = polarToElliptical(cx, cy, rEnd * ellipseX, rEnd * ellipseY, bayAngle);
                    return (
                      <line
                        key={idx}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        pointerEvents="none"
                      />
                    );
                  })}

                  {/* Bay Number Labels along the inner edge of Upper Bowl */}
                  {block.bays && block.bays.map((bayNum, idx) => {
                    const bayAngle = block.startAngle + ((block.endAngle - block.startAngle) / block.bays.length) * (idx + 0.5);
                    const p = polarToElliptical(cx, cy, (rStart + 12) * ellipseX, (rStart + 12) * ellipseY, bayAngle);
                    return (
                      <text
                        key={idx}
                        x={p.x}
                        y={p.y + 3}
                        textAnchor="middle"
                        fill="#0369a1"
                        fontSize="8.5"
                        fontWeight="900"
                        fontFamily="sans-serif"
                        pointerEvents="none"
                      >
                        {bayNum}
                      </text>
                    );
                  })}

                  {/* Block Title Text Label (e.g., BLOCK M, BLOCK N) */}
                  {(() => {
                    const isDark = block.color === "#1e40af" || block.color === "#1d4ed8" || block.color === "#2563eb";
                    return (
                      <text
                        x={textPos.x}
                        y={textPos.y + 4}
                        textAnchor="middle"
                        fill={isDark ? "#ffffff" : "#0f172a"}
                        fontSize={block.name.length > 18 ? "9.5" : "13.5"}
                        fontWeight="900"
                        fontFamily="sans-serif"
                        letterSpacing="0.8"
                        opacity={showIndividualSeats ? "0.85" : "1"}
                        className="pointer-events-none drop-shadow-sm"
                      >
                        {block.name}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 1.5 CONCRETE GALLERY PROMENADE & INTERMEDIATE VOMITORY STAIRS */}
          {/* ========================================================================= */}
          <g id="stadium-concrete-promenade" className="pointer-events-none">
            {/* Intermediate Concourse Slab */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={242 * ellipseX}
              ry={242 * ellipseY}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="12"
              opacity="0.8"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={248 * ellipseX}
              ry={248 * ellipseY}
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={236 * ellipseX}
              ry={236 * ellipseY}
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Radial vomitory access stairways across 14 blocks */}
            {Array.from({ length: 14 }).map((_, idx) => {
              const stairAngle = (360 / 14) * idx;
              const p1 = polarToElliptical(cx, cy, 235 * ellipseX, 235 * ellipseY, stairAngle);
              const p2 = polarToElliptical(cx, cy, 249 * ellipseX, 249 * ellipseY, stairAngle);
              return (
                <line
                  key={`vomitory-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#cbd5e1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 2. SOUTH PAVILION HOSPITALITY TIERS */}
          {/* ========================================================================= */}
          {southHospitality && southHospitality.hasGallery && (
            <g id="south-hospitality-tiers">
              
              {/* Tier 1: President Gallery (with Pink Bay Tags like original map) */}
              {(() => {
                const gal = southHospitality.gallery;
                const pathD = describeBlock(
                  cx, cy,
                  gal.rStart * ellipseX, gal.rStart * ellipseY,
                  gal.rEnd * ellipseX, gal.rEnd * ellipseY,
                  southHospitality.startAngle + 1, southHospitality.endAngle - 1
                );
                const isHovered = hoveredBlock && hoveredBlock.id === "blk-pres-gallery";
                const isSelected = selectedBlock && selectedBlock.id === "blk-pres-gallery";
                const labelPos = polarToElliptical(cx, cy, (gal.rEnd + 12) * ellipseX, (gal.rEnd + 12) * ellipseY, 180);

                return (
                  <g
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBlock({ id: "blk-pres-gallery", name: "PRESIDENT GALLERY", price: gal.price, gate: gal.gate, tier: "hospitality", color: "#fce7f3" })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      const blk = { id: "blk-pres-gallery", name: "PRESIDENT GALLERY", price: gal.price, gate: gal.gate, isVip: true, category: "Corporate Suite", color: "#fce7f3" };
                      if (onSelectBlock) onSelectBlock(blk);
                    }}
                  >
                    <path
                      d={pathD}
                      fill="#ffffff"
                      stroke={isSelected ? "#e11d48" : isHovered ? "#f43f5e" : "#cbd5e1"}
                      strokeWidth={isSelected ? "3" : isHovered ? "2" : "1"}
                    />

                    {/* Row lines for hospitality */}
                    <path d={pathD} fill="url(#row-pattern)" style={{ color: "#fce7f3" }} opacity="0.4" pointerEvents="none" />

                    {/* Gallery Bay Boxes in Pink / Slate tags */}
                    {gal.bays.map((bay, idx) => {
                      const bayStartAngle = southHospitality.startAngle + ((southHospitality.endAngle - southHospitality.startAngle) / gal.bays.length) * idx;
                      const bayEndAngle = southHospitality.startAngle + ((southHospitality.endAngle - southHospitality.startAngle) / gal.bays.length) * (idx + 1);
                      const bayPath = describeBlock(
                        cx, cy,
                        (gal.rStart + 2) * ellipseX, (gal.rStart + 2) * ellipseY,
                        (gal.rEnd - 2) * ellipseX, (gal.rEnd - 2) * ellipseY,
                        bayStartAngle + 0.5, bayEndAngle - 0.5
                      );
                      const midBay = (bayStartAngle + bayEndAngle) / 2;
                      const p = polarToElliptical(cx, cy, ((gal.rStart + gal.rEnd) / 2) * ellipseX, ((gal.rStart + gal.rEnd) / 2) * ellipseY, midBay);

                      return (
                        <g key={bay.id}>
                          <path d={bayPath} fill={bay.bg} stroke="#ffffff" strokeWidth="0.8" />
                          <text
                            x={p.x}
                            y={p.y + 2.5}
                            textAnchor="middle"
                            fill={bay.text}
                            fontSize="6.5"
                            fontWeight="800"
                            fontFamily="sans-serif"
                          >
                            {bay.label}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="10.5"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      letterSpacing="0.5"
                    >
                      {gal.name}
                    </text>
                  </g>
                );
              })()}

              {/* Tier 2: Presidential Suites 4th Floor */}
              {(() => {
                const fl4 = southHospitality.floor4;
                const pathD = describeBlock(
                  cx, cy,
                  fl4.rStart * ellipseX, fl4.rStart * ellipseY,
                  fl4.rEnd * ellipseX, fl4.rEnd * ellipseY,
                  southHospitality.startAngle + 2, southHospitality.endAngle - 2
                );
                const isHovered = hoveredBlock && hoveredBlock.id === "blk-suites-4";
                const labelPos = polarToElliptical(cx, cy, (fl4.rEnd + 10) * ellipseX, (fl4.rEnd + 10) * ellipseY, 180);

                return (
                  <g
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBlock({ id: "blk-suites-4", name: fl4.name, price: fl4.price, gate: fl4.gate, tier: "hospitality", color: "#ffffff" })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      const blk = { id: "blk-suites-4", name: fl4.name, price: fl4.price, gate: fl4.gate, isVip: true, category: "Corporate Suite", color: "#ffffff" };
                      if (onSelectBlock) onSelectBlock(blk);
                    }}
                  >
                    <path
                      d={pathD}
                      fill="#ffffff"
                      stroke={isHovered ? "#38bdf8" : "#cbd5e1"}
                      strokeWidth="1.2"
                    />

                    {/* Row lines for suites */}
                    <path d={pathD} fill="url(#row-pattern)" style={{ color: "#cbd5e1" }} opacity="0.3" pointerEvents="none" />

                    {/* Suite Slots */}
                    {Array.from({ length: fl4.suitesCount }).map((_, idx) => {
                      const angleStep = (southHospitality.endAngle - southHospitality.startAngle) / fl4.suitesCount;
                      const sAngle = southHospitality.startAngle + angleStep * (idx + 0.5);
                      const p = polarToElliptical(cx, cy, ((fl4.rStart + fl4.rEnd) / 2) * ellipseX, ((fl4.rStart + fl4.rEnd) / 2) * ellipseY, sAngle);
                      const suiteNum = 401 + idx;
                      const isVipHighlight = idx === 0 || idx === fl4.suitesCount - 1 || idx === Math.floor(fl4.suitesCount / 2);

                      return (
                        <g key={idx}>
                          {isVipHighlight && (
                            <rect
                              x={p.x - 7}
                              y={p.y - 5}
                              width="14"
                              height="10"
                              rx="2"
                              fill={idx % 2 === 0 ? "#1e293b" : "#334155"}
                              stroke="#64748b"
                              strokeWidth="0.6"
                            />
                          )}
                          <text
                            x={p.x}
                            y={p.y + 2.5}
                            textAnchor="middle"
                            fill={isVipHighlight ? "#ffffff" : "#334155"}
                            fontSize="5.5"
                            fontWeight="700"
                          >
                            {suiteNum}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="9.5"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      letterSpacing="0.5"
                    >
                      {fl4.name}
                    </text>
                  </g>
                );
              })()}

              {/* Tier 3: Premium Suites 5th Floor */}
              {(() => {
                const fl5 = southHospitality.floor5;
                const pathD = describeBlock(
                  cx, cy,
                  fl5.rStart * ellipseX, fl5.rStart * ellipseY,
                  fl5.rEnd * ellipseX, fl5.rEnd * ellipseY,
                  southHospitality.startAngle + 3, southHospitality.endAngle - 3
                );
                const isHovered = hoveredBlock && hoveredBlock.id === "blk-suites-5";
                const labelPos = polarToElliptical(cx, cy, (fl5.rEnd + 10) * ellipseX, (fl5.rEnd + 10) * ellipseY, 180);

                return (
                  <g
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBlock({ id: "blk-suites-5", name: fl5.name, price: fl5.price, gate: fl5.gate, tier: "hospitality", color: "#ffffff" })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      const blk = { id: "blk-suites-5", name: fl5.name, price: fl5.price, gate: fl5.gate, isVip: true, category: "Corporate Suite", color: "#ffffff" };
                      if (onSelectBlock) onSelectBlock(blk);
                    }}
                  >
                    <path
                      d={pathD}
                      fill="#ffffff"
                      stroke={isHovered ? "#38bdf8" : "#cbd5e1"}
                      strokeWidth="1.2"
                    />

                    {/* Row lines for suites */}
                    <path d={pathD} fill="url(#row-pattern)" style={{ color: "#cbd5e1" }} opacity="0.3" pointerEvents="none" />

                    {/* Suite Slots */}
                    {Array.from({ length: fl5.suitesCount }).map((_, idx) => {
                      const angleStep = (southHospitality.endAngle - southHospitality.startAngle + 4) / fl5.suitesCount;
                      const sAngle = (southHospitality.startAngle - 2) + angleStep * (idx + 0.5);
                      const p = polarToElliptical(cx, cy, ((fl5.rStart + fl5.rEnd) / 2) * ellipseX, ((fl5.rStart + fl5.rEnd) / 2) * ellipseY, sAngle);
                      const suiteNum = 501 + idx;

                      return (
                        <text
                          key={idx}
                          x={p.x}
                          y={p.y + 2.5}
                          textAnchor="middle"
                          fill="#334155"
                          fontSize="5.5"
                          fontWeight="700"
                        >
                          {suiteNum}
                        </text>
                      );
                    })}

                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="9.5"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      letterSpacing="0.5"
                    >
                      {fl5.name}
                    </text>
                  </g>
                );
              })()}

            </g>
          )}

          {/* ========================================================================= */}
          {/* 3. INNER TIER (LOWER BOWL - WARM PASTEL ORANGE / GOLD #fdbb68) */}
          {/* ========================================================================= */}
          <g id="stadium-inner-tier">
            {innerBlocks.map((block) => {
              const rStart = radii.rInnerStart || 156;
              const rEnd = radii.rInnerEnd || 236;

              let rStartBlock = rStart;
              let rEndBlock = rEnd;

              // Match exact reference: North Corporate Box is a thin outer strip with an empty space in front
              if (block.id === "blk-corp-n" || block.id === "amd-modi-corp") {
                rStartBlock = rStart + (rEnd - rStart) * 0.65;
              }

              const pathD = describeBlock(
                cx, cy,
                rStartBlock * ellipseX, rStartBlock * ellipseY,
                rEndBlock * ellipseX, rEndBlock * ellipseY,
                block.startAngle, block.endAngle
              );

              const isHovered = hoveredBlock && hoveredBlock.id === block.id;
              const isSelected = selectedBlock && selectedBlock.id === block.id;

              const midAngle = (block.startAngle + block.endAngle) / 2;
              const labelRadius = block.id === "blk-corp-n" || block.id === "amd-modi-corp"
                ? rStartBlock + (rEndBlock - rStartBlock) * 0.5
                : rStart + (rEnd - rStart) * 0.55;
              const textPos = polarToElliptical(cx, cy, labelRadius * ellipseX, labelRadius * ellipseY, midAngle);

              return (
                <g key={block.id} className="group">
                  {/* Block Arc Sector Fill Background */}
                  <path
                    d={pathD}
                    fill={block.color || "#1d4ed8"}
                    stroke={isSelected ? "#38bdf8" : isHovered ? "#60a5fa" : "#ffffff"}
                    strokeWidth={isSelected ? "3.5" : isHovered ? "2.5" : "1.8"}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-100"
                    onMouseEnter={() => setHoveredBlock(block)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      if (onSelectBlock) onSelectBlock(block);
                    }}
                  />

                  {/* Visual Concentric Horizontal Row Lines for Architectural Blueprint */}
                  {(() => {
                    const rowLines = [];
                    const numRowArcs = 4;
                    for (let r = 1; r < numRowArcs; r++) {
                      const rRow = rStartBlock + (rEndBlock - rStartBlock) * (r / numRowArcs);
                      const arcPath = describeConcentricRowArc(cx, cy, rRow, block.startAngle, block.endAngle, ellipseX, ellipseY, 1.2);
                      rowLines.push(
                        <path
                          key={`inner-row-${r}`}
                          d={arcPath}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="0.9"
                          strokeDasharray="3 2"
                          opacity="0.8"
                          pointerEvents="none"
                        />
                      );
                    }
                    return rowLines;
                  })()}

                  {/* Radial Bay Divider Lines inside the block */}
                  {block.bays && block.bays.length > 1 && block.bays.map((bayNum, idx) => {
                    if (idx === 0) return null;
                    const bayAngle = block.startAngle + ((block.endAngle - block.startAngle) / block.bays.length) * idx;
                    const p1 = polarToElliptical(cx, cy, rStartBlock * ellipseX, rStartBlock * ellipseY, bayAngle);
                    const p2 = polarToElliptical(cx, cy, rEndBlock * ellipseX, rEndBlock * ellipseY, bayAngle);
                    return (
                      <line
                        key={idx}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        pointerEvents="none"
                      />
                    );
                  })}

                  {/* Bay Number Labels along the outer edge of Lower Bowl */}
                  {block.bays && !block.name.includes("CORPORATE") && block.bays.map((bayNum, idx) => {
                    const bayAngle = block.startAngle + ((block.endAngle - block.startAngle) / block.bays.length) * (idx + 0.5);
                    const p = polarToElliptical(cx, cy, (rEndBlock - 11) * ellipseX, (rEndBlock - 11) * ellipseY, bayAngle);
                    return (
                      <text
                        key={idx}
                        x={p.x}
                        y={p.y + 3}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="900"
                        fontFamily="sans-serif"
                        pointerEvents="none"
                      >
                        {bayNum}
                      </text>
                    );
                  })}

                  {/* Block Name Title Label */}
                  {block.id === "blk-corp-n" || block.id.includes("-corp") ? (
                    <text
                      x={textPos.x}
                      y={textPos.y + 2}
                      textAnchor="middle"
                      fill="#be123c"
                      fontSize="5.5"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      letterSpacing="0.3"
                      className="pointer-events-none"
                    >
                      NORTH CORPORATE BOX
                    </text>
                  ) : block.name.includes("PREMIUM") || block.name.includes("PAVILION") ? (
                    <g transform={`translate(${textPos.x}, ${textPos.y - 1})`} className="pointer-events-none">
                      <text x="0" y="-2" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">SOUTH</text>
                      <text x="0" y="6" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">{block.name.replace("SOUTH ", "")}</text>
                    </g>
                  ) : (
                    (() => {
                      const isDark = block.color === "#1e40af" || block.color === "#1d4ed8" || block.color === "#2563eb";
                      return (
                        <text
                          x={textPos.x}
                          y={textPos.y + 4}
                          textAnchor="middle"
                          fill={isDark ? "#ffffff" : "#0f172a"}
                          fontSize={block.name.length > 18 ? "9.5" : "12.5"}
                          fontWeight="900"
                          fontFamily="sans-serif"
                          letterSpacing="0.6"
                          opacity={showIndividualSeats ? "0.85" : "1"}
                          className="pointer-events-none drop-shadow-sm"
                        >
                          {block.name}
                        </text>
                      );
                    })()
                  )}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 3.5 INDIVIDUAL PHYSICAL SEAT DOTS RENDERED IN CONCENTRIC RINGS */}
          {/* ========================================================================= */}
          {showIndividualSeats && (
            <g id="stadium-individual-seats" className="transition-opacity duration-200">
              {allStadiumSeats.map((seat) => {
                const isSelected = selectedSeatIdsSet.has(seat.id);
                const isHovered = hoveredSeat && hoveredSeat.id === seat.id;
                const isBooked = seat.status === "booked";
                const isBlocked = seat.status === "blocked";
                const isAvailable = seat.status === "available";

                // Seat appearance based on state and tier
                let seatFill = "#38bdf8"; // default upper cyan
                let seatStroke = "#0284c7";
                let seatSize = isSelected ? 3.5 : isHovered ? 4.0 : 1.4;

                if (isSelected) {
                  seatFill = "#10b981"; // Vibrant Emerald
                  seatStroke = "#ffffff";
                } else if (isBooked) {
                  seatFill = "#64748b";
                  seatStroke = "#475569";
                  seatSize = 1.2;
                } else if (isBlocked) {
                  seatFill = "#94a3b8";
                  seatStroke = "#64748b";
                  seatSize = 1.2;
                } else {
                  // Available seats styled by authentic Rajiv Gandhi Uppal Orange palette
                  if (seat.color) {
                    seatFill = seat.color;
                    seatStroke = "#ffffff";
                  } else if (seat.tier === "upper") {
                    // Upper Stand: Bright / Deep Orange
                    seatFill = "#f97316";
                    seatStroke = "#ffffff";
                  } else if (seat.tier === "premium") {
                    // VIP & Players Dugout: Deep Red-Orange
                    seatFill = "#c2410c";
                    seatStroke = "#ffffff";
                  } else if (seat.tier === "hospitality") {
                    // Corporate Suites: Deep slate
                    seatFill = "#334155";
                    seatStroke = "#e2e8f0";
                  } else {
                    // Lower tier stand seats: Predominantly Deep Orange
                    seatFill = "#ea580c";
                    seatStroke = "#ffffff";
                  }
                }

                return (
                  <g
                    key={seat.id}
                    className="cursor-pointer transition-all duration-75"
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isBooked) {
                        return;
                      }
                      if (onToggleSeat) {
                        onToggleSeat(seat);
                      }
                    }}
                  >
                    {/* Pulsing Selection Ring for Selected Seats */}
                    {isSelected && (
                      <circle
                        cx={seat.x}
                        cy={seat.y}
                        r="6.5"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Outer glow on hover */}
                    {isHovered && (
                      <circle
                        cx={seat.x}
                        cy={seat.y}
                        r="7"
                        fill="rgba(56, 189, 248, 0.4)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    )}

                    {/* The Physical Seat Rectangle */}
                    <rect
                      x={seat.x - seatSize / 2}
                      y={seat.y - seatSize / 2}
                      width={seatSize}
                      height={seatSize}
                      fill={seatFill}
                      stroke={seatStroke}
                      strokeWidth={isSelected ? "1.2" : isHovered ? "1.0" : "0.4"}
                      opacity={isBooked ? "0.35" : "0.95"}
                      transform={`rotate(${seat.angle}, ${seat.x}, ${seat.y})`}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4. CENTRAL CRICKET FIELD (NATURAL CRICKET-GROUND GREEN & REALISTIC TAN PITCH) */}
          {/* ========================================================================= */}
          <g id="central-cricket-field">
            
            {/* Outer Turf Grass Oval - Natural Deep Grass Green */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={radii.rField * ellipseX}
              ry={radii.rField * ellipseY}
              fill="#2e7d32"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Mown Lawn Turf Rings - Alternating Natural Green Outfield Bands */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={(radii.rField - 10) * ellipseX}
              ry={(radii.rField - 10) * ellipseY}
              fill="#348e42"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={(radii.rField - 24) * ellipseX}
              ry={(radii.rField - 24) * ellipseY}
              fill="#2e7d32"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={(radii.rField - 38) * ellipseX}
              ry={(radii.rField - 38) * ellipseY}
              fill="#389447"
            />

            {/* 30-Yard White Fielding Circle Outline */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={(radii.rField * 0.58) * ellipseX}
              ry={(radii.rField * 0.58) * ellipseY}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeDasharray="5 3"
              opacity="0.85"
            />

            {/* Natural Clay Pitch Square (Table) */}
            <rect
              x={cx - 18}
              y={cy - 46}
              width="36"
              height="92"
              fill="#c58f5e"
              stroke="#a47148"
              strokeWidth="1.2"
              rx="3"
            />

            {/* Compass Direction Labels (N, NE, E, SE, S, SW, W, NW) on the Grass Boundary */}
            {[
              { label: "N", angle: 0 },
              { label: "NE", angle: 45 },
              { label: "E", angle: 90 },
              { label: "SE", angle: 135 },
              { label: "S", angle: 180 },
              { label: "SW", angle: 225 },
              { label: "W", angle: 270 },
              { label: "NW", angle: 315 }
            ].map((dir) => {
              const pos = polarToElliptical(cx, cy, (radii.rField - 16) * ellipseX, (radii.rField - 16) * ellipseY, dir.angle);
              return (
                <text
                  key={dir.label}
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  {dir.label}
                </text>
              );
            })}

            {/* Boundary Distance Meters & Radial Dimension Markers (ON / OFF) */}
            {showBoundaryMeters && (
              <g id="ground-boundary-meters">
                {boundaryDimensions.map((dim, idx) => {
                  const innerR = radii.rField * 0.58;
                  const outerR = radii.rField - 4;
                  const startPt = polarToElliptical(cx, cy, innerR * ellipseX, innerR * ellipseY, dim.angle);
                  const endPt = polarToElliptical(cx, cy, outerR * ellipseX, outerR * ellipseY, dim.angle);
                  const labelPt = polarToElliptical(cx, cy, (radii.rField - 14) * ellipseX, (radii.rField - 14) * ellipseY, dim.angle);

                  return (
                    <g key={`boundary-dim-${idx}`} className="cursor-default select-none pointer-events-none">
                      {/* Dotted Radial Ray from 30-Yard Circle to Boundary */}
                      <line
                        x1={startPt.x}
                        y1={startPt.y}
                        x2={endPt.x}
                        y2={endPt.y}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity="0.4"
                      />

                      {/* Boundary Distance Metric Badge */}
                      <g transform={`translate(${labelPt.x}, ${labelPt.y})`}>
                        <rect
                          x="-14"
                          y="-7"
                          width="28"
                          height="14"
                          rx="4"
                          fill="#0f172a"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          className="drop-shadow-md"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="7.5"
                          fontWeight="900"
                          fontFamily="sans-serif"
                        >
                          {dim.posLabel || `${dim.meters}m`}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Central 22-Yard Cricket Pitch Strip (Authentic Clay Tan Beige, Creases & Stumps, STRICTLY NO LOGO) */}
            <g id="cricket-pitch-strip">
              <rect
                x={cx - 10}
                y={cy - 38}
                width="20"
                height="76"
                fill="#dfb15b"
                stroke="#b08968"
                strokeWidth="1.2"
                rx="2"
              />

              {/* Bowling Creases & Stumps North */}
              <line x1={cx - 8} y1={cy - 28} x2={cx + 8} y2={cy - 28} stroke="#ffffff" strokeWidth="1.4" />
              <circle cx={cx - 3.5} cy={cy - 31} r="1.3" fill="#5c4033" />
              <circle cx={cx} cy={cy - 31} r="1.3" fill="#5c4033" />
              <circle cx={cx + 3.5} cy={cy - 31} r="1.3" fill="#5c4033" />

              {/* Bowling Creases & Stumps South */}
              <line x1={cx - 8} y1={cy + 28} x2={cx + 8} y2={cy + 28} stroke="#ffffff" strokeWidth="1.4" />
              <circle cx={cx - 3.5} cy={cy + 31} r="1.3" fill="#5c4033" />
              <circle cx={cx} cy={cy + 31} r="1.3" fill="#5c4033" />
              <circle cx={cx + 3.5} cy={cy + 31} r="1.3" fill="#5c4033" />
            </g>

            {/* Super Sight Screens & Dugouts at SW and SE matching official layout */}
            <g id="super-sight-screens">
              {/* SW Super Sight Screen */}
              {(() => {
                const p = polarToElliptical(cx, cy, 142 * ellipseX, 142 * ellipseY, 222);
                return (
                  <g transform={`translate(${p.x}, ${p.y}) rotate(42)`} className="cursor-help">
                    <polygon
                      points="-26,-7 26,-7 22,7 -22,7"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                    <text x="0" y="-0.5" textAnchor="middle" fill="#ffffff" fontSize="4.2" fontWeight="900" letterSpacing="0.2">
                      SUPER
                    </text>
                    <text x="0" y="5" textAnchor="middle" fill="#94a3b8" fontSize="3.8" fontWeight="800">
                      SIGHT SCREEN
                    </text>
                  </g>
                );
              })()}

              {/* SE Super Sight Screen */}
              {(() => {
                const p = polarToElliptical(cx, cy, 142 * ellipseX, 142 * ellipseY, 138);
                return (
                  <g transform={`translate(${p.x}, ${p.y}) rotate(-42)`} className="cursor-help">
                    <polygon
                      points="-26,-7 26,-7 22,7 -22,7"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                    <text x="0" y="-0.5" textAnchor="middle" fill="#ffffff" fontSize="4.2" fontWeight="900" letterSpacing="0.2">
                      SUPER
                    </text>
                    <text x="0" y="5" textAnchor="middle" fill="#94a3b8" fontSize="3.8" fontWeight="800">
                      SIGHT SCREEN
                    </text>
                  </g>
                );
              })()}
            </g>

          </g>

          {/* ========================================================================= */}
          {/* 4.79 NARENDRA MODI STADIUM (MOTERA) AUTHENTIC Y-SHAPED SUPPORTS & PTFE CANOPY */}
          {/* ========================================================================= */}
          {(config?.hasModiCanopy || config?.id === "amd-modi") && (
            <g id="stadium-canopies-modi" className="pointer-events-none transition-opacity duration-300">
              {(() => {
                const baseROuterStart = radii?.rOuterStart || config?.rOuterStart || 250;
                const baseROuterEnd = radii?.rOuterEnd || config?.rOuterEnd || 366;
                const rInnerTensionRing = baseROuterStart - 6; // ~244
                const rOuterCompressionRing = baseROuterEnd + 6; // ~372
                const rYBase = rOuterCompressionRing + 14; // ~386

                // 1. PTFE Membrane Panels (48 radial bays)
                const bayCount = 48;
                const panels = [];
                const cables = [];

                for (let i = 0; i < bayCount; i++) {
                  const sA = (360 / bayCount) * i;
                  const eA = (360 / bayCount) * (i + 1);

                  const panelPath = describeBlock(
                    cx, cy,
                    rInnerTensionRing * ellipseX, rInnerTensionRing * ellipseY,
                    rOuterCompressionRing * ellipseX, rOuterCompressionRing * ellipseY,
                    sA, eA
                  );

                  const pIn = polarToElliptical(cx, cy, rInnerTensionRing * ellipseX, rInnerTensionRing * ellipseY, sA);
                  const pOut = polarToElliptical(cx, cy, rOuterCompressionRing * ellipseX, rOuterCompressionRing * ellipseY, sA);

                  panels.push(
                    <path
                      key={`modi-ptfe-${i}`}
                      d={panelPath}
                      fill={i % 2 === 0 ? "#ffffff" : "#f8fafc"}
                      fillOpacity={showCanopies ? "0.68" : "0.10"}
                      stroke="#e2e8f0"
                      strokeWidth="1.2"
                    />
                  );

                  // Radial Stay Cable
                  cables.push(
                    <line
                      key={`modi-cable-${i}`}
                      x1={pIn.x}
                      y1={pIn.y}
                      x2={pOut.x}
                      y2={pOut.y}
                      stroke="#94a3b8"
                      strokeWidth="1.4"
                      opacity={showCanopies ? "0.85" : "0.2"}
                    />
                  );
                }

                // 2. Y-Shaped Structural Supports (32 perimeter columns)
                // Bifurcated Y-frame: Base footing at rYBase, spreading into two support arms reaching rOuterCompressionRing
                const yColumnCount = 32;
                const yColumns = [];
                for (let i = 0; i < yColumnCount; i++) {
                  const colAngle = (360 / yColumnCount) * i;
                  const pFooting = polarToElliptical(cx, cy, rYBase * ellipseX, rYBase * ellipseY, colAngle);
                  const pStem = polarToElliptical(cx, cy, (rYBase - 6) * ellipseX, (rYBase - 6) * ellipseY, colAngle);
                  const pArmLeft = polarToElliptical(cx, cy, rOuterCompressionRing * ellipseX, rOuterCompressionRing * ellipseY, colAngle - 3.8);
                  const pArmRight = polarToElliptical(cx, cy, rOuterCompressionRing * ellipseX, rOuterCompressionRing * ellipseY, colAngle + 3.8);

                  yColumns.push(
                    <g key={`modi-y-col-${i}`}>
                      {/* Concrete Foundation Footing Pad */}
                      <circle cx={pFooting.x} cy={pFooting.y} r="3.2" fill="#334155" stroke="#ffffff" strokeWidth="0.8" />
                      {/* Main Vertical Column Stem */}
                      <line x1={pFooting.x} y1={pFooting.y} x2={pStem.x} y2={pStem.y} stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                      {/* Left Y-Arm to Outer Compression Ring */}
                      <line x1={pStem.x} y1={pStem.y} x2={pArmLeft.x} y2={pArmLeft.y} stroke="#64748b" strokeWidth="2.4" strokeLinecap="round" />
                      {/* Right Y-Arm to Outer Compression Ring */}
                      <line x1={pStem.x} y1={pStem.y} x2={pArmRight.x} y2={pArmRight.y} stroke="#64748b" strokeWidth="2.4" strokeLinecap="round" />
                      {/* Y-Junction Pin Node */}
                      <circle cx={pStem.x} cy={pStem.y} r="1.8" fill="#e2e8f0" stroke="#334155" strokeWidth="0.6" />
                      {/* Compression Ring Connection Nodes */}
                      <circle cx={pArmLeft.x} cy={pArmLeft.y} r="1.5" fill="#cbd5e1" />
                      <circle cx={pArmRight.x} cy={pArmRight.y} r="1.5" fill="#cbd5e1" />
                    </g>
                  );
                }

                // 3. 4 Mega Circulation Ramps at Primary Quadrants
                const rampAngles = [
                  { angle: 220, label: "RAMP 1 (SOUTH-WEST)", gate: "GATE 2" },
                  { angle: 295, label: "RAMP 2 (NORTH-WEST)", gate: "GATE 3" },
                  { angle: 65, label: "RAMP 3 (NORTH-EAST)", gate: "GATE 5" },
                  { angle: 135, label: "RAMP 4 (SOUTH-EAST)", gate: "GATE 6" }
                ];

                const ramps = rampAngles.map((ramp, idx) => {
                  const pRampCenter = polarToElliptical(cx, cy, 396 * ellipseX, 396 * ellipseY, ramp.angle);
                  return (
                    <g key={`modi-ramp-${idx}`} transform={`translate(${pRampCenter.x}, ${pRampCenter.y})`}>
                      {/* Helical Ramp Concrete Spiral Layers */}
                      <circle cx="0" cy="0" r="14" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.8" />
                      <circle cx="0" cy="0" r="9.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
                      <circle cx="0" cy="0" r="5" fill="#475569" stroke="#ffffff" strokeWidth="0.8" />
                      {/* Ramp Spiral Aisle Spokes */}
                      <line x1="0" y1="-14" x2="0" y2="14" stroke="#94a3b8" strokeWidth="0.9" strokeDasharray="2 2" />
                      <line x1="-14" y1="0" x2="14" y2="0" stroke="#94a3b8" strokeWidth="0.9" strokeDasharray="2 2" />
                    </g>
                  );
                });

                const badgePos = polarToElliptical(cx, cy, (rOuterCompressionRing + 18) * ellipseX, (rOuterCompressionRing + 18) * ellipseY, 0);

                return (
                  <g opacity={showCanopies ? "0.95" : "0.2"}>
                    {/* Outer Circumferential Heavy Steel Compression Ring Beam */}
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rOuterCompressionRing * ellipseX}
                      ry={rOuterCompressionRing * ellipseY}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="4"
                    />
                    {/* Inner Circumferential High-Tensile Steel Tension Ring Cable */}
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rInnerTensionRing * ellipseX}
                      ry={rInnerTensionRing * ellipseY}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    {/* Translucent PTFE Fabric Membrane Roof Panels */}
                    {panels}
                    {/* High-Tensile Radial Stay Cables */}
                    {cables}
                    {/* Iconic Perimeter Y-Shaped Support Columns */}
                    {yColumns}
                    {/* 4 Massive Pedestrian Circulation Ramps */}
                    {ramps}
                    {/* Narendra Modi Stadium Architectural Canopy Badge */}
                    <g transform={`translate(${badgePos.x}, ${badgePos.y - 12})`}>
                      <rect x="-135" y="-11" width="270" height="22" rx="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" opacity="0.95" />
                      <text x="0" y="4" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                        NARENDRA MODI STADIUM • PTFE TENSILE CANOPY & Y-FRAME
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4.8 RAJIV GANDHI / UPPAL DISTINCTIVE NORTH & SOUTH LONG-SPAN CANOPIES */}
          {/* ========================================================================= */}
          {config?.hasCanopies && (
            <g id="stadium-canopies-uppal" className="pointer-events-none transition-opacity duration-300">
              {/* North Canopy (Long-Span Cantilever Steel Truss over VVS Laxman End) */}
              {(() => {
                const nc = config.northCanopy || { startAngle: 330, endAngle: 30, rStart: 242, rEnd: 376 };
                const pathOuter = describeBlock(
                  cx, cy,
                  nc.rStart * ellipseX, nc.rStart * ellipseY,
                  nc.rEnd * ellipseX, nc.rEnd * ellipseY,
                  nc.startAngle, nc.endAngle
                );
                const labelPos = polarToElliptical(cx, cy, (nc.rEnd - 12) * ellipseX, (nc.rEnd - 12) * ellipseY, 0);

                // Steel truss cantilever ribs
                const ribCount = 14;
                const ribs = [];
                for (let i = 0; i <= ribCount; i++) {
                  const angle = nc.startAngle + ((nc.endAngle - nc.startAngle) / ribCount) * i;
                  const pInner = polarToElliptical(cx, cy, nc.rStart * ellipseX, nc.rStart * ellipseY, angle);
                  const pOuter = polarToElliptical(cx, cy, nc.rEnd * ellipseX, nc.rEnd * ellipseY, angle);
                  ribs.push(
                    <line
                      key={`north-rib-${i}`}
                      x1={pInner.x}
                      y1={pInner.y}
                      x2={pOuter.x}
                      y2={pOuter.y}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  );
                }

                return (
                  <g key="north-canopy-group" opacity={showCanopies ? "0.95" : "0.15"}>
                    {/* Canopy Translucent White Membrane */}
                    <path
                      d={pathOuter}
                      fill="#ffffff"
                      fillOpacity="0.75"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    {/* Cantilever Structural Steel Ribs */}
                    {ribs}
                    {/* Outer Ring Beam */}
                    <path
                      d={describeConcentricRowArc(cx, cy, nc.rEnd, nc.startAngle, nc.endAngle, ellipseX, ellipseY, 0)}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="3.5"
                    />
                    {/* Inner Fascia Arch */}
                    <path
                      d={describeConcentricRowArc(cx, cy, nc.rStart, nc.startAngle, nc.endAngle, ellipseX, ellipseY, 0)}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2.5"
                    />
                    {/* Canopy Identification Badge */}
                    <g transform={`translate(${labelPos.x}, ${labelPos.y - 6})`}>
                      <rect x="-90" y="-9" width="180" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" opacity="0.95" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                        NORTH PAVILION CANOPY (WHITE)
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* South Canopy (Long-Span Cantilever Steel Truss over Pavilion End) */}
              {(() => {
                const sc = config.southCanopy || { startAngle: 150, endAngle: 210, rStart: 242, rEnd: 376 };
                const pathOuter = describeBlock(
                  cx, cy,
                  sc.rStart * ellipseX, sc.rStart * ellipseY,
                  sc.rEnd * ellipseX, sc.rEnd * ellipseY,
                  sc.startAngle, sc.endAngle
                );
                const labelPos = polarToElliptical(cx, cy, (sc.rEnd - 12) * ellipseX, (sc.rEnd - 12) * ellipseY, 180);

                // Steel truss cantilever ribs
                const ribCount = 14;
                const ribs = [];
                for (let i = 0; i <= ribCount; i++) {
                  const angle = sc.startAngle + ((sc.endAngle - sc.startAngle) / ribCount) * i;
                  const pInner = polarToElliptical(cx, cy, sc.rStart * ellipseX, sc.rStart * ellipseY, angle);
                  const pOuter = polarToElliptical(cx, cy, sc.rEnd * ellipseX, sc.rEnd * ellipseY, angle);
                  ribs.push(
                    <line
                      key={`south-rib-${i}`}
                      x1={pInner.x}
                      y1={pInner.y}
                      x2={pOuter.x}
                      y2={pOuter.y}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  );
                }

                return (
                  <g key="south-canopy-group" opacity={showCanopies ? "0.95" : "0.15"}>
                    {/* Canopy Translucent White Membrane */}
                    <path
                      d={pathOuter}
                      fill="#ffffff"
                      fillOpacity="0.75"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    {/* Cantilever Structural Steel Ribs */}
                    {ribs}
                    {/* Outer Ring Beam */}
                    <path
                      d={describeConcentricRowArc(cx, cy, sc.rEnd, sc.startAngle, sc.endAngle, ellipseX, ellipseY, 0)}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="3.5"
                    />
                    {/* Inner Fascia Arch */}
                    <path
                      d={describeConcentricRowArc(cx, cy, sc.rStart, sc.startAngle, sc.endAngle, ellipseX, ellipseY, 0)}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2.5"
                    />
                    {/* Canopy Identification Badge */}
                    <g transform={`translate(${labelPos.x}, ${labelPos.y + 6})`}>
                      <rect x="-90" y="-9" width="180" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" opacity="0.95" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                        SOUTH PAVILION CANOPY (WHITE)
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4.84 ACA-VDCA VISAKHAPATNAM AUTHENTIC NORTH & SOUTH PAVILION ROOF CANOPIES */}
          {/* ========================================================================= */}
          {config?.hasVdcaCanopies && (
            <g id="stadium-canopies-vdca" className="pointer-events-none transition-opacity duration-300">
              {(() => {
                const baseROuterStart = radii?.rOuterStart || config?.rOuterStart || 250;
                const baseROuterEnd = radii?.rOuterEnd || config?.rOuterEnd || 362;
                const rStart = baseROuterStart - 6; // ~244
                const rEnd = baseROuterEnd + 14;    // ~376
                
                // Canopies covering North Pavilion (324° to 36°) and South Pavilion (148° to 212°)
                const canopies = [
                  { id: "north-vdca-roof", start: 324, end: 36, label: "DR. YSR NORTH PAVILION CANOPY", badgeAngle: 0 },
                  { id: "south-vdca-roof", start: 148, end: 212, label: "SOUTH MAIN PAVILION CANOPY", badgeAngle: 180 }
                ];

                return canopies.map((canopy) => {
                  const segCount = 10;
                  const span = canopy.end > canopy.start ? (canopy.end - canopy.start) : (360 - canopy.start + canopy.end);
                  const step = span / segCount;
                  const segs = [];
                  const pylons = [];

                  for (let i = 0; i < segCount; i++) {
                    const sA = (canopy.start + i * step) % 360;
                    const eA = (canopy.start + (i + 1) * step) % 360;
                    const segPath = describeBlock(
                      cx, cy,
                      rStart * ellipseX, rStart * ellipseY,
                      rEnd * ellipseX, rEnd * ellipseY,
                      sA, eA
                    );

                    const pIn = polarToElliptical(cx, cy, rStart * ellipseX, rStart * ellipseY, sA);
                    const pOut = polarToElliptical(cx, cy, rEnd * ellipseX, rEnd * ellipseY, sA);
                    const pCol = polarToElliptical(cx, cy, (rEnd - 2) * ellipseX, (rEnd - 2) * ellipseY, sA);

                    pylons.push(
                      <circle key={`vzg-pyl-${canopy.id}-${i}`} cx={pCol.x} cy={pCol.y} r="2.8" fill="#475569" stroke="#ffffff" strokeWidth="0.8" />
                    );

                    segs.push(
                      <g key={`vzg-seg-${canopy.id}-${i}`}>
                        <path
                          d={segPath}
                          fill={i % 2 === 0 ? "#f8fafc" : "#f1f5f9"}
                          fillOpacity={showCanopies ? "0.45" : "0.08"}
                          stroke="#cbd5e1"
                          strokeWidth="1.2"
                        />
                        <line
                          x1={pIn.x}
                          y1={pIn.y}
                          x2={pOut.x}
                          y2={pOut.y}
                          stroke="#94a3b8"
                          strokeWidth="1.6"
                          opacity={showCanopies ? "0.9" : "0.2"}
                        />
                      </g>
                    );
                  }

                  const badgePos = polarToElliptical(cx, cy, (rEnd + 14) * ellipseX, (rEnd + 14) * ellipseY, canopy.badgeAngle);

                  return (
                    <g key={canopy.id} opacity={showCanopies ? "0.95" : "0.2"}>
                      {segs}
                      {pylons}
                      <g transform={`translate(${badgePos.x}, ${badgePos.y + (canopy.badgeAngle === 0 ? -12 : 12)})`}>
                        <rect x="-90" y="-10" width="180" height="20" rx="5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.2" opacity="0.95" />
                        <text x="0" y="3.5" textAnchor="middle" fill="#f8fafc" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                          {canopy.label}
                        </text>
                      </g>
                    </g>
                  );
                });
              })()}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4.85 BRSABV EKANA DISTINCTIVE 360° WHITE / LIGHT-GREY SEGMENTED ROOF CANOPY */}
          {/* ========================================================================= */}
          {config?.hasEkanaCanopy && (
            <g id="stadium-canopies-ekana" className="pointer-events-none transition-opacity duration-300">
              {(() => {
                const baseROuterStart = radii?.rOuterStart || config?.rOuterStart || 250;
                const baseROuterEnd = radii?.rOuterEnd || config?.rOuterEnd || 362;
                const rStart = baseROuterStart - 8; // ~242
                const rEnd = baseROuterEnd + 16;   // ~378
                const segmentCount = 36;
                const segments = [];
                const columns = [];

                for (let i = 0; i < segmentCount; i++) {
                  const sAngle = (360 / segmentCount) * i;
                  const eAngle = (360 / segmentCount) * (i + 1);
                  const midAngle = (sAngle + eAngle) / 2;

                  const segPath = describeBlock(
                    cx, cy,
                    rStart * ellipseX, rStart * ellipseY,
                    rEnd * ellipseX, rEnd * ellipseY,
                    sAngle, eAngle
                  );

                  // Cantilever steel truss rib
                  const pInner = polarToElliptical(cx, cy, rStart * ellipseX, rStart * ellipseY, sAngle);
                  const pOuter = polarToElliptical(cx, cy, rEnd * ellipseX, rEnd * ellipseY, sAngle);
                  const pCol = polarToElliptical(cx, cy, (rEnd - 2) * ellipseX, (rEnd - 2) * ellipseY, sAngle);

                  columns.push(
                    <g key={`ekn-col-${i}`}>
                      <circle cx={pCol.x} cy={pCol.y} r="2.8" fill="#475569" stroke="#f8fafc" strokeWidth="0.8" />
                    </g>
                  );

                  segments.push(
                    <g key={`ekn-seg-${i}`}>
                      {/* Segment Membrane */}
                      <path
                        d={segPath}
                        fill={i % 2 === 0 ? "#f8fafc" : "#f1f5f9"}
                        fillOpacity={showCanopies ? "0.40" : "0.08"}
                        stroke="#cbd5e1"
                        strokeWidth="1.2"
                      />
                      {/* Steel Truss Cantilever Rib */}
                      <line
                        x1={pInner.x}
                        y1={pInner.y}
                        x2={pOuter.x}
                        y2={pOuter.y}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        opacity={showCanopies ? "0.85" : "0.2"}
                      />
                    </g>
                  );
                }

                const badgePos = polarToElliptical(cx, cy, (rEnd + 14) * ellipseX, (rEnd + 14) * ellipseY, 0);

                return (
                  <g opacity={showCanopies ? "0.95" : "0.2"}>
                    {/* Outer Circumferential Compression Ring Beam */}
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rEnd * ellipseX}
                      ry={rEnd * ellipseY}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="3.5"
                    />
                    {/* Inner Fascia Overhang Ring */}
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rStart * ellipseX}
                      ry={rStart * ellipseY}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    {/* Canopy Segments */}
                    {segments}
                    {/* Structural Support Columns */}
                    {columns}
                    {/* Canopy Architectural Badge */}
                    <g transform={`translate(${badgePos.x}, ${badgePos.y - 12})`}>
                      <rect x="-95" y="-10" width="190" height="20" rx="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" opacity="0.95" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                        EKANA 360° WHITE ROOF CANOPY
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4.86 HPCA DHARAMSHALA TIBETAN PAGODA SOUTH PAVILION (RED & WHITE ROOFS) */}
          {/* ========================================================================= */}
          {config?.hasPagodaPavilion && (
            <g id="stadium-hpca-pagoda-pavilion" className="pointer-events-none transition-opacity duration-300">
              {(() => {
                const pav = { startAngle: 144, endAngle: 216, rStart: 244, rEnd: 382 };
                const labelPos = polarToElliptical(cx, cy, (pav.rEnd + 14) * ellipseX, (pav.rEnd + 14) * ellipseY, 180);

                // Multi-tiered Kangra / Tibetan Pagoda Roofs with Red & White palette
                const tier1Path = describeBlock(
                  cx, cy,
                  pav.rStart * ellipseX, pav.rStart * ellipseY,
                  (pav.rStart + 42) * ellipseX, (pav.rStart + 42) * ellipseY,
                  pav.startAngle, pav.endAngle
                );

                const tier2Path = describeBlock(
                  cx, cy,
                  (pav.rStart + 46) * ellipseX, (pav.rStart + 46) * ellipseY,
                  (pav.rStart + 86) * ellipseX, (pav.rStart + 86) * ellipseY,
                  pav.startAngle + 3, pav.endAngle - 3
                );

                const tier3Path = describeBlock(
                  cx, cy,
                  (pav.rStart + 90) * ellipseX, (pav.rStart + 90) * ellipseY,
                  pav.rEnd * ellipseX, pav.rEnd * ellipseY,
                  pav.startAngle + 8, pav.endAngle - 8
                );

                // Central Elevated Pagoda Tower over President Box (angles 166° to 194°)
                const pagodaTowerPath = describeBlock(
                  cx, cy,
                  (pav.rStart + 94) * ellipseX, (pav.rStart + 94) * ellipseY,
                  (pav.rEnd + 18) * ellipseX, (pav.rEnd + 18) * ellipseY,
                  166, 194
                );

                // Flared pagoda rafters & decorative timber brackets
                const pagodaRibCount = 18;
                const pagodaRibs = [];
                for (let i = 0; i <= pagodaRibCount; i++) {
                  const angle = pav.startAngle + ((pav.endAngle - pav.startAngle) / pagodaRibCount) * i;
                  const pIn = polarToElliptical(cx, cy, pav.rStart * ellipseX, pav.rStart * ellipseY, angle);
                  const pOut = polarToElliptical(cx, cy, pav.rEnd * ellipseX, pav.rEnd * ellipseY, angle);
                  pagodaRibs.push(
                    <line
                      key={`pagoda-rib-${i}`}
                      x1={pIn.x}
                      y1={pIn.y}
                      x2={pOut.x}
                      y2={pOut.y}
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  );
                }

                return (
                  <g opacity={showCanopies ? "0.96" : "0.2"}>
                    {/* Kangra Slate Stone Base Masonry */}
                    <path
                      d={tier1Path}
                      fill="#b91c1c"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      fillOpacity="0.9"
                    />

                    {/* Tier 2 Pagoda Roof (Vibrant Red with White Trim) */}
                    <path
                      d={tier2Path}
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth="3"
                      fillOpacity="0.95"
                    />

                    {/* Tier 3 Upper Roof (Deep Scarlet & White Fascia) */}
                    <path
                      d={tier3Path}
                      fill="#991b1b"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      fillOpacity="0.95"
                    />

                    {/* Traditional Tibetan Flared Timber Rafters */}
                    {pagodaRibs}

                    {/* Central Presidential Pagoda Tower Roof */}
                    <path
                      d={pagodaTowerPath}
                      fill="#b91c1c"
                      stroke="#ffffff"
                      strokeWidth="3"
                      fillOpacity="0.95"
                    />

                    {/* Traditional Gold Kalasha / Finial on Pagoda Apex */}
                    {(() => {
                      const apexPos = polarToElliptical(cx, cy, (pav.rEnd + 22) * ellipseX, (pav.rEnd + 22) * ellipseY, 180);
                      return (
                        <g transform={`translate(${apexPos.x}, ${apexPos.y})`}>
                          <circle cx="0" cy="0" r="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
                          <polygon points="0,-8 -3,0 3,0" fill="#06b6d4" />
                        </g>
                      );
                    })()}

                    {/* Corner Pagoda Turrets at SW (214°) and SE (146°) */}
                    {[146, 214].map((turretAngle, tIdx) => {
                      const tPos = polarToElliptical(cx, cy, (pav.rEnd - 4) * ellipseX, (pav.rEnd - 4) * ellipseY, turretAngle);
                      return (
                        <g key={`turret-${tIdx}`} transform={`translate(${tPos.x}, ${tPos.y})`}>
                          <circle cx="0" cy="0" r="10" fill="#b91c1c" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="0" cy="0" r="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
                        </g>
                      );
                    })}

                    {/* HPCA Tibetan Pagoda Pavilion Badge */}
                    <g transform={`translate(${labelPos.x}, ${labelPos.y + 14})`}>
                      <rect x="-115" y="-10" width="230" height="20" rx="5" fill="#0f172a" stroke="#dc2626" strokeWidth="1.5" opacity="0.95" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
                        HPCA TIBETAN PAGODA PAVILION • RED & WHITE ROOFS
                      </text>
                    </g>
                  </g>
                );
              })()}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 4.9 CRICKET HIGH-MAST FLOODLIGHT TOWERS */}
          {/* ========================================================================= */}
          {(config?.floodlights || config?.hasFloodlights) && (
            <g id="stadium-floodlights" className="pointer-events-none">
              {(config.floodlights || [
                { id: "fl-1", name: "T1 (NE)", angle: 30, radius: 408 },
                { id: "fl-2", name: "T2 (E)", angle: 90, radius: 408 },
                { id: "fl-3", name: "T3 (SE)", angle: 150, radius: 408 },
                { id: "fl-4", name: "T4 (SW)", angle: 210, radius: 408 },
                { id: "fl-5", name: "T5 (W)", angle: 270, radius: 408 },
                { id: "fl-6", name: "T6 (NW)", angle: 330, radius: 408 }
              ]).map((fl) => {
                const towerPos = polarToElliptical(cx, cy, fl.radius * ellipseX, fl.radius * ellipseY, fl.angle);
                const fieldCenter = { x: cx, y: cy };
                // Calculate angle pointing towards center
                const dx = fieldCenter.x - towerPos.x;
                const dy = fieldCenter.y - towerPos.y;
                const rotDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

                return (
                  <g key={fl.id} transform={`translate(${towerPos.x}, ${towerPos.y})`}>
                    {/* Soft Radiant Light Cone onto Playing Field */}
                    <polygon
                      points="0,0 200,-50 200,50"
                      transform={`rotate(${rotDeg})`}
                      fill="url(#field-glow)"
                      opacity="0.25"
                    />

                    {/* Concrete / Steel Pylon Base Structure */}
                    <circle cx="0" cy="0" r="11" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.2" />

                    {/* High-Mast Cross Lattice Pylons */}
                    <line x1="-7" y1="-7" x2="7" y2="7" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="-7" y1="7" x2="7" y2="-7" stroke="#94a3b8" strokeWidth="1" />

                    {/* Floodlight Luminaire Bank (Rotated facing pitch) */}
                    <g transform={`rotate(${rotDeg})`}>
                      <rect x="2" y="-12" width="8" height="24" rx="2" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                      {/* 6 High-Power LED Projector Bulbs */}
                      {[-8, -4, 0, 4, 8].map((offset, bIdx) => (
                        <circle key={bIdx} cx="6" cy={offset} r="1.8" fill="#fef08a" stroke="#ffffff" strokeWidth="0.6" />
                      ))}
                    </g>

                    {/* Tower Identifier Label Badge */}
                    <rect x="-14" y="13" width="28" height="11" rx="3" fill="#0f172a" stroke="#e2e8f0" strokeWidth="0.8" />
                    <text x="0" y="21" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
                      LIGHT TOWER
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 5. PERIMETER ENTRANCE GATES */}
          {/* ========================================================================= */}
          <g id="stadium-gates">
            {gates.map((gate) => {
              const pos = polarToElliptical(cx, cy, gate.gateRadius * ellipseX, gate.gateRadius * ellipseY, gate.angle);
              return (
                <g key={gate.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  <rect
                    x="-26"
                    y="-9"
                    width="52"
                    height="18"
                    rx="6"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="drop-shadow-lg"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="7.5"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    {gate.name}
                  </text>
                </g>
              );
            })}
          </g>

        </svg>

        {/* Floating Tooltip for Hovered Individual Seat or Stand */}
        {hoveredSeat ? (
          <div className="absolute top-4 left-4 bg-slate-950/95 border border-emerald-400 p-3.5 rounded-2xl backdrop-blur-md shadow-2xl text-xs z-30 pointer-events-none animate-fadeIn min-w-[240px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black">
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {hoveredSeat.stadium || stadium.name || "ACA INTERNATIONAL CRICKET STADIUM"}
                  </h4>
                  <p className="text-xs font-black text-white">
                    {hoveredSeat.stand || hoveredSeat.blockName?.split(" ")[0] || "Stand"} • {hoveredSeat.level || (hoveredSeat.tier === "upper" ? "First Floor / Terrace" : hoveredSeat.tier === "premium" ? "VIP / Hospitality" : "Ground Floor")}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                selectedSeatIdsSet.has(hoveredSeat.id)
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : hoveredSeat.status === "booked"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
              }`}>
                {selectedSeatIdsSet.has(hoveredSeat.id) ? "Selected" : hoveredSeat.status === "booked" ? "Booked" : "Available"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Stand / Block:</span>{" "}
                <span className="font-bold text-white">{hoveredSeat.blockName || hoveredSeat.block || "Stand Block"}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Row / Seat:</span>{" "}
                <span className="font-mono font-black text-cyan-300">R{hoveredSeat.row} - S{hoveredSeat.number}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Level:</span>{" "}
                <span className="font-medium text-slate-200">{hoveredSeat.level || (hoveredSeat.tier === "upper" ? "First Floor / Terrace" : "Ground Floor")}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Gate:</span>{" "}
                <span className="font-bold text-cyan-400">{hoveredSeat.gate || "GATE 1"}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold">
                {hoveredSeat.status === "booked" ? "Disabled / Sold" : selectedSeatIdsSet.has(hoveredSeat.id) ? "Click to Deselect" : "Click dot to Select"}
              </span>
              <span className="text-sm font-black text-cyan-400">₹{hoveredSeat.price}</span>
            </div>
          </div>
        ) : hoveredBlock ? (
          <div className="absolute top-4 left-4 bg-slate-950/95 border border-cyan-400 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-2xl text-xs flex items-center gap-3 z-30 pointer-events-none animate-fadeIn">
            <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: hoveredBlock.color || "#fdbb68" }} />
            <div>
              <p className="font-black text-white text-sm">
                {hoveredBlock.name}
              </p>
              <p className="text-slate-400 text-[10px]">
                {hoveredBlock.level || (hoveredBlock.tier === "upper" ? "First Floor / Terrace" : hoveredBlock.tier === "hospitality" ? "Corporate Box" : "Ground Floor")} • Entrance: <strong className="text-cyan-400">{hoveredBlock.gate || "GATE 1"}</strong>
              </p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-sm font-black text-cyan-400">₹{hoveredBlock.price || 1800}</span>
            </div>
          </div>
        ) : null}

      </div>

      {/* Quick Access Legend & Fast Gate Guide */}
      <div className="w-full mt-3 bg-slate-900 rounded-2xl p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <DoorOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold text-cyan-300">Fast Stadium Access:</span>
          <span className="text-slate-400">
            Gates 1 & 2 (South & West), Gates 3 & 4 (North), Gates 5 & 6 (East)
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any seat dot to add to cart or click a stand to zoom into row view</span>
        </div>
      </div>

    </div>
  );
}
