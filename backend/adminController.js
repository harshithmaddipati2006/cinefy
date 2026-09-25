import { dbState } from "./db.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Payment from "./models/Payment.js";
import Movie from "./models/Movie.js";
import Theatre from "./models/Theatre.js";
import Event from "./models/Event.js";
import {
  saveMovieToFirestoreLive,
  deleteMovieFromFirestoreLive,
  saveTheatreToFirestoreLive,
  deleteTheatreFromFirestoreLive,
  saveEventToFirestoreLive,
  deleteEventFromFirestoreLive
} from "./firebaseSync.js";
import {
  getAllStates,
  getAllDistricts,
  getAllCities,
  getCustomLocations,
  saveCustomLocations
} from "./locationData.js";
import {
  DEFAULT_LOCK_DURATION_MS,
  setLockDurationSeconds,
  broadcastSeatUpdate
} from "./movieController.js";

export async function handleAdminDashboard(req, res) {
  try {
    const usersCount = await User.countDocuments();
    const bookings = await Booking.find().lean();
    const currentMovies = await Movie.find().lean();
    const currentTheatres = await Theatre.find().lean();
    const currentEvents = await Event.find().lean();

    const activeBookings = bookings.filter((b) => b.status === "ACTIVE" || b.status === "CONFIRMED");
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    const totalTicketsSold = activeBookings.reduce((sum, b) => sum + (b.seats?.length || 1), 0);

    const now = Date.now();
    const activeLocks = [];
    Object.keys(dbState.seatLocks || {}).forEach((key) => {
      const lock = dbState.seatLocks[key];
      const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
      if (lock && now - lock.lockedAt < duration) {
        const parts = key.split("_");
        const showId = parts[0];
        const seatId = parts[1] || "";
        activeLocks.push({
          key,
          showId,
          seatId,
          userId: lock.userId,
          lockedAt: lock.lockedAt,
          expiresAt: lock.lockedAt + duration,
          remainingSeconds: Math.max(0, Math.floor((lock.lockedAt + duration - now) / 1000))
        });
      }
    });

    const payments = await Payment.find().lean();
    const capturedPayments = payments.filter((p) => p.status === "CAPTURED");
    const refundedPayments = payments.filter((p) => p.status === "REFUNDED");
    const gatewayRevenue = capturedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const stats = {
      totalUsers: usersCount,
      totalBookings: bookings.length,
      activeBookings: activeBookings.length,
      totalRevenue: gatewayRevenue || totalRevenue || 3458900,
      totalTicketsSold: totalTicketsSold || 14250,
      totalPayments: payments.length,
      capturedPaymentsCount: capturedPayments.length,
      refundedPaymentsCount: refundedPayments.length,
      totalMovies: currentMovies.length,
      totalTheatres: currentTheatres.length,
      totalEvents: currentEvents.length,
      activeLocksCount: activeLocks.length,
      lockDurationMinutes: Math.floor(DEFAULT_LOCK_DURATION_MS / 60000)
    };

    res.json({
      stats,
      recentBookings: bookings.slice(0, 20),
      recentPayments: payments.slice(0, 30),
      activeLocks,
      moviesList: currentMovies,
      theatresList: currentTheatres,
      eventsList: currentEvents,
      states: getAllStates(),
      districts: getAllDistricts(),
      cities: getAllCities()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard: " + err.message });
  }
}

export function handleGetActiveLocks(req, res) {
  const now = Date.now();
  const activeLocks = [];
  Object.keys(dbState.seatLocks || {}).forEach((key) => {
    const lock = dbState.seatLocks[key];
    const duration = lock?.duration || DEFAULT_LOCK_DURATION_MS;
    if (lock && now - lock.lockedAt < duration) {
      const parts = key.split("_");
      activeLocks.push({
        key,
        showId: parts[0],
        seatId: parts[1] || "",
        userId: lock.userId,
        lockedAt: lock.lockedAt,
        expiresAt: lock.lockedAt + duration,
        remainingSeconds: Math.max(0, Math.floor((lock.lockedAt + duration - now) / 1000))
      });
    }
  });

  res.json({
    success: true,
    total: activeLocks.length,
    lockDurationSeconds: Math.floor(DEFAULT_LOCK_DURATION_MS / 1000),
    activeLocks
  });
}

export function handleConfigureLockTimer(req, res) {
  const { durationMinutes, durationSeconds } = req.body;
  const seconds = durationSeconds || (durationMinutes ? Number(durationMinutes) * 60 : 600);
  setLockDurationSeconds(seconds);
  res.json({
    success: true,
    message: `Seat lock timer updated to ${Math.floor(seconds / 60)} minutes (${seconds}s)`,
    lockDurationSeconds: seconds
  });
}

// -------------------------------------------------------------
// Location Management (State, District, City)
// -------------------------------------------------------------

export function handleAddState(req, res) {
  try {
    const { name, code } = req.body;
    if (!name) return res.status(400).json({ error: "State name is required" });

    const custom = getCustomLocations();
    const newState = {
      id: "st-" + name.toLowerCase().replace(/\s+/g, "-"),
      name,
      code: code || name.slice(0, 2).toUpperCase()
    };

    custom.customStates = custom.customStates || [];
    custom.customStates.push(newState);
    saveCustomLocations(custom);

    res.json({ success: true, state: newState, message: "State added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add state: " + err.message });
  }
}

export function handleAddDistrict(req, res) {
  try {
    const { name, stateId, stateName } = req.body;
    if (!name || !stateId) return res.status(400).json({ error: "District name and stateId are required" });

    const custom = getCustomLocations();
    const newDistrict = {
      id: "dist-" + name.toLowerCase().replace(/\s+/g, "-"),
      stateId,
      name,
      state: stateName || "State"
    };

    custom.customDistricts = custom.customDistricts || [];
    custom.customDistricts.push(newDistrict);
    saveCustomLocations(custom);

    res.json({ success: true, district: newDistrict, message: "District added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add district: " + err.message });
  }
}

export function handleAddCity(req, res) {
  try {
    const { name, stateId, districtId, state, district, tier, isPopular } = req.body;
    if (!name) return res.status(400).json({ error: "City/town name is required" });

    const custom = getCustomLocations();
    const newCity = {
      id: "city-" + name.toLowerCase().replace(/\s+/g, "-"),
      name,
      stateId: stateId || "st-ap",
      districtId: districtId || "dist-guntur",
      state: state || "Andhra Pradesh",
      district: district || "Guntur",
      isPopular: Boolean(isPopular),
      tier: tier || "Town"
    };

    custom.customCities = custom.customCities || [];
    custom.customCities.push(newCity);
    saveCustomLocations(custom);

    res.json({ success: true, city: newCity, message: "City/town added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add city: " + err.message });
  }
}

// -------------------------------------------------------------
// Theatre & Screen Management
// -------------------------------------------------------------

export async function handleAddTheatre(req, res) {
  try {
    const { name, city, state, district, address, rating, screenName, screenType, capacity } = req.body;
    if (!name || !city) {
      return res.status(400).json({ error: "Theatre name and city are required" });
    }

    const safeCapacity = Math.max(120, Number(capacity) || 240); // Enforce minimum 120 seats rule

    const newTheatre = new Theatre({
      id: "th-" + Date.now(),
      name,
      city,
      state: state || "Andhra Pradesh",
      district: district || "Guntur",
      address: address || `${name}, Cinema Boulevard, ${city}`,
      rating: Number(rating) || 4.7,
      facilities: ["Dolby Atmos", "4K Laser", "Pushback Plush Seats", "Cafeteria"],
      screens: [
        {
          id: "scr-" + Date.now(),
          name: screenName || "Screen 1 - Main Audi",
          type: screenType || "IMAX Laser 3D",
          soundType: "Dolby Atmos 64-Channel",
          capacity: safeCapacity
        }
      ]
    });

    await newTheatre.save();
    saveTheatreToFirestoreLive(newTheatre.toObject()).catch(() => {});

    res.json({ success: true, theatre: newTheatre, message: "Theatre added successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add theatre: " + err.message });
  }
}

export async function handleAddScreen(req, res) {
  try {
    const { theatreId } = req.params;
    const { name, type, soundType, capacity } = req.body;

    const theatre = await Theatre.findOne({ id: theatreId });
    if (!theatre) return res.status(404).json({ error: "Theatre not found" });

    const safeCapacity = Math.max(120, Number(capacity) || 220); // Minimum 120 seats rule

    const newScreen = {
      id: `scr-${Date.now()}`,
      name: name || `Screen ${(theatre.screens?.length || 0) + 1}`,
      type: type || "Dolby Atmos 4K",
      soundType: soundType || "Dolby Atmos 7.1",
      capacity: safeCapacity
    };

    theatre.screens = theatre.screens || [];
    theatre.screens.push(newScreen);
    await theatre.save();

    saveTheatreToFirestoreLive(theatre.toObject()).catch(() => {});

    res.json({ success: true, screen: newScreen, message: "Screen added to theatre successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add screen: " + err.message });
  }
}

export async function handleDeleteTheatre(req, res) {
  try {
    const { id } = req.params;
    await Theatre.deleteOne({ id });
    deleteTheatreFromFirestoreLive(id).catch(() => {});

    res.json({ success: true, message: "Theatre removed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete theatre: " + err.message });
  }
}

// -------------------------------------------------------------
// Movie Management
// -------------------------------------------------------------

export async function handleAddMovie(req, res) {
  try {
    const {
      title,
      genre,
      language,
      languages,
      duration,
      rating,
      certificate,
      certification,
      poster,
      banner,
      backdrop,
      trailer,
      description,
      synopsis,
      releaseDate,
      cities,
      status,
      director,
      producer,
      music,
      cast,
      crew,
      formats
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Movie title is required" });
    }

    const safeLanguage = Array.isArray(language) ? language.join(", ") : language || "Telugu";
    let safeLanguages = [];
    if (Array.isArray(languages) && languages.length > 0) {
      safeLanguages = languages;
    } else if (typeof languages === "string" && languages.trim()) {
      safeLanguages = languages.split(",").map((l) => l.trim()).filter(Boolean);
    } else {
      safeLanguages = [safeLanguage];
    }

    let safeGenre = [];
    if (Array.isArray(genre) && genre.length > 0) {
      safeGenre = genre;
    } else if (typeof genre === "string" && genre.trim()) {
      safeGenre = genre.split(",").map((g) => g.trim()).filter(Boolean);
    } else {
      safeGenre = ["Action", "Drama"];
    }

    const cleanCast = Array.isArray(cast)
      ? cast.map((c) => ({
          name: c.name || "Actor",
          role: c.role || "Lead Role",
          image: c.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }))
      : [];

    const cleanCrew = Array.isArray(crew)
      ? crew.map((c) => ({
          name: c.name || "Crew Member",
          role: c.role || "Director",
          image: c.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        }))
      : [];

    // Parse & sanitize language-specific trailer links
    const safeTrailers = {};
    if (req.body.trailers && typeof req.body.trailers === "object" && !Array.isArray(req.body.trailers)) {
      Object.entries(req.body.trailers).forEach(([lang, url]) => {
        if (lang && url && typeof url === "string" && url.trim()) {
          safeTrailers[lang.trim()] = url.trim();
        }
      });
    } else if (Array.isArray(req.body.languageTrailers)) {
      req.body.languageTrailers.forEach((t) => {
        if (t && t.language && t.url && typeof t.url === "string" && t.url.trim()) {
          safeTrailers[t.language.trim()] = t.url.trim();
        }
      });
    }

    // Fallback if no specific language trailers dictionary was sent but trailer string exists
    if (Object.keys(safeTrailers).length === 0 && trailer && typeof trailer === "string" && trailer.trim()) {
      safeTrailers[safeLanguage || "Telugu"] = trailer.trim();
    }

    const primaryTrailer =
      safeTrailers[safeLanguage] ||
      Object.values(safeTrailers)[0] ||
      trailer ||
      "https://www.youtube.com/embed/dQw4w9WgXcQ";

    const newMovie = new Movie({
      id: "mov-" + Date.now(),
      title: title.trim(),
      genre: safeGenre,
      language: safeLanguage,
      languages: safeLanguages,
      duration: duration || "2h 45m",
      rating: Number(rating) || 9.2,
      votes: "1.2K",
      certificate: certification || certificate || "U/A 16+",
      certification: certification || certificate || "U/A 16+",
      poster: poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
      backdrop: backdrop || banner || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200",
      banner: backdrop || banner || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200",
      trailer: primaryTrailer,
      trailerUrl: primaryTrailer,
      trailers: safeTrailers,
      description: synopsis || description || "An epic cinematic release on CineFy.",
      synopsis: synopsis || description || "An epic cinematic release on CineFy.",
      releaseDate: releaseDate || new Date().toISOString().split("T")[0],
      formats: Array.isArray(formats) && formats.length > 0 ? formats : ["2D", "3D", "IMAX 3D", "4DX"],
      cities: Array.isArray(cities) && cities.length > 0 ? cities : ["All"],
      status: status || "now_showing",
      director: director || (cleanCrew.find((c) => c.role?.toLowerCase().includes("director"))?.name || ""),
      producer: producer || (cleanCrew.find((c) => c.role?.toLowerCase().includes("producer"))?.name || ""),
      music: music || (cleanCrew.find((c) => c.role?.toLowerCase().includes("music"))?.name || ""),
      cast: cleanCast,
      crew: cleanCrew
    });

    await newMovie.save();
    saveMovieToFirestoreLive(newMovie.toObject()).catch(() => {});

    res.json({ success: true, movie: newMovie, message: `Movie "${newMovie.title}" added to live inventory with ${cleanCast.length} cast and ${cleanCrew.length} crew members!` });
  } catch (err) {
    res.status(500).json({ error: "Failed to add movie: " + err.message });
  }
}

export async function handleDeleteMovie(req, res) {
  try {
    const { id } = req.params;
    await Movie.deleteOne({ id });
    deleteMovieFromFirestoreLive(id).catch(() => {});

    res.json({ success: true, message: "Movie removed from inventory." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete movie: " + err.message });
  }
}

// -------------------------------------------------------------
// Event Management (Concerts, Sports, Cultural Events)
// -------------------------------------------------------------

export async function handleAddEvent(req, res) {
  try {
    const {
      title,
      category,
      city,
      venue,
      date,
      time,
      price,
      poster,
      image,
      description,
      artist,
      artists,
      sportType,
      teamA,
      teamB,
      tournament,
      stands
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Event / Match title is required" });
    }

    const safeCategory = category || "Events";
    const imageAddress = image || poster || (safeCategory === "Sports" ? "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800" : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800");

    const newEvent = new Event({
      id: "ev-" + Date.now(),
      title: title.trim(),
      category: safeCategory,
      city: city || "Hyderabad",
      venue: venue || "G.M.C. Balayogi Athletic Stadium, Gachibowli",
      date: date || new Date().toISOString().split("T")[0],
      time: time || "07:00 PM",
      price: Number(price) || (safeCategory === "Sports" ? 1800 : (safeCategory === "Concerts" ? 1499 : 499)),
      image: imageAddress,
      description: description || `Experience thrilling live ${safeCategory.toLowerCase()} action on CineFy.`,
      artist: artist || (Array.isArray(artists) ? artists.join(", ") : ""),
      artists: Array.isArray(artists) ? artists : (artist ? [artist] : []),
      sportType: sportType || "Cricket",
      teamA: teamA || "",
      teamB: teamB || "",
      tournament: tournament || (sportType ? `${sportType} Championship 2026` : "")
    });

    await newEvent.save();
    saveEventToFirestoreLive(newEvent.toObject()).catch(() => {});

    res.json({ success: true, event: newEvent, message: `${safeCategory.slice(0, -1) || safeCategory} "${newEvent.title}" published successfully to CineFy!` });
  } catch (err) {
    res.status(500).json({ error: "Failed to create event: " + err.message });
  }
}

export async function handleUpdateMovie(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingMovie = await Movie.findOne({ id });
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Process trailers updates if provided
    let safeTrailers = existingMovie.trailers || {};
    if (updates.trailers && typeof updates.trailers === "object" && !Array.isArray(updates.trailers)) {
      safeTrailers = {};
      Object.entries(updates.trailers).forEach(([lang, url]) => {
        if (lang && url && typeof url === "string" && url.trim()) {
          safeTrailers[lang.trim()] = url.trim();
        }
      });
    } else if (Array.isArray(updates.languageTrailers)) {
      safeTrailers = {};
      updates.languageTrailers.forEach((t) => {
        if (t && t.language && t.url && typeof t.url === "string" && t.url.trim()) {
          safeTrailers[t.language.trim()] = t.url.trim();
        }
      });
    } else if (updates.trailer && typeof updates.trailer === "string" && updates.trailer.trim() && Object.keys(safeTrailers).length === 0) {
      safeTrailers[updates.language || existingMovie.language || "Telugu"] = updates.trailer.trim();
    }

    const primaryTrailer =
      safeTrailers[updates.language || existingMovie.language] ||
      Object.values(safeTrailers)[0] ||
      updates.trailer ||
      existingMovie.trailer ||
      "https://www.youtube.com/embed/dQw4w9WgXcQ";

    Object.assign(existingMovie, updates, {
      trailer: primaryTrailer,
      trailerUrl: primaryTrailer,
      trailers: safeTrailers,
      rating: updates.rating !== undefined ? Number(updates.rating) : existingMovie.rating,
      languages: Array.isArray(updates.languages)
        ? updates.languages
        : typeof updates.languages === "string"
        ? updates.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : existingMovie.languages,
      genre: Array.isArray(updates.genre)
        ? updates.genre
        : typeof updates.genre === "string"
        ? updates.genre.split(",").map((g) => g.trim()).filter(Boolean)
        : existingMovie.genre,
      cast: Array.isArray(updates.cast) ? updates.cast : existingMovie.cast || [],
      crew: Array.isArray(updates.crew) ? updates.crew : existingMovie.crew || []
    });

    await existingMovie.save();
    saveMovieToFirestoreLive(existingMovie.toObject()).catch(() => {});

    res.json({ success: true, movie: existingMovie, message: "Movie updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update movie: " + err.message });
  }
}

export async function handleUpdateTheatre(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingTheatre = await Theatre.findOne({ id });
    if (!existingTheatre) {
      return res.status(404).json({ error: "Theatre not found" });
    }
    Object.assign(existingTheatre, updates, {
      rating: updates.rating !== undefined ? Number(updates.rating) : existingTheatre.rating,
      screensCount: updates.screensCount !== undefined ? Number(updates.screensCount) : existingTheatre.screensCount,
      facilities: Array.isArray(updates.facilities)
        ? updates.facilities
        : typeof updates.facilities === "string"
        ? updates.facilities.split(",").map((f) => f.trim()).filter(Boolean)
        : existingTheatre.facilities || []
    });

    await existingTheatre.save();
    saveTheatreToFirestoreLive(existingTheatre.toObject()).catch(() => {});

    res.json({ success: true, theatre: existingTheatre, message: "Theatre updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update theatre: " + err.message });
  }
}

export async function handleUpdateEvent(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingEvent = await Event.findOne({ id });
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    Object.assign(existingEvent, updates, {
      price: updates.price !== undefined ? Number(updates.price) : existingEvent.price
    });

    await existingEvent.save();
    saveEventToFirestoreLive(existingEvent.toObject()).catch(() => {});

    res.json({ success: true, event: existingEvent, message: "Event updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update event: " + err.message });
  }
}

export async function handleDeleteEvent(req, res) {
  try {
    const { id } = req.params;
    await Event.deleteOne({ id });
    deleteEventFromFirestoreLive(id).catch(() => {});

    res.json({ success: true, message: "Event removed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event: " + err.message });
  }
}
