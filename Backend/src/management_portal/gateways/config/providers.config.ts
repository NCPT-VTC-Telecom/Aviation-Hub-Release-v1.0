import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { DatabaseLogService } from "../../common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { GatewayService } from "../providers/gateway.service";

export const GatewaysProviders = [GatewayService, VerifyLoginMiddleware, LoggerService, DatabaseLogService, ResponseSystemService];
