import express from "express";
import {
  handleGetPaymentConfig,
  handleCreateOrder,
  handleVerifyPayment,
  handleRazorpayWebhook,
  handleGetPaymentById,
  handleGetBookingPaymentStatus,
  handleAdminRefund,
  handleGetAllPayments,
  handlePhoneUpiPayment
} from "../paymentController.js";
import { authenticateToken, optionalAuth } from "../authController.js";

const router = express.Router();

// 1. Public Payment Config (Razorpay Key ID & Supported Methods)
router.get("/config", handleGetPaymentConfig);

// 2. Order Creation & Verification
router.post("/create-order", optionalAuth, handleCreateOrder);
router.post("/verify", optionalAuth, handleVerifyPayment);

// 3. Webhook from Razorpay
router.post("/webhook", handleRazorpayWebhook);

// 4. Fast Phone / UPI Pay Fallback
router.post("/phone-upi-pay", optionalAuth, handlePhoneUpiPayment);

// 5. Booking Specific Payment Status
router.get("/booking/:bookingId", optionalAuth, handleGetBookingPaymentStatus);

// 6. Admin Payment Management & Single Payment Status
router.get("/", authenticateToken, handleGetAllPayments);
router.get("/:paymentId", optionalAuth, handleGetPaymentById);
router.post("/:paymentId/refund", authenticateToken, handleAdminRefund);

export default router;
