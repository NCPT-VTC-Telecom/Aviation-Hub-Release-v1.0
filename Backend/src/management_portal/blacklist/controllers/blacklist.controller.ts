import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";
import { BlackListRequestData, BlackListResponseWthData, BlackListResponseWthMessage } from "../interface/blacklist_common.interface";
import { BlackListDomainsService } from "../providers/blacklist_domain.service";
import { BlackListCategoryService } from "../providers/blacklist_categories.service";
import { BlackListDevicesService } from "../providers/blacklist_devices.service";
import { BlackListManagementDto } from "../dto/blacklist_common.dto";
import { BodyBlackListDomainDto, QueryBlackListDomainDto } from "../dto/blacklist_domain.dto";
import { BlackListDomainSyncRequestData, QueryHandleBlackListDomain } from "../interface/blacklist_domain.interface";
import { BlackListDeviceSyncRequestData } from "../interface/blacklist_devices.interface";
import { BodyBlackListDeviceDto, QueryBlackListDevicesDto } from "../dto/blacklist_devices.dto";
import { BlackListCategorySyncRequestData, QueryHandleBlackListCategory } from "../interface/blacklist_categories.interface";
import { BodyBlackListCategoryDto, QueryBlackListCategoryDto } from "../dto/blacklist_categories.dto";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/blacklist_management")
@ApiTags("API quản lý danh sách đen")
export class BlackListManagmentController {
  constructor(
    private readonly blackListDomainsService: BlackListDomainsService,
    private readonly blackListDevicesService: BlackListDevicesService,
    private readonly blackListCategoryService: BlackListCategoryService,
    private readonly responseSystemService: ResponseSystemService,
    private readonly logger: LoggerService
  ) {}

