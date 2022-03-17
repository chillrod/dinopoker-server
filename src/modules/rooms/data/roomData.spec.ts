import { Player } from "src/modules/players/dto/IPlayer";
import { RoomData } from "./roomData";

describe("Room Data", () => {
  const player: Player = {
    id: "1",
    color: "#FFF",
    name: "Rod",
    vote: 0,
  };

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

    data.create("if1Room");

    expect(data.create("if1Room")).toEqual("Room already exists");
  });

  it("should save a player data in a room array", () => {
    const data = new RoomData();

    data.create("if1Room");

    data.assignPlayerDataToRoom("if1Room", player);

    expect(data.room["if1Room"]).toContain(player);
  });

  it("should delete a room", () => {
    const data = new RoomData();

    data.create("if1Room");
    
    data.create("if2Room");

    data.assignPlayerDataToRoom("if1Room", player);

    data.clear("if1Room");

    expect(data.room).toEqual({ if2Room: [] });
  });

  it("should pick a room content", () => {
    const data = new RoomData();

    data.create("if1Room");

    data.assignPlayerDataToRoom("if1Room", player);

    expect(data.pick("if1Room")).toContain(player);
  });
});
