import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { config } from "../configs";
import { ITokenPayload, AppError } from "../interface";

const createAccessToken = (data: ITokenPayload) => {
  return jwt.sign(data, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (data: ITokenPayload) => {
  return jwt.sign(data, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.create(req.body);
      const accessToken = createAccessToken({ _id: user._id });
      const refreshToken = createRefreshToken({ _id: user._id });

      user.password = "";
      res.status(200).json({
        status: "success",
        data: {
          user,
          refreshToken,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const error = new AppError("Email is not correct", 400);
        return next(error);
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        const error = new AppError("Password is not correct", 400);
        return next(error);
      }

      const accessToken = createAccessToken({ _id: user._id });
      const refreshToken = createRefreshToken({ _id: user._id });

      user.password = "";

      res.status(200).json({
        status: "success",
        data: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        const error = new AppError("refresh token does not exits", 400);
        return next(error);
      }

      const payloadToken = jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET
      ) as ITokenPayload;

      const user = await User.findById(payloadToken._id).select("-password");

      if (!user) {
        const error = new AppError("User does not exist.", 404);
        return next(error);
      }

      const accessToken = createAccessToken({ _id: user._id });

      res.status(200).json({
        status: "success",
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getMe: async (req: Request, res: Response, next: NextFunction) => {
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

      const user = await User.findById(payloadToken._id).select("-password");

      if (!user) {
        const error = new AppError("User does not exist.", 404);
        return next(error);
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
