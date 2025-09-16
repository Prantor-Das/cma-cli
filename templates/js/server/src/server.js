import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/connectDB.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Failed to connect to the database. Server not started.");
    }
  } else {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
}

startServer();