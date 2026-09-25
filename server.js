import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const currentDir = typeof import.meta?.url === "string"
  ? path.dirname(fileURLToPath(import.meta.url))
  : (typeof __dirname !== "undefined" ? __dirname : process.cwd());

import authRoutes from "./backend/routes/authRoutes.js";
import movieRoutes from "./backend/routes/movieRoutes.js";
import bookingRoutes from "./backend/routes/bookingRoutes.js";
import adminRoutes from "./backend/routes/adminRoutes.js";
import aiRoutes from "./backend/routes/aiRoutes.js";
import paymentRoutes from "./backend/routes/paymentRoutes.js";

dotenv.config();

import { connectDB } from "./backend/config/mongoDb.js";
if (process.env.MONGO_URI) {
  connectDB();
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CineFy Engine",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", movieRoutes);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Notice: Vite dev server middleware not loaded, continuing static/API serving:", e?.message);
    }
  } else {
    const candidatePaths = [
      path.join(process.cwd(), "dist"),
      currentDir,
      path.join(currentDir, "dist"),
      path.join(currentDir, "..", "dist")
    ];
    const distPath = candidatePaths.find((p) => fs.existsSync(path.join(p, "index.html"))) || path.join(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("App artifact not found");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎬 CineFy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
