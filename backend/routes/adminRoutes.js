import express from "express";
import {
  handleAdminDashboard,
  handleGetActiveLocks,
  handleConfigureLockTimer,
  handleAddState,
  handleAddDistrict,
  handleAddCity,
  handleAddTheatre,
  handleUpdateTheatre,
  handleAddScreen,
  handleDeleteTheatre,
  handleAddMovie,
  handleUpdateMovie,
  handleDeleteMovie,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent
} from "../adminController.js";
import {
  handleAdminVerifyCode,
  handleAdminUniversalLogin,
  handleAdminSendTextNotice,
  authenticateAdmin
} from "../authController.js";

const router = express.Router();

// Admin verification & Login (Phone, Email, Password, PIN)
router.post("/verify-code", handleAdminVerifyCode);
router.post("/login", handleAdminUniversalLogin);
router.post("/auth/universal", handleAdminUniversalLogin);
router.post("/send-text-notice", handleAdminSendTextNotice);

// Admin dashboard & inventory operations (Strictly Protected: Only role === 'admin' allowed)
router.get("/dashboard", authenticateAdmin, handleAdminDashboard);
router.get("/locks", authenticateAdmin, handleGetActiveLocks);
router.post("/lock-timer", authenticateAdmin, handleConfigureLockTimer);

// Location Management
router.post("/states", authenticateAdmin, handleAddState);
router.post("/districts", authenticateAdmin, handleAddDistrict);
router.post("/cities", authenticateAdmin, handleAddCity);

// Theatres & Screens
router.post("/theatres", authenticateAdmin, handleAddTheatre);
router.put("/theatres/:id", authenticateAdmin, handleUpdateTheatre);
router.post("/theatres/:theatreId/screens", authenticateAdmin, handleAddScreen);
router.delete("/theatres/:id", authenticateAdmin, handleDeleteTheatre);

// Movies & Events
router.post("/movies", authenticateAdmin, handleAddMovie);
router.put("/movies/:id", authenticateAdmin, handleUpdateMovie);
router.delete("/movies/:id", authenticateAdmin, handleDeleteMovie);
router.post("/events", authenticateAdmin, handleAddEvent);
router.put("/events/:id", authenticateAdmin, handleUpdateEvent);
router.delete("/events/:id", authenticateAdmin, handleDeleteEvent);

export default router;
