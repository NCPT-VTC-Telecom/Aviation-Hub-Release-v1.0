import { IsString, IsDateString, IsNumber, IsBoolean, IsArray } from "class-validator";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export class FlightVNADto {
  @IsString()
  @ApiPropertyOptional({ description: "Số hiệu chuyến bay" })
  flightNumber?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Sân bay khởi hành" })
  departureAirport?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Sân bay đến" })
  arrivalAirport?: string;

  @IsDateString()
  @ApiPropertyOptional({ description: "Thời gian khởi hành" })
  departureTime?: Date;

  @IsDateString()
  @ApiPropertyOptional({ description: "Thời gian đến" })
  arrivalTime?: Date;

  @IsString()
  @ApiPropertyOptional({ description: "Giai đoạn chuyến bay" })
  flightPhase?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Hãng hàng không" })
  airline?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Vĩ độ" })
  latLocation?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Kinh độ" })
  longLocation?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Độ cao" })
  altitude?: string;
}

class AirCraftVNADto {
  @IsString()
  @ApiPropertyOptional({ description: "Số hiệu chuyến bay" })
  flightNumber?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Số đuôi của máy bay" })
  tailNumber?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mẫu máy bay" })
  model?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Nhà sản xuất" })
  manufacturer?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại mẫu máy bay" })
  modelType?: string;

  @IsNumber()
  @ApiPropertyOptional({ description: "Sức chứa của máy bay" })
  capacity?: number;

  @IsString()
  @ApiPropertyOptional({ description: "Tình trạng thuê của máy bay" })
  leasedAircraftStatus?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Năm sản xuất" })
  yearManufactured?: Date;

  @IsString()
  @ApiPropertyOptional({ description: "Quyền sở hữu" })
  ownership?: string;
}

export class AircraftRequestImportDto {
  @IsBoolean()
  @ApiProperty({ description: "Xác định xem đây là chỉnh sửa thông tin máy bay hiện có hay thêm mới" })
  isEdit: boolean;

  @IsArray()
  @ApiProperty({ type: [AirCraftVNADto], description: "Danh sách thông tin máy bay" })
  data: AirCraftVNADto[];
}

export class AircraftVNADto {
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
