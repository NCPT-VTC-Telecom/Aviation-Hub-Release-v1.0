import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { CampaignService } from "../providers/campaign.service";
import { responseMessage } from "../../../utils/constant";
import { Request, Response } from "express";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { BodyCampaignDto, GetListCampaignDto, QueryCampaignDto } from "../dto/campaign.dto";
import { BodyHandleListCampaign, CampaignResponseWthData, FilterCampaignList, HandleCampaignResponse, QueryHandleListCampaign } from "../interface/campaign.interface";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/campaign_management")
@ApiTags("API quản lý chiến dịch")
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_campaign")
  @ApiOperation({ summary: "Lấy danh sách chiến dịch" })
  @ApiBearerAuth()
  @ApiQuery({ type: GetListCampaignDto })
  @UseGuards(VerifyLoginMiddleware)
  async handleGetDataCampaign(@Query() filterCampaign: FilterCampaignList, @Req() req: Request, @Res() res: Response): Promise<CampaignResponseWthData> {
    try {
      const page = filterCampaign.page || 0;
      const pageSize = filterCampaign.pageSize || 10;
      const filters = filterCampaign.filters || "";
      const campaign = await this.campaignService.findCampaign(page, pageSize, filters);
      if (campaign.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
        return { code: 0, message: responseMessage.notFound, data: [] };
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...campaign.data], total: campaign.total, totalPages: campaign.totalPages });
        return { code: 0, message: responseMessage.success, data: [...campaign.data], total: campaign.total, totalPages: campaign.totalPages };
      }
    } catch (error) {
      this.logger.error("Error in /data_campaign:", error);
      console.error("data_campaign", error);
      await this.responseSystemService.saveAuditLog("data_campaign", req, "campaigns", error, false);
      await this.responseSystemService.handleError(res, error);
      return { code: -1, message: responseMessage.serviceError, data: [] };
    }
  }

  @Post("/handle_campaign")
  @ApiOperation({ summary: "Quản lý thông tin danh sách chiến dịch" })
  @ApiQuery({ type: QueryCampaignDto })
  @ApiBody({ type: BodyCampaignDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleCampaign(@Query() queryCampaign: QueryHandleListCampaign, @Body() bodyCampaign: BodyHandleListCampaign, @Req() req: Request, @Res() res: Response): Promise<HandleCampaignResponse> {
    const { id, type } = queryCampaign;
    try {
      switch (type) {
        case "add": {
          const newCampaign = await this.campaignService.addCampaign(bodyCampaign);
          this.responseSystemService.saveAuditLog("add_campaign", req, "campaigns", newCampaign);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("edit_campaign", req, res, "campaigns");
          }
          const updatedCampaign = await this.campaignService.editCampaign(id, bodyCampaign);
          await this.responseSystemService.saveAuditLog("edit_campaign", req, "campaigns", updatedCampaign);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("delete_campaign", req, res, "campaigns");
          }
          const deleteCampaign = await this.campaignService.deleteCampaign(id);
          await this.responseSystemService.saveAuditLog("delete_campaign", req, "campaigns", deleteCampaign);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_campaign", req, res, "campaings");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_campaign:", error);
      console.error("handle_campaign", error);
      await this.responseSystemService.saveAuditLog("handle_campaign", req, "campaigns", error, false);
      await this.responseSystemService.handleError(res, error);
    }
  }
}
