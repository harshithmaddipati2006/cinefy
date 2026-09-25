import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  poster: { type: String },
  banner: { type: String },
  rating: { type: Number, default: 0 },
  votes: { type: String, default: "0" },
  certification: { type: String },
  language: { type: String },
  languages: { type: [String], default: [] },
  genre: { type: [String], default: [] },
  duration: { type: String },
  releaseDate: { type: String },
  status: { type: String },
  trailerUrl: { type: String },
  cast: [
    {
      name: { type: String },
      role: { type: String },
      image: { type: String }
    }
  ],
  crew: [
    {
      name: { type: String },
      role: { type: String },
      image: { type: String }
    }
  ],
  cities: { type: [String], default: [] },
  formats: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.models.Movie || mongoose.model("Movie", movieSchema);
