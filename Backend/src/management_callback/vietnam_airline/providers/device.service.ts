import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { AddDeviceHealthRequestData, DeviceListVNAImportData } from "src/management_callback/vietnam_airline/interface/device.interface";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { Repository, DataSource, Brackets } from "typeorm";
import { DeviceDetailsVNA, DeviceHealthVNA, DeviceTypeVNA, DevicesVNA, SupplierVNA } from "../entity/device.entity";
import { AircraftVNA } from "../entity/flight.entity";

@Injectable()
export class DeviceVietnamAirlineService {
  constructor(
    @InjectRepository(DevicesVNA)
    private readonly devicesRepository: Repository<DevicesVNA>,
    @InjectRepository(DeviceTypeVNA)
    private readonly deviceTypesRepository: Repository<DeviceTypeVNA>,
    @InjectRepository(DeviceDetailsVNA)
    private readonly deviceDetailsRepository: Repository<DeviceDetailsVNA>,
    @InjectRepository(SupplierVNA)
    private readonly supplierRepository: Repository<SupplierVNA>,
    @InjectRepository(DeviceHealthVNA)
    private readonly deviceHealthVNARepository: Repository<DeviceHealthVNA>,

    @InjectRepository(AircraftVNA)
    private readonly aircraftRepository: Repository<AircraftVNA>,
    private readonly dataSource: DataSource,

    private readonly logger: LoggerService
  ) {}

  async handleImportDevice(isEdit: boolean, dataImport: DeviceListVNAImportData): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dataDevice = dataImport.data;
      const existedList = [];
      const errorList = [];
      const addedList = [];

      for (const item of dataDevice) {
        const { cpuType, activationDate, dateOfManufacture, deactivationDate, description, deviceType, firmware, flightNumber, ipAddress, ipv6Address, macAddress, manufacturer, model, name, placementLocation, port, supplier, wifiStandard } = item;

        const [existAircraft, existDataType, existSupplier] = await Promise.all([
          this.aircraftRepository.findOne({ where: { flight_number: flightNumber } }),
          this.deviceTypesRepository.findOne({ where: { name: deviceType } }),
          this.supplierRepository.findOne({ where: { name: supplier } }),
        ]);

        if (!existAircraft || !existDataType || !existSupplier) {
          errorList.push(item);
          continue;
        }

        if (isEdit) {
          await queryRunner.manager.update(
            DevicesVNA,
            { type_id: existDataType.id, aircraft_id: existAircraft.id, name },
            {
              type_id: existDataType.id,
              aircraft_id: existAircraft.id,
              name,
              description,
              date_of_manufacture: dateOfManufacture,
              placement_location: placementLocation,
              activation_date: activationDate,
              deactivation_date: deactivationDate,
              status_id: 14,
            }
          );

          await queryRunner.manager.update(
            DeviceDetailsVNA,
            { device_id: existAircraft.id },
            {
              ip_address: ipAddress,
              port,
              firmware,
              ipv6_address: ipv6Address,
              manufacturer_date: dateOfManufacture,
              cpu_type: cpuType,
              mac_address: macAddress,
              manufacturer,
              supplier,
              model,
              wifi_standard: wifiStandard,
            }
          );
          continue;
        } else {
          const newDevice = queryRunner.manager.create(DevicesVNA, {
            type_id: existDataType.id,
            aircraft_id: existAircraft.id,
            name,
            description,
            date_of_manufacture: dateOfManufacture,
            placement_location: placementLocation,
            activation_date: activationDate,
            deactivation_date: deactivationDate,
            status_id: 14,
          });
          const deviceData = await queryRunner.manager.save(newDevice);

          const newDeviceDetail = queryRunner.manager.create(DeviceDetailsVNA, {
            device_id: deviceData.id,
            ip_address: ipAddress,
            port,
            firmware,
            ipv6_address: ipv6Address,
            manufacturer_date: dateOfManufacture,
            cpu_type: cpuType,
            mac_address: macAddress,
            manufacturer,
            supplier,
            model,
            wifi_standard: wifiStandard,
          });
          await queryRunner.manager.save(newDeviceDetail);
          addedList.push(deviceData);
          continue;
        }
      }

