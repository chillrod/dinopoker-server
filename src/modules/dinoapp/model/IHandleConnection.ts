import { Socket } from "socket.io";
import { IPlayerData } from "./IPlayerData";

export interface IHandleConnection {
  client?: Socket;
  data: {
    room: string;
    player: IPlayerData;
  };
}
