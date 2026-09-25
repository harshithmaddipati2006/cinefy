import React, { useState, useMemo, useRef } from "react";
import { 
  Accessibility, 
  Check, 
  Crown, 
  Heart, 
  Tv,
  DoorOpen,
  Footprints,
  Layers,
  Lock,
  Armchair,
  Compass,
  GripVertical,
  Minimize2,
  Maximize2,
  Bike,
  Sun,
  Moon,
  ArrowUpDown,
  Flame,
  Move,
  Plus,
  Minus,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEAT_CATEGORIES } from "../../data/seatingLayouts";

/**
 * MovieSeatSelection Component - Authentic BookMyShow Cinema Seating Visualizer
 * 
 * Features:
 * - Movable / Draggable Hall Radar Minimap
 * - Low-Price Seats strictly at the Screen Side
 * - Clean BookMyShow Tier Bars and Visual Design
 */
export default function MovieSeatSelection({
  seatMap = [],
  sections = [6, 6],
  maxSeats = 10,
  targetSeatCount = 2,
  onOpenSeatCountModal = null,
  onSelectionChange,
  screenName = "Main Screen",
  screenType = "4K Laser",
  soundType = "Dolby Atmos",
  isCurved = false,
  layoutBadge = "Auditorium",
  layoutSignature = "",
  auditoriumDimensions = null,
  walkwayBreaks = [],
  aisleLabels = ["Left Gangway", "Right Gangway"],
  emergencyExits = ["Left Exit", "Right Exit"],
  selectedSeats: externalSelectedSeats = null,
  onSeatClick: externalOnSeatClick = null,
  showFooter = true,
  showHeader = true,
  showScreen = true
}) {
  const [internalSelectedSeats, setInternalSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");
  const [themeMode, setThemeMode] = useState("light"); // "light" (BookMyShow standard) or "dark"
  const [screenPosition, setScreenPosition] = useState("top"); // "top" (Front Screen at Top) or "bottom"
  
  // Zoom Controls: range 0.40 (40% zoom out) to 1.30 (130% zoom in)
  const [zoomLevel, setZoomLevel] = useState(1);

  // Minimap state
  const [minimapMinimized, setMinimapMinimized] = useState(false);
  const [radarCorner, setRadarCorner] = useState("top-left"); // "top-left", "top-right", "bottom-right", "bottom-left"
  const canvasContainerRef = useRef(null);

  const selectedSeats = externalSelectedSeats || internalSelectedSeats;
  const selectedSeatIds = useMemo(() => new Set(selectedSeats.map(s => s.id)), [selectedSeats]);

  const isSeatDisabled = (seat) => {
    const s = String(seat.status || "").toLowerCase();
    return s === "booked" || s === "blocked" || s === "unavailable" || s === "locked";
  };

  const handleSeatClick = (seat) => {
    if (isSeatDisabled(seat)) return;

    if (externalOnSeatClick) {
      externalOnSeatClick(seat);
      return;
    }

    let newSelection;
    if (selectedSeatIds.has(seat.id)) {
      newSelection = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= maxSeats) return;
      newSelection = [...selectedSeats, seat];
    }

    setInternalSelectedSeats(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  /**
   * CRITICAL GUARANTEE:
   * The seats closest to the screen MUST ALWAYS be LOW PRICE (Row A / Gold / Regular)
   * and increase to HIGH PRICE (Premium -> Executive -> Recliner -> VIP) as distance increases.
   */
  const orderedDisplayRows = useMemo(() => {
    if (!seatMap || seatMap.length === 0) return [];
    
    const cloned = [...seatMap];

    if (screenPosition === "top") {
      // Screen is at TOP: Lowest price must be at TOP (index 0) adjacent to screen
      const firstPrice = Number(cloned[0]?.price || 0);
      const lastPrice = Number(cloned[cloned.length - 1]?.price || 0);
      if (firstPrice > lastPrice) {
        return cloned.reverse();
      }
      return cloned;
    } else {
      // Screen is at BOTTOM: Lowest price must be at BOTTOM (last index) adjacent to screen
      const firstPrice = Number(cloned[0]?.price || 0);
      const lastPrice = Number(cloned[cloned.length - 1]?.price || 0);
      if (firstPrice <= lastPrice) {
        return cloned.reverse();
      }
      return cloned;
    }
  }, [seatMap, screenPosition]);

  // Determine seat visual styling for BookMyShow Light vs Dark modes
  const getSeatVisuals = (seat, rowType) => {
    const isSelected = selectedSeatIds.has(seat.id);
    const rawStatus = String(seat.status || "").toUpperCase();
    const category = seat.category || seat.type || rowType || SEAT_CATEGORIES.REGULAR;
    const isLight = themeMode === "light";

    const isDimmed = activeCategoryFilter !== "ALL" && category !== activeCategoryFilter && !isSelected;

    if (isSelected) {
      return {
        className: "bg-[#10B981] border-[#059669] text-white font-black shadow-md z-20 scale-105 ring-2 ring-emerald-400",
        statusType: "SELECTED",
        category
      };
    }

    if (rawStatus === "LOCKED") {
      return {
        className: isLight 
          ? "bg-cyan-100 border-cyan-400 text-cyan-800 cursor-not-allowed animate-pulse shadow-sm"
          : "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(234,179,8,0.5)] cursor-not-allowed opacity-90 animate-pulse",
        statusType: "LOCKED",
        category
      };
    }

    if (rawStatus === "BOOKED" || rawStatus === "UNAVAILABLE") {
      return {
        className: isLight
          ? "bg-[#E5E7EB] border-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed opacity-90 font-medium"
          : "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-40 font-medium",
        statusType: "BOOKED",
        category
      };
    }

    if (rawStatus === "BLOCKED") {
      return {
        className: isLight
          ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
          : "bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed",
        statusType: "BLOCKED",
        category
      };
    }

    // Available Seat - Authentic BookMyShow crisp green outline on white
    let baseClass = "";
    if (isLight) {
      baseClass = "bg-white border-2 border-[#10B981] text-[#10B981] font-bold hover:bg-emerald-50 hover:border-emerald-600 hover:scale-105 shadow-xs";
      if (category === SEAT_CATEGORIES.RECLINER || category === "Royal Recliner" || category === "Recliner") {
        baseClass = "bg-white border-2 border-[#E11D48] text-[#E11D48] font-bold hover:bg-rose-50 hover:scale-105 shadow-xs";
      }
    } else {
      baseClass = "bg-slate-900 border-2 border-emerald-500 text-emerald-400 font-bold hover:bg-emerald-950/60 hover:scale-105 shadow-xs";
      if (category === SEAT_CATEGORIES.RECLINER || category === "Royal Recliner" || category === "Recliner") {
        baseClass = "bg-slate-900 border-2 border-rose-500 text-rose-400 font-bold hover:bg-rose-950/60 hover:scale-105 shadow-xs";
      }
    }

    if (isDimmed) {
      baseClass += " opacity-25 grayscale hover:grayscale-0 hover:opacity-100";
    }

    return {
      className: baseClass,
      statusType: "AVAILABLE",
      category
    };
  };

  const isLight = themeMode === "light";

  // Reusable 3D Cinema Screen Component
  const renderCinemaScreen = () => (
    <div className={`w-full max-w-2xl relative flex flex-col items-center ${
      screenPosition === "top" ? "mb-6 mt-1" : "mt-10 mb-2"
    }`}>
      {/* Emergency Exit Doors on Screen Side */}
      <div className="w-full flex items-center justify-between px-6 mb-2 text-[10px] font-bold">
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
          isLight ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs" : "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
        }`}>
          <DoorOpen className="w-3.5 h-3.5" />
          <span>{emergencyExits[0] || "EXIT A (STAGE LEFT)"}</span>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg border ${
          isLight ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs" : "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
        }`}>
          <DoorOpen className="w-3.5 h-3.5" />
          <span>{emergencyExits[1] || "EXIT B (STAGE RIGHT)"}</span>
        </div>
      </div>

      {/* 3D Perspective Glowing Trapezoidal Screen Bar */}
      <div className="w-72 sm:w-96 h-8 relative flex items-center justify-center">
        <div 
          className={`w-full h-full rounded-md border-2 shadow-2xl transform perspective-[500px] ${
            screenPosition === "top" ? "rotateX-[-25deg]" : "rotateX-[25deg]"
          } ${
            isLight
              ? "bg-gradient-to-b from-sky-200 via-sky-100 to-white border-sky-400 shadow-[0_12px_28px_rgba(250,204,21,0.35)]"
              : "bg-gradient-to-b from-cyan-400/30 via-sky-500/10 to-transparent border-cyan-400 shadow-[0_12px_32px_rgba(234,179,8,0.4)]"
          }`}
        />
      </div>

      {/* Direction & Price Rule Cue */}
      <div className="flex items-center gap-2 mt-2.5">
        <Tv className={`w-4 h-4 animate-pulse ${isLight ? "text-sky-600" : "text-cyan-400"}`} />
        <span className={`text-xs font-black tracking-widest uppercase font-mono ${
          isLight ? "text-slate-700" : "text-slate-200"
        }`}>
          SCREEN THIS WAY • LOW-PRICE SEATS AT SCREEN SIDE
        </span>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col gap-5 w-full max-w-6xl mx-auto p-3 sm:p-6 rounded-3xl border shadow-2xl transition-colors duration-300 relative ${
      isLight 
        ? "bg-[#F9FAFB] border-slate-200 text-slate-800" 
        : "bg-[#050811]/90 border-slate-800 text-slate-100 backdrop-blur-md"
    }`}>
      
      {/* 1. TOP BOOKMYSHOW CONTROL & STATUS BAR */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
        isLight ? "border-slate-200" : "border-slate-800"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${
            isLight 
              ? "bg-rose-50 border-rose-200 text-rose-600" 
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight">{layoutBadge}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-slate-900 border-slate-800 text-cyan-400"
              }`}>
                {sections.length} Seating Blocks
              </span>
            </div>
            {auditoriumDimensions && (
              <p className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {auditoriumDimensions.widthMeters}m Wide × {auditoriumDimensions.depthMeters}m Depth • Sound: {soundType}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls, Screen Orientation & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Zoom In (+) & Zoom Out (-) Controls (Zoom-out up to 40%) */}
          <div className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
            isLight ? "bg-white border-slate-200 text-slate-700" : "bg-slate-900 border-slate-700 text-slate-200"
          }`}>
            <span className="text-[10px] font-bold text-slate-400 mr-0.5 hidden sm:inline">Zoom:</span>
            
            {/* Zoom Out Button (-) */}
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              disabled={zoomLevel <= 0.4}
              className={`p-1 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-800 text-slate-200"
              }`}
              title="Zoom Out (-) up to 40%"
              aria-label="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Percentage Display */}
            <span className="min-w-[40px] text-center font-mono font-bold text-xs px-1 text-rose-500">
              {Math.round(zoomLevel * 100)}%
            </span>

            {/* Zoom In Button (+) */}
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(1.3, Number((prev + 0.1).toFixed(1))))}
              disabled={zoomLevel >= 1.3}
              className={`p-1 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-800 text-slate-200"
              }`}
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Reset Zoom to 100% */}
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer ml-0.5"
                title="Reset zoom to 100%"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Screen Orientation Toggle */}
          <button
            type="button"
            onClick={() => setScreenPosition(prev => prev === "top" ? "bottom" : "top")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
              isLight 
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" 
                : "bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800"
            }`}
            title="Toggle Screen at Front Top / Bottom (Prices always start low at screen)"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
            <span>Screen: {screenPosition === "top" ? "Front (Top)" : "Front (Bottom)"}</span>
          </button>

          {/* Theme Toggle: BMS White / Dark Cinema */}
          <button
            type="button"
            onClick={() => setThemeMode(isLight ? "dark" : "light")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
              isLight 
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" 
                : "bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800"
            }`}
            title="Toggle BookMyShow Canvas Mode"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-slate-600" /> : <Sun className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isLight ? "Dark Cinema" : "BMS Light"}</span>
          </button>

          {/* Target Seat Count Selector */}
          {onOpenSeatCountModal && (
            <button
              type="button"
              onClick={onOpenSeatCountModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-black hover:opacity-95 transition shadow-sm cursor-pointer"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>{targetSeatCount} {targetSeatCount === 1 ? "Seat Target" : "Seats Target"}</span>
              <span className="text-[10px] text-cyan-200 underline ml-0.5">Edit</span>
            </button>
          )}

        </div>
      </div>

      {/* BookMyShow Live Demand Banner */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl border text-xs ${
        isLight 
          ? "bg-rose-50/60 border-rose-200/80 text-slate-700" 
          : "bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-cyan-950/30 border-rose-500/20 text-slate-200"
      }`}>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="font-bold">
            High Demand: <span className="font-black text-rose-600 dark:text-rose-400">14 people viewing this show</span> • Live seat booking in progress
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Realtime BMS Sync</span>
        </div>
      </div>

      {/* BookMyShow Legend Bar */}
      <div className={`flex flex-wrap items-center justify-center gap-5 text-xs font-semibold p-2.5 rounded-2xl border ${
        isLight ? "bg-white border-slate-200 text-slate-600 shadow-xs" : "bg-slate-900/60 border-slate-800 text-slate-300"
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-white border-2 border-[#10B981]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-[#10B981] flex items-center justify-center shadow-xs">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
          <span className="font-bold text-[#10B981]">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-cyan-100 border border-cyan-400 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-cyan-600" />
          </div>
          <span>Temporarily Locked (10m)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-[#E5E7EB] border border-[#D1D5DB]" />
          <span className="text-slate-400">Sold / Occupied</span>
        </div>
      </div>

      {/* 2. MAIN AUDITORIUM SEATING CANVAS & MOVABLE HALL RADAR */}
      <div 
        ref={canvasContainerRef}
        className={`relative overflow-x-auto p-4 sm:p-6 rounded-3xl border min-h-[480px] ${
          isLight 
            ? "bg-white border-slate-200 shadow-inner" 
            : "bg-slate-950/80 border-slate-900 shadow-2xl"
        }`}
      >
        
        {/* MOVABLE DRAGGABLE BOOKMYSHOW HALL RADAR MINIMAP */}
        <motion.div
          drag
          dragConstraints={canvasContainerRef}
          dragMomentum={false}
          dragElastic={0.05}
          whileDrag={{ scale: 1.04, cursor: "grabbing" }}
          className={`absolute top-4 left-4 z-40 cursor-grab select-none transition-shadow rounded-2xl border shadow-2xl backdrop-blur-md ${
            isLight 
              ? "bg-white/95 border-slate-300 text-slate-800" 
              : "bg-slate-900/95 border-slate-700 text-slate-200"
          }`}
          title="Click and drag anywhere to move Hall Radar aside"
        >
          {/* Draggable Header Handle */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
            <div className="flex items-center gap-1.5">
              <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
                <Compass className="w-3 h-3" /> Hall Radar
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimapMinimized(prev => !prev);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                title={minimapMinimized ? "Expand Radar" : "Minimize Radar"}
              >
                {minimapMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {!minimapMinimized && (
            <div className="p-2.5">
              {/* Micro Minimap Grid with Red Viewport Box Frame */}
              <div className="relative p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-red-500/80 shadow-inner flex flex-col gap-0.5">
                <div className="absolute inset-0 border-2 border-red-500 pointer-events-none rounded-lg z-10" />
                {orderedDisplayRows.slice(0, 10).map((rowObj, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-center gap-0.5">
                    {(rowObj.seats || []).slice(0, 12).map((st, sIdx) => {
                      const isSold = isSeatDisabled(st);
                      const isSel = selectedSeatIds.has(st.id);
                      return (
                        <div
                          key={sIdx}
                          className={`w-1.5 h-1.5 rounded-xs ${
                            isSel 
                              ? "bg-emerald-500" 
                              : isSold 
                              ? "bg-red-500" 
                              : isLight ? "bg-slate-300" : "bg-slate-700"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Sold
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Free
                </span>
              </div>
              <p className="text-[8px] text-center text-slate-400 mt-1 italic">
                Drag anywhere to move aside
              </p>
            </div>
          )}
        </motion.div>

        {/* SEATING MATRIX WRAPPER WITH DYNAMIC ZOOM SCALING */}
        <div 
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          className="min-w-[700px] flex flex-col items-center gap-5"
        >

          {/* Render Screen at TOP if screenPosition === "top" */}
          {showScreen && screenPosition === "top" && renderCinemaScreen()}

          {/* SEAT ROWS MATRIX WITH INTEGRATED TIER HEADERS */}
          <div className="flex flex-col gap-2.5 w-full max-w-4xl px-2">
            {orderedDisplayRows.map((rowObj, rowIdx) => {
              const rowSeats = rowObj.seats || [];
              const isWalkway = walkwayBreaks.includes(rowObj.row);

              // Check if tier header should appear above this row
              const isFirstRowOfTier = rowIdx === 0 || orderedDisplayRows[rowIdx - 1]?.type !== rowObj.type;

              return (
                <React.Fragment key={rowObj.row}>
                  
                  {/* BookMyShow Tier Price Header with Thin Horizontal Divider Line */}
                  {isFirstRowOfTier && (
                    <div className="w-full pt-4 pb-2 mb-1">
                      <div className="flex items-center justify-between text-xs pb-1">
                        <span className={`font-black tracking-wide uppercase ${
                          isLight ? "text-slate-700" : "text-slate-200"
                        }`}>
                          Rs.{rowObj.price} {rowObj.type?.toUpperCase() || "TIER"}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}>
                          {rowObj.category || "SEATING"}
                        </span>
                      </div>
                      {/* Thin horizontal divider line spanning across auditorium */}
                      <div className={`w-full h-px ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />
                    </div>
                  )}

                  {/* Physical Cross Walkway */}
                  {isWalkway && (
                    <div className={`w-full my-3 py-2 px-5 rounded-2xl border flex items-center justify-between text-[11px] font-bold tracking-wider uppercase shadow-xs ${
                      isLight 
                        ? "bg-slate-100 border-slate-200 text-slate-600" 
                        : "bg-slate-900 border-slate-800 text-slate-300"
                    }`}>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
                        <Footprints className="w-4 h-4" /> {aisleLabels[0] || "Cross Walkway"}
                      </span>
                      <span className="text-slate-400 font-mono">Central Tier Separation Aisle</span>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
                        {aisleLabels[1] || "Exit Gangway"} <Footprints className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Seat Row Line with Left Gutter Badge & Block Columns */}
                  <div className="flex items-center justify-center gap-3 sm:gap-6">
                    
                    {/* Authentic Left Gutter Row Letter Badge (e.g. A, B, ..., HH, I, ..., RR) */}
                    <span className={`w-8 h-8 flex items-center justify-center text-xs font-black font-mono rounded-lg border shadow-xs select-none ${
                      isLight 
                        ? "bg-[#64748B] text-white border-[#475569]" 
                        : "bg-slate-800 text-cyan-300 border-slate-700"
                    }`}>
                      {rowObj.row}
                    </span>

                    {/* Dual or Triple Seating Blocks Separated by Gangway Aisles */}
                    <div className="flex items-center gap-5 sm:gap-10">
                      {sections.map((secWidth, secIdx) => {
                        const secSeats = rowSeats.filter((s) => s.sectionIndex === secIdx);

                        return (
                          <div key={secIdx} className="flex items-center gap-1.5 sm:gap-2">
                            {secSeats.map((seat) => {
                              const visuals = getSeatVisuals(seat, rowObj.type);
                              const disabled = isSeatDisabled(seat);

                              const isRecliner = seat.category === SEAT_CATEGORIES.RECLINER || seat.type === SEAT_CATEGORIES.RECLINER;
                              const isCouple = seat.isCouple || seat.category === SEAT_CATEGORIES.COUPLE;
                              const isWheelchair = seat.isWheelchair || seat.category === SEAT_CATEGORIES.WHEELCHAIR;
                              const isVIP = seat.category === SEAT_CATEGORIES.VIP;

                              return (
                                <button
                                  key={seat.id}
                                  type="button"
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={disabled}
                                  onMouseEnter={() => setHoveredSeat(seat)}
                                  onMouseLeave={() => setHoveredSeat(null)}
                                  className={`relative transition-all flex items-center justify-center select-none font-mono ${
                                    isCouple
                                      ? "w-14 h-8 sm:w-16 sm:h-9 rounded-md"
                                      : isRecliner
                                      ? "w-8 h-8 sm:w-9 sm:h-9 rounded-md"
                                      : "w-7 h-7 sm:w-8 sm:h-8 rounded-md"
                                  } text-[11px] sm:text-xs font-bold cursor-pointer disabled:cursor-not-allowed ${visuals.className}`}
                                  title={`${seat.id} • ${seat.type || rowObj.type} • ₹${seat.price} (${visuals.statusType})`}
                                >
                                  {visuals.statusType === "LOCKED" ? (
                                    <Lock className="w-3 h-3 text-cyan-600 dark:text-cyan-300" />
                                  ) : isCouple ? (
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-2.5 h-2.5 fill-current" />
                                      <span>{seat.number}</span>
                                    </span>
                                  ) : isWheelchair ? (
                                    <Accessibility className="w-3.5 h-3.5" />
                                  ) : isVIP ? (
                                    <span className="flex items-center gap-0.5">
                                      <Crown className="w-2.5 h-2.5" />
                                      <span>{seat.number}</span>
                                    </span>
                                  ) : isRecliner ? (
                                    <span className="flex items-center gap-0.5">
                                      <Armchair className="w-2.5 h-2.5" />
                                      <span>{seat.number}</span>
                                    </span>
                                  ) : (
                                    seat.number
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Row Letter Badge */}
                    <span className={`w-8 h-8 flex items-center justify-center text-xs font-black font-mono rounded-lg border shadow-xs select-none ${
                      isLight 
                        ? "bg-[#64748B] text-white border-[#475569]" 
                        : "bg-slate-800 text-cyan-300 border-slate-700"
                    }`}>
                      {rowObj.row}
                    </span>

                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Render Screen at BOTTOM if screenPosition === "bottom" */}
          {showScreen && screenPosition === "bottom" && renderCinemaScreen()}

        </div>
      </div>

      {/* 4. HOVERED SEAT DETAILED TOOLTIP INSPECTOR */}
      {hoveredSeat && (
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs shadow-xl animate-fadeIn ${
          isLight 
            ? "bg-white border-slate-200 text-slate-800" 
            : "bg-slate-900 border-slate-700 text-slate-100"
        }`}>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#10B981] text-white font-black font-mono text-sm shadow-xs">
              Seat {hoveredSeat.id}
            </span>
            <div>
              <span className="font-bold text-sm block">
                {hoveredSeat.type || hoveredSeat.category || "Standard Seat"}
              </span>
              <span className="text-slate-500 text-[11px]">
                Status: 
                <strong className={`ml-1 ${
                  hoveredSeat.status === 'LOCKED' ? 'text-cyan-600' :
                  hoveredSeat.status === 'BOOKED' ? 'text-rose-500' : 'text-emerald-600 font-bold'
                }`}>
                  {hoveredSeat.status || 'AVAILABLE'}
                </strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Seat Price</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black font-mono text-base">
              ₹{hoveredSeat.price}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