      if (existedList.length > 0 || errorList.length > 0) {
        await queryRunner.rollbackTransaction();
        return existedList.length > 0 ? { note: "Thiết bị đã tồn tại", data: existedList } : { note: "Có lỗi xảy ra", data: errorList };
      } else {
        await queryRunner.commitTransaction();
        return { data: addedList };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    } finally {
      await queryRunner.release();
    }
  }

  async findDevices(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);

      const queryBuilder = this.deviceDetailsRepository
        .createQueryBuilder("device_details")
        .leftJoinAndSelect("device_details.devices", "devices")
        .leftJoinAndSelect("devices.type", "device_type")
        .leftJoinAndSelect("devices.aircraft", "aircraft")
        .leftJoinAndSelect("devices.status_description", "status")
        .where("devices.status_id != :statusId", { statusId: 13 });

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("device_details.model = :model", { model: filters })
              .orWhere("device_details.cpu_type = :cpuType", { cpuType: filters })
              .orWhere("device_details.supplier = :supplier", { supplier: filters })
              .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
              .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
              .orWhere("device_details.wifi_standard = :wifiStandard", { wifiStandard: filters })
              .orWhere("device_details.manufacturer = :manufacturer", { manufacturer: filters })
              .orWhere("device_details.ip_address = :ipAddress", { ipAddress: filters })
              .orWhere("device_details.mac_address = :macAddress", { macAddress: filters })
              .orWhere("device_details.firmware = :firmware", { firmware: filters })
              .orWhere("device_details.devices.type.name = :name", { name: filters })
              .orWhere("device_details.devices.status_description.description = :statusDescription", { statusDescription: filters })
              .orWhere("device_details.wifi_standard = :wifiStandard", { wifiStandard: filters });
          })
        );
      }

      const [devicesData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      const deviceDataWithDetails = devicesData.map((device) => ({
        id_device: device.devices.id,
        name: device.devices.name,
        description: device.devices.description,
        placement_location: device.devices.placement_location,
        activation_date: device.devices.activation_date,
        deactivation_date: device.devices.deactivation_date,
        type: device.devices.type.name,
        ip_address: device.ip_address,
        last_ip: device.last_ip,
        port: device.port,
        mac_address: device.mac_address,
        ipv6_address: device.ipv6_address,
        firmware: device.firmware,
        wifi_standard: device.wifi_standard,
        manufacturer: device.manufacturer,
        manufacturer_date: device.manufacturer_date,
        model: device.model,
        cpu_type: device.cpu_type,
        supplier: device.supplier,
        status_description: device.devices.status_description.description,
        aircraft: device.devices.aircraft,
      }));

      return {
        data: deviceDataWithDetails.length > 0 ? deviceDataWithDetails : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleImportDeviceHealth(dataRequest: AddDeviceHealthRequestData): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dataDevice = dataRequest.data;
      const errorList = [];
      const addedList = [];
      const updatedList = [];
      for (const item of dataDevice) {
        const { checkTime, cpuUsage, deviceId, diskUsage, memoryUsage, status, temprature } = item;
        const existDevice = await this.devicesRepository.findOne({ where: { id: deviceId } });
        if (!existDevice) {
          errorList.push(deviceId);
          continue;
        }
        const existDeviceHealth = await this.deviceHealthVNARepository.findOne({ where: { device_id: deviceId } });
        if (existDeviceHealth) {
          await this.deviceHealthVNARepository.update(
            { device_id: deviceId },
            {
              check_time: checkTime,
              cpu_usage: cpuUsage,
              disk_usage: diskUsage,
              memory_usage: memoryUsage,
              status: status,
              temperature: temprature,
              modified_date: new Date(),
            }
          );
          updatedList.push(item);
          continue;
        } else {
          const newDeviceHealth = this.deviceHealthVNARepository.create({
            device_id: deviceId,
            check_time: checkTime,
            cpu_usage: cpuUsage,
            disk_usage: diskUsage,
            memory_usage: memoryUsage,
            temperature: temprature,
            status,
          });

          await this.deviceHealthVNARepository.save(newDeviceHealth);
          addedList.push(item);
          continue;
        }
      }
      if (errorList.length > 0) {
        await queryRunner.rollbackTransaction();
        return errorList.length > 0 && { message: "Thiết bị không tồn tại", error: errorList };
      } else {
        await queryRunner.commitTransaction();
        return { message: updatedList.length > 0 ? "Cập nhật trạng thái thành công" : "Thêm trạng thái thiết bị thành công", added: addedList, updated: updatedList };
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
