import { randomBytes } from "node:crypto";
import { env } from "../config/env.js";

const states = new Map<string, number>();

export const createAuthorizationUrl = (): string => {
  const state = randomBytes(24).toString("hex");
  states.set(state, Date.now() + 10 * 60 * 1000);
  const url = new URL(`${env.keycloakIssuerUrl}/protocol/openid-connect/auth`);
  url.searchParams.set("client_id", env.keycloakClientId);
  url.searchParams.set("redirect_uri", env.keycloakCallbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("state", state);
  return url.toString();
};

const consumeState = (state: string): boolean => {
  const expiresAt = states.get(state);
  states.delete(state);
  return expiresAt !== undefined && expiresAt > Date.now();
};

export const exchangeCodeForTokens = async (
  code: string,
  state: string
): Promise<{ accessToken: string; refreshToken?: string }> => {
  if (!consumeState(state)) {
    throw new Error("Invalid or expired OAuth state");
  }

  const tokenResponse = await fetch(
    `${env.keycloakInternalUrl}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: env.keycloakClientId,
        client_secret: env.keycloakClientSecret,
        redirect_uri: env.keycloakCallbackUrl
      })
    }
  );
  if (!tokenResponse.ok) {
    throw new Error("OAuth token exchange failed");
  }
  const token = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
  };
  if (!token.access_token) {
    throw new Error("Keycloak returned no access token");
  }
  return { accessToken: token.access_token, refreshToken: token.refresh_token };
};
