import { Module } from "@nestjs/common";
import { DinoappGamesGateway } from "./handler/dinoapp-games/dinoapp-games.gateway";

@Module({
  providers: [DinoappGamesGateway],
})
export class DinoAppModule {}
