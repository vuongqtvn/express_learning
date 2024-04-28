import { NextFunction, Request, Response } from "express";
import { User } from "../models";

export const userController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({})

      res.status(200).json({
        status: "success",
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
