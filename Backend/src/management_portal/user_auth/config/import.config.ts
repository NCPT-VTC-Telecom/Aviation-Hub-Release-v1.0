import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthManagementLogin, ChangePasswordInformation, UserVerifyInformation } from '../../user/entity/user.entity';
import { Status } from '../../status/entity/status.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const AuthEntity = TypeOrmModule.forFeature([AuthManagementLogin, UserVerifyInformation, Status, UserGroup, GroupRole, ChangePasswordInformation, AuditLog, LogUserActivities])