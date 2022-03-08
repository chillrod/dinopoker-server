import { Logger } from "@nestjs/common";

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { INotifyResponse } from "./dto/INotifyResponset";

@WebSocketGateway({
  namespace: "/notify",
  cors: true,
})
export class NotifyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public logger: Logger = new Logger("NotifyGateway");

  @WebSocketServer()
  srv: Server;

  afterInit(server: Server) {
    this.logger.log("Server Started" + server);
  }

  handleConnection(client: Socket) {
    this.logger.log("Client connected: " + client.id);

    this.srv?.emit("handleConnection", {
      status: "Success",
      message: "Client connected",
      session: client?.id,
    });
  }

  @SubscribeMessage("notify")
  handleNotify(client: Socket, message: any): WsResponse<INotifyResponse> {
    this.srv?.emit("notify", {
      status: "Notify",
      message: message,
      session: client?.id,
    });

    return {
      event: "notify",
      data: {
        status: "Notify",
        message: message,
        session: client?.id,
      },
    };
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected: " + client.id);

    this.srv?.emit("handleDisconnect", {
      status: "Error",
      message: "Client disconnected",
      session: client?.id,
    });
  }
}
