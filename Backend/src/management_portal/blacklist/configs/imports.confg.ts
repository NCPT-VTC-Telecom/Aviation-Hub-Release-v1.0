import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { Status } from "src/management_portal/status/entity/status.entity";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { GroupRole, UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { BlackListDevicesInfo } from "../entity/blacklist_devices.entity";
import { BlackListCategoriesInfo } from "../entity/blacklist_categories.entity";
import { BlackListDomainInfo } from "../entity/blacklist_domain.entity";

export const BlackListEntities = TypeOrmModule.forFeature([UserVerifyInformation, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, BlackListDevicesInfo, BlackListCategoriesInfo, BlackListDomainInfo]);
