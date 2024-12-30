import { Response, Request } from "express";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Post, HttpStatus, Res, Req, Body } from "@nestjs/common";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { responseMessage } from "src/utils/constant";
import { TelecomService } from "../providers/telecom.service";
import { VerifyPhoneNumber } from "../dto/telecom.dto";
import { ErrorResponse } from "src/utils/interface/common.interface";

@Controller("/v1/telecom")
@ApiTags("API Callback nhận thông tin từ các bên viễn thông")
export class TelecomController {
  constructor(
    private readonly telecomService: TelecomService,
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

  private handleError(res: any, error: any): Promise<Response<ErrorResponse>> {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return Promise.resolve(
        res.status(HttpStatus.OK).json({
          code: error.response.code,
          message: error.response.message,
        })
      );
    } else {
      this.logger.error(responseMessage.serviceError, error);
      return Promise.resolve(
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          code: -5,
          message: responseMessage.serviceError,
        })
      );
    }
  }

  @Post("/verify_phone")
  @ApiOperation({ summary: "Xác thưc điện thoại với bên viễn thông để verify khi login" })
  @ApiBody({ type: VerifyPhoneNumber })
  async verifyPhoneNumber(@Body() dataRequest: VerifyPhoneNumber, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const verifyPhone = await this.telecomService.handleVerifyPhonenumber(dataRequest);
        await this.saveAuditLog(req, res, verifyPhone);

        if (verifyPhone == responseMessage.success) {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        } else {
          await this.respondWithBadRequest(req, res);
        }
      } else {
        await this.respondWithBadRequest(req, res);
      }
    } catch (error) {
      this.logger.error("Error in /verify_phone:", error);
      console.error("verify_phone", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
