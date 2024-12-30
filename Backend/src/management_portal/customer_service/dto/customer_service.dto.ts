import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

export class GetCustomerServiceDto {
  @IsNumber()
  @ApiProperty()
  page: number;

  @IsNumber()
  @ApiProperty()
  pageSize: number;

  @IsDateString()
  @ApiPropertyOptional()
  startDate?: Date;

  @IsDateString()
  @ApiPropertyOptional()
  endDate?: Date;

  @IsNumber()
  @ApiPropertyOptional()
  statusId?: number;

  @IsString()
  @ApiPropertyOptional()
  label?: string;
}

export class EditCustomerServiceDto {
  @IsUUID()
  @ApiProperty({ required: true })
  userReceiverId: string;

  @IsString()
  @ApiPropertyOptional()
  bodyReceiver: string;

  @IsNumber()
  @ApiPropertyOptional()
  statusId: number;
}

export class RequestNumberDto {
  @IsString()
  @ApiProperty()
  requestNumber: string;
}

export class AddCustomerServiceDto {
  @IsString()
  @ApiProperty()
  titleSender: string;

  @IsString()
  @ApiProperty()
  bodySender: string;

  @IsUUID()
  @ApiProperty()
  userSenderId: string;
}
