import { IPlayerData } from "./IPlayerData";

export interface IRoomData {
  roomVoteStatus: string;
  voteSystem?: number[];
  room: string;
  players: IPlayerData[];
}

export enum ROOM_STATUS {
  WAITING = "WAITING",
  VOTING = "VOTING",
  ENDED = "ENDED",
}
