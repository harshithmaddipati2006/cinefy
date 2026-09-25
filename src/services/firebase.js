import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let firestoreInstance;
try {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        useFetchStreams: false
      }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        useFetchStreams: false
      });
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Skill Error Handler Standards
export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write"
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
if (typeof window !== "undefined") {
  testConnection();
}

// Initialize Invisible Recaptcha for Real Phone SMS Authentication
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (typeof window === "undefined") return null;
  
  if (!window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified for Phone SMS dispatch");
        },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired, resetting verifier");
          window.recaptchaVerifier = null;
        }
      });
    } catch (e) {
      console.warn("Recaptcha initialization warning:", e);
    }
  }
  return window.recaptchaVerifier;
};

// Real SMS Dispatcher via Firebase Phone Auth
export const sendFirebasePhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
  const cleanPhone = String(phoneNumber).replace(/\D/g, "").slice(-10);
  const formattedE164 = `+91${cleanPhone}`;
  
  try {
    const appVerifier = setupRecaptcha(containerId);
    if (!appVerifier) {
      throw new Error("reCAPTCHA verifier could not be initialized");
    }
    const confirmationResult = await signInWithPhoneNumber(auth, formattedE164, appVerifier);
    window.confirmationResult = confirmationResult;
    return {
      success: true,
      confirmationResult,
      phone: formattedE164
    };
  } catch (error) {
    console.warn("Firebase Phone Auth SMS attempt:", error.message);
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
    }
    throw error;
  }
};

// Verify SMS OTP received on user's phone
export const verifyFirebasePhoneOtp = async (otpCode) => {
  if (!window.confirmationResult) {
    throw new Error("No active SMS verification session found. Please request a new OTP.");
  }
  const result = await window.confirmationResult.confirm(otpCode);
  const user = result.user;

  // Persist user record in Firestore
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      phone: user.phoneNumber,
      displayName: user.displayName || user.phoneNumber,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  return user;
};

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save user profile to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
        photoURL: user.photoURL || "",
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      console.error("Google sign in error:", error);
    }
    throw error;
  }
};

// Firestore helper: save or update user in Firestore
export const syncUserToFirestore = async (userData) => {
  try {
    if (!userData || !userData.id) return;
    const docId = userData.uid || userData.id;
    const userRef = doc(db, "users", docId);
    await setDoc(
      userRef,
      {
        uid: docId,
        id: userData.id,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        role: userData.role || "user",
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("Firestore user sync warning:", e);
  }
};

// Firestore helper: save booking to Firestore
export const saveBookingToFirestore = async (userId, bookingData) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      userId,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving booking to Firestore:", error);
    throw error;
  }
};

// Firestore helper: fetch user bookings from Firestore
export const getUserBookingsFromFirestore = async (userId) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings from Firestore:", error);
    return [];
  }
};

// -------------------------------------------------------------
// Live Movie, Theatre & Event Synchronization via Firestore
// -------------------------------------------------------------

/**
 * Fetch all movies directly from live Firestore
 */
export const getLiveMoviesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    return movies;
  } catch (error) {
    console.warn("Notice: Fetching live movies from Firestore fallback:", error.message);
    return [];
  }
};

/**
 * Real-time subscription to movies collection across all connected devices
 */
export const subscribeToLiveMovies = (callback, onError) => {
  if (!db) return () => {};
  const pathForOnSnapshot = "movies";
  try {
    const unsubscribe = onSnapshot(
      collection(db, pathForOnSnapshot),
      (snapshot) => {
        const liveMovies = [];
        snapshot.forEach((doc) => {
          liveMovies.push({ id: doc.id, ...doc.data() });
        });
        callback(liveMovies);
      },
      (error) => {
        console.warn("Notice: Real-time movie listener notice:", error.message);
        try {
          handleFirestoreError(error, OperationType.LIST, pathForOnSnapshot);
        } catch (e) {
          if (typeof onError === "function") onError(e);
        }
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn("Unable to subscribe to live movies:", e.message);
    return () => {};
  }
};

/**
 * Real-time subscription to a single movie by ID
 */
export const subscribeToLiveMovie = (movieId, callback, onError) => {
  if (!db || !movieId) return () => {};
  const pathForOnSnapshot = `movies/${movieId}`;
  try {
    const movieRef = doc(db, "movies", movieId);
    const unsubscribe = onSnapshot(
      movieRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() }, false);
        } else {
          callback(null, true);
        }
      },
      (error) => {
        console.warn("Notice: Real-time single movie listener notice:", error.message);
        try {
          handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
        } catch (e) {
          if (typeof onError === "function") onError(e);
        }
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn("Unable to subscribe to live movie:", e.message);
    return () => {};
  }
};

/**
 * Persist movie directly to Firestore
 */
export const saveMovieToFirestore = async (movieData) => {
  if (!movieData || !movieData.id) return null;
  const path = `movies/${movieData.id}`;
  try {
    const movieRef = doc(db, "movies", movieData.id);
    const cleanData = JSON.parse(JSON.stringify(movieData));
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(movieRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving movie to Firestore:", error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Handled
    }
    return false;
  }
};

/**
 * Delete movie from Firestore
 */
export const deleteMovieFromFirestore = async (movieId) => {
  if (!movieId) return false;
  const path = `movies/${movieId}`;
  try {
    const movieRef = doc(db, "movies", movieId);
    await deleteDoc(movieRef);
    return true;
  } catch (error) {
    console.error("Error deleting movie from Firestore:", error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch {
      // Handled
    }
    return false;
  }
};

/**
 * Persist custom theatre to Firestore
 */
export const saveTheatreToFirestore = async (theatreData) => {
  if (!theatreData || !theatreData.id) return null;
  try {
    const theatreRef = doc(db, "theatres", theatreData.id);
    const cleanData = JSON.parse(JSON.stringify(theatreData));
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(theatreRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving theatre to Firestore:", error);
    return false;
  }
};

/**
 * Delete custom theatre from Firestore
 */
export const deleteTheatreFromFirestore = async (theatreId) => {
  if (!theatreId) return false;
  try {
    const theatreRef = doc(db, "theatres", theatreId);
    await deleteDoc(theatreRef);
    return true;
  } catch (error) {
    console.error("Error deleting theatre from Firestore:", error);
    return false;
  }
};

/**
 * Persist custom event to Firestore
 */
export const saveEventToFirestore = async (eventData) => {
  if (!eventData || !eventData.id) return null;
  try {
    const eventRef = doc(db, "events", eventData.id);
    const cleanData = JSON.parse(JSON.stringify(eventData));
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(eventRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving event to Firestore:", error);
    return false;
  }
};

/**
 * Delete custom event from Firestore
 */
export const deleteEventFromFirestore = async (eventId) => {
  if (!eventId) return false;
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting event from Firestore:", error);
    return false;
  }
};

export { signOut, onAuthStateChanged };

