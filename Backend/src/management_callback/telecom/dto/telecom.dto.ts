import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class VerifyPhoneNumber {
  @IsString()
  @ApiProperty({ description: "Số điện thoại cần xác minh" })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: "Tên người dùng (tùy chọn)" })
  username?: string;

  @IsString()
  @ApiProperty({ description: "Số hiệu chuyến bay liên quan đến việc xác minh số điện thoại" })
  flightNumber: string;
}
