import { Module } from "@nestjs/common";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
