import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from '../../status/entity/status.entity';
import { UserVerifyInformation } from '../../user/entity/user.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { Billings, CreateOrderDetails, CreateOrders, OrderDetails, OrderDiscount, OrderInformation, Orders, Transactions } from '../entity/order.entity';
import { Products } from '../../products/entity/product.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';

export const OrdersEntity = TypeOrmModule.forFeature([
  Status,
  UserVerifyInformation,
  UserGroup,
  GroupRole,
  Orders,
  Products,
  CreateOrderDetails,
  OrderDetails,
  OrderDiscount,
  CreateOrders,
  Transactions,
  Billings,
  AuditLog,
  LogUserActivities,
  OrderInformation,
]);
