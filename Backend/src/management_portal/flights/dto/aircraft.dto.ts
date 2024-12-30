import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsDateString, IsNumber } from "class-validator";

export class AircraftManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({ description: "Filter cho chức năng search box" })
  filters: string;
}
export class AirCraftAddInformationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Số hiệu chuyến bay của máy bay" })
  flightNumber?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "Số hiệu đuôi của máy bay" })
  tailNumber?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mẫu máy bay" })
  model?: string;

  @IsString()
  @ApiProperty({ description: "Nhà sản xuất của máy bay" })
  manufacturer?: string;

  @IsString()
  @ApiProperty({ description: "Loại mẫu máy bay" })
  modelType?: string;

  @IsNumber()
  @ApiProperty({ description: "Sức chứa của máy bay" })
  capacity?: number;

  @IsString()
  @ApiPropertyOptional({ description: "Trạng thái thuê máy bay" })
  leasedAircraftStatus?: string;

  @IsDateString()
  @ApiPropertyOptional({ description: "Năm sản xuất của máy bay" })
  yearManufactured?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Trạng thái sở hữu của máy bay" })
  ownership?: string;
}

export class AddAirCraftInformationDto {
  @ApiProperty({ description: "Thông tin của máy bay cần thêm" })
  data: AirCraftAddInformationDto;
}

export class AirCraftModifiedManagementDto {
  @IsString()
  @ApiProperty({ description: "Số hiệu chuyến bay của máy bay", required: false })
  flightNumber?: string;

  @IsEmail()
  @ApiProperty({ description: "Số hiệu đuôi của máy bay", required: false })
  tailNumber?: string;

  @IsString()
  @ApiProperty({ description: "Mẫu máy bay", required: false })
  model?: string;

  @IsString()
  @ApiProperty({ description: "Nhà sản xuất của máy bay", required: false })
  manufacturer?: string;

  @IsString()
  @ApiProperty({ description: "Loại mẫu máy bay", required: false })
  modelType?: string;

  @IsNumber()
  @ApiProperty({ description: "Sức chứa của máy bay", required: false })
  capacity?: number;

  @IsString()
  @ApiProperty({ description: "Trạng thái thuê máy bay", required: false })
  leasedAircraftStatus?: string;

  @IsDateString()
  @ApiProperty({ description: "Năm sản xuất của máy bay", required: false })
  yearManufactured?: string;

  @IsString()
  @ApiProperty({ description: "Trạng thái sở hữu của máy bay", required: false })
  ownership?: string;
}

export class ModifiedAirCraftInformationDto {
  @ApiProperty({ description: "Thông tin đã chỉnh sửa của máy bay" })
  data: AirCraftModifiedManagementDto;
}

export class AircraftMaintenanceManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({
    description: "Bộ lọc tìm kiếm bao gồm nguyên nhân, mã bảo trì",
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

export class QueryMaintenanceAircraftDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id của máy bay" })
  id?: number;

  @IsString()
  @ApiProperty({ description: "Hành động quản lý", enum: ["add", "edit", "delete"] })
  action?: string;
}

export class MaintenanceScheduleAircraftDto {
  @IsString()
  @ApiPropertyOptional({ description: "Trạng thái bảo trì" })
  maintenanceStatus?: string;

  @IsNumber()
  @ApiPropertyOptional()
  createdBy?: number;

  @IsNumber()
  @ApiPropertyOptional()
  updateBy?: number;

  @IsString()
  @ApiPropertyOptional({ description: "Mô tả lý do bảo trì" })
  description?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Lí do bảo trì" })
  reason?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Ngày bắt đầu bảo trì" })
  fromDate?: Date;

  @IsString()
  @ApiPropertyOptional({ description: "Ngày kết thúc bảo trì" })
  endDate?: Date;
}
