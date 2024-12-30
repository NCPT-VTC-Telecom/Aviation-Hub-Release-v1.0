import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { DisconnectOnFlight, DisconnectUserDto } from "../dto/auth_radius.dto";
import { AcctRequestDataDto, AuthSatelliteDto, BodyDeviceHealth, BodyIFCViasat, BodyUpdateDevice, GetDataDto, PreAuthSatelliteDto } from "../dto/satellite.dto";
import { DataDeviceHealth, DataIFCService, DataUpdateDevice, GetDataInterface } from "../interface/satellite.interface";
import { SatelliteService } from "../providers/satellite.service";
import { ErrorResponse } from "src/utils/interface/common.interface";
// import { DatabaseLogService } from "src/management_callback/providers/user_activities.service";

@Controller("/v1/satellite")
@ApiTags("API Callback nhận thông tin từ vệ tinh")
export class SatelliteController {
  constructor(
    private readonly satelliteService: SatelliteService,
    private readonly logger: LoggerService,
    private readonly requestDataLogService: RequestDataLogService
  ) {}

  private async respondWithBadRequest(actionType: string, req: any, res: any) {
    const dataLog = {
      tableName: "users",
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent: JSON.stringify(responseMessage.badRequest),
    };

    const dataAPI = {
      requestBody: JSON.stringify(req.body),
      requestIpAddress: req.ip,
      requestHeader: JSON.stringify(req.headers),
      requestUrl: req.url,
      responseMessage: "not ok",
      username: req.body.username,
    };

    // await this.requestDataLogService.handleSaveAuditLog(actionType, dataLog);
    await this.requestDataLogService.handleSaveAPIRequest(JSON.stringify(res.body), dataAPI);
  }

  private async saveAuditLog(actionType: string, req: any, res: any, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);

    const dataLog = {
      tableName: "users",
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent,
    };

    const dataAPI = {
      requestBody: JSON.stringify(req.body),
      requestIpAddress: req.ip,
      requestHeader: JSON.stringify(req.headers),
      requestUrl: req.url,
      responseMessage: "ok",
      username: req.body.username,
    };

