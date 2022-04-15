import { IPlayerData } from "../model/IPlayerData";

interface IRoomData {
  roomVoteStatus: string;
  room: string;
  players: IPlayerData[];
}

enum ROOM_STATUS {
  WAITING = "WAITING",
  VOTING = "VOTING",
  ENDED = "ENDED",
}

class RoomData {
  room: IRoomData[];

  constructor() {
    this.room = [];
  }

  handleRoomCreate(playerData: IPlayerData) {
    try {
      if (!this.checkIfRoomExists(playerData.room)) {
        const mountRoom: IRoomData = {
          roomVoteStatus: ROOM_STATUS.WAITING,
          room: playerData.room,
          players: [playerData],
        };

        return (this.room[playerData.room] = mountRoom);
      }

      throw new Error("You attempted to create a room that already exists");
    } catch (err) {
      return err.message;
    }
  }

  checkIfRoomExists(room: string) {
    return this.room.hasOwnProperty(room);
  }

  pick(room: string) {
    try {
      if (this.checkIfRoomExists(room)) {
        return this.room[room];
      }

      throw new Error("You attempted to pick a room that does not exist");
    } catch (err) {
      return err.message;
    }
  }

  clearRoom(room: string) {
    try {
      if (this.checkIfRoomExists(room)) {
        delete this.room[room];
      }

      throw new Error("You attempted to clear a room that does not exist");
    } catch (err) {
      return err.message;
    }
  }

  removeCharacter(client: IPlayerData) {
    try {
      if (this.checkIfRoomExists(client.room)) {
        const room = this.room[client.room];

        room.players = room.players.filter(
          (players) => players.clientId !== client.clientId
        );
      }

      throw new Error(
        "Attempting to remove a character from non existing room"
      );
    } catch (err) {
      return err.message;
    }
  }
}

export default new RoomData();
