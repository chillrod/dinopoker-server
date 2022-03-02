import { Module } from "@nestjs/common";

import { DinoAppModule } from "./modules/dinoapp/dino-app.module";

@Module({
  imports: [DinoAppModule],
})
export class AppModule {}
