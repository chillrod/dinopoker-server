import { OnEvent } from "@nestjs/event-emitter";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: "/players",
  cors: true,
})
export class PlayersGateway {
  @WebSocketServer()
  srv: Server;

  @OnEvent("handleDisconnect") handleDisconnectInfo(payload: any) {
    console.log(payload);
  }

  @SubscribeMessage("playerJoinRoom")
  handleMessage(client: Socket, payload: any): string {
    return "Hello world!";
  }
}
