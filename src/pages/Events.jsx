import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button as MovingBorderButton } from "../components/ui/moving-border";
import {
  Calendar,
  Music,
  Trophy,
  MapPin,
  Ticket,
  Sparkles,
  Navigation,
  ChevronRight,
  Smartphone,
  CheckCircle2,
  Lock,
  Zap,
  Check,
  AtSign,
  Flame,
  Radio,
  Clock,
  Wind,
  Layers,
  Camera,
  Activity
} from "lucide-react";
import StadiumSeatSelectionModal from "../components/StadiumSeatSelectionModal";
import ConcertSeatSelectionModal from "../components/ConcertSeatSelectionModal";
import { EVENTS as SEED_EVENTS } from "../data/seedData";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const { user, requireAuth, linkedPhone = "", linkedUpiId = "", processRealtimePhonePayment } = useAuth();

  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [subFilter, setSubFilter] = useState("ALL");
  const [stadiumModalEvent, setStadiumModalEvent] = useState(null);
  const [concertModalEvent, setConcertModalEvent] = useState(null);
  const [bookingSuccessEvent, setBookingSuccessEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(categoryParam);
    setSubFilter("ALL");
  }, [categoryParam]);

  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = activeCategory === "All" ? "/events" : `/events?category=${encodeURIComponent(activeCategory)}`;
      const res = await API.get(url);
      const data = res.data;
      if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        const filteredSeed = activeCategory === "All"
          ? SEED_EVENTS
          : SEED_EVENTS.filter((e) => e.category?.toLowerCase() === activeCategory.toLowerCase());
        setEvents(filteredSeed);
      }
    } catch (err) {
      console.warn("Using fallback events:", err);
      const filteredSeed = activeCategory === "All"
        ? SEED_EVENTS
        : SEED_EVENTS.filter((e) => e.category?.toLowerCase() === activeCategory.toLowerCase());
      setEvents(filteredSeed);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setSubFilter("ALL");
    setSearchParams({ category: cat });
  };

  const handleBookTicket = (eventItem) => {
    requireAuth(
      () => {
        if (eventItem.stadiumLayout || eventItem.category === "Sports" || eventItem.sportType === "Cricket") {
          setStadiumModalEvent(eventItem);
        } else {
          setConcertModalEvent(eventItem);
        }
      },
      {
        title: "Sign or Register To Experience Movies",
        subtitle: `Please sign in to book passes for ${eventItem.title}.`,
      }
    );
  };

  // Sub-filtering logic
  const filteredEvents = events.filter((evt) => {
    if (subFilter === "ALL") return true;
    if (subFilter === "LIVE") return evt.isLiveNow;
    if (subFilter === "T20") return evt.matchType?.includes("T20") || evt.tournament?.includes("T20");
    if (subFilter === "ODI") return evt.matchType?.includes("ODI") || evt.tournament?.includes("ODI");
    if (subFilter === "TEST") return evt.matchType?.includes("Test");
    if (subFilter === "POP") return evt.genre?.includes("Pop") || evt.genre?.includes("Rock");
    if (subFilter === "PUNJABI") return evt.genre?.includes("Punjabi");
    if (subFilter === "BOLLYWOOD") return evt.genre?.includes("Bollywood");
    if (subFilter === "EDM") return evt.genre?.includes("EDM") || evt.genre?.includes("Electronic");
    if (subFilter === "COMEDY") return evt.genre?.includes("Comedy") || evt.genre?.includes("Standup");
    if (subFilter === "THEATRE") return evt.genre?.includes("Musical") || evt.genre?.includes("Theatre");
    if (subFilter === "EXPO") return evt.genre?.includes("Pop Culture") || evt.genre?.includes("Gaming") || evt.genre?.includes("Food");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 overflow-x-auto">
        {[
          { label: "All Entertainment", value: "All", icon: Sparkles, color: "text-cyan-400" },
          { label: "Cricket & Stadium Sports (11)", value: "Sports", icon: Trophy, color: "text-emerald-400" },
          { label: "Music Concerts (10)", value: "Concerts", icon: Music, color: "text-purple-400" },
          { label: "Live Events & Comedy (6)", value: "Events", icon: Calendar, color: "text-cyan-400" }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleSelectCategory(tab.value)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white"
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? "text-slate-950" : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DEDICATED HEADER PER CATEGORY (Only show respective theme, no cricket header in Events/Concerts) */}
      {activeCategory === "Events" ? (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/30 overflow-hidden shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            <span>LIVE STAGE EXPERIENCES • COMEDY • BROADWAY • EXPOS</span>
          </div>
          <div className="max-w-2xl space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Live Shows, Standup Comedy & Cultural Expos
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Discover top-rated standup specials, NMACC musical theatre productions, Comic Con gaming arenas, and gourmet food festivals across Indian cities.
            </p>
          </div>

          {/* Sub-genre filter chips for Events */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            {[
              { id: "ALL", label: "All Shows" },
              { id: "COMEDY", label: "Standup Comedy" },
              { id: "THEATRE", label: "Broadway Musicals" },
              { id: "EXPO", label: "Comic Con & Food Carnivals" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  subFilter === f.id
                    ? "bg-cyan-500 text-slate-950 font-black"
                    : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-cyan-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      ) : activeCategory === "Concerts" ? (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 overflow-hidden shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <Music className="w-4 h-4 animate-pulse" />
            <span>MEGA ARENA STADIUM TOURS & MUSIC FESTIVALS 2026</span>
          </div>
          <div className="max-w-2xl space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Live Music Concerts & Arena World Tours
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Experience Coldplay, Diljit Dosanjh, A.R. Rahman, Ed Sheeran, Arijit Singh, Sunburn Goa, and Alan Walker live. Pick your stage zone and book instantly.
            </p>
          </div>

          {/* Sub-genre filter chips for Concerts */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            {[
              { id: "ALL", label: "All Concerts" },
              { id: "POP", label: "Pop & Arena Rock" },
              { id: "PUNJABI", label: "Punjabi Superstars" },
              { id: "BOLLYWOOD", label: "Symphony & Soul" },
              { id: "EDM", label: "EDM & DJ Mega Festivals" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  subFilter === f.id
                    ? "bg-purple-500 text-white font-black"
                    : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-purple-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      ) : activeCategory === "Sports" ? (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border border-emerald-500/30 overflow-hidden shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>INTERNATIONAL CRICKET FIXTURES & STADIUMS</span>
          </div>
          <div className="max-w-2xl space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
              International Cricket Matches & Stadiums
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Official ICC tournament fixtures, international bilateral clashes, authentic stadium architecture, and 360° rectangular block seating for premier cricket arenas across India.
            </p>
          </div>

          {/* Sub-genre filter chips for Sports */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            {[
              { id: "ALL", label: "All Matches (11)" },
              { id: "T20", label: "T20 Internationals" },
              { id: "ODI", label: "ICC ODI Trophy" },
              { id: "TEST", label: "World Test Championship" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  subFilter === f.id
                    ? "bg-emerald-500 text-slate-950 font-black"
                    : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-emerald-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/30 overflow-hidden shadow-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>PREMIER ENTERTAINMENT HUB • INDIA 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Live Stadium Matches, Music Concerts & Events
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Book verified passes and seat selections for international cricket fixtures, arena concerts, and comedy shows with real-time phone pay.
          </p>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`event-skel-${i}`} className="h-96 bg-slate-900/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <p>No events found for this filter criteria.</p>
          <button
            onClick={() => setSubFilter("ALL")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt, idx) => {
            const isSports = evt.category === "Sports" || evt.sportType === "Cricket";
            const isConcert = evt.category === "Concerts";

            return (
              <div
                key={evt.id ? `event-${evt.id}-${idx}` : `event-idx-${idx}`}
                className={`bg-slate-900/90 rounded-3xl border overflow-hidden transition-all flex flex-col group shadow-xl ${
                  isSports
                    ? "border-slate-800 hover:border-emerald-500/60"
                    : isConcert
                    ? "border-slate-800 hover:border-purple-500/60"
                    : "border-slate-800 hover:border-cyan-500/60"
                }`}
              >
                
                {/* Visual Header / Matchup Banner */}
                {isSports ? (
                  /* =========================================================================
                     SPORTS CARD: BIG COUNTRY LOGOS / THUMBNAILS & REAL-TIME MATCH DETAILS
                     ========================================================================= */
                  <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-3 relative">
                    
                    {/* Live Badge & Distance */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {evt.isLiveNow ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/60 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>LIVE NOW</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> {evt.tournament ? "ICC Fixture" : "International"}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-cyan-400/90 truncate max-w-[140px]">
                          {evt.matchType}
                        </span>
                      </div>

                      {evt.distanceFromUser && (
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                          <Navigation className="w-3 h-3 text-cyan-400" />
                          {evt.distanceFromUser.split("from")[0]}
                        </span>
                      )}
                    </div>

                    {/* BIG COUNTRY LOGOS / THUMBNAILS CLASH */}
                    <div className="grid grid-cols-5 items-center bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/90 shadow-inner">
                      
                      {/* Team A (Big Thumbnail + Code) */}
                      <div className="col-span-2 flex items-center gap-2.5">
                        <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden shadow-lg border border-cyan-400/50 bg-slate-900 shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={evt.teamALogo || "https://flagcdn.com/w160/in.png"}
                            alt={evt.teamA}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-lg font-black text-cyan-400 font-heading block leading-tight">
                            {evt.teamACode || evt.teamA}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate block">
                            {evt.teamA}
                          </span>
                        </div>
                      </div>

                      {/* Glowing VS Pill */}
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-black text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 shadow-sm">
                          VS
                        </span>
                      </div>

                      {/* Team B (Code + Big Thumbnail) */}
                      <div className="col-span-2 flex items-center justify-end gap-2.5">
                        <div className="text-right min-w-0">
                          <span className="text-lg font-black text-cyan-400 font-heading block leading-tight">
                            {evt.teamBCode || evt.teamB}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate block">
                            {evt.teamB}
                          </span>
                        </div>
                        <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden shadow-lg border border-cyan-400/50 bg-slate-900 shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={evt.teamBLogo || "https://flagcdn.com/w160/au.png"}
                            alt={evt.teamB}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                    </div>

                    {/* REAL-TIME MATCH SIMULATOR / LIVE SCORE STRIP */}
                    {evt.isLiveNow ? (
                      <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/40 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span className="font-mono font-black text-white text-sm">
                              {evt.liveScore}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-cyan-300">
                            {evt.liveTarget}
                          </span>
                        </div>
                        {evt.liveBatsmen && (
                          <p className="text-[11px] text-slate-300 font-mono line-clamp-1">
                            🏏 {evt.liveBatsmen}
                          </p>
                        )}
                        {evt.liveBowler && (
                          <p className="text-[11px] text-slate-400 font-mono line-clamp-1">
                            ⚾ {evt.liveBowler}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Wind className="w-3 h-3 text-cyan-400" /> {evt.weather || "Pleasant Weather"}
                        </span>
                        <span className="text-cyan-400/90 font-bold">
                          {evt.availableTicketsCount || "Seats Available"}
                        </span>
                      </div>
                    )}

                  </div>
                ) : (
                  /* =========================================================================
                     CONCERTS / EVENTS CARD: HIGH-RES COVER + ARTIST BADGE
                     ========================================================================= */
                  <div className="relative h-52 overflow-hidden border-b border-slate-800">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md border shadow-lg ${
                        isConcert
                          ? "bg-purple-950/90 text-purple-300 border-purple-500/50"
                          : "bg-cyan-950/90 text-cyan-300 border-cyan-500/50"
                      }`}>
                        {evt.genre || evt.category}
                      </span>
                    </div>

                    {evt.distanceFromUser && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-lg">
                        <Navigation className="w-3 h-3 text-cyan-400" /> {evt.distanceFromUser.split("from")[0]}
                      </span>
                    )}

                    {evt.artist && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs font-bold text-cyan-300 line-clamp-1 drop-shadow-md">
                          ★ {evt.artist}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-400 transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    
                    <div className="text-xs text-slate-400 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {evt.date} • {evt.time}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="line-clamp-1">{evt.venue}, {evt.city}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">
                        {isSports ? "Seats from" : "Passes from"}
                      </span>
                      <p className="text-lg font-black text-cyan-400 font-mono">
                        ₹{evt.price}
                      </p>
                    </div>

                    <MovingBorderButton
                      onClick={() => handleBookTicket(evt)}
                      variant={isSports ? "emerald" : isConcert ? "purple" : "cyan"}
                      borderRadius="0.75rem"
                      containerClassName="h-10 min-w-[160px]"
                      className={`px-4 py-2 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg ${
                        isSports
                          ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                          : isConcert
                          ? "bg-purple-600 hover:bg-purple-500 text-white"
                          : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                      <span>
                        {isSports
                          ? "Select Stand & Seats"
                          : isConcert
                          ? "Select Pass Tier"
                          : "Book Event Pass"}
                      </span>
                    </MovingBorderButton>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Stadium Seating Modal */}
      {stadiumModalEvent && (
        <StadiumSeatSelectionModal
          event={stadiumModalEvent}
          onClose={() => setStadiumModalEvent(null)}
        />
      )}

      {/* Concert / Event Pass Selection Modal */}
      {concertModalEvent && (
        <ConcertSeatSelectionModal
          event={concertModalEvent}
          onClose={() => setConcertModalEvent(null)}
          onBookingSuccess={(confirmed) => {
            setConcertModalEvent(null);
            setBookingSuccessEvent(confirmed);
          }}
        />
      )}

      {/* Booking Success Confirmation Card */}
      {bookingSuccessEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                PAYMENT CONFIRMED
              </span>
              <h3 className="text-2xl font-black text-white font-heading mt-2">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Ticket ID: <strong className="text-cyan-400 font-mono">{bookingSuccessEvent.ticketId}</strong>
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <p className="text-white font-bold text-sm">{bookingSuccessEvent.title}</p>
              <p className="text-slate-300"><strong>Venue:</strong> {bookingSuccessEvent.venue}, {bookingSuccessEvent.city}</p>
              <p className="text-slate-300"><strong>Tier / Pass:</strong> {bookingSuccessEvent.tierName || "General Pass"} ({bookingSuccessEvent.quantity} person{bookingSuccessEvent.quantity > 1 ? "s" : ""})</p>
              <p className="text-slate-300"><strong>Total Paid:</strong> <span className="text-cyan-400 font-bold font-mono">₹{bookingSuccessEvent.totalPaid}</span></p>
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5 pt-1 border-t border-slate-800">
                <Smartphone className="w-3.5 h-3.5" /> Paid in real time via: {bookingSuccessEvent.paymentMethod}
              </p>
            </div>

            <button
              onClick={() => setBookingSuccessEvent(null)}
              className="w-full cyan-button py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
