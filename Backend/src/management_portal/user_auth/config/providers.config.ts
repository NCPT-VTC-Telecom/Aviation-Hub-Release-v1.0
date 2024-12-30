import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { EmailSenderService } from "../../common/email_service/providers/email.service";
import { DatabaseLogService } from "../../common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { AuthenticateManageService, TokenBlacklistService } from "../providers/authenticate_management.service";

export const AuthProviders = [AuthenticateManageService, TokenBlacklistService, LoggerService, EmailSenderService, DatabaseLogService, ResponseSystemService];
