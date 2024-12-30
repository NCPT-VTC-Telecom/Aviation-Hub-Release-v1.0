import { Controller, Get, HttpStatus, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetLogSystemManagementDto } from "src/management_portal/common/logger_service/entity/log_system.dto";
import { GetLogSystemRequestData } from "src/management_portal/common/logger_service/interface/log_system.interface";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { LogSystemService } from "src/management_portal/common/logger_service/providers/log_system/log_system.service";
import { responseMessage } from "src/utils/constant";

@Controller("/v1/log_system")
@ApiTags("API quản lý thông tin hệ thống")
export class LogSystemAdminController {
  constructor(
    private readonly logSystemService: LogSystemService,
    private readonly logger: LoggerService,
    private readonly databaseLogService: DatabaseLogService
  ) {}

  private async saveAuditLog(actionType: string, req: any, res: Response, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);
    const userId = req.userData ? req.userData.id : null;

    const dataLog = {
      userId,
      tableName: "audit_log",
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent,
    };

    await this.databaseLogService.handleSaveAuditLog(actionType, dataLog);
  }

  private handleError(res: any, error: any) {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return res.status(HttpStatus.OK).json({
        code: error.response.response.code,
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

  @Get("/data_system")
  @ApiOperation({ summary: "Lấy thông tin log hệ thống" })
  @ApiQuery({ type: GetLogSystemManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataProduct(@Query() filterAudits: GetLogSystemRequestData, @Req() req: Request, @Res() res: any): Promise<any> {
    try {
      const page = filterAudits.page || 0;
      const pageSize = filterAudits.pageSize || 10;
      const filters = filterAudits.filters || "";
      const fromDate = filterAudits.fromDate;
      const endDate = filterAudits.endDate;

      const auditLogData = await this.logSystemService.findAuditLog(page, pageSize, filters, fromDate, endDate);

      if (auditLogData.data.length == 0) {
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...auditLogData.data], total: auditLogData.total, totalPages: auditLogData.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_system:", error);
      console.error("data_system", error);
      await this.saveAuditLog("data_system", req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
