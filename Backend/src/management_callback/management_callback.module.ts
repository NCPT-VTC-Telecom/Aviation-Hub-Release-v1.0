import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../config/data.config";
import { FlightDataVietnamAirlineModule } from "./vietnam_airline/modules/flight.module";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";

import { AppService } from "src/app.service";
import { RequestDataLogService } from "./callback_log/providers/callback_log.service";
import { CallBackLogRequestEntity } from "./callback_log/entity/callback_log.entity";
import { DeviceDataVietnamAirlineModule } from "./vietnam_airline/modules/device.module";
import { ApiSatelliteAAARequest } from "./satellite/entity/satellite.entity";
import { TicketVietnamAirlineModule } from "./vietnam_airline/modules/ticket.module";
import { TelecomModule } from "./telecom/modules/telecom.module";
import { SatelliteModule } from "./satellite/modules/satellite.module";
import { FlightVietnamAirlineController } from "./vietnam_airline/controller/flight.controller";
import { DeviceVietnamAirlineController } from "./vietnam_airline/controller/device.controller";
import { TelecomController } from "./telecom/controller/telecom.controller";
import { SatelliteController } from "./satellite/controller/satellite.controller";
import { TicketVietnamAirlineController } from "./vietnam_airline/controller/ticket.controller";
import { ServiceVoucherModule } from "./service_vouchers/modules/service_vouchers.module";
import { ServiceVoucherManagementController } from "./service_vouchers/controllers/service_vouchers.controller";

import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyVendorMiddleware } from "./middleware/verify_vendor.middleware";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { VendorMiddleware } from "./common/entity/middleware.entity";
import { VerifyIPAddressMiddleware } from "./middleware/whitelist.middleware";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([CallBackLogRequestEntity, ApiSatelliteAAARequest, UserVerifyInformation, VendorMiddleware]),
    FlightDataVietnamAirlineModule,
    DeviceDataVietnamAirlineModule,
    LoggerModule,
    TelecomModule,
    SatelliteModule,
    TicketVietnamAirlineModule,
    ServiceVoucherModule,
  ],
  controllers: [FlightVietnamAirlineController, DeviceVietnamAirlineController, TelecomController, SatelliteController, TicketVietnamAirlineController, ServiceVoucherManagementController],
  providers: [AppService, RequestDataLogService, LoggerService, VerifyVendorMiddleware, VerifyIPAddressMiddleware],
})
export class ManagementCallBackModule {}
