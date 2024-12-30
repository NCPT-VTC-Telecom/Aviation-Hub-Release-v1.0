import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { BlackListDevicesService } from "../providers/blacklist_devices.service";
import { BlackListDomainsService } from "../providers/blacklist_domain.service";
import { BlackListCategoryService } from "../providers/blacklist_categories.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

export const BlackListProviders = [VerifyLoginMiddleware, LoggerService, DatabaseLogService, BlackListDevicesService, BlackListDomainsService, BlackListCategoryService, ResponseSystemService];
