import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ServiceVoucherService } from "../providers/service_vouchers.service";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { VerifyVendorMiddleware } from "src/management_callback/middleware/verify_vendor.middleware";

export const ServiceVoucherProvider = [ServiceVoucherService, LoggerService, RequestDataLogService, VerifyVendorMiddleware];
