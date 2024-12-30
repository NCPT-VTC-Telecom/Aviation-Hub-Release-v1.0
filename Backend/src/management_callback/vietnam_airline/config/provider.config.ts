import { LoggerService } from "../../../management_portal/common/logger_service/providers/log_service/log_service.service";
import { RequestDataLogService } from "../../callback_log/providers/callback_log.service";
import { DeviceVietnamAirlineService } from "../providers/device.service";
import { FlightVietnamAirlineService } from "../providers/flight.service";
import { TicketVietnamAirlineService } from "../providers/ticket.service";

export const DeviceProvider = [DeviceVietnamAirlineService, LoggerService, RequestDataLogService];

export const FlightProvider = [FlightVietnamAirlineService, LoggerService, RequestDataLogService];

export const TicketProvider = [TicketVietnamAirlineService, LoggerService, RequestDataLogService];
