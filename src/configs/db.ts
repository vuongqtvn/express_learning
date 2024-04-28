import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URI, {});
    console.log("[🚀] DB connection successfully.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("[🚀] DB disconnect successfully.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
