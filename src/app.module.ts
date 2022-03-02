import { Module } from "@nestjs/common";
import { DinoAppGateway } from "./modules/dino-app/dino-app.gateway";

@Module({
  imports: [DinoAppGateway],
})
export class AppModule {}
