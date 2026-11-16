import { Request, Response } from "express";

export const publicEndpoint = (_request: Request, response: Response) => {
  response.json({
    message: "Teste de endpoint público: acesso permitido!"
  });
};
