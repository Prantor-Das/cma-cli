import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import routes from "./routes/index.js";

dotenv.config({
  path: ".env.example",
});

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      console.log("✅ MongoDB connected successfully.");
    } else {
      console.warn("⚠️ No MongoDB URI found. Starting server without DB.");
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
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
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;