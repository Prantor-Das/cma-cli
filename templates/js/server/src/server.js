import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.MONGO_URI) {
  connectDB();
}

import routes from "./routes/index.js";

app.use("/api", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));