    // await this.requestDataLogService.handleSaveAuditLog(actionType, dataLog);
    await this.requestDataLogService.handleSaveAPIRequest(JSON.stringify(res.body), dataAPI);
  }

  private handleError(res: any, error: any): Promise<Response> {
    if (error.status !== 500) {
      this.logger.error(error.message, error);
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

  @Get("/data_IFC_service")
  @ApiOperation({ summary: "Lấy danh sách giám sát dịch vụ IFC" })
  @ApiQuery({ type: GetDataDto })
  async getDataIFCService(
    @Query() filterIFCService: GetDataInterface,
    @Req() req: any,
    @Res() res: any
  ): Promise<{
    code?: number;
    message?: string;
    data?: unknown[];
  }> {
    const page = filterIFCService.page || 0;
    const pageSize = filterIFCService.pageSize || 10;
    const filters = filterIFCService.filters || "";
    try {
      const listDataIFCService = await this.satelliteService.findIFCService(page, pageSize, filters);
      if (listDataIFCService.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...listDataIFCService.data], total: listDataIFCService.total, totalPages: listDataIFCService.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_IFC_service:", error);
      console.error("data_IFC_service", error);
      await this.saveAuditLog("data_IFC_service", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  // From Viasat
  @Post("/pre_login")
  @ApiOperation({ summary: "Xử lý tiền đang nhập trên Radius" })
  @ApiBody({ type: PreAuthSatelliteDto }) // Use type object to define the schema
  async handlePreLoginRadiusSatellite(@Body() body: PreAuthSatelliteDto, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      const user = await this.satelliteService.preValidateUser(body);
      if (user) {
        await this.saveAuditLog("pre_login_radius", req, res, body.username);
        return res.status(HttpStatus.OK).json({ message: "ok" });
      } else {
        await this.respondWithBadRequest("pre_login_radius", req, res);
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: "not ok" });
      }
    } catch (error) {
      this.logger.error("Error in pre_login_radius:", error);
      await this.saveAuditLog("pre_login_radius", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/login")
  @ApiOperation({ summary: "Đăng nhập trên Radius" })
  @ApiBody({ type: AuthSatelliteDto }) // Use type object to define the schema
  async handleLoginRadiusSatellite(@Body() body: AuthSatelliteDto, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      const user = await this.satelliteService.validateUser(body);
      if (user) {
        await this.saveAuditLog("login_radius", req, res, body.username);
        return res.status(HttpStatus.OK).json({ message: "ok" });
      } else {
        await this.respondWithBadRequest("login_radius", req, res);
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: "not ok" });
      }
    } catch (error) {
      this.logger.error("Error in login_radius:", error);
      await this.saveAuditLog("login_radius", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/accounting")
  @ApiOperation({ summary: "Thống kê session trên Radius" })
  @ApiBody({ type: AcctRequestDataDto }) // Use type object to define the schema
  async handleAccounting(@Body() dataRequest: AcctRequestDataDto, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      const session = await this.satelliteService.accountingUser(dataRequest);
      if (session.errors.length > 0 || session.stopped.length > 0) {
        this.logger.error(
          "Lỗi hoặc session bị dừng đã phát hiện",
          JSON.stringify({
            errors: session?.errors,
            stopped: session?.stopped,
          })
        );
        await this.saveAuditLog("accounting", req, res, session);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "not ok" });
      }
      if (session) {
        // Save audit log
        await this.saveAuditLog("accounting", req, res, session);

        // Return success response
        return res.status(HttpStatus.OK).json({ message: "ok" });

        // return res.status(HttpStatus.OK).json({ code: 0, message: "Thành công", data: responseSessionData });
      } else {
        // Handle bad request scenario
        await this.respondWithBadRequest("accounting", req, res);

        // Return no content response
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "not ok" });
      }
    } catch (error) {
      // Log information to the audit_log table
      this.logger.error("Error in handleAccounting:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "not ok" });
    }
  }

  @Post("/device_health")
  @ApiOperation({ summary: "API nhận thông tin trạng thái thiết bị được Viasat gửi về" })
  @ApiBody({ type: BodyDeviceHealth })
  async handleCheckDeviceStatus(@Body() dataDeviceHealth: DataDeviceHealth, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      if (Object.keys(dataDeviceHealth).length > 0) {
        const deviceStatus = await this.satelliteService.checkDeviceStatusViasat(dataDeviceHealth);
        await this.saveAuditLog("device_status", req, res, deviceStatus);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.respondWithBadRequest("device_status", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in device_status:", error);
      await this.saveAuditLog("device_status", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/check_IFC_service")
  @ApiOperation({ summary: "API nhận thông tin IFC từ Viasat" })
  @ApiBody({ type: BodyIFCViasat })
  async handleCheckIFCService(@Body() dataIFCViasat: DataIFCService, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      if (Object.keys(dataIFCViasat).length > 0) {
        const deviceTransaction = await this.satelliteService.checkDeviceStatusViasat(dataIFCViasat);
        await this.saveAuditLog("check_IFC_service", req, res, deviceTransaction);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.respondWithBadRequest("check_IFC_service", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in check_IFC_service:", error);
      await this.saveAuditLog("check_IFC_service", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/receive_config_device")
  @ApiOperation({ summary: "API nhận thông tin thiết bị cần cập nhật tới Viasat" })
  @ApiBody({ type: BodyUpdateDevice })
  async handleReceiveConfigDevice(@Body() bodyUpdateDevice: DataUpdateDevice, @Req() req: any, @Res() res: any): Promise<void> {
    try {
      if (Object.keys(bodyUpdateDevice).length > 0) {
        const receiveConfigDevice = await this.satelliteService.receiveConfigDevice(bodyUpdateDevice);
        await this.saveAuditLog("receive_config_device", req, res, receiveConfigDevice);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.respondWithBadRequest("receive_config_device", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in receive_config_device:", error);
      await this.saveAuditLog("receive_config_device", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Get("/blacklist_sync")
  @ApiOperation({ summary: "API trả về thông tin Blacklist Domain để gửi đến Viasat" })
  @ApiQuery({ type: GetDataDto })
  async handleBlackSync(@Query() queryBlacklist: GetDataInterface, @Req() req: any, @Res() res: any): Promise<void> {
    const page = queryBlacklist.page || 0;
    const pageSize = queryBlacklist.pageSize || 10;
    const filters = queryBlacklist.filters || "";
    try {
      const blackList = await this.satelliteService.handleBlacklistSync(page, pageSize, filters);
      if (blackList.data.length > 0) {
        await this.saveAuditLog("blacklist_sync", req, res, blackList);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: blackList });
      } else {
        await this.saveAuditLog("blacklist_sync", req, res, blackList);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: [] });
      }
    } catch (error) {
      this.logger.error("Error in blacklist_sync:", error);
      await this.saveAuditLog("blacklist_sync", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  // To Viasat

  @Post("/update_config_device")
  @ApiOperation({ summary: "API gửi thông tin thiết bị cần cập nhật tới Viasat" })
  @ApiBody({ type: BodyUpdateDevice })
  async handleUpdateConfigDevice(@Body() bodyUpdateDevice: DataUpdateDevice, @Req() req: any, @Res() res: any): Promise<void> {
    try {
      if (Object.keys(bodyUpdateDevice).length > 0) {
        const updateConfigDevice = await this.satelliteService.updateConfigDevice(bodyUpdateDevice);
        await this.saveAuditLog("update_config_device", req, res, updateConfigDevice);
        return res.status(HttpStatus.OK).json(updateConfigDevice);
      } else {
        await this.respondWithBadRequest("update_config_device", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in update_config_device:", error);
      await this.saveAuditLog("update_config_device", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/disconnect_user")
  @ApiOperation({ summary: "API ngắt kết nối người dùng" })
  @ApiQuery({ type: DisconnectUserDto })
  async handleDisconnectUser(@Query() queryDisconnect: DisconnectUserDto, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      const { sessionId } = queryDisconnect;
      if (sessionId) {
        const disconnectUser = await this.satelliteService.disconnectSession(sessionId);
        await this.saveAuditLog("disconnect_user", req, res, disconnectUser);
        return res.status(HttpStatus.OK).json(disconnectUser);
      } else {
        await this.respondWithBadRequest("disconnect_user", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.serviceError });
      }
    } catch (error) {
      this.logger.error("Error in disconnect_user:", error);
      await this.saveAuditLog("disconnect_user", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }

  @Post("/disconnect_on_flight")
  @ApiOperation({ summary: "API ngắt kết nối người dùng trên toàn bộ chuyến bay" })
  @ApiQuery({ type: DisconnectOnFlight })
  async handleDisconnectOnFlight(@Query() queryDisconnect: DisconnectOnFlight, @Req() req: any, @Res() res: any): Promise<any> {
    try {
      const { flightNumber } = queryDisconnect;
      if (flightNumber) {
        const disconnectFlight = await this.satelliteService.disconnectSessionOnFlight(flightNumber);
        await this.saveAuditLog("disconnect_flight", req, res, disconnectFlight);
        return res.status(HttpStatus.OK).json(disconnectFlight);
      } else {
        await this.respondWithBadRequest("disconnect_flight", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.serviceError });
      }
    } catch (error) {
      this.logger.error("Error in disconnect_flight:", error);
      await this.saveAuditLog("disconnect_flight", req, res, error, false);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
    }
  }
}
