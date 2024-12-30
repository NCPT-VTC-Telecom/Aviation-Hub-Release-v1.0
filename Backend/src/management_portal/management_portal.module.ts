import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppService } from "../app.service";

import { VerifyLoginMiddleware } from "./middleware/verify_user.middleware";
import { ManagementPortalControllers, ManagementPortalImports } from "./management_portal.config";

import { LoggerService } from "./common/logger_service/providers/log_service/log_service.service";

@Module({
  imports: [...ManagementPortalImports],
  controllers: [...ManagementPortalControllers],
  providers: [AppService, VerifyLoginMiddleware, LoggerService],
})
export class ManagementPortalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/auth_management/verify_login", method: RequestMethod.ALL });
  }
}
