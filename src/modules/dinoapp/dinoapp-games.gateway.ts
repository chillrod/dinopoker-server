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

import { IPlayerData } from "./model/IPlayerData";

import RoomData from "./data/room-data";

@WebSocketGateway({
  namespace: "/dinopoker-app",
  cors: true,
})
export class DinoappGamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger("DinoappGamesGateway");

  @WebSocketServer()
  srv: Server;

  afterInit(server: Server) {
    this.logger.log("Init", server);
  }

  handleConnection(client: Socket) {
    this.logger.log("Client connected: " + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log("Client disconnected: " + client.id);

    RoomData.removeCharacter({ clientId: client.id });
  }

  @SubscribeMessage("handleCreateRoom")
  handleCreateRoom(client: Socket, data: IPlayerData) {
    this.logger.log("Client created a room: " + client.id);

    const clientDataWithClientId = {
      ...data,
      clientId: client.id,
    };

    client.join(data.room);

    RoomData.handleRoomCreate(clientDataWithClientId);

    RoomData.addCharacter(clientDataWithClientId);
  }
}
