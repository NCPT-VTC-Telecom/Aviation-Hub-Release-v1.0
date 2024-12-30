import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AirlinesEntities } from "../config/imports.config";
import { AirlinesManagementController } from "../controllers/airlines.controller";
import { AirlinesProviders } from "../config/providers.config";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";

@Module({
  imports: [AirlinesEntities],
  controllers: [AirlinesManagementController],
  providers: [...AirlinesProviders],
  exports: [...AirlinesProviders],
})
export class AirlinesManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/airlines_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
