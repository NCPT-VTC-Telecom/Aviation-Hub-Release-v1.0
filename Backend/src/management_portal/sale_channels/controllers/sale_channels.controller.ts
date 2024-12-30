import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";
import { SalesChannelService } from "../providers/sale_channels.service";
import { DataRequestSaleChannels, SaleChannelsRequestData } from "../interface/sale_channels.interface";
import { GetSaleChannelsManagementDto, QuerySaleChannelsDto, SaleChannelsManagementDto } from "../dto/sale_channels.dto";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/sale_channels_management")
@ApiTags("API quản lý thông tin kênh bán hàng")
export class SalesChannelsManagementController {
  constructor(
    private readonly salesChannelService: SalesChannelService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_sale_channels")
  @ApiOperation({ summary: "Lấy danh sách kênh bán hàng" })
  @ApiQuery({ type: GetSaleChannelsManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async getSalesChannel(@Query() filterSalesChannel: SaleChannelsRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterSalesChannel.page || 0;
      const pageSize = filterSalesChannel.pageSize || 10;
      const filters = filterSalesChannel.filters || "";
      const salesChannel = await this.salesChannelService.findSaleChannels(page, pageSize, filters);
      if (salesChannel.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...salesChannel.data], total: salesChannel.total, totalPages: salesChannel.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_sale_channels:", error);
      console.error("data_sale_channels", error);
      await this.responseSystemService.saveAuditLog("data_sale_channels", req, "sale_channels", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_sale_channels")
  @ApiOperation({ summary: "Tương tác với kênh bán hàng" })
  @ApiQuery({ type: QuerySaleChannelsDto })
  @ApiBody({ type: SaleChannelsManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleSalesChannel(@Query() querySalesChannel: QuerySaleChannelsDto, @Body() dataSalesChannel: DataRequestSaleChannels, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id, action } = querySalesChannel;
    try {
      switch (action) {
        case "add": {
          const addSaleChannels = await this.salesChannelService.handleAddSaleChannel(dataSalesChannel);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_sale_channels", req, "sale_channels", addSaleChannels);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          const editSaleChannels = await this.salesChannelService.handleEditSaleChannels(id, dataSalesChannel);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("edit_sale_channels", req, "sale_channels", editSaleChannels);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          const deletedSaleChannels = await this.salesChannelService.handleDeleteSaleChannels(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("delete_sale_channels", req, "sale_channels", deletedSaleChannels);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_sale_channels", req, res, "sale_channels");
        }
      }
    } catch (error) {
      this.logger.error("Error in /sale_channels:", error);
      console.error("sale_channels", error);
      await this.responseSystemService.saveAuditLog("sale_channels", req, "sale_channels", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
