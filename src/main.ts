import { Server } from "./server";

const main = async () => {
  const server = new Server();

  try {
    await server.setup();
    await server.start();
  } catch (error: any) {
    await server.stop();
  }
};

main();
