import { Module } from "@nestjs/common";
import { DinoAppGateway } from "./dino-app.gateway";

@Module({
  providers: [DinoAppGateway],
})
export class DinoAppModule {}
