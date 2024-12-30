import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { AddAirCraftInformationDto, AircraftMaintenanceManagementDto, AircraftManagementDto, MaintenanceScheduleAircraftDto, ModifiedAirCraftInformationDto, QueryMaintenanceAircraftDto } from "src/management_portal/flights/dto/aircraft.dto";
import { FlightManagementDto, IdFlightDto } from "src/management_portal/flights/dto/flight.dto";
import { AirCraftRequestCreateData, AirCraftRequestModifiedData, AircraftMaintenanceGet, AircraftMaintenanceRequestData, FlightRequestData } from "src/management_portal/flights/interface/flight.interface";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";
import { FlightService } from "../providers/flight.service";
import { MaintenanceAircraftService } from "../providers/maintenance_aircraft.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/flight_management")
@ApiTags("API quản lý chuyến bay")
export class FlightManagmentController {
  constructor(
    private readonly flightService: FlightService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_flight")
  @ApiOperation({ summary: "Lấy thông tin chuyến bay" })
  @ApiQuery({ type: FlightManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataFlight(@Query() filterFlight: FlightRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterFlight.page || 0;
      const pageSize = filterFlight.pageSize || 10;
      const filters = filterFlight.filters || "";
      const flights = await this.flightService.findFlights(page, pageSize, filters, filterFlight.departureTime, filterFlight.arrivalTime, filterFlight.flightPhase);
      if (flights.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.notFound, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...flights.data], total: flights.total, totalPages: flights.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_flight:", error);
      console.error("data_flight", error);
      await this.responseSystemService.saveAuditLog("data_flight", req, res, error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}

@Controller("/v1/flight_management")
@ApiTags("API quản lý máy bay")
export class AirCraftManagmentController {
  constructor(
    private readonly flightService: FlightService,
    private readonly logger: LoggerService,
    private readonly maintenanceAircraftService: MaintenanceAircraftService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_aircraft")
  @ApiOperation({ summary: "Lấy thông tin máy bay" })
  @ApiQuery({ type: AircraftManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataAircraft(@Query() filterAirCraft: AircraftManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
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
      await this.responseSystemService.saveAuditLog("data_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_aircraft")
  @ApiOperation({ summary: "Thêm máy bay mới" })
  @ApiBody({ type: AddAirCraftInformationDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddAircraft(@Body() dataAirCraft: AirCraftRequestCreateData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const addAircraft = await this.flightService.handleAddAircraft(dataAirCraft);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_aircraft", req, "aircrafts", addAircraft);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        return await this.responseSystemService.respondWithBadRequest("add_aircraft", req, res, "aircrafts");
      }
    } catch (error) {
      this.logger.error("Error in /add_aircraft:", error);
      console.error("add_aircraft", error);
      await this.responseSystemService.saveAuditLog("add_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_aircraft")
  @ApiOperation({ summary: "Chỉnh sửa thông tin máy bay" })
  @ApiQuery({ type: IdFlightDto })
  @ApiBody({ type: ModifiedAirCraftInformationDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditAircraft(@Query() idFlight: IdFlightDto, @Body() dataAirCraft: AirCraftRequestModifiedData, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idFlight;
    try {
      if (Object.keys(req.body).length > 0) {
        const updatedAircraft = await this.flightService.handleEditAircraft(id, dataAirCraft);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("edit_aircraft", req, "aircrafts", updatedAircraft);

        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedAircraft });
      } else {
        return await this.responseSystemService.respondWithBadRequest("edit_aircraft", req, res, "aircrafts");
      }
    } catch (error) {
      this.logger.error("Error in /edit_aircraft:", error);
      console.error("edit_aircraft", error);
      await this.responseSystemService.saveAuditLog("edit_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_aircraft")
  @ApiOperation({ summary: "Chỉnh sửa trạng thái máy bay" })
  @ApiQuery({ type: IdFlightDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDeleteAircraft(@Query() idFlight: IdFlightDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idFlight;
    try {
      if (id) {
        const deletedAircraft = await this.flightService.handleDeleteAircraft(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("delete_aircraft", req, "aircrafts", deletedAircraft);

        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        return await this.responseSystemService.respondWithBadRequest("delete_aircraft", req, res, "aircrafts");
      }
    } catch (error) {
      this.logger.error("Error in /delete_aircraft:", error);
      console.error("delete_aircraft", error);
      await this.responseSystemService.saveAuditLog("delete_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/data_maintenance_schedule_aircraft")
  @ApiOperation({ summary: "Lấy danh sách máy bay bảo trì và lịch sử bảo trì" })
  @ApiQuery({ type: AircraftMaintenanceManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getMaintenanceScheduleAircraft(@Query() aircraftMaintenanceRequest: AircraftMaintenanceGet, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const { type } = aircraftMaintenanceRequest;
      const page = aircraftMaintenanceRequest.page || 0;
      const pageSize = aircraftMaintenanceRequest.pageSize || 10;
      const filters = aircraftMaintenanceRequest.filters || "";
      const fromDate = aircraftMaintenanceRequest?.fromDate ? String(aircraftMaintenanceRequest?.fromDate) : "";
      const endDate = aircraftMaintenanceRequest?.endDate ? String(aircraftMaintenanceRequest?.endDate) : "";

      switch (type) {
        case "hist": {
          const maintenanceHist = await this.maintenanceAircraftService.findAircraftMaintenanceHist(page, pageSize, filters, fromDate, endDate);
          await this.responseSystemService.saveAuditLog("maintenance_aircrafts_hist", req, "aircrafts", maintenanceHist);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: maintenanceHist });
          return { code: 0, message: responseMessage.success, data: maintenanceHist };
        }
        case "list": {
          const maintenanceList = await this.maintenanceAircraftService.findAircraftMaintenance(page, pageSize, filters, fromDate, endDate);
          await this.responseSystemService.saveAuditLog("maintenance_aircrafts_hist", req, "aircrafts", maintenanceList);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: maintenanceList });
          return { code: 0, message: responseMessage.success, data: maintenanceList };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("maintenance_aircrafts_hist", req, res, "aircrafts");
        }
      }
    } catch (error) {
      this.logger.error("Error in /data_maintenance_schedule_aircraft:", error);
      console.error("data_maintenance_schedule_aircraft", error);
      await this.responseSystemService.saveAuditLog("data_maintenance_schedule_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_maintenance_aircraft")
  @ApiOperation({ summary: "Tương tác lịch bảo trì máy bay" })
  @ApiQuery({ type: QueryMaintenanceAircraftDto })
  @ApiBody({ type: MaintenanceScheduleAircraftDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleMaintenanceScheduleAircraft(@Query() queryMaintenanceAircraft: any, @Body() dataMaintenanceAircraft: AircraftMaintenanceRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const { id, action } = queryMaintenanceAircraft;
      switch (action) {
        case "add": {
          if (Object.keys(req.body).length > 0) {
            const handleAddMaintenance = await this.maintenanceAircraftService.addAircraftMaintenanceSchedule(id, dataMaintenanceAircraft);
            await this.responseSystemService.saveAuditLog("add_schedule_aircraft", req, "aircrafts", handleAddMaintenance);

            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
            return { code: 0, message: responseMessage.success };
          } else {
            return await this.responseSystemService.respondWithBadRequest("add_schedule_aircraft", req, res, "aircrafts");
          }
        }
        case "edit": {
          if (Object.keys(req.body).length > 0) {
            const handleEdditMaintenance = await this.maintenanceAircraftService.editAircraftMaintenanceSchedule(id, dataMaintenanceAircraft);
            await this.responseSystemService.saveAuditLog("edit_schedule_aircraft", req, "aircrafts", handleEdditMaintenance);
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
            return { code: 0, message: responseMessage.success };
          } else {
            return await this.responseSystemService.respondWithBadRequest("add_schedule_aircraft", req, res, "aircrafts");
          }
        }
        case "delete": {
          const handleDeleteMaintenance = await this.maintenanceAircraftService.deleteMaintenanceSchedule(id, dataMaintenanceAircraft);
          await this.responseSystemService.saveAuditLog("delete_schedule_aircraft", req, "aircrafts", handleDeleteMaintenance);

          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("delete_schedule_aircraft", req, res, "aircrafts");
        }
      }
    } catch (error) {
      this.logger.error("Error in /maintenance_schedule_aircraft:", error);
      console.error("maintenance_schedule_aircraft", error);
      await this.responseSystemService.saveAuditLog("maintenance_schedule_aircraft", req, "aircrafts", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
