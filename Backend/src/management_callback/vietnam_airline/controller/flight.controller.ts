import { Response, Request } from "express";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query } from "@nestjs/common";
import { FlightVietnamAirlineService } from "src/management_callback/vietnam_airline/providers/flight.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { AircraftRequestImportData, FlightRequestImportData } from "src/management_callback/vietnam_airline/interface/flight.interface";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { AircraftRequestImportDto, AircraftVNADto, FlightVNADto } from "src/management_callback/vietnam_airline/dto/flight.dto";

@Controller("/v1/vietnam_airline")
@ApiTags("API Callback nhận thông tin từ Vietnam Airline")
export class FlightVietnamAirlineController {
  constructor(
    private readonly flightService: FlightVietnamAirlineService,
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

  @Get("/data_aircraft")
  @ApiOperation({ summary: "Lấy thông tin máy bay" })
  @ApiQuery({ type: AircraftVNADto })
  async getAircraft(@Query() filterAirCraft: AircraftVNADto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const page = filterAirCraft.page || 0;
    const pageSize = filterAirCraft.pageSize || 10;
    const filters = filterAirCraft.filters || "";
    try {
      const aircraft = await this.flightService.findAirCraft(page, pageSize, filters);
      if (aircraft.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.badRequest, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...aircraft.data], total: aircraft.total, totalPages: aircraft.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_aircraft:", error);
      console.error("data_aircraft", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Post("/import_flight")
  @ApiOperation({ summary: "Thêm chuyến mới" })
  @ApiBody({ type: FlightVNADto })
  async handleAddFlightt(@Body() dataFlight: FlightRequestImportData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const importFlight = await this.flightService.handleImportFlight(dataFlight);
        this.logger.log(responseMessage.success);

        await this.saveAuditLog(req, res, importFlight);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.respondWithBadRequest(req, res);
      }
    } catch (error) {
      this.logger.error("Error in /import_flight:", error);
      console.error("import_flight", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Post("/import_aircraft")
  @ApiOperation({ summary: "Thêm máy bay mới" })
  @ApiBody({ type: AircraftRequestImportDto })
  async handleAddAircraft(@Body() dataAircraft: AircraftRequestImportData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const importAircraft = await this.flightService.handleImportAircraft(dataAircraft.isEdit, { data: dataAircraft.data });
        this.logger.log(responseMessage.success);

        await this.saveAuditLog(req, res, importAircraft);
        if (importAircraft?.data.length > 0) {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: importAircraft });
        } else {
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
      } else {
        await this.respondWithBadRequest(req, res);
      }
    } catch (error) {
      this.logger.error("Error in /import_aircraft:", error);
      console.error("import_aircraft", error);
      await this.saveAuditLog(req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
