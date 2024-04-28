import { Router } from "express";
import { authController } from "../controllers";

const authRoute = (route: Router) => {
  route.route("/auth/register").post(authController.register);
  route.route("/auth/login").post(authController.login);
  route.route("/auth/me").get(authController.getMe);
  route.route("/auth/refresh_token").get(authController.refreshToken);
};

export default authRoute;
