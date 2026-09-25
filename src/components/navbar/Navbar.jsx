import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button as MovingBorderButton } from "../ui/moving-border";
import { useAuth } from "../../context/AuthContext";
import { useCity } from "../../context/CityContext";
import { useWishlist } from "../../context/WishlistContext";
import { PIN_TO_PIN_INDIAN_CITIES } from "../../data/seedData";
import {
  Film,
  MapPin,
  Search,
  User,
  Ticket,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Tag,
  Music,
  Trophy,
  Calendar,
  Check,
  Compass,
  Heart
} from "lucide-react";

export default function Navbar({ onOpenSearch, onReplayIntro }) {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const {
    selectedCity,
    changeCity,
    cities,
    detectLocation,
    detecting,
    autoDetectEnabled,
    toggleAutoDetect
  } = useCity();
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const navigate = useNavigate();

  const trimmedQuery = cityQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  // Filter pin-to-pin Indian cities based on user search query
  const matchedPinCities = isSearching
    ? PIN_TO_PIN_INDIAN_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmedQuery) ||
          c.state.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const handleLogoClick = (e) => {
    if (onReplayIntro) {
      onReplayIntro();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group cursor-pointer" title="Click to play CineFy Intro">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white font-heading uppercase">
                CINE<span className="cyan-gradient-text">FY</span>
              </span>
            </Link>

            {!user && (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-[11px] font-semibold tracking-wide ml-2 uppercase">
                Welcome Guest
              </span>
            )}

            {/* Location Picker Button */}
            <button
              onClick={() => setCityModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all text-sm font-medium group"
              title="Click to change or auto-detect city"
            >
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                {autoDetectEnabled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="font-semibold text-white">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold tracking-wide">
            <Link to="/" className="text-gray-200 hover:text-cyan-400 transition-colors">Home</Link>
            <Link to="/movies" className="text-gray-200 hover:text-cyan-400 transition-colors">Movies</Link>

            <Link to="/events?category=Events" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Events</span>
            </Link>
            <Link to="/events?category=Concerts" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Music className="w-4 h-4 text-purple-400" />
              <span>Concerts</span>
            </Link>
            <Link to="/events?category=Sports" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Sports</span>
            </Link>
            <Link to="/offers" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>Offers</span>
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 transition-all flex items-center gap-1.5 font-bold text-xs shadow-sm"
              title="Open Admin Login & Operations Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              title="Search Movies, Events, Actors"
            >
              <Search className="w-5 h-5" />
            </button>



            {/* User Auth Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400/80 transition-all text-sm font-semibold text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl py-2 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-cyan-400" />
                      <span>My Digital Tickets</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Wishlist</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyan-400 hover:bg-slate-800/80 transition-colors font-bold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <MovingBorderButton
                  as={Link}
                  to="/register"
                  variant="cyan"
                  borderRadius="0.75rem"
                  containerClassName="h-9 min-w-[80px]"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20"
                >
                  Register
                </MovingBorderButton>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050811] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <button
              onClick={() => { setCityModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                City: <strong className="text-white">{selectedCity}</strong>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-white">Home</Link>
              <Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-white">Movies</Link>


              <Link to="/events?category=Events" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-cyan-400">Events</Link>
              <Link to="/events?category=Concerts" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-purple-400">Concerts</Link>
              <Link to="/events?category=Sports" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-emerald-400">Sports</Link>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-cyan-400">Offers</Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Location City Selection Modal - Organized Pan-India Pin-to-Pin Picker */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            
            {/* Close Button */}
            <button
              onClick={() => setCityModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">Select Your Location</h3>
                <p className="text-xs text-slate-400">Pin-to-pin cinema hubs and theatres across all Indian states & cities</p>
              </div>
            </div>

            {/* GPS Auto-Detect Button Card */}
            <div className="mb-4 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  detectLocation();
                }}
                disabled={detecting}
                className={`w-full sm:w-auto py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  detecting
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait"
                    : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-[0.98]"
                }`}
              >
                <MapPin className={`w-4 h-4 ${detecting ? "animate-spin" : ""}`} />
                <span>{detecting ? "Detecting GPS Location..." : "Auto-Detect My Current City (GPS)"}</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
                <span className="text-slate-300 text-xs font-medium">Auto-Update On Travel</span>
                <button
                  onClick={() => toggleAutoDetect(!autoDetectEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    autoDetectEnabled ? "bg-emerald-500" : "bg-slate-800 border border-slate-700"
                  }`}
                  title="Toggle automatic location updates when traveling"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoDetectEnabled ? "translate-x-5 shadow-md" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search any Indian city, town or pin-to-pin location (e.g. Tenali, Hyderabad, Bengaluru, Vizag, Mumbai, Delhi, Kochi)..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                autoFocus
              />
              {cityQuery && (
                <button
                  onClick={() => setCityQuery("")}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Area */}
            {isSearching ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Found {matchedPinCities.length} match{matchedPinCities.length === 1 ? "" : "es"} across India</span>
                  <span className="text-[11px] text-cyan-400/90 font-medium">Current: {selectedCity}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-72 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {matchedPinCities.length > 0 ? (
                    matchedPinCities.map((c) => {
                      const isCurrent = selectedCity.toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={`${c.name}-${c.state}`}
                          onClick={() => {
                            changeCity(c.name);
                            setCityModalOpen(false);
                            setCityQuery("");
                          }}
                          className={`p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between group ${
                            isCurrent
                              ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                              : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-850 hover:text-white"
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-bold text-sm block">{c.name}</span>
                            <span className={`text-[11px] font-normal ${isCurrent ? "text-slate-900/80" : "text-slate-400"}`}>
                              {c.state}
                            </span>
                          </div>
                          {isCurrent ? (
                            <Check className="w-4 h-4 stroke-[3] shrink-0" />
                          ) : (
                            <MapPin className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-1 sm:col-span-2 text-center py-8 text-slate-400 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                      <p className="text-sm font-medium text-slate-300">No registered city matched "{cityQuery}"</p>
                      <button
                        onClick={() => {
                          changeCity(cityQuery.trim());
                          setCityModalOpen(false);
                          setCityQuery("");
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                      >
                        Set "{cityQuery.trim()}" as my location & show theatres
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Clean Empty State When Not Searching - Cities are hidden until searched */
              <div className="py-8 px-4 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <p className="text-sm font-bold text-white">Search any city or town across India</p>
                  <p className="text-xs text-slate-400">
                    Type your location above to instantly view theatres, IMAX screens, and movie showtimes in that area.
                  </p>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Currently selected: <strong className="text-cyan-400">{selectedCity}</strong>
                </div>
              </div>
            )}

            {/* Bottom Current Location Summary */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Selected: <strong className="text-white">{selectedCity}</strong></span>
              </div>
              <button
                onClick={() => setCityModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-300 font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
