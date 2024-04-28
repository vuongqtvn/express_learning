import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name must be required"],
    },
    username: {
      type: String,
      required: [true, "User name must be required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email must be required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password must be required"],
      minLength: [6, "Password must be at least 6 characters"],
      trim: true,
    },
    gender: {
      type: String,
      default: "male",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.hash(user.password, 12, function (error, hash) {
    if (error) {
      return next(error);
    } else {
      user.password = hash;
      next();
    }
  });
});

export const User = mongoose.model<IUser>("User", userSchema);
