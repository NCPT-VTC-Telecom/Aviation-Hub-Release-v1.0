import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString, Matches } from "class-validator";

export class AddServiceVoucherDto {
  @IsDateString()
  @ApiProperty()
  endDate: Date;

  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsString()
  @ApiProperty()
  type: string;
}

export class GetDataDto {
  @IsNumber()
  @ApiPropertyOptional()
  page: number;

  @IsNumber()
  @ApiPropertyOptional()
  pageSize: number;

  @IsString()
  @ApiPropertyOptional()
  filters: string;
}

export class VerifyVoucherDto {
  @IsString()
  @ApiPropertyOptional()
  voucherCode: string;

  @IsString()
  @ApiPropertyOptional()
  requestId: string;
}

export class QueryVoucherDto {
  @IsString()
  @ApiProperty()
  id: string;
}

export class ChangeStatusVoucherDto {
  @IsString()
  @ApiProperty({ description: "code status voucher", enum: ["online", "deleted_success", "offline", "in_use", "used", "expires"] })
  status: string;
}
