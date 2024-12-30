import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { Billings, OrderInformation } from '../../orders/entity/order.entity';
import { Status } from "../../status/entity/status.entity";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";

export const BillingsEntities = TypeOrmModule.forFeature([UserVerifyInformation, Billings, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, OrderInformation]);
