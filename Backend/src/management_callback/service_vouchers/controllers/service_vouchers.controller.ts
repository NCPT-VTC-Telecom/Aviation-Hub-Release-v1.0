import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { RequestDataLogService } from "src/management_callback/callback_log/providers/callback_log.service";
import { VerifyVendorMiddleware } from "src/management_callback/middleware/verify_vendor.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { AddServiceVoucherDto, ChangeStatusVoucherDto, GetDataDto, QueryVoucherDto, VerifyVoucherDto } from "../dto/service_vouchers.dto";
import { ChangeStatusVoucher, GetDataList, QueryVoucher, ServiceVoucherData, VerifyVoucher } from "../interface/service_vouchers.interface";
import { ServiceVoucherService } from "../providers/service_vouchers.service";

@Controller("/v1/service_vouchers")
@ApiTags("API dùng để quản lý Voucher đối với các hệ thống được liên kết")
export class ServiceVoucherManagementController {
  constructor(
    private readonly serviceVoucherService: ServiceVoucherService,
    private readonly logger: LoggerService,
    private readonly requestDataLogService: RequestDataLogService
  ) {}

  private async respondWithBadRequest(actionType: string, req: any, res: any) {
    const dataLog = {
      tableName: "vouchers",
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
      responseMessage: responseMessage.badRequest,
      username: req.body.username,
    };

    // await this.requestDataLogService.handleSaveAuditLog(actionType, dataLog);
    await this.requestDataLogService.handleSaveAPIRequest(JSON.stringify(res.body), dataAPI);
  }

  private async saveAuditLog(actionType: string, req: any, res: any, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);

