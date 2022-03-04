import { Module } from "@nestjs/common";
import { DinoappGamesGateway } from "./dinoapp-games.gateway";

@Module({
  providers: [DinoappGamesGateway],
})
export class DinoAppModule {}
