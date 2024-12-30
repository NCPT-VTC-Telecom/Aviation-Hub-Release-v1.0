import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { ListVoucherDto, QueryVoucherDto, VoucherInfoDto, VouchersManagementDto } from "src/management_portal/vouchers/dto/vouchers.dto";
import { AddMultiVoucher, VoucherInfoData, VouchersRequestData } from "src/management_portal/vouchers/interface/vouchers.interface";
import { VouchersService } from "src/management_portal/vouchers/providers/vouchers.service";
import { responseMessage } from "src/utils/constant";

@Controller("/v1/vouchers_management")
@ApiTags("API quản lý Vouchers")
export class VouchersManagementController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_vouchers")
  @ApiOperation({ summary: "Lấy danh sách Voucher" })
  @ApiQuery({ type: VouchersManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataVoucher(@Query() filterVouchers: VouchersRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterVouchers.page || 0;
      const pageSize = filterVouchers.pageSize || 10;
      const filters = filterVouchers.filters || "";
      const voucher = await this.vouchersService.findVoucher(page, pageSize, filters);
      if (voucher.data.length === 0) {
        this.logger.log(responseMessage.notFound, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...voucher.data], total: voucher.total, totalPages: voucher.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_vouchers:", error);
      console.error("data_vouchers", error);
      await this.responseSystemService.saveAuditLog("data_vouchers", req, "vouchers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_voucher")
  @ApiOperation({ summary: "Quản lý Voucher" })
  @ApiQuery({ type: QueryVoucherDto })
  @ApiBody({ type: VoucherInfoDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleVoucher(@Query() queryVoucher: QueryVoucherDto, @Body() dataVoucher: VoucherInfoData, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id, action } = queryVoucher;
    try {
      switch (action) {
        case "add": {
          const addVoucher = await this.vouchersService.addVoucher(dataVoucher);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_voucher", req, "vouchers", addVoucher);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          const updatedVoucher = await this.vouchersService.editVoucher(id, dataVoucher);
          await this.responseSystemService.saveAuditLog("edit_voucher", req, "vouchers", updatedVoucher);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedVoucher });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          const deleteVoucher = await this.vouchersService.deleteVoucher(id);
          await this.responseSystemService.saveAuditLog("delete_voucher", req, "vouchers", deleteVoucher);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("handle_voucher", req, res, "vouchers");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_vouchers:", error);
      console.error("handle_vouchers", error);
      await this.responseSystemService.saveAuditLog("handle_vouchers", req, "vouchers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_multi_voucher")
  @ApiOperation({ summary: "Thêm hàng loạt Voucher" })
  @ApiBody({ type: ListVoucherDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddMultiVoucher(@Body() dataVoucher: AddMultiVoucher, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Array.isArray(dataVoucher.data) && dataVoucher.data.length > 0) {
        const addMultiVoucher = await this.vouchersService.addMultiVoucher(dataVoucher);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_multi_voucher", req, "vouchers", addMultiVoucher);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_multi_voucher", req, res, "vouchers");
      }
    } catch (error) {
      this.logger.error("Error in /add_multi_voucher:", error);
      console.error("add_multi_voucher", error);
      await this.responseSystemService.saveAuditLog("add_multi_voucher", req, "vouchers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
