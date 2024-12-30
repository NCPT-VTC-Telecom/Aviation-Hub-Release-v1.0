import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsDateString, IsNumber, IsOptional } from "class-validator";

export class FlightManagementDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Bộ lọc tìm kiếm" })
  filters: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Thời gian khởi hành" })
  departureTime: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Thời gian đến" })
  arrivalTime: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Giai đoạn bay" })
  flightPhase: string;
}

export class IdFlightDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
