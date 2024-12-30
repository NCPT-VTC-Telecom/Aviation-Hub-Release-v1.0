import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExcelManagementController } from "src/management_portal/common/excel_service/controllers/excel.controller";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { DeviceDetails, Devices, DeviceType } from "src/management_portal/devices/entity/devices.entity";
import { Gateways } from "src/management_portal/gateways/entity/gateway.entity";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { ProductPrice, Products } from "src/management_portal/products/entity/product.entity";
import { Status } from "src/management_portal/status/entity/status.entity";
import { Supplier } from "src/management_portal/supplier/entity/supplier.entity";
import { GroupRole, UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { AddUserInformation, UserInformation, UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { ExcelService } from "src/management_portal/common/excel_service/providers/excel.service";
import { SaleChannels } from "src/management_portal/sale_channels/entity/sale_channels.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserVerifyInformation,
      Status,
      UserGroup,
      GroupRole,
      AuditLog,
      LogUserActivities,
      Aircraft,
      Devices,
      Supplier,
      Products,
      Gateways,
      SaleChannels,
      UserInformation,
      DeviceType,
      ProductPrice,
      DeviceDetails,
      AddUserInformation,
    ]),
  ],
  controllers: [ExcelManagementController],
  providers: [ExcelService, VerifyLoginMiddleware, LoggerService, DatabaseLogService],
  exports: [ExcelService, VerifyLoginMiddleware, LoggerService, DatabaseLogService],
})
export class ExcelManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/excel_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
