import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { UserManagmentController } from "src/management_portal/user/controllers/users.controller";
import { UserEntity } from "../config/import.config";
import { UserProvider } from "../config/providers.config";
// import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [UserEntity],
  controllers: [UserManagmentController],
  providers: [...UserProvider],
  exports: [...UserProvider],
})
export class UserManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/user_management/*", method: RequestMethod.ALL });
  }
}
