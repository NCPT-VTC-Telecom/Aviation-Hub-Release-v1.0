import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { BlackListEntities } from "../configs/imports.confg";
import { BlackListProviders } from "../configs/providers.config";
import { BlackListManagmentController } from "../controllers/blacklist.controller";

@Module({
  imports: [BlackListEntities],
  controllers: [BlackListManagmentController],
  providers: [...BlackListProviders],
  exports: [...BlackListProviders],
})
export class BlackListManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/blacklist_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
