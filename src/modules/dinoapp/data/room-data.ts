import { IRoomData, ROOM_STATUS } from "../model/IRoomData";
import { IPlayerData } from "../model/IPlayerData";

export class RoomData {
  room: IRoomData[];

  constructor() {
    this.room = [];
  }

  handleRoomCreate(playerData: IPlayerData) {
    if (this.checkIfRoomExists(playerData.room)) {
      throw new Error("You attempted to create a room that already exists");
    }

    const mountRoom: IRoomData = {
      roomVoteStatus: ROOM_STATUS.WAITING,
      room: playerData.room,
      players: [],
      chat: [],
      voteSystem: [],
    };

    this.room[playerData.room] = mountRoom;
  }

  checkIfRoomExists(room: string) {
    return this.room.hasOwnProperty(room);
  }

  pick(room: string) {
    if (!this.checkIfRoomExists(room)) {
      throw new Error("You attempted to pick a room that does not exist");
    }

    return this.room[room];
  }

  clearRoom(room: string) {
    if (!this.checkIfRoomExists(room)) {
      throw new Error("You attempted to clear a room that does not exist");
    }

    return delete this.room[room];
  }

  checkIfRoomIsEmpty(room: string) {
    if (!this.room[room].players.length) return this.clearRoom(room);
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
      }

      this.checkIfRoomIsEmpty(room);
    });
  }

  addCharacter(client: IPlayerData) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to add a character to non existing room");
    }

    const room = this.room[client.room];

    return room.players.push(client);
  }

  handleVotingStatus(client: IPlayerData) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to vote on non existing room");
    }

    const room = this.room[client.room];

    return (room.roomVoteStatus = ROOM_STATUS.VOTING);
  }

  handleEndedStatus(client: IPlayerData) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to end a non existing room");
    }

    const room = this.room[client.room];

    room.roomVoteStatus = ROOM_STATUS.ENDED;
  }

  handleRestartStatus(client: IPlayerData) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to restart a non existing room");
    }

    const room = this.room[client.room];

    return (room.roomVoteStatus = ROOM_STATUS.WAITING);
  }

  handleUpdateClientData(client: IPlayerData) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to update a non existing room");
    }

    const room = this.room[client.room];

    room.players = room.players.map((player) => {
      if (player.clientId === client.clientId) {
        return client;
      }

      return player;
    });
  }

  handleUpdateVoteSystem(
    client: Pick<IPlayerData, "room">,
    { voteSystem }: Pick<IRoomData, "voteSystem">
  ) {
    if (!this.checkIfRoomExists(client.room)) {
      throw new Error("Attempting to update a non existing room");
    }

    const room = this.room[client.room];

    room.voteSystem = voteSystem;
  }
}

export default new RoomData();
