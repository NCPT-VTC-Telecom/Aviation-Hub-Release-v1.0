// imports.config.ts
import { TypeOrmModule } from "@nestjs/typeorm";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Status } from "src/management_portal/status/entity/status.entity";
import { SessionCatalog, SessionDetails, Sessions, FindSessionDetails, UserSessionActivities, FindSessions } from "src/management_portal/sessions/entity/session.entity";
import { UserGroup, GroupRole } from "src/management_portal/user_group/entity/user_group.entity";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { DeviceHealth } from "src/management_portal/devices/entity/devices.entity";
import { Orders } from "src/management_portal/orders/entity/order.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { BullModule } from "@nestjs/bull";
import { BrowsersChart, DataUsageChart, DataUsageDateChart, DataUsagePaxDateServiceChart, PaxSessionAveragePerDayChart, UserDeviceChart } from "../entity/session_chart.entity";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { OrderProductDateChart, OrderPurchaseSaleChannelsChart, OrdersPurchaseChart } from "../entity/session_order_chart.entity";
import { DeviceHealthChart } from "../entity/device_chart.entity";
import { SessionDataRoleChart } from "../entity/session_role_chart.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";

// Entities
export const TypeOrmEntities = TypeOrmModule.forFeature([
  Aircraft,
  Status,
  SessionCatalog,
  SessionDetails,
  Sessions,
  FindSessionDetails,
  FindSessions,
  UserSessionActivities,
  UserGroup,
  GroupRole,
  AuditLog,
  LogUserActivities,
  DeviceHealth,
  Orders,
  DataUsageChart,
  DataUsageDateChart,
  DataUsagePaxDateServiceChart,
  BrowsersChart,
  UserDeviceChart,
  PaxSessionAveragePerDayChart,
  UserVerifyInformation,
  OrdersPurchaseChart,
  OrderProductDateChart,
  OrderPurchaseSaleChannelsChart,
  DeviceHealthChart,
  SessionDataRoleChart,
  Flights
]);

// Cache Module
export const CacheProvider = CacheModule.register();

// Bull Queue
export const BullQueueProvider = BullModule.registerQueue({
  name: "data-usage",
});
