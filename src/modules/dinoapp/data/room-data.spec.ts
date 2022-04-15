import { IPlayerData } from "../model/IPlayerData";

import roomData from "./room-data";

describe("Room Data", () => {
  const playerData: IPlayerData = {
    room: "test",
    name: "Rod",
    id: "123123",
    clientId: "123123",
    character: 0,
    vote: 1,
  };

  const createRoom = () => {
    roomData.handleRoomCreate(playerData);
  };

  describe("User Actions", () => {
    it("should create a new room object based on client givens room", () => {
      createRoom();

      expect(roomData.room["test"]).toEqual({
        roomVoteStatus: "WAITING",
        room: "test",
        players: [playerData],
      });
    });

    it("should throw an error if the room already exists", () => {
      createRoom();

      expect(roomData.handleRoomCreate(playerData)).toEqual(
        "You attempted to create a room that already exists"
      );
    });
  });

  describe("Room Actions", () => {
    it("should check if room exists and if not, return falsy", () => {
      const Room = roomData;

      expect(Room.checkIfRoomExists("if1Room")).toBeFalsy();
    });

    it("should pick a room data based on room identifier", () => {
      createRoom();

      const Room = roomData;

      expect(Room.pick("test")).toEqual({
        roomVoteStatus: "WAITING",
        room: "test",
        players: [playerData],
      });
    });

    it("should clear a room content", () => {
      createRoom();

      const Room = roomData;

      Room.clearRoom("test");

      expect(Room.checkIfRoomExists("test")).toBeFalsy();
    });

    it("should delete a user from room, if user no longer exists", () => {
      createRoom();

      const Room = roomData;

      Room.removeCharacter(playerData);

      expect(Room.pick("test").players).toEqual([]);
    });
  });
});
