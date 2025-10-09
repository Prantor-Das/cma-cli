import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import connectDB from "./config/connectDB.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
app.disable("x-powered-by"); // hides the "X-Powered-By: Express" header for security

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running !",
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      if (process.env.MONGODB_URI) {
        await connectDB();
        console.log("✅ Database connected successfully");
      } else {
        console.log("⚠️ No MongoDB URI provided, running without database");
      }

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
        console.log(`📊 Health check at http://localhost:${PORT}/health`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error.message);
      process.exit(1);
    }
  })();
}

export default app;
