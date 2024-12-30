import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class SupplierManagementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Tên nhà cung cấp" })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "Email liên hệ" })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Địa chỉ" })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Thông tin liên hệ" })
  contact: string;

  @IsString()
  @ApiProperty({ description: "Loại nhà cung cấp" })
  @IsNotEmpty()
  type: string;

  @IsString()
  @ApiProperty({ description: "Trạng thái" })
  status: string;
}

export class GetSupplierManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional()
  filters: string;

  @IsString()
  @ApiPropertyOptional({ description: "Trường lọc thông tin theo type" })
  type: string;
}

export class IdSupplierDto {
  @IsString()
  @ApiProperty()
  id: string;
}
