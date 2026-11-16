import { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";

const jwks = createRemoteJWKSet(
  new URL(env.keycloakJwksUrl)
);

export type AuthenticatedRequest = Request & {
  user?: { sub?: string; name?: string; email?: string; providerId?: string };
};

export const authenticate = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  const header = request.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    response.status(401).json({
      message: "Erro de autenticação: token não informado"
    });
    return;
  }
  try {
    const token = header.slice(7).trim();
    if (!token) {
      response.status(401).json({
        message: "Erro de autenticação: token não informado"
      });
      return;
    }
    const { payload } = await jwtVerify(token, jwks, {
      issuer: env.keycloakIssuerUrl
    });
    request.user = {
      sub: payload.sub,
      name:
        typeof payload.name === "string"
          ? payload.name
          : typeof payload.preferred_username === "string"
            ? payload.preferred_username
            : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      providerId:
        typeof payload.providerId === "string" ? payload.providerId : undefined
    };
    next();
  } catch {
    response.status(401).json({
      message: "Erro de autenticação: token inválido ou expirado"
    });
  }
};
