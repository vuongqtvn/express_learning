import express from "express";
import authRoute from "./auth_route";
import userRoute from "./user_route";

const ApiRoutes = () => {
  const router = express.Router();
  authRoute(router);
  userRoute(router);

  return router;
};

export default ApiRoutes;
