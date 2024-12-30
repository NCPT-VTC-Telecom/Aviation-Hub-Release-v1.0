import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { SalesChannelService } from "../providers/sale_channels.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

export const SaleChannelProviders = [SalesChannelService, VerifyLoginMiddleware, LoggerService, DatabaseLogService, ResponseSystemService];
