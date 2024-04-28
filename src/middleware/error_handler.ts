import { NextFunction, Request, Response } from "express";
import { AppError } from "../types";

export const errorHandler = (
  error: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;

  // Mongoose Duplication
  if (error.code === 11000) {
    error.statusCode = 400;

    error.message = {};
    for (let key in error.keyValue) {
      error.message = {
        ...error.message,
        [key]: `${key} have to be unique`,
      };
    }
  }

  // Mongoose ObjectID: not found
  if (error.kind === "ObjectId") {
    error.statusCode = 404;
    error.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }

  // Mongoose Validation
  if (error.errors) {
    error.statusCode = 400;
    error.message = {};
    for (let key in error.errors) {
      error.message = {
        ...error.message,
        [key]: error.errors[key].properties.message,
      };
    }
  }

  res.status(error.statusCode).json({
    status: "failed",
    message: error.message,
  });

  next();
};
