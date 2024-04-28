import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import ApiRoutes from "../routes";
import { config } from "../configs";
import { errorHandler } from "../middleware";
import { AppError, ITokenPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      user: ITokenPayload
    }
  }
}


class HTTPServer {
  server: http.Server;
  constructor() {
    this.server = http.createServer();
  }

  setup = async () => {
    const app: Express = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(cors());
    app.use(compression());
    app.use(helmet());

    // Api Route
    app.use(config.PREFIX, ApiRoutes());

    // Unhandled Route
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      const error = new AppError("The route can not be found", 404);
      next(error);
    });

    app.use(errorHandler);
    this.server.addListener("request", app);
  };

  start = () => {
    if (!this.server.listening) {
      this.server.listen(config.PORT, () => {
        console.log(`[🚀🚀🚀🚀🚀] Server is running at port ${config.PORT}`);
      });
    }
  };

  stop = () => {
    if (this.server.listening) {
      this.server.close();
    }
  };
}

export default HTTPServer;
