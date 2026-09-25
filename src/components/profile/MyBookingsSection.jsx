import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import QRCode from "qrcode";
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Download,
  Share2,
  Printer,
  Popcorn,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  ShieldCheck,
  Check,
  Search,
  ArrowRight,
  Film,
  Music,
  Trophy,
  Loader2,
  Copy
} from "lucide-react";

// Robust canvas renderer that produces a crisp 1200x540 cinema boarding pass PNG
async function drawTicketToCanvas(booking, qrDataUrl) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 1200, 540);
  grad.addColorStop(0, "#090d16");
  grad.addColorStop(0.5, "#0f172a");
  grad.addColorStop(1, "#030712");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 540);

  // Border & Yellow Accent
  ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 1168, 508);

  // Header Ribbon
  ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
  ctx.fillRect(18, 18, 1164, 60);

  // Brand Name
  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("CINEFY", 40, 56);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("OFFICIAL DIGITAL CINEMA PASS", 150, 55);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "14px monospace";
  ctx.fillText(`BOOKING ID: #${booking?.id || "PASS"}`, 880, 55);

  // Movie Details
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(booking?.movieTitle || "Movie Title", 40, 130);

  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(`Cinema: ${booking?.theatreName || "Multiplex"}`, 40, 170);

  if (booking?.screenName || booking?.screenType) {
    ctx.fillStyle = "#94A3B8";
    ctx.font = "15px sans-serif";
    ctx.fillText(`${booking.screenName || "Screen 1"} • ${booking.screenType || "4K Dolby Atmos"}`, 40, 200);
  }

  // Info Box
  ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
  ctx.fillRect(40, 230, 750, 110);
  ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 230, 750, 110);

  // Date
  ctx.fillStyle = "#64748B";
  ctx.font = "12px sans-serif";
  ctx.fillText("SHOW DATE", 60, 260);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(booking?.showDate || "Today", 60, 295);

  // Time
  ctx.fillStyle = "#64748B";
  ctx.font = "12px sans-serif";
  ctx.fillText("SHOW TIME", 300, 260);
  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(booking?.showTime || "07:30 PM", 300, 295);

  // Seats
  const seatStr = Array.isArray(booking?.seats)
    ? booking.seats.map((s) => (typeof s === "object" ? s.id || `${s.row}${s.number}` : s)).join(", ")
    : String(booking?.seats || "Confirmed");
  ctx.fillStyle = "#64748B";
  ctx.font = "12px sans-serif";
  ctx.fillText("CONFIRMED SEATS", 540, 260);
  ctx.fillStyle = "#34D399";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(seatStr, 540, 295);

  // Snacks & Total
  ctx.fillStyle = "#94A3B8";
  ctx.font = "15px sans-serif";
  ctx.fillText(`Total Paid: ₹${booking?.totalAmount || 0} (${booking?.paymentMethod || "UPI/Online"})`, 40, 390);

  ctx.fillStyle = "#10B981";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("✓ Verified Scannable Boarding Pass • Google Lens & Audi Scanner Compatible", 40, 430);

  // Perforation Line
  ctx.strokeStyle = "rgba(71, 85, 105, 0.7)";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(830, 80);
  ctx.lineTo(830, 520);
  ctx.stroke();
  ctx.setLineDash([]);

  // QR Code on the right stub
  if (qrDataUrl) {
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
      qrImg.src = qrDataUrl;
    });

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(890, 130, 230, 230);
    ctx.drawImage(qrImg, 900, 140, 210, 210);

    ctx.fillStyle = "#34D399";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Google Lens Scannable", 930, 390);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px monospace";
    ctx.fillText(`PASS ID: #${booking?.id || "PASS"}`, 920, 420);
  }

  return canvas.toDataURL("image/png");
}

