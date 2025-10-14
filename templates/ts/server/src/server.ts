// Core dependencies for Express server
import express, { type Express } from "express";
import cors from "cors";
import type { CorsOptions } from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // Security headers
import compression from "compression"; // Response compression
import rateLimit from "express-rate-limit"; // Rate limiting
import morgan from "morgan"; // HTTP request logger
import cookieParser from "cookie-parser"; // Parse cookies

// Application modules
import connectDB from "./config/connectDB.js";
import validateEnv from "./config/validateEnv.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Load environment variables and validate them
dotenv.config();
validateEnv();

const app: Express = express();
app.disable("x-powered-by"); // Remove Express signature for security

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security and performance middleware
app.use(helmet()); // Set security headers
app.use(compression()); // Compress responses
app.use(express.json({ limit: "1mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// CORS configuration - allow specific origins
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allow cookies,
};
app.use(cors(corsOptions));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS as string) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS as string) || 100, // Max requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// HTTP request logging
if (NODE_ENV === "development") {
  app.use(morgan("dev")); // Concise output for development
} else {
  app.use(morgan("combined")); // Standard Apache combined log format
}

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Server is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// API routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

async function startServer(): Promise<void> {
  try {
    // Connect to database if MongoDB URI is provided
    if (process.env.MONGODB_URI) {
      await connectDB();
      console.log("✅ Database connected successfully");
    } else {
      console.log("⚠️  No MongoDB URI provided, running without database");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(
        `📊 Health check available at http://localhost:${PORT}/health`,
      );
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Try another port.`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
