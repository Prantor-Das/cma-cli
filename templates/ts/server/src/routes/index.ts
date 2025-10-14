import { Router, type Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

// Main API routes - all routes are prefixed with /api

/*
To add new route modules:

import newModule from "./newModuleRoutes.js";
router.use("/new-module", newModule);
*/

export default router;
