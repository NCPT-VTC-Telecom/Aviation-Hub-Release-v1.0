import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { DeviceInfoDto, DeviceMaintenanceManagementDto, DeviceManagementDto, MaintenanceScheduleDto, QueryDeviceDto, QueryMaintenanceDeviceDto } from "src/management_portal/devices/dto/device.dto";
import { DataDeviceResponse, DeviceRequestData, DeviceRequestDataInfo, GetDeviceResponse, MaintenanceGetRequestData, MaintenanceSyncRequestData, QueryHandleDevice } from "src/management_portal/devices/interface/device.interface";
import { DeviceService } from "src/management_portal/devices/providers/device.service";
import { MaintenanceDeviceService } from "src/management_portal/devices/providers/maintenance_device.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";

@Controller("/v1/device_management")
@ApiTags("API quản lý thiết bị")
export class DeviceManagmentController {
  constructor(
    private readonly devicesService: DeviceService,
    private readonly logger: LoggerService,
    private readonly maintenanceDeviceService: MaintenanceDeviceService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_device")
  @ApiOperation({ summary: "Lấy thông tin thiết bị đang được quản lý" })
  @ApiBearerAuth()
  @ApiQuery({ type: DeviceManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  async getDataDevice(@Query() filterDevice: DeviceRequestData, @Req() req: any, @Res() res: Response): Promise<GetDeviceResponse> {
    const page = filterDevice.page || 0;
    const pageSize = filterDevice.pageSize || 10;
    const filters = filterDevice.filters || "";
    const supplierId = filterDevice.supplierId || null;
    const type = filterDevice.type || null;
    try {
      switch (type) {
        case "device": {
          const device = await this.devicesService.findDevices(page, pageSize, filters, supplierId);
          if (device.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound, data: [] };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...device.data], total: device.total, totalPages: device.totalPages });
            return { code: 0, message: responseMessage.success, data: device.data, total: device.total, totalPages: device.totalPages };
          }
        }
        case "device_health": {
          const deviceHealth = await this.devicesService.findHealthDevices(page, pageSize, filters);
          if (deviceHealth.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound, data: [] };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...deviceHealth.data], total: deviceHealth.total, totalPages: deviceHealth.totalPages });
            return { code: 0, message: responseMessage.success, data: deviceHealth.data, total: deviceHealth.total, totalPages: deviceHealth.totalPages };
          }
        }
        case "device_type": {
          const deviceType = await this.devicesService.findDeviceType(page, pageSize, filters);
          if (deviceType.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound, data: [] };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...deviceType.data], total: deviceType.total, totalPages: deviceType.totalPages });
            return { code: 0, message: responseMessage.success, data: deviceType.data, total: deviceType.total, totalPages: deviceType.totalPages };
          }
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("data_device", req, res, "devices");
        }
      }
    } catch (error) {
      this.logger.error("Error in /data_device:", error);
      console.error("data_device", error);
      await this.responseSystemService.saveAuditLog("data_device", req, "devices", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_device")
  @ApiOperation({ summary: "Quản lý thiết bị trên hệ thống" })
  @ApiQuery({ type: QueryDeviceDto })
  @ApiBody({ type: DeviceInfoDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDevice(@Query() queryDevice: QueryHandleDevice, @Body() dataDevice: DeviceRequestDataInfo, @Req() req: Request, @Res() res: Response): Promise<DataDeviceResponse> {
    const { id, type, typeChange, idFLight, typeChangeStatus, aircraftId } = queryDevice;
    try {
      switch (type) {
        case "add": {
          const newDevice = await this.devicesService.handleAddDevice(dataDevice);
          await this.responseSystemService.saveAuditLog("add_device", req, "devices", newDevice);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("edit_device", req, res, "devices");
          }
          const updatedDevice = await this.devicesService.handleEditDevice(id, dataDevice);
          await this.responseSystemService.saveAuditLog("edit_device", req, "devices", updatedDevice);

          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedDevice });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("delete_device", req, res, "devices");
          }
          const deleteDevice = await this.devicesService.handleDeleteDevice(id);
          await this.responseSystemService.saveAuditLog("delete_device", req, "devices", deleteDevice);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "change_status": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("change_status_device", req, res, "devices");
          }
          const statusChange = await this.devicesService.handleChangeStatusDevice(id, typeChange, idFLight, typeChangeStatus, aircraftId);
          await this.responseSystemService.saveAuditLog("change_status", req, "devices", statusChange);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_device", req, res, "devices");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_device:", error);
      console.error("handle_device", error);
      await this.responseSystemService.saveAuditLog("handle_device", req, "devices", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/data_maintenance_schedule")
  @ApiOperation({ summary: "Lấy danh sách bảo trì thiết bị và lịch sử bảo trì" })
  @ApiQuery({ type: DeviceMaintenanceManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getMaintenanceSchedule(@Query() deviceMaitenanceData: MaintenanceGetRequestData, @Req() req: Request, @Res() res: Response): Promise<DataDeviceResponse> {
    try {
      const { type } = deviceMaitenanceData;
      const page = deviceMaitenanceData.page || 0;
      const pageSize = deviceMaitenanceData.pageSize || 10;
      const filters = deviceMaitenanceData.filters || "";
      const fromDate = deviceMaitenanceData?.fromDate ? String(deviceMaitenanceData?.fromDate) : "";
      const endDate = deviceMaitenanceData?.endDate ? String(deviceMaitenanceData?.endDate) : "";

      switch (type) {
        case "hist": {
          const maintenanceHist = await this.maintenanceDeviceService.findMaintenanceHist(page, pageSize, filters, fromDate, endDate);
          await this.responseSystemService.saveAuditLog("maintenance_devices_hist", req, "maintenance_devices", maintenanceHist);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: maintenanceHist });
          return { code: 0, message: responseMessage.success, data: maintenanceHist };
        }
        case "list": {
          const maintenanceList = await this.maintenanceDeviceService.findMaintenance(page, pageSize, filters, fromDate, endDate);
          await this.responseSystemService.saveAuditLog("maintenance_devices", req, "maintenance_devices", maintenanceList);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, ata: maintenanceList });
          return { code: 0, message: responseMessage.success, data: maintenanceList };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("data_maintenance_schedule", req, res, "maintenance_devices");
        }
      }
    } catch (error) {
      this.logger.error("Error in /data_maintenance_schedule:", error);
      console.error("data_maintenance_schedule", error);
      await this.responseSystemService.saveAuditLog("data_maintenance_schedule", req, "maintenance_devices", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/maintenance_schedule")
  @ApiOperation({ summary: "Thêm lịch bảo trì của thiết bị" })
  @ApiQuery({ type: QueryMaintenanceDeviceDto })
  @ApiBody({ type: MaintenanceScheduleDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleMaintenanceSchedule(@Query() queryMaintenanceData: QueryMaintenanceDeviceDto, @Body() dataSchedule: MaintenanceSyncRequestData, @Req() req: Request, @Res() res: Response): Promise<DataDeviceResponse> {
    const { id, action } = queryMaintenanceData;
    try {
      switch (action) {
        case "add": {
          const handleAddMaintenanceSchedule = await this.maintenanceDeviceService.handleAddMaintenance(id, dataSchedule);
          await this.responseSystemService.saveAuditLog("add_maintenance_schedule", req, "maintenance_schedule", handleAddMaintenanceSchedule);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("edit_maintenance_schedule", req, res, "maintenance_schedule");
          }
          const handleEditMaintenanceSchedule = await this.maintenanceDeviceService.handleEditMaintenance(id, dataSchedule);
          await this.responseSystemService.saveAuditLog("edit_maintenance_schedule", req, "maintenance_schedule", handleEditMaintenanceSchedule);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("delete_maintenance_schedule", req, res, "maintenance_schedule");
          }
          const handleDeleteMaintenanceSchedule = await this.maintenanceDeviceService.handleDeleteMaintenance(id, dataSchedule);
          await this.responseSystemService.saveAuditLog("delete_maintenance_schedule", req, "maintenance_schedule", handleDeleteMaintenanceSchedule);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("maintenance_schedule", req, res, "maintenance_schedule");
        }
      }
    } catch (error) {
      this.logger.error("Error in /maintenance_schedule:", error);
      console.error("maintenance_schedule", error);
      await this.responseSystemService.saveAuditLog("maintenance_schedule", req, "maintenance_schedule", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
