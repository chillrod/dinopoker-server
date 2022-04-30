import { IChatMessage } from "../model/IChatMessage";
import { IPlayerData } from "../model/IPlayerData";

import RoomChatData from "./room-chat-data";
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

  describe("Room Chat Actions", () => {
    it("should add a chat message to the room chat", () => {
      createRoom();

      const chatMessage: IChatMessage = {
        character: "red",
        room: "test",
        clientId: "123123",
        message: "Hello there",
      };

      RoomChatData.handleAddChatMessage(chatMessage);

      expect(roomData.pick(chatMessage.room).chat).toEqual([chatMessage]);
    });
  });

  describe("Room Chat User Actions", () => {});
});
