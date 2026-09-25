import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  movieId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
