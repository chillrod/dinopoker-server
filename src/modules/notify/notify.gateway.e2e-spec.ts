import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { NotifyGateway } from "./notify.gateway";

import * as io from "socket.io-client";
import { IoAdapter } from "@nestjs/platform-socket.io";

describe.skip("NotifyGateway", () => {
  // TODO - implement e2e tests
  let gateway: NotifyGateway;

  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifyGateway],
    }).compile();

    gateway = module.get<NotifyGateway>(NotifyGateway);

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should connect the user", () => {
    const client = io.connect(`http://localhost:3333/notify`, {
      transports: ["websocket"],
    });

    client.on("connect", () => {
      expect(client.connected).toBe(true);
    });
  });

  it("should emit a notify event", () => {
    const client = io.connect(`http://localhost:3333/notify`, {
      transports: ["websocket"],
    });

    client.on("connect", () => {
      client.emit("notify", {
        message: "Hello world",
      });
    });
  });

  // it.todo("should notify when a a client disconnects server");
});
