import { LoggerService } from '../../../management_portal/common/logger_service/providers/log_service/log_service.service';
import { RequestDataLogService } from '../../callback_log/providers/callback_log.service';
import { DatabaseLogService } from '../../user_activities/providers/user_activities.service';
import { SatelliteService } from '../providers/satellite.service';

export const SatelliteProviders = [SatelliteService, LoggerService, RequestDataLogService, DatabaseLogService]