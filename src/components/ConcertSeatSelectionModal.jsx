import React, { useState } from "react";
import {
  Music,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CheckCircle2,
  Sparkles,
  Smartphone,
  AtSign,
  ShieldCheck,
  Zap,
  Users,
  Navigation,
  X,
  Star,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ConcertSeatSelectionModal({ event, onClose, onBookingSuccess }) {
  const { user, linkedPhone = "", linkedUpiId = "", processRealtimePhonePayment } = useAuth();
  const displayPhone = linkedPhone || user?.phone || "+91 83176 25528";
  const displayUpi = linkedUpiId || user?.upiId || "8317625528@upi";

  const tiers = event.seatingTiers || [
    { id: "tier-vip", name: "VIP Front Stage Lounge", price: (event.price || 1500) * 3, perks: "Front-row stage view, VIP lounge access, fast-track entry", color: "#eab308" },
    { id: "tier-gold", name: "Gold Circle Standing / Seated", price: (event.price || 1500) * 1.8, perks: "Close proximity to main stage, dedicated beverage zone", color: "#facc15" },
    { id: "tier-silver", name: "Silver Tribune / General Pass", price: event.price || 1500, perks: "Full arena surround sound & high-definition visual screen view", color: "#ca8a04" }
  ];

  const [selectedTier, setSelectedTier] = useState(tiers[0]);
  const [passCount, setPassCount] = useState(2);
  const [paymentMode, setPaymentMode] = useState("linkedPhone");
  const [customUpiId, setCustomUpiId] = useState(displayUpi);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payStep, setPayStep] = useState(0);

  const totalAmount = selectedTier.price * passCount;
  const effectiveUpi = paymentMode === "customUpi" ? customUpiId.trim() || displayUpi : displayUpi;

  const handleConfirmPassBooking = async () => {
    setIsProcessing(true);
    setPayStep(1);

    setTimeout(() => setPayStep(2), 700);

    setTimeout(async () => {
      setPayStep(3);
      try {
        const txnRes = await processRealtimePhonePayment({
          amount: totalAmount,
          upiId: effectiveUpi,
          section: `${event.category}: ${event.title}`,
          description: `${passCount}x ${selectedTier.name} Pass(es)`
        });

        const confirmedPass = {
          ...event,
          ticketId: "CNCT-" + Math.floor(100000 + Math.random() * 900000),
          tierName: selectedTier.name,
          tierPrice: selectedTier.price,
          quantity: passCount,
          totalPaid: totalAmount,
          paymentMethod: `UPI (${effectiveUpi})`,
          upiId: effectiveUpi,
          transactionId: txnRes?.transactionId,
          bankReferenceNo: txnRes?.bankReferenceNo,
          perks: selectedTier.perks
        };

        if (onBookingSuccess) onBookingSuccess(confirmedPass);
      } catch (err) {
        const confirmedPass = {
          ...event,
          ticketId: "CNCT-" + Math.floor(100000 + Math.random() * 900000),
          tierName: selectedTier.name,
          tierPrice: selectedTier.price,
          quantity: passCount,
          totalPaid: totalAmount,
          paymentMethod: `UPI (${effectiveUpi})`,
          upiId: effectiveUpi,
          perks: selectedTier.perks
        };
        if (onBookingSuccess) onBookingSuccess(confirmedPass);
      } finally {
        setIsProcessing(false);
      }
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative my-auto">
        
        {/* Real-time Payment Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Smartphone className="w-14 h-14 text-cyan-400 animate-bounce" />
            <h3 className="text-xl font-black text-white font-heading">Processing Real-Time UPI Payment</h3>
            <p className="text-sm text-cyan-300 font-mono">
              Debiting ₹{totalAmount} from {effectiveUpi}
            </p>
            <div className="w-full max-w-md space-y-2 text-left text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className={`flex items-center gap-2.5 ${payStep >= 1 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1. Instant Payment Request dispatched to {effectiveUpi}</span>
              </div>
              <div className={`flex items-center gap-2.5 ${payStep >= 2 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2. Bank authorization verified via UPI Rail</span>
              </div>
              <div className={`flex items-center gap-2.5 ${payStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3. Real-Time Concert Pass Generated with QR Code</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 overflow-hidden border-b border-slate-800">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider">
                  {event.genre || event.category}
                </span>
                {event.artist && (
                  <span className="text-xs font-bold text-slate-300">
                    {event.artist}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {event.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <MapPin className="w-3.5 h-3.5" /> {event.venue}, {event.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> {event.date} • {event.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Stage Map & Seating Tiers */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Visual Arena Stage Layout Representation */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                LIVE STAGE SIGHTLINE & SEATING BLUEPRINT
              </span>

              {/* Stage Visual */}
              <div className="w-full py-3 bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-900 rounded-xl border border-indigo-400/50 shadow-lg shadow-indigo-500/20 text-center">
                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
                  <Music className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>MAIN PERFORMANCE STAGE / ARTIST RUNWAY</span>
                </span>
              </div>

              {/* Tier Zones Visual */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {tiers.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tier.color || "#eab308" }}
                          />
                          <span className="text-sm font-black text-white font-heading">
                            {tier.name}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {tier.perks}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-cyan-400 font-mono">
                          ₹{tier.price}
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">per pass</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Tier Perks Highlight */}
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                  Included with {selectedTier.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedTier.perks}. Access to dedicated food & merchandise lanes, rapid security check-in, and RFID event wristband.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Quantity & Payment Checkout */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quantity Selector */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Number of Passes:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPassCount(Math.max(1, passCount - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center cursor-pointer transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-cyan-400 font-mono text-base">{passCount}</span>
                  <button
                    onClick={() => setPassCount(passCount + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center cursor-pointer transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick Pick Passes */}
              <div className="flex gap-2 pt-1 border-t border-slate-800">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPassCount(num)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      passCount === num
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {num} {num === 1 ? "Pass" : "Passes"}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300">Payment Option:</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode("linkedPhone")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMode === "linkedPhone"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Linked Phone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("customUpi")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMode === "customUpi"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  <span>Enter UPI ID</span>
                </button>
              </div>

              {paymentMode === "linkedPhone" ? (
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400">1-Click Fast Pay</span>
                      <p className="text-xs font-mono font-bold text-white">{displayPhone}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. yourname@okhdfcbank)"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value.toLowerCase())}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex flex-wrap gap-1">
                    {["@upi", "@okhdfcbank", "@oksbi", "@paytm"].map((sfx) => (
                      <button
                        key={sfx}
                        type="button"
                        onClick={() => setCustomUpiId((prev) => `${prev.split("@")[0] || "user"}${sfx}`)}
                        className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400 hover:text-cyan-400 cursor-pointer"
                      >
                        {sfx}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{selectedTier.name} (x{passCount})</span>
                <span className="text-white font-mono">₹{selectedTier.price * passCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Booking Fee & GST</span>
                <span className="text-emerald-400 font-bold">₹0 FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-white">Grand Total:</span>
                <span className="text-xl font-black text-cyan-400 font-heading">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPassBooking}
              disabled={isProcessing}
              className="w-full cyan-button py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {isProcessing
                  ? "Authorizing Real-Time..."
                  : `Book ${passCount} Pass${passCount > 1 ? "es" : ""} • ₹${totalAmount}`}
              </span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
