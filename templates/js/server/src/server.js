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
app.disable("x-powered-by");

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running !",
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// Routes
app.use("/api", routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server only if not running in test
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

// Export app for testing
export default app;
