import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { VouchersManagementModule } from "../../vouchers/modules/vouchers_management.module";
import { CampaignEntities } from "../configs/imports.config";
import { CampaignProviders } from "../configs/providers.config";
import { CampaignController } from "../controllers/campaign.controller";

@Module({
  imports: [VouchersManagementModule, CampaignEntities],
  controllers: [CampaignController],
  providers: [...CampaignProviders],
  exports: [...CampaignProviders],
})
export class CampaignManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/campaign_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
