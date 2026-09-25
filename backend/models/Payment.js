import mongoose from "mongoose";

export const PAYMENT_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  CAPTURED: "CAPTURED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED"
};

export const BOOKING_PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

export const BOOKING_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED"
};

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userEmail: { type: String },
  bookingId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  amountInPaise: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, default: PAYMENT_STATUS.CREATED },
  method: { type: String, default: "RAZORPAY" },
  paymentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  notes: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
