import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { VendorEntity } from "../config/import.config";
import { VendorProviders } from "../config/providers.config";
import { VendorsController } from "../controller/vendors.controller";

@Module({
  imports: [VendorEntity],
  controllers: [VendorsController],
  providers: [...VendorProviders],
  exports: [...VendorProviders],
})
export class VendorManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).exclude({ path: "/v1/vendor_management/test", method: RequestMethod.ALL }).forRoutes({ path: "/v1/vendor_management/*", method: RequestMethod.ALL });
  }
}
