import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { DiscountEntity } from "../config/import.config";
import { DiscountProviders } from "../config/providers.config";
import { DiscountManagementController } from "../controller/discount.controller";
@Module({
  imports: [DiscountEntity],
  controllers: [DiscountManagementController],
  providers: [...DiscountProviders],
  exports: [...DiscountProviders],
})
export class DiscountManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/discount_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
