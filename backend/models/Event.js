import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  date: { type: String },
  time: { type: String },
  venue: { type: String },
  city: { type: String },
  price: { type: Number },
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
