import { Router } from "express";
import {
  adminUploadEndpoint,
  clientConsultaEndpoint,
  privateEndpoint
} from "../controllers/private.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

export const privateRouter: Router = Router();

privateRouter.get("/", authenticate, privateEndpoint);

privateRouter.get(
  "/consulta",
  authenticate,
  authorize("cliente", "administrador"),
  clientConsultaEndpoint
);

privateRouter.post(
  "/admin/fotos",
  authenticate,
  authorize("administrador"),
  adminUploadEndpoint
);

export default privateRouter;