import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LoggerModule } from "src/management_portal/common/logger_service/modules/logger_service.module";
import { ServiceVoucherEntity } from "../config/import.config";
import { ServiceVoucherManagementController } from "../controllers/service_vouchers.controller";
import { ServiceVoucherProvider } from "../config/provider.config";
import { VerifyVendorMiddleware } from "src/management_callback/middleware/verify_vendor.middleware";

@Module({
  imports: [ServiceVoucherEntity, LoggerModule, HttpModule],
  controllers: [ServiceVoucherManagementController],
  providers: [...ServiceVoucherProvider],
  exports: [...ServiceVoucherProvider],
})
export class ServiceVoucherModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyVendorMiddleware).forRoutes({ path: "/v1/service_vouchers/*", method: RequestMethod.ALL });
  }
}
