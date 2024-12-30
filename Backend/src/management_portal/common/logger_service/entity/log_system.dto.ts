import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class GetLogSystemManagementDto {
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
  @ApiPropertyOptional()
  fromDate: Date;

  @IsString()
  @ApiPropertyOptional()
  endDate: Date;
}
