import { Test } from "@nestjs/testing";
import { Server, Socket } from "socket.io";
import { DinoAppModule } from "../dino-app.module";

describe("Dino App", () => {
  const socket = Socket;
  const server = Server;

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [DinoAppModule],
    }).compile();
  });
});
