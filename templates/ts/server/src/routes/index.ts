import { Router } from "express";
import users from "./users";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working!!!" });
});

router.use("/users", users);

export default router;
