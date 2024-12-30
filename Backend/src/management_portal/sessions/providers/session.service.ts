import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindSessionDetails, FindSessions, SessionDetails, Sessions, UserSessionActivities } from "src/management_portal/sessions/entity/session.entity";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { checkIsValidUUID } from "src/utils/common";
import { faker } from "@faker-js/faker";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionDetails)
    private readonly sessionDetailsRepository: Repository<SessionDetails>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(UserSessionActivities)
    private readonly userSessionActivitiesRepository: Repository<UserSessionActivities>,
    @InjectRepository(FindSessionDetails)
    private readonly findSessionDetailsRepository: Repository<FindSessionDetails>,
    @InjectRepository(FindSessions)
    private readonly sessionRepository: Repository<FindSessions>,
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    @InjectRepository(Flights)
    private readonly flightRepository: Repository<Flights>,
    private readonly logger: LoggerService
  ) {}
  private websiteDomains = [
    "https://www.facebook.com/",
    "https://www.thegioididong.com/",
    "https://cellphones.com.vn/",
    "https://vissatsolutions.com/",
    "https://www.vietnamairlines.com/vn/vi/home",
    "https://www.youtube.com/",
    "https://www.w3schools.com/",
    "https://translate.google.com/",
    "https://docs.github.com/",
    "https://chatgpt.com/",
    "https://shopee.vn/",
    "https://www.lazada.vn/",
    "https://www.chotot.com/",
    "https://docs.google.com/",
    "https://www.tiktok.com/",
    "https://claude.ai/",
    "https://store.steampowered.com/",
    "https://fptplay.vn/",
    "https://phimmoi.sale/",
    "https://www.iq.com/",
  ];

  generateRandomData() {
    const start_time = faker.date.recent();
    const duration_seconds = faker.number.int({ min: 300, max: 3600 });
    const stop_time = new Date(start_time.getTime() + duration_seconds * 1000);

    return {
      product_id: faker.number.int(3),
      start_time: start_time,
      stop_time: stop_time,
      user_ip_address: faker.internet.ipv4(),
      user_mac_address: faker.internet.mac(),
      data_usage_mb: faker.number.int({ min: 1, max: 500 }), // Random data usage in MB
      average_speed_mbps: faker.number.int({ min: 6, max: 25 }), // Random speed in Mbps
      bytes_transferred: faker.number.int({ min: 1000, max: 10000 }), // Random bytes transferred
      bytes_received: faker.number.int({ min: 1000, max: 10000 }), // Random bytes received
      url: faker.internet.url(),
      destination_ip: faker.internet.ipv4(),
      connection_quality: faker.helpers.arrayElement(["Excellent", "Good", "Fair", "Poor"]),
      domain: faker.internet.domainName(),
      port: faker.number.int(443),
      user_agent: faker.internet.userAgent(),
      referrer: faker.internet.url(),
      response_time_ms: faker.number.int({ min: 1, max: 1000 }),
      ssl_version: faker.helpers.arrayElement(["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"]),
      protocol: faker.helpers.arrayElement(["HTTP", "HTTPS", "FTP", "SSH"]),
      device: faker.helpers.arrayElement(["Android", "IOS", "Ipad", "Laptop", "Windows", "MacOS", "Ubuntu", "Linux", "Others", "Unknown"]),
    };
  }

  async findSessionDetails(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      const queryBuilder = this.sessionDetailsRepository
        .createQueryBuilder("session_details")
        .leftJoinAndSelect("session_details.session", "sessions")
        .leftJoinAndSelect("sessions.user", "user")
        .leftJoinAndSelect("sessions.flight", "flight")
        .leftJoinAndSelect("sessions.device", "device")
        .leftJoinAndSelect("sessions.product", "product")
        .leftJoinAndSelect("flight.aircraft", "aircraft")
        .leftJoinAndSelect("session_details.session_catalog", "session_catalog")
        .where("sessions.id IS NOT NULL")
        .andWhere("session_catalog.id IS NOT NULL")
        .orderBy("sessions.created_date", "DESC");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("user.fullname LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.username LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.email LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.phone_number LIKE :filters", { filters: `%${filters}%` })
              .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
              .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
              .orWhere("session_details.session_id = :sessionId", { sessionId: filters });
          })
        );
      }

      const [sessionDetailListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      const sessionDetailData = sessionDetailListData.map((item: any) => {
        const dataReturn = {
          session: {
            id: item.id,
            start_time: item.start_time,
            stop_time: item.stop_time,
            duration_time: item.duration_time,
            user_ip_address: item.user_ip_address,
            user_mac_address: item.user_mac_address,
            data_usage_mb: item.data_usage_mb,
            average_speed_mbps: item.average_speed_mbps,
            bytes_transferred: item.bytes_transferred,
            bytes_received: item.bytes_received,
            url: item.url,
            destination_ip: item.destination_ip,
            connection_quality: item.connection_quality,
            domain: item.domain,
            port: item.port,
            user_agent: item.user_agent,
            referrer: item.referrer,
            response_time_ms: item.response_time_ms,
            ssl_version: item.ssl_version,
            protocol: item.protocol,
            status_id: item.status_id,
            session_id: item.session.id,
            total_data_usage: item.session.total_data_usage,
            total_data_upload: item.session.total_data_upload,
            total_data_download: item.session.total_data_download,
            total_time_usage_hour: item.session.total_time_usage_hour,
            session_status: item.session.session_status,
            acct_session_id: item.session.acct_session_id,
            acct_multisession_id: item.session.acct_multisession_id,
            terminate_reason: item.session.terminate_reason,
            user_device: item.session.user_device,
          },
          user: {
            id: item.session.user.id,
            fullname: item.session.user.fullname,
            email: item.session.user.email,
            phone_number: item.session.user.phone_number,
            username: item.session.user.username,
            status_id: item.session.user.status_id,
          },
          flight: {
            departure_airport: item.session.flight.departure_airport,
            arrival_airport: item.session.flight.arrival_airport,
            departure_time: item.session.flight.departure_time,
            arrival_time: item.session.flight.arrival_time,
            flight_phase: item.session.flight.flight_phase,
            airline: item.session.flight.airline,
            lat_location: item.session.flight.lat_location,
            long_location: item.session.flight.long_location,
            aircraft_id: item.session.flight.aircraft.id,
            flight_number: item.session.flight.aircraft.flight_number,
            tail_number: item.session.flight.aircraft.tail_number,
            model: item.session.flight.aircraft.model,
            aircraft_status_id: item.session.flight.aircraft.status_id,
          },
          device: {
            id: item.session.device.id,
            name: item.session.device.name,
            description: item.session.device.description,
            date_of_manufacture: item.session.device.date_of_manufacture,
            activation_date: item.session.device.activation_date,
            session_catalog_id: item.session_catalog.id,
            session_catalog_name: item.session_catalog.name,
            session_catalog_description: item.session_catalog.description,
          },
          product: {
            ...item.session.product,
          },
        };
        return dataReturn;
      });
      return {
        data: sessionDetailData.length > 0 ? sessionDetailData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findSessions(page: number, pageSize: number, filters: string, startDate: Date, endDate: Date, productId: number, sessionStatus: string, userDevice: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;
      const adjustedEndDate = endDate !== null ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      const queryBuilder = this.sessionsRepository
        .createQueryBuilder("sessions")
        .leftJoinAndSelect("sessions.user", "user")
        .leftJoinAndSelect("sessions.flight", "flight")
        .leftJoinAndSelect("sessions.device", "device")
        .leftJoinAndSelect("sessions.product", "product")
        .leftJoinAndSelect("flight.aircraft", "aircraft")
        .leftJoinAndSelect("sessions.voucher", "voucher")
        .orderBy("sessions.created_date", "DESC")
        .where("sessions.id IS NOT NULL");

      if (startDate && endDate) {
        queryBuilder.andWhere("sessions.created_date BETWEEN :startDate AND :endDate", { startDate: startDate, endDate: new Date(adjustedEndDate) });
      }
      if (productId) {
        queryBuilder.andWhere("sessions.product_id = :productId", { productId: productId });
      }
      if (sessionStatus) {
        queryBuilder.andWhere("sessions.session_status = :sessionStatus", { sessionStatus: sessionStatus });
      }
      if (userDevice) {
        queryBuilder.andWhere("sessions.user_device = :userDevice", { userDevice: userDevice });
      }

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            if (checkIsValidUUID(filters)) {
              qb.where("sessions.id = :id", { id: filters }).orWhere("sessions.user_id = :userId", { userId: filters }).orWhere("sessions.device_id = :deviceId", { deviceId: filters });
            }
            qb.orWhere("sessions.acct_session_id = :acctSessionId", { acctSessionId: filters })
              .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
              .orWhere("sessions.acct_multisession_id = :acctMultisessionId", { acctMultisessionId: filters })
              .orWhere("sessions.user_mac_address = :userMacAddress", { userMacAddress: filters })
              .orWhere("sessions.user_ip_address = :userIpAddress", { userIpAddress: filters });
          })
        );
      }

      const [sessionListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: sessionListData.length > 0 ? sessionListData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async terminateSessions(id: string): Promise<any> {
    try {
      const queryBuilderSessionDetail = this.findSessionDetailsRepository.createQueryBuilder("session_details").where("session_details.session_id = :sessionId", { sessionId: id });
      const queryBuilderSession = this.sessionsRepository.createQueryBuilder("sessions").where("sessions.id = :id", { id }).andWhere("sessions.session_status = :sessionStatus", { sessionStatus: "Active" });

      const existSessionDetail = await queryBuilderSessionDetail.getMany();
      const existSession = await queryBuilderSession.getOne();
      if (!existSession) {
        throw new ConflictException({ code: -5, message: responseMessage.serviceError });
      }
      if (!existSessionDetail) {
        throw new ConflictException({ code: -5, message: responseMessage.serviceError });
      }
      await this.findSessionDetailsRepository.update(
        { session_id: id },
        {
          status_id: 19,
          modified_date: new Date(),
        }
      );
      await this.sessionsRepository.update({ id }, { session_status: "Inactive", modified_date: new Date() });

      const updatedSession = await this.findSessionDetailsRepository.findOne({ where: { session_id: id } });
      return updatedSession;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async totalDataSessionFlight(flightId: number, startDate: Date, endDate: Date): Promise<any> {
    try {
      const queryBuilder = this.sessionsRepository.createQueryBuilder("sessions");
      if (startDate && endDate) {
        queryBuilder.where("sessions.created_date BETWEEN :startDate AND :endDate", { startDate, endDate });
      }
      if (flightId) {
        queryBuilder.andWhere("sessions.flight_id = :flightId", { flightId: flightId });
      }
      const [dataSessionFlight, count] = await queryBuilder.getManyAndCount();
      if (count <= 0)
        return {
          code: -4,
          message: responseMessage.notFound,
          total: 0,
        };
      const totalDataSession = this.calculateTotalDataSessionFlight(dataSessionFlight);
      return { code: 0, message: responseMessage.success, total: totalDataSession };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async totalDataSessionDetail(sessionId, startTime, endTime): Promise<any> {
    try {
      const queryBuilder = this.sessionDetailsRepository.createQueryBuilder("session_details");
      queryBuilder.andWhere("session_details.start_time = :startTime", { startTime: startTime });
      queryBuilder.andWhere("session_details.stop_time = :endTime", { endTime: endTime });
      queryBuilder.andWhere("session_details.session_id = :sessionId", { sessionId: sessionId });

      const [dataSessionDetail, count] = await queryBuilder.getManyAndCount();
      if (count <= 0)
        return {
          code: -4,
          message: responseMessage.notFound,
          total: 0,
        };
      const totalDataSessionDetail = this.calculateTotalDataSessionDetail(dataSessionDetail);
      return { code: 0, message: responseMessage.success, total: totalDataSessionDetail };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private calculateTotalDataSessionFlight(session: any): number {
    return session.reduce((total, data) => total + data.total_data_usage, 0);
  }
  private calculateTotalDataSessionDetail(session: any): number {
    return session.reduce((total, data) => total + data.data_usage_mb, 0);
  }

  async getUserActivitiesSession(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      const queryBuilder = this.userSessionActivitiesRepository
        .createQueryBuilder("user_activities")
        .leftJoinAndSelect("user_activities.user", "user")
        .leftJoinAndSelect("user_activities.flight", "flight")
        .leftJoinAndSelect("user_activities.device", "device")
        .leftJoinAndSelect("user_activities.session", "session")
        .leftJoinAndSelect("flight.aircraft", "aircraft")
        .orderBy("user_activities.created_date", "DESC");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("user.fullname LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.username LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.email LIKE :filters", { filters: `%${filters}%` })
              .orWhere("user.phone_number LIKE :filters", { filters: `%${filters}%` })
              .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
              .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
              .orWhere("device.name = :deviceName", { deviceName: filters });
          })
        );
      }

      const [userActivitiesData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      const userActivitiesListData = userActivitiesData.map((item: any) => {
        const dataReturn = {
          username: item?.user?.username,
          flight_id: item?.flight?.id,
          departure_airport: item?.flight?.departure_airport,
          arrival_airport: item?.flight?.arrival_airport,
          departure_time: item?.flight?.departure_time,
          arrival_time: item?.flight?.arrival_time,
          start_time: item?.start_time,
          end_time: item?.end_time,
          device_id: item?.device?.id,
          device: item?.device?.name,
          air_craft_id: item?.flight?.aircraft?.id,
          flight_number: item?.flight?.aircraft?.flight_number,
          tail_number: item?.flight?.aircraft?.tail_number,
          total_data_usage_mb: item?.total_data_usage_mb,
        };
        return dataReturn;
      });

      return {
        data: userActivitiesListData.length > 0 ? userActivitiesListData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async fakeDataRadius(userId: string, flightNumber: string, deviceId: string, ipAddress: string, macAddress: string): Promise<any> {
    try {
      const existAircraft = await this.aircraftRepository.findOne({ where: { flight_number: flightNumber } });
      const existFlight = await this.flightRepository.findOne({ where: { aircraft_id: existAircraft.id } });
      const existSessionActive = await this.sessionRepository.findOne({ where: { user_id: userId, session_status: "Active" } });
      if (!existSessionActive) {
        const session = await new FindSessions();
        session.user_device = this.generateRandomData().device;
        session.user_ip_address = ipAddress;
        session.user_mac_address = macAddress;
        session.total_data_usage = 0;
        session.total_data_upload = 0;
        session.total_data_download = 0;
        session.total_time_usage_hour = 0;
        session.session_status = "Active";
        session.modified_date = new Date();
        session.device_id = deviceId;
        session.flight_id = existFlight.id;
        session.user_id = userId; // Gán thông tin người dùng vào session
        session.product_id = 3;

        return this.sessionRepository.save(session);
      } else {
        const sessionUserOnFlight = await this.sessionRepository.findOne({ where: { flight_id: existFlight.id, user_id: userId } });
        const sessionDetailActiveOnSession = await this.sessionDetailsRepository.find({ where: { session_id: sessionUserOnFlight.id } });

        const randomData = this.generateRandomData();
        const currentTime = new Date();
        const websiteName = this.getRandom(this.websiteDomains);
        const sessionDuration = Math.floor(Math.random() * 15) + 5; // 5-20 phút mỗi website

        for (const sessionDetails of sessionDetailActiveOnSession) {
          await this.sessionDetailsRepository.update(
            { id: sessionDetails.id },
            {
              status_id: 19,
            }
          );
        }

        const sessionDetail = new FindSessionDetails();
        sessionDetail.session_id = existSessionActive.id;
        sessionDetail.start_time = currentTime;
        sessionDetail.stop_time = new Date(currentTime.getTime() + sessionDuration * 60 * 1000);
        sessionDetail.duration_time = sessionDuration * 60;
        sessionDetail.data_usage_mb = this.generateRandomNumber(5, 50);
        sessionDetail.url = websiteName;
        sessionDetail.session_catalog_id = 1; // Giả sử 1 là ID cho Internet Browsing
        sessionDetail.status_id = 19;
        sessionDetail.user_ip_address = ipAddress;
        sessionDetail.user_mac_address = macAddress;
        sessionDetail.average_speed_mbps = randomData.average_speed_mbps;
        sessionDetail.bytes_transferred = randomData.bytes_transferred;
        sessionDetail.bytes_received = randomData.bytes_received;
        sessionDetail.connection_quality = randomData.connection_quality;
        sessionDetail.destination_ip = randomData.destination_ip;
        sessionDetail.domain = randomData.domain;
        sessionDetail.port = randomData.port.toString();
        sessionDetail.user_agent = this.getBrowserName(randomData.user_agent);
        sessionDetail.referrer = randomData.referrer;
        sessionDetail.response_time_ms = randomData.response_time_ms;
        sessionDetail.ssl_version = randomData.ssl_version;
        sessionDetail.protocol = randomData.protocol;
        sessionDetail.modified_date = new Date();
        const newsSessionDetail = this.sessionDetailsRepository.save(sessionDetail);
        this.updateSessionTotals(sessionUserOnFlight, sessionDetail);
        return newsSessionDetail;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private getRandom(domains: string[]): string {
    return domains[Math.floor(Math.random() * domains.length)];
  }
  private generateRandomNumber(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }
  private getBrowserName(userAgent: string): string {
    // A simple function to extract the browser name from user agent string
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("IE")) return "Internet Explorer";
    return "Unknown";
  }
  private updateSessionTotals(session: FindSessions, sessionDetail: FindSessionDetails) {
    const userDevice = ["IOS", "Android", "Laptop", "Macbook"];

    const sessionTimeInHours = sessionDetail.duration_time / 3600;
    session.total_data_usage += sessionDetail.data_usage_mb;
    session.total_data_download += sessionDetail.bytes_received / 1024;
    session.total_data_upload += sessionDetail.bytes_transferred / 1024;
    session.user_device = this.getRandom(userDevice);
    session.user_mac_address = sessionDetail.user_mac_address;
    session.user_ip_address = sessionDetail.user_ip_address;
    session.total_time_usage_hour += sessionTimeInHours;
    session.modified_date = new Date();
  }
}
