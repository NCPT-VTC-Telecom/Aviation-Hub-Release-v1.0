import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { TransactionService } from "../providers/transaction.service";
import { responseMessage } from "src/utils/constant";
import { Request, Response } from "express";
import { TransactionRequestData } from "src/management_portal/transactions/interface/transaction.interface";
import { GetTransactionManagementDto, EditTransactionDto, IdTransactionDto } from "src/management_portal/transactions/dto/transaction.dto";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/transaction_management")
@ApiTags("API quản lý giao dịch")
export class TransactionsManagementController {
  constructor(
    private readonly logger: LoggerService,
    private readonly transactionService: TransactionService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_transaction")
  @ApiOperation({ summary: "Lấy danh sách giao dịch" })
  @ApiQuery({ type: GetTransactionManagementDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async getDataTransaction(@Query() filterTransaction: TransactionRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterTransaction.page || 0;
      const pageSize = filterTransaction.pageSize || 10;
      const filters = filterTransaction.filters || "";
      const findTransaction = await this.transactionService.findTransaction(page, pageSize, filters);
      if (findTransaction.data.length == 0) {
        this.logger.log(responseMessage.notFound);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...findTransaction.data], total: findTransaction.total, totalPages: findTransaction.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_transaction:", error);
      console.error("data_transaction", error);
      await this.responseSystemService.saveAuditLog("data_transaction", req, "transactions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_transaction")
  @ApiOperation({ summary: "Add Transaction trong trường hợp gặp vấn đề thanh toán" })
  @ApiQuery({ type: IdTransactionDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleAddTransaction(@Query() idTransaction: IdTransactionDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idTransaction;
    try {
      if (id) {
        const createNewTransaction = await this.transactionService.handleCreateTransaction(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_transaction", req, "transactions", createNewTransaction);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_transaction", req, res, "transactions");
      }
    } catch (error) {
      this.logger.error("Error in /add_transaction:", error);
      console.error("add_transaction", error);
      await this.responseSystemService.saveAuditLog("add_transaction", req, "transactions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_transaction")
  @ApiOperation({ summary: "Chỉnh sửa giao dịch" })
  @ApiQuery({ type: IdTransactionDto })
  @ApiBody({ type: EditTransactionDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleEditTransaction(@Query() idTransaction: IdTransactionDto, @Body() dataTransaction: EditTransactionDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idTransaction;
    try {
      if (Object.keys(req.body).length > 0) {
        const editTransaction = await this.transactionService.editTransaction(id, dataTransaction);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("edit_transaction", req, "transactions", editTransaction);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_transaction", req, res, "transactions");
      }
    } catch (error) {
      this.logger.error("Error in /edit_transaction:", error);
      console.error("edit_transaction", error);
      await this.responseSystemService.saveAuditLog("edit_transaction", req, "transactions", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
