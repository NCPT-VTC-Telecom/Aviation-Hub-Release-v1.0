import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ChangeStatusVoucher, QueryVoucher, ServiceVoucherData, VerifyVoucher } from "../interface/service_vouchers.interface";
import { characters, responseMessage } from "src/utils/constant";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, In, Not, Repository } from "typeorm";
import { ProductVoucher, StatusInfo, VoucherInformation } from "../entity/service_vouchers.entity";
import { HttpService } from "@nestjs/axios";
import { generateBase64FromDate } from "src/utils/common";
import * as dotenv from "dotenv";
import { VendorInformation } from "src/management_portal/vendors/entity/vendors.entity";

dotenv.config();
@Injectable()
export class ServiceVoucherService {
  constructor(
    @InjectRepository(VoucherInformation)
    private readonly serviceVoucherRepository: Repository<VoucherInformation>,
    @InjectRepository(ProductVoucher)
    private readonly productRepository: Repository<ProductVoucher>,
    @InjectRepository(VendorInformation)
    private readonly vendorRepository: Repository<VendorInformation>,
    @InjectRepository(StatusInfo)
    private readonly statusRepository: Repository<StatusInfo>,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService
  ) {}

  private generateRandomString(length: number): string {
    const character = characters;
    let result = "";
    const charactersLength = character.length;

    for (let i = 0; i < length; i++) {
      result += character.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.toUpperCase();
  }

  async addVoucher(dataVoucher: ServiceVoucherData, userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const { endDate, productId, type } = dataVoucher;
      const newCodeVoucher = this.generateRandomString(8);
      const requestId = await generateBase64FromDate();

      const newVoucher = this.serviceVoucherRepository.create({
        voucher_code: newCodeVoucher,
        created_by: 2,
        from_date: new Date(),
        end_date: endDate,
        product_id: productId,
        type,
        user_id: userId,
        status_id: 14,
        request_id: requestId,
      });
      const addNewVoucher = await this.serviceVoucherRepository.save(newVoucher);
      const existProduct = await this.productRepository.findOne({ where: { id: productId } });
      const dataToViasat = {
        code: addNewVoucher.voucher_code,
        expired: addNewVoucher.end_date,
        plan: existProduct.title,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/add`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return dataToViasat;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async editVoucher(queryVoucher: QueryVoucher, dataVoucher: ServiceVoucherData, userId: string): Promise<any> {
    try {
      const { endDate, productId, type } = dataVoucher;
      const { id } = queryVoucher;

      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const existVoucher = await this.serviceVoucherRepository.findOne({ where: { id: id } });

      if (userId !== existVoucher.user_id) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const requestId = await generateBase64FromDate();

      await this.serviceVoucherRepository.update(id, {
        end_date: endDate,
        product_id: productId,
        type,
        request_id: requestId,
      });
      const updateVoucher = await this.serviceVoucherRepository.findOne({ where: { id } });
      const existProduct = await this.productRepository.findOne({ where: { id: productId } });
      const dataToViasat = {
        code: updateVoucher.voucher_code,
        expired: updateVoucher.end_date,
        plan: existProduct.title,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/update`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return dataToViasat;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async changeStatusVoucher(queryVoucher: QueryVoucher, dataStatus: ChangeStatusVoucher, userId: string): Promise<any> {
    try {
      const statusCode = ["online", "deleted_success", "offline", "in_use", "used", "expires"];
      const { status } = dataStatus;
      const { id } = queryVoucher;

      const checkAvailableCode = statusCode.includes(status);

      if (!checkAvailableCode) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const existVoucher = await this.serviceVoucherRepository.findOne({ where: { id: id } });
      if (userId !== existVoucher.user_id) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const statusData = await this.statusRepository.findOne({ where: { code: status } });
      if (!statusData) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }

      const requestId = await generateBase64FromDate();

      await this.serviceVoucherRepository.update(id, {
        status_id: statusData.id,
        request_id: requestId,
      });
      const updateVoucher = await this.serviceVoucherRepository.findOne({ where: { id } });
      const dataToViasat = {
        code: updateVoucher.voucher_code,
        status: status,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/change_status`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return dataToViasat;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteVoucher(queryVoucher: QueryVoucher, userId: string): Promise<any> {
    try {
      const { id } = queryVoucher;

      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const existVoucher = await this.serviceVoucherRepository.findOne({ where: { id: id } });

      if (userId !== existVoucher.user_id) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const requestId = await generateBase64FromDate();

      await this.serviceVoucherRepository.update(id, {
        status_id: 13,
        request_id: requestId,
      });
      const updateVoucher = await this.serviceVoucherRepository.findOne({ where: { id } });
      const dataToViasat = {
        code: updateVoucher.voucher_code,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/delete`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return dataToViasat;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async verifyVoucher(voucherCode: string, requestId: string, userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      const existVoucher = await this.serviceVoucherRepository.findOne({ where: { voucher_code: voucherCode } });

      if (userId !== existVoucher.user_id) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }

      const existVoucherActive = await this.serviceVoucherRepository
        .createQueryBuilder("vouchers")
        .where(
          new Brackets((qb) => {
            qb.where("vouchers.voucher_code = :voucherCode", { voucherCode }).orWhere("vouchers.request_id = :requestId", { requestId }).andWhere("vouchers.status_id = :activeStatus", { activeStatus: 14 });
          })
        )
        .getOne();

      if (!existVoucherActive) {
        return false;
      }
      return existVoucherActive;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  async getDataVoucher(page: number, pageSize: number, filters: string, userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new InternalServerErrorException({ code: -2, message: responseMessage.badRequest });
      }
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.serviceVoucherRepository
        .createQueryBuilder("vouchers")
        .where("vouchers.status_id != :statusIds", { statusIds: 13 })
        .andWhere("vouchers.user_id = :userId", { userId })
        .orderBy("vouchers.created_date", "DESC");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("vouchers.voucher_code = :filters", { filters: filters });
          })
        );
      }
      const [voucherListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);
      const requestId = await generateBase64FromDate();

      return {
        data: voucherListData.length > 0 ? voucherListData : [],
        total: total,
        totalPages,
        requestId,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async getDataProduct(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.productRepository.createQueryBuilder("products").where("products.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] });

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("products.title = :filters", { filters: filters });
          })
        );
      }
      const [productListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);
      const requestId = await generateBase64FromDate();

      return {
        data: productListData.length > 0 ? productListData : [],
        total: total,
        totalPages,
        requestId,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
