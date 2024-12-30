import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { Discount } from '../entity/discount.entity';
import { Status } from '../../status/entity/status.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const DiscountEntity = TypeOrmModule.forFeature([UserVerifyInformation, Discount, Status, UserGroup, GroupRole, AuditLog, LogUserActivities]);
