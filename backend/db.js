import fs from "fs";
import path from "path";
import { MOVIES, THEATRES, EVENTS, FOOD_ITEMS, OFFERS } from "../src/data/seedData.js";
import { enrichMovieWithRealtimeRelease } from "./releaseEngine.js";
import {
  initFirestoreLiveSync,
  getLiveFirestoreMovies,
  getLiveFirestoreTheatres,
  getLiveFirestoreEvents,
  saveMovieToFirestoreLive,
  deleteMovieFromFirestoreLive,
  saveTheatreToFirestoreLive,
  deleteTheatreFromFirestoreLive,
  saveEventToFirestoreLive,
  deleteEventFromFirestoreLive
} from "./firebaseSync.js";

const DATA_DIR = path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("Error creating data dir:", e);
  }
}

export const USERS_FILE = path.join(DATA_DIR, "users.json");
export const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
export const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");
export const CUSTOM_MOVIES_FILE = path.join(DATA_DIR, "custom_movies.json");
export const CUSTOM_THEATRES_FILE = path.join(DATA_DIR, "custom_theatres.json");
export const CUSTOM_EVENTS_FILE = path.join(DATA_DIR, "custom_events.json");
export const DELETED_MOVIES_FILE = path.join(DATA_DIR, "deleted_movies.json");
export const DELETED_THEATRES_FILE = path.join(DATA_DIR, "deleted_theatres.json");
export const DELETED_EVENTS_FILE = path.join(DATA_DIR, "deleted_events.json");

