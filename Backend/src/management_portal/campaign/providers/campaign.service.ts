import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { CampaignDetails, CampaignInfo } from "../entity/campaign.entity";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "../../../utils/constant";
import { CampaignDataReq } from "../interface/campaign.interface";
import { AddMultiVoucher } from "../../vouchers/interface/vouchers.interface";
import { VouchersService } from "../../vouchers/providers/vouchers.service";

@Injectable()
export class CampaignService {
  constructor(
    private readonly voucherService: VouchersService,
    @InjectRepository(CampaignInfo)
    private readonly campaignRepository: Repository<CampaignInfo>,
    @InjectRepository(CampaignDetails)
    private readonly campaignDetailsRepository: Repository<CampaignDetails>,
    private readonly logger: LoggerService
  ) {}

  async findCampaign(page: number, pageSize: number, filters: string): Promise<{ data?: unknown[]; total?: number; totalPages?: number }> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.campaignRepository
        .createQueryBuilder("campaign")
        .where("campaign.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] })
        .leftJoinAndSelect("campaign.campaign_details", "campaign_details")
        .leftJoinAndSelect("campaign_details.product", "product")
        .orderBy("campaign.created_date", "DESC");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("campaign.name = :filters", { filters });
          })
        );
      }
      const [campaignListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      const updatedCampaigns = campaignListData.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        status_id: campaign.status_id,
        budget: campaign.budget,
        product_list: campaign.campaign_details.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
        })),
      }));

      return {
        data: updatedCampaigns.length > 0 ? updatedCampaigns : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async addCampaign(dataCampaign: CampaignDataReq): Promise<string> {
    const { name, description, startDate, endDate, budget, data } = dataCampaign;
    const existCampaign = await this.campaignRepository.findOne({ where: { name: name, status_id: 14 } });

    if (existCampaign) {
      throw new ConflictException({ code: -1, message: responseMessage.existValue });
    }

    const newCampaign = this.campaignRepository.create({
      description,
      name,
      status_id: 14,
      start_date: startDate,
      end_date: endDate,
      budget: budget,
    });
    const addCampaign = await this.campaignRepository.save(newCampaign);

    if (data.length > 0) {
      for (const item of data) {
        const newCampaignDetails = this.campaignDetailsRepository.create({
          campaign_id: addCampaign.id,
          product_id: item.productId,
          quantity: item.quantity,
          status_id: 14,
        });
        await this.campaignDetailsRepository.save(newCampaignDetails);
      }
    }
    const newDataVoucher: AddMultiVoucher = {
      campaignId: addCampaign.id,
      startDate: startDate,
      endDate: endDate,
      data: [...data],
    };
    await this.voucherService.addMultiVoucher(newDataVoucher);
    return responseMessage.success;
  }

  async editCampaign(id: string, dataCampaign: CampaignDataReq): Promise<string> {
    const { name, description, startDate, endDate, budget } = dataCampaign;
    const existCampaign = await this.campaignRepository.find({ where: { name, status_id: 14 } });
    if (!existCampaign) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.campaignRepository.update(id, {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      budget,
      modified_date: new Date(),
    });
    return responseMessage.success;
  }

  async deleteCampaign(id: string): Promise<string> {
    const existCampaign = await this.campaignRepository.find({ where: { id, status_id: 14 } });
    if (!existCampaign) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.campaignRepository.update(id, {
      status_id: 13,
      deleted_date: new Date(),
      modified_date: new Date(),
    });
    return responseMessage.success;
  }
}
