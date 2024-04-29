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
      const { username, email, password } = req.body;

      if (!username) {
        throw new AppError(
          {
            username: "Username is required",
          },
          400
        );
      }

      if (!email) {
        throw new AppError(
          {
            email: "Email is required",
          },
          400
        );
      }

      if (!password) {
        throw new AppError(
          {
            password: "Password is required",
          },
          400
        );
      }

      const isExist = await User.findOne({ email: req.body.email });
      if (isExist) {
        throw new AppError(
          {
            email: "Email is exist",
          },
          400
        );
      }

      const user = await User.create(req.body);
      const accessToken = createAccessToken({ _id: user._id });
      const refreshToken = createRefreshToken({ _id: user._id });

      user.password = "";
      res.status(200).json({
        user,
        refreshToken,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new AppError(
          {
            email: "Email or password is not correct",
            password: "Email or password is not correct",
          },
          400
        );
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        throw new AppError(
          {
            email: "Email or password is not correct",
            password: "Email or password is not correct",
          },
          400
        );
      }

      const accessToken = createAccessToken({ _id: user._id });
      const refreshToken = createRefreshToken({ _id: user._id });

      user.password = "";

      res.status(200).json({
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError("refresh token does not exits", 400);
      }

      const payloadToken = jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET
      ) as ITokenPayload;

      const user = await User.findById(payloadToken._id).select("-password");

      if (!user) {
        throw new AppError("User does not exist.", 404);
      }

      const accessToken = createAccessToken({ _id: user._id });

      res.status(200).json({
        accessToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  },
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.header("authorization");

      if (!Authorization) {
        throw new AppError("Unauthorized", 401);
      }

      const token = Authorization.replace("Bearer ", "");

      const payloadToken = jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET
      ) as ITokenPayload;

      const user = await User.findById(payloadToken._id).select("-password");

      if (!user) {
        throw new AppError("Unauthorized", 401);
      }

      res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  },
};
