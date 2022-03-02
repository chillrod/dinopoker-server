import { Test, TestingModule } from "@nestjs/testing";
import { Socket } from "socket.io";
import { v4 } from "uuid";
import { DinoappGamesGateway } from "./dinoapp-games.gateway";

describe("DinoappGamesGateway", () => {
  let gateway: DinoappGamesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinoappGamesGateway],
    }).compile();

    gateway = module.get<DinoappGamesGateway>(DinoappGamesGateway);
  });

  it("should receive a player data and save it in currentPlayers room array", () => {
    const player = {
      id: v4(),
      name: "Bob",
      vote: 1,
      character: 1,
      room: "if1Room",
    };

    const player2 = {
      id: v4(),
      name: "John",
      vote: 2.5,
      character: 2,
      room: "if1Room",
    };

    expect(gateway.sendPlayerData(player)).toEqual({
      event: "msgToClient",
      data: player,
    });

    gateway.sendPlayerData(player2);

    expect(gateway.currentPlayers.if1Room).toContain(player);
    expect(gateway.currentPlayers.if1Room).toContain(player2);
  });

  it("should receive a error if player tries to join a unexisting room", () => {
    const player = {
      id: v4(),
      name: "Bob",
      vote: 1,
      character: 1,
      room: "if1Room",
    };
    // expect(gateway.handleJoinRoom({ room: "if4Room", player })).toEqual({
    //   event: "msgToClient",
    //   data: "Room doest not exist",
    // });
  });

  it("should join a specific room and save the player in the currentRoom array", () => {
    const player = {
      id: v4(),
      name: "Bob",
      vote: 1,
      character: 1,
      room: "if1Room",
    };

    // expect(
    //   gateway.handleJoinRoom({ data: { room: "if1Room", player } })
    // ).toEqual({
    //   event: "msgToClient",
    //   data: "You have joined a room",
    // });

    expect(gateway.currentPlayers.if1Room).toContain(player);

    console.log(gateway.currentPlayers);
  });
});