    const dataLog = {
      tableName: "vouchers",
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

  private handleError(res: any, error: any) {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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

  @Post("/add_voucher")
  @ApiOperation({ summary: "Api thêm Voucher cho các hệ thống liên kết" })
  @ApiBody({ type: AddServiceVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleAddVoucher(@Body() dataVoucher: ServiceVoucherData, @Req() req: any, @Res() res: Response): Promise<any> {
    const userId = req.vendorData.userId;
    try {
      if (Object.keys(dataVoucher).length > 0) {
        const response = await this.serviceVoucherService.addVoucher(dataVoucher, userId);
        await this.saveAuditLog("add_voucher", req, res, response);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, voucherCode: response.code });
      } else {
        await this.respondWithBadRequest("add_voucher", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in /add_voucher:", error);
      console.error("add_voucher", error);
      await this.saveAuditLog("add_voucher", req, res, error, false);
      await this.handleError(res, error);
    }
  }

  @Post("/edit_voucher")
  @ApiOperation({ summary: "Api chỉnh sửa thông tin Voucher cho các hệ thống liên kết" })
  @ApiQuery({ type: QueryVoucherDto })
  @ApiBody({ type: AddServiceVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleEditVoucher(@Query() queryVoucher: QueryVoucher, @Body() dataVoucher: ServiceVoucherData, @Req() req: any, @Res() res: Response): Promise<any> {
    const userId = req.vendorData.userId;
    try {
      if (Object.keys(dataVoucher).length > 0 && queryVoucher.id) {
        const response = await this.serviceVoucherService.editVoucher(queryVoucher, dataVoucher, userId);
        await this.saveAuditLog("edit_voucher", req, res, response);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, voucherCode: response.code });
      } else {
        await this.respondWithBadRequest("edit_voucher", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in /edit_voucher:", error);
      console.error("edit_voucher", error);
      await this.saveAuditLog("edit_voucher", req, res, error, false);
      await this.handleError(res, error);
    }
  }

  @Post("/change_status")
  @ApiOperation({ summary: "Api chỉnh sửa thông tin trạng thái Voucher cho các hệ thống liên kết" })
  @ApiQuery({ type: QueryVoucherDto })
  @ApiBody({ type: ChangeStatusVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleChangeStatusVoucher(@Query() queryVoucher: QueryVoucher, @Body() dataChangeStatus: ChangeStatusVoucher, @Req() req: any, @Res() res: Response): Promise<any> {
    const userId = req.vendorData.userId;
    try {
      if (Object.keys(dataChangeStatus).length > 0 && queryVoucher.id) {
        const response = await this.serviceVoucherService.changeStatusVoucher(queryVoucher, dataChangeStatus, userId);
        await this.saveAuditLog("change_status", req, res, response);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, voucherCode: response.code });
      } else {
        await this.respondWithBadRequest("change_status", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in /change_status:", error);
      console.error("change_status", error);
      await this.saveAuditLog("change_status", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Post("/delete_voucher")
  @ApiOperation({ summary: "Api xóa thông tin Voucher cho các hệ thống liên kết" })
  @ApiQuery({ type: QueryVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleDeleteVoucher(@Query() queryVoucher: QueryVoucher, @Req() req: any, @Res() res: Response): Promise<any> {
    const userId = req.vendorData.userId;

    try {
      if (queryVoucher.id) {
        const response = await this.serviceVoucherService.deleteVoucher(queryVoucher, userId);
        await this.saveAuditLog("delete_voucher", req, res, response);
        return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, voucherCode: response.code });
      } else {
        await this.respondWithBadRequest("delete_voucher", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in /delete_voucher:", error);
      console.error("delete_voucher", error);
      await this.saveAuditLog("delete_voucher", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Get("/list_voucher")
  @ApiOperation({ summary: "Api trả về danh sách Voucher cho các hệ thống liên kết" })
  @ApiQuery({ type: GetDataDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleGetListVoucher(@Query() filterVoucher: GetDataList, @Req() req: any, @Res() res: Response): Promise<any> {
    const page = filterVoucher.page || 0;
    const pageSize = filterVoucher.pageSize || 10;
    const filters = filterVoucher.filters || "";
    const userId = req.vendorData.userId;
    try {
      const listVoucher = await this.serviceVoucherService.getDataVoucher(page, pageSize, filters, userId);
      if (listVoucher.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [], requestId: listVoucher.requestId });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: listVoucher.data, total: listVoucher.total, totalPages: listVoucher.totalPages, requestId: listVoucher.requestId });
      }
    } catch (error) {
      this.logger.error("Error in /list_voucher:", error);
      console.error("list_voucher", error);
      await this.saveAuditLog("list_voucher", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Get("/list_product")
  @ApiOperation({ summary: "Api trả về danh sách Product đang hoạt động các bên liên kết" })
  @ApiQuery({ type: GetDataDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleGetListProduct(@Query() filterVoucher: GetDataList, @Req() req: Request, @Res() res: Response): Promise<any> {
    const page = filterVoucher.page || 0;
    const pageSize = filterVoucher.pageSize || 10;
    const filters = filterVoucher.filters || "";
    try {
      const listProduct = await this.serviceVoucherService.getDataProduct(page, pageSize, filters);
      if (listProduct.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [], requestId: listProduct.requestId });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: listProduct.data, total: listProduct.total, totalPages: listProduct.totalPages, requestId: listProduct.requestId });
      }
    } catch (error) {
      this.logger.error("Error in /list_product:", error);
      console.error("list_product", error);
      await this.saveAuditLog("list_product", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Post("/verify_voucher")
  @ApiOperation({ summary: "Api verify Voucher" })
  @ApiBody({ type: VerifyVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyVendorMiddleware)
  async handleVerifyVoucher(@Body() dataVoucher: VerifyVoucher, @Req() req: any, @Res() res: Response): Promise<any> {
    const userId = req.vendorData.userId;
    const { voucherCode, requestId } = dataVoucher;
    try {
      if (voucherCode !== null || requestId !== null) {
        const response = await this.serviceVoucherService.verifyVoucher(voucherCode, requestId, userId);
        if (response) {
          await this.saveAuditLog("verify_voucher", req, res, response);
          return res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: response });
        } else {
          await this.saveAuditLog("verify_voucher", req, res, response);
          return res.status(HttpStatus.OK).json({ code: -1, message: responseMessage.fail, data: [] });
        }
      } else {
        await this.respondWithBadRequest("verify_voucher", req, res);
        return res.status(HttpStatus.BAD_REQUEST).json({ code: -2, message: responseMessage.badRequest });
      }
    } catch (error) {
      this.logger.error("Error in /verify_voucher:", error);
      console.error("verify_voucher", error);
      await this.saveAuditLog("verify_voucher", req, res, error, false);
      await this.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }
}
