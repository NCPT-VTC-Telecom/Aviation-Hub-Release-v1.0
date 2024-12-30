import { TypeOrmModule } from "@nestjs/typeorm";
import { CallBackLogRequestEntity } from "../../callback_log/entity/callback_log.entity";
import {
  ApiSatelliteAAARequest,
  ApiSatelliteActivities,
  AuthenticateVoucher,
  PreSatelliteUserLogin,
  SatelliteBlacklistDomains,
  SatelliteDeviceDetails,
  SatelliteDevices,
  SatelliteFlights,
  SatelliteOrderDetails,
  SatelliteOrderInformation,
  SatelliteProducts,
  SatelliteRadiusUser,
  SatelliteSessionCatalog,
  SatelliteSessionDetails,
  SatelliteSessions,
  SatelliteUserLogin,
  UserAcctTemp,
} from "../entity/satellite.entity";
import { AuditLog, LogUserActivities } from "../../../management_portal/common/logger_service/entity/log_user_management.entity";
import { ApiRadiusAuthRequest, AuthRadiusLogin, RadiusUserActivities } from "../entity/auth_radius.entity";
import { Products } from "../../../management_portal/products/entity/product.entity";
import { UserVerifyInformation } from "../../../management_portal/user/entity/user.entity";
import { OrderDetails, Orders } from "../../../management_portal/orders/entity/order.entity";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, Devices, IFCServiceMetrics } from "../../../management_portal/devices/entity/devices.entity";
import { Flights } from "../../../management_portal/flights/entity/flights.entity";
import { Aircraft } from "../../../management_portal/flights/entity/aircraft.entity";
import { Vouchers } from "../../../management_portal/vouchers/entity/vouchers.entity";

export const SatelliteEntity = TypeOrmModule.forFeature([
  CallBackLogRequestEntity,
  SatelliteUserLogin,
  SatelliteSessionCatalog,
  SatelliteSessions,
  SatelliteSessionDetails,
  SatelliteDeviceDetails,
  SatelliteDevices,
  SatelliteFlights,
  SatelliteRadiusUser,
  SatelliteOrderInformation,
  SatelliteProducts,
  SatelliteOrderDetails,
  ApiSatelliteAAARequest,
  LogUserActivities,
  ApiSatelliteActivities,
  RadiusUserActivities,
  AuthRadiusLogin,
  ApiRadiusAuthRequest,
  AuditLog,
  PreSatelliteUserLogin,
  Products,
  UserVerifyInformation,
  UserAcctTemp,
  Devices,
  Flights,
  OrderDetails,
  Orders,
  DeviceDetails,
  AuthenticateVoucher,
  Aircraft,
  Vouchers,
  SatelliteOrderInformation,
  DeviceHealth,
  DeviceHealthActivities,
  IFCServiceMetrics,
  SatelliteBlacklistDomains,
]);
