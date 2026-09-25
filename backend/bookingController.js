import QRCode from "qrcode";
import { dbState } from "./db.js";
import { broadcastSeatUpdate, DEFAULT_LOCK_DURATION_MS } from "./movieController.js";
import Booking from "./models/Booking.js";

function getFormattedDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

export function generateInitialSeedBookings() {
  const tomorrow = getFormattedDate(1);
  const inThreeDays = getFormattedDate(3);
  const fiveDaysAgo = getFormattedDate(-5);
  const twoWeeksAgo = getFormattedDate(-14);
  const oneMonthAgo = getFormattedDate(-30);

  return [
    {
      id: "CNF-839210",
      bookingRef: "REF-SPIDER-DAY",
      userId: "usr-demo",
      userEmail: "customer@cinefy.in",
      userName: "Movie Fan",
      userPhone: "+91 8317625528",
      movieId: "mov-103",
      movieTitle: "Spider-Man: The Brand New Day",
      screenName: "Audi 1 (IMAX Laser)",
      poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80",
      theatreId: "th-hyd-1",
      theatreName: "PVR Next Galleria, Panjagutta",
      showId: `sh-th-1-${tomorrow}`,
      showDate: tomorrow,
      showTime: "07:45 PM",
      seats: [
        { id: "F11", row: "F", number: 11, category: "EXECUTIVE", price: 320 },
        { id: "F12", row: "F", number: 12, category: "EXECUTIVE", price: 320 }
      ],
      foodItems: [
        { id: "fd-1", name: "Jumbo Caramel Popcorn", quantity: 1, price: 290 },
        { id: "fd-2", name: "Pepsi Chill 500ml", quantity: 2, price: 160 }
      ],
      ticketPrice: 640,
      foodPrice: 450,
      convenienceFee: 45,
      discount: 100,
      appliedCoupon: "CINEFY100",
      totalAmount: 1035,
      paymentMethod: "UPI (+91 83176 25528)",
      paymentStatus: "CONFIRMED",
      status: "CONFIRMED",
      bookingType: "MOVIE",
      qrCode: "",
      createdAt: new Date().toISOString()
    },
    {
      id: "CNF-492817",
      bookingRef: "REF-KOREAN-KANA",
      userId: "usr-demo",
      userEmail: "customer@cinefy.in",
      userName: "Movie Fan",
      userPhone: "+91 8317625528",
      movieId: "mov-102",
      movieTitle: "Korean Kanakaraju",
      screenName: "Screen 3",
      poster: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600&auto=format&fit=crop&q=80",
      theatreId: "th-2",
      theatreName: "Prasad's Multiplex & Large Screen, Necklace Road",
      showId: `sh-th-2-${inThreeDays}`,
      showDate: inThreeDays,
      showTime: "04:15 PM",
      seats: [
        { id: "E14", row: "E", number: 14, category: "PREMIUM", price: 250 },
        { id: "E15", row: "E", number: 15, category: "PREMIUM", price: 250 }
      ],
      foodItems: [
        { id: "fd-3", name: "Crispy Cheese Nachos with Salsa", quantity: 1, price: 240 }
      ],
      ticketPrice: 500,
      foodPrice: 240,
      convenienceFee: 40,
      discount: 50,
      appliedCoupon: "SNACK50",
      totalAmount: 730,
      paymentMethod: "UPI (+91 83176 25528)",
      paymentStatus: "CONFIRMED",
      status: "CONFIRMED",
      bookingType: "MOVIE",
      qrCode: "",
      createdAt: new Date().toISOString()
    },
    {
      id: "CNF-319082",
      bookingRef: "REF-LENIN-MASS",
      userId: "usr-demo",
      userEmail: "customer@cinefy.in",
      userName: "Movie Fan",
      userPhone: "+91 8317625528",
      movieId: "mov-101",
      movieTitle: "Lenin",
      screenName: "Audi 1 Superplex",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
      theatreId: "th-3",
      theatreName: "AMB Cinemas, Gachibowli",
      showId: `sh-th-3-${fiveDaysAgo}`,
      showDate: fiveDaysAgo,
      showTime: "09:30 PM",
      seats: [
        { id: "G10", row: "G", number: 10, category: "RECLINER", price: 450 },
        { id: "G11", row: "G", number: 11, category: "RECLINER", price: 450 }
      ],
      foodItems: [
        { id: "fd-1", name: "Gourmet Butter Truffle Popcorn", quantity: 1, price: 320 }
      ],
      ticketPrice: 900,
      foodPrice: 320,
      convenienceFee: 50,
      discount: 150,
      appliedCoupon: "BLOCKBUSTER150",
      totalAmount: 1120,
      paymentMethod: "Razorpay Card / UPI",
      paymentStatus: "CONFIRMED",
      status: "COMPLETED",
      bookingType: "MOVIE",
      qrCode: "",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: "CNF-194056",
      bookingRef: "REF-DC-LOKESH",
      userId: "usr-demo",
      userEmail: "customer@cinefy.in",
      userName: "Movie Fan",
      userPhone: "+91 8317625528",
      movieId: "mov-104",
      movieTitle: "DC (Devadas & Chandra)",
      screenName: "Screen 4 (4DX)",
      poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&auto=format&fit=crop&q=80",
      theatreId: "th-4",
      theatreName: "PVR ICON Hitec City",
      showId: `sh-th-4-${twoWeeksAgo}`,
      showDate: twoWeeksAgo,
      showTime: "06:00 PM",
      seats: [
        { id: "D8", row: "D", number: 8, category: "EXECUTIVE", price: 350 },
        { id: "D9", row: "D", number: 9, category: "EXECUTIVE", price: 350 }
      ],
      foodItems: [],
      ticketPrice: 700,
      foodPrice: 0,
      convenienceFee: 40,
      discount: 0,
      appliedCoupon: null,
      totalAmount: 740,
      paymentMethod: "UPI (+91 83176 25528)",
      paymentStatus: "CONFIRMED",
      status: "COMPLETED",
      bookingType: "MOVIE",
      qrCode: "",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: "CNF-758123",
      bookingRef: "REF-ARR-CONCERT",
      userId: "usr-demo",
      userEmail: "customer@cinefy.in",
      userName: "Movie Fan",
      userPhone: "+91 8317625528",
      movieId: "evt-1",
      movieTitle: "A.R. Rahman Live in Concert - Wings of Music",
      screenName: "Grand Stage Gate A",
      poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      theatreId: "th-venue-1",
      theatreName: "Gachibowli Outdoor Arena & Stadium",
      showId: `sh-evt-1-${oneMonthAgo}`,
      showDate: oneMonthAgo,
      showTime: "06:30 PM",
      seats: [
        { id: "VIP-A12", row: "VIP", number: 12, category: "VIP", price: 2500 },
        { id: "VIP-A13", row: "VIP", number: 13, category: "VIP", price: 2500 }
      ],
      foodItems: [],
      ticketPrice: 5000,
      foodPrice: 0,
      convenienceFee: 150,
      discount: 500,
      appliedCoupon: "CONCERT500",
      totalAmount: 4650,
      paymentMethod: "UPI (+91 83176 25528)",
      paymentStatus: "CONFIRMED",
      status: "COMPLETED",
      bookingType: "CONCERT",
      qrCode: "",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];
}

export async function handleCreateBooking(req, res) {
  try {
    const {
      userId,
      userEmail,
      userName,
      userPhone,
      movieId,
      movieTitle,
      poster,
      theatreId,
      theatreName,
      screenName,
      showId,
      showDate,
      showTime,
      seats,
      foodItems,
      foodOrders,
      totalAmount,
      ticketPrice,
      foodPrice,
      convenienceFee,
      discount,
      appliedCoupon,
      paymentMethod,
      bookingType,
      eventDetails
    } = req.body;

    const effectiveUserId =
      userId ||
      req.user?.id ||
      req.user?.uid ||
      req.body.user?.id ||
      "usr-guest";

    if ((!movieTitle && !eventDetails?.title) || !seats || !seats.length) {
      return res.status(400).json({ error: "Missing required booking fields (movieTitle, seats)" });
    }

    const effectiveShowId = showId || req.body.showId || `sh-${theatreId || 'th-1'}-${showDate || 'today'}`;

    // --- CONCURRENCY ATOMIC VALIDATION ---
    const seatIdList = seats.map((s) => (typeof s === "string" ? s : s.id));
    const now = Date.now();
    const conflictingSeats = [];

    // 1. Check if any seat is already booked for this show
    const existingBookings = await Booking.find({ 
      showId: effectiveShowId, 
      status: { $ne: "CANCELLED" } 
    }).lean();

    existingBookings.forEach((b) => {
      (b.seats || []).forEach((s) => {
        const sId = typeof s === "string" ? s : s.id;
        if (seatIdList.includes(sId)) {
          conflictingSeats.push({ seatId: sId, reason: "ALREADY_CONFIRMED_BY_ANOTHER_USER" });
        }
      });
    });

    // 2. Check if any seat is locked by another user (and not expired)
    seatIdList.forEach((sId) => {
      const lockKey = `${effectiveShowId}_${sId}`;
      const lock = dbState.seatLocks?.[lockKey];
      const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
      if (
        lock &&
        lock.userId !== effectiveUserId &&
        now - lock.lockedAt < duration
      ) {
        conflictingSeats.push({ seatId: sId, reason: "HELD_BY_ANOTHER_USER" });
      }
    });

    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        error: "One or more seats were just secured by another customer. Please select available seats.",
        conflicts: conflictingSeats
      });
    }

    const bookingId = "CNF-" + Math.floor(100000 + Math.random() * 900000);
    const bookingRef = "REF-" + Date.now().toString(36).toUpperCase();

    // Generate real QR Code data URL
    const qrData = JSON.stringify({
      bookingId,
      bookingRef,
      movie: movieTitle || eventDetails?.title,
      theatre: theatreName || eventDetails?.venue,
      date: showDate,
      time: showTime,
      seats: seatIdList,
      amount: totalAmount
    });

    let qrCodeUrl = "";
    try {
      qrCodeUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" }
      });
    } catch (e) {
      qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(bookingId);
    }

    const newBooking = new Booking({
      id: bookingId,
      bookingRef,
      userId: effectiveUserId,
      userEmail: userEmail || req.user?.email || "customer@cinefy.in",
      userName: userName || req.user?.name || "Movie Fan",
      userPhone: userPhone || req.user?.phone || req.body.paidViaPhone || "+91 8317625528",
      movieId: movieId || "mov-custom",
      movieTitle: movieTitle || eventDetails?.title || "Special Event",
      poster: poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
      theatreId: theatreId || "th-1",
      theatreName: String(theatreName || eventDetails?.venue || "PVR Next Galleria, Panjagutta").replace(/^cinefy\s+/i, ""),
      screenName: screenName || "Screen 1",
      showId: effectiveShowId,
      showDate: showDate || new Date().toISOString().split("T")[0],
      showTime: showTime || "07:30 PM",
      seats,
      foodItems: foodItems || foodOrders || req.body.foodOrders || [],
      ticketPrice: Number(ticketPrice) || 0,
      foodPrice: Number(foodPrice) || 0,
      totalAmount: Number(totalAmount) || 500,
      convenienceFee: Number(convenienceFee) || 45,
      discount: Number(discount) || Number(req.body.discountAmount) || 0,
      appliedCoupon: appliedCoupon || null,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "CONFIRMED",
      qrCode: qrCodeUrl,
      status: "ACTIVE",
      bookingType: bookingType || "MOVIE",
    });

    await newBooking.save();

    // Update global dbState for memory synchronization (since SSE listeners use it)
    if (!dbState.bookings) dbState.bookings = [];
    dbState.bookings.unshift(newBooking.toObject());

    // Release temporary locks for these booked seats
    seatIdList.forEach((sId) => {
      const lockKey = `${effectiveShowId}_${sId}`;
      delete dbState.seatLocks?.[lockKey];
    });

    // Broadcast real-time update to all listeners of this show
    broadcastSeatUpdate(effectiveShowId);

    res.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ error: "Booking generation failed: " + err.message });
  }
}

