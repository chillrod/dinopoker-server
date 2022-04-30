import { IPlayerData } from "../model/IPlayerData";

import roomData from "./room-data";

describe("Room Data", () => {
  const playerData: IPlayerData = {
    room: "test",
    name: "Rod",
    id: "123123",
    clientId: "123123",
    character: 0,
    characterColor: "red",
    vote: 1,
  };

  const createRoom = () => {
    roomData.handleRoomCreate(playerData);
  };

  beforeEach(() => {
    roomData.room = [];
  });

  describe("User Actions", () => {
    it("should create a new room object based on client givens room", () => {
      createRoom();

      expect(roomData.room["test"]).toEqual({
        roomVoteStatus: "WAITING",
        room: "test",
        players: [],
      });
    });

    it("should throw an error if the room already exists", () => {
      createRoom();

      expect(() => {
        roomData.handleRoomCreate(playerData);
      }).toThrow("You attempted to create a room that already exists");
    });

    it("should update room vote status to VOTING when user vote", () => {
      createRoom();

      const Room = roomData;

      Room.addCharacter(playerData);

      const updatedData = {
        ...playerData,
        vote: 15,
      };

      Room.handleVotingStatus(updatedData);

      const roomPick = Room.pick(playerData.room);

      expect(roomPick.roomVoteStatus).toEqual("VOTING");
    });

    it("should update room vote status to ENDED when user clicks in reveal", () => {
      createRoom();

      const Room = roomData;

      Room.addCharacter(playerData);

      const updatedData = {
        ...playerData,
        vote: 15,
      };

      Room.handleEndedStatus(updatedData);

      const roomPick = Room.pick(playerData.room);

      expect(roomPick.roomVoteStatus).toEqual("ENDED");
    });

    it("should reset a room vote status to WAITING when user clicks restart", () => {
      createRoom();

      const Room = roomData;

      Room.addCharacter(playerData);

      const updatedData = {
        ...playerData,
        vote: 15,
      };

      Room.handleEndedStatus(updatedData);

      const roomPick = Room.pick(playerData.room);

      expect(roomPick.roomVoteStatus).toEqual("ENDED");

      Room.handleRestartStatus(playerData);

      const roomPick2 = Room.pick(playerData.room);

      expect(roomPick2.roomVoteStatus).toEqual("WAITING");
    });

    it("should update the clients data ex: vote, etc", () => {
      createRoom();

      const Room = roomData;

      Room.addCharacter(playerData);

      const updatedData = {
        ...playerData,
        vote: 15,
      };

      const roomPick = Room.pick(playerData.room);

      expect(roomPick.players[0].vote).toEqual(1);

      Room.handleUpdateClientData(updatedData);

      expect(roomPick.players[0].vote).toEqual(15);
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

      expect(Room.pick("test").room).toBe("test");
    });

    it("should clear a room content", () => {
      createRoom();

      const Room = roomData;

      Room.clearRoom("test");

      expect(Room.checkIfRoomExists("test")).toBeFalsy();
    });

    it("should clear a room if no user is available", () => {
      createRoom();

      const Room = roomData;

      Room.removeCharacter(playerData);

      expect(Room.checkIfRoomExists("test")).toBeFalsy();
    });

    it("should delete a user from room, if user no longer exists", () => {
      createRoom();

      const Room = roomData;

      Room.addCharacter(playerData);

      const playerData2: IPlayerData = {
        room: "test",
        name: "Rod",
        id: "1231233",
        clientId: "1231233",
        character: 0,
        characterColor: "red",
        vote: 1,
      };

      Room.addCharacter(playerData2);

      Room.removeCharacter(playerData);

      expect(Room.pick("test").players).toEqual([playerData2]);
    });

    it("should add a character to a room when user join", () => {
      createRoom();

      const Room = roomData;

      const playerData2: IPlayerData = {
        room: "test",
        name: "Rod",
        id: "1231233",
        clientId: "1231233",
        characterColor: "red",
        character: 0,
        vote: 1,
      };

      Room.addCharacter(playerData2);

      Room.addCharacter(playerData);

      expect(Room.pick("test").players).toEqual([playerData2, playerData]);
    });
  });
});
