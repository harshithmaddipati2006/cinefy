import fs from "fs";
import path from "path";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from "firebase/firestore";

let firestoreDb = null;
const firestoreMoviesMap = new Map();
const firestoreTheatresMap = new Map();
const firestoreEventsMap = new Map();

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    try {
      firestoreDb = firebaseConfig.firestoreDatabaseId
        ? initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true,
            useFetchStreams: false
          }, firebaseConfig.firestoreDatabaseId)
        : initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true,
            useFetchStreams: false
          });
    } catch {
      firestoreDb = firebaseConfig.firestoreDatabaseId
        ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
        : getFirestore(app);
    }
    console.log("[FirebaseSync] Firestore client initialized for database:", firebaseConfig.firestoreDatabaseId || "default");
  } else {
    console.warn("[FirebaseSync] firebase-applet-config.json not found");
  }
} catch (e) {
  console.error("[FirebaseSync] Initialization error:", e.message);
}

/**
 * Starts real-time listening on Firestore movies, theatres, and events collections
 */
export function initFirestoreLiveSync(onMoviesUpdated) {
  if (!firestoreDb) {
    console.warn("[FirebaseSync] Firestore DB not available for live sync.");
    return;
  }

  try {
    // 1. Listen for real-time changes in movies collection
    const moviesCol = collection(firestoreDb, "movies");
    onSnapshot(
      moviesCol,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          const data = { id: docId, ...change.doc.data() };
          if (change.type === "removed") {
            firestoreMoviesMap.delete(docId);
          } else {
            firestoreMoviesMap.set(docId, data);
          }
        });
        console.log(`[FirebaseSync] Live Movies updated in real-time. Count: ${firestoreMoviesMap.size}`);
        if (typeof onMoviesUpdated === "function") {
          onMoviesUpdated(Array.from(firestoreMoviesMap.values()));
        }
      },
      (error) => {
        console.warn("[FirebaseSync] Movies onSnapshot error:", error.message);
      }
    );

    // 2. Listen for real-time changes in theatres collection
    const theatresCol = collection(firestoreDb, "theatres");
    onSnapshot(
      theatresCol,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          const data = { id: docId, ...change.doc.data() };
          if (change.type === "removed") {
            firestoreTheatresMap.delete(docId);
          } else {
            firestoreTheatresMap.set(docId, data);
          }
        });
      },
      (error) => {
        console.warn("[FirebaseSync] Theatres onSnapshot error:", error.message);
      }
    );

    // 3. Listen for real-time changes in events collection
    const eventsCol = collection(firestoreDb, "events");
    onSnapshot(
      eventsCol,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          const data = { id: docId, ...change.doc.data() };
          if (change.type === "removed") {
            firestoreEventsMap.delete(docId);
          } else {
            firestoreEventsMap.set(docId, data);
          }
        });
      },
      (error) => {
        console.warn("[FirebaseSync] Events onSnapshot error:", error.message);
      }
    );
  } catch (err) {
    console.error("[FirebaseSync] Error setting up onSnapshot listeners:", err.message);
  }
}

export function getLiveFirestoreMovies() {
  return Array.from(firestoreMoviesMap.values());
}

export function getLiveFirestoreTheatres() {
  return Array.from(firestoreTheatresMap.values());
}

export function getLiveFirestoreEvents() {
  return Array.from(firestoreEventsMap.values());
}

export async function saveMovieToFirestoreLive(movie) {
  if (!firestoreDb || !movie || !movie.id) return false;
  try {
    const movieDocRef = doc(firestoreDb, "movies", movie.id);
    const cleanMovie = JSON.parse(JSON.stringify(movie));
    cleanMovie.updatedAt = new Date().toISOString();
    await setDoc(movieDocRef, cleanMovie, { merge: true });
    firestoreMoviesMap.set(movie.id, cleanMovie);
    console.log(`[FirebaseSync] Movie "${cleanMovie.title}" (${cleanMovie.id}) persisted to live Firestore.`);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to save movie to Firestore:", err.message);
    return false;
  }
}

export async function deleteMovieFromFirestoreLive(movieId) {
  if (!firestoreDb || !movieId) return false;
  try {
    const movieDocRef = doc(firestoreDb, "movies", movieId);
    await deleteDoc(movieDocRef);
    firestoreMoviesMap.delete(movieId);
    console.log(`[FirebaseSync] Movie "${movieId}" deleted from live Firestore.`);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to delete movie from Firestore:", err.message);
    return false;
  }
}

export async function saveTheatreToFirestoreLive(theatre) {
  if (!firestoreDb || !theatre || !theatre.id) return false;
  try {
    const theatreDocRef = doc(firestoreDb, "theatres", theatre.id);
    const cleanTheatre = JSON.parse(JSON.stringify(theatre));
    cleanTheatre.updatedAt = new Date().toISOString();
    await setDoc(theatreDocRef, cleanTheatre, { merge: true });
    firestoreTheatresMap.set(theatre.id, cleanTheatre);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to save theatre to Firestore:", err.message);
    return false;
  }
}

export async function deleteTheatreFromFirestoreLive(theatreId) {
  if (!firestoreDb || !theatreId) return false;
  try {
    const theatreDocRef = doc(firestoreDb, "theatres", theatreId);
    await deleteDoc(theatreDocRef);
    firestoreTheatresMap.delete(theatreId);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to delete theatre from Firestore:", err.message);
    return false;
  }
}

export async function saveEventToFirestoreLive(event) {
  if (!firestoreDb || !event || !event.id) return false;
  try {
    const eventDocRef = doc(firestoreDb, "events", event.id);
    const cleanEvent = JSON.parse(JSON.stringify(event));
    cleanEvent.updatedAt = new Date().toISOString();
    await setDoc(eventDocRef, cleanEvent, { merge: true });
    firestoreEventsMap.set(event.id, cleanEvent);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to save event to Firestore:", err.message);
    return false;
  }
}

export async function deleteEventFromFirestoreLive(eventId) {
  if (!firestoreDb || !eventId) return false;
  try {
    const eventDocRef = doc(firestoreDb, "events", eventId);
    await deleteDoc(eventDocRef);
    firestoreEventsMap.delete(eventId);
    return true;
  } catch (err) {
    console.error("[FirebaseSync] Failed to delete event from Firestore:", err.message);
    return false;
  }
}
