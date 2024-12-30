import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vouchers } from "src/management_portal/vouchers/entity/vouchers.entity";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { AddMultiVoucher, VoucherInfoData } from "../interface/vouchers.interface";
import { characters } from "src/utils/constant";
import { HttpService } from "@nestjs/axios";
import { Products } from "src/management_portal/products/entity/product.entity";
import { generateBase64FromDate } from "src/utils/common";

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Vouchers)
    private readonly vouchersRepository: Repository<Vouchers>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService
  ) {}

  async findVoucher(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;
      let queryBuilder = this.vouchersRepository
        .createQueryBuilder("vouchers")
        .where("vouchers.status_id  != :statusId", { statusId: 13 })
        .leftJoinAndSelect("vouchers.item_product", "product")
        .leftJoinAndSelect("vouchers.item_campaign", "campaign")
        .leftJoinAndSelect("vouchers.user", "user")
        .orderBy("vouchers.created_date", "DESC");
      if (filters) {
        queryBuilder = queryBuilder.where("vouchers.type = :filters", { filters }).orWhere("vouchers.product_id = :filters", { filters });
      }
      const [voucherListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      const formatData = voucherListData.map((voucher) => {
        return {
          id: voucher.id,
          voucher_code: voucher.voucher_code,
          from_date: voucher.from_date,
          end_date: voucher.end_date,
          vendor: voucher.user
            ? {
                id: voucher.user.id,
                fullname: voucher.user.fullname,
                username: voucher.user.username,
                email: voucher.user.email,
                gender: voucher.user.gender,
                phone_number: voucher.user.phone_number,
                citizen_id: voucher.user.citizen_id,
                address: voucher.user.address,
                country: voucher.user.country,
                ward: voucher.user.ward,
                district: voucher.user.district,
                province: voucher.user.province,
                postcode: voucher.user.postcode,
              }
            : null,
          status_id: voucher.status_id,
          product: voucher.item_product
            ? {
                id: voucher.item_product.id,
                title: voucher.item_product.title,
                description: voucher.item_product.description,
                type: voucher.item_product.type,
                total_time: voucher.item_product.total_time,
                bandwidth_upload: voucher.item_product.bandwidth_upload,
                bandwidth_download: voucher.item_product.bandwidth_download,
                data_total: voucher.item_product.data_total,
                data_upload: voucher.item_product.data_upload,
                data_download: voucher.item_product.data_download,
              }
            : null,
          campaign: voucher.item_campaign ? { id: voucher.item_campaign.id, name: voucher.item_campaign.name, start_date: voucher.item_campaign.start_date, end_date: voucher.item_campaign.end_date } : null,
        };
      });

      return {
        data: formatData.length > 0 ? formatData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private generateRandomString(length: number): string {
    const character = characters;
    let result = "";
    const charactersLength = character.length;

    for (let i = 0; i < length; i++) {
      result += character.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.toUpperCase();
  }

  async addVoucher(dataVoucher: VoucherInfoData): Promise<any> {
    try {
      const { fromDate, endDate, productId, userId } = dataVoucher;

      const newCodeVoucher = this.generateRandomString(8);
      const newVoucher = this.vouchersRepository.create({
        voucher_code: newCodeVoucher,
        created_by: 1,
        from_date: fromDate,
        end_date: endDate,
        product_id: productId,
        user_id: userId != null ? userId : null,
        status_id: 14,
      });
      const addNewVoucher = await this.vouchersRepository.save(newVoucher);
      return addNewVoucher;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  async addMultiVoucher(dataMultiVoucher: AddMultiVoucher): Promise<string[]> {
    const { data, startDate, endDate, campaignId, userId } = dataMultiVoucher;
    const newVouchers: string[] = [];
    const vouchersToSave = [];

    // Kiểm tra campaignId
    if (!campaignId) {
      throw new ConflictException({
        code: -2,
        message: responseMessage.badRequest,
      });
    }

    // Tạo các voucher codes và entities
    data.forEach(({ productId, quantity }) => {
      const voucherCodes = Array.from({ length: quantity }, () => this.generateRandomString(8));
      const voucherEntities = voucherCodes.map((voucherCode) => {
        return this.vouchersRepository.create({
          voucher_code: voucherCode,
          created_by: 1,
          campaign_id: campaignId,
          from_date: startDate,
          end_date: endDate,
          product_id: productId,
          user_id: userId ?? null,
          status_id: 14,
        });
      });

      newVouchers.push(...voucherCodes);
      vouchersToSave.push(...voucherEntities);
    });

    // Lưu vouchers theo batch (tối ưu hiệu suất)
    const batchSize = vouchersToSave.length; // Số lượng voucher lưu mỗi lần
    for (let i = 0; i < batchSize; i += batchSize) {
      const batch = vouchersToSave.slice(i, i + batchSize);
      await this.vouchersRepository.save(batch);
      console.log(`Saved batch: ${i / batchSize + 1}`);
    }

    return newVouchers;
  }
  async editVoucher(id: string, dataVoucher: VoucherInfoData): Promise<any> {
    const { fromDate, endDate, productId } = dataVoucher;
    try {
      const existingVoucher = await this.vouchersRepository.findOne({ where: { id: id } });
      if (!existingVoucher) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.vouchersRepository.update(id, {
        from_date: fromDate,
        end_date: endDate,
        product_id: productId,
        modified_date: new Date(),
      });
      const updatedVoucher = await this.vouchersRepository.findOne({ where: { id: id } });
      const existProduct = await this.productRepository.findOne({ where: { id: updatedVoucher.product_id } });
      const requestId = await generateBase64FromDate();
      const dataToViasat = {
        code: updatedVoucher.voucher_code,
        expired: updatedVoucher.end_date,
        plan: existProduct.title,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/update`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return updatedVoucher;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteVoucher(id: string): Promise<any> {
    try {
      // Check if the Voucher exists
      const existingVoucher = await this.vouchersRepository.findOne({ where: { id: id } });
      if (!existingVoucher) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.vouchersRepository.update(id, {
        status_id: 13,
        deleted_date: new Date(),
      });

      const deletedVoucher = await this.vouchersRepository.findOne({ where: { id: id } });
      const existProduct = await this.productRepository.findOne({ where: { id: deletedVoucher.product_id } });
      const requestId = await generateBase64FromDate();
      const dataToViasat = {
        code: deletedVoucher.voucher_code,
        expired: deletedVoucher.end_date,
        plan: existProduct.title,
        requestId: requestId,
      };
      const urlGateway = `${process.env.GATEWAY_SERVER}/vouchers_management/delete`;
      await this.httpService.post(urlGateway, dataToViasat).toPromise();
      return deletedVoucher;
    } catch (error) {
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
