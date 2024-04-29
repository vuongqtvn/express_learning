import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../configs";
import { User } from "../models";
import { AppError, ITokenPayload } from "../interface";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization = req.header("authorization");

    if (!Authorization) {
      const error = new AppError("Unauthorized", 401);
      return next(error);
    }

    const token = Authorization.replace("Bearer ", "");

    const payloadToken = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET
    ) as ITokenPayload;

    const user = await User.findById(payloadToken._id).select("_id");

    if (!user) {
      const error = new AppError("Unauthorized", 401);
      return next(error);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
