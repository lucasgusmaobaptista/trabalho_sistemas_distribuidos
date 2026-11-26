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
      providerId: request.user?.providerId,
      roles: request.user?.roles ?? []
    }
  });
};

export const clientConsultaEndpoint = (
  request: AuthenticatedRequest,
  response: Response
) => {
  response.json({
    message: "Acesso de consulta permitido (cliente ou administrador)",
    user: {
      id: request.user?.sub,
      name: request.user?.name,
      roles: request.user?.roles ?? []
    }
  });
};

export const adminUploadEndpoint = (
  request: AuthenticatedRequest,
  response: Response
) => {
  response.status(201).json({
    message: "Acesso de envio permitido (somente administrador)",
    user: {
      id: request.user?.sub,
      name: request.user?.name,
      roles: request.user?.roles ?? []
    }
  });
};