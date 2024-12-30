import { Module } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { FlightEntity } from "../config/import.config";
import { FlightProvider } from "../config/provider.config";
import { FlightVietnamAirlineController } from "../controller/flight.controller";

@Module({
  imports: [FlightEntity, LoggerModule],
  controllers: [FlightVietnamAirlineController],
  providers: [...FlightProvider],
  exports: [...FlightProvider],
})
export class FlightDataVietnamAirlineModule {}
