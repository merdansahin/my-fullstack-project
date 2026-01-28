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

import roomRoutes from "./routes/rooms.js";
import userRoutes from "./routes/users.js";
import bookingRoutes from "./routes/bookings.js";
import contactsRouter from "./routes/contact.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(pino());
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/contacts", contactsRouter);

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

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connection successfully established!"))
  .catch((err) => console.error("Mongo connection error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
