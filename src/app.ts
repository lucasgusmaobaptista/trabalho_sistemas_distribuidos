import express, { ErrorRequestHandler } from "express";
import { authRouter } from "./routes/auth.routes.js";
import { privateRouter } from "./routes/private.routes.js";
import { publicRouter } from "./routes/public.routes.js";

export const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/private", privateRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Erro interno: não foi possível processar a solicitação"
  });
};

app.use(errorHandler);
