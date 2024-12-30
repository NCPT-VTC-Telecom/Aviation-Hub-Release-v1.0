import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { ExcelService } from "src/management_portal/common/excel_service/providers/excel.service";
import { responseMessage } from "src/utils/constant";
import { Response, Request } from "express";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { DataImportExcelDto, TypeExcelDto } from "src/management_portal/common/excel_service/dto/excel.dto";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

@Controller("/v1/excel_management")
@ApiTags("API Quản lý Import và Export Excel")
export class ExcelManagementController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly logger: LoggerService,
    private readonly databaseLogService: DatabaseLogService
  ) {}

  private async respondWithBadRequest(actionType: string, req: any, res: Response) {
    const userId = req.userData ? req.userData.id : null;

    const dataLog = {
      userId,
      tableName: "flights",
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent: responseMessage.badRequest,
    };

    await this.databaseLogService.handleSaveAuditLog(actionType, dataLog);

    return res.status(HttpStatus.OK).json({
      code: -2,
      message: responseMessage.badRequest,
    });
  }

  private async saveAuditLog(actionType: string, req: any, res: Response, data: any, success: boolean = true) {
    const responseContent = success ? JSON.stringify({ code: 0, message: responseMessage.success, data }) : JSON.stringify(data);
    const userId = req.userData ? req.userData.id : null;

    const dataLog = {
      userId,
      tableName: "flights",
      requestContent: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      responseContent,
    };

    await this.databaseLogService.handleSaveAuditLog(actionType, dataLog);
  }

  private handleError(res: Response, error: any) {
    if (error.status !== 500) {
      this.logger.error(error.response.message, error);
      return res.status(HttpStatus.OK).json({
        code: error.response.code,
        message: error.response.message,
      });
    } else {
      this.logger.error(responseMessage.serviceError, error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: -5,
        message: responseMessage.serviceError,
      });
    }
  }

  @Post("/import_excel")
  @ApiOperation({ summary: "Import Excel" })
  @ApiQuery({ type: TypeExcelDto })
  @ApiBody({ type: DataImportExcelDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async importExcel(@Query() typeExcel: TypeExcelDto, @Body() dataImportExcel: DataImportExcelDto, @Req() req: Request, @Res() res: Response) {
    try {
      const type = typeExcel.type;
      const dataImport = dataImportExcel.dataImportExcel;
      if (type && dataImport.length > 0) {
        const excelImport = await this.excelService.handleImportExcel(type, dataImport);
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, type: type, data: excelImport });
      } else {
        await this.respondWithBadRequest("import_excel", req, res);
      }
    } catch (error) {
      this.logger.error("Error in /import_excel:", error);
      console.error("import_excel", error);
      await this.saveAuditLog("import_excel", req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Get("/export_excel")
  @ApiOperation({ summary: "Export Excel" })
  @ApiQuery({ type: TypeExcelDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async exportExcel(@Query() typeExcel: TypeExcelDto, @Req() req: Request, @Res() res: Response) {
    try {
      const type = typeExcel.type || null;
      const typeSupplier = typeExcel.typeSupplier || null;
      const typeProduct = typeExcel.typeProduct || null;
      const groupId = typeExcel.groupId || null;
      const exportExcel = await this.excelService.handleExportExcel(type, typeSupplier, groupId, typeProduct);
      this.logger.log(responseMessage.success);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      switch (type) {
        case "aircraft":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-may-bay.xlsx");
          break;
        case "device":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-thiet-bi.xlsx");
          break;
        case "supplier":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-nha-cung-cap.xlsx");
          break;
        case "product":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-goi-san-pham.xlsx");
          break;
        case "sale_channels":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-kenh-ban-hang.xlsx");
          break;
        case "gateway":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-cong-thanh-toan.xlsx");
          break;
        case "user":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-nguoi-dung.xlsx");
          break;
      }

      await this.saveAuditLog("export_excel", req, res, exportExcel);
      return exportExcel.getStream().pipe(res);
    } catch (error) {
      this.logger.error("Error in /export_excel:", error);
      console.error("export_excel", error);
      await this.saveAuditLog("export_excel", req, res, error, false);
      return this.handleError(res, error);
    }
  }

  @Get("/export_excel_blank")
  @ApiOperation({ summary: "Export Excel Blank" })
  @ApiQuery({ type: TypeExcelDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async exportExcelBlank(@Query() typeExcel: TypeExcelDto, @Req() req: Request, @Res() res: Response) {
    try {
      const type = typeExcel.type || null;
      const exportExcelBlank = await this.excelService.handleExportExcelBlank(type);
      this.logger.log(responseMessage.success);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      switch (type) {
        case "aircraft":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-may-bay.xlsx");
          break;
        case "device":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-thiet-bi.xlsx");
          break;
        case "supplier":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-nha-cung-cap.xlsx");
          break;
        case "product":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-goi-san-pham.xlsx");
          break;
        case "sale_channels":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-kenh-ban-hang.xlsx");
          break;
        case "gateway":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-cong-thanh-toan.xlsx");
          break;
        case "user":
          res.setHeader("Content-Disposition", "attachment; filename=thong-tin-nguoi-dung.xlsx");
          break;
      }

      await this.saveAuditLog("export_excel_blank", req, res, exportExcelBlank);
      return exportExcelBlank.getStream().pipe(res);
    } catch (error) {
      this.logger.error("Error in /export_excel_blank:", error);
      console.error("export_excel_blank", error);
      await this.saveAuditLog("export_excel_blank", req, res, error, false);
      return this.handleError(res, error);
    }
  }
}
