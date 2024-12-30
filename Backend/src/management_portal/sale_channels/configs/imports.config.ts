import { TypeOrmModule } from "@nestjs/typeorm";
import { SaleChannels } from "../entity/sale_channels.entity";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { Status } from "src/management_portal/status/entity/status.entity";
import { GroupRole, UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";

export const TypeOrmSaleChannelEntities = TypeOrmModule.forFeature([SaleChannels, UserVerifyInformation, Status, UserGroup, GroupRole, AuditLog, LogUserActivities]);
