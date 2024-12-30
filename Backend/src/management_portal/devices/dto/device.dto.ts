import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class DeviceManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({
    description: "Bộ lọc để tìm kiếm thiết bị theo các thông số như model, loại CPU, nhà cung cấp, số đuôi máy bay, số hiệu chuyến bay, chuẩn wifi, nhà sản xuất, địa chỉ IP, địa chỉ MAC, firmware, loại thiết bị hoặc mô tả trạng thái",
    example: "Intel",
  })
  filters: string;

  @IsString()
  @ApiPropertyOptional({ description: "Id Supplier" })
  supplierId: string;

  @IsString()
  @ApiProperty({ description: "Loại dữ liệu của thiết bị cần lấy: device, device_health , device_type", enum: ["device", "device_health", "device_type"] })
  type: string;
}
export class DeviceInfoManagementDto {
  @IsNumber()
  @ApiProperty({ description: "ID của máy bay", required: true })
  idAircraft?: number;

  @IsNumber()
  @ApiProperty({ description: "ID của loại thiết bị", required: true })
  idTypeDevice?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Tên của thiết bị", required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Mô tả về thiết bị", required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Ngày sản xuất của thiết bị", required: false })
  dateOfManufacture?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Vị trí lắp đặt của thiết bị", required: false })
  placementLocation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Ngày kích hoạt của thiết bị", required: false })
  activationDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Ngày ngừng hoạt động của thiết bị", required: false })
  deactivationDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Địa chỉ IP của thiết bị", required: false })
  ipAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Cổng kết nối của thiết bị", required: false })
  port?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Địa chỉ MAC của thiết bị", required: false })
  macAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Địa chỉ IPv6 của thiết bị", required: false })
  ipv6Address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Phiên bản firmware của thiết bị", required: false })
  firmware?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Tiêu chuẩn wifi của thiết bị", required: false })
  wifiStandard?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Nhà sản xuất của thiết bị", required: false })
  manufacturer?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Mẫu thiết bị", required: false })
  model?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Loại CPU của thiết bị", required: false })
  cpuType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Nhà cung cấp của thiết bị", required: false })
  supplier?: string;
}

export class DeviceInfoDto {
  @ApiProperty({ description: "Thông tin thiết bị cần thêm" })
  data: DeviceInfoManagementDto;
}

export class QueryDeviceDto {
  @IsString()
  @ApiPropertyOptional({ description: "Id của thiết bị" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại hành động quản lý", enum: ["add", "edit", "delete", "change_status"] })
  type: string;

  @IsString()
  @ApiPropertyOptional({ description: "Kiểu chấm dứt hoạt động thiết bị: device, flight, global, aircraft", enum: ["device", "flight", "global", "aircraft"] })
  typeChange: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại thao tác thay đổi status: active, terminate", enum: ["active", "terminate"] })
  typeChangeStatus: string;

  @IsNumber()
  @ApiPropertyOptional({ description: "Id chuyến bay dành cho ngắt kết nối thiết bị theo chuyến bay" })
  idFlight: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Id máy bay" })
  aircraftId: number;
}

export class QueryMaintenanceDeviceDto {
  @IsString()
  @ApiPropertyOptional({ description: "Id của thiết bị" })
  id: string;

  @IsString()
  @ApiProperty({ description: "Hành động thực hiện bao gồm: add, edit, delete. Nếu edit, delete thì sẽ phải bao gồm id", enum: ["add", "edit", "delete"] })
  action: string;
}

export class MaintenanceScheduleDto {
  @ApiProperty({ description: "Mã bảo trì. Chỉ áp dụng cho Edit và Delete" })
  maintenanceCode?: string;

  @ApiProperty({ description: "Trạng thái bảo trì", enum: ["Healthy", "Not Good", "Critical", "Unknown"] })
  maintenanceStatus?: string;

  @ApiProperty({ description: "Nguyên nhân bảo trì" })
  reason?: string;

  @ApiProperty({ description: "Mô tả bảo trì" })
  description?: string;

  @ApiProperty({ description: "Ngày bắt đầu bảo trì" })
  fromDate?: string;

  @ApiProperty({ description: "Ngày kết thúc bảo trì" })
  endDate?: string;

  @ApiPropertyOptional({ description: "Id trạng thái cho thiết bị. Chỉ áp dụng cho Edit" })
  statusId: number;
}

export class DeviceMaintenanceManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({
    description: "Bộ lọc tìm kiếm bao gồm nguyên nhân, mã bảo trì",
    example: "Bị hư CPU",
  })
  filters: string;

  @IsString()
  @ApiProperty({
    description: "Phân loại để lấy dữ liệu; hist: lấy lịch sử, list: danh sách bảo trì,để trống: không hợp lệ",
    enum: ["hist", "list"],
  })
  type: string;

  @IsString()
  @ApiPropertyOptional({
    description: "Ngày bắt đầu bảo trì ",
  })
  fromDate: Date;

  @IsString()
  @ApiPropertyOptional({
    description: "Ngày kết thúc bảo trì",
  })
  endDate: Date;
}

export class DataDeviceHealthDto {
  @IsString()
  @ApiPropertyOptional()
  deviceId: string;

  @IsString()
  @ApiPropertyOptional()
  status: string;

  @IsNumber()
  @ApiPropertyOptional()
  cpuUsage: number;

  @IsNumber()
  @ApiPropertyOptional()
  memoryUsage: number;

  @IsNumber()
  @ApiPropertyOptional()
  temperature: number;
}
