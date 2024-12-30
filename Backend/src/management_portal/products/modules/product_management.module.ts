import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ProductManagmentController } from "src/management_portal/products/controllers/products.controller";

import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";

import { ProductsProvider } from "../config/providers.config";
import { ProductsEntity } from "../config/import.config";

@Module({
  imports: [ProductsEntity],
  controllers: [ProductManagmentController],
  providers: [...ProductsProvider],
  exports: [...ProductsProvider],
})
export class ProductManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/product_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
