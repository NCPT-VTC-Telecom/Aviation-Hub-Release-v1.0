import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataDeviceHealthRes, DeviceMetrics, DeviceRequestDataInfo } from "src/management_portal/devices/interface/device.interface";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Supplier } from "src/management_portal/supplier/entity/supplier.entity";
import { responseMessage } from "src/utils/constant";
import { Brackets, In, Not, Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, DeviceType, Devices, IFCServiceMetrics } from "../entity/devices.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,
    @InjectRepository(DeviceDetails)
    private readonly deviceDetailsRepository: Repository<DeviceDetails>,
    @InjectRepository(DeviceType)
    private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(DeviceHealth)
    private readonly deviceHealthRepository: Repository<DeviceHealth>,
    @InjectRepository(Flights)
    private readonly flightRepository: Repository<Flights>,
    @InjectRepository(DeviceHealthActivities)
    private readonly deviceHealthActivitiesRepository: Repository<DeviceHealthActivities>,
    @InjectRepository(IFCServiceMetrics)
    private readonly IFCServiceMetricsRepository: Repository<IFCServiceMetrics>,

    private readonly logger: LoggerService
  ) {}

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(value);
  }
  async findDevices(
    page: number,
    pageSize: number,
    filters: string,
    supplierId: string
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      const existingSupplier = supplierId !== null ? await this.supplierRepository.findOne({ where: { id: supplierId } }) : null;
      const supplierName = existingSupplier ? existingSupplier.name : null;

      let qb = this.deviceDetailsRepository
        .createQueryBuilder("device_details")
        .leftJoinAndSelect("device_details.devices", "devices")
        .leftJoinAndSelect("devices.type", "device_type")
        .leftJoinAndSelect("devices.aircraft", "aircraft")
        .leftJoinAndSelect("devices.status_description", "status")
        .where("devices.status_id != :statusId", { statusId: 13 })
        .orderBy("device_details.created_date", "DESC");

      if (supplierName) {
        qb.where("device_details.supplier = :supplierName", { supplierName: supplierName });
      }

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            if (this.isValidUUID(filters)) {
              qb.orWhere("device_details.device_id = :deviceId", { deviceId: filters }).orWhere("device_details.supplier LIKE :supplierName", { supplierName: `%${filters}%` });
            } else {
              qb.where("device_details.model LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.cpu_type LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.supplier LIKE :filters", { filters: `%${filters}%` })
                .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
                .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
                .orWhere("device_details.wifi_standard LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.manufacturer LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.ip_address LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.mac_address LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_details.firmware LIKE :filters", { filters: `%${filters}%` })
                .orWhere("device_type.name LIKE :filters", { filters: `%${filters}%` })
                .orWhere("status.description LIKE :filters", { filters: `%${filters}%` });
            }
          })
        );
      }
      const [devicesData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);
      const deviceDataWithDetails = devicesData.map((device) => ({
        id_device: device.devices.id,
        name: device.devices.name,
        description: device.devices.description,
        // date_of_manufacture: device.devices.date_of_manufacture,
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
        status_id: device.devices.status_id,
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

  async findHealthDevices(
    page: number,
    pageSize: number,
    filters: string
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      let qb = this.deviceHealthRepository
        .createQueryBuilder("device_health")
        .leftJoinAndSelect("device_health.devices", "devices")
        .leftJoinAndSelect("devices.details", "device_details")
        .leftJoinAndSelect("devices.type", "device_type")
        .leftJoinAndSelect("devices.status_description", "status")
        .where("devices.status_id != :statusId", { statusId: 13 })
        .orderBy("device_health.created_date", "DESC");

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.where("device_details.model LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.cpu_type LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.supplier LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.wifi_standard LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.manufacturer LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.ip_address LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.mac_address LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_details.firmware LIKE :filters", { filters: `%${filters}%` })
              .orWhere("device_type.name LIKE :filters", { filters: `%${filters}%` })
              .orWhere("status.description LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }

      const [devicesHealthData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      const deviceHealthDataWithDetails = devicesHealthData.map((deviceHealth) => ({
        id_device: deviceHealth.devices.id,
        status: deviceHealth.status,
        cpu_usage: deviceHealth.cpu_usage,
        memory_usage: deviceHealth.memory_usage,
        disk_usage: deviceHealth.disk_usage,
        temperature: deviceHealth.temperature,
        name: deviceHealth.devices.name,
        description: deviceHealth.devices.description,
        placement_location: deviceHealth.devices.placement_location,
        activation_date: deviceHealth.devices.activation_date,
        deactivation_date: deviceHealth.devices.deactivation_date,
        type: deviceHealth.devices.type.name,
        ip_address: deviceHealth.devices.details.ip_address,
        last_ip: deviceHealth.devices.details.last_ip,
        port: deviceHealth.devices.details.port,
        mac_address: deviceHealth.devices.details.mac_address,
        ipv6_address: deviceHealth.devices.details.ipv6_address,
        firmware: deviceHealth.devices.details.firmware,
        wifi_standard: deviceHealth.devices.details.wifi_standard,
        manufacturer: deviceHealth.devices.details.manufacturer,
        manufacturer_date: deviceHealth.devices.details.manufacturer_date,
        model: deviceHealth.devices.details.model,
        cpu_type: deviceHealth.devices.details.cpu_type,
        supplier: deviceHealth.devices.details.supplier,
        status_id: deviceHealth.devices.status_id,
        status_description: deviceHealth.devices.status_description.description,
      }));

      return {
        data: deviceHealthDataWithDetails.length > 0 ? deviceHealthDataWithDetails : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findDeviceType(
    page: number,
    pageSize: number,
    filters: string
  ): Promise<{
    data: any[];
    total: number;
    totalPages: number;
  }> {
    try {
      page = Math.max(1, page);

      let qb = this.deviceTypeRepository.createQueryBuilder("device_type").leftJoinAndSelect("device_type.status_description", "status").where("device_type.status_id != :statusId", { statusId: 13 }).orderBy("device_type.created_date", "DESC");

      if (filters) {
        qb = qb.where("device_type.name = :filters", { filters: `%${filters}%` }).orWhere("device_type.id = :filters", { filters: `%${filters}%` });
      }

      const [devicesData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      const dataReturn = devicesData.map((item: any) => {
        const deviceType = {
          id: item.id,
          name: item.name,
          description: item.name,
          status_id: item.status_id,
          status_description: item.status_description.description,
        };

        return deviceType;
      });

      return {
        data: dataReturn.length > 0 ? dataReturn : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddDevice(dataAddDevice: DeviceRequestDataInfo): Promise<string> {
    const { activationDate, cpuType, dateOfManufacture, deactivationDate, description, firmware, idAircraft, idTypeDevice, ipAddress, ipv6Address, macAddress, manufacturer, model, name, placementLocation, port, supplier, wifiStandard } =
      dataAddDevice.data;

    const existAircraft = await this.aircraftRepository.findOne({ where: { id: idAircraft } });
    const existDataType = await this.deviceTypeRepository.findOne({ where: { id: idTypeDevice } });
    const existSupplier = await this.supplierRepository.findOne({ where: { name: supplier } });

    if (!existAircraft) {
      throw new ConflictException({ code: -1, message: "Id máy bay không tồn tại" });
    }

    if (!existDataType) {
      throw new ConflictException({ code: -1, message: "Id loại thiết bị không tồn tại" });
    }

    if (!existSupplier) {
      throw new ConflictException({ code: -1, message: "Nhà cung cấp không tồn tại" });
    }

    const newDevice = this.devicesRepository.create({
      type_id: idTypeDevice,
      aircraft_id: idAircraft,
      name,
      description,
      date_of_manufacture: dateOfManufacture,
      placement_location: placementLocation,
      activation_date: activationDate,
      deactivation_date: deactivationDate,
      status_id: 14,
    });
    const deviceData = await this.devicesRepository.save(newDevice);

    const newDeviceDetail = this.deviceDetailsRepository.create({
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

    await this.deviceDetailsRepository.save(newDeviceDetail);
    return responseMessage.success;
  }

  async handleEditDevice(id: string, dataEditDevice: DeviceRequestDataInfo): Promise<string> {
    const { activationDate, cpuType, dateOfManufacture, deactivationDate, description, firmware, idAircraft, idTypeDevice, ipAddress, ipv6Address, macAddress, manufacturer, model, name, placementLocation, port, supplier, wifiStandard } =
      dataEditDevice.data;
    const [existAircraft, existDataType, existSupplier, existDevice] = await Promise.all([
      this.aircraftRepository.findOne({ where: { id: idAircraft } }),
      this.deviceTypeRepository.findOne({ where: { id: idTypeDevice } }),
      this.supplierRepository.findOne({ where: { name: supplier } }),
      this.devicesRepository.findOne({ where: { id } }),
    ]);
    if (!existAircraft) {
      throw new ConflictException({ code: -1, message: "Id máy bay không tồn tại" });
    }

    if (!existDataType) {
      throw new ConflictException({ code: -1, message: "Id loại thiết bị không tồn tại" });
    }

    if (!existSupplier) {
      throw new ConflictException({ code: -1, message: "Nhà cung cấp không tồn tại" });
    }

    if (!existDevice) {
      throw new ConflictException({ code: -1, message: "Thiết bị không tồn tại" });
    }

    await this.devicesRepository.update(id, {
      type_id: idTypeDevice,
      aircraft_id: idAircraft,
      name,
      description,
      date_of_manufacture: dateOfManufacture,
      placement_location: placementLocation,
      activation_date: activationDate,
      deactivation_date: deactivationDate,
      status_id: 14,
    });
    await this.deviceDetailsRepository.update(
      { device_id: id },
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
    await this.deviceDetailsRepository.findOne({ where: { device_id: id } });
    await this.devicesRepository.findOne({ where: { id } });

    // const dataReturn = {
    //   ...updatedDeviceDetail,
    //   ...updatedDevice,
    // };

    return responseMessage.success;
  }

  async handleDeleteDevice(id: string): Promise<string> {
    // Check if the device exists
    const existingDevice = await this.devicesRepository.findOneBy({ id, status_id: 14 });
    if (!existingDevice) {
      throw new ConflictException({
        code: -4,
        message: responseMessage.notFound,
      });
    }
    // Change Status
    await this.devicesRepository.update(id, {
      status_id: 13,
      modified_date: new Date(),
      deleted_date: new Date(),
    });
    return responseMessage.success;
  }

  async handleChangeStatusDevice(id: string, typeChange: string, idFlight: number = null, typeChangeStatus: string, aircraftId: number): Promise<string> {
    try {
      let existDevices;

      if (id && typeChange === "device") {
        const qb = this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.id = :id", { id });
        const devices = await qb.getOne();
        existDevices = [devices];
      } else if (typeChange === "flight" && idFlight) {
        const existFlight = await this.flightRepository
          .createQueryBuilder("flights")
          .where("flights.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] })
          .andWhere("flights.id = :idFlight", { idFlight })
          .getOne();

        const idAircraft = existFlight.aircraft_id;
        existDevices = await this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.aircraft_id = :idAircraft", { idAircraft }).getMany();
      } else if (typeChange === "global") {
        const qb = this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 });
        existDevices = await qb.getMany();
      } else if (typeChange === "aircraft") {
        existDevices = await this.devicesRepository.createQueryBuilder("devices").where("devices.status_id != :statusId", { statusId: 13 }).andWhere("devices.aircraft_id = :idAircraft", { aircraftId }).getMany();
      }

      if (!existDevices) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      if (typeChangeStatus === "active") {
        for (const device of existDevices) {
          await this.devicesRepository.update(
            { id: device.id },
            {
              status_id: 14,
              modified_date: new Date(),
            }
          );
        }
      }

      if (typeChangeStatus === "terminate") {
        for (const device of existDevices) {
          await this.devicesRepository.update(
            { id: device.id },
            {
              status_id: 19,
              modified_date: new Date(),
            }
          );
        }
      }

      return responseMessage.success;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
