import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { TicketVNADto } from "src/management_callback/vietnam_airline/dto/ticket.dto";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { RequestDataLogService } from "../../callback_log/providers/callback_log.service";
import { TicketVietnamAirlineService } from "../providers/ticket.service";

@Controller("/v1/vietnam_airline")
@ApiTags("Api Callback nhận thông tin vé máy bay từ Vietnam Airline")
export class TicketVietnamAirlineController {
  constructor(
    private readonly ticketService: TicketVietnamAirlineService,
    private readonly logger: LoggerService,
    private readonly requestDataLogService: RequestDataLogService
  ) {}

  private async respondWithBadRequest(req: any, res: any) {
    const dataLog = {
      requestContentType: req.headers["content-type"],
      requestData: JSON.stringify(req.body),
      requestIpAddress: req.ip,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestUserAgent: req.headers["user-agent"],
      responseContent: null,
      responseIpAddress: res.ip,
      responseStatusCode: String(200),
    };
    await this.requestDataLogService.handleAPIRequestLog(dataLog);

    return res.status(HttpStatus.OK).json({
      code: -2,
      message: responseMessage.badRequest,
    });
  }

  private async saveAuditLog(req: any, res: any, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);

    const dataLog = {
      requestContentType: req.headers["content-type"],
      requestData: JSON.stringify(req.body),
      requestIpAddress: req.ip,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestUserAgent: req.headers["user-agent"],
      responseContent: responseContent,
      responseIpAddress: res.ip,
      responseStatusCode: String(200),
    };

    await this.requestDataLogService.handleAPIRequestLog(dataLog);
  }

  private handleError(res: Response, error: any) {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return res.status(HttpStatus.OK).json({
        code: error.response.response.code,
        message: error.response.message,
      });
    } else {
      this.logger.error(responseMessage.serviceError, error);
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        code: -5,
        message: responseMessage.serviceError,
      });
    }
  }

  @Post("/validate_ticket")
  @ApiOperation({ summary: "Xác thực vé máy bay" })
  @ApiBody({ type: TicketVNADto })
  async handleValidateTicket(@Body() dataSerial: TicketVNADto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length <= 0) return await this.respondWithBadRequest(req, res);
      const validateETicket = await this.ticketService.validateTicket(dataSerial);
      await this.saveAuditLog(req, res, validateETicket);
      this.logger.log(responseMessage.success);
      return res.status(HttpStatus.OK).json(validateETicket);
    } catch (error) {
      this.logger.error("Error in /validate_ticket:", error);
      console.error("validate_ticket", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
