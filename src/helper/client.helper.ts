import { io } from "socket.io-client";
import { INestApplication } from "@nestjs/common";

export const getClientWebsocketForAppAndNamespace = (
  app: INestApplication,
  namespace: string
) => {
  const httpServer = app.getHttpServer();
  console.log("🚀 ~ file: client.helper.ts ~ line 9 ~ app", app);

  if (!httpServer.address()) {
    httpServer.listen(0);
  }

  return io(`http://localhost:${httpServer.address().port}/${namespace}`);
};
