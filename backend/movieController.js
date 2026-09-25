import { dbState, getEffectiveMovies, getEffectiveTheatres, getEffectiveEvents } from "./db.js";
import { getUniqueScreenConfig, buildSeatMapData } from "../src/data/seatingLayouts.js";
import { generateTheatresForCity } from "../src/data/theatresDatabase.js";
import {
  getTheatreDailySchedule,
  getTheatresRunningMovie
} from "../src/data/theatreScheduleEngine.js";
import {
  getAllStates,
  getAllDistricts,
  getAllCities,
  getCustomLocations,
  saveCustomLocations
} from "./locationData.js";
import Movie from "./models/Movie.js";
import Theatre from "./models/Theatre.js";
import Event from "./models/Event.js";
import Review from "./models/Review.js";


// Active SSE client connections keyed by showId
const sseClients = new Map();

// Default lock duration: 10 minutes (600,000 ms)
export let DEFAULT_LOCK_DURATION_MS = 10 * 60 * 1000;

export function setLockDurationSeconds(seconds) {
  DEFAULT_LOCK_DURATION_MS = Math.max(60, Number(seconds) || 600) * 1000;
}

// Background cleanup for expired seat locks
setInterval(() => {
  const now = Date.now();
  let changedShowIds = new Set();

  Object.keys(dbState.seatLocks || {}).forEach((key) => {
    const lock = dbState.seatLocks[key];
    const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
    if (lock && now - lock.lockedAt > duration) {
      delete dbState.seatLocks[key];
      const showId = lock.showId || key.split("_")[0];
      if (showId) changedShowIds.add(showId);
    }
  });

  changedShowIds.forEach((showId) => {
    broadcastSeatUpdate(showId);
  });
}, 15000);

/**
 * Broadcasts real-time seat status changes to all connected SSE clients for a show
 */
export function broadcastSeatUpdate(showId) {
  if (!showId || !sseClients.has(showId)) return;
  const clients = sseClients.get(showId);
  if (!clients || clients.size === 0) return;

  const now = Date.now();
  const lockedSeats = [];
  const bookedSeats = [];

  // 1. Gather active locks
  Object.keys(dbState.seatLocks || {}).forEach((key) => {
    if (key.startsWith(`${showId}_`)) {
      const lock = dbState.seatLocks[key];
      const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
      if (lock && now - lock.lockedAt < duration) {
        const seatId = key.replace(`${showId}_`, "");
        lockedSeats.push({
          seatId,
          lockedBy: lock.userId,
          lockedAt: lock.lockedAt,
          expiresAt: lock.lockedAt + duration,
          remainingSeconds: Math.max(0, Math.floor((lock.lockedAt + duration - now) / 1000))
        });
      }
    }
  });

  // 2. Gather confirmed bookings
  (dbState.bookings || []).forEach((b) => {
    if (b.showId === showId && b.status !== "CANCELLED") {
      (b.seats || []).forEach((s) => {
        const sId = typeof s === "string" ? s : s.id;
        if (sId && !bookedSeats.includes(sId)) bookedSeats.push(sId);
      });
    }
  });

  const payload = `data: ${JSON.stringify({
    type: "REALTIME_SEAT_SYNC",
    showId,
    lockedSeats,
    bookedSeats,
    timestamp: now
  })}\n\n`;

  clients.forEach((client) => {
    try {
      client.write(payload);
    } catch (e) {
      console.warn("Error pushing SSE event to client:", e);
    }
  });
}

/**
 * Real-Time SSE Stream Endpoint: GET /api/shows/:showId/stream
 */
