import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { GatewayManagmentController } from "src/management_portal/gateways/controllers/gateways.controller";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { GatewaysEntity } from "../config/import.config";
import { GatewaysProviders } from "../config/providers.config";

@Module({
  imports: [GatewaysEntity],
  controllers: [GatewayManagmentController],
  providers: [...GatewaysProviders],
  exports: [...GatewaysProviders],
})
export class GatewayManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/gateway_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
