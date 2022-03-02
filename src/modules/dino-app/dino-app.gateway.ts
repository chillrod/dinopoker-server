import { Logger } from "@nestjs/common";

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

import { v4 as uuidv4 } from "uuid";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class DinoAppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // @SubscribeMessage("dino-app")
  // handleMessage(client: Socket, message: string) {
  //   const currentMessage = {
  //     id: uuidv4(),
  //     body: message,
  //     client: client.id,
  //   };

  //   this.messages.push(currentMessage);

  //   this.server.emit("dino-app", currentMessage);
  // }

  // afterInit(client: Socket) {}

  // handleDisconnect(client: Socket) {}

  handleConnection(client: Socket) {
    console.log("connected", client.id);
  }
}
