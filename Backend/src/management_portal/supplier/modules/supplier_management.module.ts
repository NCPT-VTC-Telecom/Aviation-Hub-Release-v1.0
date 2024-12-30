import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { SupplierManagmentController } from "src/management_portal/supplier/controllers/supplier.controller";
import { SupplierEntity } from "../config/import.config";
import { SupplierProviders } from "../config/providers.config";

@Module({
  imports: [SupplierEntity],
  controllers: [SupplierManagmentController],
  providers: [...SupplierProviders],
  exports: [...SupplierProviders],
})
export class SupplierManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/supplier_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
