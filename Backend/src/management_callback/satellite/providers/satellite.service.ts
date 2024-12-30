import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { createHash, timingSafeEqual } from "crypto";
import * as dotenv from "dotenv";
import { firstValueFrom } from "rxjs";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { Brackets, In, MoreThanOrEqual, Not, Repository } from "typeorm";
import { DeviceDetails, DeviceHealth, DeviceHealthActivities, Devices, IFCServiceMetrics } from "../../../management_portal/devices/entity/devices.entity";
import { Aircraft } from "../../../management_portal/flights/entity/aircraft.entity";
import { Flights } from "../../../management_portal/flights/entity/flights.entity";
import { Products } from "../../../management_portal/products/entity/product.entity";
import { UserVerifyInformation } from "../../../management_portal/user/entity/user.entity";
import { Vouchers } from "../../../management_portal/vouchers/entity/vouchers.entity";
import { AcctRequestDataDto, AuthSatelliteDto, PreAuthSatelliteDto } from "../dto/satellite.dto";
// import * as radius from "radius";
// import * as dgram from "dgram";
import { ApiSatelliteActivities, AuthenticateVoucher, PreSatelliteUserLogin, SatelliteBlacklistDomains, SatelliteOrderDetails, SatelliteOrderInformation, SatelliteSessions, SatelliteUserLogin, UserAcctTemp } from "../entity/satellite.entity";
import { DataDeviceHealth, DataIFCService, DataUpdateDevice } from "../interface/satellite.interface";
import { generateBase64FromDate } from "src/utils/common";

dotenv.config();

@Injectable()
export class SatelliteService {
  constructor(
    @InjectRepository(SatelliteUserLogin)
    private readonly authSatelliteLoginRepository: Repository<SatelliteUserLogin>,

    @InjectRepository(SatelliteSessions)
    private readonly satelliteSessionsRepository: Repository<SatelliteSessions>,

    @InjectRepository(ApiSatelliteActivities)
    private readonly apiSatelliteActivitiesRepository: Repository<ApiSatelliteActivities>,

    @InjectRepository(PreSatelliteUserLogin)
    private readonly PreSatelliteUserLoginRepository: Repository<PreSatelliteUserLogin>,

    @InjectRepository(UserAcctTemp)
    private readonly userAcctTempRepository: Repository<UserAcctTemp>,

    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @InjectRepository(AuthenticateVoucher)
    private readonly authenticateVoucherRepository: Repository<AuthenticateVoucher>,

    @InjectRepository(UserVerifyInformation)
    private readonly userInfoRepository: Repository<UserVerifyInformation>,

    @InjectRepository(Devices)
    private readonly deviceRepository: Repository<Devices>,

    @InjectRepository(DeviceDetails)
    private readonly deviceDetailRepository: Repository<DeviceDetails>,

    @InjectRepository(Flights)
    private readonly flightRepository: Repository<Flights>,

    @InjectRepository(SatelliteOrderInformation)
    private readonly orderInformationRepository: Repository<SatelliteOrderInformation>,

    @InjectRepository(SatelliteOrderDetails)
    private readonly orderDetailRepository: Repository<SatelliteOrderDetails>,

    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,

    @InjectRepository(Vouchers)
    private readonly voucherRepository: Repository<Vouchers>,

    @InjectRepository(DeviceHealth)
    private readonly deviceHealthRepository: Repository<DeviceHealth>,

    @InjectRepository(DeviceHealthActivities)
    private readonly deviceHealthActivitiesRepository: Repository<DeviceHealthActivities>,

    @InjectRepository(IFCServiceMetrics)
    private readonly IFCServiceMetricsRepository: Repository<IFCServiceMetrics>,

    @InjectRepository(SatelliteBlacklistDomains)
    private readonly satelliteBlacklistDomainsRepository: Repository<SatelliteBlacklistDomains>,

    private readonly httpService: HttpService,

    private readonly logger: LoggerService
  ) {}

  private async forceLogout(username: string, framedIPAddress: string, NasIpAddress: string, callingStationId: string) {
    const url = `http://${NasIpAddress}/logout`; // Adjust the URL and method as needed

    const payload = {
      username: username,
      ipAddress: framedIPAddress,
      macAddress: callingStationId,
    };

    try {
      await firstValueFrom(this.httpService.post(url, payload));
    } catch (error) {
      console.error("Failed to logout user:", error);
    }
  }

  // async disconnectUser(username: string, callingStationId: string, nasIpAddress: string, secret: string) {
  //   try {
  //     // callingStationID is user MAC
  //     const packet = radius.encode({
  //       code: "Disconnect-Request",
  //       secret: secret,
  //       identifier: 0,
  //       attributes: [
  //         ["User-Name", username],
  //         ["Called-Station-Id", callingStationId],
  //       ],
  //     });

  //     const client = dgram.createSocket("udp4");

