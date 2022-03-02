import { Socket } from "socket.io";
import { IPlayerData } from "./IPlayerData";

export interface IHandleJoinRoom extends IPlayerData {
  room: string;
}
