import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../config/data.config";

// Entities
import { UserVerifyInformation } from "./user/entity/user.entity";
import { Status } from "./status/entity/status.entity";
import { GroupRole, UserGroup } from "./user_group/entity/user_group.entity";

// Modules
import { AuthManagementModule } from "./user_auth/modules/authenticate_management.module";
import { FlightManagementModule } from "./flights/modules/flight_management.module";
import { DeviceManagementModule } from "./devices/modules/device_management.module";
import { UserManagementModule } from "./user/modules/user_management.module";
import { SupplierManagementModule } from "./supplier/modules/supplier_management.module";
import { SessionManagementModule } from "./sessions/modules/session_management.module";
import { ProductManagementModule } from "./products/modules/product_management.module";
import { GatewayManagementModule } from "./gateways/modules/gateway_management.module";
import { SaleChannelsManagementModule } from "./sale_channels/modules/sale_channels.module";
import { OrderManagementModule } from "./orders/modules/order_management.module";
import { LoggerModule } from "./common/logger_service/modules/logger_service.module";
import { VouchersManagementModule } from "./vouchers/modules/vouchers_management.module";
import { ImportSessionModule } from "./common/tool_auto_import/modules/import_session.module";
import { BillingManagementModule } from "./billings/modules/billing_management.module";
import { UserGroupManagementModule } from "./user_group/modules/user_group.module";
import { LogSystemModule } from "./common/logger_service/modules/log_system.module";
import { TransactionManagementModule } from "./transactions/modules/transaction_management.module";
import { CustomerServiceManagementModule } from "./customer_service/modules/customer_service_management.module";
import { ExcelManagementModule } from "./common/excel_service/modules/excel_management.module";
import { VendorManagementModule } from "./vendors/modules/vendors.module";
import { DiscountManagementModule } from "./discount/module/discount.module";
import { BlackListManagementModule } from "./blacklist/modules/blacklist.module";
import { CampaignManagementModule } from "./campaign/modules/campaign.module";
import { AirlinesManagementModule } from "./airlines/module/airlines.module";
import { HearbeatModule } from "./hearbeat/modules/hearbeat.module";
import { AsyncSystemModule } from "./async_system/modules/async_system.module";

import { BillingManagementController } from "./billings/controllers/billing.controller";
import { UserGroupManagmentController } from "./user_group/controllers/user_group.controller";
import { LogSystemAdminController } from "./common/logger_service/controllers/log_system.controller";
import { TransactionsManagementController } from "./transactions/controllers/trasnsaction.controller";
import { CustomerServiceManagementController } from "./customer_service/controllers/customer_service.controller";
import { ExcelManagementController } from "./common/excel_service/controllers/excel.controller";
import { DiscountManagementController } from "./discount/controller/discount.controller";
import { BlackListManagmentController } from "./blacklist/controllers/blacklist.controller";
import { CampaignController } from "./campaign/controllers/campaign.controller";
import { AirlinesManagementController } from "./airlines/controllers/airlines.controller";
import { HearbeatController } from "./hearbeat/controllers/hearbeat.controller";
import { VouchersManagementController } from "./vouchers/controllers/vouchers.controller";
import { VendorsController } from "./vendors/controller/vendors.controller";
import { SupplierManagmentController } from "./supplier/controllers/supplier.controller";
import { ProductManagmentController } from "./products/controllers/products.controller";
import { SessionManagmentController } from "./sessions/controllers/session.controller";
import { GatewayManagmentController } from "./gateways/controllers/gateways.controller";
import { SalesChannelsManagementController } from "./sale_channels/controllers/sale_channels.controller";
import { OrderManagmentController } from "./orders/controllers/order.controller";
import { AuthenticateManagementController } from "./user_auth/controllers/authenticate_management.controller";
import { DeviceManagmentController } from "./devices/controllers/devices.controller";
import { AirCraftManagmentController, FlightManagmentController } from "./flights/controllers/flights.controller";
import { UserManagmentController } from "./user/controllers/users.controller";

// Consolidate all imports
export const ManagementPortalImports = [
  TypeOrmModule.forRoot(databaseConfig()),
  TypeOrmModule.forFeature([UserVerifyInformation, Status, GroupRole, UserGroup]),
  AuthManagementModule,
  FlightManagementModule,
  DeviceManagementModule,
  UserManagementModule,
  SupplierManagementModule,
  SessionManagementModule,
  ProductManagementModule,
  GatewayManagementModule,
  SaleChannelsManagementModule,
  OrderManagementModule,
  LoggerModule,
  VouchersManagementModule,
  ImportSessionModule,
  BillingManagementModule,
  UserGroupManagementModule,
  LogSystemModule,
  TransactionManagementModule,
  CustomerServiceManagementModule,
  ExcelManagementModule,
  VendorManagementModule,
  DiscountManagementModule,
  BlackListManagementModule,
  CampaignManagementModule,
  AirlinesManagementModule,
  HearbeatModule,
  AsyncSystemModule,
];

export const ManagementPortalControllers = [
  AuthenticateManagementController,
  FlightManagmentController,
  DeviceManagmentController,
  UserManagmentController,
  VouchersManagementController,
  VendorsController,
  AirCraftManagmentController,
  SupplierManagmentController,
  ProductManagmentController,
  SessionManagmentController,
  GatewayManagmentController,
  SalesChannelsManagementController,
  OrderManagmentController,
  BillingManagementController,
  UserGroupManagmentController,
  LogSystemAdminController,
  TransactionsManagementController,
  CustomerServiceManagementController,
  ExcelManagementController,
  DiscountManagementController,
  BlackListManagmentController,
  CampaignController,
  AirlinesManagementController,
  HearbeatController,
];
