import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "../../status/entity/status.entity";
import { AddUserInformation, ChangePasswordInformation, UserInformation, UserVerifyInformation } from "../entity/user.entity";
import { Orders } from "../../orders/entity/order.entity";
import { GroupRole, UserGroup, UserGroupLevel2, UserGroupLevel3 } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";

export const UserEntity = TypeOrmModule.forFeature([Status, UserInformation, Orders, UserVerifyInformation, AddUserInformation, UserGroup, UserGroupLevel2, UserGroupLevel3, GroupRole, ChangePasswordInformation, AuditLog, LogUserActivities]);
// BullModule.registerQueue({ name: "users" }),
