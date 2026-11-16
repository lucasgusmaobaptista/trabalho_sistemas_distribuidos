import { Request, Response } from "express";
import {
  createAuthorizationUrl,
  exchangeCodeForTokens
} from "../services/oauth.service.js";

export const login = (_request: Request, response: Response) => {
  response.redirect(createAuthorizationUrl());
};

export const callback = async (request: Request, response: Response) => {
  const { code, state, error } = request.query;
  if (error || typeof code !== "string" || typeof state !== "string") {
    response.status(400).json({ message: "Token inválido" });
    return;
  }
  const tokens = await exchangeCodeForTokens(code, state);
  response.json({
    message: "Autenticação realizada com sucesso! Token válido por 1 minuto",
    ...tokens,
    tokenType: "Bearer"
  });
};
