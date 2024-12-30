import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformation, UserVerifyInformation } from '../../user/entity/user.entity';
import { Status } from '../../status/entity/status.entity';
import { GroupRole, UserGroup } from '../../user_group/entity/user_group.entity';
import { AuditLog, LogUserActivities } from '../../common/logger_service/entity/log_user_management.entity';
import { CustomerService } from '../entity/customer_service.entity';
import { CustomerServiceHist } from '../entity/customer_service_hist.entity';


export const CustomerServiceEntity = TypeOrmModule.forFeature([UserVerifyInformation, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, CustomerService, CustomerServiceHist, UserInformation]);
