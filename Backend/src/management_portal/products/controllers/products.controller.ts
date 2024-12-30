import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { EditProductDto, GetPriceProductDto, GetProductManagementDto, DataProductReqDto, AddProductQueryDto, DeleteProductDto } from "src/management_portal/products/dto/product.dto";
import { ProductRequestData, ProductRes, ProductSyncRequestData, QueryProductData } from "src/management_portal/products/interface/product.interface";
import { responseMessage } from "src/utils/constant";
import { ProductService } from "../providers/product.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/product_management")
@ApiTags("API quản lý thông tin gói cước")
export class ProductManagmentController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_product")
  @ApiOperation({ summary: "Lấy thông tin gói cước sản phẩm" })
  @ApiQuery({ type: GetProductManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getDataProduct(@Query() filterProduct: ProductRequestData, @Req() req: Request, @Res() res: Response): Promise<ProductRes> {
    try {
      const page = filterProduct.page || 0;
      const pageSize = filterProduct.pageSize || 10;
      const filters = filterProduct.filters || "";
      const type = filterProduct.type || "";
      const productId = filterProduct.productId || null;
      switch (type) {
        case "product": {
          const products = await this.productService.findProducts(page, pageSize, filters, productId);
          if (products.data.length == 0) {
            this.logger.log(responseMessage.notFound, req.body);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...products.data], total: products.total, totalPages: products.totalPages });
            return { code: 0, message: responseMessage.success };
          }
        }
        case "ticket": {
          const productsPlaneTicket = await this.productService.findProductsPlaneTicket(page, pageSize, filters, productId);
          if (productsPlaneTicket.data.length == 0) {
            this.logger.log(responseMessage.notFound, req.body);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...productsPlaneTicket.data], total: productsPlaneTicket.total, totalPages: productsPlaneTicket.totalPages });
            return { code: 0, message: responseMessage.success };
          }
        }
        case "telecom": {
          const productsTelecom = await this.productService.findProductsTelecom(page, pageSize, filters, productId);
          if (productsTelecom.data.length == 0) {
            this.logger.log(responseMessage.notFound, req.body);
            res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
            return { code: -4, message: responseMessage.notFound };
          } else {
            this.logger.log(responseMessage.success);
            res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...productsTelecom.data], total: productsTelecom.total, totalPages: productsTelecom.totalPages });
            return { code: 0, message: responseMessage.success };
          }
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("data_products", req, res, "products");
        }
      }
    } catch (error) {
      this.logger.error("Error in /data_products:", error);
      console.error("data_products", error);
      await this.responseSystemService.saveAuditLog("data_products", req, "products", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/hist_price_product")
  @ApiOperation({ summary: "Lịch sử cập nhật giá sản phẩm" })
  @ApiQuery({ type: GetPriceProductDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleGetHistPriceProduct(@Query() priceProductQuery: GetPriceProductDto, @Req() req: Request, @Res() res: Response): Promise<ProductRes> {
    const id = priceProductQuery.id || null;
    const page = priceProductQuery.page || 0;
    const pageSize = priceProductQuery.pageSize || 10;
    try {
      if (id !== null) {
        const productPriceResponse = await this.productService.histProductPrice(id, page, pageSize);
        if (productPriceResponse.data.length === 0) {
          this.logger.log(responseMessage.notFound, req.body);
          res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...productPriceResponse.data], total: productPriceResponse.total, totalPages: productPriceResponse.totalPages });
        }
      } else {
        await this.responseSystemService.respondWithBadRequest("hist_price_product", req, res, "products");
      }
    } catch (error) {
      this.logger.error("Error in /hist_price_product:", error);
      console.error("hist_price_product", error);
      await this.responseSystemService.saveAuditLog("hist_price_product", req, "products", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_product")
  @ApiOperation({ summary: "Thêm sản phẩm mới" })
  @ApiBody({ type: DataProductReqDto })
  @ApiQuery({ type: AddProductQueryDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddProduct(@Query() queryProduct: QueryProductData, @Body() dataProduct: ProductSyncRequestData, @Req() req: Request, @Res() res: Response): Promise<ProductRes> {
    const { type } = queryProduct;
    try {
      switch (type) {
        case "product": {
          const addedProduct = await this.productService.addProduct(dataProduct);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_product", req, "products", addedProduct);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "ticket": {
          const addedProductPlaneTicket = await this.productService.addProductPlaneTicket(dataProduct);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_product", req, "products", addedProductPlaneTicket);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "telecom": {
          const addedProductTelecom = await this.productService.addProductTelecom(dataProduct);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("add_product", req, "products", addedProductTelecom);

          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("add_product", req, res, "products");
        }
      }
    } catch (error) {
      this.logger.error("Error in /add_product:", error);
      console.error("add_product", error);
      await this.responseSystemService.saveAuditLog("add_product", req, "products", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_product")
  @ApiOperation({ summary: "Chỉnh sửa sản phẩm" })
  @ApiBody({ type: DataProductReqDto })
  @ApiQuery({ type: EditProductDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditProduct(@Query() queryEditProduct: EditProductDto, @Body() dataEditProduct: ProductSyncRequestData, @Req() req: Request, @Res() res: Response): Promise<ProductRes> {
    const { id, isEditPrice, type } = queryEditProduct;
    try {
      if (!id) {
        await this.responseSystemService.respondWithBadRequest("edit_product", req, res, "products");
      }

      switch (type) {
        case "product": {
          const editProduct = await this.productService.editProduct(id, dataEditProduct, isEditPrice);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("edit_product", req, "products", editProduct);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "ticket": {
          const editProductPlaneTicket = await this.productService.editProductPlaneTicket(id, dataEditProduct);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("edit_product", req, "products", editProductPlaneTicket);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "telecom": {
          const editProductTelecom = await this.productService.editProductTelecom(id, dataEditProduct);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("edit_product", req, "products", editProductTelecom);

          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          await this.responseSystemService.respondWithBadRequest("edit_product", req, res, "products");
        }
      }
    } catch (error) {
      this.logger.error("Error in /edit_product:", error);
      console.error("edit_product", error);
      await this.responseSystemService.saveAuditLog("edit_product", req, "products", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_product")
  @ApiOperation({ summary: "Xóa thông tin sản phẩm" })
  @ApiQuery({ type: DeleteProductDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDeleteProduct(@Query() dataReqProduct: DeleteProductDto, @Req() req: Request, @Res() res: Response): Promise<ProductRes> {
    const { id, type } = dataReqProduct;
    try {
      if (!id) {
        await this.responseSystemService.respondWithBadRequest("delete_product", req, res, "products");
      }
      switch (type) {
        case "product": {
          const deleteProduct = await this.productService.deleteProduct(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("delete_product", req, "products", deleteProduct);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "ticket": {
          const deleteProductPlaneTicket = await this.productService.deleteProductPlaneTicket(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("delete_product", req, "products", deleteProductPlaneTicket);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        case "telecom": {
          const deleteProductTelecom = await this.productService.deleteProductTelecom(id);
          this.logger.log(responseMessage.success);
          await this.responseSystemService.saveAuditLog("delete_product", req, "products", deleteProductTelecom);
          res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
          return { code: 0, message: responseMessage.success };
        }
        default: {
          return await this.responseSystemService.respondWithBadRequest("delete_product", req, res, "products");
        }
      }
    } catch (error) {
      this.logger.error("Error in /delete_product:", error);
      console.error("delete_product", error);
      await this.responseSystemService.saveAuditLog("delete_product", req, "products", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
