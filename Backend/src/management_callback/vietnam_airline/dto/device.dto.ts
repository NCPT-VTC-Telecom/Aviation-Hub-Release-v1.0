import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class DeviceInfoVNAManagementDto {
  @IsString()
  @ApiProperty({ required: true, description: "Số hiệu chuyến bay" })
  flightNumber?: string;

  @IsString()
  @ApiProperty({ required: true, description: "Loại thiết bị" })
  deviceType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Tên thiết bị" })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Mô tả thiết bị" })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Ngày sản xuất thiết bị" })
  dateOfManufacture?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Vị trí đặt thiết bị" })
  placementLocation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Ngày kích hoạt thiết bị" })
  activationDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Ngày hủy kích hoạt thiết bị" })
  deactivationDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Địa chỉ IP của thiết bị" })
  ipAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Cổng của thiết bị" })
  port?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Địa chỉ MAC của thiết bị" })
  macAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Địa chỉ IPv6 của thiết bị" })
  ipv6Address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Phiên bản phần mềm của thiết bị" })
  firmware?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Tiêu chuẩn Wi-Fi của thiết bị" })
  wifiStandard?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Nhà sản xuất thiết bị" })
  manufacturer?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Mẫu mã thiết bị" })
  model?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Loại CPU của thiết bị" })
  cpuType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Nhà cung cấp thiết bị" })
  supplier?: string;
}

export class AddDeviceVNADto {
  @IsBoolean()
  @ApiProperty({ description: "Xác định xem đây là chỉnh sửa thiết bị hiện có hay thêm mới" })
  isEdit: boolean;

  @ApiProperty({ type: [DeviceInfoVNAManagementDto], description: "Danh sách thông tin thiết bị" })
  data: DeviceInfoVNAManagementDto[];
}

export class DeviceInfomationVNAtDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({
    description: "Bộ lọc để tìm kiếm thiết bị theo các thông số như model, loại CPU, nhà cung cấp, số đuôi máy bay, số hiệu chuyến bay, chuẩn wifi, nhà sản xuất, địa chỉ IP, địa chỉ MAC, firmware, loại thiết bị hoặc mô tả trạng thái",
    example: "Intel",
  })
  filters: string;
}

class DeviceHealthDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: "ID của thiết bị", required: false })
  deviceId: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: "Thời gian kiểm tra", type: String, format: "date-time" })
  checkTime: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Trạng thái của thiết bị", required: false })
  status: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Mức sử dụng CPU của thiết bị", required: false })
  cpuUsage: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Mức sử dụng bộ nhớ của thiết bị", required: false })
  memoryUsage: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Mức sử dụng đĩa của thiết bị", required: false })
  diskUsage: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "Nhiệt độ của thiết bị", required: false })
  temperature: number;
}

export class AddDeviceHealthDto {
  @ApiProperty({ type: [DeviceHealthDto], description: "Danh sách thông tin trạng thái của các thiết bị" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviceHealthDto)
  data: DeviceHealthDto[];
}
