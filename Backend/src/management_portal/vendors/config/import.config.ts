import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "../../status/entity/status.entity";
import { UserInformation, UserVerifyInformation } from "../../user/entity/user.entity";
import { GroupRole, UserGroup, UserGroupLevel2, UserGroupLevel3 } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { VendorInformation, VendorRenewInformation, VendorUserInformation } from "../entity/vendors.entity";

export const VendorEntity = TypeOrmModule.forFeature([
  Status,
  UserInformation,
  UserVerifyInformation,
  UserGroup,
  GroupRole,
  AuditLog,
  LogUserActivities,
  VendorInformation,
  VendorRenewInformation,
  VendorUserInformation,
  UserGroupLevel2,
  UserGroupLevel3,
]);
