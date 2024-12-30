import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { BlackListDomainInfo } from "../entity/blacklist_domain.entity";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { BlackListDomainSyncRequestData } from "../interface/blacklist_domain.interface";

@Injectable()
export class BlackListDomainsService {
  constructor(
    @InjectRepository(BlackListDomainInfo)
    private readonly blackListDomainInfoRepository: Repository<BlackListDomainInfo>,
    private readonly logger: LoggerService
  ) {}

  async findBlackListDomains(page: number, pageSize: number, filters: string): Promise<{ data: unknown[]; total: number; totalPages: number }> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.blackListDomainInfoRepository.createQueryBuilder("blacklist_domains").where("blacklist_domains.status_id != :statusId", { statusId: 19 }).leftJoinAndSelect("blacklist_domains.category", "category");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("blacklist_domains.name = :name", { name: filters })
              .orWhere("blacklist_domains.url = :url", { url: filters })
              .orWhere("blacklist_domains.ip_address = :ipAddress", { ipAddress: filters })
              .orWhere("blacklist_domains.ipv6_address = :ipv6Address", { ipv6Address: filters })
              .orWhere("blacklist_domains.dns_address = :dnsAddress", { dnsAddress: filters });
          })
        );
      }
      const [blackListDomainListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: blackListDomainListData.length > 0 ? blackListDomainListData : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddBlackListDomains(dataAdd: BlackListDomainSyncRequestData): Promise<string> {
    const { categoryId, dnsAddress, ipAddress, ipv6Address, name, reason, url } = dataAdd.data;
    const existDomain = await this.blackListDomainInfoRepository.findOne({ where: { url: url, status_id: 14 } });
    if (existDomain) {
      throw new ConflictException({ code: -1, message: responseMessage.existValue });
    }

    const newBlackListDomain = this.blackListDomainInfoRepository.create({
      url,
      category_id: categoryId,
      dns_address: dnsAddress,
      ip_address: ipAddress,
      ipv6_address: ipv6Address,
      name,
      reason,
      status_id: 14,
    });

    await this.blackListDomainInfoRepository.save(newBlackListDomain);
    return responseMessage.success;
  }

  async handleEditBlackListDomains(id: number, dataEdit: BlackListDomainSyncRequestData): Promise<BlackListDomainInfo> {
    const { categoryId, dnsAddress, ipAddress, ipv6Address, name, reason, url } = dataEdit.data;
    const existDomain = await this.blackListDomainInfoRepository.findOne({ where: { id, status_id: 14 } });
    if (!existDomain) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    await this.blackListDomainInfoRepository.update(id, {
      category_id: categoryId,
      dns_address: dnsAddress,
      name,
      reason,
      url,
      ip_address: ipAddress,
      ipv6_address: ipv6Address,
      modified_date: new Date(),
    });
    const updateBlackListDomain = await this.blackListDomainInfoRepository.findOne({ where: { id } });
    return updateBlackListDomain;
  }

  async handleDeleteBlackListDomains(id: number): Promise<string> {
    const existDomain = await this.blackListDomainInfoRepository.findOne({ where: { id, status_id: 14 } });
    if (!existDomain) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.blackListDomainInfoRepository.update(id, {
      status_id: 19,
      deleted_date: new Date(),
      modified_date: new Date(),
    });
    return responseMessage.success;
  }
}
