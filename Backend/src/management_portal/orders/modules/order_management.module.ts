import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { OrderManagmentController } from "src/management_portal/orders/controllers/order.controller";
import { OrdersEntity } from "../config/import.config";
import { OrdersProvider } from "../config/provider.config";

@Module({
  imports: [OrdersEntity],
  controllers: [OrderManagmentController],
  providers: [...OrdersProvider],
  exports: [...OrdersProvider],
})
export class OrderManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/order_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
