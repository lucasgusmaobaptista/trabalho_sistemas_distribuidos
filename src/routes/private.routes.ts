import { Router } from "express";
import { privateEndpoint } from "../controllers/private.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const privateRouter = Router();
privateRouter.get("/", authenticate, privateEndpoint);
