import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNumber, IsOptional, IsArray, IsDate, IsDateString } from "class-validator";

export class GetVendorListManagementDto {
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

export class QueryVendorDto {
  @IsString()
  @ApiPropertyOptional({ description: "Id của cộng tác viên" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Hành động quản lý", enum: ["add", "edit", "delete", "change_status"] })
  action: string;
}

export class dataVendorDto {
  @IsString()
  @ApiPropertyOptional({ description: "Token của cộng tác viên" })
  token: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Họ và tên" })
  fullname?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Email" })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Số điện thoại" })
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Mô tả" })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Địa chỉ" })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Phường/Xã" })
  ward?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Quận/Huyện" })
  district?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: "Tỉnh/Thành phố" })
  province?: string;

  @IsString()
  @ApiProperty({ required: true, description: "Tên đăng nhập" })
  username?: string;

  @IsString()
  @ApiProperty({ required: true, description: "Mật khẩu" })
  password?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false, description: "Ngày hết hạn" })
  expiredDate?: Date;

  @IsString()
  @ApiProperty({ required: true, description: "Danh sách IP White List" })
  ipAddresses?: string;

  @IsArray()
  @Type(() => Number)
  @ApiPropertyOptional({ type: [Number], description: "Vai trò người dùng" })
  @IsNumber({}, { each: true })
  userGroupIdLv1?: Array<number>;

  @IsArray()
  @Type(() => Number)
  @ApiPropertyOptional({ type: [Number], description: "Phân hệ người dùng" })
  @IsNumber({}, { each: true })
  userGroupIdLv2?: Array<number>;

  @IsArray()
  @Type(() => Number)
  @ApiPropertyOptional({ type: [Number], description: "Chức năng người dùng" })
  @IsNumber({}, { each: true })
  userGroupIdLv3?: Array<number>;
}

export class QueryVendorRenewDto {
  @IsString()
  @ApiPropertyOptional({ description: "Id của cộng tác viên" })
  userId: string;
}

export class BodyVendorRenewDto {
  @IsDateString()
  @ApiProperty({ description: "Thời gian renew mới" })
  expiredDate: Date;
}
