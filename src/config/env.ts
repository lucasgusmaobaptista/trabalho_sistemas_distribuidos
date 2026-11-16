import "dotenv/config";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3000),
  keycloakIssuerUrl: required("KEYCLOAK_ISSUER_URL"),
  keycloakInternalUrl: required("KEYCLOAK_INTERNAL_URL"),
  keycloakJwksUrl: required("KEYCLOAK_JWKS_URL"),
  keycloakClientId: required("KEYCLOAK_CLIENT_ID"),
  keycloakClientSecret: required("KEYCLOAK_CLIENT_SECRET"),
  keycloakCallbackUrl: required("KEYCLOAK_CALLBACK_URL")
};
