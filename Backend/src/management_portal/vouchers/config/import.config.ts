import { TypeOrmModule } from "@nestjs/typeorm";
import { UserInformation, UserVerifyInformation } from "../../user/entity/user.entity";
import { Vouchers, VoucherSystemInfo } from "../entity/vouchers.entity";
import { Status } from "../../status/entity/status.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { CampaignInfo } from "../../campaign/entity/campaign.entity";
import { Products } from "src/management_portal/products/entity/product.entity";

export const VoucherEntity = TypeOrmModule.forFeature([UserVerifyInformation, Vouchers, Status, UserGroup, GroupRole, AuditLog, LogUserActivities, CampaignInfo, VoucherSystemInfo, Products, UserInformation]);
