import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class TypeExcelDto {
  @IsString()
  @ApiProperty({ description: "Type của table cần Import Excel: aircraft, device, supplier, product, sale_channels, gateway, user" })
  type: string;

  @IsString()
  @ApiPropertyOptional({ description: "Type của Supplier" })
  typeSupplier: string;

  @IsString()
  @ApiPropertyOptional({ description: "Type của Product" })
  typeProduct: string;

  @IsNumber()
  @ApiPropertyOptional({ description: "Id của Group Id" })
  groupId: number;
}

export class DataImportExcelDto {
  @IsArray()
  @ApiProperty()
  dataImportExcel: any[];
}