export function handleSeatStream(req, res) {
  const { showId } = req.params;
  if (!showId) return res.status(400).end("Missing showId");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  if (!sseClients.has(showId)) {
    sseClients.set(showId, new Set());
  }
  const clients = sseClients.get(showId);
  clients.add(res);

  // Send initial connected handshake
  const initialPayload = JSON.stringify({
    type: "STREAM_CONNECTED",
    showId,
    connectedAt: Date.now(),
    lockDurationSeconds: Math.floor(DEFAULT_LOCK_DURATION_MS / 1000)
  });
  res.write(`data: ${initialPayload}\n\n`);

  // Send current seat state immediately
  broadcastSeatUpdate(showId);

  // Heartbeat ping every 25s
  const interval = setInterval(() => {
    try {
      res.write(`: heartbeat ${Date.now()}\n\n`);
    } catch (e) {
      clearInterval(interval);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(interval);
    clients.delete(res);
    if (clients.size === 0) {
      sseClients.delete(showId);
    }
  });
}

// -------------------------------------------------------------
// Location Endpoints (India-wide States, Districts, Cities)
// -------------------------------------------------------------

export function handleGetStates(req, res) {
  const states = getAllStates();
  res.json({
    success: true,
    total: states.length,
    states
  });
}

export function handleGetDistricts(req, res) {
  const { stateId } = req.params;
  const districts = getAllDistricts(stateId);
  res.json({
    success: true,
    stateId,
    total: districts.length,
    districts
  });
}

export function handleGetCities(req, res) {
  const { districtId } = req.params;
  const { stateId, search } = req.query;

  let cities = getAllCities(districtId, stateId);

  if (search) {
    const q = search.toLowerCase().trim();
    cities = cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.district && c.district.toLowerCase().includes(q)) ||
        (c.state && c.state.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: cities.length,
    cities
  });
}

export function handleGetTheatresByCity(req, res) {
  const { cityId } = req.params;
  const cityName = decodeURIComponent(cityId || "").trim();
  req.query.city = cityName;
  return handleGetTheatres(req, res);
}

export function handleGetScreensByTheatre(req, res) {
  const { theatreId } = req.params;
  const allTheatres = getEffectiveTheatres();
  const theatre = allTheatres.find((t) => t.id === theatreId);

  if (!theatre) {
    return res.status(404).json({ error: "Theatre not found" });
  }

  res.json({
    success: true,
    theatreId: theatre.id,
    theatreName: theatre.name,
    city: theatre.city,
    screens: theatre.screens || []
  });
}

// -------------------------------------------------------------
// Core Movie & Show Endpoints
// -------------------------------------------------------------

