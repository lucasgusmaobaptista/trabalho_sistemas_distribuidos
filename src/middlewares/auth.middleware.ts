import { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";

const jwks = createRemoteJWKSet(
  new URL(env.keycloakJwksUrl)
);

export type UserRole = "administrador" | "cliente";

export type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    name?: string;
    email?: string;
    providerId?: string;
    roles: UserRole[];
  };
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

    const realmAccess = payload.realm_access as { roles?: unknown } | undefined;
    const rawRoles = Array.isArray(realmAccess?.roles) ? realmAccess.roles : [];
    const roles = rawRoles.filter(
      (role): role is UserRole =>
        role === "administrador" || role === "cliente"
    );

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
        typeof payload.providerId === "string" ? payload.providerId : undefined,
      roles
    };
    next();
  } catch {
    response.status(401).json({
      message: "Erro de autenticação: token inválido ou expirado"
    });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
  ) => {
    if (!request.user) {
      response.status(401).json({
        message: "Erro de autenticação: usuário não autenticado"
      });
      return;
    }

    const hasPermission = request.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      response.status(403).json({
        message: "Acesso negado: perfil sem permissão para esta operação",
        requiredRoles: allowedRoles,
        userRoles: request.user.roles
      });
      return;
    }

    next();
  };
};