import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { TicketEntity } from "../config/import.config";
import { TicketProvider } from "../config/provider.config";
import { TicketVietnamAirlineController } from "../controller/ticket.controller";

@Module({
  imports: [TicketEntity, LoggerModule, HttpModule],
  controllers: [TicketVietnamAirlineController],
  providers: [...TicketProvider],
  exports: [...TicketProvider],
})
export class TicketVietnamAirlineModule {}
