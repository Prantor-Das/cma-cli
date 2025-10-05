import { Router, type Router as ExpressRouter } from "express";
import users from "./users.js";

const router: ExpressRouter = Router();

/*
Example:-

import test from "./test.js";
router.use("/test", test);
*/

// Route modules
router.use("/users", users);

export default router;
