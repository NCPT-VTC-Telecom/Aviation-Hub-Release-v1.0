import { faker } from "@faker-js/faker";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditLog } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { DeviceInfo } from "src/management_portal/devices/entity/devices.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { Products } from "src/management_portal/products/entity/product.entity";
import { FindSessionDetails, FindSessions, Sessions } from "src/management_portal/sessions/entity/session.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";
import { UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { In, Not, Repository } from "typeorm";
import { LoggerService } from "../../logger_service/providers/log_service/log_service.service";

@Injectable()
export class ImportSessionService {
  private userDevice = ["IOS", "Android", "Laptop", "Macbook"];
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(FindSessionDetails)
    private readonly sessionDetailsRepository: Repository<FindSessionDetails>,
    @InjectRepository(FindSessions)
    private readonly sessionRepository: Repository<FindSessions>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    // @InjectRepository(SessionCatalog)
    // private readonly sessionCatalogRepository: Repository<SessionCatalog>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(DeviceInfo)
    private readonly devicesRepository: Repository<DeviceInfo>,
    @InjectRepository(Flights)
    private readonly flightsRepository: Repository<Flights>,
    @InjectRepository(UserInformation)
    private readonly usersRepository: Repository<UserInformation>
  ) {}

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
      device: faker.helpers.arrayElement(["Android", , "IOS", "Ipad", "Laptop", "Windows", "MacOS", "Ubuntu", "Linux", "Others", "Unknown"]),
    };
  }

  async handleImport(): Promise<any> {
    try {
      // Bước 1: Lọc chuyến bay có status_id là 14
      const flights = await this.flightsRepository.find({ where: { status_id: Not(In([13, 19])) } });
      if (flights.length === 0) {
        throw new InternalServerErrorException({
          code: -5,
          message: "Không tìm thấy chuyến bay phù hợp",
        });
      }

      // Lặp qua từng chuyến bay
      for (const flight of flights) {
        if (flight.flight_phase === "5" || flight.flight_phase === "6") {
          // Bước 2: Lấy aircraft_id từ flight
          const aircraftId = flight.aircraft_id;

          // Bước 3: Chọn những thiết bị có trong aircraft
          const devices = await this.devicesRepository.find({ where: { aircraft_id: aircraftId } });
          if (devices.length === 0) {
            throw new InternalServerErrorException({
              code: -4,
              message: `Không tìm thấy thiết bị phù hợp cho máy bay có ID: ${aircraftId}`,
            });
          }

          // Lặp qua từng thiết bị
          for (const device of devices) {
            // Bước 4: Lấy danh sách người dùng liên quan đến thiết bị
            const users = await this.usersRepository.find({ where: { status_id: Not(In([13, 19])) } });
            if (users.length === 0) {
              throw new InternalServerErrorException({
                code: -5,
                message: "Không tìm thấy người dùng",
              });
            }

            // Lặp qua từng người dùng
            for (const user of users) {
              const existUserSessions = await this.sessionRepository.findOne({ where: { user_id: user.id } });

              if (!existUserSessions) {
                const idDevice = device.id;
                const idUser = user.id;
                const idFLight = flight.id;

                // Tạo session mới cho mỗi người dùng trên thiết bị
                const session = await new FindSessions();
                session.user_device = this.generateRandomData().device;
                session.user_ip_address = this.generateRandomData().user_ip_address;
                session.user_mac_address = this.generateRandomData().user_mac_address;
                session.total_data_usage = 0;
                session.total_data_upload = 0;
                session.total_data_download = 0;
                session.total_time_usage_hour = 0;
                session.session_status = "Active";
                session.modified_date = new Date();
                session.device_id = idDevice;
                session.flight_id = idFLight;
                session.user_id = idUser; // Gán thông tin người dùng vào session
                session.product_id = 3;

                await this.sessionRepository.save(session);
              } else {
                const ipAddress = existUserSessions.user_ip_address;
                const macAddress = existUserSessions.user_mac_address;
                // Giả lập 3 tiếng sử dụng session
                const startTime = new Date();
                const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // 3 giờ sau

                // 1 tiếng đầu: sử dụng chat
                await this.simulateChatSessions(flight.id, macAddress, ipAddress);

                // 2 tiếng còn lại: lướt web
                await this.simulateWebBrowsing(flight.id, macAddress, ipAddress);
              }
            }
          }
        } else {
          // Cập nhật trạng thái session sau khi flight phase nằm ngoài 5 hoặc 6
          const getAllSessionActive = await this.sessionRepository.find({ where: { flight_id: flight.id } });
          const dataSessions = getAllSessionActive.length > 0 ? getAllSessionActive : [];
          for (const session of dataSessions) {
            await this.sessionRepository.update(
              { id: session.id },
              {
                session_status: "Inactive",
                terminate_reason: "Disconnecting",
              }
            );
          }
        }
      }

      return { message: "Hoàn thành giả lập session cho chuyến bay." };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  private async simulateChatSessions(flightId: number, macAddress: string, ipAddress: string) {
    const sessionActiveOnFlight = await this.sessionRepository.find({ where: { flight_id: flightId } });
    const randomData = this.generateRandomData();
    const chatApps = ["Zalo", "Message", "Whatsapp"];
    const currentTime = new Date();

    for (const session of sessionActiveOnFlight) {
      const sessionDetail = new FindSessionDetails();
      sessionDetail.session_id = session.id;
      sessionDetail.start_time = currentTime;
      sessionDetail.stop_time = new Date(currentTime.getTime() + 6 * 60 * 1000); // 5 phút mỗi session
      sessionDetail.duration_time = 300; // 5 phút = 300 giây
      sessionDetail.data_usage_mb = this.generateRandomNumber(1, 10);
      sessionDetail.url = this.getRandomValueFromArray(chatApps);
      sessionDetail.session_catalog_id = 4; // Giả sử 5 là ID cho ứng dụng chat
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
      await this.sessionDetailsRepository.save(sessionDetail);

      this.updateSessionTotals(session, sessionDetail);
    }
  }

  private async simulateWebBrowsing(flightId: number, macAddress: string, ipAddress: string) {
    const sessionActiveOnFlight = await this.sessionRepository.find({ where: { flight_id: flightId } });

    const websiteDomains = [
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
    const randomData = this.generateRandomData();
    const currentTime = new Date();
    const websiteName = this.getRandom(websiteDomains);
    const sessionDuration = Math.floor(Math.random() * 15) + 5; // 5-20 phút mỗi website

    for (const session of sessionActiveOnFlight) {
      const sessionDetail = new FindSessionDetails();
      sessionDetail.session_id = session.id;
      sessionDetail.start_time = currentTime;
      sessionDetail.stop_time = new Date(currentTime.getTime() + sessionDuration * 60 * 1000);
      sessionDetail.duration_time = sessionDuration * 60;
      sessionDetail.data_usage_mb = this.generateRandomNumber(5, 50);
      sessionDetail.url = websiteName;
      sessionDetail.session_catalog_id = 1; // Giả sử 1 là ID cho Internet Browsing
      sessionDetail.status_id = 19;
      sessionDetail.user_ip_address = randomData.user_ip_address;
      sessionDetail.user_mac_address = randomData.user_mac_address;
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
      await this.sessionDetailsRepository.save(sessionDetail);

      this.updateSessionTotals(session, sessionDetail);
    }
  }

  private updateSessionTotals(session: FindSessions, sessionDetail: FindSessionDetails) {
    const sessionTimeInHours = sessionDetail.duration_time / 3600;
    session.total_data_usage += sessionDetail.data_usage_mb;
    session.total_data_download += sessionDetail.bytes_received / 1024;
    session.total_data_upload += sessionDetail.bytes_transferred / 1024;
    session.user_device = this.getRandom(this.userDevice);
    session.user_mac_address = sessionDetail.user_mac_address;
    session.user_ip_address = sessionDetail.user_ip_address;
    session.total_time_usage_hour += sessionTimeInHours;
    session.modified_date = new Date();
  }

  private generateRandomNumber(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  private getRandom(domains: string[]): string {
    return domains[Math.floor(Math.random() * domains.length)];
  }
  // Helper function to extract browser name from user_agent

  private getBrowserName(userAgent: string): string {
    // A simple function to extract the browser name from user agent string
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("IE")) return "Internet Explorer";
    return "Unknown";
  }

  private getRandomValueFromArray(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
}
