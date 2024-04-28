import { Types } from "mongoose";

export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  gender: "male" | "female" | "both";
}

export interface ITokenPayload {
  _id: Types.ObjectId
}
