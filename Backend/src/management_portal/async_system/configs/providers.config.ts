import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { AsyncSystemService } from "../providers/async_system.service";

export const AsyncSystemProviders = [AsyncSystemService, LoggerService];