  @Get("/data_blacklist")
  @ApiOperation({ summary: "Lấy thông tin blacklist" })
  @ApiBearerAuth()
  @ApiQuery({ type: BlackListManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  async getDataDevice(@Query() filterBlackList: BlackListRequestData, @Req() req: any, @Res() res: any): Promise<BlackListResponseWthData> {
    const page = filterBlackList.page || 0;
    const pageSize = filterBlackList.pageSize || 10;
    const filters = filterBlackList.filters || "";
    const type = filterBlackList.type || null;
    try {
      switch (type) {
        case "domain": {
          const blacklistDomain = await this.blackListDomainsService.findBlackListDomains(page, pageSize, filters);
          if (blacklistDomain.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
          } else {
            this.logger.log(responseMessage.success);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...blacklistDomain.data], total: blacklistDomain.total, totalPages: blacklistDomain.totalPages });
          }
        }
        case "category": {
          const blackListCategory = await this.blackListCategoryService.findBlackListCategory(page, pageSize, filters);
          if (blackListCategory.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
          } else {
            this.logger.log(responseMessage.success);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...blackListCategory.data], total: blackListCategory.total, totalPages: blackListCategory.totalPages });
          }
        }
        case "devices": {
          const blacklistDevices = await this.blackListDevicesService.findBlackListDevices(page, pageSize, filters);
          if (blacklistDevices.data.length == 0) {
            this.logger.log(responseMessage.notFound);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
          } else {
            this.logger.log(responseMessage.success);
            return res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...blacklistDevices.data], total: blacklistDevices.total, totalPages: blacklistDevices.totalPages });
          }
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("data_blacklist", req, res, "blacklist_devices, category, domain");
          return { code: -2, message: responseMessage.badRequest };
        }
      }
    } catch (error) {
      this.logger.error("Error in /data_blacklist:", error);
      console.error("data_blacklist", error);
      await this.responseSystemService.saveAuditLog("data_blacklist", req, "blacklist_domains/category/devices", error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_blacklist_domains")
  @ApiOperation({ summary: "Quản lý danh sách đen tên miền" })
  @ApiQuery({ type: QueryBlackListDomainDto })
  @ApiBody({ type: BodyBlackListDomainDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleBlackListDomains(@Query() queryDomain: QueryHandleBlackListDomain, @Body() dataDomain: BlackListDomainSyncRequestData, @Req() req: Request, @Res() res: any): Promise<BlackListResponseWthMessage> {
    try {
      const { id, type } = queryDomain;

      switch (type) {
        case "add": {
          const newBlackListDevice = await this.blackListDomainsService.handleAddBlackListDomains(dataDomain);
          await this.responseSystemService.saveAuditLog("add_domain", req, "blacklist_domains", newBlackListDevice);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        case "edit": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("edit_blacklist_domains", req, res, "blacklist_domains");
          }
          const updatedBlackListDevice = await this.blackListDomainsService.handleEditBlackListDomains(id, dataDomain);
          await this.responseSystemService.saveAuditLog("edit_domain", req, "blacklist_domains", updatedBlackListDevice);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedBlackListDevice });
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("delete_blacklist_domains", req, res, "blacklist_domains");
          }
          const deleteBlacklistDomain = await this.blackListDomainsService.handleDeleteBlackListDomains(id);
          await this.responseSystemService.saveAuditLog("delete_domain", req, "blacklist_domains", deleteBlacklistDomain);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_blacklist_domains", req, res, "blacklist_domains");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_blacklist_domains:", error);
      console.error("handle_blacklist_domains", error);
      await this.responseSystemService.saveAuditLog("handle_blacklist_domains", req, "blacklist_domains", error, false);
      await this.responseSystemService.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Post("/handle_blacklist_devices")
  @ApiOperation({ summary: "Quản lý danh sách đen thiết bị" })
  @ApiQuery({ type: QueryBlackListDevicesDto })
  @ApiBody({ type: BodyBlackListDeviceDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleBlackListDevices(@Query() queryDevice: QueryHandleBlackListDomain, @Body() dataDevice: BlackListDeviceSyncRequestData, @Req() req: Request, @Res() res: any): Promise<BlackListResponseWthMessage> {
    try {
      const { id, type } = queryDevice;

      switch (type) {
        case "add": {
          const newBlacklistDevice = await this.blackListDevicesService.handleAddBlackListDevices(dataDevice);
          await this.responseSystemService.saveAuditLog("add_device", req, "blacklist_devices", newBlacklistDevice);

          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        case "edit": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("handle_blacklist_devices", req, res, "blacklist_devices");
          }
          const updatedBlacklistDevice = await this.blackListDevicesService.handleEditBlackListDevices(id, dataDevice);
          await this.responseSystemService.saveAuditLog("edit_device", req, "blacklist_devices", updatedBlacklistDevice);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedBlacklistDevice });
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("handle_blacklist_devices", req, res, "blacklist_devices");
          }
          const deleteBlacklistDevice = await this.blackListDevicesService.handleDeleteBlackListDevices(id);
          await this.responseSystemService.saveAuditLog("delete_device", req, "blacklist_devices", deleteBlacklistDevice);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_blacklist_devices", req, res, "blacklist_devices");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_blacklist_devices:", error);
      console.error("handle_blacklist_devices", error);
      await this.responseSystemService.saveAuditLog("handle_blacklist_devices", req, "blacklist_devices", error, false);
      await this.responseSystemService.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Post("/handle_blacklist_category")
  @ApiOperation({ summary: "Quản lý danh sách đen tên miền" })
  @ApiQuery({ type: QueryBlackListCategoryDto })
  @ApiBody({ type: BodyBlackListCategoryDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleBlackListCategory(@Query() queryCategory: QueryHandleBlackListCategory, @Body() dataCategory: BlackListCategorySyncRequestData, @Req() req: Request, @Res() res: any): Promise<BlackListResponseWthMessage> {
    try {
      const { id, type } = queryCategory;
      switch (type) {
        case "add": {
          const newBlackListCategory = await this.blackListCategoryService.handleAddBlackListCategory(dataCategory);
          await this.responseSystemService.saveAuditLog("add_category", req, "blacklist_category", newBlackListCategory);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        case "edit": {
          if (!id) {
            return this.responseSystemService.respondWithBadRequest("handle_blacklist_category", req, res, "blacklist_category");
          }
          const updatedBlacklistCategory = await this.blackListCategoryService.handleEditBlackListCategory(id, dataCategory);
          await this.responseSystemService.saveAuditLog("edit_category", req, "blacklist_category", updatedBlacklistCategory);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedBlacklistCategory });
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("handle_blacklist_category", req, res, "blacklist_category");
          }
          const deleteBlacklistCategory = await this.blackListCategoryService.handleDeleteBlackListCategory(id);
          await this.responseSystemService.saveAuditLog("delete_category", req, "blacklist_category", deleteBlacklistCategory);
          this.logger.log(responseMessage.success);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_blacklist_category", req, res, "blacklist_category");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_blacklist_category:", error);
      console.error("handle_blacklist_category", error);
      await this.responseSystemService.saveAuditLog("handle_blacklist_category", req, "blacklist_category", error, false);
      await this.responseSystemService.handleError(res, error);

      return { code: -5, message: responseMessage.serviceError };
    }
  }
}
