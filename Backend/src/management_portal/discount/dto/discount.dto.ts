import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class DiscountManagementDto {
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
export class DiscountInfoDto {
  @IsString()
  @ApiProperty({ required: true, description: "Tên Discount" })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ required: false, description: "Số lượng mã discount" })
  quantity: number;

  @IsNumber()
  @ApiPropertyOptional({ required: true, description: "Số lượng mã của mỗi user" })
  quantityPerUser: number;

  @IsDateString()
  @ApiProperty({ required: true, description: "Ngày bắt đầu" })
  dateFrom: string;

  @IsDateString()
  @ApiProperty({ required: true, description: "Ngày hết hạn" })
  dateEnd: Date;

  @IsNumber()
  @ApiPropertyOptional({ description: "Giảm tối thiểu" })
  minimal: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Giảm tối đa" })
  maximal: number;

  @IsString()
  @ApiProperty({ description: "Code" })
  code: string;

  @IsString()
  @ApiProperty({ description: "Loại discount", enum: ["percent", "money"] })
  type: string;
}

export class QueryDiscountDto {
  @IsNumber()
  @ApiProperty({ description: "ID của discount", required: true })
  id: number;

  @IsString()
  @ApiProperty({ description: "Hành động quản lý", enum: ["add", "edit", "delete"] })
  action: string;
}
