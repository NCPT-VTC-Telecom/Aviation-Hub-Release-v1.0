import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AcctSessionDetailSatelliteDto {
  @ApiProperty({ description: "Thời gian bắt đầu phiên", example: "2024-07-04T08:00:00Z" })
  @IsDateString()
  startTime: Date;

  @IsDateString()
  @ApiProperty({ description: "Thời gian kết thúc phiên", example: "2024-07-04T10:00:00Z" })
  stopTime: Date;

  @IsString()
  @ApiProperty({ description: "Địa chỉ IP của người dùng", example: "192.168.1.100" })
  userIpAddress: string;

  @IsString()
  @ApiProperty({ description: "Địa chỉ MAC của người dùng", example: "00:1A:2B:3C:4D:5E" })
  userMacAddress: string;

  @IsNumber()
  @ApiProperty({ description: "Dung lượng dữ liệu sử dụng (MB)", example: 100 })
  dataUsageMb: number;

  @IsNumber()
  @ApiProperty({ description: "Tốc độ trung bình (Mbps)", example: 50 })
  averageSpeedMbps: number;

  @IsNumber()
  @ApiProperty({ description: "Số byte truyền tải", example: 1048576 })
  bytesTransferred: number;

  @IsNumber()
  @ApiProperty({ description: "Số byte nhận được", example: 524288 })
  bytesReceived: number;

  @IsString()
  @ApiProperty({ description: "URL truy cập", example: "https://example.com" })
  url: string;

  @IsString()
  @ApiProperty({ description: "Địa chỉ IP đích", example: "93.184.216.34" })
  destinationIp: string;

  @IsString()
  @ApiProperty({ description: "Chất lượng kết nối", example: "Good" })
  connectionQuality: string;

  @IsString()
  @ApiProperty({ description: "Tên miền truy cập", example: "example.com" })
  domain: string;

  @IsString()
  @ApiProperty({ description: "Cổng truy cập", example: "443" })
  port: string;

  @IsString()
  @ApiProperty({ description: "User Agent của trình duyệt", example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" })
  userAgent: string;

  @IsString()
  @ApiProperty({ description: "Trang web giới thiệu", example: "https://referrer.com" })
  referrer: string;

  @IsString()
  @ApiProperty({ description: "Thời gian phản hồi (ms)", example: 150 })
  responseTimeMs: number;

  @IsString()
  @ApiProperty({ description: "Phiên bản SSL", example: "TLSv1.3" })
  sslVersion: string;

  @IsString()
  @ApiProperty({ description: "Giao thức sử dụng", example: "HTTPS" })
  protocol: string;
}

class AcctSatelliteDto {
  @ApiProperty({ description: "Tài khoản người dùng", example: "user123" })
  @IsString()
  username: string;

  @ApiProperty({ description: "Loại trạng thái tài khoản (ví dụ: Start, Stop, Intern-Update)", example: "Start" })
  @IsString()
  acctStatusType: string;

  @ApiProperty({ description: "Loại xác thực (ví dụ: PAP, CHAP)", example: "PAP" })
  @IsString()
  acctAuthentic: string;

  @ApiProperty({ description: "Địa chỉ IP gói tin gửi đi (Framed IP Address)", example: "192.168.1.100" })
  @IsString()
  framedIPAddress: string;

  @ApiProperty({ description: "Địa chỉ MAC của thiết bị truy cập (Calling Station ID)", example: "00:1A:2B:3C:4D:5E" })
  @IsString()
  callingStationId: string;

  @ApiProperty({ description: "Địa chỉ IP của NAS (Network Access Server)", example: "192.168.1.1" })
  @IsString()
  NASIPAddress: string;

  @ApiProperty({ description: "Cổng NAS (Network Access Server Port)", example: "1812" })
  @IsString()
  NASPort: string;

  @ApiProperty({ description: "Địa chỉ MAC của thiết bị được gọi (Called Station ID)", example: "00:1A:2B:3C:4D:5F" })
  @IsString()
  calledStationId: string;

  @ApiProperty({ description: "Loại cổng NAS (Network Access Server Port Type)", example: "Ethernet" })
  @IsString()
  NASPortType: string;

  @ApiProperty({ description: "Tên NAS (Network Access Server Identifier)", example: "NAS001" })
  @IsString()
  NASIdentifier: string;

  @ApiProperty({ description: "Thông tin kết nối (Connect Info)", example: "User connected via WiFi" })
  @IsString()
  connectInfo: string;

  @ApiProperty({ description: "ID phiên tài khoản (Accounting Session ID)", example: "session123" })
  @IsString()
  acctSessionId: string;

  @ApiProperty({ description: "ID phiên tài khoản đa phiên (Multi-session Accounting ID)", example: "multi123" })
  @IsString()
  acctMultiSessionId: string;

  @ApiProperty({ description: "Thời gian phiên tài khoản (Tính theo gửi theo Giây)", example: 3600 })
  @IsNumber()
  acctSessionTime: number;

  @ApiProperty({ description: "Số byte đầu vào (Input Octets)", example: 1048576 })
  @IsNumber()
  acctInputOctets: number;

  @ApiProperty({ description: "Số byte đầu ra (Output Octets)", example: 524288 })
  @IsNumber()
  acctOutputOctets: number;

  @ApiProperty({ description: "Số gói tin đầu vào (Input Packets)", example: 1000 })
  @IsNumber()
  acctInputPackets: number;

  @ApiProperty({ description: "Số gói tin đầu ra (Output Packets)", example: 500 })
  @IsNumber()
  acctOutputPackets: number;

  @ApiProperty({ description: "Thời điểm sự kiện", example: "2024-07-04T08:00:00Z" })
  @IsString()
  eventTimestamp: string;

  @ApiProperty({ description: "Nguyên nhân kết thúc phiên tài khoản (Acct Terminate Cause)", example: "Admin-Reset" })
  @IsString()
  acctTerminateCause: string;

  @ApiProperty({ description: "Thiết bị của người dùng", example: "Tablet" })
  @IsString()
  userDevice: string;

  @ApiProperty({ description: "Hoạt động của người dùng", example: "Web Browsing" })
  @IsString()
  userActivity: string;

  @ApiPropertyOptional({ description: "Hoạt động chi tiết của người dùng", type: AcctSessionDetailSatelliteDto })
  @IsString()
  sessionDetail?: AcctSessionDetailSatelliteDto;
}

// export class AcctRequestDataDto {
//   @ApiProperty({ description: "Data để ghi nhận hoạt động người dùng", type: [AcctSatelliteDto] })
//   data: AcctSatelliteDto[];
// }

export class AcctRequestDataDto {
  @ApiProperty({ description: "Tài khoản người dùng", example: "user123" })
  @IsString()
  username: string;

  @ApiProperty({ description: "Loại trạng thái tài khoản (ví dụ: Start, Stop, Interim-Update)", example: "Start" })
  @IsString()
  acctStatusType: string;

  @ApiProperty({ description: "Loại xác thực (ví dụ: PAP, CHAP)", example: "PAP" })
  @IsString()
  acctAuthentic: string;

  @ApiProperty({ description: "Địa chỉ IP gói tin gửi đi (Framed IP Address)", example: "192.168.1.100" })
  @IsString()
  framedIPAddress: string;

  @ApiProperty({ description: "Địa chỉ MAC của thiết bị truy cập (Calling Station ID)", example: "00:1A:2B:3C:4D:5E" })
  @IsString()
  callingStationId: string;

  @ApiProperty({ description: "Địa chỉ IP của NAS (Network Access Server)", example: "192.168.1.1" })
  @IsString()
  NASIPAddress: string;

  @ApiProperty({ description: "Cổng NAS (Network Access Server Port)", example: "1812" })
  @IsString()
  NASPort: string;

  @ApiProperty({ description: "Địa chỉ MAC của thiết bị được gọi (Called Station ID)", example: "00:1A:2B:3C:4D:5F" })
  @IsString()
  calledStationId: string;

  @ApiProperty({ description: "Loại cổng NAS (Network Access Server Port Type)", example: "Ethernet" })
  @IsString()
  NASPortType: string;

  @ApiProperty({ description: "Tên NAS (Network Access Server Identifier)", example: "NAS001" })
  @IsString()
  NASIdentifier: string;

  @ApiProperty({ description: "Thông tin kết nối (Connect Info)", example: "User connected via WiFi" })
  @IsString()
  connectInfo: string;

  @ApiProperty({ description: "ID phiên tài khoản (Accounting Session ID)", example: "session123" })
  @IsString()
  acctSessionId: string;

  @ApiProperty({ description: "ID phiên tài khoản đa phiên (Multi-session Accounting ID)", example: "multi123" })
  @IsString()
  acctMultiSessionId: string;

  @ApiProperty({ description: "SSID của Access Point", example: "VTC Test" })
  @IsString()
  ruckusSSID: string;

  @ApiProperty({ description: "Thời gian phiên tài khoản (Tính theo gửi theo Giây)", example: 3600 })
  @IsNumber()
  acctSessionTime: number;

  @ApiProperty({ description: "Số byte đầu vào (Input Octets)", example: 1048576 })
  @IsNumber()
  acctInputOctets: number;

  @ApiProperty({ description: "Số byte đầu ra (Output Octets)", example: 524288 })
  @IsNumber()
  acctOutputOctets: number;

  @ApiProperty({ description: "Số gói tin đầu vào (Input Packets)", example: 1000 })
  @IsNumber()
  acctInputPackets: number;

  @ApiProperty({ description: "Số gói tin đầu ra (Output Packets)", example: 500 })
  @IsNumber()
  acctOutputPackets: number;

  @ApiProperty({ description: "Thời điểm sự kiện", example: "2024-07-04T08:00:00Z" })
  @IsString()
  eventTimestamp: string;

  @ApiProperty({ description: "Nguyên nhân kết thúc phiên tài khoản (Acct Terminate Cause)", example: "Admin-Reset" })
  @IsString()
  acctTerminateCause: string;

  // @ApiProperty({ description: "Thiết bị của người dùng", example: "Tablet" })
  // @IsString()
  // userDevice: string;

  // @ApiProperty({ description: "Hoạt động của người dùng", example: "Web Browsing" })
  // @IsString()
  // userActivity: string;

  // @ApiPropertyOptional({ description: "Hoạt động chi tiết của người dùng", type: AcctSessionDetailSatelliteDto })
  // @IsString()
  // sessionDetail?: AcctSessionDetailSatelliteDto;
}
export class AuthSatelliteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  CHAPpassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  CHAPChallenge: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  NASIdentifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  NASIPAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  callingStationId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ServiceType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  NASPortType: string;
}

export class PreAuthSatelliteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clientMac: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sip: string;

  @IsDate()
  @IsNotEmpty()
  @ApiPropertyOptional()
  timestamp: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  productId: number;
}

