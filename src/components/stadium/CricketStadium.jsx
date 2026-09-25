import React, { useState, useEffect } from "react";
import MatchHeader from "./MatchHeader";
import StadiumOverview from "./StadiumOverview";
import StadiumBlock from "./StadiumBlock";
import StadiumRow from "./StadiumRow";
import SeatLegend from "./SeatLegend";
import StadiumFacilities from "./StadiumFacilities";
import BookingSummary from "./BookingSummary";
import StadiumBeginnerGuide from "./StadiumBeginnerGuide";
import API from "../../services/api";
import { generateBlockRowSeats, generateStadiumConfig } from "./StadiumGeometryEngine";
import { useAuth } from "../../context/AuthContext";
import {
  Trophy,
  ChevronLeft,
  Sparkles,
  DoorOpen,
  Users,
  Shield,
  Crown,
  Info
} from "lucide-react";

// Indian Cricket Stadium Concentric Layout Presets
const STADIUM_PRESETS = [
  {
    id: "amd-modi",
    name: "Narendra Modi Stadium",
    shortName: "Narendra Modi Stadium",
    teamLogoText: "NARENDRA MODI INTERNATIONAL CRICKET STADIUM",
    city: "Motera, Ahmedabad, Gujarat",
    capacity: "132,000",
    availableTickets: "38,450",
  },
  {
    id: "hyd-uppal",
    name: "Rajiv Gandhi International Cricket Stadium",
    shortName: "Uppal Stadium",
    teamLogoText: "RAJIV GANDHI INTERNATIONAL CRICKET STADIUM",
    city: "Uppal, Hyderabad, Telangana",
    capacity: "55,000",
    availableTickets: "14,850",
  },
  {
    id: "lko-ekana",
    name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    shortName: "Ekana Cricket Stadium",
    teamLogoText: "EKANA INTERNATIONAL CRICKET VENUE",
    city: "Lucknow, Uttar Pradesh",
    capacity: "50,000",
    availableTickets: "18,400",
  },
  {
    id: "vizag-vdca",
    name: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
    shortName: "ACA-VDCA Cricket Stadium",
    teamLogoText: "ACA-VDCA INTERNATIONAL CRICKET VENUE",
    city: "Visakhapatnam, Andhra Pradesh",
    capacity: "27,500",
    availableTickets: "8,900",
  },
  {
    id: "mangalagiri-aca",
    name: "ACA International Cricket Stadium",
    shortName: "Mangalagiri Stadium",
    teamLogoText: "ACA INTERNATIONAL CRICKET VENUE",
    city: "Mangalagiri, Andhra Pradesh",
    capacity: "34,000",
    availableTickets: "14,200",
  },
  {
    id: "che-chepauk",
    name: "M. A. Chidambaram Stadium",
    shortName: "Chepauk Stadium",
    teamLogoText: "CHEPAUK CRICKET VENUE",
    city: "Chennai",
    capacity: "38,000",
    availableTickets: "7,800",
  },
  {
    id: "mum-wankhede",
    name: "Wankhede Stadium",
    shortName: "Wankhede",
    teamLogoText: "WANKHEDE VENUE",
    city: "Mumbai",
    capacity: "33,108",
    availableTickets: "8,200",
  },
  {
    id: "blr-chinnaswamy",
    name: "M. Chinnaswamy Stadium",
    shortName: "Chinnaswamy",
    teamLogoText: "CHINNASWAMY VENUE",
    city: "Bengaluru",
    capacity: "40,000",
    availableTickets: "9,400",
  },
  {
    id: "kol-eden",
    name: "Eden Gardens Stadium",
    shortName: "Eden Gardens",
    teamLogoText: "EDEN GARDENS VENUE",
    city: "Kolkata",
    capacity: "68,000",
    availableTickets: "15,800",
  },
  {
    id: "del-kotla",
    name: "Arun Jaitley Stadium",
    shortName: "Kotla",
    teamLogoText: "KOTLA CRICKET ARENA",
    city: "Delhi NCR",
    capacity: "41,842",
    availableTickets: "11,200",
  },
  {
    id: "hpca-dharamshala",
    name: "Himachal Pradesh Cricket Association (HPCA) Stadium",
    shortName: "HPCA Dharamshala",
    teamLogoText: "HPCA INTERNATIONAL CRICKET STADIUM • DHARAMSHALA",
    city: "Dharamshala, Himachal Pradesh",
    capacity: "23,000",
    availableTickets: "5,400",
  }
];

