import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, DeviceTrackingHealth, Devices } from "src/management_portal/devices/entity/devices.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { In, Not, Repository } from "typeorm";
import { LoggerService } from "../../logger_service/providers/log_service/log_service.service";

@Injectable()
export class ImportDataDeviceService {
  // private readonly suppliers = ["Vissat", "Panasonic"];
  // private readonly placementLocations = ["First Class", "Business Class", "Economy 1", "Economy 2", "Economy 3"];

  constructor(
    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,
    @InjectRepository(DeviceHealth)
    private readonly deviceHealthRepository: Repository<DeviceHealth>,
    @InjectRepository(DeviceDetails)
    private readonly deviceDetailsRepository: Repository<DeviceDetails>,
    @InjectRepository(Flights)
    private readonly flightRepository: Repository<Flights>,
    @InjectRepository(DeviceTrackingHealth)
    private readonly deviceTrackingHealthRepository: Repository<DeviceTrackingHealth>,
    @InjectRepository(DeviceHealthActivities)
    private readonly deviceHealthActivitiesRepository: Repository<DeviceHealthActivities>,

    private readonly logger: LoggerService
  ) {}

  async importDataDevice(): Promise<any> {
    try {
      const flightData = await this.flightRepository.find({
        where: {
          status_id: Not(In([13, 19])),
        },
      });

      for (const flight of flightData) {
        // get id aircraft have flight
        const aircraftIds = flight.aircraft_id;
        // Truy vấn thiết bị dựa trên aircraft_id
        const devices = await this.devicesRepository.find({
          where: {
            aircraft_id: aircraftIds,
          },
        });
        // Lấy danh sách id của các thiết bị
        const deviceIds = devices.map((device) => device.id);

        if (flight.flight_phase == "5" || flight.flight_phase == "6") {
          for (const idDevice of deviceIds) {
            this.devicesRepository.update(idDevice, { status_id: 14 });
            this.importDeviceHealth(idDevice);
            this.importDeviceTrackingHealth(idDevice);
          }
        } else {
          for (const idDevice of deviceIds) {
            this.devicesRepository.update(idDevice, { status_id: 19 });
          }
        }
      }

      return "";
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Failed to import device data");
    }
  }

  private importDeviceHealth(deviceId: string) {
    const statusOptions = ["Healthy", "Warning", "Critical"];
    const status = this.getRandomStatus(statusOptions);
    const cpuUsage = this.getRandomPercentage();
    const memoryUsage = this.getRandomPercentage();
    const diskUsage = this.getRandomPercentage();
    const temperature = this.getRandomTemperature();

    const existDevice = this.deviceHealthRepository.findOne({ where: { device_id: deviceId } });

    if (existDevice) {
      this.deviceHealthRepository.update(
        { device_id: deviceId },
        {
          status: status,
          cpu_usage: cpuUsage,
          memory_usage: memoryUsage,
          disk_usage: diskUsage,
          temperature: temperature,
        }
      );
    } else {
      const newDeviceHealth = this.deviceHealthRepository.create({
        device_id: deviceId,
        status: status,
        cpu_usage: cpuUsage,
        memory_usage: memoryUsage,
        disk_usage: diskUsage,
        temperature: temperature,
      });
      this.deviceHealthRepository.save(newDeviceHealth);
    }

    const newDeviceHealthActivities = this.deviceHealthActivitiesRepository.create({
      device_id: deviceId,
      check_time: new Date(),
      status: status,
      cpu_usage: cpuUsage,
      memory_usage: memoryUsage,
      disk_usage: diskUsage,
      temperature: temperature,
    });
    this.deviceHealthActivitiesRepository.save(newDeviceHealthActivities);
  }

  private importDeviceTrackingHealth(deviceId: string) {
    const newDeviceTrackingHealth = this.deviceTrackingHealthRepository.create({
      device_id: deviceId,
      ping_rate_success: this.getRandomPingRate(),
      packet_loss_rate: this.getRandomPacketLossRate(),
      check_time: new Date(),
    });

    return this.deviceTrackingHealthRepository.save(newDeviceTrackingHealth);
  }

