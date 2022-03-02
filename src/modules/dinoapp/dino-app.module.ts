import { Module } from "@nestjs/common";
import { DinoappGamesGateway } from "./handler/dinoapp-games/dinoapp-games.gateway";

@Module({})
export class DinoAppModule {
  providers: [DinoappGamesGateway];
}