export default function MyBookingsSection({ isEmbedded = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("UPCOMING"); // 'UPCOMING' | 'PAST' | 'ALL'
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quick View QR Modal state
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [modalQrCodeUrl, setModalQrCodeUrl] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/my");
      const list = res.data.bookings || (Array.isArray(res.data) ? res.data : []);
      setBookings(list);
    } catch (err) {
      console.error("Error loading my bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to test if a booking is upcoming or past
  const isBookingUpcoming = (b) => {
    if (b.status === "CANCELLED") return false;
    if (b.status === "COMPLETED") return false;

    // Check showDate against today
    if (b.showDate) {
      const todayStr = new Date().toISOString().split("T")[0];
      if (b.showDate >= todayStr) return true;
    }
    return b.status === "ACTIVE" || b.status === "CONFIRMED";
  };

  const upcomingBookings = bookings.filter((b) => isBookingUpcoming(b));
  const pastBookings = bookings.filter((b) => !isBookingUpcoming(b));

  // Filter based on tab and search query
  const getTabFilteredBookings = () => {
    let list = bookings;
    if (activeTab === "UPCOMING") list = upcomingBookings;
    if (activeTab === "PAST") list = pastBookings;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (b) =>
        b.movieTitle?.toLowerCase().includes(q) ||
        b.theatreName?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.bookingRef?.toLowerCase().includes(q) ||
        b.showDate?.includes(q)
    );
  };

  const filteredList = getTabFilteredBookings();

  // Open Quick View Modal & Generate QR
  const handleOpenTicketModal = async (booking) => {
    setSelectedBookingForModal(booking);
    const liveTicketUrl = `${window.location.origin}/booking-success/${booking.id}`;
    try {
      const dataUrl = await QRCode.toDataURL(liveTicketUrl, {
        margin: 1,
        width: 320,
        color: { dark: "#020617", light: "#FFFFFF" },
        errorCorrectionLevel: "H"
      });
      setModalQrCodeUrl(dataUrl);
    } catch (e) {
      console.error("QR Code generate err:", e);
      setModalQrCodeUrl(booking.qrCode || "");
    }
  };

  // Download 1200x540 PNG ticket
  const handleDownloadTicket = async (booking, e) => {
    if (e) e.stopPropagation();
    if (downloadingId) return;

    try {
      setDownloadingId(booking.id);
      const liveTicketUrl = `${window.location.origin}/booking-success/${booking.id}`;
      const qrDataUrl = await QRCode.toDataURL(liveTicketUrl, {
        margin: 1,
        width: 320,
        color: { dark: "#020617", light: "#FFFFFF" },
        errorCorrectionLevel: "H"
      });

      const pngData = await drawTicketToCanvas(booking, qrDataUrl);
      const link = document.createElement("a");
      link.href = pngData;
      link.download = `CineFy_Pass_${booking.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading ticket:", err);
      // Fallback navigate to success page
      navigate(`/booking-success/${booking.id}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Share or copy link
  const handleShareBooking = async (booking, e) => {
    if (e) e.stopPropagation();
    const liveUrl = `${window.location.origin}/booking-success/${booking.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CineFy Ticket - ${booking.movieTitle}`,
          text: `Digital ticket for ${booking.movieTitle} at ${booking.theatreName}. Seats: ${Array.isArray(booking.seats) ? booking.seats.map((s) => s.id || s).join(", ") : booking.seats}`,
          url: liveUrl
        });
        return;
      } catch (err) {
        // Fallback to copy
      }
    }
    navigator.clipboard.writeText(liveUrl);
    setCopiedId(booking.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper for human-readable relative date badge
  const getRelativeDateBadge = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const showD = new Date(dateStr);
    showD.setHours(0, 0, 0, 0);

    const diffDays = Math.round((showD - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider animate-pulse">Today</span>;
    }
    if (diffDays === 1) {
      return <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">Tomorrow</span>;
    }
    if (diffDays > 1) {
      return <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">In {diffDays} Days</span>;
    }
    return <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">Past Show</span>;
  };

  return (
    <section className="space-y-6">
      
      {/* Section Header & Interactive Filter Bar */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                  My Digital Tickets & Bookings
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-black">
                  {bookings.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Past & upcoming cinema admissions, stadium match passes, live events & QR tickets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/movies"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Book Showtimes</span>
            </Link>
          </div>
        </div>

        {/* Quick Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Upcoming Shows</span>
            <p className="text-xl font-black text-emerald-400 font-heading">{upcomingBookings.length}</p>
            <span className="text-[10px] text-slate-400">Ready for scan at gate</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Past Movies Watched</span>
            <p className="text-xl font-black text-cyan-400 font-heading">{pastBookings.length}</p>
            <span className="text-[10px] text-slate-400">Completed experiences</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Confirmed Passes</span>
            <p className="text-xl font-black text-white font-heading">{bookings.length}</p>
            <span className="text-[10px] text-slate-400">Digital E-passes issued</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Linked Phone / QR Access</span>
            <p className="text-sm font-black text-cyan-400 font-mono truncate">{user?.phone || "+91 83176 25528"}</p>
            <span className="text-[10px] text-emerald-400 font-medium">1-Click Auto Verify</span>
          </div>
        </div>

        {/* Filter Navigation Tabs & Search Input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          
          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab("UPCOMING")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "UPCOMING"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Upcoming Bookings ({upcomingBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("PAST")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "PAST"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Past Bookings ({pastBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "ALL"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>All Tickets ({bookings.length})</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by movie title, cinema, date, or booking #ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Bookings List Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800/60" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-heading">
              {searchQuery ? `No tickets match "${searchQuery}"` : `No ${activeTab.toLowerCase()} bookings found`}
            </h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              {activeTab === "UPCOMING"
                ? "You don't have any upcoming show bookings. Explore today's blockbusters, concerts, and cricket match tickets!"
                : "No past bookings recorded in your history."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/movies"
              className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-slate-950" />
              <span>Explore Now Showing Movies</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((b) => {
            const isUpcoming = isBookingUpcoming(b);
            const seatList = Array.isArray(b.seats)
              ? b.seats.map((s) => (typeof s === "object" ? s.id || `${s.row}${s.number}` : s)).join(", ")
              : String(b.seats || "Confirmed");
            
            const foodItemsList = b.foodItems || b.foodOrders || [];
            const hasFood = Array.isArray(foodItemsList) && foodItemsList.length > 0;

            return (
              <div
                key={b.id}
                className={`bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 rounded-3xl p-5 sm:p-6 border transition-all duration-300 hover:shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 group ${
                  isUpcoming
                    ? "border-cyan-500/40 hover:border-cyan-500/80 shadow-cyan-500/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Left Poster & Show Information */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 min-w-0">
                  
                  {/* Poster Thumbnail */}
                  {!(b.bookingType === "STADIUM" || /stadium|cricket|ipl|t20/i.test(b.movieTitle || "") || /stadium|arena/i.test(b.theatreName || "")) && (
                    <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <img
                        src={b.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400"}
                        alt={b.movieTitle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {b.bookingType === "CONCERT" ? (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-purple-500/90 text-white text-[9px] font-black uppercase">
                          Concert
                        </span>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-cyan-500/90 text-slate-950 text-[9px] font-black uppercase">
                          Cinema
                        </span>
                      )}
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    
                    {/* Top Tag Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        #{b.id}
                      </span>

                      {getRelativeDateBadge(b.showDate)}

                      {isUpcoming ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Confirmed & Active</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
                          {b.status || "Completed"}
                        </span>
                      )}

                      {b.screenType && (
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 text-[10px] font-semibold border border-slate-700">
                          {b.screenType}
                        </span>
                      )}
                    </div>

                    {/* Movie / Show Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white font-heading leading-tight truncate">
                        {b.movieTitle}
                      </h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-300 font-semibold">{b.theatreName}</span>
                        {b.screenName && <span className="text-slate-500">• {b.screenName}</span>}
                      </p>
                    </div>

                    {/* Show Timing & Seats */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-300 pt-0.5">
                      <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <strong className="text-white">{b.showDate}</strong>
                      </span>

                      <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <strong className="text-cyan-400">{b.showTime}</strong>
                      </span>

                      <span className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-400">Seats:</span>
                        <strong className="text-emerald-400">{seatList}</strong>
                      </span>
                    </div>

                    {/* F&B Snacks Ordered (if any) */}
                    {hasFood && (
                      <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                        <Popcorn className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-white">Pre-ordered Snacks:</span>
                        <span className="text-[11px] text-cyan-200">
                          {foodItemsList.map((f) => `${f.quantity || 1}x ${f.name}`).join(", ")}
                        </span>
                      </div>
                    )}

                  </div>

                </div>

                {/* Right Action & QR Hub */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 shrink-0">
                  
                  {/* Price info */}
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Paid Amount</span>
                    <p className="text-xl font-black text-cyan-400 font-heading">₹{b.totalAmount}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {b.paymentMethod || "UPI / 1-Click Pay"}
                    </span>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    
                    {/* View QR Ticket (Modal trigger) */}
                    <button
                      id={`btn-view-qr-${b.id}`}
                      onClick={() => handleOpenTicketModal(b)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 cursor-pointer"
                      title="View scannable QR pass"
                    >
                      <QrCode className="w-4 h-4 text-slate-950" />
                      <span>View QR Ticket</span>
                    </button>

                    {/* Download Ticket PNG */}
                    <button
                      id={`btn-download-${b.id}`}
                      onClick={(e) => handleDownloadTicket(b, e)}
                      disabled={downloadingId === b.id}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                      title="Download printable PNG ticket"
                    >
                      {downloadingId === b.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline text-[11px]">Save PNG</span>
                    </button>

                    {/* Share / Copy Ticket Link */}
                    <button
                      id={`btn-share-${b.id}`}
                      onClick={(e) => handleShareBooking(b, e)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                      title="Share ticket link"
                    >
                      {copiedId === b.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Full E-Pass link */}
                    <Link
                      to={`/booking-success/${b.id}`}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400/60 text-slate-400 hover:text-cyan-400 text-xs transition-colors"
                      title="Open full digital boarding pass page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= QUICK VIEW QR TICKET MODAL ================= */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-[#0b0f19] border border-cyan-500/40 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[95vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedBookingForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  CineFy Digital E-Boarding Pass
                </h3>
                <p className="text-[11px] text-slate-400">
                  Gate entry QR code for <strong className="text-cyan-400">#{selectedBookingForModal.id}</strong>
                </p>
              </div>
            </div>

            {/* Ticket Card Body */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4 text-center">
              
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white font-heading">
                  {selectedBookingForModal.movieTitle}
                </h4>
                <p className="text-xs text-cyan-400 font-semibold">
                  {selectedBookingForModal.theatreName} • {selectedBookingForModal.screenName || "Audi 1"}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-2xl shadow-xl inline-block border-2 border-cyan-400/60 mx-auto">
                {modalQrCodeUrl ? (
                  <img
                    src={modalQrCodeUrl}
                    alt="Cinema Entry QR Code"
                    className="w-44 sm:w-52 h-44 sm:h-52 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs font-mono">
                    Loading QR...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold">
                <Smartphone className="w-4 h-4" />
                <span>Google Lens & Cinema Scanner Ready</span>
              </div>

              {/* Show info summary grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-left">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Date</span>
                  <strong className="text-white text-xs">{selectedBookingForModal.showDate}</strong>
                </div>
                <div className="border-x border-slate-800 px-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Time</span>
                  <strong className="text-cyan-400 text-xs">{selectedBookingForModal.showTime}</strong>
                </div>
                <div className="pl-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Seats</span>
                  <strong className="text-emerald-400 text-xs truncate block">
                    {Array.isArray(selectedBookingForModal.seats)
                      ? selectedBookingForModal.seats.map((s) => s.id || s).join(", ")
                      : selectedBookingForModal.seats}
                  </strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Total Paid: <strong className="text-white font-mono">₹{selectedBookingForModal.totalAmount}</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Turnstile Verified
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleDownloadTicket(selectedBookingForModal)}
                disabled={downloadingId === selectedBookingForModal.id}
                className="cyan-button p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Pass</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print Pass</span>
              </button>

              <Link
                to={`/booking-success/${selectedBookingForModal.id}`}
                className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>Full Screen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
