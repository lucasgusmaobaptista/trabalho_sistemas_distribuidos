import { Router } from "express";
import { publicEndpoint } from "../controllers/public.controller.js";

export const publicRouter = Router();
publicRouter.get("/", publicEndpoint);
