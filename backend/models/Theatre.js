import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String }, // e.g., IMAX, 4DX, Standard
  capacity: { type: Number, default: 220 }
});

const theatreSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  rating: { type: Number, default: 4.5 },
  facilities: { type: [String], default: [] },
  screens: [screenSchema]
}, { timestamps: true });

export default mongoose.models.Theatre || mongoose.model("Theatre", theatreSchema);
