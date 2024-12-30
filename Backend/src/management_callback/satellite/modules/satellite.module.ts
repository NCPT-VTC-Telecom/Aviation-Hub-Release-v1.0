import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { SatelliteEntity } from "../config/import.config";
import { SatelliteProviders } from "../config/providers.config";
import { SatelliteController } from "../controller/satellite.controller";

@Module({
  imports: [SatelliteEntity, LoggerModule, HttpModule],
  controllers: [SatelliteController],
  providers: [...SatelliteProviders],
  exports: [...SatelliteProviders],
})
export class SatelliteModule {}
