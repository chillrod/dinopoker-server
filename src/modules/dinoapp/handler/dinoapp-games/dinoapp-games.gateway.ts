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
import { IHandleConnection } from "../../model/IHandleConnection";

import { IPlayerData } from "../../model/IPlayerData";

@WebSocketGateway({ namespace: "/dinoapp-games" })
export class DinoappGamesGateway implements OnGatewayInit, OnGatewayConnection {
  private logger: Logger = new Logger("DinoappGamesGateway");

  public currentPlayers: { if1Room: IPlayerData[]; if2Room: IPlayerData[] } = {
    if1Room: [],
    if2Room: [],
  };

  @WebSocketServer()
  srv: Server;

  afterInit(server: Server) {
    console.log("Gateway initialized");
  }

  handleConnection({ client, data }: IHandleConnection): WsResponse<string> {
    if (!this.currentPlayers[data.room]) {
      return {
        event: "msgToClient",
        data: "Room doest not exist",
      };
    }

    client?.join(data.room);

    this.currentPlayers[data.room].push(data.player);

    return { event: "msgToClient", data: "You have joined a room" };
  }

  @SubscribeMessage("msgToServer")
  sendPlayerData(data: IPlayerData): WsResponse<IPlayerData> {
    this.currentPlayers[data.room].push(data);

    return { event: "msgToClient", data };
  }
}
