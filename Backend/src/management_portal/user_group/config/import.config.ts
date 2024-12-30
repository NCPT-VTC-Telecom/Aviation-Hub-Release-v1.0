import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "../../status/entity/status.entity";
import { GroupRole, UserGroup, UserGroupLevel2, UserGroupLevel3 } from "../entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { ApiRadiusAuthRequest } from "../../../management_callback/satellite/entity/auth_radius.entity";

export const GroupEntity = TypeOrmModule.forFeature([Status, UserGroup, GroupRole, AuditLog, LogUserActivities, UserVerifyInformation, UserGroupLevel2, UserGroupLevel3, ApiRadiusAuthRequest]);