  //     client.send(packet, 0, packet.length, 3799, nasIpAddress, (err) => {
  //       if (err) {
  //         console.error("Failed to send disconnect request:", err);
  //       } else {
  //         console.log("Disconnect request sent successfully.");
  //       }
  //       client.close();
  //     });
  //   } catch (error) {
  //     console.error("Failed to logout user:", error);
  //   }
  // }

  // async disconnectSession(username: string, nasIp: string): Promise<any> {
  //   const secret = process.env.VTC_JWT_SECRET;
  //   const radiusServer = process.env.RADIUS_SERVER;

  //   const client = dgram.createSocket("udp4");
  //   const port = 3799;

  //   const res = new Promise((resolve, reject) => {
  //     const packet = radius.encode({
  //       code: "Disconnect-Request",
  //       secret: secret,
  //       identifier: 0,
  //       attributes: [
  //         ["User-Name", username],
  //         ["NAS-IP-Address", nasIp],
  //       ],
  //     });

  //     client.send(packet, 0, packet.length, port, radiusServer, (err) => {
  //       if (err) {
  //         client.close();
  //         return reject(`Error sending packet: ${err.message}`);
  //       }
  //       resolve({ message: "Disconnect packet sent successfully" });
  //       console.log("Disconnect-Request sent.");
  //     });

  //     client.on("message", (msg) => {
  //       try {
  //         const response = radius.decode({ packet: msg, secret: secret });
  //         console.log("Received response:", response);
  //         if (response.code === "Disconnect-ACK") {
  //           console.log("Ngắt kết nối thành công!");
  //           client.close();
  //         } else {
  //           console.error("Ngắt kết nối thất bại:", response.code);
  //           client.close();
  //         }
  //       } catch (error) {
  //         client.close();
  //         console.error("Error decoding response:", error.message);
  //       }
  //     });

  //     client.on("error", (err) => {
  //       client.close();
  //       reject(`Socket error: ${err.message}`);
  //       console.log(err.message);
  //     });
  //   });
  //   console.log(res);
  //   return res;
  // }

