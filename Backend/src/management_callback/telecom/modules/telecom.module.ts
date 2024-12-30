import { Module } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { TelecomEntity } from "../config/import.config";
import { TelecomProviders } from "../config/providers.config";
import { TelecomController } from "../controller/telecom.controller";

@Module({
  imports: [TelecomEntity, LoggerModule],
  controllers: [TelecomController],
  providers: [...TelecomProviders],
  exports: [...TelecomProviders],
})
export class TelecomModule {}
