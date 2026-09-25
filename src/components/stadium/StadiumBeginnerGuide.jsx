import React, { useState } from "react";
import {
  HelpCircle,
  X,
  Trophy,
  MapPin,
  Users,
  Eye,
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight,
  Flame,
  Ticket
} from "lucide-react";

export const REAL_STADIUM_GUIDES = [
  {
    id: "amd-modi",
    name: "Narendra Modi Stadium",
    city: "Ahmedabad, Gujarat",
    capacity: "100,000",
    nickname: "The World's Largest Cricket Stadium",
    franchise: "Gujarat Titans (IPL)",
    highlights: [
      "100,000 capacity concentric elliptical bowl",
      "360° shadow-less LED ring light canopy",
      "76 AC corporate suites & 4 team dressing rooms",
      "3 practice grounds & Olympic-size swimming pool"
    ],
    beginnerTip: "Choose Lower Tier Orange Blocks A-H for front-row boundary action, or Bowler's Arm Corporate Boxes for straight-on delivery tracking!",
    bestAngle: "North/South Ends (Block D, E, Corporate Boxes) for delivery trajectory; East/West Blocks (Block A, B, G, H) for boundary sixes."
  },
  {
    id: "mum-wankhede",
    name: "Wankhede Stadium",
    city: "Mumbai, Maharashtra",
    capacity: "33,108",
    nickname: "Fortress of 2011 World Cup Glory",
    franchise: "Mumbai Indians (IPL)",
    highlights: [
      "Historic venue where MS Dhoni hit the 2011 World Cup winning six",
      "Iconic Sachin Tendulkar Stand & Garware Pavilion",
      "Sea breeze from Marine Drive assists early swing bowling",
      "Famous high-decibel Mumbai crowd chant atmosphere"
    ],
    beginnerTip: "Sit at the Sachin Tendulkar Stand (South End) for direct line of sight behind the bowler's arm!",
    bestAngle: "Sachin Tendulkar Stand (South) & Garware Pavilion (North) for pitch depth."
  },
  {
    id: "blr-chinnaswamy",
    name: "M. Chinnaswamy Stadium",
    city: "Bengaluru, Karnataka",
    capacity: "40,000",
    nickname: "The High-Altitude Sixes Fest",
    franchise: "Royal Challengers Bengaluru (IPL)",
    highlights: [
      "First solar-powered cricket stadium in the world",
      "920 meters above sea level = thin air & high ball flight",
      "Short boundary dimensions = record-breaking IPL sixes",
      "Electric red-and-black RCB fanbase atmosphere"
    ],
    beginnerTip: "Book Pavilion Terrace or Grand Stand to catch high-flying sixes raining down from the sky!",
    bestAngle: "Pavilion Terrace for premium elevated views; Mid-Wicket stands for sixes."
  },
  {
    id: "che-chepauk",
    name: "MA Chidambaram Stadium (Chepauk)",
    city: "Chennai, Tamil Nadu",
    capacity: "38,000",
    nickname: "The Spin Paradise & Sea Breeze Fortress",
    franchise: "Chennai Super Kings (IPL)",
    highlights: [
      "One of India's oldest active cricket test grounds (Est. 1916)",
      "Red soil turning pitch favoring world-class spin bowling",
      "Famous knowledgeable 'Yellow Army' crowd",
      "Breeze from nearby Marina Beach cools evening matches"
    ],
    beginnerTip: "C & D Terrace stands give fantastic elevated views of spin variations and tactical field changes!",
    bestAngle: "C & D Terrace for tactical field placement overviews."
  },
  {
    id: "hyd-uppal",
    name: "Rajiv Gandhi International Stadium",
    city: "Hyderabad, Telangana",
    capacity: "55,000",
    nickname: "The Orange Army Fortress",
    franchise: "Sunrisers Hyderabad (IPL)",
    highlights: [
      "State-of-the-art North and South Pavilion stands",
      "True batting surface with consistent bounce",
      "Canopy roofs providing shade and shelter",
      "Fast outfield with quick boundary runs"
    ],
    beginnerTip: "North Pavilion Stand gives an unhindered direct line of sight right behind the bowler!",
    bestAngle: "North Pavilion (Bowler's Arm) & South Stand."
  },
  {
    id: "vizag-vdca",
    name: "ACA-VDCA International Stadium",
    city: "Visakhapatnam, Andhra Pradesh",
    capacity: "27,500",
    nickname: "The Coastal Hillside Jewel",
    franchise: "IPL Neutral Host & T20 Clash Venue",
    highlights: [
      "Picturesque stadium nestled against green coastal hills",
      "Batting-friendly surface with high-scoring T20 matches",
      "Intimate seating layout with close proximity to players",
      "Refreshing evening sea breezes"
    ],
    beginnerTip: "Ground Level East/West stands get you right up close to boundary fielders and player dugouts!",
    bestAngle: "East & West galleries for intimate boundary action."
  }
];

