import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { TransactionsManagementController } from "src/management_portal/transactions/controllers/trasnsaction.controller";
import { TransactionEntity } from "../config/import.config";
import { TransactionProviders } from "../config/providers.config";

@Module({
  imports: [TransactionEntity],
  controllers: [TransactionsManagementController],
  providers: [...TransactionProviders],
  exports: [...TransactionProviders],
})
export class TransactionManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/transaction_management/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
