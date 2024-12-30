import { LoggerService } from "../../../management_portal/common/logger_service/providers/log_service/log_service.service";
import { RequestDataLogService } from "../../callback_log/providers/callback_log.service";
import { TelecomService } from "../providers/telecom.service";

export const TelecomProviders = [TelecomService, LoggerService, RequestDataLogService];
