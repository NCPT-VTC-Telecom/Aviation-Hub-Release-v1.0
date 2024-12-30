import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceHealth, DeviceHealthActivities, Devices, MaintenanceDevices, MaintenanceDevicesHist } from "../entity/devices.entity";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { MaintenanceSyncRequestData } from "src/management_portal/devices/interface/device.interface";
import { generateCode } from "src/utils/common";

@Injectable()
export class MaintenanceDeviceService {
  constructor(
    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,
    @InjectRepository(MaintenanceDevices)
    private readonly maintenanceDevicesRepository: Repository<MaintenanceDevices>,
    @InjectRepository(MaintenanceDevicesHist)
    private readonly maintenanceDevicesHistRepository: Repository<MaintenanceDevicesHist>,
    @InjectRepository(DeviceHealth)
    private readonly deviceHealthRepository: Repository<DeviceHealth>,
    @InjectRepository(DeviceHealthActivities)
    private readonly deviceHealthActivitiesRepository: Repository<DeviceHealthActivities>,

    private readonly logger: LoggerService
  ) {}

  private readonly handleAddHist = async (id: number, status: string, fromDate: Date, endDate: Date, statusId: number) => {
    try {
      this.maintenanceDevicesHistRepository.create({ maintenance_id: id, maintenance_status: status, from_date: fromDate, end_date: endDate, status_id: statusId, modified_date: new Date() });
      return true;
    } catch (error) {
      return false;
    }
  };

