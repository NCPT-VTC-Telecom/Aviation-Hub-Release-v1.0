import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GetBillingDto, EditBillDto, IdBillingDto } from "src/management_portal/billings/dto/billing.dto";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { BillingService } from "src/management_portal/billings/providers/billing.service";
import { responseMessage } from "src/utils/constant";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/billing_management")
@ApiTags("API quản lý thông tin hóa đơn")
export class BillingManagementController {
  constructor(
    private readonly logger: LoggerService,
    private readonly billingService: BillingService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_billing")
  @ApiOperation({ summary: "Danh sách Bill" })
  @ApiQuery({ type: GetBillingDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async getDataBilling(@Query() filterBilling: GetBillingDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterBilling.page || 0;
      const pageSize = filterBilling.pageSize || 10;
      const filters = filterBilling.filters || "";
      const gateways = await this.billingService.findBilling(page, pageSize, filters);
      if (gateways.data.length == 0) {
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...gateways.data], total: gateways.total, totalPages: gateways.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_billing:", error);
      console.error("data_billing", error);
      await this.responseSystemService.saveAuditLog("data_billing", req, "billings", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_billing")
  @ApiOperation({ summary: "Add Bill trong trường hợp gặp vấn đề thanh toán" })
  @ApiQuery({ type: IdBillingDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleAddBilling(@Query() idBilling: IdBillingDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idBilling;
    try {
      if (id) {
        const createNewBill = await this.billingService.handleCreateBill(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_bill", req, "billings", createNewBill);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_bill", req, res, "billings");
      }
    } catch (error) {
      this.logger.error("Error in /add_bill:", error);
      console.error("add_bill", error);
      await this.responseSystemService.saveAuditLog("add_bill", req, "billings", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_billing")
  @ApiOperation({ summary: "Chỉnh sửa Bill" })
  @ApiQuery({ type: IdBillingDto })
  @ApiBody({ type: EditBillDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleEditBilling(@Query() idBilling: IdBillingDto, @Body() dataBill: EditBillDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idBilling;
    try {
      if (Object.keys(req.body).length > 0) {
        const editBilling = await this.billingService.editBilling(id, dataBill);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_bill", req, "billings", editBilling);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_bill", req, res, "billings");
      }
    } catch (error) {
      this.logger.error("Error in /edit_bill:", error);
      console.error("edit_bill", error);
      await this.responseSystemService.saveAuditLog("edit_bill", req, "billings", error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }
}