export default function StadiumBeginnerGuide({ isOpen, onClose, onSelectRecommendedBlock }) {
  const [activeTab, setActiveTab] = useState("guide"); // 'guide' | 'stadiums' | 'recommender'
  const [userGoal, setUserGoal] = useState(null); // 'budget' | 'bowling' | 'sixes' | 'vip' | 'accessible'

  if (!isOpen) return null;

  const handleApplyRecommendation = (category, goal) => {
    setUserGoal(goal);
    if (onSelectRecommendedBlock) {
      onSelectRecommendedBlock(category);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-fadeIn">
        
        {/* Header Modal Bar */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  BEGINNER FRIENDLY GUIDE
                </span>
                <span className="text-xs text-slate-400 font-bold hidden sm:inline">Real Indian Cricket Stadiums</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                Understanding Stadiums & Seating
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-3 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "guide"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>How Seating & Angles Work</span>
          </button>

          <button
            onClick={() => setActiveTab("stadiums")}
            className={`pb-3 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "stadiums"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Explore Real Famous Venues</span>
          </button>

          <button
            onClick={() => setActiveTab("recommender")}
            className={`pb-3 px-4 font-black text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "recommender"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Smart Seat Assistant</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          
          {/* TAB 1: HOW SEATING & ANGLES WORK */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              
              {/* Introduction Callout */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/30 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200 leading-relaxed font-medium">
                  Welcome to CineFy's Stadium Booking System! Watching live cricket from a stadium is an unforgettable experience. Here is everything a beginner needs to know to choose the perfect seat!
                </p>
              </div>

              {/* 1. Camera & View Angles */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-white flex items-center gap-2 font-heading">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>1. Choosing Your Viewing Angle</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bowler's Arm */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                        North & South Ends
                      </span>
                      <span className="text-xs text-cyan-400 font-bold">Bowler's Arm View</span>
                    </div>
                    <h4 className="text-sm font-black text-white">Behind the Stumps View</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You sit directly inline with the pitch (like TV broadcast camera 1). You can see the bowler's run-up, spin turn, ball swing, and LBW appeals straight down the wicket!
                    </p>
                    <div className="text-[11px] font-bold text-slate-300 pt-1">
                      💡 <em>Recommended Blocks:</em> Block D, Block E, Corporate Box, Pavilion Stand
                    </div>
                  </div>

                  {/* Mid-Wicket / Side View */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase">
                        East & West Stands
                      </span>
                      <span className="text-xs text-cyan-400 font-bold">Side-on View</span>
                    </div>
                    <h4 className="text-sm font-black text-white">Mid-Wicket & Square Leg</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You sit perpendicular to the pitch. Perfect angle to watch high-flying sixes, big pull shots, boundary catches, and fielders diving near the boundary rope!
                    </p>
                    <div className="text-[11px] font-bold text-slate-300 pt-1">
                      💡 <em>Recommended Blocks:</em> Block A, Block B, Block G, Block H
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Understanding Seating Tiers */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-white flex items-center gap-2 font-heading">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>2. Understanding Stadium Tiers & Colors</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Lower Tier */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-orange-500/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                      <span className="font-black text-white text-xs">Lower Tier (Ground)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Ground level! You are closest to the boundary rope, player dugouts, and high-energy cheering crowds.
                    </p>
                  </div>

                  {/* Upper Tier */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-sky-500/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-sky-400" />
                      <span className="font-black text-white text-xs">Upper Tier (Elevated)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Elevated view! Excellent panoramic overview of all 11 fielders and game tactics at pocket-friendly prices.
                    </p>
                  </div>

                  {/* Corporate Suites */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-rose-500/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                      <span className="font-black text-white text-xs">Corporate & VIP Suites</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Luxury experience! Air-conditioned rooms, plush sofa seats, complimentary buffet dining, and private balconies.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Decoding Ticket Codes */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-white flex items-center gap-2 font-heading">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                  <span>3. Decoding Your Seat Number</span>
                </h3>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-center gap-2 font-mono text-base font-black text-cyan-400 bg-slate-900 py-2.5 rounded-xl border border-cyan-500/30">
                    <span>BLOCK D</span>
                    <span className="text-slate-600">•</span>
                    <span>ROW A</span>
                    <span className="text-slate-600">•</span>
                    <span>SEAT 14</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400">GATE 3</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                    <div className="bg-slate-900/60 p-2 rounded-xl">
                      <strong className="text-white block font-bold">BLOCK D</strong>
                      <span className="text-[10px] text-slate-400">Stadium curved stand sector</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl">
                      <strong className="text-white block font-bold">ROW A</strong>
                      <span className="text-[10px] text-slate-400">Row A is front row (closest to field)</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl">
                      <strong className="text-white block font-bold">SEAT 14</strong>
                      <span className="text-[10px] text-slate-400">Your reserved seat chair number</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl">
                      <strong className="text-cyan-400 block font-bold">GATE 3</strong>
                      <span className="text-[10px] text-slate-400">Nearest stadium entrance gate</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EXPLORE REAL FAMOUS VENUES */}
          {activeTab === "stadiums" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Click any real stadium below to view its official details, capacity, famous stands, and beginner seating tips:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REAL_STADIUM_GUIDES.map((st) => (
                  <div
                    key={st.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                          {st.franchise}
                        </span>
                        <h4 className="text-base font-black text-white font-heading">{st.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" /> {st.city}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                          {st.capacity} Seats
                        </span>
                      </div>
                    </div>

                    <p className="text-xs italic text-slate-300 font-medium bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                      "{st.nickname}"
                    </p>

                    <div className="space-y-1 text-xs">
                      <strong className="text-cyan-300 font-bold block text-[11px] uppercase tracking-wider">Venue Highlights:</strong>
                      <ul className="space-y-1 text-slate-400 pl-4 list-disc text-[11px]">
                        {st.highlights.map((hl, idx) => (
                          <li key={idx}>{hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
                      <strong>💡 Beginner Tip:</strong> {st.beginnerTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SMART SEAT ASSISTANT */}
          {activeTab === "recommender" && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>What is your top priority for match day?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select an option below and our Smart Assistant will highlight the best stadium block for you:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Option 1: Budget */}
                <button
                  onClick={() => handleApplyRecommendation("Upper Tier", "budget")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    userGoal === "budget"
                      ? "bg-sky-500/20 border-sky-400 text-white"
                      : "bg-slate-950 border-slate-800 hover:border-sky-500/50 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-400 uppercase">Best Budget Choice</span>
                    {userGoal === "budget" && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                  <h4 className="text-sm font-black text-white">Upper Tier (Sky Blue Blocks)</h4>
                  <p className="text-xs text-slate-400">
                    Pocket friendly tickets (~₹1,200) with elevated panoramic view of full match tactics.
                  </p>
                </button>

                {/* Option 2: Bowler's Arm */}
                <button
                  onClick={() => handleApplyRecommendation("Lower Tier", "bowling")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    userGoal === "bowling"
                      ? "bg-cyan-500/20 border-cyan-400 text-white"
                      : "bg-slate-950 border-slate-800 hover:border-cyan-500/50 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400 uppercase">Watch Delivery Trajectory</span>
                    {userGoal === "bowling" && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h4 className="text-sm font-black text-white">Bowler's Arm Ends (Block D / E)</h4>
                  <p className="text-xs text-slate-400">
                    Straight-on pitch view behind the bowler to watch spin, swing, and LBW appeals.
                  </p>
                </button>

                {/* Option 3: Sixes & High Energy */}
                <button
                  onClick={() => handleApplyRecommendation("Lower Tier", "sixes")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    userGoal === "sixes"
                      ? "bg-orange-500/20 border-orange-400 text-white"
                      : "bg-slate-950 border-slate-800 hover:border-orange-500/50 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-400 uppercase">High Energy & Sixes</span>
                    {userGoal === "sixes" && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                  </div>
                  <h4 className="text-sm font-black text-white">Lower Tier Boundary (Blocks A, B, G)</h4>
                  <p className="text-xs text-slate-400">
                    Closest to player dugouts, boundary fielder dives, and high-decibel crowd chants.
                  </p>
                </button>

                {/* Option 4: Luxury VIP */}
                <button
                  onClick={() => handleApplyRecommendation("Corporate Box", "vip")}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    userGoal === "vip"
                      ? "bg-rose-500/20 border-rose-400 text-white"
                      : "bg-slate-950 border-slate-800 hover:border-rose-500/50 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-400 uppercase">Air-Conditioned VIP Luxury</span>
                    {userGoal === "vip" && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                  </div>
                  <h4 className="text-sm font-black text-white">Corporate Boxes & Suites</h4>
                  <p className="text-xs text-slate-400">
                    Air-conditioned lounge, gourmet buffet, private balcony seating, and VIP gate access.
                  </p>
                </button>

              </div>

              {userGoal && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span><strong>Recommendation applied!</strong> Recommended seating blocks are now highlighted on the stadium map.</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition-all shrink-0"
                  >
                    Go to Stadium Map
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official 100% Guaranteed Tickets • Powered by CineFy</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-lg"
          >
            Got it, Let's Select Seats!
          </button>
        </div>

      </div>
    </div>
  );
}
