import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
import { BlackListDevicesInfo } from "../entity/blacklist_devices.entity";
import { BlackListDeviceSyncRequestData } from "../interface/blacklist_devices.interface";

@Injectable()
export class BlackListDevicesService {
  constructor(
    @InjectRepository(BlackListDevicesInfo)
    private readonly blacklistDevicesRepository: Repository<BlackListDevicesInfo>,

    private readonly logger: LoggerService
  ) {}

  async findBlackListDevices(page: number, pageSize: number, filters: string): Promise<{ data: unknown[]; total: number; totalPages: number }> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.blacklistDevicesRepository.createQueryBuilder("blacklist_devices").where("blacklist_devices.status_id != :statusId", { statusId: 19 });

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("blacklist_devices.device_name = :deviceName", { deviceName: filters })
              .orWhere("blacklist_devices.mac_address = :macAddress", { macAddress: filters })
              .orWhere("blacklist_devices.device_type = :deviceType", { deviceType: filters });
          })
        );
      }
      const [blackListDeviceListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: blackListDeviceListData.length > 0 ? blackListDeviceListData : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddBlackListDevices(dataAdd: BlackListDeviceSyncRequestData): Promise<string> {
    try {
      const { deviceName, ipAddress, ipv6Address, macAddress, reason } = dataAdd.data;

      const existDevice = await this.blacklistDevicesRepository.findOne({ where: { mac_address: macAddress, status_id: 14 } });
      if (existDevice) {
        throw new ConflictException({ code: -1, message: responseMessage.existValue });
      }

      const newDevice = this.blacklistDevicesRepository.create({ mac_address: macAddress, ip_address: ipAddress, ipv6_address: ipv6Address, device_name: deviceName, reason, status_id: 14 });

      await this.blacklistDevicesRepository.save(newDevice);
      return responseMessage.success;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleEditBlackListDevices(id: number, dataEdit: BlackListDeviceSyncRequestData): Promise<string> {
    try {
      const { deviceName, ipAddress, ipv6Address, macAddress, reason } = dataEdit.data;
      const existDomain = await this.blacklistDevicesRepository.findOne({ where: { id, status_id: 14 } });
      if (!existDomain) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.blacklistDevicesRepository.update(id, { mac_address: macAddress, ip_address: ipAddress, ipv6_address: ipv6Address, device_name: deviceName, reason, modified_date: new Date() });

      return responseMessage.success;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteBlackListDevices(id: number): Promise<string> {
    const existDevice = await this.blacklistDevicesRepository.findOne({ where: { id, status_id: 14 } });
    if (!existDevice) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.blacklistDevicesRepository.update(id, {
      status_id: 19,
      deleted_date: new Date(),
      modified_date: new Date(),
    });
    return responseMessage.success;
  }
}
