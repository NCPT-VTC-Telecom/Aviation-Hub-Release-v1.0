import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { responseMessage } from "src/utils/constant";
import { DiscountInfoDto, DiscountManagementDto, QueryDiscountDto } from "../dto/discount.dto";
import { DataDiscountRequest, GetDiscountRequestData } from "../interface/discount.interface";
import { DiscountService } from "../providers/discount.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/discount_management")
@ApiTags("API quản lý mã giảm giá")
export class DiscountManagementController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_discount")
  @ApiOperation({ summary: "Lấy danh sách mã giảm giá" })
  @ApiQuery({ type: DiscountManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataDiscount(@Query() filterDiscount: GetDiscountRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterDiscount.page || 0;
      const pageSize = filterDiscount.pageSize || 10;
      const filters = filterDiscount.filters || "";
      const discount = await this.discountService.findDiscount(page, pageSize, filters);
      if (discount.data.length == 0) {
        this.logger.log(responseMessage.notFound, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...discount.data], total: discount.total, totalPages: discount.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_discount:", error);
      await this.responseSystemService.saveAuditLog("data_discount", req, "discount", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/handle_discount")
  @ApiOperation({ summary: "Tương tác với Discount" })
  @ApiQuery({ type: QueryDiscountDto })
  @ApiBody({ type: DiscountInfoDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDiscount(@Query() queryDiscount: QueryDiscountDto, @Body() dataDiscount: DataDiscountRequest, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const { id, action } = queryDiscount;
      switch (action) {
        case "add": {
          const addDiscount = await this.discountService.addDiscount(dataDiscount);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_discount", req, "discount", addDiscount);

          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "edit": {
          if (!id) {
            await this.responseSystemService.respondWithBadRequest("edit_discount", req, res, "discount");
          }
          const updatedDiscount = await this.discountService.editDiscount(id, dataDiscount);
          await this.responseSystemService.saveAuditLog("edit_discount", req, "discount", updatedDiscount);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updatedDiscount });
          return { code: 0, message: responseMessage.success };
        }
        case "delete": {
          if (!id) {
            return await this.responseSystemService.respondWithBadRequest("delete_discount", req, res, "discount");
          }
          const deleteDiscount = await this.discountService.deleteDiscount(id);
          await this.responseSystemService.saveAuditLog("delete_discount", req, "discount", deleteDiscount);
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("handle_discount", req, res, "discount");
        }
      }
    } catch (error) {
      this.logger.error("Error in /handle_discount:", error);
      console.error("handle_discount", error);
      await this.responseSystemService.saveAuditLog("handle_discount", req, "discount", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
