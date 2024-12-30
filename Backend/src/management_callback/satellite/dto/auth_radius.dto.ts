import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginRadiusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class DisconnectUserDto {
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty()
  // sessionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sessionId: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ description: "NAS Ip" })
  // nasIp: string;
}

export class DisconnectOnFlight {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  flightNumber: string;
}
