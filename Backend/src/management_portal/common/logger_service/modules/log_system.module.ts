import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Status } from "src/management_portal/status/entity/status.entity";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { LogSystemService } from "src/management_portal/common/logger_service/providers/log_system/log_system.service";
import { LogSystemAdminController } from "src/management_portal/common/logger_service/controllers/log_system.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Status, UserVerifyInformation, AuditLog, LogUserActivities])],
  controllers: [LogSystemAdminController],
  providers: [VerifyLoginMiddleware, DatabaseLogService, LoggerService, LogSystemService],
  exports: [VerifyLoginMiddleware, DatabaseLogService, LoggerService, LogSystemService],
})
export class LogSystemModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/log_system/*", method: RequestMethod.ALL }); // Apply globally or specify routes as needed
  }
}
