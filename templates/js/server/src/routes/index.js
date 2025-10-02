import { Router } from "express";
import users from "./users.js";

const router = Router();

// API health check
router.get("/", (req, res) => {
  res.json({
    message: "🚀 MERN API is running successfully!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/users",
      health: "/health",
    },
  });
});

// Route modules
router.use("/users", users);

export default router;
