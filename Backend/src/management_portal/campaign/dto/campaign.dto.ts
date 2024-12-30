import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class GetListCampaignDto {
  @IsNumber()
  @ApiPropertyOptional()
  page?: number;

  @IsNumber()
  @ApiPropertyOptional()
  pageSize?: number;

  @IsString()
  @ApiPropertyOptional()
  filters?: string;
}

export class QueryCampaignDto {
  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsString()
  @ApiPropertyOptional()
  type?: string;
}

export class BodyCampaignDto {
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsDate()
  @ApiPropertyOptional()
  startData?: Date;

  @IsDate()
  @ApiPropertyOptional()
  endData?: Date;

  @IsNumber()
  @ApiPropertyOptional()
  budget?: number;

  @ApiPropertyOptional()
  productList?: ItemWithCampaign[];
}

export class ItemWithCampaign {
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}
