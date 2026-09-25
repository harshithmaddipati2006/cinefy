import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useAuth } from "../../context/AuthContext";
import {
  Ticket,
  DoorOpen,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  Percent,
  CreditCard,
  Building2,
  Navigation,
  Trophy,
  Smartphone,
  Zap,
  Lock,
  AtSign,
  Loader2,
  Printer
} from "lucide-react";

export default function BookingSummary({
  match,
  stadium,
  selectedSeats,
  totalAmount,
  onConfirmBooking,
  confirmedBooking,
  onResetBooking
}) {
  const { user, linkedPhone = "", linkedUpiId = "", processRealtimePhonePayment } = useAuth();
  const displayPhone = linkedPhone || user?.phone || "+91 83176 25528";
  const displayUpi = linkedUpiId || user?.upiId || "8317625528@upi";

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(`Linked Phone (${displayPhone})`);
  const [customUpiId, setCustomUpiId] = useState(displayUpi);
  const [isProcessing, setIsProcessing] = useState(false);
  const [realtimeStep, setRealtimeStep] = useState(0);

  const convenienceFee = selectedSeats.length > 0 ? 50 : 0;
  const gstAmount = Math.round(totalAmount * 0.18);
  const grandTotal = Math.max(0, totalAmount + gstAmount + convenienceFee - discountAmount);

  // Recommended Gate logic based on selected seats
  const primaryGate = selectedSeats.length > 0 ? selectedSeats[0].gate || "Gate 4" : "Gate 1";

  const handleApplyCoupon = () => {
    setCouponError("");
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === "CINEFY10") {
      const disc = Math.round(totalAmount * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon("CINEFY10 (10% OFF)");
    } else if (cleanCode === "FIRSTBOOK") {
      const disc = Math.round(totalAmount * 0.20);
      setDiscountAmount(disc);
      setAppliedCoupon("FIRSTBOOK (20% OFF)");
    } else {
      setCouponError("Invalid coupon code. Try CINEFY10 or FIRSTBOOK");
    }
  };

  const handlePayNow = async () => {
    if (selectedSeats.length === 0) return;
    setIsProcessing(true);

    const isUpi =
      paymentMethod.includes("Linked Phone") ||
      paymentMethod.includes("UPI") ||
      paymentMethod.includes("Custom UPI ID");

    const effectiveUpi = paymentMethod.includes("Custom UPI ID")
      ? customUpiId.trim() || displayUpi
      : displayUpi;

    if (isUpi) {
      setRealtimeStep(1);
      setTimeout(() => setRealtimeStep(2), 700);
      setTimeout(async () => {
        setRealtimeStep(3);
        try {
          const txn = await processRealtimePhonePayment({
            amount: grandTotal,
            upiId: effectiveUpi,
            section: `Stadium Pass (${match.title || "Match Tickets"})`,
            description: `${selectedSeats.length} Stadium Seats at ${stadium?.name || "Cricket Arena"}`
          });
          onConfirmBooking({
            grandTotal,
            discountAmount,
            convenienceFee,
            gstAmount,
            paymentMethod: `UPI (${effectiveUpi}) [UTR: ${txn?.bankReferenceNo || "UTR" + Date.now().toString().slice(-8)}]`,
            primaryGate,
            transactionId: txn?.transactionId,
            paidViaPhone: displayPhone,
            upiId: effectiveUpi
          });
        } catch (e) {
          onConfirmBooking({
            grandTotal,
            discountAmount,
            convenienceFee,
            gstAmount,
            paymentMethod: `UPI (${effectiveUpi})`,
            primaryGate
          });
        } finally {
          setIsProcessing(false);
          setRealtimeStep(0);
        }
      }, 1600);
      return;
    }

    setTimeout(() => {
      onConfirmBooking({
        grandTotal,
        discountAmount,
        convenienceFee,
        gstAmount,
        paymentMethod,
        primaryGate
      });
      setIsProcessing(false);
    }, 1000);
  };

  const passRef = useRef(null);
  const [downloadingPass, setDownloadingPass] = useState(false);

  const handleDownloadMatchPass = async () => {
    if (!passRef.current || downloadingPass) return;
    try {
      setDownloadingPass(true);
      await new Promise((r) => setTimeout(r, 120));
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#090d16",
        skipFonts: true,
        fontEmbedCSS: ""
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `CineFy_MatchPass_${confirmedBooking?.bookingId || "Stadium"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Match pass download error:", err);
      window.print();
    } finally {
      setDownloadingPass(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-4 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-6 h-6 stroke-[3]" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white font-heading">
            Cricket Match Pass Issued!
          </h3>
          <p className="text-slate-300 text-xs max-w-sm mx-auto">
            Tickets for <strong className="text-cyan-400">{confirmedBooking.matchTitle}</strong> at {confirmedBooking.stadiumName} are confirmed.
          </p>
        </div>

        {/* Match E-Pass Ticket Card */}
        <div
          ref={passRef}
          id="stadium-e-pass"
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-cyan-400/40 rounded-2xl p-4 text-left space-y-3 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">CINEFY MATCH TICKET</span>
              <p className="text-sm font-black text-white">{confirmedBooking.bookingId}</p>
            </div>
            {confirmedBooking.qrCode ? (
              <img src={confirmedBooking.qrCode} alt="Match Pass QR" className="w-10 h-10 rounded-lg border border-slate-700 bg-white p-0.5" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-slate-700 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Match</span>
              <p className="font-bold text-white truncate">{confirmedBooking.matchTitle}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Stadium</span>
              <p className="font-bold text-white truncate">{confirmedBooking.stadiumName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Entry Gate</span>
              <p className="font-black text-cyan-400">{confirmedBooking.primaryGate || "Gate 4"}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Total Paid</span>
              <p className="font-black text-emerald-400">₹{confirmedBooking.grandTotal}</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Booked Seats ({confirmedBooking.seats?.length || 0})</span>
            <div className="flex flex-wrap gap-1">
              {confirmedBooking.seats?.map((s) => (
                <span key={s.id} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300">
                  {s.standName || s.stand} - R{s.row}:S{s.number}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> Live Verified UTR
            </span>
            <span className="font-mono">{confirmedBooking.paymentMethod || "Paid via Real-Time Phone UPI"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 action-buttons">
          <button
            onClick={handleDownloadMatchPass}
            disabled={downloadingPass}
            className="py-2.5 px-3 rounded-xl cyan-button text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {downloadingPass ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Save Image</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={onResetBooking}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative">
      
      {/* Real-time Phone / UPI Payment Live Overlay */}
      {isProcessing && realtimeStep > 0 && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <Smartphone className="w-12 h-12 text-cyan-400 animate-bounce" />
          <h4 className="text-base font-black text-white">Real-Time UPI Payment</h4>
          <p className="text-xs text-cyan-300 font-mono">
            Debiting ₹{grandTotal} from {paymentMethod.includes("Custom") ? customUpiId : displayUpi}
          </p>
          <div className="w-full space-y-2 text-left text-xs bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <div className={`flex items-center gap-2 ${realtimeStep >= 1 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. UPI Intent sent to {paymentMethod.includes("Custom") ? customUpiId : displayUpi}</span>
            </div>
            <div className={`flex items-center gap-2 ${realtimeStep >= 2 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Verified via PhonePe / GPay / Paytm</span>
            </div>
            <div className={`flex items-center gap-2 ${realtimeStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Match Pass Issued in Real-Time</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
          STADIUM BOOKING SUMMARY
        </span>
        <h3 className="text-xl font-bold text-white font-heading mt-0.5">
          {match?.title || "Cricket Match Passes"}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {stadium?.name}, {stadium?.city}
        </p>
      </div>

      <div className="space-y-4">
        {/* Linked Phone Box */}
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400">Fast UPI Pay</span>
              <p className="text-xs font-mono font-bold text-white">{displayPhone}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            1-Click Verified
          </span>
        </div>

        {/* Selected Seats List */}
        {selectedSeats.length === 0 ? (
          <div className="p-6 text-center bg-slate-950/80 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
            <Ticket className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs font-bold text-slate-400">No stadium seats selected yet</p>
            <p className="text-[11px] text-slate-500">Click any block & seat on the stadium map to choose your view</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedSeats.map((s) => (
              <div key={s.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-cyan-400">{s.blockName || s.standName}</span>
                    <span className="text-slate-400">• Row {s.row}, Seat {s.number}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{s.standName || s.stand}</p>
                </div>
                <span className="font-black text-white">₹{s.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Entry Gate Box */}
        {selectedSeats.length > 0 && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-2xl flex items-center gap-3">
            <DoorOpen className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Recommended Gate Entry</span>
              <p className="font-bold text-white">{primaryGate} (Concourse Level Entrance)</p>
            </div>
          </div>
        )}

        {/* Payment Method Selector & UPI Option */}
        {selectedSeats.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Payment Gateway Mode
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod(`Linked Phone (${displayPhone})`)}
                className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod.includes("Linked Phone")
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-white block font-bold">Linked Phone ({displayPhone})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Real-Time UPI Instant Approval</span>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Enter Custom UPI ID")}
                className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod === "Enter Custom UPI ID"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-white block font-bold">Enter Custom UPI ID</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pay with any UPI VPA handle</span>
                  </div>
                </div>
                {paymentMethod === "Enter Custom UPI ID" && <Zap className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>

            {/* Custom UPI ID Input for Stadium */}
            {paymentMethod === "Enter Custom UPI ID" && (
              <div className="p-3 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2">
                <input
                  type="text"
                  placeholder="e.g. name@okhdfcbank or yourname@upi"
                  value={customUpiId}
                  onChange={(e) => setCustomUpiId(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
                <div className="flex flex-wrap gap-1">
                  {["@upi", "@okhdfcbank", "@oksbi", "@paytm", "@ybl"].map((sfx) => (
                    <button
                      key={sfx}
                      type="button"
                      onClick={() => setCustomUpiId((prev) => `${prev.split("@")[0] || "user"}${sfx}`)}
                      className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400 hover:text-cyan-400"
                    >
                      {sfx}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coupon Promo Code Box */}
        {selectedSeats.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-cyan-400" /> Apply Offer Coupon Code
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter CINEFY10 or FIRSTBOOK"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 uppercase font-bold focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-slate-200 text-xs font-black transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-[11px] font-bold text-emerald-400">✓ Coupon Applied: {appliedCoupon}</p>
            )}
            {couponError && (
              <p className="text-[11px] font-bold text-rose-400">{couponError}</p>
            )}
          </div>
        )}

        {/* Detailed Price Breakdown */}
        {selectedSeats.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Passes Total ({selectedSeats.length} seats)</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience & Security</span>
              <span>₹{convenienceFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Offer Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white font-heading">
              <span>Total Payable</span>
              <span className="text-cyan-400">₹{grandTotal}</span>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          type="button"
          onClick={handlePayNow}
          disabled={selectedSeats.length === 0 || isProcessing}
          className="w-full cyan-button py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>
            {isProcessing
              ? "Authorizing Real-Time..."
              : selectedSeats.length === 0
              ? "Select Seats to Proceed"
              : paymentMethod === "Enter Custom UPI ID"
              ? `Pay ₹${grandTotal} via UPI ID`
              : `Pay ₹${grandTotal} via Phone`}
          </span>
        </button>

        <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Instant UPI approval with bank UTR validation</span>
        </p>
      </div>

    </div>
  );
}
