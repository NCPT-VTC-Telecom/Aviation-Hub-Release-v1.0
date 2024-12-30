import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class QueryBlackListCategoryDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id thông tin" })
  id: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại hành động quản lýNếu edit, delete thì sẽ phải bao gồm id", enum: ["add", "edit", "delete"] })
  type: string;
}

class DataBlackListCategoryDto {
  @IsString()
  @ApiPropertyOptional({ description: "Tên thông tin" })
  name: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mã danh mục" })
  code: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mô tả" })
  description: string;
}

export class BodyBlackListCategoryDto {
  @ApiPropertyOptional()
  data: DataBlackListCategoryDto;
}
