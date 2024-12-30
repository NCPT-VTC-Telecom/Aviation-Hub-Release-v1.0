import { TypeOrmModule } from "@nestjs/typeorm";
import { Aircraft, AircraftMaintenance, MaintenanceAircraftHist } from "../entity/aircraft.entity";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { Flights } from "../entity/flights.entity";
import { Sessions } from "../../sessions/entity/session.entity";
import { Status } from "../../status/entity/status.entity";
import { DeviceDetails, Devices } from "../../devices/entity/devices.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";

export const FlightsEntity = TypeOrmModule.forFeature([Aircraft, UserVerifyInformation, Flights, Sessions, Status, Devices, DeviceDetails, UserGroup, GroupRole, AuditLog, LogUserActivities, AircraftMaintenance, MaintenanceAircraftHist]);
