import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { VouchersManagementController } from "src/management_portal/vouchers/controllers/vouchers.controller";
import { VoucherEntity } from "../config/import.config";
import { VoucherProviders } from "../config/providers.config";
import { HttpModule } from "@nestjs/axios";
@Module({
  imports: [VoucherEntity, HttpModule],
  controllers: [VouchersManagementController],
  providers: [...VoucherProviders],
  exports: [...VoucherProviders],
})
export class VouchersManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/vouchers_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
