import { Module } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { DeviceEntity } from "../config/import.config";
import { DeviceProvider } from "../config/provider.config";
import { DeviceVietnamAirlineController } from "../controller/device.controller";

@Module({
  imports: [DeviceEntity, LoggerModule],
  controllers: [DeviceVietnamAirlineController],
  providers: [...DeviceProvider],
  exports: [...DeviceProvider],
})
export class DeviceDataVietnamAirlineModule {}
