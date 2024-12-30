import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class GetSessionManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({ description: "filter cho chức năng search box" })
  filters: string;

  @IsDateString()
  @ApiPropertyOptional({ description: "Ngày bắt đầu" })
  startDate: Date;

  @IsDateString()
  @ApiPropertyOptional({ description: "Ngày kết thúc" })
  endDate: Date;

  @IsNumber()
  @ApiPropertyOptional()
  productId: number;

  @IsString()
  @ApiPropertyOptional()
  sessionStatus: string;

  @IsString()
  @ApiPropertyOptional()
  userDevice: string;
}
export class GetChartSessionManagementDto {
  @IsString()
  @ApiProperty({ description: "Loại biểu đồ", enum: ["session_browser", "total_pax_data_usage_session_name", "session_devices", "total_pax_data_usage_session_name_date", "session_duration_average_date", "session_per_date", "device_health"] })
  type: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Ngày bắt đầu" })
  fromDate?: Date;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Ngày kết thúc" })
  endDate?: Date;
}

export class TotalDataSessionFlightDto {
  @IsNumber()
  @ApiPropertyOptional()
  flightId: number;

  @IsDateString()
  @ApiPropertyOptional({ required: true })
  startDate: Date;

  @IsDateString()
  @ApiPropertyOptional({ required: true })
  endDate: Date;
}

export class TotalSessionDetailDto {
  @IsNumber()
  @ApiPropertyOptional({ required: true })
  sessionId: number;

  @IsDateString()
  @ApiPropertyOptional({ required: true })
  startTime: Date;

  @IsDateString()
  @ApiPropertyOptional({ required: true })
  endTime: Date;
}

export class IdSessionDto {
  @IsString()
  @ApiProperty()
  id: string;
}

export class FakeRadiusDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  deviceId: string;

  @IsString()
  @ApiProperty()
  flightNumber: string;

  @IsString()
  @ApiProperty()
  macAddress: string;

  @IsString()
  @ApiProperty()
  ipAddress: string;
}
