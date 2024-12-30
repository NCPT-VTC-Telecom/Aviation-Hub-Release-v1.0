import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { BillingService } from "../../billings/providers/billing.service";
import { DatabaseLogService } from "../../common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { TransactionService } from "../../transactions/providers/transaction.service";
import { OrderService } from "../providers/order.service";

export const OrdersProvider = [OrderService, VerifyLoginMiddleware, LoggerService, TransactionService, BillingService, DatabaseLogService, ResponseSystemService];
