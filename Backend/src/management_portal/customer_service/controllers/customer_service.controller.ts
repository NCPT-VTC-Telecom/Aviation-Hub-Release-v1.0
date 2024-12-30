import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomerServiceService } from "src/management_portal/customer_service/providers/customer_service.service";
import { responseMessage } from "src/utils/constant";
import { Request, Response } from "express";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { AddCustomerServiceDto, EditCustomerServiceDto, GetCustomerServiceDto, RequestNumberDto } from "src/management_portal/customer_service/dto/customer_service.dto";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/customer_service_management")
@ApiTags("API quản lý chăm sóc khách hàng")
export class CustomerServiceManagementController {
  constructor(
    private readonly customerService: CustomerServiceService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_customer_service")
  @ApiOperation({ summary: " Lấy thông tin yêu cầu trợ giúp của khách hàng" })
  @ApiQuery({ type: GetCustomerServiceDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleGetDataCustomerService(@Query() filters: GetCustomerServiceDto, @Res() res: Response, @Req() req: Response): Promise<any> {
    try {
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const startDate = filters.startDate || null;
      const endDate = filters.endDate || null;
      const statusId = filters.statusId || null;
      const label = filters.label || null;

      const dataCustomerService = await this.customerService.getDataCustomerService(page, pageSize, startDate, endDate, statusId, label);
      if (dataCustomerService.data.length === 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...dataCustomerService.data], total: dataCustomerService.total, totalPages: dataCustomerService.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_customer_service:", error);
      await this.responseSystemService.saveAuditLog("data_customer_service", req, res, error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_customer_service")
  @ApiOperation({ summary: "Chỉnh sửa Request Customer Service" })
  @ApiQuery({ type: RequestNumberDto })
  @ApiBody({ type: EditCustomerServiceDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditCustomerService(@Query() dataRequestNumber: RequestNumberDto, @Body() dataCustomerService: EditCustomerServiceDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { requestNumber } = dataRequestNumber;
    try {
      if (typeof requestNumber !== "string")
        return res.status(HttpStatus.OK).json({
          code: -2,
          message: responseMessage.badRequest,
        });
      if (Object.keys(req.body).length > 0) {
        const updateCustomerService = await this.customerService.editCustomerService(requestNumber, dataCustomerService);
        await this.responseSystemService.saveAuditLog("edit_customer_service", req, "customer_sercvies", updateCustomerService);
        res.status(HttpStatus.OK).json({
          code: 0,
          message: responseMessage.success,
          data: updateCustomerService,
        });
      } else {
        return await this.responseSystemService.respondWithBadRequest("edit_customer_service", req, res, "customer_sercvies");
      }
    } catch (error) {
      this.logger.error("Error in /edit_customer_service:", error);
      console.error("edit_customer_service", error);
      await this.responseSystemService.saveAuditLog("edit_customer_service", req, "customer_sercvies", error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_customer_service")
  @ApiOperation({ summary: "Thêm request customer service" })
  @ApiBody({ type: AddCustomerServiceDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async addCustomerService(@Body() dataCustomerService: AddCustomerServiceDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const newCustomerService = await this.customerService.handleAddCustomerService(dataCustomerService);
        await this.responseSystemService.saveAuditLog("add_customer_service", req, "customer_sercvies", newCustomerService);
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).json({
          code: 0,
          message: responseMessage.success,
        });
      } else {
        return await this.responseSystemService.respondWithBadRequest("add_customer_service", req, res, "customer_sercvies");
      }
    } catch (error) {
      this.logger.error("Error in /add_customer_service:", error);
      console.error("add_customer_service", error);
      await this.responseSystemService.saveAuditLog("add_customer_service", req, "customer_sercvies", error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }
}
