# Serviços locais

Copie `.env.example` para `.env` e inicie os serviços:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

Use `docker compose ps` para conferir os estados e healthchecks. Para acompanhar logs: `docker compose logs -f <serviço>`.

- Nginx: http://localhost (página estática) e `/auth` (aplicação)
- Aplicação direta: http://localhost:3000
- Keycloak: http://localhost:8080 (console admin: `admin` / `admin`)
- InfluxDB e Data Explorer: http://localhost:8086
- PostgreSQL: porta `5432`; o banco `fotos` e seu usuário são criados na primeira inicialização do volume
- SeaweedFS: acessível somente pela rede interna do Compose; credenciais locais no `.env.example`

O realm `microservices` importa o client `auth-microservice` e os papéis `cliente` e `administrador`. O usuário inicial do realm é `admin` / `admin123`. A API oferece `GET /public`, `GET /private` (Bearer token), `GET /auth/login` e `GET /auth/callback`.

Verificações individuais:

```powershell
docker compose exec postgres pg_isready -U postgres -d keycloak
docker compose exec influxdb influx ping
docker compose logs --tail=50 keycloak app nginx seaweedfs
```

O script do banco `fotos` só roda quando o volume do PostgreSQL é criado pela primeira vez.
