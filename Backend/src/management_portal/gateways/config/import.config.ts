import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateways } from '../entity/gateway.entity';
import { Status } from '../../status/entity/status.entity';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { OrderInformation } from '../../orders/entity/order.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const GatewaysEntity = TypeOrmModule.forFeature([Gateways, Status, UserVerifyInformation, UserGroup, GroupRole, OrderInformation, AuditLog, LogUserActivities]);
