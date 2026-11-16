# Authentication Microservice

uma mini resumida da aplicação pra vcs 

## Endpoints

- `GET /public`: endpoint público para testes
- `GET /private`: endpoint privado para testes. exige `Authorization: Bearer <access_token>`.
- `GET /auth/login`: redireciona para a tela de login do keycloak
- `GET /auth/callback`: troca o código de autorização por tokens do keycloak


o realm `microservices` e o client `auth-microservice` são importados automaticamente. Quando forem testar pela primeira vez, usem:

```text
Usuário: admin
Senha: admin123
```

O realm está configurado com access token de 60 segundos. O `KEYCLOAK_CLIENT_SECRET` deve ser igual ao secret definido no client importado

O cadastro de novos usuários, a recuperação de senha e a opção de lembrar a sessão estão habilitados na tela do Keycloak. Acesse `http://localhost:3000/auth/login` e selecione a opção que quiserem testar

## OBS!
Antes de iniciar a aplicação, executem no terminal:

```bash
npm install
```
se não tiverem a imagem do postgres:
```bash
docker pull postgres:17 
```
se já tiverem:
```bash
docker compose up  -d --build
```

Serviços:

- Aplicação: `http://localhost:3000`
- Keycloak: `http://localhost:8080`
- Console administrativo: `http://localhost:8080`, usuário `admin`, senha `admin`

Abram `http://localhost:3000/auth/login`, façam login no Keycloak e copiem o `accessToken` retornado pelo callback para testarem o endpoint privado
