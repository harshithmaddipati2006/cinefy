// =======================================================================
// CineFy Real-Time Theatre Schedule Engine
// Deterministic real-world scheduling of specific movies in specific theatres,
// screens, dates, and showtimes with live status tracking.
// =======================================================================

import { MOVIES, THEATRES } from "./seedData.js";
import { generateTheatresForCity } from "./theatresDatabase.js";
import { enrichMovieWithRealtimeRelease, getMovieReleaseStatus } from "../utils/releaseEngine.js";
import { cleanTheatreName } from "./realWorldTheatresData.js";

// Standard showtime slots for multiplexes & single screens in India
export const STANDARD_SHOWTIME_SLOTS = [
  { id: "slot-0", label: "Morning Show", time: "09:30 AM", hour: 9, min: 30, period: "Morning" },
  { id: "slot-1", label: "Matinee Show", time: "01:15 PM", hour: 13, min: 15, period: "Afternoon" },
  { id: "slot-2", label: "First Show", time: "04:45 PM", hour: 16, min: 45, period: "Evening" },
  { id: "slot-3", label: "Second Show (Prime)", time: "07:30 PM", hour: 19, min: 30, period: "Evening" },
  { id: "slot-4", label: "Late Night Show", time: "10:45 PM", hour: 22, min: 45, period: "Night" }
];

export const SINGLE_SCREEN_SLOTS = [
  { id: "slot-0", label: "Morning Show", time: "10:30 AM", hour: 10, min: 30, period: "Morning" },
  { id: "slot-1", label: "Matinee Show", time: "02:00 PM", hour: 14, min: 0, period: "Afternoon" },
  { id: "slot-2", label: "First Show", time: "06:00 PM", hour: 18, min: 0, period: "Evening" },
  { id: "slot-3", label: "Second Show", time: "09:30 PM", hour: 21, min: 30, period: "Night" }
];

/**
 * Deterministic hash function from string
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Parse duration string e.g. "135 min" or "2h 15m" to minutes
 */
export function parseDurationMinutes(durationStr) {
  if (!durationStr) return 150;
  if (typeof durationStr === "number") return durationStr;
  const minMatch = durationStr.match(/(\d+)\s*min/i);
  if (minMatch) return parseInt(minMatch[1], 10);
  const hourMatch = durationStr.match(/(\d+)\s*h(?:our)?s?/i);
  const minPartMatch = durationStr.match(/(\d+)\s*m(?:in)?/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minPartMatch) total += parseInt(minPartMatch[1], 10);
  return total > 0 ? total : 150;
}

/**
 * Compute real-time show status against local / system clock
 */
export function getRealtimeShowStatus(timeStr, dateStr, durationMinutes = 150) {
  const now = new Date();
  
  // Format today's date YYYY-MM-DD
  const todayISO = now.toISOString().split("T")[0];
  const isToday = !dateStr || dateStr === "Today" || dateStr === todayISO;

  // If viewing a future date, all shows are upcoming & available
  if (!isToday && dateStr !== "Today") {
    return {
      status: "AVAILABLE",
      badgeType: "available",
      label: "Available",
      isPast: false,
      isLive: false,
      canBook: true
    };
  }

  // Parse showtime string e.g. "09:30 AM" or "07:30 PM"
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    return {
      status: "AVAILABLE",
      badgeType: "available",
      label: "Available",
      isPast: false,
      isLive: false,
      canBook: true
    };
  }

  let [_, hStr, mStr, meridiem] = match;
  let showHours = parseInt(hStr, 10);
  const showMins = parseInt(mStr, 10);

  if (meridiem.toUpperCase() === "PM" && showHours !== 12) {
    showHours += 12;
  } else if (meridiem.toUpperCase() === "AM" && showHours === 12) {
    showHours = 0;
  }

  const showStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), showHours, showMins, 0).getTime();
  const showEndMs = showStartMs + durationMinutes * 60 * 1000;
  const currentMs = now.getTime();

  // Show has completed
  if (currentMs > showEndMs) {
    return {
      status: "PASSED",
      badgeType: "passed",
      label: "Show Finished",
      isPast: true,
      isLive: false,
      canBook: false
    };
  }

  // Show is currently running in the auditorium
  if (currentMs >= showStartMs && currentMs <= showEndMs) {
    const elapsedMins = Math.floor((currentMs - showStartMs) / (60 * 1000));
    return {
      status: "NOW_SHOWING",
      badgeType: "live",
      label: `Running Now (${elapsedMins}m in)`,
      isPast: false,
      isLive: true,
      canBook: false
    };
  }

  // Show starts within 45 minutes
  const diffMins = Math.floor((showStartMs - currentMs) / (60 * 1000));
  if (diffMins > 0 && diffMins <= 45) {
    return {
      status: "STARTS_SOON",
      badgeType: "imminent",
      label: `Starts in ${diffMins} mins (Gate Open)`,
      isPast: false,
      isLive: false,
      canBook: true
    };
  }

  return {
    status: "AVAILABLE",
    badgeType: "available",
    label: "Available",
    isPast: false,
    isLive: false,
    canBook: true
  };
}

