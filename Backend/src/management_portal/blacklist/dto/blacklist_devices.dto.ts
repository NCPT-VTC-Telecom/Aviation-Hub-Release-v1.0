import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class QueryBlackListDevicesDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id thông tin" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại hành động quản lýNếu edit, delete thì sẽ phải bao gồm id", enum: ["add", "edit", "delete"] })
  type: string;
}

class DataBlackListDevicesnDto {
  @IsString()
  @ApiPropertyOptional({ description: "Tên thông tin" })
  deviceName: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chỉ Ip" })
  ipAddress: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chỉ Ipv6" })
  ipv6Address: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chi MAC" })
  macAddress: string;

  @IsString()
  @ApiPropertyOptional({ description: "Lý do", maximum: 500 })
  reason: string;
}

export class BodyBlackListDeviceDto {
  @ApiPropertyOptional()
  data: DataBlackListDevicesnDto;
}
