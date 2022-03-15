import { Player } from "src/modules/players/dto/IPlayer";

interface IRoomData {
  [room: string]: Player[];
}

export class RoomData {
  room: IRoomData;

  constructor() {
    this.room = {};
  }

  roomExistsCheck(room: string) {
    return this.room.hasOwnProperty(room);
  }

  create(room: string) {
    try {
      if (!this.roomExistsCheck(room)) {
        return (this.room[room] = []);
      }

      throw new Error("Room already exists");
    } catch (err) {
      return err.message;
    }
  }

  assignPlayerDataToRoom(room: string, playerData: Player) {
    try {
      if (this.roomExistsCheck(room)) {
        return this.room[room].push(playerData);
      }

      throw new Error("Cant subscribe your data to current room stream");
    } catch (err) {
      return err.message;
    }
  }

  pick(room: string) {
    try {
      if (this.roomExistsCheck(room)) {
        return this.room[room];
      }

      throw new Error("You attempted to return a empty room data");
    } catch (err) {
      return err.message;
    }
  }
}
