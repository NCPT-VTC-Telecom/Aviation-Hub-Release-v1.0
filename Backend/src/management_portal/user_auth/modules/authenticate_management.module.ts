import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { AuthenticateManagementController } from "src/management_portal/user_auth/controllers/authenticate_management.controller";
import { AuthEntity } from "../config/import.config";
import { AuthProviders } from "../config/providers.config";

@Module({
  imports: [AuthEntity],
  controllers: [AuthenticateManagementController],
  providers: [...AuthProviders],
  exports: [...AuthProviders],
})
export class AuthManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/verify_login", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
