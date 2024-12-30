import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";

export class VouchersManagementDto {
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
export class VoucherInfoDto {
  @IsDateString()
  @ApiProperty({ required: true, description: "Ngày bắt đầu" })
  fromDate: Date;

  @IsDateString()
  @ApiProperty({ required: true, description: "Ngày kết thúc" })
  endDate: Date;

  @IsNumber()
  @ApiProperty({ required: true, description: "Id Product" })
  productId: number;

  @IsString()
  @ApiPropertyOptional({ description: "ID hệ thống yêu cầu tạo ra Voucher" })
  userId: string;
}

export class QueryVoucherDto {
  @IsString()
  @ApiPropertyOptional()
  id: string;

  @IsString()
  @ApiPropertyOptional()
  action: string;
}

export class ListVoucherDto {
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}

export class MultiVoucher {
  @IsString()
  @ApiPropertyOptional({ description: "ID hệ thống yêu cầu tạo ra Voucher" })
  userId: string;

  @IsString()
  @ApiPropertyOptional()
  campaignId: string;

  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  data: ListVoucherDto[];
}
