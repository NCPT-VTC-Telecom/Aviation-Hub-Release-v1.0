import { Response, Request } from "express";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query } from "@nestjs/common";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { DeviceVietnamAirlineService } from "src/management_callback/vietnam_airline/providers/device.service";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { AddDeviceHealthDto, AddDeviceVNADto, DeviceInfomationVNAtDto } from "src/management_callback/vietnam_airline/dto/device.dto";
import { AddDeviceHealthRequestData, AddDeviceVNARequestData, DeviceVNARequestData } from "src/management_callback/vietnam_airline/interface/device.interface";

@Controller("/v1/vietnam_airline")
@ApiTags("API Callback nhận thông tin từ Vietnam Airline")
export class DeviceVietnamAirlineController {
  constructor(
    private readonly deviceVNAService: DeviceVietnamAirlineService,
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
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: -5,
        message: responseMessage.serviceError,
      });
    }
  }

  @Get("/get_device")
  @ApiQuery({ type: DeviceInfomationVNAtDto })
  @ApiOperation({ summary: "Lấy danh sách thiết bị đang quản lý từ VTC" })
  async getDevice(@Query() filterDevice: DeviceVNARequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterDevice.page || 0;
      const pageSize = filterDevice.pageSize || 10;
      const filters = filterDevice.filters || "";
      const device = await this.deviceVNAService.findDevices(page, pageSize, filters);
      await this.saveAuditLog(req, res, device);
      if (device.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...device.data], total: device.total, totalPages: device.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /get_device:", error);
      console.error("get_device", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Post("/import_device")
  @ApiOperation({ summary: "Thêm thiết bị mới" })
  @ApiBody({ type: AddDeviceVNADto })
  async handleAddDevice(@Body() dataDevice: AddDeviceVNARequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const importDevice = await this.deviceVNAService.handleImportDevice(dataDevice.isEdit, { data: dataDevice.data });
        this.logger.log(responseMessage.success);

        await this.saveAuditLog(req, res, importDevice);
        if (importDevice?.data.length > 0) {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: importDevice });
        } else {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
      } else {
        await this.respondWithBadRequest(req, res);
      }
    } catch (error) {
      this.logger.error("Error in /import_device:", error);
      console.error("import_device", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Post("/import_device_health")
  @ApiOperation({ summary: "Thêm trạng thái thiết bị/Update thông tin trạng thái thiết bị" })
  @ApiBody({ type: AddDeviceHealthDto })
  async handleAddDeviceHealth(@Body() dataDeviceHealth: AddDeviceHealthRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const importDeviceHealth = await this.deviceVNAService.handleImportDeviceHealth(dataDeviceHealth);
        this.logger.log(responseMessage.success);

        await this.saveAuditLog(req, res, importDeviceHealth);
        if (importDeviceHealth?.message == "Thiết bị không tồn tại") {
          res.status(HttpStatus.OK).json({ code: -1, message: responseMessage.fail, data: importDeviceHealth });
        } else {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: importDeviceHealth });
        }
      } else {
        await this.respondWithBadRequest(req, res);
      }
    } catch (error) {
      this.logger.error("Error in /import_device_health:", error);
      console.error("import_device_health", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
