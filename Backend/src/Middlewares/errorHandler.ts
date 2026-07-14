import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../Utils/apiError.js";
import { config } from "../Config/config.js";


export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.status,      
      message: err.message,
      errors: err.errors,       
      ...(config.nodeEnv === "development" && {
        stack: err.stack,
      }),
    });
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  
  return res.status(500).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" && {
      stack: err instanceof Error ? err.stack : String(err),
    }),
  });
};
