import { Router, Request, Response } from "express";
import users from "./users.js";
import { ApiResponse } from "../types/index.js";

const router = Router();

// API health check
router.get("/", (_req: Request, res: Response) => {
  const response: ApiResponse = {
    message: "🚀 MERN API is running successfully!",
    data: {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        users: "/api/users",
        health: "/health",
      },
    },
  };

  res.json(response);
});

// Route modules
router.use("/users", users);

export default router;
