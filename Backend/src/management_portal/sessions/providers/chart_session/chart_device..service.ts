import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChartDeviceHealthService } from "../calculate_chart/calculate_chart_device.service";
import { DeviceHealthChart } from "../../entity/device_chart.entity";
@Injectable()
export class ChartDeviceService {
  constructor(
    @InjectRepository(DeviceHealthChart)
    private readonly deviceHealthRepository: Repository<DeviceHealthChart>,

    private readonly chartDeviceHealthService: ChartDeviceHealthService
  ) {}

  async chartDeviceHealth(type: string): Promise<any> {
    try {
      const qb = this.deviceHealthRepository.createQueryBuilder("device_health").innerJoin("device_health.devices", "devices").where("devices.status_id != :statusId", { statusId: 13 });
      const deviceHealtListData = await qb.getMany();
      switch (type) {
        case "device_health": {
          const chartNumberPurchasesPlan = this.chartDeviceHealthService.chartDeviceHealth(deviceHealtListData);
          return {
            data: chartNumberPurchasesPlan,
          };
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
