import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";
import { BodyVendorRenewDto, GetVendorListManagementDto, QueryVendorDto, QueryVendorRenewDto, dataVendorDto } from "../dto/vendors.dto";
import { VendorListRequestData, VendorRequestData } from "../interface/vendors.interface";
import { VendorService } from "../providers/vendors.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/vendor_management")
@ApiTags("API quản lý thông tin cộng tác viên")
export class VendorsController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_vendor")
  @ApiOperation({ summary: "Lấy danh sách cộng tác viên" })
  @ApiQuery({ type: GetVendorListManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getUserList(@Query() filterVendors: VendorListRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterVendors.page || 0;
      const pageSize = filterVendors.pageSize || 10;
      const filters = filterVendors.filters || "";

      const vendors = await this.vendorService.findListVendor(page, pageSize, filters);
      if (vendors.data.length == 0) {
        this.logger.log(responseMessage.notFound, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...vendors.data], total: vendors.total, totalPages: vendors.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_vendor:", error);
      console.error("data_vendor", error);
      await this.responseSystemService.saveAuditLog("data_vendor", req, "user_vendor", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_vendor")
  @ApiOperation({ summary: "Quản lý thông tin cộng tác viên" })
  @ApiQuery({ type: QueryVendorDto })
  @ApiBody({ type: dataVendorDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleVendor(@Query() queryVendorDto: QueryVendorDto, @Body() vendorData: VendorRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id, action } = queryVendorDto;
    try {
      switch (action) {
        case "add": {
          const addVendor = await this.vendorService.handleAddVendor(vendorData);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_vendor", req, "user_vendor", addVendor);

          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          const editVender = await this.vendorService.handleEditVendor(id, vendorData);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("edit_vendor", req, "user_vendor", editVender);

          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          const deleteVender = await this.vendorService.handleDeleteVendor(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("delete_vendor", req, "user_vendor", deleteVender);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "change_status": {
          const deleteVender = await this.vendorService.handleChangeStatus(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("change_status", req, "user_vendor", deleteVender);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("handle_vendor", req, res, "user_vendor");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_vendor:", error);
      console.error("handle_vendor", error);
      await this.responseSystemService.saveAuditLog("handle_vendor", req, "user_vendor", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/renew_vendor")
  @ApiOperation({ summary: "Renew token cộng tác viên" })
  @ApiQuery({ type: QueryVendorRenewDto })
  @ApiBody({ type: BodyVendorRenewDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleRenew(@Query() queryVendor: QueryVendorRenewDto, @Body() dataRequest: BodyVendorRenewDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const renewVendor = await this.vendorService.handleRenewVendorDate(queryVendor, dataRequest);

      if (renewVendor.code == 0) {
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("renew_vendor", req, "user_vendor", renewVendor);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("renew_vendor", req, res, "user_vendor");
      }
    } catch (error) {
      this.logger.error("Error in /renew_vendor:", error);
      console.error("renew_vendor", error);
      await this.responseSystemService.saveAuditLog("renew_vendor", req, "user_vendor", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
