import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLog, LogUserActivities } from "../../common/logger_service/entity/log_user_management.entity";
import { Status } from "../../status/entity/status.entity";
import { UserVerifyInformation } from "../../user/entity/user.entity";
import { GroupRole, UserGroup } from "../../user_group/entity/user_group.entity";
import { CampaignDetails, CampaignInfo } from "../entity/campaign.entity";

export const CampaignEntities = TypeOrmModule.forFeature([Status, UserVerifyInformation, UserGroup, GroupRole, AuditLog, LogUserActivities, CampaignInfo, CampaignDetails]);
