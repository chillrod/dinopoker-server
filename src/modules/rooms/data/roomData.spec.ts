import { Player } from "src/modules/players/dto/IPlayer";
import { RoomData } from "./roomData";

describe("Room Data", () => {
  it("should return the room data array", () => {
    const data = new RoomData();

    expect(data.room).toEqual({});
  });

  it("should create a new room a the given room name", () => {
    const data = new RoomData();

    data.create("if1Room");

    expect(data.room).toMatchSnapshot();
  });

  it("should throw when user tries to create a existing room", () => {
    const data = new RoomData();

    data.create("1f1Room");

    expect(data.create("1f1Room")).toEqual("Room already exists");
  });

  it("should save a player data in a room array", () => {
    const data = new RoomData();

    data.create("1f1Room");

    const player: Player = {
      id: "1",
      color: "#FFF",
      name: "Rod",
      vote: 0,
    };

    data.assignPlayerDataToRoom("1f1room", player);

    console.log(data.room);
  });
});
