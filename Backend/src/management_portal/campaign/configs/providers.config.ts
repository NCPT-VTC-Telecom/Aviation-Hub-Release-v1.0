import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { DatabaseLogService } from "../../common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { CampaignService } from "../providers/campaign.service";

export const CampaignProviders = [VerifyLoginMiddleware, LoggerService, DatabaseLogService, CampaignService, ResponseSystemService];
