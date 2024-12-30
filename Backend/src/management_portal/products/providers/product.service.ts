import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { OrderDetails, Orders } from "src/management_portal/orders/entity/order.entity";
import { ProductPlaneTicket, ProductPrice, ProductTelecom, Products } from "src/management_portal/products/entity/product.entity";
import { ProductSyncRequestData } from "src/management_portal/products/interface/product.interface";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(ProductPlaneTicket)
    private readonly productPlaneTicketRepository: Repository<ProductPlaneTicket>,
    @InjectRepository(ProductTelecom)
    private readonly productTelecomRepository: Repository<ProductTelecom>,
    @InjectRepository(ProductPrice)
    private readonly productPriceRepository: Repository<ProductPrice>,
    private readonly logger: LoggerService
  ) {}

  RandomNumber(): number {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return randomNumber;
  }

  async findProducts(
    page: number,
    pageSize: number,
    filters: string,
    productId: number
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      const queryBuilder = this.productRepository.createQueryBuilder("products").leftJoinAndSelect("products.price", "ProductPrice").andWhere("products.status_id != :statusId", { statusId: 13 }).orderBy("products.created_date", "DESC");

      if (productId) {
        queryBuilder.andWhere("products.id = :productId", { productId });
      }

      const subQuery = queryBuilder.subQuery().select("order_details.product_id", "product_id").addSelect("SUM(order_details.quantity)", "product_sold").from(OrderDetails, "order_details").groupBy("order_details.product_id").getQuery();
      queryBuilder.leftJoin(subQuery, "product_quantities", "product_quantities.product_id = products.id").addSelect("COALESCE(product_quantities.product_sold, 0)", "product_sold");

      const orderTotalSubQuery = queryBuilder
        .subQuery()
        .select("order_details.product_id", "product_id")
        .addSelect("SUM(orders.total)", "total")
        .from(Orders, "orders")
        .innerJoin(OrderDetails, "order_details", "orders.id = order_details.order_id")
        .groupBy("order_details.product_id")
        .where("order_details.product_id = :productId", { productId })
        .getQuery();

      queryBuilder.leftJoin(`(${orderTotalSubQuery})`, "order_totals", "order_totals.product_id = products.id").addSelect("COALESCE(order_totals.total, 0)", "total_revenue");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("products.title = :title", { title: filters })
              .orWhere("products.id = :id", { id: filters })
              .orWhere("products.total_time = :totalTime", { totalTime: +filters })
              .orWhere("products.bandwidth_upload = :bandWithUpload", { bandWithUpload: +filters })
              .orWhere("products.bandwidth_download = :bandWithDownload", { bandWithDownload: +filters })
              .orWhere("products.data_total = :dataTotal", { dataTotal: +filters })
              .orWhere("products.data_upload = :dataUpload", { dataUpload: +filters })
              .orWhere("products.data_download = :dataDownload", { dataDownload: +filters });
          })
        );
      }
      const [productListData, totalItem] = await Promise.all([
        queryBuilder
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        queryBuilder.getCount(),
      ]);
      const dataReturn = productListData.entities.map((product, index) => {
        const { product_sold, total_revenue } = productListData.raw[index];
        const mapData: any = { ...product, product_sold, total_revenue };
        return mapData;
      });

      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: dataReturn.length > 0 ? dataReturn : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async histProductPrice(id: number, page: number, pageSize: number): Promise<{ data?: unknown[]; total?: number; totalPages?: number }> {
    try {
      page = Math.max(1, page);
      const queryBuilder = this.productPriceRepository.createQueryBuilder("product_price").where("product_price.product_id = :id", { id: id }).orderBy("product_price.created_date", "DESC");

      const [productPrice, totalItem] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: productPrice.length > 0 ? productPrice : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findProductsPlaneTicket(
    page: number,
    pageSize: number,
    filters: string,
    productId: number
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      const queryBuilder = this.productPlaneTicketRepository
        .createQueryBuilder("products_plane_ticket")
        .andWhere("products_plane_ticket.status_id != :statusId", { statusId: 13 })
        .leftJoinAndSelect("products_plane_ticket.product", " product")
        .orderBy("products_plane_ticket.created_date", "DESC");

      if (productId) {
        queryBuilder.andWhere("products_plane_ticket.id = :productId", { productId });
      }

      const subQuery = queryBuilder.subQuery().select("order_details.product_id", "product_id").addSelect("SUM(order_details.quantity)", "product_sold").from(OrderDetails, "order_details").groupBy("order_details.product_id").getQuery();
      queryBuilder.leftJoin(subQuery, "product_quantities", "product_quantities.product_id = products_plane_ticket.id").addSelect("COALESCE(product_quantities.product_sold, 0)", "product_sold");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("products_plane_ticket.name LIKE :name", { name: `%${filters}%` })
              .orWhere("products_plane_ticket.ticket_plan LIKE :ticketPlan", { ticketPlan: `%${filters}%` })
              .orWhere("products_plane_ticket.sku LIKE :sku", { sku: `%${filters}%` })
              .orWhere("products_plane_ticket.product_id LIKE :productId", { productId: `%${filters}%` });
          })
        );
      }
      const [productListData, totalItem] = await Promise.all([
        queryBuilder
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        queryBuilder.getCount(),
      ]);
      const dataReturn = productListData.entities.map((product, index) => {
        const { product_sold } = productListData.raw[index];
        const mapData: any = { ...product, product_sold };
        return mapData;
      });

      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: dataReturn.length > 0 ? dataReturn : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findProductsTelecom(
    page: number,
    pageSize: number,
    filters: string,
    productId: number
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      const queryBuilder = this.productTelecomRepository.createQueryBuilder("products_telecom").andWhere("products_telecom.status_id != :statusId", { statusId: 13 }).orderBy("products_telecom.created_date", "DESC");

      if (productId) {
        queryBuilder.andWhere("products_telecom.id = :productId", { productId });
      }

      const subQuery = queryBuilder.subQuery().select("order_details.product_id", "product_id").addSelect("SUM(order_details.quantity)", "product_sold").from(OrderDetails, "order_details").groupBy("order_details.product_id").getQuery();
      queryBuilder.leftJoin(subQuery, "product_quantities", "product_quantities.product_id = products_telecom.id").addSelect("COALESCE(product_quantities.product_sold, 0)", "product_sold");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("products_telecom.name LIKE :name", { name: `%${filters}%` })
              .orWhere("products_telecom.ticket_plan LIKE :ticketPlan", { ticketPlan: `%${filters}%` })
              .orWhere("products_telecom.sku LIKE :sku", { sku: `%${filters}%` })
              .orWhere("products_telecom.product_id LIKE :productId", { productId: `%${filters}%` })
              .orWhere("products_telecom.product_type LIKE :productType", { productType: `%${filters}%` });
          })
        );
      }
      const [productListData, totalItem] = await Promise.all([
        queryBuilder
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        queryBuilder.getCount(),
      ]);
      const dataReturn = productListData.entities.map((product, index) => {
        const { product_sold } = productListData.raw[index];
        const mapData: any = { ...product, product_sold };
        return mapData;
      });

      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: dataReturn.length > 0 ? dataReturn : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async addProduct(dataProduct: ProductSyncRequestData): Promise<string> {
    const { imageLink, title, description, type, totalTime, bandwidthUpload, bandwidthDownload, dataTotal, dataUpload, dataDownload, dataPrice } = dataProduct.data;
    if (!title) {
      throw new ConflictException({ code: -1, message: responseMessage.badRequest });
    }
    const existProduct = await this.productRepository.findOne({ where: { title: title, status_id: 14 } });

    if (existProduct) {
      throw new ConflictException({ code: -1, message: "Sản phẩm wifi đã tồn tại" });
    }

    const newProduct = this.productRepository.create({
      image_link: imageLink,
      title: title,
      description: description,
      type: type,
      total_time: totalTime,
      bandwidth_upload: bandwidthUpload,
      bandwidth_download: bandwidthDownload,
      data_total: dataTotal,
      data_upload: dataUpload,
      data_download: dataDownload,
      status_id: 14,
    });
    const addProduct = await this.productRepository.save(newProduct);

    const priceProduct = this.productPriceRepository.create({
      product_id: addProduct.id,
      original_price: dataPrice.originalPrice,
      new_price: dataPrice.newPrice,
      currency: dataPrice.currency,
      start_date: dataPrice.startDate,
      end_date: dataPrice.endDate,
      status_id: 14,
      created_by: 1,
    });
    const addProductPrice = await this.productPriceRepository.save(priceProduct);

    await this.productRepository.update({ id: addProduct.id }, { price_id: addProductPrice.id });
    return responseMessage.success;
  }

  async addProductPlaneTicket(dataProduct: ProductSyncRequestData): Promise<string> {
    const { name, description, productId, ticketPlan } = dataProduct.data;

    if (!name) {
      throw new ConflictException({ code: -1, message: responseMessage.badRequest });
    }

    const existProductPlaneTicket = await this.productPlaneTicketRepository.findOne({ where: { name: name, status_id: 14 } });
    const existProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (existProductPlaneTicket) {
      throw new ConflictException({ code: -1, message: "Sản phẩm vé máy bay đã tồn tại" });
    }

    if (!existProduct) {
      throw new ConflictException({ code: -4, message: `${responseMessage.notFound} ${productId}` });
    }

    const newProduct = this.productPlaneTicketRepository.create({
      product_id: productId,
      name,
      sku: `PT-${this.RandomNumber()}`,
      ticket_plan: ticketPlan,
      description,
      status_id: 14,
    });
    await this.productPlaneTicketRepository.save(newProduct);

    return responseMessage.success;
  }

  async addProductTelecom(dataProduct: ProductSyncRequestData): Promise<string> {
    const { name, description, productType, productId, ticketPlan } = dataProduct.data;
    const existProductPlanTicket = await this.productTelecomRepository.findOne({ where: { name: name, status_id: 14 } });
    if (!name) {
      throw new ConflictException({ code: -1, message: responseMessage.badRequest });
    }
    const existProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (existProductPlanTicket) {
      throw new ConflictException({ code: -1, message: "Sản phẩm viễn thông đã tồn tại" });
    }

    if (!existProduct) {
      throw new ConflictException({ code: -4, message: `${responseMessage.notFound} ${productId}` });
    }

    const newProduct = this.productTelecomRepository.create({
      product_id: productId,
      product_type: productType,
      name,
      ticket_plan: ticketPlan,
      sku: `TC-${this.RandomNumber()}`,
      description,
      status_id: 14,
    });
    await this.productTelecomRepository.save(newProduct);

    return responseMessage.success;
  }

  async editProduct(id: number, dataProduct: ProductSyncRequestData, isEditPrice: boolean = false): Promise<string> {
    try {
      const { imageLink, title, description, totalTime, bandwidthUpload, bandwidthDownload, dataTotal, dataUpload, dataDownload, type, dataPrice } = dataProduct.data;

      if (!id) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      const existingProduct = await this.productRepository.findOne({ where: { id: id } });

      if (!existingProduct) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      // Update product
      await this.productRepository.update(id, {
        image_link: imageLink,
        title: title,
        type,
        description: description,
        total_time: totalTime,
        bandwidth_upload: bandwidthUpload,
        bandwidth_download: bandwidthDownload,
        data_total: dataTotal,
        data_upload: dataUpload,
        data_download: dataDownload,
        status_id: 14,
        modified_date: new Date(),
      });
      // Edit Price Product
      if (isEditPrice) {
        // Disable product price
        await this.productPriceRepository.update(
          { id: existingProduct.price_id },
          {
            status_id: 13,
            modified_date: new Date(),
            deleted_date: new Date(),
          }
        );

        // Update product price
        const { originalPrice, newPrice, currency, startDate, endDate, productId } = dataPrice;
        const priceProduct = this.productPriceRepository.create({
          product_id: productId,
          original_price: originalPrice,
          new_price: newPrice,
          currency,
          start_date: startDate,
          end_date: endDate,
          status_id: 14,
          created_by: 1,
        });
        const newProductPrice = await this.productPriceRepository.save(priceProduct);
        await this.productRepository.update(id, {
          price_id: newProductPrice.id,
        });
      }

      await this.productRepository.findOne({ where: { id: id } });
      return responseMessage.success;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async editProductPlaneTicket(id: number, dataProduct: ProductSyncRequestData): Promise<string> {
    const { name, description, productId } = dataProduct.data;
    const existingProduct = await this.productPlaneTicketRepository.findOne({ where: { id: id } });

    if (!existingProduct) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    // Update product
    await this.productPlaneTicketRepository.update(id, {
      name,
      description,
      product_id: productId,
      status_id: 14,
      modified_date: new Date(),
    });
    await this.productPlaneTicketRepository.findOne({ where: { id: id } });
    return responseMessage.success;
  }

  async editProductTelecom(id: number, dataProduct: ProductSyncRequestData): Promise<string> {
    try {
      const { name, description, productId, productType } = dataProduct.data;
      const existingProduct = await this.productTelecomRepository.findOne({ where: { id: id } });

      if (!existingProduct) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      // Update product
      await this.productTelecomRepository.update(id, {
        name,
        description,
        product_id: productId,
        product_type: productType,
        status_id: 14,
        modified_date: new Date(),
      });

      await this.productTelecomRepository.findOne({ where: { id: id } });
      return responseMessage.success;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteProduct(id: number): Promise<string> {
    try {
      // Check if the Product exists
      const existingProduct = await this.productRepository.findOneBy({ id, status_id: 14 });
      if (!existingProduct) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.productRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });

      await this.productPriceRepository.update(existingProduct.price_id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return responseMessage.success;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteProductPlaneTicket(id: number): Promise<string> {
    try {
      // Check if the Product exists
      const existingProduct = await this.productPlaneTicketRepository.findOneBy({ id, status_id: 14 });
      if (!existingProduct) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.productPlaneTicketRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return responseMessage.success;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteProductTelecom(id: number): Promise<string> {
    try {
      // Check if the Product exists
      const existingProduct = await this.productTelecomRepository.findOneBy({ id, status_id: 14 });
      if (!existingProduct) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.productTelecomRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return responseMessage.success;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
