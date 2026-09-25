import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Button as MovingBorderButton } from "../components/ui/moving-border";
import API from "../services/api";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import {
  Ticket,
  Film,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Download,
  Share2,
  Home,
  Popcorn,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Info,
  Printer,
  Loader2,
  ArrowRight,
  Tv
} from "lucide-react";

// Robust fallback canvas drawer that generates a crisp 1200x520 cinema boarding pass PNG
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
  ctx.fillText("DIGITAL CINEMA BOARDING PASS", 150, 55);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "14px monospace";
  ctx.fillText(`BOOKING ID: #${booking?.id || "PASS"}`, 880, 55);

  // Movie Details
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText(booking?.movieTitle || "Movie", 40, 130);

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
  ctx.fillText("✓ Verified Digital Entry Pass • Scannable at Audi Turnstile", 40, 430);

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

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [qrDataUrl, setQrDataUrl] = useState(booking?.qrCode || "");
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!booking) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bookings/${bookingId}`);
      if (res.data.booking) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.log("Error fetching booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate authentic QR Code encoding live verification URL
  useEffect(() => {
    const activeBookingId = booking?.id || bookingId;
    if (activeBookingId) {
      const liveTicketUrl = `${window.location.origin}/booking-success/${activeBookingId}`;
      QRCode.toDataURL(liveTicketUrl, {
        margin: 1,
        width: 320,
        color: { dark: "#020617", light: "#FFFFFF" },
        errorCorrectionLevel: "H"
      })
        .then((dataUrl) => {
          setQrDataUrl(dataUrl);
        })
        .catch((err) => {
          console.error("QR Code generation error:", err);
          if (booking?.qrCode) setQrDataUrl(booking.qrCode);
        });
    }
  }, [booking?.id, bookingId]);

  const liveVerificationUrl = `${window.location.origin}/booking-success/${booking?.id || bookingId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveVerificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CineFy Ticket - ${booking?.movieTitle || "Movie"}`,
          text: `CineFy digital ticket for ${booking?.movieTitle} at ${booking?.theatreName}. Seats: ${booking?.seats?.map((s) => s.id || s).join(", ")}`,
          url: liveVerificationUrl
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Download ticket as high-resolution PNG image
  const handleDownloadTicket = async () => {
    if (downloading) return;
    try {
      setDownloading(true);
      let dataUrl = "";

      if (ticketRef.current) {
        try {
          await new Promise((r) => setTimeout(r, 120));
          dataUrl = await toPng(ticketRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#090d16",
            skipFonts: true,
            fontEmbedCSS: ""
          });
        } catch (toPngErr) {
          console.warn("toPng capture fallback to canvas:", toPngErr);
        }
      }

      // If toPng produced nothing or threw error, run direct 2D Canvas renderer
      if (!dataUrl) {
        dataUrl = await drawTicketToCanvas(booking, qrDataUrl);
      }

      const downloadLink = document.createElement("a");
      const ticketFileName = `CineFy_Ticket_${booking?.id || "Pass"}.png`;
      downloadLink.href = dataUrl;
      downloadLink.download = ticketFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to generate ticket download:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-semibold">Generating your digital cinema ticket & QR Code...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-400 space-y-3">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 inline-block">
          <Info className="w-6 h-6 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-white font-heading">Digital Ticket Not Found</h2>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          We couldn't retrieve this booking ID. Please check your account bookings.
        </p>
        <div className="pt-2">
          <MovingBorderButton
            as={Link}
            to="/"
            variant="cyan"
            borderRadius="0.75rem"
            containerClassName="h-10 min-w-[120px]"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 font-bold text-xs uppercase shadow-lg shadow-cyan-500/20"
          >
            Go to Home
          </MovingBorderButton>
        </div>
      </div>
    );
  }

  const foodOrdersList = booking.foodOrders || [];
  const hasFoodOrders = Array.isArray(foodOrdersList) && foodOrdersList.length > 0;
  const foodTotal = foodOrdersList.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // Normalize seat display strings
  const seatListStr = Array.isArray(booking.seats)
    ? booking.seats.map((s) => (typeof s === "object" ? s.id || `${s.row}${s.number}` : s)).join(", ")
    : String(booking.seats || "");

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 pb-12">
      
      {/* Compact Success Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white font-heading leading-tight">
              Booking Confirmed!
            </h1>
            <p className="text-[11px] text-emerald-300 font-medium">
              E-Ticket generated • Scannable at cinema turnstile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30">
            #{booking.id}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </div>
      </div>

      {/* ================= COMPACT CINEMA DIGITAL BOARDING PASS / TICKET ================= */}
      <div
        ref={ticketRef}
        id="cinefy-digital-ticket"
        className="relative bg-gradient-to-br from-slate-900 via-[#0a0f1d] to-slate-950 rounded-2xl sm:rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl transition-all"
      >
        {/* Ticket Header Ribbon */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-dashed border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-wider text-white font-heading uppercase">
                CINE<span className="cyan-gradient-text">FY</span>
              </span>
              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest hidden sm:inline">
                OFFICIAL DIGITAL PASS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <span className="hidden sm:inline">Audi Gate Entry Pass</span>
            <span className="font-mono text-cyan-400 font-bold">#{booking.id}</span>
          </div>
        </div>

        {/* Ticket Main Body - 2-Column Compact Layout on Desktop */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 relative">
          
          {/* Left / Primary Section (Movie Details, Seats, Snacks, Pricing) */}
          <div className="flex-1 space-y-3.5 min-w-0">
            
            {/* Movie Title & Cinema Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black text-white font-heading leading-tight truncate">
                  {booking.movieTitle}
                </h3>
                {booking.language && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-cyan-300">
                    {booking.language}
                  </span>
                )}
                {booking.screenType && (
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold text-cyan-400">
                    {booking.screenType}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-cyan-400 font-bold">{booking.theatreName}</span>
                {booking.screenName && <span className="text-slate-400">• {booking.screenName}</span>}
              </p>
            </div>

            {/* Compact 3-Column Info Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Date
                </span>
                <p className="font-bold text-white text-xs sm:text-sm truncate">{booking.showDate}</p>
              </div>

              <div className="space-y-0.5 border-x border-slate-800 px-2">
                <span className="text-[10px] text-slate-500 uppercase font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Time
                </span>
                <p className="font-bold text-cyan-400 text-xs sm:text-sm truncate">{booking.showTime}</p>
              </div>

              <div className="space-y-0.5 pl-1">
                <span className="text-[10px] text-slate-500 uppercase font-medium flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-emerald-400" /> Seats
                </span>
                <p className="font-black text-emerald-400 text-xs sm:text-sm truncate" title={seatListStr}>
                  {seatListStr || "Confirmed"}
                </p>
              </div>
            </div>

            {/* Snacks Ordered Compact Strip (if any) */}
            {hasFoodOrders && (
              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Popcorn className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 font-medium text-[11px] truncate">
                    {foodOrdersList.map((f) => `${f.quantity || 1}x ${f.name}`).join(", ")}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
                  Pick-up: #FD-{booking.id?.slice(-4) || "88"}
                </span>
              </div>
            )}

            {/* Compact Total Payment Strip */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Total Paid:</span>
                <span className="text-base sm:text-lg font-black text-cyan-400 font-heading">
                  ₹{booking.totalAmount}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {booking.paymentMethod || "UPI / Online"} • Gate Pass Active
              </span>
            </div>

          </div>

          {/* Ticket Perforation Divider with Notch Circles on Medium+ screens */}
          <div className="hidden md:flex flex-col items-center justify-between relative px-2">
            <div className="w-4 h-4 rounded-full bg-[#050811] -mt-5 -ml-0 border-b border-cyan-500/30" />
            <div className="w-0.5 flex-1 border-l-2 border-dashed border-slate-700/80 my-1" />
            <div className="w-4 h-4 rounded-full bg-[#050811] -mb-5 -ml-0 border-t border-cyan-500/30" />
          </div>

          {/* Mobile Horizontal Divider */}
          <div className="md:hidden border-t-2 border-dashed border-slate-800 my-1 relative">
            <div className="w-4 h-4 rounded-full bg-[#050811] absolute -left-6 -top-2 border-r border-cyan-500/30" />
            <div className="w-4 h-4 rounded-full bg-[#050811] absolute -right-6 -top-2 border-l border-cyan-500/30" />
          </div>

          {/* Right / Stub Section (High-Resolution Google Lens QR Code & Gatepass) */}
          <div className="w-full md:w-52 shrink-0 flex flex-col items-center justify-center text-center p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
            
            <div className="bg-white p-2.5 rounded-xl shadow-lg border border-cyan-400/40 w-32 sm:w-36 aspect-square flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scannable QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-[10px] font-mono text-slate-600">Generating QR...</div>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-bold">
                <Smartphone className="w-3 h-3" />
                <span>Google Lens Scannable</span>
              </div>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                ENTRY PASS: {booking.id}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Download Status Toast */}
      {downloadSuccess && (
        <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-fade-in text-center">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Ticket saved and downloaded to your device successfully!</span>
        </div>
      )}

      {/* ================= ACTION TOOLBAR ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 action-buttons">
        
        {/* Primary Download Button */}
        <MovingBorderButton
          id="btn-download-ticket"
          onClick={handleDownloadTicket}
          disabled={downloading}
          variant="cyan"
          borderRadius="0.75rem"
          containerClassName="col-span-2 sm:col-span-1 h-12"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 sm:p-3 w-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-75"
          title="Download printable PNG ticket image"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-950" />
              <span>Save / Download</span>
            </>
          )}
        </MovingBorderButton>

        {/* Print / PDF Button */}
        <button
          id="btn-print-ticket"
          onClick={handlePrint}
          className="p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          title="Print or save as PDF"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / PDF</span>
        </button>

        {/* Share Button */}
        <button
          id="btn-share-ticket"
          onClick={handleShareTicket}
          className="p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
          <span>{copiedLink ? "Link Copied!" : "Share"}</span>
        </button>

        {/* My Bookings Link */}
        <Link
          to="/my-bookings"
          className="p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
        >
          <Ticket className="w-4 h-4 text-cyan-400" />
          <span>My Tickets</span>
        </Link>

        {/* Book More Movies */}
        <Link
          to="/"
          className="p-2.5 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 text-center transition"
        >
          <Home className="w-4 h-4" />
          <span>Book More</span>
        </Link>

      </div>

      {/* Direct Test Link info */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
        <span className="font-mono truncate mr-2">Live Web QR URL: {liveVerificationUrl}</span>
        <button
          onClick={handleCopyLink}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copiedLink ? "Copied" : "Copy"}</span>
        </button>
      </div>

    </div>
  );
}
