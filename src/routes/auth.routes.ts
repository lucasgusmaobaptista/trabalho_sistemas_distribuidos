import { Router } from "express";
import { callback, login } from "../controllers/auth.controller.js";

export const authRouter = Router();
authRouter.get("/login", login);
authRouter.get("/callback", callback);
