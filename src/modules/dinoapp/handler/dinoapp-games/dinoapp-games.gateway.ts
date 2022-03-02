import { Logger } from "@nestjs/common";

import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

import { IHandleJoinRoom } from "../../model/IHandleConnection";

import { IPlayerData } from "../../model/IPlayerData";

@WebSocketGateway({
  namespace: "/dinoapp-games",
  cors: true,
})
export class DinoappGamesGateway implements OnGatewayInit, OnGatewayConnection {
  private logger: Logger = new Logger("DinoappGamesGateway");

  public currentPlayers: { if1Room: IPlayerData[]; if2Room: IPlayerData[] } = {
    if1Room: [],
    if2Room: [],
  };

  @WebSocketServer()
  srv: Server;

  afterInit(server: Server) {
    this.logger.log("Init", server);
  }

  handleConnection(client: Socket) {
    this.logger.log("Client connected: " + client.id);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    client?: Socket,
    data?: IHandleJoinRoom
  ): WsResponse<IHandleJoinRoom | string> {
    data.id = v4();

    if (!this.currentPlayers[data.room]) {
      return {
        event: "alertToClient",
        data: "Room does not exist",
      };
    }

    client?.join(data.room);

    this.currentPlayers[data.room].push(data);

    console.log(this.currentPlayers);

    return { event: "msgToClient", data };
  }

  @SubscribeMessage("msgToServer")
  sendPlayerData(data: IPlayerData) {
    this.srv?.to(data.room).emit("msgToClient", data);
  }
}
