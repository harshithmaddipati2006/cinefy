import express from "express";
import {
  handleGetMovies,
  handleGetMovieById,
  handleGetTheatres,
  handleGetTheatresByCity,
  handleGetTheatreSchedule,
  handleGetScreensByTheatre,
  handleGetEvents,
  handleGetEventById,
  handleGetShows,
  handleGetSeatMap,
  handleLockSeats,
  handleUnlockSeats,
  handleSeatStream,
  handleGetStates,
  handleGetDistricts,
  handleGetCities,
  handleGetReviews,
  handleAddReview
} from "../movieController.js";
import { dbState } from "../db.js";
import { FOOD_ITEMS, OFFERS } from "../../src/data/seedData.js";

const router = express.Router();

// Location Hierarchy Endpoints
router.get("/states", handleGetStates);
router.get("/districts/:stateId", handleGetDistricts);
router.get("/districts", handleGetDistricts);
router.get("/cities/:districtId", handleGetCities);
router.get("/cities", handleGetCities);

// Theatres & Screens
router.get("/theatres", handleGetTheatres);
router.get("/theatres/:theatreId/schedule", handleGetTheatreSchedule);
router.get("/theatre/:theatreId", handleGetTheatreSchedule);
router.get("/theatres/:cityId", handleGetTheatresByCity);
router.get("/screens/:theatreId", handleGetScreensByTheatre);

// Movies & Shows
router.get("/movies", handleGetMovies);
router.get("/movies/:id", handleGetMovieById);
router.get("/events", handleGetEvents);
router.get("/events/:id", handleGetEventById);
router.get("/shows", handleGetShows);

// Real-Time Seat Layout, Availability & SSE Stream
router.get("/shows/:showId/seats", handleGetSeatMap);
router.get("/shows/:showId/stream", handleSeatStream);
router.get("/shows/:showId/events", handleSeatStream);

// Seat Locking & Unlocking
router.post("/shows/:showId/seats/lock", handleLockSeats);
router.post("/shows/:showId/seats/unlock", handleUnlockSeats);
router.post("/shows/lock-seats", handleLockSeats);
router.post("/seats/lock", handleLockSeats);
router.post("/seats/unlock", handleUnlockSeats);

// Reviews
router.get("/movies/:movieId/reviews", handleGetReviews);
router.get("/reviews/movie/:movieId", handleGetReviews);
router.post("/movies/:movieId/reviews", handleAddReview);
router.post("/reviews", handleAddReview);

// Coupons validation
router.post("/coupons/validate", (req, res) => {
  const { code, amount, totalAmount } = req.body;
  const upper = String(code || "").toUpperCase().trim();
  const offers = dbState.offers || OFFERS;
  const found = offers.find((o) => o.code.toUpperCase() === upper);

  const baseAmt = Number(amount || totalAmount) || 250;

  if (!found) {
    if (upper === "CINEFY100" || upper === "FIRST50" || upper === "UPI50" || upper === "BLOCKBUSTER") {
      const discount = upper === "CINEFY100" ? 100 : 50;
      return res.json({
        valid: true,
        discount,
        discountAmount: discount,
        code: upper,
        offer: {
          code: upper,
          title: `Instant ₹${discount} Promotional Discount`,
          discount
        },
        description: `₹${discount} Instant discount applied!`
      });
    }
    return res.status(400).json({ valid: false, error: "Invalid or expired coupon code", message: "Invalid promo coupon" });
  }

  const discount = Math.min(found.discount || 75, baseAmt);
  res.json({
    valid: true,
    discount,
    discountAmount: discount,
    code: found.code,
    offer: found,
    description: found.title || `Special offer: ₹${discount} off!`
  });
});

// Food and Snacks endpoint (supports both object and array response styles)
router.get("/food", (req, res) => {
  const items = dbState.foodItems || FOOD_ITEMS;
  // If headers or query param asks for wrapped or plain:
  res.json({
    success: true,
    total: items.length,
    items,
    foodItems: items,
    results: items
  });
});

router.get("/food-items", (req, res) => {
  const items = dbState.foodItems || FOOD_ITEMS;
  res.json({
    success: true,
    total: items.length,
    items,
    foodItems: items,
    results: items
  });
});

router.get("/offers", (req, res) => {
  res.json(dbState.offers || OFFERS);
});

export default router;
