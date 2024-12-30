import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { DeviceManagmentController } from "src/management_portal/devices/controllers/devices.controller";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { DevicesEntity } from "../config/import.config";
import { DevicesProviders } from "../config/providers.config";

@Module({
  imports: [DevicesEntity],
  controllers: [DeviceManagmentController],
  providers: [...DevicesProviders],
  exports: [...DevicesProviders],
})
export class DeviceManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/device_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
