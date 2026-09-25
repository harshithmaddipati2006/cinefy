import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { openRazorpayCheckout } from "../services/razorpay";
import { saveBookingToFirestore } from "../services/firebase";
import { Button as MovingBorderButton } from "../components/ui/moving-border";
import {
  Popcorn,
  Plus,
  Minus,
  Tag,
  Check,
  ShieldCheck,
  CreditCard,
  Sparkles,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  Zap,
  ArrowRight,
  MessageSquare,
  Lock,
  AtSign,
  Coffee,
  Utensils,
  ChevronRight,
  Clock3,
  RefreshCw,
  Building2,
  Wallet
} from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, linkedPhone = "", linkedUpiId = "" } = useAuth();

  const state = location.state || {};
  const {
    movieTitle = "Kalki 2898 AD",
    movieId = "mov-101",
    theatreName = "PVR Next Galleria",
    screenName = "Screen 1",
    showId = "sh-th-1-today",
    showTime = "07:30 PM",
    showDate = "Today",
    selectedSeats = [{ id: "C5", price: 280 }, { id: "C6", price: 280 }],
    seatTotal = 560,
    initialFoodOrders = [],
    eventDetails = null
  } = state;

  const displayPhone = linkedPhone || user?.phone || "+91 83176 25528";
  const displayUpiId = linkedUpiId || user?.upiId || "8317625528@upi";

  const [foodItems, setFoodItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [foodQuantities, setFoodQuantities] = useState(() => {
    const init = {};
    if (Array.isArray(initialFoodOrders)) {
      initialFoodOrders.forEach((item) => {
        if (item.id && item.quantity) {
          init[item.id] = item.quantity;
        }
      });
    }
    return init;
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  
  // Payment selection states: 'phonepe', 'gpay', 'paytm', 'custom_upi', 'card', 'netbanking', 'razorpay_all'
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [customUpiId, setCustomUpiId] = useState(displayUpiId);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [gatewayConfig, setGatewayConfig] = useState(null);

  useEffect(() => {
    fetchFoodItems();
    fetchPaymentConfig();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await API.get("/food");
      const items = Array.isArray(res.data)
        ? res.data
        : res.data?.items || res.data?.foodItems || res.data?.results || [];
      setFoodItems(items);
    } catch (err) {
      console.warn("Error fetching snacks:", err);
    }
  };

  const fetchPaymentConfig = async () => {
    try {
      const res = await API.get("/payments/config");
      if (res.data?.success) {
        setGatewayConfig(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch gateway config:", err);
    }
  };

  const handleUpdateFood = (id, delta) => {
    setFoodQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      const ticketTotal = selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
      const res = await API.post("/coupons/validate", {
        code: couponCode,
        amount: ticketTotal
      });
      if (res.data.valid) {
        setAppliedOffer(res.data.offer || { code: couponCode, discount: res.data.discount });
        setDiscountAmount(res.data.discountAmount || res.data.discount || 0);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid promo coupon");
      setAppliedOffer(null);
      setDiscountAmount(0);
    }
  };

  // Price Calculations
  const ticketPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  }, [selectedSeats]);

  const foodPrice = useMemo(() => {
    return Object.keys(foodQuantities).reduce((sum, itemId) => {
      const qty = foodQuantities[itemId] || 0;
      const item = foodItems.find((f) => f.id === itemId);
      return sum + (item ? (Number(item.price) || 0) * qty : 0);
    }, 0);
  }, [foodQuantities, foodItems]);

  const convenienceFee = Math.round(ticketPrice * 0.1);
  const totalAmount = Math.max(0, ticketPrice + foodPrice + convenienceFee - discountAmount);

  // Filtered food items based on active category
  const filteredFoodItems = useMemo(() => {
    if (activeCategory === "ALL") return foodItems;
    return foodItems.filter((item) => {
      const cat = String(item.category || "").toUpperCase();
      if (activeCategory === "POPCORN") return cat.includes("POPCORN");
      if (activeCategory === "COMBOS") return cat.includes("COMBO");
      if (activeCategory === "BEVERAGES") return cat.includes("BEVERAGE") || cat.includes("DRINK") || cat.includes("COLD");
      if (activeCategory === "SNACKS") return cat.includes("NACHO") || cat.includes("SNACK") || cat.includes("BURGER");
      return true;
    });
  }, [foodItems, activeCategory]);

  const selectedSnacksList = useMemo(() => {
    return Object.keys(foodQuantities)
      .filter((id) => foodQuantities[id] > 0)
      .map((id) => {
        const item = foodItems.find((f) => f.id === id);
        return {
          id,
          name: item?.name || "Cinema Snack",
          quantity: foodQuantities[id],
          price: item?.price || 0,
          image: item?.image || "",
          category: item?.category || "Snacks",
          totalPrice: (item?.price || 0) * foodQuantities[id]
        };
      });
  }, [foodQuantities, foodItems]);

  /**
   * Real Razorpay Payment Execution Flow:
   * 1. Request order creation on CineFy backend (/api/payments/create-order)
   * 2. Open official Razorpay Checkout modal
   * 3. Send payment response to backend for cryptographic signature verification (/api/payments/verify)
   * 4. Confirm booking, generate real QR ticket, and navigate to BookingSuccess
   */
  const handleFinalPayment = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!selectedSeats || selectedSeats.length === 0) {
      setBookingError("Please select at least one seat to complete your booking.");
      return;
    }

    setProcessing(true);
    setBookingError("");
    setPaymentStep(1);
    setStatusMessage("Creating secure payment order on CineFy server...");

    try {
      // Step 1: Create Order on CineFy Backend
      const orderPayload = {
        userId: user.id || user.uid,
        userEmail: user.email || "customer@cinefy.in",
        userName: user.name || "CineFy Customer",
        userPhone: displayPhone,
        movieId,
        movieTitle,
        poster: state.poster,
        theatreId: state.theatreId || "th-1",
        theatreName,
        screenName,
        showId,
        showDate,
        showTime,
        seats: selectedSeats,
        foodItems: selectedSnacksList,
        appliedCoupon: appliedOffer?.code || null,
        bookingType: state.bookingType || "MOVIE",
        eventDetails
      };

      const orderRes = await API.post("/payments/create-order", orderPayload);

      if (!orderRes.data?.success || !orderRes.data?.orderId) {
        throw new Error(orderRes.data?.error || "Unable to initialize payment order with gateway.");
      }

      const { orderId, amountInPaise, keyId, bookingId, prefill } = orderRes.data;

      // Step 2: Configure UPI App / Method Preferences
      let preferredMethod = null;
      let preferredUpiApp = null;

      if (paymentMethod === "gpay") {
        preferredMethod = "upi";
        preferredUpiApp = "google_pay";
      } else if (paymentMethod === "phonepe") {
        preferredMethod = "upi";
        preferredUpiApp = "phonepe";
      } else if (paymentMethod === "paytm") {
        preferredMethod = "upi";
        preferredUpiApp = "paytm";
      } else if (paymentMethod === "custom_upi") {
        preferredMethod = "upi";
      } else if (paymentMethod === "card") {
        preferredMethod = "card";
      } else if (paymentMethod === "netbanking") {
        preferredMethod = "netbanking";
      }

      setPaymentStep(2);
      setStatusMessage("Opening Razorpay Secure Gateway (PhonePe / GPay / Paytm / Cards)...");

      // Step 3: Launch Official Razorpay Checkout Modal
      let razorpayResponse;
      try {
        razorpayResponse = await openRazorpayCheckout({
          orderId,
          amountInPaise,
          currency: "INR",
          keyId: keyId || gatewayConfig?.keyId,
          bookingId,
          movieTitle,
          theatreName,
          prefill: {
            name: prefill?.name || user.name,
            email: prefill?.email || user.email,
            contact: prefill?.contact || displayPhone.replace(/\D/g, "").slice(-10)
          },
          preferredMethod,
          preferredUpiApp
        });
      } catch (checkoutErr) {
        setProcessing(false);
        setPaymentStep(0);
        if (checkoutErr.code === "PAYMENT_CANCELLED_BY_USER") {
          setBookingError("Payment was cancelled or closed. Your seats are still held. You can retry with PhonePe, GPay, Paytm, or Card.");
        } else {
          setBookingError(checkoutErr.message || "Payment checkout could not be completed.");
        }
        return;
      }

      // Step 4: Cryptographic Server-Side Signature Verification
      setPaymentStep(3);
      setStatusMessage("Verifying cryptographic payment signature with bank...");

      const verifyRes = await API.post("/payments/verify", {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        bookingId,
        paymentMethod: paymentMethod.toUpperCase()
      });

      if (!verifyRes.data?.success || !verifyRes.data?.verified) {
        throw new Error(verifyRes.data?.error || "Payment signature verification failed.");
      }

      const confirmedBooking = verifyRes.data.booking;

      // Step 5: Sync with Firestore Persistent Record
      setPaymentStep(4);
      setStatusMessage("Payment confirmed! Generating verified CineFy QR Ticket...");

      try {
        await saveBookingToFirestore(user.id || user.uid || "usr-1", {
          bookingId: confirmedBooking.id,
          ...confirmedBooking
        });
      } catch (fErr) {
        console.log("Firestore sync notice:", fErr);
      }

      setTimeout(() => {
        setProcessing(false);
        navigate(`/booking-success/${confirmedBooking.id}`, {
          state: { booking: confirmedBooking }
        });
      }, 700);

    } catch (err) {
      setProcessing(false);
      setPaymentStep(0);
      console.error("Payment Execution Error:", err);
      if (err.response?.status === 409) {
        setBookingError("One or more selected seats were secured by another customer. Please reselect available seats.");
      } else {
        setBookingError(err.response?.data?.error || err.message || "Payment processing failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20 relative">
      
      {/* Real-time Razorpay Payment Processing Modal Overlay */}
      {processing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-scaleUp">
            
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">
                RAZORPAY SECURE GATEWAY (INR)
              </span>
              <h3 className="text-xl font-black text-white font-heading">
                Processing ₹{totalAmount}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {statusMessage}
              </p>
            </div>

            {/* Live Step Progress */}
            <div className="space-y-3 text-left text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className={`flex items-center gap-3 ${paymentStep >= 1 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                {paymentStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                )}
                <span>1. Create Razorpay order on CineFy backend</span>
              </div>

              <div className={`flex items-center gap-3 ${paymentStep >= 2 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                {paymentStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : paymentStep === 2 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>2. Open Razorpay Checkout (UPI / Cards / NetBanking)</span>
              </div>

              <div className={`flex items-center gap-3 ${paymentStep >= 3 ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                {paymentStep > 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : paymentStep === 3 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>3. Verify HMAC SHA-256 cryptographic signature</span>
              </div>

              <div className={`flex items-center gap-3 ${paymentStep >= 4 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                {paymentStep === 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>4. Confirm seats & generate QR Ticket</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit Bank-Grade Razorpay Encryption • Powered by RBI Compliant PG</span>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white font-heading">Order Summary & Checkout</h1>
        <p className="text-slate-400 text-xs mt-1">Review your tickets, add gourmet combos, and complete real-time payment with Google Pay, PhonePe, Paytm, Cards, or Net Banking.</p>
      </div>

      {bookingError && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{bookingError}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-lg shrink-0 cursor-pointer"
          >
            Reselect Seats
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Food Ordering, Coupons & Payment Options */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CINEMA FOOD & SNACKS ORDERING SECTION */}
          <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Popcorn className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Gourmet Cinema Food & Snacks</h3>
                  <p className="text-slate-400 text-xs">Freshly popped butter popcorn, loaded nachos, beverages & meal combos</p>
                </div>
              </div>

              {/* Snack Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: "ALL", label: "All" },
                  { id: "POPCORN", label: "Popcorn" },
                  { id: "COMBOS", label: "Combos" },
                  { id: "BEVERAGES", label: "Drinks" },
                  { id: "SNACKS", label: "Bites" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === tab.id
                        ? "bg-cyan-500 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFoodItems.map((item) => {
                const qty = foodQuantities[item.id] || 0;
                const isVeg = item.isVeg !== false;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      qty > 0
                        ? "bg-cyan-500/5 border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                        : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-800"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300";
                        }}
                      />
                      <span
                        className={`absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-sm bg-white/90 border flex items-center justify-center p-0.5 ${
                          isVeg ? "border-emerald-600" : "border-rose-600"
                        }`}
                        title={isVeg ? "100% Pure Vegetarian" : "Non-Veg"}
                      >
                        <span className={`w-2 h-2 rounded-full ${isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-bold text-sm truncate">{item.name}</h5>
                      <span className="text-[11px] text-slate-400 block truncate">{item.category || "Cinema Gourmet"}</span>
                      <p className="text-cyan-400 font-bold text-sm mt-1 font-mono">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateFood(item.id, -1)}
                        disabled={qty === 0}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center font-mono">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateFood(item.id, 1)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-cyan-400 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Snacks Quick Tally */}
            {selectedSnacksList.length > 0 && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Popcorn className="w-4 h-4" />
                  {selectedSnacksList.reduce((sum, i) => sum + i.quantity, 0)} snacks added to order
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  +₹{foodPrice}
                </span>
              </div>
            )}
          </div>

          {/* Promo Coupons */}
          <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyan-400" /> Apply CineFy Promo Coupon
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter promo code (e.g. CINEFY100, FIRST50, UPI50)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
              <MovingBorderButton
                type="button"
                onClick={handleApplyCoupon}
                variant="cyan"
                borderRadius="0.75rem"
                containerClassName="h-[46px] w-[90px] shrink-0"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Apply
              </MovingBorderButton>
            </div>

            {couponError && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {couponError}
              </p>
            )}

            {appliedOffer && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Coupon <strong>{appliedOffer.code}</strong> applied successfully!</span>
                </div>
                <span className="font-bold font-mono">-₹{discountAmount}</span>
              </div>
            )}
          </div>

          {/* REAL PAYMENT OPTIONS (PHONEPE, GPAY, PAYTM, CARDS, NETBANKING) */}
          <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" /> Choose Payment Method
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Secure payment processed directly via Razorpay Standard Checkout in INR (₹)</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">PCI-DSS 3.2.1 Level 1 Certified</span>
              </div>
            </div>

            {/* Instant 1-Click Fast UPI Options */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Instant UPI Fast Pay:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gpay")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    paymentMethod === "gpay"
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-sm text-blue-400">
                      GPay
                    </div>
                    {paymentMethod === "gpay" && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">Google Pay</span>
                    <span className="text-[11px] text-slate-400 block">Instant UPI App Redirect</span>
                  </div>
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("phonepe")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    paymentMethod === "phonepe"
                      ? "bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-black text-sm">
                      पे
                    </div>
                    {paymentMethod === "phonepe" && (
                      <span className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">PhonePe</span>
                    <span className="text-[11px] text-slate-400 block">UPI Direct / QR Option</span>
                  </div>
                </button>

                {/* Paytm */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paytm")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    paymentMethod === "paytm"
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-black text-xs">
                      Paytm
                    </div>
                    {paymentMethod === "paytm" && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">Paytm UPI</span>
                    <span className="text-[11px] text-slate-400 block">Wallet & UPI Bank</span>
                  </div>
                </button>

              </div>
            </div>

            {/* Other Payment Methods */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cards, Net Banking & All Methods:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-cyan-400" />
                    {paymentMethod === "card" && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">Cards</span>
                    <span className="text-[11px] text-slate-400 block">Visa, Mastercard, RuPay</span>
                  </div>
                </button>

                {/* Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "netbanking"
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    {paymentMethod === "netbanking" && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">Net Banking</span>
                    <span className="text-[11px] text-slate-400 block">50+ Major Indian Banks</span>
                  </div>
                </button>

                {/* Custom VPA / Any UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("custom_upi")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "custom_upi"
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-6 h-6 text-emerald-400" />
                    {paymentMethod === "custom_upi" && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm block text-white">Any UPI ID / VPA</span>
                    <span className="text-[11px] text-slate-400 block">BHIM, CRED, Amazon</span>
                  </div>
                </button>

              </div>
            </div>

            {/* Custom UPI ID Input */}
            {paymentMethod === "custom_upi" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs text-slate-300 font-bold block flex items-center gap-1.5">
                  <AtSign className="w-4 h-4 text-cyan-400" /> Enter Virtual Payment Address (VPA / UPI ID):
                </label>
                <input
                  type="text"
                  placeholder="e.g. username@oksbi, mobile@paytm, name@ibl"
                  value={customUpiId}
                  onChange={(e) => setCustomUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-400">A payment request will be sent to your UPI app for 1-click confirmation.</p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Bill Summary & Final CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 sticky top-24 shadow-2xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-white font-heading border-b border-slate-800 pb-4">
              Booking Breakdown
            </h3>

            <div className="space-y-2">
              <h4 className="font-black text-lg text-white truncate">{movieTitle}</h4>
              <p className="text-xs text-slate-400">
                <strong className="text-cyan-400">{theatreName}</strong> • {screenName}
              </p>
              <p className="text-xs text-emerald-400 font-semibold">
                {showDate} at {showTime}
              </p>
            </div>

            {/* Selected Seats Pill */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Reserved Seats ({selectedSeats.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => (
                  <span key={s.id} className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40">
                    {s.id} (₹{s.price})
                  </span>
                ))}
              </div>
            </div>

            {/* Selected Food Breakdown */}
            {selectedSnacksList.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Snacks & Refreshments ({selectedSnacksList.length}):
                </span>
                <div className="space-y-1.5">
                  {selectedSnacksList.map((snack) => (
                    <div key={snack.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[150px]">
                        {snack.name} × {snack.quantity}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">
                        ₹{snack.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-white font-semibold">₹{ticketPrice}</span>
              </div>

              {foodPrice > 0 && (
                <div className="flex items-center justify-between text-cyan-300">
                  <span>Gourmet Snacks & Drinks</span>
                  <span className="font-mono font-semibold">+₹{foodPrice}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Convenience Fee & Taxes (10%)</span>
                <span className="font-mono text-white font-semibold">₹{convenienceFee}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({appliedOffer?.code || "COUPON"})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-base font-black text-white">
                <span>Total Payable</span>
                <span className="text-2xl text-cyan-400 font-mono">₹{totalAmount}</span>
              </div>
            </div>

            {/* Pay Button */}
            <MovingBorderButton
              type="button"
              onClick={handleFinalPayment}
              disabled={processing || selectedSeats.length === 0}
              variant="cyan"
              borderRadius="1rem"
              containerClassName="h-14 w-full"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {processing ? (
                <span>Securing Razorpay Payment...</span>
              ) : (
                <>
                  <span>
                    Pay ₹{totalAmount} with {
                      paymentMethod === "gpay" ? "Google Pay" :
                      paymentMethod === "phonepe" ? "PhonePe" :
                      paymentMethod === "paytm" ? "Paytm" :
                      paymentMethod === "card" ? "Card" :
                      paymentMethod === "netbanking" ? "Net Banking" : "Razorpay"
                    }
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </MovingBorderButton>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Razorpay INR Checkout • 100% Cryptographically Verified</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
