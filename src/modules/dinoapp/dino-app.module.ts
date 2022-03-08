import { Inject, Module } from "@nestjs/common";
import { SocketService } from "src/service/Server";
import { DinoappGamesGateway } from "./dinoapp-games.gateway";

@Module({
  providers: [DinoappGamesGateway],
})
export class DinoAppModule {}
