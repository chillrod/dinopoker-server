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
          players: [],
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

  checkIfUserExists(client: IPlayerData) {
    return this.room[client.room].players.some(
      (player) => player.clientId === client.clientId
    );
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

  removeCharacter({ clientId }: Pick<IPlayerData, "clientId">) {
    const roomKeys = Object.keys(this.room);

    roomKeys.forEach((room) => {
      const checkIfPlayerExists = this.room[room].players.some(
        (player) => player.clientId === clientId
      );

      if (checkIfPlayerExists) {
        this.room[room].players = this.room[room].players.filter(
          (player) => player.clientId !== clientId
        );

        return;
      }
    });
  }

  addCharacter(client: IPlayerData) {
    try {
      if (
        this.checkIfRoomExists(client.room) &&
        !this.checkIfUserExists(client)
      ) {
        const room = this.room[client.room];

        room.players.push(client);
      }

      throw new Error("Attempting to add a character to non existing room");
    } catch (err) {
      return err.message;
    }
  }

  handleVotingStatus(client: IPlayerData) {
    try {
      if (this.checkIfRoomExists(client.room)) {
        const room = this.room[client.room];

        room.roomVoteStatus = ROOM_STATUS.VOTING;
      }

      throw new Error("Attempting to vote on non existing room");
    } catch (err) {
      return err.message;
    }
  }

  handleEndedStatus(client: IPlayerData) {
    try {
      if (this.checkIfRoomExists(client.room)) {
        const room = this.room[client.room];

        room.roomVoteStatus = ROOM_STATUS.ENDED;
      }

      throw new Error("Attempting to end a non existing room");
    } catch (err) {
      return err.message;
    }
  }

  handleRestartStatus(client: IPlayerData) {
    try {
      if (this.checkIfRoomExists(client.room)) {
        const room = this.room[client.room];

        room.roomVoteStatus = ROOM_STATUS.WAITING;
      }

      throw new Error("Attempting to restart a non existing room");
    } catch (err) {
      return err.message;
    }
  }

  handleUpdateClientData(client: IPlayerData) {
    try {
      if (this.checkIfRoomExists(client.room)) {
        const room = this.room[client.room];

        room.players = room.players.map((player) => {
          if (player.clientId === client.clientId) {
            return client;
          }

          return player;
        });
      }

      throw new Error("Attempting to update a non existing room");
    } catch (err) {
      return err.message;
    }
  }
}

export default new RoomData();
