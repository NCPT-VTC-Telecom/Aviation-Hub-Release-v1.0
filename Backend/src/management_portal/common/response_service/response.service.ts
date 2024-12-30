import { HttpStatus, Injectable } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "../logger_service/providers/log_service/log_service.service";
import { DatabaseLogService } from "../log_user_activities/providers/user_activities.service";

@Injectable()
export class ResponseSystemService {
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseLogService: DatabaseLogService
  ) {}
  async handleError(res: any, error: any): Promise<any> {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return res.status(HttpStatus.OK).json({
        code: error.response.code,
        message: error.response.message,
      });
    } else {
      this.logger.error(responseMessage.serviceError, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: -5,
        message: responseMessage.serviceError,
      });
    }
  }
  async saveAuditLog(actionType: string, req: any, table: any, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);

    const dataLog = {
      actionType,
      tableName: table,
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent,
    };

    await this.databaseLogService.handleSaveAuditLog(actionType, dataLog);
  }

  async respondWithBadRequest(actionType: string, req: any, res: any, table: any) {
    const userId = req.userData ? req.userData.id : null;

    const dataLog = {
      userId,
      tableName: table,
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent: JSON.stringify(responseMessage.badRequest),
    };

    await this.databaseLogService.handleSaveAuditLog(actionType, dataLog);

    return res.status(HttpStatus.OK).json({
      code: -2,
      message: responseMessage.badRequest,
    });
  }
}
