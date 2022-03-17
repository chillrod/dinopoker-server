import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { NotifyGateway } from "./modules/notify/notify.gateway";
import { PlayersGateway } from "./modules/players/players.gateway";
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [NotifyGateway, PlayersGateway],
})
export class AppModule {}
