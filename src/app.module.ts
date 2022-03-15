import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { NotifyGateway } from "./modules/notify/notify.gateway";
import { PlayersGateway } from "./modules/players/players.gateway";
import { RoomsGateway } from './modules/rooms/rooms.gateway';
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [NotifyGateway, PlayersGateway, RoomsGateway],
})
export class AppModule {}
