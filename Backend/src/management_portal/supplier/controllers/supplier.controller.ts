import { Response, Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query, UseGuards } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";
import { SupplierService } from "../providers/supplier.service";
import { GetSupplierManagementDto, IdSupplierDto, SupplierManagementDto } from "src/management_portal/supplier/dto/supplier.dto";
import { SupplierRequestData } from "src/management_portal/supplier/interface/supplier.interface";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/supplier_management")
@ApiTags("API quản lý nhà cung cấp dịch vụ")
export class SupplierManagmentController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_supplier")
  @ApiOperation({ summary: "Lấy thông tin cung cấp dịch vụ" })
  @ApiQuery({ type: GetSupplierManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataSupplier(@Query() filterSupplier: SupplierRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterSupplier.page || 0;
      const pageSize = filterSupplier.pageSize || 10;
      const filters = filterSupplier.filters || "";
      const type = filterSupplier.type || null;
      const suppliers = await this.supplierService.findSupplier(page, pageSize, filters, type);
      if (suppliers.data.length == 0) {
        this.logger.log(responseMessage.notFound, suppliers);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success, suppliers);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...suppliers.data], total: suppliers.total, totalPages: suppliers.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_supplier:", error);
      console.log("data_supplier", error);
      await this.responseSystemService.saveAuditLog("data_supplier", req, "suppliers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_supplier")
  @ApiOperation({ summary: "Sửa thông tin cung cấp dịch vụ" })
  @ApiQuery({ type: IdSupplierDto })
  @ApiBody({ type: SupplierManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditSupplier(@Query() idSupplier: IdSupplierDto, @Body() dataSupplier: SupplierManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idSupplier;
    try {
      if (Object.keys(req.body).length > 0) {
        const updateSupplier = await this.supplierService.handleEditSupplier(id, dataSupplier);
        await this.responseSystemService.saveAuditLog("edit_supplier", req, "suppliers", updateSupplier);
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: updateSupplier });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_supplier", req, res, "suppliers");
      }
    } catch (error) {
      this.logger.error("Error in /edit_supplier:", error);
      console.error("edit_supplier", error);

      await this.responseSystemService.saveAuditLog("edit_supplier", req, "suppliers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_supplier")
  @ApiOperation({ summary: "Thêm thông tin cung cấp dịch vụ" })
  @ApiBody({ type: SupplierManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddSupplier(@Body() dataSupplier: SupplierManagementDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const newSupplier = await this.supplierService.handleAddSupplier(dataSupplier);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_supplier", req, "suppliers", newSupplier);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_supplier", req, res, "suppliers");
      }
    } catch (error) {
      this.logger.error("Error in /add_supplier:", error);
      console.error("add_supplier", error);
      await this.responseSystemService.saveAuditLog("add_supplier", req, "suppliers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_supplier")
  @ApiOperation({ summary: "Xóa thông tin cung cấp dịch vụ" })
  @ApiQuery({ type: IdSupplierDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDeleteSupplier(@Query() idSupplier: IdSupplierDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idSupplier;
    try {
      if (id) {
        const deleteSupplier = await this.supplierService.handleDeleteSupplier(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("delete_supplier", req, "suppliers", deleteSupplier);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("delete_supplier", req, res, "suppliers");
      }
    } catch (error) {
      this.logger.error("Error in /delete_supplier:", error);
      console.error("delete_supplier", error);
      await this.responseSystemService.saveAuditLog("delete_supplier", req, "suppliers", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