  private getRandomPingRate(): number {
    return parseFloat((Math.random() * 100).toFixed(2)); // Tỷ lệ thành công ping từ 0 đến 100%
  }

  private getRandomPacketLossRate(): number {
    return parseFloat((Math.random() * 100).toFixed(2)); // Tỷ lệ mất gói từ 0 đến 100%
  }

  private getRandomStatus(statusOptions: string[]): string {
    const index = Math.floor(Math.random() * statusOptions.length);
    return statusOptions[index];
  }

  private getRandomPercentage(): number {
    return parseFloat((Math.random() * 100).toFixed(2)); // Giá trị ngẫu nhiên từ 0 đến 100
  }

  private getRandomTemperature(): number {
    return parseFloat((Math.random() * (80 - 20) + 20).toFixed(2)); // Nhiệt độ từ 20 đến 80 độ C
  }

  // private getRandomElement(arr: string[]): string {
  //   return arr[Math.floor(Math.random() * arr.length)];
  // }

  // private getRandomIPv6(): string {
  //   return `2001:0db8:${this.getRandomHex()}:${this.getRandomHex()}:${this.getRandomHex()}:${this.getRandomHex()}:${this.getRandomHex()}:${this.getRandomHex()}`;
  // }

  // private getRandomHex(): string {
  //   return Math.floor(Math.random() * 65536)
  //     .toString(16)
  //     .padStart(4, "0");
  // }

  // async generateDevices(): Promise<any> {
  //   const aircraftIds = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
  //   const totalDevicesPerAircraft = 5;
  //   const totalAircraft = aircraftIds.length;

  //   for (let i = 0; i < totalAircraft * totalDevicesPerAircraft; i++) {
  //     const supplier = this.getRandomElement(this.suppliers);
  //     const flightNumber = aircraftIds[i % totalAircraft]; // Use the modulo operator to cycle through aircraft IDs
  //     const device = {
  //       aircraftId: flightNumber, // Use the aircraft ID
  //       deviceType: 4,
  //       name: `AP-${Math.floor(Math.random() * 255) + 1}-${this.getRandomElement(this.placementLocations)}`,
  //       description: "Access Point",
  //       dateOfManufacture: "2023-12-04",
  //       placementLocation: this.getRandomElement(this.placementLocations),
  //       activationDate: "2024-02-04",
  //       deactivationDate: null,
  //       ipAddress: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
  //       port: "8081",
  //       macAddress: `00:0a:95:9d:68:${Math.floor(Math.random() * 256)
  //         .toString(16)
  //         .padStart(2, "0")}`,
  //       ipv6Address: this.getRandomIPv6(),
  //       firmware: "v1.0.0",
  //       wifiStandard: "802.11ax",
  //       manufacturer: supplier,
  //       model: "Access Point Y",
  //       cpuType: "AMD Ryzen",
  //       supplier: supplier,
  //     };

  //     const newDevice = this.devicesRepository.create({
  //       type_id: device.deviceType,
  //       aircraft_id: device.aircraftId,
  //       name: device.name,
  //       description: device.description,
  //       date_of_manufacture: device.dateOfManufacture,
  //       placement_location: device.placementLocation,
  //       activation_date: device.activationDate,
  //       deactivation_date: device.deactivationDate,
  //       status_id: 14,
  //     });
  //     const deviceData = await this.devicesRepository.save(newDevice);

  //     const newDeviceDetail = this.deviceDetailsRepository.create({
  //       device_id: deviceData.id,
  //       ip_address: device.ipAddress,
  //       port: device.port,
  //       firmware: device.firmware,
  //       ipv6_address: device.ipv6Address,
  //       manufacturer_date: device.dateOfManufacture,
  //       cpu_type: device.cpuType,
  //       mac_address: device.macAddress,
  //       manufacturer: device.manufacturer,
  //       supplier: device.supplier,
  //       model: device.model,
  //       wifi_standard: device.wifiStandard,
  //     });

  //     await this.deviceDetailsRepository.save(newDeviceDetail);
  //   }
  // }
}