export default function CricketStadium({ match, initialEvent, event, onCloseModal, onClose }) {
  const activeMatch = match || initialEvent || event || {};
  const handleClose = onCloseModal || onClose;

  const [stadiumPresets] = useState(STADIUM_PRESETS);
  const [selectedStadiumId, setSelectedStadiumId] = useState(STADIUM_PRESETS[0].id);

  // Dynamically generate high-fidelity stadium configuration from geometry engine
  const activeStadium = React.useMemo(() => {
    const preset = STADIUM_PRESETS.find(p => p.id === selectedStadiumId) || STADIUM_PRESETS[0];
    const geoConfig = generateStadiumConfig(selectedStadiumId, parseInt(preset.capacity.replace(/,/g, '')));
    
    // Enrich preset with structural data for the UI
    return {
      ...preset,
      ...geoConfig,
      // Group blocks into virtual "stands" for the zoomed-in list UI
      stands: [
        {
          id: "std-lower",
          name: "Lower Tier & Premium Hospitality",
          direction: "Field Side",
          blocks: (geoConfig.innerBlocks || []).map(b => ({
            ...b,
            availableSeats: Math.floor(45 + (b.id.length % 30)),
            totalSeats: 120,
            category: b.isVip ? "VIP Hospitality" : "Lower Tier"
          })),
          isVip: true
        },
        {
          id: "std-upper",
          name: "Upper Tier & Gallery",
          direction: "Stadium Perimeter",
          blocks: (geoConfig.outerBlocks || []).map(b => ({
            ...b,
            availableSeats: Math.floor(60 + (b.id.length % 40)),
            totalSeats: 150,
            category: "Upper Tier"
          })),
          isVip: false
        }
      ]
    };
  }, [selectedStadiumId]);

  useEffect(() => {
    if (activeMatch && (activeMatch.venue || activeMatch.city || activeMatch.stadiumId)) {
      const searchStr = `${activeMatch.venue || ''} ${activeMatch.city || ''} ${activeMatch.stadiumId || ''}`.toLowerCase();
      const matched = STADIUM_PRESETS.find(
        st => searchStr.includes(st.id.toLowerCase()) ||
              searchStr.includes("mangalagiri") ||
              searchStr.includes(st.city.toLowerCase()) ||
              searchStr.includes(st.shortName.toLowerCase())
      );
      if (matched) {
        setSelectedStadiumId(matched.id);
      }
    }
  }, [activeMatch]);
  
  const currentCapacity = parseInt(activeStadium.capacity.toString().replace(/,/g, '')) || 50000;
  
  // Navigation & Zoom Level state: 'OVERVIEW' | 'STAND' | 'SEATS'
  const [zoomLevel, setZoomLevel] = useState("OVERVIEW");
  const [selectedStand, setSelectedStand] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedBay, setSelectedBay] = useState("ALL");
  
  // Seat state
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  
  // Timer hold lock
  const [lockTimer, setLockTimer] = useState(300);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    let interval = null;
    if (selectedSeats.length > 0 && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0) {
      setSelectedSeats([]);
      setLockTimer(300);
    }
    return () => clearInterval(interval);
  }, [selectedSeats, lockTimer]);

  // Memoize active block row seats so hover/timer updates don't regenerate seats
  const blockRowSeats = React.useMemo(() => {
    if (!selectedBlock) return [];
    return generateBlockRowSeats(selectedBlock, currentCapacity, selectedBay);
  }, [selectedBlock, currentCapacity, selectedBay]);

  // Total seats count in active block view
  const activeBlockSeatStats = React.useMemo(() => {
    let total = 0;
    let available = 0;
    blockRowSeats.forEach(r => {
      r.seats.forEach(s => {
        total++;
        if (s.status === "available") available++;
      });
    });
    return { total, available };
  }, [blockRowSeats]);

  // Quick Auto-Select Adjacent Available Seats
  const handleQuickSelect = (count) => {
    if (!selectedBlock) return;
    let found = [];
    for (const r of blockRowSeats) {
      const avail = r.seats.filter(s => s.status === "available");
      if (avail.length >= count) {
        found = avail.slice(0, count);
        break;
      }
    }
    if (found.length === 0) {
      // Pick any available across rows
      for (const r of blockRowSeats) {
        for (const s of r.seats) {
          if (s.status === "available" && found.length < count) {
            found.push(s);
          }
        }
        if (found.length >= count) break;
      }
    }

    if (found.length > 0) {
      const formatted = found.map(seat => ({
        ...seat,
        blockName: selectedBlock.name,
        standName: selectedStand ? selectedStand.name : selectedBlock.name,
        gate: selectedBlock.gate || "GATE 1"
      }));
      setSelectedSeats(formatted);
    }
  };

  // Handle Stadium Switcher
  const handleChangeStadium = (stadiumId) => {
    setSelectedStadiumId(stadiumId);
    setZoomLevel("OVERVIEW");
    setSelectedStand(null);
    setSelectedBlock(null);
    setSelectedSeats([]);
  };

  // Zoom to Stand
  const handleSelectStand = (stand) => {
    setSelectedStand(stand);
    setZoomLevel("STAND");
  };

  // Zoom to Block directly from concentric map
  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
    setSelectedStand({ name: block.name, id: block.id, blocks: [block] });
    setZoomLevel("SEATS");
  };

  // Navigate Back Level
  const handleNavigateBack = () => {
    if (zoomLevel === "SEATS") {
      setZoomLevel("OVERVIEW");
      setSelectedBlock(null);
      setSelectedStand(null);
    } else if (zoomLevel === "STAND") {
      setZoomLevel("OVERVIEW");
      setSelectedStand(null);
    }
  };

  // Toggle Seat Selection (Supports direct mini-seat selection from overview map or seat grid)
  const handleToggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id || s.seatId === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id && s.seatId !== seat.id);
      }
      if (prev.length >= 8) {
        alert("Maximum 8 seats per booking transaction");
        return prev;
      }
      return [
        ...prev,
        {
          ...seat,
          blockName: seat.blockName || (selectedBlock ? selectedBlock.name : "Block"),
          standName: seat.standName || (selectedStand ? selectedStand.name : "Stand"),
          gate: seat.gate || (selectedBlock ? selectedBlock.gate : "GATE 1")
        }
      ];
    });
  };

  // Calculate total price of selected seats
  const totalAmount = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const { requireAuth } = useAuth();

  // Confirm Booking handler
  const handleConfirmBooking = async (bookingDetails) => {
    requireAuth(
      async () => {
        try {
          const bookingId = "CF-CRIC-" + Math.floor(100000 + Math.random() * 900000);
          const res = await API.post("/bookings/create", {
            movieTitle: match.title || "IPL 2026 T20 Clash",
            theatreName: activeStadium.name,
            showDate: match.date || "2026-08-20",
            showTime: match.time || "07:30 PM",
            seats: selectedSeats,
            totalAmount: bookingDetails.grandTotal,
            paymentMethod: bookingDetails.paymentMethod,
            bookingType: "STADIUM"
          });

          setConfirmedBooking({
            bookingId: res.data.booking ? res.data.booking.id : bookingId,
            matchTitle: match.title || "IPL 2026 T20 Match",
            stadiumName: activeStadium.name,
            date: match.date || "20 August 2026",
            time: match.time || "07:30 PM",
            seats: selectedSeats,
            grandTotal: bookingDetails.grandTotal,
            primaryGate: bookingDetails.primaryGate,
            qrCode: res.data.booking ? res.data.booking.qrCode : null
          });
        } catch (err) {
          setConfirmedBooking({
            bookingId: "CF-CRIC-" + Math.floor(100000 + Math.random() * 900000),
            matchTitle: match.title || "IPL 2026 T20 Match",
            stadiumName: activeStadium.name,
            date: match.date || "20 August 2026",
            time: match.time || "07:30 PM",
            seats: selectedSeats,
            grandTotal: bookingDetails.grandTotal,
            primaryGate: bookingDetails.primaryGate,
            qrCode: null
          });
        }
      },
      {
        title: "Sign or Register To Experience Movies",
        subtitle: `Please sign in to confirm your booking for ${match?.title || 'this event'}.`
      }
    );
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setSelectedSeats([]);
    setZoomLevel("OVERVIEW");
    setSelectedStand(null);
    setSelectedBlock(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none">
      
      {/* Top Match Header Bar */}
      <MatchHeader
        match={activeMatch}
        activeStadium={activeStadium}
        onChangeStadium={handleChangeStadium}
        stadiumPresets={stadiumPresets}
        lockTimer={lockTimer}
        zoomLevel={zoomLevel}
        onNavigateBack={handleNavigateBack}
        selectedSeatsCount={selectedSeats.length}
        onCloseModal={handleClose}
        onOpenBeginnerGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Stadium Visualizer Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LEVEL 1: OVERVIEW MAP */}
          {zoomLevel === "OVERVIEW" && (
            <StadiumOverview
              stadium={activeStadium}
              match={activeMatch}
              selectedStand={selectedStand}
              onSelectStand={handleSelectStand}
              onSelectBlock={handleSelectBlock}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />
          )}

          {/* LEVEL 2: STAND BLOCK SELECTOR VIEW */}
          {zoomLevel === "STAND" && selectedStand && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">STAND SECTION</span>
                  <h2 className="text-2xl font-black text-white font-heading">{selectedStand.name}</h2>
                  <p className="text-xs text-slate-400">Select an available block to view individual curved seats</p>
                </div>

                <button
                  onClick={handleNavigateBack}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-xs font-black transition-all"
                >
                  ← Full Stadium Map
                </button>
              </div>

              {/* Blocks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStand.blocks.map((blk) => (
                  <StadiumBlock
                    key={blk.id}
                    block={blk}
                    stand={selectedStand}
                    isSelected={selectedBlock && selectedBlock.id === blk.id}
                    onSelectBlock={handleSelectBlock}
                    zoomLevel={zoomLevel}
                  />
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3: RECTANGULAR BLOCK SEAT GRID VIEW */}
          {zoomLevel === "SEATS" && selectedBlock && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
              
              {/* Seat Selection Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 text-xs font-black uppercase font-bold">
                      {selectedBlock.name}
                    </span>
                    <span className="text-xs font-bold text-slate-300">{selectedStand ? selectedStand.name : selectedBlock.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Entry Gate: <strong className="text-cyan-400">{selectedBlock.gate}</strong> • Base Price: <strong className="text-cyan-400">₹{selectedBlock.price}</strong> • Capacity: <strong className="text-emerald-400">{activeBlockSeatStats.available} Available</strong> / {activeBlockSeatStats.total} Seats
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNavigateBack}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-xs font-black transition-all cursor-pointer"
                  >
                    ← Full Stadium Map
                  </button>
                </div>
              </div>

              {/* Bay Section Filter & Quick Auto-Select Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                {/* Bay Tabs */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">BAYS:</span>
                  {["ALL", "Bay 1", "Bay 2", "Bay 3"].map((bayOption) => (
                    <button
                      key={bayOption}
                      type="button"
                      onClick={() => setSelectedBay(bayOption)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedBay === bayOption
                          ? "bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {bayOption === "ALL" ? "Full Block (All Bays)" : bayOption}
                    </button>
                  ))}
                </div>

                {/* Quick Auto-Select Options */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">QUICK PICK:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(2)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    2 Seats
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(4)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    4 Seats
                  </button>
                  {selectedSeats.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSeats([])}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 font-bold text-xs transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Ground Pitch Direction Indicator */}
              <div className="w-full py-2 bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 border border-emerald-500/40 rounded-2xl text-center shadow-lg">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span>CRICKET BOUNDARY & PITCH DIRECTION</span>
                </span>
              </div>

              {/* Individual Curved Seat Grid Generated Procedurally */}
              <div className="p-4 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 overflow-x-auto">
                <div className="min-w-max pb-2">
                  {blockRowSeats.map((rowObj) => (
                    <StadiumRow
                      key={rowObj.label}
                      rowLabel={rowObj.label}
                      rowIdx={rowObj.idx}
                      seats={rowObj.seats}
                      stand={selectedStand || { name: selectedBlock.name }}
                      block={selectedBlock}
                      selectedSeats={selectedSeats}
                      onSelectSeat={handleToggleSeat}
                      onHoverSeat={(seatInfo) => setHoveredSeat(seatInfo)}
                      onLeaveSeat={() => setHoveredSeat(null)}
                    />
                  ))}
                </div>
              </div>

              {/* Seat Legend */}
              <div className="pt-1 border-t border-slate-800/80">
                <SeatLegend />
              </div>

              {/* Hover Tooltip Box */}
              {hoveredSeat && (
                <div className="p-3 bg-slate-950 rounded-xl border border-cyan-400/50 text-xs flex items-center justify-between animate-fadeIn shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cyan-400">
                      {hoveredSeat.blockName} • {hoveredSeat.bay || "Bay"} • Row {hoveredSeat.row}, Seat {hoveredSeat.number}
                    </span>
                    <span className="text-slate-400">• Entrance: {hoveredSeat.gate}</span>
                  </div>
                  <span className="font-black text-white text-sm">₹{hoveredSeat.price}</span>
                </div>
              )}

            </div>
          )}

          {/* Stadium Facilities Concourse Bar */}
          <StadiumFacilities stadium={activeStadium} />

        </div>

        {/* Right 1 Column: Booking Summary & Checkout */}
        <div className="space-y-6">
          <BookingSummary
            match={activeMatch}
            stadium={activeStadium}
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
            onConfirmBooking={handleConfirmBooking}
            confirmedBooking={confirmedBooking}
            onResetBooking={handleResetBooking}
          />
        </div>

      </div>

      {/* Beginner's Interactive Stadium Guide Modal */}
      <StadiumBeginnerGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectRecommendedBlock={(category) => {
          setIsGuideOpen(false);
          // Find first matching block in active stadium
          const foundBlock = activeStadium.stands.flatMap(s => s.blocks).find(b => b.category === category) || activeStadium.stands[0].blocks[0];
          if (foundBlock) {
            handleSelectBlock(foundBlock);
          }
        }}
      />

    </div>
  );
}
