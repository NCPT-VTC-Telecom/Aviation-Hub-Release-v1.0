import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { BillingManagementController } from "src/management_portal/billings/controllers/billing.controller";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { BillingsEntities } from "../config/import.config";
import { BillingsProviders } from "../config/provider.config";

@Module({
  imports: [BillingsEntities],
  controllers: [BillingManagementController],
  providers: [...BillingsProviders],
  exports: [...BillingsProviders],
})
export class BillingManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/billing_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
