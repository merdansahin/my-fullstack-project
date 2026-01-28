import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import pino from "pino-http";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactsRouter from "./routes/contact.js";
import authRoutes from "./routes/authRoutes.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import User from "./db/models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(pino());
app.use(cookieParser());

app.use(helmet());
app.use(compression());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/contacts", contactsRouter);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

// Logs
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }),
);

// Static frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log("Register request:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password, // Not: Şifre hash'lenmiyor!
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// MongoDB connection

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-app")
  .then(() => console.log("Mongo connection successfully established!"))
  .catch((err) => console.error("Mongo connection error:", err));

console.log("ENV TEST:", process.env.MONGODB_URI);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
