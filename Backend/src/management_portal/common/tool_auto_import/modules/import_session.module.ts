import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { DataController } from "src/management_portal/common/tool_auto_import/controllers/import_session.controller";
import { ImportFlightService } from "src/management_portal/common/tool_auto_import/providers/import_flight.service";
import { ImportSessionService } from "src/management_portal/common/tool_auto_import/providers/import_session.service";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, DeviceInfo, DeviceTrackingHealth, Devices } from "src/management_portal/devices/entity/devices.entity";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { Orders } from "src/management_portal/orders/entity/order.entity";
import { Products } from "src/management_portal/products/entity/product.entity";
import { FindSessionDetails, FindSessions, SessionCatalog, SessionDetails, Sessions } from "src/management_portal/sessions/entity/session.entity";
import { Status } from "src/management_portal/status/entity/status.entity";
import { UserInformation, UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { GroupRole, UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { ImportDataDeviceService } from "../providers/import_data_device.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Status,
      SessionCatalog,
      SessionDetails,
      Sessions,
      UserVerifyInformation,
      UserGroup,
      GroupRole,
      Orders,
      FindSessionDetails,
      FindSessions,
      AuditLog,
      LogUserActivities,
      Products,
      DeviceInfo,
      Flights,
      Aircraft,
      DeviceTrackingHealth,
      DeviceHealth,
      Devices,
      DeviceDetails,
      UserInformation,
      DeviceHealthActivities,
    ]),
  ],
  controllers: [DataController],
  providers: [LoggerService, ImportSessionService, ImportFlightService, ImportDataDeviceService],
  exports: [LoggerService, ImportSessionService, ImportFlightService, ImportDataDeviceService],
})
export class ImportSessionModule {}
