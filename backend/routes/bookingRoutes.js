import express from "express";
import {
  handleCreateBooking,
  handleGetUserBookings,
  handleGetBookingById,
  handleCancelBooking
} from "../bookingController.js";
import { optionalAuth, authenticateToken } from "../authController.js";

const router = express.Router();

router.post("/", optionalAuth, handleCreateBooking);
router.post("/create", optionalAuth, handleCreateBooking);
router.get("/my", optionalAuth, handleGetUserBookings);
router.get("/user/:userId", handleGetUserBookings);
router.get("/:bookingId", handleGetBookingById);
router.post("/:bookingId/cancel", optionalAuth, handleCancelBooking);

export default router;
