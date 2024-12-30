import { TypeOrmModule } from "@nestjs/typeorm";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { Status } from "../../status/entity/status.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { AirlinesInfo } from '../entity/airlines.entity';

export const AirlinesEntities = TypeOrmModule.forFeature([UserVerifyInformation, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, AirlinesInfo]);
