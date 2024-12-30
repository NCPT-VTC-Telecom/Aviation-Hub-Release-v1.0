import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AirlinesInfoReqDto {
  @IsString()
  @ApiPropertyOptional({ description: "Tên của hãng bay" })
  name: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mô tả hãng bay" })
  description: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mô hãng bay" })
  code: string;

  @IsString()
  @ApiPropertyOptional({ description: "Quốc gia của hãng bay" })
  country: string;

  @IsString()
  @ApiPropertyOptional({ description: "Email của hãng bay" })
  email: string;

  @IsString()
  @ApiPropertyOptional({ description: "Số điện thoại của hãng bay" })
  phoneNumber: string;
}

export class AirlinesReqDto {
  @ApiPropertyOptional()
  data: AirlinesInfoReqDto;
}

export class QueryAirlinesDto {
  @IsString()
  @ApiPropertyOptional({ description: "Id của hãng bay" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Hành động quản lý", enum: ["add", "edit", "delete"] })
  type: string;
}

export class ReqDataAirlinesDto {
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
