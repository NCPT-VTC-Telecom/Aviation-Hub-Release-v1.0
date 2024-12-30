import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BlackListManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional({
    description: "Bộ lọc để tìm kiếm tên miền bị cấm hoặc tên thiết bị",
    example: "casino",
  })
  filters: string;

  @IsString()
  @ApiProperty({ description: "Loại dữ liệu của thiết bị cần lấy: domain, category , devices", enum: ["domain", "category", "devices"] })
  type: string;
}
