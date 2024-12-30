import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { SessionManagmentController } from "src/management_portal/sessions/controllers/session.controller";
import { TypeOrmEntities, CacheProvider, BullQueueProvider } from "../config/imports.config";
import { SessionProviders } from "../config/providers.config";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";

@Module({
  imports: [TypeOrmEntities, CacheProvider, BullQueueProvider],
  controllers: [SessionManagmentController],
  providers: [...SessionProviders],
  exports: [...SessionProviders],
})
export class SessionManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({
      path: "/v1/session_management/*",
      method: RequestMethod.ALL,
    });
  }
}
