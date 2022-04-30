import { IChatMessage } from "../model/IChatMessage";

import RoomData from "./room-data";

export class RoomChatData {
  constructor() {}

  handleAddChatMessage(chatMessage: IChatMessage) {
    if (!RoomData.checkIfRoomExists(chatMessage.room)) {
      throw new Error(
        "You attempted to add a chat message to a room that does not exist"
      );
    }

    RoomData.room[chatMessage.room].chat.push(chatMessage);
  }
}

export default new RoomChatData();