export class BodyIFCViasat {
  @IsString()
  @ApiProperty()
  devicedId: string;

  @IsNumber()
  @ApiProperty()
  flightId: number;

  @IsNumber()
  @ApiProperty()
  speed: number;

  @IsNumber()
  @ApiProperty()
  latency: number;

  @IsNumber()
  @ApiProperty()
  bandwidthUsage: number;

  @IsNumber()
  @ApiProperty()
  packetLossRate: number;

  @IsNumber()
  @ApiProperty()
  connectionQuality: number;

  @IsNumber()
  @ApiProperty()
  uptime: number;

  @IsNumber()
  @ApiProperty()
  downtime: number;

  @IsNumber()
  @ApiProperty()
  unauthorizedAccessAttempts: number;

  @IsNumber()
  @ApiProperty()
  failedConnections: number;

  @IsNumber()
  @ApiProperty()
  concurrentUsers: number;
}

export class BodyDeviceHealth {
  @IsString()
  @ApiProperty()
  devicedId: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsNumber()
  @ApiProperty()
  cpuUsage: number;

  @IsNumber()
  @ApiProperty()
  memoryUsage: number;

  @IsNumber()
  @ApiProperty()
  temperature: number;
}

export class GetDataDto {
  @IsNumber()
  @ApiPropertyOptional()
  page: number;

  @IsNumber()
  @ApiPropertyOptional()
  pageSize: number;

  @IsString()
  @ApiPropertyOptional()
  filters: string;
}

export class BodyUpdateDevice {
  @IsString()
  @ApiPropertyOptional()
  deviceId: string;

  @IsString()
  @ApiPropertyOptional()
  firmware: string;

  @IsString()
  @ApiPropertyOptional()
  wifiStandard: string;

  @IsString()
  @ApiPropertyOptional()
  ipAddress: string;

  @IsString()
  @ApiPropertyOptional()
  port: string;
}