export async function handleGetMovies(req, res) {
  const { city, search, language, genre, status } = req.query;
  let result = await Movie.find().lean();

  if (city && city !== "All") {
    result = result.filter((m) => !m.cities || m.cities.includes(city) || m.cities.includes("All"));
  }

  if (language && language !== "All") {
    result = result.filter((m) => {
      if (m.language && m.language.toLowerCase() === language.toLowerCase()) return true;
      if (Array.isArray(m.languages) && m.languages.some((l) => l.toLowerCase() === language.toLowerCase())) return true;
      return false;
    });
  }

  if (genre && genre !== "All") {
    result = result.filter((m) => {
      if (Array.isArray(m.genre)) {
        return m.genre.some((g) => g.toLowerCase() === genre.toLowerCase());
      }
      return m.genre && m.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if (status && status !== "All") {
    result = result.filter((m) => m.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (Array.isArray(m.genre) ? m.genre.join(" ") : (m.genre || "")).toLowerCase().includes(q) ||
        (m.language && m.language.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    movies: result,
    total: result.length,
    results: result
  });
}

export async function handleGetMovieById(req, res) {
  const movie = await Movie.findOne({ id: req.params.id }).lean();
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json({ success: true, movie, ...movie });
}

export async function handleGetTheatres(req, res) {
  const { city, movieId, theatreId, date } = req.query;
  const cleanCity = city && city !== "All" ? city.trim() : "";
  const showDate = date || "Today";
  const allMovies = await Movie.find().lean();
  let baseTheatres = await Theatre.find().lean();

  if (cleanCity) {
    baseTheatres = baseTheatres.filter((t) => t.city.toLowerCase() === cleanCity.toLowerCase());
  }

  // If no theatres seeded for this specific city/town, dynamically generate authentic Indian theatres
  if (baseTheatres.length === 0 && cleanCity) {
    const generated = generateTheatresForCity(cleanCity);
    if (generated && generated.length > 0) {
      baseTheatres = generated;
    }
  }

  // If still empty (e.g. city was "All" or unknown), fallback to all theatres
  if (baseTheatres.length === 0) {
    baseTheatres = getEffectiveTheatres();
  }

  // Case 1: Filter by specific Movie ID (returns theatres running this movie with their specific showtimes)
  if (movieId) {
    const results = getTheatresRunningMovie({
      movieId,
      city: cleanCity || "Tenali",
      date: showDate,
      allTheatres: baseTheatres,
      allMovies
    });

    return res.json({
      success: true,
      theatres: results,
      total: results.length,
      results
    });
  }

  // Case 2: Filter by specific Theatre ID (returns that single theatre with its full movie schedule)
  if (theatreId) {
    const targetTheatre = baseTheatres.find((t) => t.id === theatreId) || baseTheatres[0];
    const schedule = getTheatreDailySchedule({
      theatre: targetTheatre,
      date: showDate,
      allMovies
    });

    return res.json({
      success: true,
      theatre: targetTheatre,
      schedule,
      theatres: [schedule]
    });
  }

  // Case 3: List all theatres in the city, enriched with full real-time daily schedules & running movies
  const enrichedTheatres = baseTheatres.map((theatre) => {
    const schedule = getTheatreDailySchedule({
      theatre,
      date: showDate,
      allMovies
    });

    return {
      ...theatre,
      date: showDate,
      totalMoviesCount: schedule.totalMoviesCount,
      totalShowsCount: schedule.totalShowsCount,
      runningMovies: schedule.movies.map((m) => ({
        id: m.movie.id,
        title: m.movie.title,
        poster: m.movie.poster,
        rating: m.movie.rating,
        certification: m.movie.certification,
        language: m.movie.language,
        genre: m.movie.genre,
        duration: m.movie.duration,
        showsCount: m.shows.length,
        formats: m.formats,
        shows: m.shows
      })),
      movies: schedule.movies,
      allShows: schedule.allShows,
      screens: (theatre.screens || []).map((screen) => {
        const screenShows = schedule.allShows.filter((s) => s.screenId === screen.id);
        return {
          ...screen,
          shows: screenShows,
          showtimes: screenShows
        };
      })
    };
  });

  res.json({
    success: true,
    theatres: enrichedTheatres,
    total: enrichedTheatres.length,
    results: enrichedTheatres
  });
}

export async function handleGetTheatreSchedule(req, res) {
  const theatreId = req.params.theatreId;
  const date = req.query.date || "Today";
  const allTheatres = await Theatre.find().lean();
  const allMovies = await Movie.find().lean();

  let targetTheatre = allTheatres.find((t) => t.id === theatreId);
  if (!targetTheatre) {
    // Check if generated for any city
    const generated = generateTheatresForCity(req.query.city || "Tenali");
    targetTheatre = generated.find((t) => t.id === theatreId) || generated[0] || allTheatres[0];
  }

  const schedule = getTheatreDailySchedule({
    theatre: targetTheatre,
    date,
    allMovies
  });

  res.json({
    success: true,
    theatre: targetTheatre,
    schedule
  });
}

export async function handleGetEvents(req, res) {
  const { city, category } = req.query;
  let result = await Event.find().lean();

  if (city && city !== "All") {
    result = result.filter((e) => !e.city || e.city.toLowerCase() === city.toLowerCase());
  }

  if (category && category !== "All") {
    result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  res.json({
    success: true,
    events: result,
    total: result.length,
    results: result
  });
}

export async function handleGetEventById(req, res) {
  const event = await Event.findOne({ id: req.params.id }).lean();
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json({ success: true, event, ...event });
}

export async function handleGetShows(req, res) {
  const { date, city } = req.query;
  const cleanCity = city && city !== "All" ? city.trim() : "";
  let allTheatres = await Theatre.find().lean();

  if (cleanCity) {
    allTheatres = allTheatres.filter((t) => t.city.toLowerCase() === cleanCity.toLowerCase());
    if (allTheatres.length === 0) {
      const generated = generateTheatresForCity(cleanCity);
      if (generated && generated.length > 0) {
        allTheatres = generated;
      }
    }
  }

  const showDate = date || new Date().toISOString().split("T")[0];

  const results = allTheatres.map((theatre) => {
    const screens = (theatre.screens || []).map((screen) => {
      const showtimes = ["09:30 AM", "01:15 PM", "04:45 PM", "07:30 PM", "10:45 PM"].map(
        (time, idx) => {
          const showId = `sh-${theatre.id}-${screen.id}-${showDate}-${idx}`;
          return {
            id: showId,
            showId,
            time,
            format: screen.type || "2D Standard",
            priceRegular: 150,
            pricePremium: 250,
            priceExecutive: 320,
            priceRecliner: 450,
            priceVip: 600,
            pricing: {
              regular: 150,
              premium: 250,
              executive: 320,
              recliner: 450,
              vip: 600
            },
            availableSeats: screen.capacity ? Math.floor(screen.capacity * 0.75) : 180,
            totalSeats: Math.max(120, screen.capacity || 220)
          };
        }
      );

      return {
        ...screen,
        capacity: Math.max(120, screen.capacity || 220),
        shows: showtimes,
        showtimes
      };
    });

    return {
      theatreId: theatre.id,
      theatreName: theatre.name,
      address: theatre.address,
      city: theatre.city,
      rating: theatre.rating,
      screens
    };
  });

  res.json({
    success: true,
    shows: results,
    theatres: results
  });
}

// -------------------------------------------------------------
// Real-time Dynamic Seat Layout & Show Seat Availability
// -------------------------------------------------------------

export async function handleGetSeatMap(req, res) {
  const { showId } = req.params;
  const allTheatres = await Theatre.find().lean();

  let matchedTheatre = null;
  let matchedScreen = null;

  for (const t of allTheatres) {
    for (const s of t.screens || []) {
      if (showId && showId.includes(t.id) && showId.includes(s.id)) {
        matchedTheatre = t;
        matchedScreen = s;
        break;
      }
    }
    if (matchedTheatre) break;
  }

  if (!matchedTheatre) {
    const parts = (showId || "").split("-");
    const possibleCitySlug = parts[2] || "";
    if (possibleCitySlug) {
      const generated = generateTheatresForCity(possibleCitySlug);
      for (const t of generated) {
        for (const s of t.screens || []) {
          if (showId.includes(t.id) && showId.includes(s.id)) {
            matchedTheatre = t;
            matchedScreen = s;
            break;
          }
        }
        if (matchedTheatre) break;
      }
    }
  }

  const theatre = matchedTheatre || allTheatres[0] || { id: "th-hyd-1", name: "PVR Next Galleria, Panjagutta" };
  const screen =
    matchedScreen ||
    theatre?.screens?.[0] || { id: "scr-1", name: "Audi 1 - 4K Laser", type: "IMAX Laser 3D", capacity: 240 };

  const config = getUniqueScreenConfig(screen.id, theatre.id, screen.name, screen.type || "IMAX");

  // Collect booked seats and active locks
  const bookedSeatIds = new Set();
  (dbState.bookings || []).forEach((b) => {
    if (b.showId === showId && b.status !== "CANCELLED") {
      (b.seats || []).forEach((s) => {
        const sId = typeof s === "string" ? s : s.id;
        if (sId) bookedSeatIds.add(sId);
      });
    }
  });

  const now = Date.now();
  const currentLocks = {};
  Object.keys(dbState.seatLocks || {}).forEach((key) => {
    if (key.startsWith(`${showId}_`)) {
      const lock = dbState.seatLocks[key];
      const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
      if (lock && now - lock.lockedAt < duration) {
        const seatId = key.replace(`${showId}_`, "");
        currentLocks[seatId] = {
          userId: lock.userId,
          lockedAt: lock.lockedAt,
          expiresAt: lock.lockedAt + duration,
          remainingSeconds: Math.max(0, Math.floor((lock.lockedAt + duration - now) / 1000))
        };
      }
    }
  });

  const builtRows = buildSeatMapData(config, showId, bookedSeatIds);

  // Annotate each seat with dynamic status: AVAILABLE, LOCKED, BOOKED, BLOCKED
  const annotatedRows = builtRows.map((row) => ({
    ...row,
    seats: (row.seats || []).map((seat) => {
      let status = seat.status || "AVAILABLE";
      let lockInfo = null;

      if (bookedSeatIds.has(seat.id)) {
        status = "BOOKED";
      } else if (currentLocks[seat.id]) {
        status = "LOCKED";
        lockInfo = currentLocks[seat.id];
      } else if (seat.isBlocked || seat.status === "BLOCKED") {
        status = "BLOCKED";
      } else {
        status = "AVAILABLE";
      }

      return {
        ...seat,
        status,
        lockInfo
      };
    })
  }));

  const calculatedTotalSeats = annotatedRows.reduce((sum, r) => sum + (r.seats ? r.seats.length : 0), 0);

  res.json({
    showId,
    theatreId: theatre.id,
    theatreName: (theatre.name || "PVR Grand Multiplex").replace(/^cinefy\s+/i, ""),
    screenId: screen.id,
    screenName: screen.name,
    screenType: screen.type,
    soundType: config.soundType || "Dolby Atmos 64-Channel 3D Surround",
    layoutBadge: config.layoutBadge || "Multiplex Auditorium",
    layoutSignature: config.layoutSignature || "",
    isCurved: config.isCurved || false,
    sections: config.sections || [4, 8, 4],
    aisleLabels: config.aisleLabels || ["Left Gangway", "Right Gangway"],
    wheelchairSeats: config.wheelchairSeats || [],
    coupleSeats: config.coupleSeats || [],
    totalSeats: calculatedTotalSeats || config.totalSeats || 180,
    archetype: config.layoutType || config.archetype || "MODERN_MULTIPLEX",
    rows: annotatedRows,
    seatMap: annotatedRows,
    walkwayBreaks: config.walkwayBreaks || [],
    emergencyExits: config.emergencyExits || [],
    auditoriumDimensions: config.auditoriumDimensions || {},
    facilities: theatre.facilities || ["Dolby Atmos 7.1", "4K Projection", "Recliner Seats"],
    lockDurationSeconds: Math.floor(DEFAULT_LOCK_DURATION_MS / 1000),
    activeLocksCount: Object.keys(currentLocks).length
  });
}

/**
 * Atomic Seat Locking: POST /api/shows/:showId/seats/lock or POST /api/seats/lock
 */
export function handleLockSeats(req, res) {
  const showId = req.params.showId || req.body.showId;
  const { seatIds, userId, lockDurationSeconds } = req.body;

  if (!showId || !seatIds || !seatIds.length) {
    return res.status(400).json({ error: "showId and seatIds are required" });
  }

  const effectiveUserId = userId || req.user?.id || req.body.user?.id || "usr-" + Date.now();
  const durationMs = lockDurationSeconds ? Number(lockDurationSeconds) * 1000 : DEFAULT_LOCK_DURATION_MS;
  const now = Date.now();
  const failedSeats = [];

  // 1. Check if any seat is already booked
  const bookedSeatIds = new Set();
  (dbState.bookings || []).forEach((b) => {
    if (b.showId === showId && b.status !== "CANCELLED") {
      (b.seats || []).forEach((s) => {
        const sId = typeof s === "string" ? s : s.id;
        if (sId) bookedSeatIds.add(sId);
      });
    }
  });

  seatIds.forEach((seatId) => {
    if (bookedSeatIds.has(seatId)) {
      failedSeats.push({ seatId, reason: "ALREADY_BOOKED" });
    }
  });

  // 2. Check if any seat is locked by another user and lock has not expired
  seatIds.forEach((seatId) => {
    const key = `${showId}_${seatId}`;
    const existingLock = dbState.seatLocks[key];
    const lockDuration = existingLock?.duration || DEFAULT_LOCK_DURATION_MS;

    if (
      existingLock &&
      existingLock.userId !== effectiveUserId &&
      now - existingLock.lockedAt < lockDuration
    ) {
      failedSeats.push({ seatId, reason: "LOCKED_BY_OTHER_USER" });
    }
  });

  if (failedSeats.length > 0) {
    return res.status(409).json({
      error: "Some seats are no longer available for locking",
      lockedSeats: failedSeats.map((f) => f.seatId),
      details: failedSeats
    });
  }

  // 3. Atomically apply the locks
  seatIds.forEach((seatId) => {
    const key = `${showId}_${seatId}`;
    dbState.seatLocks[key] = {
      userId: effectiveUserId,
      lockedAt: now,
      duration: durationMs,
      showId
    };
  });

  const expiresAt = now + durationMs;

  // 4. Broadcast live update to all SSE subscribers
  broadcastSeatUpdate(showId);

  res.json({
    success: true,
    message: `Seats held for ${Math.floor(durationMs / 60000)} minutes`,
    lockedSeats: seatIds,
    userId: effectiveUserId,
    lockedAt: now,
    expiresAt,
    lockDurationSeconds: Math.floor(durationMs / 1000)
  });
}

/**
 * Seat Unlocking: POST /api/shows/:showId/seats/unlock or POST /api/seats/unlock
 */
export function handleUnlockSeats(req, res) {
  const showId = req.params.showId || req.body.showId;
  const { seatIds, userId } = req.body;

  if (!showId || !seatIds || !seatIds.length) {
    return res.status(400).json({ error: "showId and seatIds are required" });
  }

  const effectiveUserId = userId || req.user?.id || req.body.user?.id;

  seatIds.forEach((seatId) => {
    const key = `${showId}_${seatId}`;
    const existingLock = dbState.seatLocks[key];
    if (!existingLock || !effectiveUserId || existingLock.userId === effectiveUserId) {
      delete dbState.seatLocks[key];
    }
  });

  broadcastSeatUpdate(showId);

  res.json({
    success: true,
    message: "Seats unlocked successfully",
    unlockedSeats: seatIds
  });
}

// -------------------------------------------------------------
// Reviews Endpoints
// -------------------------------------------------------------

export async function handleGetReviews(req, res) {
  const movieId = req.params.movieId || req.query.movieId;
  
  if (movieId) {
    const movies = await Movie.find().lean();
    const targetMovie = movies.find((m) => String(m.id) === String(movieId));
    if (targetMovie && (targetMovie.status === "coming_soon" || targetMovie.status === "upcoming" || targetMovie.releaseStatus === "upcoming")) {
      return res.json({ success: true, reviews: [] });
    }
  }

  const query = movieId ? { movieId: String(movieId) } : {};
  const revs = await Review.find(query).sort({ createdAt: -1 }).lean();
  res.json({ success: true, reviews: revs });
}

export async function handleAddReview(req, res) {
  const movieId = req.params.movieId || req.body.movieId;
  const { userName, rating, comment, userAvatar, name, email } = req.body;

  if (movieId) {
    const movies = await Movie.find().lean();
    const targetMovie = movies.find((m) => String(m.id) === String(movieId));
    if (targetMovie && (targetMovie.status === "coming_soon" || targetMovie.status === "upcoming" || targetMovie.releaseStatus === "upcoming")) {
      return res.status(400).json({ error: "Audience reviews will open after the movie is officially released in theatres." });
    }
  }

  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: "Review comment is required" });
  }

  const effectiveUserName = userName || name || (req.user && req.user.name) || (email ? email.split("@")[0] : "CineFy Moviegoer");
  const effectiveAvatar = userAvatar || (req.user && (req.user.photoURL || req.user.avatar)) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

  const newReview = new Review({
    id: "rev-" + Date.now(),
    movieId: movieId || "general",
    userName: effectiveUserName,
    userAvatar: effectiveAvatar,
    rating: Number(rating) || 5,
    comment: comment.trim(),
    date: new Date().toISOString().split("T")[0]
  });

  await newReview.save();
  res.json({ success: true, review: newReview, message: "Review posted successfully" });
}
