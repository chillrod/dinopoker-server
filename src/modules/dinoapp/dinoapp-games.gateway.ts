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

import { IHandleJoinRoom } from "./model/IHandleConnection";

import { IPlayerData } from "./model/IPlayerData";

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
    if (!this.currentPlayers[data.room]) {
      this.srv?.emit("msgCurrentPlayerData", "Error");

      return {
        event: "alertToClient",
        data: "Room does not exist",
      };
    }

    // TODO - Apply middleware
    data.voteStatus = "THINKING";

    this.currentPlayers[data.room].push(data);

    return { event: "msgCurrentPlayerData", data: "Joined Room" };
  }

  @SubscribeMessage("getCurrentPlayers") sendPlayerDataToRoom(
    client: Socket,
    room: string
  ): WsResponse<IPlayerData> {
    this.srv.emit("msgPlayerData", this.currentPlayers[room]);

    return { event: "msgPlayerData", data: this.currentPlayers[room] };
  }

  @SubscribeMessage("changeVote") changeVote(
    client: Socket,
    data: IPlayerData
  ): WsResponse<IPlayerData> {
    const currentPlayer = this.currentPlayers[data.room].find(
      (items) => items.id === data.id
    );

    currentPlayer.vote = data.vote;
    currentPlayer.voteStatus = "SECRET";

    this.srv?.emit("msgPlayerData", this.currentPlayers[data.room]);

    return { event: "msgPlayerData", data: this.currentPlayers[data.room] };
  }

  @SubscribeMessage("voteStatus")
  voteStatus(client: Socket, data: IPlayerData): WsResponse<IPlayerData> {
    const currentPlayer = this.currentPlayers[data.room].find(
      (items) => items.id === data.id
    );

    currentPlayer.voteStatus = data.voteStatus;

    this.srv?.emit("msgPlayerData", this.currentPlayers[data.room]);

    return { event: "msgPlayerData", data: this.currentPlayers[data.room] };
  }

  @SubscribeMessage("revealVotes")
  revealVotes(client: Socket, data: IPlayerData): WsResponse<IPlayerData> {
    const currentPlayers = this.currentPlayers[data.room];

    for (const currentPlayers of this.currentPlayers[data.room]) {
      currentPlayers.voteStatus = "REVEALED";
    }

    this.srv?.emit("msgPlayerData", this.currentPlayers[data.room]);

    return { event: "msgPlayerData", data: this.currentPlayers[data.room] };
  }

  @SubscribeMessage("resetVotes")
  resetVotes(client: Socket, data: IPlayerData): WsResponse<IPlayerData> {
    const currentPlayers = this.currentPlayers[data.room];

    for (const currentPlayers of this.currentPlayers[data.room]) {
      currentPlayers.vote = null;
      currentPlayers.voteStatus = "THINKING";
    }

    this.srv?.emit("msgPlayerData", this.currentPlayers[data.room]);

    return { event: "msgPlayerData", data: this.currentPlayers[data.room] };
  }

  @SubscribeMessage("resetPlayers")
  resetPlayers(client: Socket, data: IPlayerData): WsResponse<IPlayerData> {
    this.currentPlayers[data.room] = [];

    this.srv?.emit("msgPlayerData", this.currentPlayers[data.room]);

    return { event: "msgPlayerData", data: this.currentPlayers[data.room] };
  }
}
