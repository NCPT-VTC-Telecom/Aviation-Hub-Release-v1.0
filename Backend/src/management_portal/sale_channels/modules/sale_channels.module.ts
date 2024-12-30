import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { SalesChannelsManagementController } from "../controllers/sale_channels.controller";
import { TypeOrmSaleChannelEntities } from "../configs/imports.config";
import { SaleChannelProviders } from "../configs/providers.config";

@Module({
  imports: [TypeOrmSaleChannelEntities],
  controllers: [SalesChannelsManagementController],
  providers: [...SaleChannelProviders],
  exports: [...SaleChannelProviders],
})
export class SaleChannelsManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/sale_channels_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
