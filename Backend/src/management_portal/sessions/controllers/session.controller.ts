import { Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { FakeRadiusDto, GetChartSessionManagementDto, GetSessionManagementDto, IdSessionDto, TotalDataSessionFlightDto, TotalSessionDetailDto } from "src/management_portal/sessions/dto/session.dto";
import { SessionChartRequestData, SessionRequestData } from "src/management_portal/sessions/interface/session.interface";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ChartDeviceService } from "src/management_portal/sessions/providers/chart_session/chart_device..service";
import { ChartOrderService } from "src/management_portal/sessions/providers/chart_session/chart_order.service";
import { ChartRoleService } from "src/management_portal/sessions/providers/chart_session/chart_role.service";
import { ChartSessionService } from "src/management_portal/sessions/providers/chart_session/chart_sessions.service";
import { SessionService } from "src/management_portal/sessions/providers/session.service";
import { responseMessage } from "src/utils/constant";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/session_management")
@ApiTags("API quản lý session")
export class SessionManagmentController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly chartSessionService: ChartSessionService,
    private readonly logger: LoggerService,
    private readonly chartOrderService: ChartOrderService,
    private readonly chartRoleService: ChartRoleService,
    private readonly chartDeviceService: ChartDeviceService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_session_detail")
  @ApiOperation({ summary: "Lấy thông tin chi tiết của session" })
  @ApiQuery({ type: GetSessionManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataSessionDetail(@Query() filterSession: SessionRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterSession.page || 0;
      const pageSize = filterSession.pageSize || 10;
      const filters = filterSession.filters || "";
      const sessions = await this.sessionService.findSessionDetails(page, pageSize, filters);
      if (sessions.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...sessions.data], total: sessions.total, totalPages: sessions.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_session_detail:", error);
      console.error("data_session_detail", error);
      await this.responseSystemService.saveAuditLog("data_session_detail", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/data_session")
  @ApiOperation({ summary: "Lấy thông tin chi tiết của session" })
  @ApiQuery({ type: GetSessionManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataSession(@Query() filterSession: GetSessionManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterSession.page || 0;
      const pageSize = filterSession.pageSize || 10;
      const filters = filterSession.filters || "";
      const startDate = filterSession.startDate || null;
      const endDate = filterSession.endDate || null;
      const productId = filterSession.productId || null;
      const sessionStatus = filterSession.sessionStatus || null;
      const userDevice = filterSession.userDevice || null;

      const sessions = await this.sessionService.findSessions(page, pageSize, filters, startDate, endDate, productId, sessionStatus, userDevice);

      if (sessions.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...sessions.data], total: sessions.total, totalPages: sessions.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_session:", error);
      console.error("data_session", error);

      await this.responseSystemService.saveAuditLog("data_session", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/chart_session")
  @ApiOperation({ summary: "Lấy thông tin các chart" })
  @ApiQuery({ type: GetChartSessionManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getChartStatistic(@Query() filterChart: SessionChartRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const sessionTypes = ["session_browser", "total_pax_data_usage_session_name", "session_devices", "total_pax_data_usage_session_name_date", "session_duration_average_date", "session_per_date"];

      const orderTypes = ["number_purchases_plan", "number_purchases_plan_date", "number_purchases_sale_channel"];

      const roleTypes = ["total_data_usage_role", "total_data_usage_role_date"];

      if (sessionTypes.includes(filterChart.type)) {
        const sessionChart = await this.chartSessionService.chartSessions(filterChart.type, filterChart.fromDate, filterChart.endDate);
        if (sessionChart?.data.length === 0) {
          this.logger.log(responseMessage.notFound, req.body);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: { ...sessionChart.data } });
        }
      } else if (orderTypes.includes(filterChart.type)) {
        // Handle the case where the type is not valid
        const orderChart = await this.chartOrderService.chartOrders(filterChart.type, filterChart.fromDate, filterChart.endDate);
        if (orderChart?.data.length === 0) {
          this.logger.log(responseMessage.notFound, req.body);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: { ...orderChart.data } });
        }
      } else if (roleTypes.includes(filterChart.type)) {
        const roleChart = await this.chartRoleService.chartRole(filterChart.type, filterChart.fromDate, filterChart.endDate);
        if (roleChart?.data.length === 0) {
          this.logger.log(responseMessage.notFound, req.body);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: { ...roleChart.data } });
        }
      } else {
        const deviceChart = await this.chartDeviceService.chartDeviceHealth(filterChart.type);
        if (deviceChart.data.length === 0) {
          this.logger.log(responseMessage.notFound, req.body);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: { ...deviceChart.data } });
        }
      }
    } catch (error) {
      this.logger.error("Error in /chart_session:", error);
      console.error("chart_session", error);
      await this.responseSystemService.saveAuditLog("chart_session", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/user_activities_session")
  @ApiOperation({ summary: "Lấy thông tin tất cả session" })
  @ApiQuery({ type: GetSessionManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getUserActivitiesSession(@Query() filterSession: SessionRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterSession.page || 0;
      const pageSize = filterSession.pageSize || 10;
      const filters = filterSession.filters || "";

      const sessions = await this.sessionService.getUserActivitiesSession(page, pageSize, filters);
      if (sessions.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...sessions.data], total: sessions.total, totalPages: sessions.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /user_activities_session:", error);
      console.error("user_activities_session", error);
      await this.responseSystemService.saveAuditLog("user_activities_session", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/terminate_session")
  @ApiOperation({ summary: "Chấm dứt session" })
  @ApiQuery({ type: IdSessionDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditAircraft(@Query() idSession: IdSessionDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idSession;
    try {
      if (id) {
        const terminatedSession = await this.sessionService.terminateSessions(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("terminate_session", req, "sessions", terminatedSession);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("terminate_session", req, res, "sessions");
      }
    } catch (error) {
      this.logger.error("Error in /terminate_session:", error);
      console.error("terminate_session", error);
      await this.responseSystemService.saveAuditLog("terminate_session", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/total_session_flight")
  @ApiOperation({ summary: "Tính tổng lượng Data những Session sử dụng cho mỗi FLight" })
  @ApiQuery({ type: TotalDataSessionFlightDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleTotalSessionFlight(@Query() filters: TotalDataSessionFlightDto, @Req() req: Request, @Res() res: Response) {
    try {
      const flightId = filters.flightId || null;
      const startDate = filters.startDate || null;
      const endDate = filters.endDate || null;
      const response = await this.sessionService.totalDataSessionFlight(flightId, startDate, endDate);
      if (response?.code === -4) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).json(response);
      } else {
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("total_session_flight", req, "sessions", response);
        res.status(HttpStatus.OK).json(response);
      }
    } catch (error) {
      this.logger.error("Error in /total_session_flight:", error);
      console.error("total_session_flight", error);
      await this.responseSystemService.saveAuditLog("total_session_flight", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/total_session_detail")
  @ApiOperation({ summary: "Tính tổng số lượng Data sử dụng của những Session Detail trong một Session" })
  @ApiQuery({ type: TotalSessionDetailDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleTotalSessionDetail(@Query() filters: TotalSessionDetailDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const { sessionId, startTime, endTime } = filters;
      if (!startTime || !endTime || !sessionId) return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      const response = await this.sessionService.totalDataSessionDetail(sessionId, startTime, endTime);
      if (response?.code === -4) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).json(response);
      } else {
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("total_session_detail", req, "sessions", response);
        res.status(HttpStatus.OK).json(response);
      }
    } catch (error) {
      this.logger.error("Error in /total_session_detail:", error);
      console.error("total_session_detail", error);
      await this.responseSystemService.saveAuditLog("total_session_detail", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/fake_radius")
  @ApiOperation({ summary: "Giả lập data Radius" })
  @ApiQuery({ type: FakeRadiusDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleFakeDataRadius(@Query() data: FakeRadiusDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const { userId, flightNumber, deviceId, macAddress, ipAddress } = data;
      if (!userId || !flightNumber || !deviceId) return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      const response = await this.sessionService.fakeDataRadius(userId, flightNumber, deviceId, ipAddress, macAddress);
      this.logger.log(responseMessage.success);
      await this.responseSystemService.saveAuditLog("fake_radius", req, "sessions", response);
      res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: response });
    } catch (error) {
      this.logger.error("Error in /fake_radius:", error);
      console.error("fake_radius", error);
      await this.responseSystemService.saveAuditLog("fake_radius", req, "sessions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
