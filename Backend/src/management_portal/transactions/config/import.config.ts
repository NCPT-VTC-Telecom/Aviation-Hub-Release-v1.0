import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { OrderInformation, Transactions } from '../../orders/entity/order.entity';
import { Status } from '../../status/entity/status.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const TransactionEntity = TypeOrmModule.forFeature([UserVerifyInformation, Transactions, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, OrderInformation])