export function loadJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Error loading file ${filePath}:`, e);
  }
  return defaultValue;
}

export function saveJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (me) {}
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn(`Notice: Unable to write ${filePath} (${e.message}). State maintained in-memory.`);
  }
}

export function loadUsers() {
  return loadJSON(USERS_FILE, []);
}

export function saveUsers(users) {
  saveJSON(USERS_FILE, users);
}

export function loadBookings() {
  return loadJSON(BOOKINGS_FILE, []);
}

export function saveBookings(bookings) {
  saveJSON(BOOKINGS_FILE, bookings);
}

export function loadPayments() {
  return loadJSON(PAYMENTS_FILE, []);
}

export function savePayments(payments) {
  saveJSON(PAYMENTS_FILE, payments);
}

// In-memory runtime data with disk sync
export const dbState = {
  users: loadUsers(),
  bookings: loadBookings(),
  payments: loadPayments(),
  customMovies: loadJSON(CUSTOM_MOVIES_FILE, []),
  deletedMovieIds: new Set(loadJSON(DELETED_MOVIES_FILE, [])),
  customTheatres: loadJSON(CUSTOM_THEATRES_FILE, []),
  deletedTheatreIds: new Set(loadJSON(DELETED_THEATRES_FILE, [])),
  customEvents: loadJSON(CUSTOM_EVENTS_FILE, []),
  deletedEventIds: new Set(loadJSON(DELETED_EVENTS_FILE, [])),
  foodItems: [...FOOD_ITEMS],
  offers: [...OFFERS],
  seatLocks: {},
  phoneOtpStore: {},
  reviews: [
    // --- mov-101: Lenin ---
    {
      id: "rev-101-1",
      movieId: "mov-101",
      userName: "Karthik Varma",
      rating: 5,
      comment: "Akhil Akkineni delivers a career-best performance in Lenin! His intense raw emotion in the pre-climax village festival sequence was top-notch. Bhagyashriborse and Sunil complement the thrilling narrative perfectly.",
      date: "2026-07-15"
    },
    {
      id: "rev-101-2",
      movieId: "mov-101",
      userName: "Divya Reddy",
      rating: 5,
      comment: "Murali Kishore Abburi directed a gripping rural political drama. Akhil Akkineni's high-octane action scenes and Thaman S's thumping background score gave goosebumps in the theatre!",
      date: "2026-07-18"
    },
    {
      id: "rev-101-3",
      movieId: "mov-101",
      userName: "Rahul Naidu",
      rating: 4,
      comment: "Bhagyashriborse brought genuine heart to Bharathi's character, and Akhil's transformation in the second half of Lenin is phenomenal.",
      date: "2026-07-22"
    },

    // --- mov-102: Korean Kanakaraju ---
    {
      id: "rev-102-1",
      movieId: "mov-102",
      userName: "Rohit Chowdary",
      rating: 5,
      comment: "Varun Tej's comedic timing as Kanakaraju is hilarious! The transition when possessed by the Korean gangster ghost is peak entertainment. Satya's one-liners had the entire auditorium laughing non-stop.",
      date: "2026-08-08"
    },
    {
      id: "rev-102-2",
      movieId: "mov-102",
      userName: "Sneha Latha",
      rating: 5,
      comment: "Merlapaka Gandhi wrote a fresh, entertaining fantasy-comedy. Varun Tej and Ritika Nayak share great chemistry, and the South Korea climax sequence was pure fun.",
      date: "2026-08-10"
    },
    {
      id: "rev-102-3",
      movieId: "mov-102",
      userName: "Pavan Teja",
      rating: 4,
      comment: "Satya and Varun Tej make an unstoppable comedy duo in Korean Kanakaraju. Thaman's quirky score fits the wacky storyline brilliantly.",
      date: "2026-08-12"
    },

    // --- mov-103: Spider-Man: The Brand New Day ---
    {
      id: "rev-103-1",
      movieId: "mov-103",
      userName: "Aryan Gupta",
      rating: 5,
      comment: "Tom Holland proves once again why he is the definitive Spider-Man. The emotional depth Peter Parker faces in this grounded NYC arc with Zendaya and Ned is deeply moving. Destin Daniel Cretton's direction is stellar!",
      date: "2026-07-26"
    },
    {
      id: "rev-103-2",
      movieId: "mov-103",
      userName: "Meera Nambiar",
      rating: 5,
      comment: "The high-flying web-slinging action in IMAX Laser was breathtaking! Tom Holland's raw vulnerability and Michael Giacchino's refreshed orchestral score make Brand New Day an instant comic-book classic.",
      date: "2026-07-29"
    },
    {
      id: "rev-103-3",
      movieId: "mov-103",
      userName: "Abhishek Sen",
      rating: 5,
      comment: "A fantastic return to classic street-level heroism. Zendaya and Tom Holland's scenes bring immense nostalgia and emotional weight.",
      date: "2026-08-01"
    },

    // --- mov-104: DC ---
    {
      id: "rev-104-1",
      movieId: "mov-104",
      userName: "Vikramadityan S",
      rating: 5,
      comment: "Lokesh Kanagaraj makes an astonishing acting debut as Devadas! His brooding intensity and fearless screen presence alongside Wamiqa Gabbi's fierce performance as Chandra is breathtaking. Anirudh's background score is mind-blowing!",
      date: "2026-08-08"
    },
    {
      id: "rev-104-2",
      movieId: "mov-104",
      userName: "Kaviya Sundaram",
      rating: 5,
      comment: "Arun Matheswaran crafts a dark, stylish revenge saga in DC. Wamiqa Gabbi delivers an award-worthy performance, and Lokesh Kanagaraj shines in the brutal gunfight sequences.",
      date: "2026-08-11"
    },
    {
      id: "rev-104-3",
      movieId: "mov-104",
      userName: "Manikandan G",
      rating: 5,
      comment: "Anirudh Ravichander’s theme track elevates every scene of DC. Sanjana Krishnamoorthy and Lokesh Kanagaraj deliver powerful character arcs.",
      date: "2026-08-14"
    },

    // --- mov-105: The Chennai LoveStory ---
    {
      id: "rev-105-1",
      movieId: "mov-105",
      userName: "Swathi Prasad",
      rating: 5,
      comment: "Kiran Abbavaram gives a deeply earnest and charming performance as Steven Shankar! Sri Gouri Priya portrays Niveditha's emotional vulnerability with extraordinary finesse. Mani Sharma's melodies stay in your head for days.",
      date: "2026-07-27"
    },
    {
      id: "rev-105-2",
      movieId: "mov-105",
      userName: "Harish Rao",
      rating: 4,
      comment: "Ravi Namburii delivers a soulful romantic drama with an unexpected twist. Kiran Abbavaram and Sri Gouri Priya's conversations feel so genuine and heartfelt.",
      date: "2026-07-30"
    },
    {
      id: "rev-105-3",
      movieId: "mov-105",
      userName: "Pooja Kulkarni",
      rating: 4,
      comment: "A heartwarming film about healing and cinema. Adith Arun and Kiran Abbavaram played their parts with immense grace.",
      date: "2026-08-04"
    },

    // --- mov-108: The End of Oak Street ---
    {
      id: "rev-108-1",
      movieId: "mov-108",
      userName: "Siddharth Bannerjee",
      rating: 5,
      comment: "Anne Hathaway and Ewan McGregor deliver powerhouse emotional performances as Denise and Greg Platt. The suspense of the cosmic anomaly at the edge of the street kept me on the edge of my seat throughout!",
      date: "2026-08-15"
    },
    {
      id: "rev-108-2",
      movieId: "mov-108",
      userName: "Tanvi Merchant",
      rating: 5,
      comment: "David Robert Mitchell creates a masterclass in atmospheric sci-fi thriller. The prehistoric dimensional rift visuals combined with Michael Giacchino's eerie score are breathtaking.",
      date: "2026-08-16"
    },
    {
      id: "rev-108-3",
      movieId: "mov-108",
      userName: "Neil Fernandez",
      rating: 4,
      comment: "Young Christian Convery and Maisy Stella shine alongside Anne Hathaway. A riveting, nostalgic 80s sci-fi mystery with immense heart.",
      date: "2026-08-18"
    }
  ]
};

// Initialize background live sync with Firestore
try {
  initFirestoreLiveSync((liveMovies) => {
    // When real-time Firestore updates occur, update custom_movies cache
    if (Array.isArray(liveMovies) && liveMovies.length > 0) {
      // Sync into local cache for fallback
      saveJSON(CUSTOM_MOVIES_FILE, liveMovies);
    }
  });
} catch (e) {
  console.warn("[DB] Firestore live sync init notice:", e.message);
}

export function getEffectiveMovies() {
  const liveFirestore = getLiveFirestoreMovies();
  const mergedMap = new Map();

  // 1. Base seed movies
  MOVIES.forEach((m) => {
    if (!dbState.deletedMovieIds.has(m.id)) {
      mergedMap.set(m.id, m);
    }
  });

  // 2. Custom movies from local cache
  (dbState.customMovies || []).forEach((m) => {
    if (m && m.id && !dbState.deletedMovieIds.has(m.id)) {
      mergedMap.set(m.id, m);
    }
  });

  // 3. Live Firestore movies (highest authority across all systems)
  (liveFirestore || []).forEach((m) => {
    if (m && m.id && !dbState.deletedMovieIds.has(m.id)) {
      mergedMap.set(m.id, m);
    }
  });

  const allRaw = Array.from(mergedMap.values());
  return allRaw.map((m) => enrichMovieWithRealtimeRelease(m));
}

export function getEffectiveTheatres() {
  const liveTheatres = getLiveFirestoreTheatres();
  const mergedMap = new Map();

  THEATRES.forEach((t) => {
    if (!dbState.deletedTheatreIds.has(t.id)) {
      mergedMap.set(t.id, t);
    }
  });

  (dbState.customTheatres || []).forEach((t) => {
    if (t && t.id && !dbState.deletedTheatreIds.has(t.id)) {
      mergedMap.set(t.id, t);
    }
  });

  (liveTheatres || []).forEach((t) => {
    if (t && t.id && !dbState.deletedTheatreIds.has(t.id)) {
      mergedMap.set(t.id, t);
    }
  });

  return Array.from(mergedMap.values());
}

export function getEffectiveEvents() {
  const liveEvents = getLiveFirestoreEvents();
  const mergedMap = new Map();

  EVENTS.forEach((e) => {
    if (!dbState.deletedEventIds.has(e.id)) {
      mergedMap.set(e.id, e);
    }
  });

  (dbState.customEvents || []).forEach((e) => {
    if (e && e.id && !dbState.deletedEventIds.has(e.id)) {
      mergedMap.set(e.id, e);
    }
  });

  (liveEvents || []).forEach((e) => {
    if (e && e.id && !dbState.deletedEventIds.has(e.id)) {
      mergedMap.set(e.id, e);
    }
  });

  return Array.from(mergedMap.values());
}
