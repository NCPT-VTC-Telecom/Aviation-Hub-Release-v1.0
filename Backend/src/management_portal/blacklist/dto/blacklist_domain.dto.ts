import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class QueryBlackListDomainDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id thông tin" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại hành động quản lýNếu edit, delete thì sẽ phải bao gồm id", enum: ["add", "edit", "delete"] })
  type: string;
}

class DataBlackListDomainDto {
  @IsString()
  @ApiPropertyOptional({ description: "Tên thông tin" })
  name: string;

  @IsString()
  @ApiPropertyOptional({ description: "Đường dẫn" })
  url: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chỉ Ip" })
  ipAddress: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chỉ Ipv6" })
  ipv6Address: string;

  @IsString()
  @ApiPropertyOptional({ description: "Địa chi DNS" })
  dnsAddress: string;

  @IsString()
  @ApiPropertyOptional({ description: "Lý do", maximum: 500 })
  reason: string;

  @IsString()
  @ApiPropertyOptional({ description: "Id thể loại" })
  categoryId: number;
}

export class BodyBlackListDomainDto {
  @ApiPropertyOptional()
  data: DataBlackListDomainDto;
}
