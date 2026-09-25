import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  id: String,
  row: String,
  number: Number,
  category: String,
  price: Number
}, { _id: false });

const foodItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: Number,
  price: Number
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookingRef: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userEmail: { type: String },
  userName: { type: String },
  userPhone: { type: String },
  movieId: { type: String },
  movieTitle: { type: String },
  poster: { type: String },
  theatreId: { type: String },
  theatreName: { type: String },
  screenName: { type: String },
  showId: { type: String },
  showDate: { type: String },
  showTime: { type: String },
  seats: [seatSchema],
  foodItems: [foodItemSchema],
  ticketPrice: { type: Number, default: 0 },
  foodPrice: { type: Number, default: 0 },
  convenienceFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  appliedCoupon: { type: String },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: "CONFIRMED" },
  qrCode: { type: String },
  status: { type: String, default: "ACTIVE" },
  bookingType: { type: String, default: "MOVIE" },
  cancelledAt: { type: String }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
