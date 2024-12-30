import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from '../../status/entity/status.entity';
import { Supplier } from '../entity/supplier.entity';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const SupplierEntity = TypeOrmModule.forFeature([Status, Supplier, UserVerifyInformation, UserGroup, GroupRole, AuditLog, LogUserActivities])