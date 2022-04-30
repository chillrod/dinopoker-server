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
import RoomChatData from "./data/room-chat-data";

import { IChatMessage } from "./model/IChatMessage";

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

  NotOk(
    client: IPlayerData | IChatMessage
  ): WsResponse<IPlayerData | IChatMessage> {
    return { event: "NotOk", data: client };
  }

  Ok(client: IPlayerData | IChatMessage) {
    return this.srv.to(client.room).emit("Ok", client);
  }

  PickRoomData(client: Pick<IPlayerData, "room">) {
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

  @SubscribeMessage("ROOM_SET_VOTING_STATUS")
  RoomVotingStatus(client: Socket, data: IPlayerData) {
    try {
      RoomData.handleVotingStatus(this.PlayerClientId(client, data));

      this.Ok(data);

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }

  @SubscribeMessage("ROOM_SET_ENDED_STATUS")
  RoomEndedStatus(client: Socket, data: IPlayerData) {
    try {
      RoomData.handleEndedStatus(this.PlayerClientId(client, data));

      this.Ok(data);

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }

  @SubscribeMessage("ROOM_SET_RESTART")
  RoomRestartStatus(client: Socket, data: IPlayerData) {
    try {
      RoomData.handleRestartStatus(this.PlayerClientId(client, data));

      this.Ok(data);

      this.PickRoomData(data);
    } catch (err) {
      this.NotOk(data);

      return err.message;
    }
  }

  @SubscribeMessage("ROOM_CHAT_MESSAGE")
  RoomChatMessage(client: Socket, message: IChatMessage) {
    try {
      RoomChatData.handleAddChatMessage(message);

      this.Ok(message);

      this.PickRoomData(message);
    } catch (err) {
      this.NotOk(message);

      return err.message;
    }
  }
}
