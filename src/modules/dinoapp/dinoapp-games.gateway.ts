import { Logger } from "@nestjs/common";

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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

  ///

  NotOk(client: IPlayerData) {
    return this.srv.to(client.room).emit("NotOk", client);
  }

  Ok(client: IPlayerData) {
    return this.srv.to(client.room).emit("Ok", client);
  }

  PickRoomData(client: IPlayerData) {
    const pick = RoomData.pick(client.room);

    return this.srv.to(client.room).emit("PickRoomData", pick);
  }

  PlayerClientId(client: Socket, data: IPlayerData) {
    return {
      ...data,
      clientId: client.id,
    };
  }

  @SubscribeMessage("ROOM_CREATE")
  CreateRoom(client: Socket, data: IPlayerData) {
    try {
      client.join(data.room);

      RoomData.handleRoomCreate(this.PlayerClientId(client, data));

      RoomData.addCharacter(this.PlayerClientId(client, data));

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }

  @SubscribeMessage("ROOM_JOIN")
  JoinRoom(client: Socket, data: IPlayerData) {
    try {
      client.join(data.room);

      RoomData.addCharacter(this.PlayerClientId(client, data));

      this.Ok(data);

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }

  @SubscribeMessage("CHARACTER_DATA_UPDATE")
  CharacterDataUpdate(client: Socket, data: IPlayerData) {
    try {
      RoomData.handleUpdateClientData(this.PlayerClientId(client, data));

      this.Ok(data);

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }
}
