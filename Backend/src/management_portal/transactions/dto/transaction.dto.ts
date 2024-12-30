import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetTransactionManagementDto {
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

export class EditTransactionDto {
  @IsNumber()
  @ApiProperty()
  total: number;

  @IsNumber()
  @ApiProperty()
  subTotal: number;
}

export class IdTransactionDto {
  @IsString()
  @ApiProperty()
  id: string;
}
