import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactsRouter from "./routes/contact.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cookieParser(process.env.COOKIE_SECRET || "development_secret_key"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // May be necessary for the development environment
        styleSrc: ["'self'", "'unsafe-inline'"], // For style files
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // For Cloudinary images
        connectSrc: ["'self'", "http://localhost:5000"], // For API requests
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use(compression());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Logs
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }),
);

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactsRouter);

// Static frontend
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
