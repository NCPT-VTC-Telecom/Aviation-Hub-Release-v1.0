import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AcctRadiusDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  acctStatusType: string;

  @ApiProperty()
  @IsString()
  acctAuthentic: string;

  @ApiProperty()
  @IsString()
  framedIPAddress: string;

  @ApiProperty()
  @IsString()
  callingStationId: string;

  @ApiProperty()
  @IsString()
  NASIPAddress: string;

  @ApiProperty()
  @IsString()
  NASPort: string;

  @ApiProperty()
  @IsString()
  calledStationId: string;

  @ApiProperty()
  @IsString()
  NASPortType: string;

  @ApiProperty()
  @IsString()
  NASIdentifier: string;

  @ApiProperty()
  @IsString()
  connectInfo: string;

  @ApiProperty()
  @IsString()
  acctSessionId: string;

  @ApiProperty()
  @IsString()
  acctMultiSessionId: string;

  @ApiProperty()
  @IsString()
  ruckusSSID: string;

  @ApiProperty()
  @IsNumber()
  acctSessionTime: number;

  @ApiProperty()
  @IsNumber()
  acctInputOctets: number;

  @ApiProperty()
  @IsNumber()
  acctOutputOctets: number;

  @ApiProperty()
  @IsNumber()
  acctInputPackets: number;

  @ApiProperty()
  @IsNumber()
  acctOutputPackets: number;

  @ApiProperty()
  @IsNumber()
  ruckusStaRSSI: number;

  @ApiProperty()
  @IsString()
  eventTimestamp: string;

  @ApiProperty()
  @IsString()
  acctTerminateCause: string;

  @ApiProperty()
  @IsString()
  arubaDeviceType: string;
}
