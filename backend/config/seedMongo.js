import mongoose from "mongoose";
import dotenv from "dotenv";
import { MOVIES, THEATRES, EVENTS } from "../../src/data/seedData.js";
import Movie from "../models/Movie.js";
import Theatre from "../models/Theatre.js";
import Event from "../models/Event.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected for Seeding");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    console.log("Clearing existing data...");
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Event.deleteMany({});
    
    console.log("Inserting Movies...");
    await Movie.insertMany(MOVIES);
    
    console.log("Inserting Theatres...");
    await Theatre.insertMany(THEATRES);
    
    console.log("Inserting Events...");
    await Event.insertMany(EVENTS);
    
    console.log("Data Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
