import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const privateEndpoint = (
  request: AuthenticatedRequest,
  response: Response
) => {
  response.json({
    message: "Teste de endpoint privado: usuário autenticado! Validade do token: 1 minuto",
    user: {
      id: request.user?.sub,
      name: request.user?.name,
      email: request.user?.email,
      providerId: request.user?.providerId
    }
  });
};