  async findMaintenance(page: number, pageSize: number, filters: string, fromDate?: string, endDate?: string): Promise<any> {
    try {
      page = Math.max(1, page);
      let qb = this.maintenanceDevicesRepository
        .createQueryBuilder("maintenance_devices")
        .leftJoinAndSelect("maintenance_devices.devices", "devices")
        .where("maintenance_devices.status_id != :statusId", { statusId: 13 })
        .orderBy("maintenance_devices.created_date", "DESC");

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_devices.maintenance_code = :MaintenanceCode", { MaintenanceCode: filters }).orWhere("maintenance_devices.reason LIKE :Reason", { Reason: `%${filters}%` });
          })
        );
      }
      if (fromDate.length > 0 && endDate.length > 0) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_devices.from_date >= :fromDate", { fromDate: new Date(fromDate) }).orWhere("maintenance_devices.end_date <= :endDate", { endDate: new Date(endDate) });
          })
        );
      }

      const [maintenancesData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: maintenancesData.length > 0 ? maintenancesData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  async findMaintenanceHist(page: number, pageSize: number, filters: string, fromDate?: string, endDate?: string): Promise<any> {
    try {
      page = Math.max(1, page);
      let qb = this.maintenanceDevicesHistRepository.createQueryBuilder("maintenance_devices_hist").where("maintenance_devices_hist.status_id != :statusId", { statusId: 13 }).orderBy("maintenance_devices_hist.created_date", "DESC");

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_devices_hist.maintenance_code = :MaintenanceCode", { MaintenanceCode: filters }).orWhere("maintenance_devices_hist.reason LIKE :Reason", { Reason: `%${filters}%` });
          })
        );
      }
      if (fromDate || endDate) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_devices_hist.from_date >= :fromDate", { fromDate: new Date(fromDate) }).orWhere("maintenance_devices_hist.end_date <= :endDate", { endDate: new Date(endDate) });
          })
        );
      }

      const [maintenancesData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: maintenancesData.length > 0 ? maintenancesData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddMaintenance(id: string, data: MaintenanceSyncRequestData): Promise<any> {
    try {
      const { reason, description, endDate, fromDate } = data;
      const count = await this.maintenanceDevicesRepository.count();
      const maintenanceCode = generateCode(count + 1);
      const newFromDate = new Date(fromDate);
      const newEndDate = new Date(endDate);
      const qb = this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.id = :id", { id });

      const existDevices = await qb.getOne();
      if (!existDevices) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.maintenanceDevicesRepository.createQueryBuilder("maintenance_devices").where("maintenance_devices.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] });

      const existMaintenance = await qbMaintenance.getCount();
      if (existMaintenance) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      const newMaintenance = this.maintenanceDevicesRepository.create({
        device_id: id,
        created_by: 1,
        description,
        reason,
        maintenance_code: maintenanceCode,
        maintenance_status: "Maintenance",
        from_date: newFromDate,
        end_date: newEndDate,
        status_id: 14,
      });

      const newAddedMaitenance = await this.maintenanceDevicesRepository.save(newMaintenance);
      const newMaintenanceHist = this.handleAddHist(newAddedMaitenance.id, "Maintenance", newFromDate, newEndDate, 14);
      if (!newMaintenanceHist) {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
      await this.deviceHealthRepository.update({ device_id: id }, { status: "Maintenance", modified_date: new Date() });
      const deviceHealthActivities = this.deviceHealthActivitiesRepository.create({ check_time: new Date(), status: "Maintenance", modified_date: new Date() });
      this.deviceHealthActivitiesRepository.save(deviceHealthActivities);
      await this.devicesRepository.update(
        { id },
        {
          status_id: 21,
          modified_date: new Date(),
        }
      );
      return newAddedMaitenance;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleEditMaintenance(id: string, data: MaintenanceSyncRequestData): Promise<any> {
    try {
      const { reason, description, maintenanceCode, maintenanceStatus, statusId, endDate, fromDate } = data;
      let newFromDate: Date;
      let newEndDate: Date;

      if (fromDate) {
        newFromDate = new Date(fromDate);
      }
      if (endDate) {
        newEndDate = new Date(endDate);
      }

      const qb = this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.id = :id", { id });

      const existDevices = await qb.getOne();
      if (!existDevices) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.maintenanceDevicesRepository
        .createQueryBuilder("maintenance_devices")
        .where("maintenance_devices.maintenance_code = :MaintenanceCode", { MaintenanceCode: maintenanceCode })
        .andWhere("maintenance_devices.device_id = :DeviceId", { DeviceId: id })
        .andWhere("maintenance_devices.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] });

      const existMaintenance = await qbMaintenance.getOne();
      if (!existMaintenance) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      await this.maintenanceDevicesRepository.update(
        { device_id: id, maintenance_code: maintenanceCode },
        { maintenance_status: maintenanceStatus, reason, description, update_by: 1, from_date: newFromDate, end_date: newEndDate, status_id: maintenanceStatus == "Healthy" ? 19 : statusId, modified_date: new Date() }
      );

      await this.deviceHealthRepository.update({ device_id: id }, { status: maintenanceStatus, modified_date: new Date() });
      const deviceHealthActivities = this.deviceHealthActivitiesRepository.create({ check_time: new Date(), status: maintenanceStatus, modified_date: new Date() });
      this.deviceHealthActivitiesRepository.save(deviceHealthActivities);

      await this.handleAddHist(existMaintenance.id, maintenanceStatus, newFromDate, newEndDate, statusId);

      await this.devicesRepository.update(
        { id },
        {
          status_id: maintenanceStatus == "Healthy" ? 14 : 21,
          modified_date: new Date(),
        }
      );
      return existMaintenance;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteMaintenance(id: string, data: MaintenanceSyncRequestData): Promise<any> {
    try {
      const { maintenanceCode, endDate, fromDate } = data;
      const newFromDate = new Date(fromDate);
      const newEndDate = new Date(endDate);
      const qb = this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.id = :id", { id });

      const existDevices = await qb.getOne();
      if (!existDevices) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.maintenanceDevicesRepository
        .createQueryBuilder("maintenance_devices")
        .where("maintenance_devices.maintenance_code = :MaintenanceCode", { MaintenanceCode: maintenanceCode })
        .andWhere("maintenance_devices.device_id = :DeviceId", { DeviceId: id })
        .andWhere("maintenance_devices.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] });

      const existMaintenance = await qbMaintenance.getOne();
      if (!existMaintenance) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      await this.maintenanceDevicesRepository.update({ device_id: id, maintenance_code: maintenanceCode }, { maintenance_status: "Deleted", status_id: 13, deleted_date: new Date() });

      await this.deviceHealthRepository.update({ device_id: id }, { status: "Unknown", modified_date: new Date() });
      const deviceHealthActivities = this.deviceHealthActivitiesRepository.create({ check_time: new Date(), status: "Unknown", modified_date: new Date() });
      this.deviceHealthActivitiesRepository.save(deviceHealthActivities);
      await this.handleAddHist(existMaintenance.id, "Deleted", newFromDate, newEndDate, 13);

      await this.devicesRepository.update(
        { id },
        {
          status_id: 14,
          modified_date: new Date(),
        }
      );

      return existMaintenance;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
