import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class GetSaleChannelsManagementDto {
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

export class SaleChannelsManagementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mã phương thức thanh toán" })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Tên của phương thức thanh toán" })
  title: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "Mô tả về phương thức thanh toán" })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Giá trị của phương thức thanh toán" })
  value: string;
}

export class QuerySaleChannelsDto {
  @IsNumber()
  @ApiProperty({ description: "Id của sale channels" })
  id: number;

  @IsString()
  @ApiProperty({ description: "hành động thực hiện" })
  action: string;
}
