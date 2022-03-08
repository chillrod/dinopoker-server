import { Module } from "@nestjs/common";
import { NotifyGateway } from "./modules/notify/notify.gateway";

@Module({
  providers: [NotifyGateway],
})
export class AppModule {}