// =============================================================
// AP & Telangana Location Intelligence Constants
// =============================================================
export const ANDHRA_PRADESH_CITIES = [
  "Tenali", "Guntur", "Vijayawada", "Visakhapatnam", "Tirupati", "Rajahmundry", "Kakinada",
  "Nellore", "Kurnool", "Kadapa", "Anantapur", "Eluru", "Ongole", "Vizianagaram", "Srikakulam",
  "Machilipatnam", "Bhimavaram", "Proddatur", "Nandyal", "Chittoor", "Hindupur", "Tadepalligudem",
  "Gudivada", "Narasaraopet", "Mangalagiri", "Amalapuram", "Palakollu", "Dharmavaram", "Tanuku",
  "Chirala", "Kavali", "Bapatla", "Markapur", "Ponnur"
];

export const TELANGANA_CITIES = [
  "Hyderabad", "Secunderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam",
  "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Mancherial",
  "Jagtial", "Nirmal", "Kothagudem", "Kamareddy", "Bodhan", "Sangareddy"
];

/**
 * Checks if a given theatre, city name, or location belongs to Andhra Pradesh or Telangana
 */
export function isApOrTelanganaLocation(theatreOrCity) {
  if (!theatreOrCity) return false;
  let cityName = typeof theatreOrCity === "string" ? theatreOrCity : theatreOrCity.city || "";
  let stateName = typeof theatreOrCity === "object" ? theatreOrCity.state || "" : "";
  
  const c = cityName.trim().toLowerCase();
  const s = stateName.trim().toLowerCase();
  
  if (s.includes("andhra") || s.includes("telangana") || s.includes("ap")) return true;
  
  return (
    ANDHRA_PRADESH_CITIES.some((ap) => ap.toLowerCase() === c) ||
    TELANGANA_CITIES.some((ts) => ts.toLowerCase() === c)
  );
}

/**
 * Get active "Now Showing" movies suitable for scheduling
 */
export function getSchedulableMovies(allMovies = MOVIES) {
  const enriched = allMovies.map((m) => enrichMovieWithRealtimeRelease(m));
  const active = enriched.filter((m) => m.status === "now_showing" || m.isReleased);
  if (active.length > 0) return active;
  return enriched.slice(0, 8);
}

/**
 * Generate full real-time schedule of all movies playing in a specific theatre for a specific date.
 * When the theatre is in Andhra Pradesh or Telangana, it intelligently schedules BOTH Telugu blockbusters
 * and the most popular Other-Language movies (Hindi, English/Hollywood, Tamil, Malayalam, Kannada).
 */
