import { Test, TestingModule } from "@nestjs/testing";
import { Socket } from "socket.io";
import { v4 } from "uuid";

import { DinoappGamesGateway } from "./dinoapp-games.gateway";

describe("DinoappGamesGateway", () => {
  let gateway: DinoappGamesGateway;
  let socket: Socket;

  const returnPlayer = ({ room, vote = null }) => {
    return {
      room: room,
      id: v4(),
      clientId: v4(),
      name: "test",
      character: 0,
      vote: vote,
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinoappGamesGateway],
    }).compile();

    gateway = module.get<DinoappGamesGateway>(DinoappGamesGateway);
  });

  it("should join a new client to a room", () => {});
});
