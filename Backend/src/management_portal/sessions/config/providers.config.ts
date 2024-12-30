// providers.config.ts
import { ConfigService } from "@nestjs/config";
import { SessionService } from "src/management_portal/sessions/providers/session.service";
import { ChartSessionService } from "src/management_portal/sessions/providers/chart_session/chart_sessions.service";
import { ChartSessionBrowserService, ChartDataUsagePaxService, ChartSessionDeviceService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart.service";
import { ChartDataUsagePaxDateService, ChartDataUsagePerDateService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart_date.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ChartOrderService } from "src/management_portal/sessions/providers/chart_session/chart_order.service";
import { ChartOrderSaleChannelService, ChartOrderPurchasesService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart_order.service";
import { ChartOrderPurchasesDateService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart_order_date.service";
import { ChartSessionRoleDateService, ChartSessionRoleService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart_role.service";
import { ChartRoleService } from "src/management_portal/sessions/providers/chart_session/chart_role.service";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { ChartDeviceHealthService } from "src/management_portal/sessions/providers/calculate_chart/calculate_chart_device.service";
import { ChartDeviceService } from "src/management_portal/sessions/providers/chart_session/chart_device..service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

// Providers
export const SessionProviders = [
  SessionService,
  ChartSessionService,
  ChartSessionBrowserService,
  ChartDataUsagePaxService,
  ConfigService,
  ChartDataUsagePaxDateService,
  ChartSessionDeviceService,
  ChartDataUsagePerDateService,
  VerifyLoginMiddleware,
  LoggerService,
  ChartOrderService,
  ChartOrderPurchasesService,
  ChartOrderSaleChannelService,
  ChartOrderPurchasesDateService,
  ChartSessionRoleService,
  ChartRoleService,
  ChartSessionRoleDateService,
  DatabaseLogService,
  ChartDeviceHealthService,
  ChartDeviceService,
  ResponseSystemService,
];
