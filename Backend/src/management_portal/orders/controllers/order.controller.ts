import { Response, Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query, UseGuards } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { CreateOrderRequestData, OrderRequestData } from "src/management_portal/orders/interface/order.interface";
import { CreateOrderDto, GetOrdersManagementDto, TotalRevenueDto } from "src/management_portal/orders/dto/order.dto";
import { OrderService } from "src/management_portal/orders/providers/order.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/order_management")
@ApiTags("API quản lý thông tin đơn hàng")
export class OrderManagmentController {
  constructor(
    private readonly logger: LoggerService,
    private readonly orderService: OrderService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_order")
  @ApiOperation({ summary: "Lấy danh sách đơn hàng" })
  @ApiQuery({ type: GetOrdersManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async getDataGateway(@Query() filterOrder: OrderRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterOrder.page || 0;
      const pageSize = filterOrder.pageSize || 10;
      const filters = filterOrder.filters || "";
      const gateways = await this.orderService.findOrder(page, pageSize, filters);
      if (gateways.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...gateways.data], total: gateways.total, totalPages: gateways.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_order:", error);
      console.error("data_order", error);
      await this.responseSystemService.saveAuditLog("data_order", req, "orders", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/create_order")
  @ApiOperation({ summary: "Tạo đơn hàng mới" })
  @ApiBody({ type: CreateOrderDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleCreateOrder(@Body() dataOrder: CreateOrderRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const createNewOrder = await this.orderService.handleCreateOrder(dataOrder);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("create_order", req, "orders", createNewOrder);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("create_order", req, res, "orders");
      }
    } catch (error) {
      this.logger.error("Error in /create_order:", error);
      console.error("create_order", error);
      await this.responseSystemService.saveAuditLog("create_order", req, "orders", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/total_revenue")
  @ApiOperation({ summary: "Lấy tổng doanh thu" })
  @ApiQuery({ type: TotalRevenueDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleTotalRevenue(@Query() filters: TotalRevenueDto, @Req() req: Request, @Res() res: Response) {
    try {
      const flightId = filters.flightId || null;
      const startDate = filters.startDate || null;
      const endDate = filters.endDate || null;

      const response = await this.orderService.totalRevenue(flightId, startDate, endDate);
      if (response?.total === 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).json(response);
      } else {
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("sum_revenue", req, "orders", response);
        res.status(HttpStatus.OK).json(response);
      }
    } catch (error) {
      this.logger.error("Error in /sum_revenue:", error);
      console.error("sum_revenue", error);
      await this.responseSystemService.saveAuditLog("sum_revenue", req, "orders", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
