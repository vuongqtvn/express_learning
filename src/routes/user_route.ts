import { Router } from "express";
import { userController } from "../controllers";
import { verifyToken } from "../middleware";

const userRoute = (route: Router) => {
  route
    .route("/users")
    .get(verifyToken, userController.getUsers)
   
};

export default userRoute;