export async function handleGetUserBookings(req, res) {
  try {
    const targetUserId = req.params.userId || req.user?.id || req.query.userId;
    const targetEmail = req.user?.email || req.query.email;
    const targetPhone = req.user?.phone || req.query.phone;
    
    let totalCount = await Booking.countDocuments();
    
    // Seed bookings if DB is empty
    if (totalCount === 0) {
      const seedData = generateInitialSeedBookings();
      await Booking.insertMany(seedData);
      dbState.bookings = seedData;
    }

    let query = {};
    if (targetUserId || targetEmail || targetPhone) {
      query.$or = [];
      if (targetUserId) {
        query.$or.push({ userId: targetUserId });
        query.$or.push({ userId: "usr-demo" });
        query.$or.push({ userId: "usr-guest" });
      }
      if (targetEmail) query.$or.push({ userEmail: new RegExp(`^${targetEmail}$`, "i") });
      if (targetPhone) {
        const cleanPhone = String(targetPhone).replace(/\D/g, "").slice(-10);
        query.$or.push({ userPhone: new RegExp(cleanPhone + "$") });
      }
    }

    const userBookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      bookings: userBookings,
      total: userBookings.length
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings: " + err.message });
  }
}

export async function handleGetBookingById(req, res) {
  try {
    const { bookingId } = req.params;
    
    let totalCount = await Booking.countDocuments();
    if (totalCount === 0) {
      const seedData = generateInitialSeedBookings();
      await Booking.insertMany(seedData);
      dbState.bookings = seedData;
    }

    const booking = await Booking.findOne({ 
      $or: [{ id: bookingId }, { bookingRef: bookingId }] 
    }).lean();

    if (!booking) return res.status(404).json({ error: "Ticket not found" });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking details: " + err.message });
  }
}

export async function handleCancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({ id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "CANCELLED";
    booking.cancelledAt = new Date().toISOString();
    await booking.save();

    // Update in memory for active SSE listeners
    if (dbState.bookings) {
      const idx = dbState.bookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        dbState.bookings[idx].status = "CANCELLED";
      }
    }

    if (booking.showId) {
      broadcastSeatUpdate(booking.showId);
    }

    res.json({
      success: true,
      message: "Ticket cancelled successfully. Refund initiated to source account.",
      booking: booking
    });
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed: " + err.message });
  }
}
