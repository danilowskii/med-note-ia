import type { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Erro capturado:", error);
}