export function getTheatreDailySchedule({ theatre, date = "Today", allMovies = MOVIES }) {
  if (!theatre) return { movies: [], screens: [], allShows: [] };

  const activeMovies = getSchedulableMovies(allMovies);
  if (activeMovies.length === 0) return { movies: [], screens: [], allShows: [] };

  const isTeluguRegion = isApOrTelanganaLocation(theatre);
  const teluguMovies = activeMovies.filter((m) => (m.language || "").toLowerCase() === "telugu");
  const otherLangMovies = activeMovies.filter((m) => (m.language || "").toLowerCase() !== "telugu");

  const screens = theatre.screens || [
    { id: `scr-${theatre.id}-1`, name: "Screen 1 - 4K Dolby Atmos", type: "Dolby Atmos 4K", capacity: 180 }
  ];

  const dateStr = date || "Today";
  const allShows = [];
  const moviesMap = new Map();

  screens.forEach((screen, screenIdx) => {
    const isSingleScreen = screens.length === 1;
    const slots = isSingleScreen ? SINGLE_SCREEN_SLOTS : STANDARD_SHOWTIME_SLOTS;

    slots.forEach((slot, slotIdx) => {
      // Deterministically pick which movie plays in this specific screen and slot for this date
      const hashKey = `${theatre.id}-${screen.id}-${dateStr}-${slotIdx}`;
      const hashVal = hashString(hashKey);

      let selectedMovie;
      let preferredLanguage;

      if (isTeluguRegion) {
        // -------------------------------------------------------------
        // ANDHRA PRADESH & TELANGANA LOCATION-AWARE SCHEDULING LOGIC:
        // Ensures a dynamic blend of Telugu blockbusters AND Other Language releases (Hindi, English, Tamil, Malayalam, Kannada)
        // -------------------------------------------------------------
        if (isSingleScreen) {
          // In a single-screen in AP/Telangana:
          // Morning / Afternoon slots showcase exciting Other-Language or dub blockbusters,
          // Evening / Prime slots showcase major Telugu blockbusters.
          if (slotIdx === 0 && otherLangMovies.length > 0) {
            // Morning show: Other Language blockbuster (Hindi / English / Malayalam / Tamil)
            selectedMovie = otherLangMovies[hashVal % otherLangMovies.length];
          } else if (slotIdx === 1 && otherLangMovies.length > 1 && (hashVal % 2 === 0)) {
            // Matinee: Other Language movie or Telugu hit
            selectedMovie = otherLangMovies[(hashVal + 1) % otherLangMovies.length];
          } else if (teluguMovies.length > 0) {
            // Prime / Night shows: Top Telugu blockbusters (e.g. OG, Lenin, Korean Kanakaraju)
            selectedMovie = teluguMovies[hashVal % teluguMovies.length];
          } else {
            selectedMovie = activeMovies[hashVal % activeMovies.length];
          }
        } else {
          // In a multiplex in AP/Telangana:
          // Screen 0: Top Telugu releases (OG, Lenin, Korean Kanakaraju)
          // Screen 1: Top Other Language releases (Stree 2, Chhaava, Spider-Man, Deadpool)
          // Screen 2: Malayalam / Tamil / Kannada / Hollywood hits (Aavesham, Amaran, Manjummel Boys, Bagheera)
          // Screen 3+: Diverse multi-lingual blend
          if (screenIdx === 0) {
            // Screen 1: Primary Telugu screen with occasional pan-India dub shows
            if (slotIdx === 0 && otherLangMovies.length > 0 && (hashVal % 3 === 0)) {
              selectedMovie = otherLangMovies[hashVal % otherLangMovies.length];
            } else if (teluguMovies.length > 0) {
              selectedMovie = teluguMovies[(slotIdx + hashVal) % teluguMovies.length];
            } else {
              selectedMovie = activeMovies[hashVal % activeMovies.length];
            }
          } else if (screenIdx === 1) {
            // Screen 2: Premier Other-Language Screen (Hindi / Hollywood English)
            const hindiOrEng = otherLangMovies.filter((m) => 
              ["hindi", "english"].includes((m.language || "").toLowerCase())
            );
            if (hindiOrEng.length > 0) {
              selectedMovie = hindiOrEng[(slotIdx + hashVal) % hindiOrEng.length];
            } else if (otherLangMovies.length > 0) {
              selectedMovie = otherLangMovies[(slotIdx + hashVal) % otherLangMovies.length];
            } else {
              selectedMovie = activeMovies[hashVal % activeMovies.length];
            }
          } else if (screenIdx === 2) {
            // Screen 3: Malayalam / Tamil / Kannada / South & Pan-India Cinema Screen
            const regionalOther = otherLangMovies.filter((m) => 
              ["malayalam", "tamil", "kannada"].includes((m.language || "").toLowerCase())
            );
            if (regionalOther.length > 0) {
              selectedMovie = regionalOther[(slotIdx + hashVal) % regionalOther.length];
            } else if (otherLangMovies.length > 0) {
              selectedMovie = otherLangMovies[(slotIdx + hashVal) % otherLangMovies.length];
            } else if (teluguMovies.length > 0) {
              selectedMovie = teluguMovies[(slotIdx + hashVal) % teluguMovies.length];
            } else {
              selectedMovie = activeMovies[hashVal % activeMovies.length];
            }
          } else {
            // Screen 4+: Balanced Multi-lingual rotation
            const pool = (slotIdx % 2 === 0 && otherLangMovies.length > 0) ? otherLangMovies : (teluguMovies.length > 0 ? teluguMovies : activeMovies);
            selectedMovie = pool[(screenIdx + slotIdx + hashVal) % pool.length];
          }
        }
      } else {
        // Non-AP/Telangana cities: General standard distribution
        if (isSingleScreen) {
          selectedMovie = slotIdx === 0 || slotIdx === 1 || slotIdx === 3 
            ? activeMovies[hashVal % 2] 
            : activeMovies[(hashVal + 1) % activeMovies.length];
        } else {
          const baseOffset = screenIdx * 2 + slotIdx;
          selectedMovie = activeMovies[(baseOffset + (hashVal % 3)) % activeMovies.length];
        }
      }

      const movie = selectedMovie || activeMovies[0];
      const durationMins = parseDurationMinutes(movie.duration);

      // Determine language for this show
      const availableLanguages = movie.languages || (movie.language ? [movie.language] : ["Telugu", "English"]);
      let showLanguage = movie.language || "Telugu";

      if (isTeluguRegion) {
        if ((movie.language || "").toLowerCase() === "telugu") {
          showLanguage = "Telugu";
        } else {
          // For other state/language movies running in Andhra Pradesh & Telangana:
          // Single screens run the movie in Telugu, multiplexes offer both Telugu and original audio shows
          if (isSingleScreen) {
            showLanguage = "Telugu";
          } else {
            // In multiplexes, prime evening/matinee/night shows run in Telugu, with selected shows in original audio
            if (slotIdx % 2 === 0 || slotIdx === 2 || slotIdx === 3) {
              showLanguage = "Telugu";
            } else {
              showLanguage = movie.language || "Telugu"; // Original Audio e.g. English, Tamil, Hindi
            }
          }
        }
      } else {
        const langIdx = hashVal % availableLanguages.length;
        showLanguage = availableLanguages[langIdx];
      }

      // Format from screen or movie capabilities
      let showFormat = screen.type || "Dolby Atmos 4K";
      if (screen.name.includes("IMAX") || (screen.type && screen.type.includes("IMAX"))) {
        showFormat = "IMAX 3D Laser";
      } else if (screen.name.includes("VIP") || screen.name.includes("Recliner")) {
        showFormat = "VIP Recliner Suite";
      } else if (screen.name.includes("3D") || movie.title.includes("Spider-Man") || movie.title.includes("Oak Street")) {
        showFormat = "3D Dolby Atmos";
      }

      // Seat pricing calculation (Always compliant with AGENTS.md)
      const isPremiumScreen = showFormat.includes("IMAX") || showFormat.includes("VIP");
      const pricing = {
        regular: isPremiumScreen ? 200 : 150,
        premium: isPremiumScreen ? 300 : 250,
        executive: isPremiumScreen ? 380 : 320,
        recliner: isPremiumScreen ? 550 : 450,
        vip: isPremiumScreen ? 750 : 600
      };

      // Seat capacity & dynamic occupancy (Always >= 120 seats per AGENTS.md)
      const totalSeats = Math.max(120, screen.capacity || 180);
      const occupancyRatio = 0.35 + ((hashVal % 55) / 100); // 35% to 90%
      const bookedSeats = Math.floor(totalSeats * occupancyRatio);
      const availableSeats = Math.max(12, totalSeats - bookedSeats);
      const isFastFilling = availableSeats < (totalSeats * 0.3);

      // Realtime show status
      const realStatus = getRealtimeShowStatus(slot.time, dateStr, durationMins);
      if (realStatus.status === "AVAILABLE" && isFastFilling) {
        realStatus.status = "FAST_FILLING";
        realStatus.label = "Filling Fast";
        realStatus.badgeType = "filling_fast";
      }

      const showId = `sh-${theatre.id}-${screen.id}-${movie.id}-${encodeURIComponent(dateStr)}-${slotIdx}`;

      const showObj = {
        id: showId,
        showId,
        slotId: slot.id,
        slotLabel: slot.label,
        period: slot.period,
        time: slot.time,
        date: dateStr,
        screenId: screen.id,
        screenName: screen.name,
        screenType: screen.type,
        format: showFormat,
        language: showLanguage,
        theatreId: theatre.id,
        theatreName: cleanTheatreName(theatre.name),
        theatreCity: theatre.city,
        theatreLocality: theatre.locality || "",
        theatreAddress: theatre.address || "",
        theatreDistance: theatre.distance || "",
        theatreFacilities: theatre.facilities || [],
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        movieRating: movie.rating,
        movieCertification: movie.certification,
        movieDuration: movie.duration,
        movieGenre: movie.genre,
        pricing,
        priceRegular: pricing.regular,
        pricePremium: pricing.premium,
        priceExecutive: pricing.executive,
        priceRecliner: pricing.recliner,
        priceVip: pricing.vip,
        totalSeats,
        availableSeats,
        occupancyPercent: Math.round(occupancyRatio * 100),
        realtimeStatus: realStatus.status,
        statusLabel: realStatus.label,
        badgeType: realStatus.badgeType,
        isPast: realStatus.isPast,
        isLive: realStatus.isLive,
        canBook: realStatus.canBook
      };

      allShows.push(showObj);

      // Group into movie map
      if (!moviesMap.has(movie.id)) {
        moviesMap.set(movie.id, {
          movie,
          shows: [],
          formats: new Set(),
          languages: new Set(),
          screens: new Set()
        });
      }
      const entry = moviesMap.get(movie.id);
      entry.shows.push(showObj);
      entry.formats.add(showFormat);
      entry.languages.add(showLanguage);
      entry.screens.add(screen.name);
    });
  });

  // Sort shows chronologically by standard time
  const timeToMins = (tStr) => {
    const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let [_, h, m, p] = match;
    let hours = parseInt(h, 10);
    if (p.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (p.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours * 60 + parseInt(m, 10);
  };

  allShows.sort((a, b) => timeToMins(a.time) - timeToMins(b.time));

  // Convert movies map to structured array
  const groupedMovies = Array.from(moviesMap.values()).map((entry) => ({
    movie: entry.movie,
    shows: entry.shows.sort((a, b) => timeToMins(a.time) - timeToMins(b.time)),
    formats: Array.from(entry.formats),
    languages: Array.from(entry.languages),
    screens: Array.from(entry.screens),
    totalShowsCount: entry.shows.length
  }));

  return {
    theatre,
    date: dateStr,
    totalMoviesCount: groupedMovies.length,
    totalShowsCount: allShows.length,
    movies: groupedMovies,
    allShows,
    screens
  };
}

/**
 * Get all theatres in a city that are actively running a specific movie on a specific date.
 */
export function getTheatresRunningMovie({
  movieId,
  city = "Tenali",
  date = "Today",
  allTheatres = THEATRES,
  allMovies = MOVIES
}) {
  const cleanCity = city && city !== "All" ? city.trim().toLowerCase() : "";
  let cityTheatres = allTheatres.filter(
    (t) => !cleanCity || t.city.toLowerCase() === cleanCity
  );

  // If no seeded theatres for this city, dynamically generate realistic ones
  if (cityTheatres.length === 0 && cleanCity) {
    const generated = generateTheatresForCity(city);
    if (generated && generated.length > 0) {
      cityTheatres = generated;
    }
  }

  // Fallback if still empty
  if (cityTheatres.length === 0) {
    cityTheatres = allTheatres.slice(0, 3);
  }

  const results = [];

  cityTheatres.forEach((theatre) => {
    const schedule = getTheatreDailySchedule({
      theatre,
      date,
      allMovies
    });

    // Find shows matching this specific movie
    const matchingMovieEntry = schedule.movies.find((m) => m.movie.id === movieId);

    if (matchingMovieEntry && matchingMovieEntry.shows.length > 0) {
      results.push({
        theatre: { ...theatre, name: cleanTheatreName(theatre.name) },
        theatreId: theatre.id,
        theatreName: cleanTheatreName(theatre.name),
        address: theatre.address,
        locality: theatre.locality,
        distance: theatre.distance,
        rating: theatre.rating,
        facilities: theatre.facilities,
        cinemaTechnology: theatre.cinemaTechnology,
        parkingInfo: theatre.parkingInfo,
        accessibility: theatre.accessibility,
        movie: matchingMovieEntry.movie,
        shows: matchingMovieEntry.shows,
        formats: matchingMovieEntry.formats,
        languages: matchingMovieEntry.languages,
        screens: matchingMovieEntry.screens,
        totalShows: matchingMovieEntry.shows.length
      });
    } else {
      // In case movie wasn't assigned in random hash, ensure at least 2 shows for the selected movie
      const targetMovie = allMovies.find((m) => m.id === movieId) || allMovies[0];
      const screen = (theatre.screens && theatre.screens[0]) || {
        id: `scr-${theatre.id}-1`,
        name: "Main Screen 4K Atmos",
        type: "Dolby Atmos 4K",
        capacity: 180
      };

      const isTeluguLoc = isApOrTelanganaLocation(theatre || city);
      const defaultShowLang1 = isTeluguLoc ? "Telugu" : (targetMovie.language || "Telugu");
      const defaultShowLang2 = isTeluguLoc 
        ? ((targetMovie.language || "").toLowerCase() === "telugu" ? "Telugu" : (targetMovie.language || "Telugu"))
        : (targetMovie.language || "Telugu");

      const availableLangsList = isTeluguLoc && (targetMovie.language || "").toLowerCase() !== "telugu"
        ? ["Telugu", targetMovie.language || "Telugu"]
        : [targetMovie.language || "Telugu"];

      const customShows = [
        {
          id: `sh-${theatre.id}-${screen.id}-${movieId}-${encodeURIComponent(date)}-0`,
          showId: `sh-${theatre.id}-${screen.id}-${movieId}-${encodeURIComponent(date)}-0`,
          time: "10:30 AM",
          period: "Morning",
          date,
          screenId: screen.id,
          screenName: screen.name,
          format: screen.type || "4K Dolby Atmos",
          language: defaultShowLang1,
          theatreId: theatre.id,
          theatreName: theatre.name,
          theatreAddress: theatre.address,
          movieId: targetMovie.id,
          movieTitle: targetMovie.title,
          pricing: { regular: 150, premium: 250, executive: 320, recliner: 450, vip: 600 },
          priceRegular: 150,
          priceRecliner: 450,
          totalSeats: 180,
          availableSeats: 94,
          realtimeStatus: "AVAILABLE",
          statusLabel: "Available",
          badgeType: "available",
          canBook: true
        },
        {
          id: `sh-${theatre.id}-${screen.id}-${movieId}-${encodeURIComponent(date)}-2`,
          showId: `sh-${theatre.id}-${screen.id}-${movieId}-${encodeURIComponent(date)}-2`,
          time: "06:00 PM",
          period: "Evening",
          date,
          screenId: screen.id,
          screenName: screen.name,
          format: screen.type || "4K Dolby Atmos",
          language: defaultShowLang2,
          theatreId: theatre.id,
          theatreName: theatre.name,
          theatreAddress: theatre.address,
          movieId: targetMovie.id,
          movieTitle: targetMovie.title,
          pricing: { regular: 150, premium: 250, executive: 320, recliner: 450, vip: 600 },
          priceRegular: 150,
          priceRecliner: 450,
          totalSeats: 180,
          availableSeats: 62,
          realtimeStatus: "AVAILABLE",
          statusLabel: "Available",
          badgeType: "available",
          canBook: true
        }
      ];

      results.push({
        theatre,
        theatreId: theatre.id,
        theatreName: theatre.name,
        address: theatre.address,
        locality: theatre.locality,
        distance: theatre.distance,
        rating: theatre.rating,
        facilities: theatre.facilities,
        movie: targetMovie,
        shows: customShows,
        formats: [screen.type || "4K Dolby Atmos"],
        languages: availableLangsList,
        screens: [screen.name],
        totalShows: customShows.length
      });
    }
  });

  return results;
}

export default {
  STANDARD_SHOWTIME_SLOTS,
  SINGLE_SCREEN_SLOTS,
  parseDurationMinutes,
  getRealtimeShowStatus,
  getSchedulableMovies,
  getTheatreDailySchedule,
  getTheatresRunningMovie
};
