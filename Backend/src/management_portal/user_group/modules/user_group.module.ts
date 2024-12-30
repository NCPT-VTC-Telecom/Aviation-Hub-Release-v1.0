import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { GroupEntity } from "../config/import.config";
import { GroupProviders } from "../config/providers.config";
import { UserGroupManagmentController } from "../controllers/user_group.controller";

@Module({
  imports: [GroupEntity],
  controllers: [UserGroupManagmentController],
  providers: [...GroupProviders],
  exports: [...GroupProviders],
})
export class UserGroupManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/user_management/*", method: RequestMethod.ALL });
  }
}
