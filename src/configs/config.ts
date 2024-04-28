import dotenv from "dotenv";
import { IConfig } from "../types";

dotenv.config();

export const config: IConfig = {
  PORT: Number(process.env.PORT) || 5000,
  PREFIX: process.env.PREFIX || "",
  DB_URI: process.env.DB_URI || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
};
