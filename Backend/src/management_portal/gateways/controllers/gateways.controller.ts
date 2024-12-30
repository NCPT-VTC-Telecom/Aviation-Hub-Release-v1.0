import { Response, Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query, UseGuards } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";

import { GatewayService } from "src/management_portal/gateways/providers/gateway.service";
import { GatewayRequestData } from "src/management_portal/gateways/interface/gateway.interface";
import { GatewayEditManagementDto, GatewayManagementDto, GetGatewayManagementDto, IdGatewayDto } from "src/management_portal/gateways/dto/gateway.dto";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/gateway_management")
@ApiTags("API quản lý thông tin cổng thanh toán")
export class GatewayManagmentController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_gateway")
  @ApiOperation({ summary: "Lấy danh sách cổng thanh toán" })
  @ApiQuery({ type: GetGatewayManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async getDataGateway(@Query() filterGateway: GatewayRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterGateway.page || 0;
      const pageSize = filterGateway.pageSize || 10;
      const filters = filterGateway.filters || "";
      const gateways = await this.gatewayService.findGateway(page, pageSize, filters);
      if (gateways.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...gateways.data], total: gateways.total, totalPages: gateways.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_gateway:", error);
      console.error("data_gateway", error);
      await this.responseSystemService.saveAuditLog("data_gateway", req, "gateways", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_gateway")
  @ApiOperation({ summary: "Thêm cổng thanh toán mới" })
  @ApiQuery({ type: GatewayManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleAddDataGateway(@Body() dataGateway: GatewayManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const addGateway = await this.gatewayService.handleAddGateway(dataGateway);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_gateway", req, "gateways", addGateway);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_gateway", req, res, "gateways");
      }
    } catch (error) {
      this.logger.error("Error in /add_gateway:", error);
      console.error("add_gateway", error);
      await this.responseSystemService.saveAuditLog("add_gateway", req, "gateways", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_gateway")
  @ApiOperation({ summary: "Thay đổi công thanh toán" })
  @ApiQuery({ type: IdGatewayDto })
  @ApiBody({ type: GatewayEditManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleEditGateway(@Query() idGateWay: IdGatewayDto, @Body() dataGateway: GatewayEditManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idGateWay;
    try {
      if (Object.keys(req.body).length > 0) {
        const editedGateway = await this.gatewayService.handleEditGateway(id, dataGateway);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("edit_gateway", req, "gateways", editedGateway);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_gateway", req, res, "gateways");
      }
    } catch (error) {
      this.logger.error("Error in /edit_gateway:", error);
      console.error("edit_gateway", error);
      await this.responseSystemService.saveAuditLog("edit_gateway", req, "gateways", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_gateway")
  @ApiOperation({ summary: "Vô hiệu hóa cổng thanh toán" })
  @ApiQuery({ type: IdGatewayDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleDeleteGateway(@Query() idGateWay: IdGatewayDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idGateWay;
    try {
      if (id) {
        const deletedGateway = await this.gatewayService.handleDeleteGateway(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("delete_gateway", req, "gateways", deletedGateway);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("delete_gateway", req, res, "gateways");
      }
    } catch (error) {
      this.logger.error("Error in /delete_gateway:", error);
      console.error("delete_gateway", error);
      await this.responseSystemService.saveAuditLog("delete_gateway", req, "gateways", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
