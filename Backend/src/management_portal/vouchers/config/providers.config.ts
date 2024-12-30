import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { DatabaseLogService } from "../../common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { VouchersService } from "../providers/vouchers.service";

export const VoucherProviders = [VouchersService, VerifyLoginMiddleware, LoggerService, DatabaseLogService, ResponseSystemService];