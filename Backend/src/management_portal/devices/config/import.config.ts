import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, Devices, DeviceType, IFCServiceMetrics, MaintenanceDevices, MaintenanceDevicesHist } from "../entity/devices.entity";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { Status } from "../../status/entity/status.entity";
import { Aircraft } from "../../flights/entity/aircraft.entity";
import { Supplier } from "../../supplier/entity/supplier.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { Flights } from "../../flights/entity/flights.entity";

export const DevicesEntity = TypeOrmModule.forFeature([
  Devices,
  DeviceDetails,
  MaintenanceDevicesHist,
  MaintenanceDevices,
  UserVerifyInformation,
  DeviceType,
  DeviceHealth,
  Status,
  Aircraft,
  Supplier,
  UserGroup,
  GroupRole,
  AuditLog,
  LogUserActivities,
  Flights,
  DeviceHealthActivities,
  IFCServiceMetrics,
]);
