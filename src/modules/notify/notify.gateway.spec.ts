import { EventEmitterModule } from "@nestjs/event-emitter";
import { Test, TestingModule } from "@nestjs/testing";
import { NotifyGateway } from "./notify.gateway";

describe("Notify unit tests", () => {
  let gateway: NotifyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [NotifyGateway],
    }).compile();

    gateway = module.get<NotifyGateway>(NotifyGateway);
  });

  it("should return a notify message", () => {
    let socket: any = {
      id: "123",
    };

    expect(gateway.handleNotify(socket, "Hello world")).toEqual({
      event: "notify",
      data: {
        status: "Notify",
        message: "Hello world",
        session: "123",
      },
    });
  });
});
