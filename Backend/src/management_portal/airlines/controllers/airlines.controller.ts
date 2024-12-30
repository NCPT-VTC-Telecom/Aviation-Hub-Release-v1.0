import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { AirlinesService } from "../providers/airlines.service";
import { responseMessage } from "../../../utils/constant";
import { Response, Request } from "express";
import { AirlinesReqDto, QueryAirlinesDto, ReqDataAirlinesDto } from "../dto/airlines.dto";
import { VerifyLoginMiddleware } from "../../middleware/verify_user.middleware";
import { AirlineReqData, AirlineResData, AirlinesReq } from "../interface/airlines.interface";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/airlines_management")
@ApiTags("API quản lý hãng bay")
export class AirlinesManagementController {
  constructor(
    private readonly airlinesService: AirlinesService,
    private readonly responseSystemService: ResponseSystemService,
    private readonly logger: LoggerService
  ) {}

  @Get("/data_airlines")
  @ApiOperation({ summary: "Lấy danh sách hãng bay" })
  @ApiBearerAuth()
  @ApiQuery({ type: ReqDataAirlinesDto })
  @UseGuards(VerifyLoginMiddleware)
  async getDataAirlines(@Query() filterAirlines: AirlineReqData, @Req() req: Request, @Res() res: Response): Promise<AirlineResData> {
    const page = filterAirlines.page || 0;
    const pageSize = filterAirlines.pageSize || 10;
    const filters = filterAirlines.filters || "";
    try {
      const listAirlines = await this.airlinesService.findAirlines(page, pageSize, filters);
      if (listAirlines.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...listAirlines.data], total: listAirlines.total, totalPages: listAirlines.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_airlines:", error);
      console.error("data_airlines", error);
      await this.responseSystemService.saveAuditLog("data_airlines", req, "airlines", error, false);
      await this.responseSystemService.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }

  @Post("/handle_airlines")
  @ApiOperation({ summary: "Quản lý danh sách hãng hàng không" })
  @ApiQuery({ type: QueryAirlinesDto })
  @ApiBody({ type: AirlinesReqDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAirlines(@Query() queryAirlines: QueryAirlinesDto, @Body() bodyAirlines: AirlinesReq, @Req() req: Request, @Res() res: Response): Promise<{ code: number; message: string }> {
    const { id, type } = queryAirlines;
    try {
      switch (type) {
        case "add": {
          const newAirlines = await this.airlinesService.handleAddAirlines(bodyAirlines);
          await this.responseSystemService.saveAuditLog("add_airlines", req, "airlines", newAirlines);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          const updateAirlines = await this.airlinesService.handleEditAirlines(id, bodyAirlines);
          await this.responseSystemService.saveAuditLog("edit_airlines", req, "airlines", updateAirlines);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          const deleteAirlines = await this.airlinesService.handleDeleteAirlines(id);
          await this.responseSystemService.saveAuditLog("delete_airlines", req, "airlines", deleteAirlines);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("handle_airlines", req, res, "airlines");
          return { code: -2, message: responseMessage.badRequest };
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_airlines:", error);
      console.error("handle_airlines", error);
      await this.responseSystemService.saveAuditLog("handle_airlines", req, "airlines", error, false);
      await this.responseSystemService.handleError(res, error);
      return { code: -5, message: responseMessage.serviceError };
    }
  }
}
