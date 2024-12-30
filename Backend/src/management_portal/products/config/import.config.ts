import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPlaneTicket, ProductPrice, Products, ProductTelecom } from '../entity/product.entity';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { OrderDetails, Orders } from '../../orders/entity/order.entity';
import { Status } from '../../status/entity/status.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const ProductsEntity = TypeOrmModule.forFeature([ProductPrice, UserVerifyInformation, Orders, OrderDetails, Products, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, ProductPlaneTicket, ProductTelecom]);
