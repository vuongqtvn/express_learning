import { connectDB, disconnectDB } from "../configs";
import HTTPServer from "./http_server";

export class Server {
  httpServer: HTTPServer;
  constructor() {
    this.httpServer = new HTTPServer();
  }

  setup = async () => {
    await connectDB();
    await this.httpServer.setup();
  };

  start = async () => {
    this.httpServer.start();
  };

  stop = async () => {
    this.httpServer.stop();
    await disconnectDB();
  };
}