  // Viasat
  async preValidateUser(data: PreAuthSatelliteDto): Promise<any> {
    try {
      const { clientMac, sip, username, productId } = data;
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Or use your DB-specific format
      const existPreLogin = await this.PreSatelliteUserLoginRepository.findOne({ where: { client_mac: clientMac, username, sip, timestamp: MoreThanOrEqual(fiveMinutesAgo) } });

      if (existPreLogin) {
        await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Failed" });
        return true;
      } else {
        const existDeviceDetail = await this.deviceDetailRepository.findOne({ where: { ip_address: sip } });
        const existDevice = await this.deviceRepository.findOne({ where: { id: existDeviceDetail.device_id } });
        const existAircraft = await this.aircraftRepository.findOne({ where: { id: existDevice.aircraft_id } });
        const existFlight = await this.flightRepository.findOne({ where: { aircraft_id: existAircraft.id, status_id: 14 }, order: { created_date: "DESC" } });

        const queryBuilder = this.PreSatelliteUserLoginRepository.create({
          username,
          client_mac: clientMac,
          device_id: existDevice.id,
          flight_id: existFlight.id,
          login_status: "NoLogin",
          sip,
          timestamp: new Date(),
          product_id: productId,
        });

        await this.PreSatelliteUserLoginRepository.save(queryBuilder);
        return true;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async validateUser(data: AuthSatelliteDto): Promise<boolean> {
    try {
      const { username, password, CHAPpassword, CHAPChallenge, NASIPAddress, callingStationId } = data;

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Or use your DB-specific format

      const existPreLogin = await this.PreSatelliteUserLoginRepository.findOne({ where: { client_mac: callingStationId, username, sip: NASIPAddress, timestamp: MoreThanOrEqual(fiveMinutesAgo) } });
      if (!username) {
        if (existPreLogin) {
          await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Failed" });
        }
        return false;
      }
      if (password === process.env.VTC_PWD_SECRET) {
        const existVoucher = await this.authenticateVoucherRepository.findOne({ where: { voucher_code: username, status_id: 14 } });
        if (existVoucher) {
          await this.authenticateVoucherRepository.update({ id: existVoucher.id }, { status_id: 19 });
          await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Success" });
          return true;
        } else {
          await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Failed" });
          return false;
        }
      } else {
        const queryBuilder = this.authSatelliteLoginRepository
          .createQueryBuilder("users")
          .where("users.status_id != :statusId", { statusId: 13 })
          .andWhere(
            new Brackets((qb) => {
              qb.where("users.username = :username", { username });
            })
          );

        const user = await queryBuilder.getOne();

        if (!user) {
          if (existPreLogin) {
            await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Failed" });
          }
          return false;
        }
        let isPasswordValid = false;
        if (CHAPpassword && CHAPChallenge) {
          // Extract the first byte of the CHAP password as the CHAP ID
          const chapId = parseInt(CHAPpassword.slice(0, 2), 16);
          const receivedChapHash = Buffer.from(CHAPpassword.slice(2), "hex");

          // Calculate expected CHAP response
          const chapInput = Buffer.concat([
            Buffer.from([chapId]),
            Buffer.from(user.password), // Stored plaintext password (or CHAP secret)
            Buffer.from(CHAPChallenge, "hex"),
          ]);
          const expectedChapHash = createHash("md5").update(chapInput).digest();

          // Check if received and expected hashes match
          isPasswordValid = timingSafeEqual(receivedChapHash, expectedChapHash);
        } else if (password) {
          // Case 2: Use bcrypt for normal password validation
          isPasswordValid = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordValid) {
          if (existPreLogin) {
            await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Failed" });
          }
          return false;
        } else {
          // const existOrder = await this.orderInformationRepository
          //   .createQueryBuilder("orders")
          //   .where("orders.user_id = :userId", { userId: user.id })
          //   .andWhere("orders.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] })
          //   .orderBy("orders.created_date", "DESC")
          //   .getOne();

          // if (existOrder) {
          //   const newActivities = this.createUserActivities({
          //     user_id: user.id,
          //     flight_id: existOrder.flight_id,
          //     start_time: new Date(),
          //     status_id: 14,
          //   });
          //   await this.apiSatelliteActivitiesRepository.save(newActivities);
          //   return true;
          // } else {
          //   return false;
          // }
          await this.PreSatelliteUserLoginRepository.update({ id: existPreLogin.id }, { login_status: "Success" });
          return true;
        }
      }
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   return false;
      // } else {
      //   const existOrder = await this.orderInformationRepository
      //     .createQueryBuilder("orders")
      //     .where("orders.user_id = :userId", { userId: user.id })
      //     .andWhere("orders.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] })
      //     .orderBy("orders.created_date", "DESC")
      //     .getOne();
      //   if (existOrder) {
      //     const newActivities = this.createUserActivities({ user_id: user.id, flight_id: existOrder?.flight_id, start_time: new Date(), status_id: 14 });
      //     await this.apiSatelliteActivitiesRepository.save(newActivities);
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async disconnectSession(sessionId: string): Promise<any> {
    try {
      const existSessionActive = await this.satelliteSessionsRepository.findOne({ where: { id: sessionId, session_status: "Active" } });
      if (!existSessionActive) {
        throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }
      const requestId = await generateBase64FromDate();
      const disconnectDevice = {
        acctSessionId: sessionId,
        requestId,
      };
      const nodeURL = `${process.env.GATEWAY_SERVER}/devices_management/interrupt_session`;
      const response = await this.httpService.post(nodeURL, disconnectDevice).toPromise();
      // Check if the response is successful
      if (response.data.message === "success") {
        // Update session status to Pending
        await this.satelliteSessionsRepository.update(sessionId, {
          session_status: "Pending",
          modified_date: new Date(),
        });

        // Simulate delay for logout
        setTimeout(async () => {
          await this.satelliteSessionsRepository.update(sessionId, {
            session_status: "Inactive",
            modified_date: new Date(),
          });
        }, 500); // Simulate delay for logout
        return response.data;
      } else {
        // Handle case when response is not successful
        throw new InternalServerErrorException({
          code: -5,
          message: "Failed to disconnect session",
        });
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async disconnectSessionOnFlight(flightNumber: string): Promise<any> {
    try {
      const existAircraft = await this.aircraftRepository.findOne({ where: { flight_number: flightNumber, status_id: Not(In([13, 19])) } });
      if (!existAircraft) {
        throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }

      const existFlightActive = await this.flightRepository.findOne({ where: { aircraft_id: existAircraft.id, status_id: Not(In([13, 19])) } });

      if (!existFlightActive) {
        throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }

      const allDeviceOnAircraft = await this.deviceRepository.find({ where: { aircraft_id: existAircraft.id, status_id: Not(In([13, 19])) } });

      if (allDeviceOnAircraft.length <= 0) {
        throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }
      const requestId = await generateBase64FromDate();
      const disconnectOnFlight = {
        flightNumber: flightNumber,
        requestId,
      };

      const nodeURL = `${process.env.GATEWAY_SERVER}/devices_management/interrupt_session_flight`;
      const response = await this.httpService.post(nodeURL, disconnectOnFlight).toPromise();
      // Check if the response is successful
      if (response.data.message === "success") {
        // Update session status to Pending
        await this.satelliteSessionsRepository.update(
          { flight_id: existFlightActive.id },
          {
            session_status: "Pending",
            modified_date: new Date(),
          }
        );

        // Simulate delay for logout
        setTimeout(async () => {
          await this.satelliteSessionsRepository.update(
            { flight_id: existFlightActive.id },
            {
              session_status: "Inactive",
              modified_date: new Date(),
            }
          );
        }, 500); // Simulate delay for logout
      } else {
        // Handle case when response is not successful
        throw new InternalServerErrorException({
          code: -5,
          message: "Failed to disconnect session",
        });
      }
      return response.data;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async checkDeviceStatusViasat(dataDeviceHealth: DataDeviceHealth): Promise<any> {
    try {
      const existDevice = await this.deviceRepository.findOne({ where: { id: dataDeviceHealth.deviceId, status_id: Not(In([13, 19])) } });
      const existDeviceHealth = await this.deviceHealthRepository.findOne({ where: { device_id: dataDeviceHealth.deviceId } });
      if (existDevice) {
        if (!existDeviceHealth) {
          const newDeviceHealth = await this.deviceHealthRepository.create({
            device_id: existDevice.id,
            status: dataDeviceHealth.status,
            cpu_usage: dataDeviceHealth.cpuUsage,
            memory_usage: dataDeviceHealth.memoryUsage,
            temperature: dataDeviceHealth.temperature,
          });
          await this.deviceHealthRepository.save(newDeviceHealth);
        } else {
          await this.deviceHealthRepository.update(
            { device_id: existDeviceHealth.device_id },
            {
              device_id: dataDeviceHealth.deviceId,
              status: dataDeviceHealth.status,
              cpu_usage: dataDeviceHealth.cpuUsage,
              memory_usage: dataDeviceHealth.memoryUsage,
              temperature: dataDeviceHealth.temperature,
              modified_date: new Date(),
            }
          );
        }

        const newDeviceHealthActivities = await this.deviceHealthActivitiesRepository.create({
          device_id: existDevice.id,
          status: dataDeviceHealth.status,
          cpu_usage: dataDeviceHealth.cpuUsage,
          memory_usage: dataDeviceHealth.memoryUsage,
          temperature: dataDeviceHealth.temperature,
          check_time: new Date(),
        });
        await this.deviceHealthActivitiesRepository.save(newDeviceHealthActivities);
      } else {
        throw new InternalServerErrorException({ code: -4, message: "Thiết bị không tồn tại" });
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async checkIFCService(dataIFCService: DataIFCService): Promise<any> {
    try {
      const existDevice = await this.deviceRepository.findOne({ where: { id: dataIFCService.deviceId, status_id: Not(In([13, 19])) } });
      if (existDevice) {
        const newIFCService = await this.IFCServiceMetricsRepository.create({
          device_id: dataIFCService.deviceId,
          flight_id: dataIFCService.flightId,
          speed: dataIFCService.speed,
          latency: dataIFCService.latency,
          bandwidth_usage: dataIFCService.bandwidthUsage,
          packet_loss_rate: dataIFCService.packetLossRate,
          connection_quality: dataIFCService.connectionQuality,
          uptime: dataIFCService.uptime,
          downtime: dataIFCService.downtime,
          unauthorized_access_attempts: dataIFCService.unauthorizedAccessAttempts,
          failed_connections: dataIFCService.failedConnections,
          concurrent_users: dataIFCService.concurrentUsers,
        });
        await this.IFCServiceMetricsRepository.save(newIFCService);
      } else {
        throw new InternalServerErrorException({ code: -4, message: "Thiết bị không tồn tại" });
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleBlacklistSync(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.satelliteBlacklistDomainsRepository.createQueryBuilder("blacklist_domains").where("blacklist_domains.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] });

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("blacklist_domains.name = :filters", { filters })
              .orWhere("blacklist_domains.url = :filters", { filters })
              .orWhere("blacklist_domains.ip_address = :filters", { filters })
              .orWhere("blacklist_domains.ipv6_address = :filters", { filters })
              .orWhere("blacklist_domains.dns_address = :filters", { filters });
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

  async updateConfigDevice(data: DataUpdateDevice): Promise<any> {
    try {
      const requestId = await generateBase64FromDate();
      const updateDevice = {
        ...data,
        requestId: requestId,
      };
      const nodeURL = `${process.env.GATEWAY_SERVER}/devices_management/update_config_device`;
      const response = await this.httpService.post(nodeURL, updateDevice).toPromise();

      return response.data;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async receiveConfigDevice(dataUpdateDevice: DataUpdateDevice): Promise<any> {
    try {
      const existDevice = await this.deviceRepository.findOne({ where: { id: dataUpdateDevice.deviceId } });
      if (!existDevice) {
        throw new InternalServerErrorException({ code: -4, message: "Thiết bị không tồn tại" });
      }
      await this.deviceDetailRepository.update({ id: existDevice.id }, { firmware: dataUpdateDevice.firmware, wifi_standard: dataUpdateDevice.wifiStandard, ip_address: dataUpdateDevice.ipAddress, port: dataUpdateDevice.port });
      const newDeviceData = await this.deviceDetailRepository.findOne({ where: { device_id: existDevice.id } });
      return newDeviceData;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findIFCService(page: number, pageSize: number, filters: string): Promise<{ data: unknown[]; total: number; totalPages: number }> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.IFCServiceMetricsRepository.createQueryBuilder("IFC_service_metrics");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("IFC_service_metrics.flight_id = :filters", { filters }).orWhere("airlines.device_id = :filters", { filters });
          })
        );
      }
      const [IFCServiceData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: IFCServiceData.length > 0 ? IFCServiceData : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  //
  async getPendingDataSessions(sessionId: string, dataTotalNew: number) {
    try {
      const existSessionInactive = await this.satelliteSessionsRepository.findOne({ where: { id: sessionId, session_status: "Pending" } });
      if (existSessionInactive) {
        const dataPending = dataTotalNew - existSessionInactive.total_data_usage;
        await this.satelliteSessionsRepository.update(
          { id: sessionId },
          {
            total_data_pending: dataPending,
          }
        );
      } else {
        throw new InternalServerErrorException({ code: -4, message: "Không tìm thấy phiên" });
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async accountingUser(dataRequest: AcctRequestDataDto): Promise<any> {
    try {
      const { NASIPAddress, NASIdentifier, acctAuthentic, acctInputOctets, acctMultiSessionId, acctOutputOctets, acctSessionId, acctSessionTime, acctStatusType, acctTerminateCause, callingStationId, eventTimestamp, username } = dataRequest;
      const newMacAddress = this.formatMacAddress(callingStationId);

      const errorList = [];
      const addedList = [];
      const updatedList = [];
      const stoppedList = [];

      let existOrder;
      let existOrderDetail;
      let existProduct: Products;

      // const { averageSpeedMbps, bytesReceived, bytesTransferred, connectionQuality, dataUsageMb, destinationIp, domain, port, protocol, referrer, responseTimeMs, sslVersion, startTime, stopTime, url, userAgent, userIpAddress, userMacAddress } =
      //   sessionDetail;
      try {
        const existUserTemp = await this.userAcctTempRepository.findOne({ where: { username: username, client_mac: newMacAddress }, order: { created_date: "DESC" } });
        // const currentDate = new Date();
        const existTimestamp = new Date(existUserTemp.timestamp);
        const parsedStartDate = new Date(eventTimestamp);
        // const parsedStopDate = new Date(eventTimestamp);
        // const parsedEventTimeStamp = new Date(eventTimestamp);
        const checkTimeDifference = Math.abs(parsedStartDate.getTime() - existTimestamp.getTime()) / 1000;

        // if (parsedStartDate < currentDate || parsedStopDate < currentDate || parsedStartDate > parsedStopDate || parsedEventTimeStamp < currentDate || parsedEventTimeStamp > parsedStopDate) {
        //   errorList.push({ note: "Thời gian không hợp lý", data: dataRequest });
        //   // continue;
        // }

        const existUser = await this.userInfoRepository.findOne({ where: { username: username } });
        const existVoucher = await this.voucherRepository.findOne({ where: { voucher_code: username } });

        // if (!existUser) {
        //   errorList.push({ note: "Username không tồn tại", data: dataRequest });
        //   // continue;
        // }
        const existDeviceDetail = await this.deviceDetailRepository.findOne({
          where: { ip_address: NASIPAddress },
        });

        if (!existDeviceDetail) {
          errorList.push({ note: "Thiết bị không tồn tại", data: dataRequest });
          // continue;
        }

        const existDevice = await this.deviceRepository.findOne({
          where: { id: existDeviceDetail.device_id },
        });
        const existFlight = await this.flightRepository.findOne({ where: { aircraft_id: existDevice.aircraft_id } });

        if (existUser) {
          existOrder = await this.orderInformationRepository.findOne({ where: { user_id: existUser.id } });

          if (!existFlight || !existOrder) {
            errorList.push({ note: "Thiết bị, chuyến bay, hoặc đơn hàng không tồn tại", data: dataRequest });
            // continue;
          }
          existOrderDetail = await this.orderDetailRepository.findOne({ where: { order_id: existOrder.id } });

          if (!existOrderDetail) {
            errorList.push({ note: "Đơn hàng không tồn tại", data: dataRequest });
            // continue;
          }

          existProduct = await this.productRepository.findOne({ where: { id: existOrderDetail.product_id } });
          if (!existProduct) {
            errorList.push({ note: "Sản phẩm không tồn tại", data: dataRequest });
            // continue;
          }
        }

        if (existVoucher) {
          existProduct = await this.productRepository.findOne({ where: { id: existVoucher.product_id } });
          if (!existProduct) {
            errorList.push({ note: "Sản phẩm không tồn tại", data: dataRequest });
            // continue;
          }
        }

        const sessionTimeInHours = Number(acctSessionTime) / 3600;

        // Convert data usage from bytes to megabytes
        const inputDataInMB = Number(acctInputOctets) / (1024 * 1024);
        const outputDataInMB = Number(acctOutputOctets) / (1024 * 1024);
        const totalDataInMB = inputDataInMB + outputDataInMB;
        if (checkTimeDifference <= 300) {
          switch (acctStatusType) {
            case "Start": {
              // eslint-disable-next-line no-case-declarations
              let newSession;
              if (existUser) {
                newSession = this.satelliteSessionsRepository.create({
                  user_id: existUser.id,
                  flight_id: existOrder.flight_id,
                  product_id: existOrderDetail.product_id,
                  total_data_usage: totalDataInMB,
                  total_data_upload: inputDataInMB,
                  total_data_download: outputDataInMB,
                  total_time_usage_hour: sessionTimeInHours,
                  device_id: existUserTemp.device_id,
                  session_status: "Active",
                  acct_session_id: acctSessionId,
                  acct_authentic: acctAuthentic,
                  acct_multisession_id: acctMultiSessionId,
                  user_mac_address: callingStationId,
                  // user_ip_address: userIpAddress,
                  // user_device: userDevice,
                  modified_date: new Date(eventTimestamp),
                  type_session: "user",
                });
              } else if (existVoucher) {
                newSession = this.satelliteSessionsRepository.create({
                  voucher_id: existVoucher.id,
                  flight_id: existFlight.id,
                  product_id: existProduct.id,
                  total_data_usage: totalDataInMB,
                  total_data_upload: inputDataInMB,
                  total_data_download: outputDataInMB,
                  total_time_usage_hour: sessionTimeInHours,
                  device_id: existUserTemp.device_id,
                  session_status: "Active",
                  acct_session_id: acctSessionId,
                  acct_authentic: acctAuthentic,
                  acct_multisession_id: acctMultiSessionId,
                  user_mac_address: callingStationId,
                  // user_ip_address: userIpAddress,
                  // user_device: userDevice,
                  modified_date: new Date(eventTimestamp),
                  type_session: "voucher",
                });
              }

              // eslint-disable-next-line no-case-declarations
              const createdSession = await this.satelliteSessionsRepository.save(newSession);

              // eslint-disable-next-line no-case-declarations
              // const newSessionDetail = this.createSessionDetail({
              //   session_id: createdSession.id,
              //   average_speed_mbps: averageSpeedMbps,
              //   session_catalog_id: Number(await this.getSessionCatalogIdByUrlDomain(url, domain)),
              //   bytes_received: bytesReceived,
              //   bytes_transferred: bytesTransferred,
              //   connection_quality: connectionQuality,
              //   data_usage_mb: dataUsageMb,
              //   destination_ip: destinationIp,
              //   domain: domain,
              //   port: port,
              //   protocol: protocol,
              //   referrer: referrer,
              //   response_time_ms: responseTimeMs,
              //   ssl_version: sslVersion,
              //   start_time: startTime,
              //   stop_time: stopTime,
              //   url: url,
              //   user_agent: String(this.getBrowserName(userAgent)),
              //   user_ip_address: userIpAddress,
              //   user_mac_address: userMacAddress,
              //   status_id: 14,
              // });

              // await this.satelliteSessionDetailsRepository.save(newSessionDetail);

              // eslint-disable-next-line no-case-declarations

              if (existUser) {
                const newActivities = this.createUserActivities({
                  user_id: existUser.id,
                  device_id: existUserTemp.device_id,
                  session_id: createdSession.id,
                  start_time: parsedStartDate,
                  // flight_id: 415,
                  status_id: 14,
                  // total_data_usage_mb: dataUsageMb,
                });

                await this.apiSatelliteActivitiesRepository.update(
                  { user_id: existUser.id },
                  {
                    session_id: createdSession.id,
                    device_id: existUserTemp.device_id,
                    total_data_usage_mb: totalDataInMB,
                    modified_date: new Date(),
                  }
                );
                await this.apiSatelliteActivitiesRepository.save(newActivities);
              }

              addedList.push(createdSession);
              break;
            }
            case "Interim-Update": {
              // eslint-disable-next-line no-case-declarations
              const productTotalData = existProduct.data_total / 1024;
              // // eslint-disable-next-line no-case-declarations
              const productDataUpload = existProduct.data_upload / 1024;
              // // eslint-disable-next-line no-case-declarations
              const productDataDownload = existProduct.data_download / 1024;
              // // eslint-disable-next-line no-case-declarations
              const productTotalTime = existProduct.total_time / 60;

              if (productTotalData <= totalDataInMB || productDataUpload <= inputDataInMB || productDataDownload <= outputDataInMB || productTotalTime <= sessionTimeInHours) {
                const existCurrentSession = await this.satelliteSessionsRepository.findOne({ where: { acct_session_id: acctSessionId } });
                // const existCurrentSessionDetail = await this.satelliteSessionDetailsRepository.findOne({ where: { session_id: existCurrentSession.id } });
                const dataPending = totalDataInMB - existCurrentSession.total_data_usage;

                await this.satelliteSessionsRepository.update(
                  { acct_session_id: acctSessionId },
                  {
                    total_data_pending: dataPending,
                    total_data_upload: inputDataInMB,
                    total_data_download: outputDataInMB,
                    total_time_usage_hour: sessionTimeInHours,
                    device_id: existUserTemp.device_id,
                    session_status: "Pending",
                    acct_session_id: acctSessionId,
                    acct_authentic: acctAuthentic,
                    acct_multisession_id: acctMultiSessionId,
                    user_mac_address: callingStationId,
                    // user_ip_address: userIpAddress,
                    modified_date: new Date(eventTimestamp),
                  }
                );
                //   // await this.orderInformationRepository.update({ id: existOrder.id }, { status_id: 19 });
                //   // await this.satelliteSessionDetailsRepository.update(
                //   //   { id: existCurrentSessionDetail.id },
                //   //   {
                //   //     session_id: existCurrentSession.id,
                //   //     session_catalog_id: Number(await this.getSessionCatalogIdByUrlDomain(url, domain)),
                //   //     average_speed_mbps: averageSpeedMbps,
                //   //     bytes_received: bytesReceived,
                //   //     bytes_transferred: bytesTransferred,
                //   //     connection_quality: connectionQuality,
                //   //     data_usage_mb: dataUsageMb,
                //   //     destination_ip: destinationIp,
                //   //     domain: domain,
                //   //     port: port,
                //   //     protocol: protocol,
                //   //     referrer: referrer,
                //   //     response_time_ms: responseTimeMs,
                //   //     ssl_version: sslVersion,
                //   //     start_time: startTime,
                //   //     stop_time: stopTime,
                //   //     url: url,
                //   //     user_agent: String(this.getBrowserName(userAgent)),
                //   //     user_ip_address: userIpAddress,
                //   //     user_mac_address: userMacAddress,
                //   //     status_id: 19,
                //   //   }
                //   // );

                // const secret = process.env.VTC_JWT_SECRET;
                await this.getPendingDataSessions(existCurrentSession.id, totalDataInMB);

                // MD: Viết tiếp
                // await this.apiSatelliteActivitiesRepository.update(
                //   { user_id: existUser.id, session_id: existCurrentSession.id },
                //   {
                //     total_data_usage_mb: totalDataInMB,
                //     // end_time: stopTime,
                //     status_id: 19,
                //     modified_date: new Date(),
                //   }
                // );

                // stoppedList.push(acctSessionId);
                break;
              } else {
                await this.satelliteSessionsRepository.update(
                  { acct_session_id: acctSessionId },
                  {
                    total_data_usage: totalDataInMB,
                    total_data_upload: inputDataInMB,
                    total_data_download: outputDataInMB,
                    total_time_usage_hour: sessionTimeInHours,
                    // device_id: existUserTemp.device_id,
                    session_status: "Active",
                    acct_session_id: acctSessionId,
                    acct_authentic: acctAuthentic,
                    acct_multisession_id: acctMultiSessionId,
                    user_mac_address: callingStationId,
                    // user_ip_address: userIpAddress,
                    modified_date: new Date(eventTimestamp),
                  }
                );

                const existCurrentSession = await this.satelliteSessionsRepository.findOne({ where: { acct_session_id: acctSessionId, session_status: "Active" } });
                //   // const existCurrentSessionDetail = await this.satelliteSessionDetailsRepository.findOne({ where: { session_id: existCurrentSession.id } });

                //   // if (url != existCurrentSessionDetail.url && domain != existCurrentSessionDetail.domain) {
                //   //   await this.satelliteSessionDetailsRepository.update({ id: existCurrentSessionDetail.id }, { status_id: 19 });

                //   //   const newSessionDetail = this.createSessionDetail({
                //   //     session_id: existCurrentSession.id,
                //   //     session_catalog_id: Number(await this.getSessionCatalogIdByUrlDomain(url, domain)),
                //   //     average_speed_mbps: averageSpeedMbps,
                //   //     bytes_received: bytesReceived,
                //   //     bytes_transferred: bytesTransferred,
                //   //     connection_quality: connectionQuality,
                //   //     data_usage_mb: dataUsageMb,
                //   //     destination_ip: destinationIp,
                //   //     domain: domain,
                //   //     port: port,
                //   //     protocol: protocol,
                //   //     referrer: referrer,
                //   //     response_time_ms: responseTimeMs,
                //   //     ssl_version: sslVersion,
                //   //     start_time: startTime,
                //   //     stop_time: stopTime,
                //   //     url: url,
                //   //     user_agent: String(this.getBrowserName(userAgent)),
                //   //     user_ip_address: userIpAddress,
                //   //     user_mac_address: userMacAddress,
                //   //     status_id: 14,
                //   //   });

                //   //   await this.satelliteSessionDetailsRepository.save(newSessionDetail);
                //   //   updatedList.push(acctSessionId);
                //   //   break;
                // } else {
                //   await this.satelliteSessionDetailsRepository.update(
                //     { id: existCurrentSessionDetail.id },
                //     {
                //       session_id: existCurrentSessionDetail.session_id,
                //       session_catalog_id: Number(await this.getSessionCatalogIdByUrlDomain(url, domain)),
                //       average_speed_mbps: averageSpeedMbps,
                //       bytes_received: bytesReceived,
                //       bytes_transferred: bytesTransferred,
                //       connection_quality: connectionQuality,
                //       data_usage_mb: dataUsageMb,
                //       destination_ip: destinationIp,
                //       domain: domain,
                //       port: port,
                //       protocol: protocol,
                //       referrer: referrer,
                //       response_time_ms: responseTimeMs,
                //       ssl_version: sslVersion,
                //       start_time: startTime,
                //       stop_time: stopTime,
                //       url: url,
                //       user_agent: String(this.getBrowserName(userAgent)),
                //       user_ip_address: userIpAddress,
                //       user_mac_address: userMacAddress,
                //       status_id: 14,
                //       modified_date: new Date(eventTimestamp),
                //     }
                //   );
                // }
                if (existUser) {
                  await this.apiSatelliteActivitiesRepository.update(
                    { user_id: existUser.id, session_id: existCurrentSession.id },
                    {
                      total_data_usage_mb: totalDataInMB,
                      status_id: 14,
                      modified_date: new Date(),
                    }
                  );
                }

                updatedList.push(acctSessionId);
                break;
              }
            }
            case "Stop":
              // eslint-disable-next-line no-case-declarations
              const existCurrentSession = await this.satelliteSessionsRepository.findOne({ where: { acct_session_id: acctSessionId, session_status: "Pending" } });
              // eslint-disable-next-line no-case-declarations
              // const existCurrentSessionDetail = this.satelliteSessionDetailsRepository.findOne({ where: { session_id: existCurrentSession.id } });

              await this.satelliteSessionsRepository.update(
                { acct_session_id: acctSessionId },
                {
                  total_data_usage: totalDataInMB,
                  total_data_upload: inputDataInMB,
                  total_data_download: outputDataInMB,
                  total_time_usage_hour: sessionTimeInHours,
                  device_id: existUserTemp.device_id,
                  session_status: "Inactive",
                  acct_session_id: acctSessionId,
                  acct_authentic: acctAuthentic,
                  acct_multisession_id: acctMultiSessionId,
                  terminate_reason: acctTerminateCause,
                  user_mac_address: callingStationId,
                  // user_ip_address: userIpAddress,
                  modified_date: new Date(eventTimestamp),
                }
              );
              // await this.satelliteSessionDetailsRepository.update(
              //   { id: existCurrentSessionDetail.id },
              //   {
              //     session_id: existCurrentSessionDetail.session_id,
              //     session_catalog_id: Number(await this.getSessionCatalogIdByUrlDomain(url, domain)),
              //     average_speed_mbps: averageSpeedMbps,
              //     bytes_received: bytesReceived,
              //     bytes_transferred: bytesTransferred,
              //     connection_quality: connectionQuality,
              //     data_usage_mb: dataUsageMb,
              //     destination_ip: destinationIp,
              //     domain: domain,
              //     port: port,
              //     protocol: protocol,
              //     referrer: referrer,
              //     response_time_ms: responseTimeMs,
              //     ssl_version: sslVersion,
              //     start_time: startTime,
              //     stop_time: stopTime,
              //     url: url,
              //     user_agent: String(this.getBrowserName(userAgent)),
              //     user_ip_address: userIpAddress,
              //     user_mac_address: userMacAddress,
              //     status_id: 19,
              //     modified_date: new Date(eventTimestamp),
              //   }
              // );
              if (existUser) {
                await this.apiSatelliteActivitiesRepository.update(
                  { user_id: existUser.id, session_id: existCurrentSession.id },
                  {
                    total_data_usage_mb: totalDataInMB,
                    // end_time: stopTime,
                    status_id: 19,
                    modified_date: new Date(),
                  }
                );
              }
              stoppedList.push(acctSessionId);

              // await this.forceLogout(username, framedIPAddress, NASIPAddress, callingStationId);
              // await this.orderInformationRepository.update({ id: existOrder.id }, { status_id: 19 });
              // stoppedList.push(item.acctSessionId);
              // default:
              //   errorList.push({ note: "acctStatusType không hợp lệ", data: item });
              // // continue;
              break;
          }
        }
      } catch (error) {
        errorList.push({ note: "Lỗi trong quá trình xử lý", error: error.message, data: dataRequest });
      }

      return {
        errors: errorList,
        added: addedList,
        updated: updatedList,
        stopped: stoppedList,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  // private async findOrderDetail(orderId: string) {
  //   return this.satelliteOrderDetailsRepository.createQueryBuilder("order_details").where("order_details.order_id = :orderId", { orderId }).getOne();
  // }

  // private getBrowserName(userAgent: string): string {
  //   // A simple function to extract the browser name from user agent string
  //   if (userAgent.includes("Chrome")) return "Chrome";
  //   if (userAgent.includes("Firefox")) return "Firefox";
  //   if (userAgent.includes("Safari")) return "Safari";
  //   if (userAgent.includes("Edge")) return "Edge";
  //   if (userAgent.includes("IE")) return "Internet Explorer";
  //   return "Unknown";
  // }

  private createUserActivities(activitiesData: Partial<ApiSatelliteActivities>): ApiSatelliteActivities {
    return this.apiSatelliteActivitiesRepository.create(activitiesData);
  }

  private formatMacAddress(macAddress) {
    // Loại bỏ dấu gạch ngang và chuyển đổi sang chữ thường
    return macAddress.replace(/-/g, "").toLowerCase();
  }

  // private createSessionDetail(sessionDetailData: Partial<SatelliteSessionDetails>): SatelliteSessionDetails {
  //   return this.satelliteSessionDetailsRepository.create(sessionDetailData);
  // }
}
