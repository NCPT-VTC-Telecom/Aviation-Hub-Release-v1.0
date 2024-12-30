import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { CustomerServiceManagementController } from "src/management_portal/customer_service/controllers/customer_service.controller";

import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { CustomerServiceEntity } from "../config/import.config";
import { CustomerServiceProvider } from "../config/provider.config";

@Module({
  imports: [CustomerServiceEntity],
  controllers: [CustomerServiceManagementController],
  providers: [...CustomerServiceProvider],
  exports: [...CustomerServiceProvider],
})
export class CustomerServiceManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/customer_service_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
