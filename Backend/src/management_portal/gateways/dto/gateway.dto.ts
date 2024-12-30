import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class GetGatewayManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional()
  filters: string;
}

export class GatewayManagementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mã của gateway" })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Tiêu đề của gateway" })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mô tả của gateway" })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Giá trị của gateway" })
  value: string;
}

export class GatewayEditManagementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mã của gateway" })
  code: string;

  @IsString()
  @ApiPropertyOptional({ description: "Tiêu đề của gateway" })
  title: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mô tả của gateway" })
  description: string;

  @IsString()
  @ApiPropertyOptional({ description: "Giá trị của gateway" })
  value: string;
}

export class IdGatewayDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
