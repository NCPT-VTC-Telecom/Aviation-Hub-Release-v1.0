import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNumber, IsOptional, ValidateNested, IsBoolean, IsObject } from "class-validator";

export class GetProductManagementDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Số trang để phân trang", example: 1, default: 1 })
  page: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Số mục trên mỗi trang", example: 10, default: 10 })
  pageSize: number;

  @IsString()
  @ApiPropertyOptional()
  filters: string;

  @IsString()
  @ApiProperty({ description: "Loại sản phẩm", enum: ["product", "ticket", "telecom"] })
  type: string;

  @IsNumber()
  @ApiPropertyOptional()
  productId: number;
}
export class ProductPriceInfo {
  @IsOptional()
  @ApiProperty()
  productId?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Giá gốc của sản phẩm" })
  originalPrice?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Giá mới của sản phẩm" })
  newPrice?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Đơn vị tiền tệ" })
  currency?: string;

  @IsOptional()
  @ApiProperty({ required: true, description: "Ngày bắt đầu giá" })
  startDate?: Date;

  @IsOptional()
  @ApiProperty({ required: true, description: "Ngày kết thúc giá" })
  endDate?: Date;
}

export class ProductInfoDto {
  @IsOptional()
  @ApiProperty({ required: false, description: "Thông tin vai trò" })
  role: object;

  @IsOptional()
  @ApiProperty({ required: false, description: "Đường dẫn ảnh sản phẩm" })
  imageLink?: string;

  @IsOptional()
  @ApiProperty({ required: true, description: "Tên sản phẩm" })
  title?: string;

  @IsOptional()
  @ApiProperty({ required: false, description: "Mô tả sản phẩm" })
  description?: string;

  @IsOptional()
  @ApiProperty({ required: true, description: "Loại sản phẩm" })
  type?: string;

  @IsOptional()
  @ApiProperty({ required: true, description: "Thời gian tổng" })
  totalTime?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Băng thông tải lên" })
  bandwidthUpload?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Băng thông tải xuống" })
  bandwidthDownload?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Tổng lượng dữ liệu" })
  dataTotal?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Dữ liệu tải lên" })
  dataUpload?: number;

  @IsOptional()
  @ApiProperty({ required: true, description: "Dữ liệu tải xuống" })
  dataDownload?: number;

  @IsOptional()
  @ApiProperty({ required: true, type: ProductPriceInfo, description: "Thông tin giá của sản phẩm" })
  @ValidateNested()
  @Type(() => ProductPriceInfo)
  dataPrice: ProductPriceInfo;
}

export class ProductReqDto {
  @IsString()
  @ApiPropertyOptional({ description: "Đường dẫn ảnh sản phẩm" })
  imageLink?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Tên sản phẩm" })
  title?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Mô tả sản phẩm cho wifi, ticket và telecom" })
  description?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Loại sản phẩm" })
  type?: string;

  @IsNumber()
  @ApiPropertyOptional({ description: "Thời gian tổng" })
  totalTime?: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Băng thông tải lên" })
  bandwidthUpload?: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Băng thông tải xuống" })
  bandwidthDownload?: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Tổng lượng dữ liệu" })
  dataTotal?: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Dữ liệu tải lên" })
  dataUpload?: number;

  @IsNumber()
  @ApiPropertyOptional({ description: "Dữ liệu tải xuống" })
  dataDownload?: number;

  @ApiPropertyOptional({ type: ProductPriceInfo, description: "Thông tin giá của sản phẩm" })
  @ValidateNested()
  @Type(() => ProductPriceInfo)
  dataPrice: ProductPriceInfo;

  @IsNumber()
  @ApiPropertyOptional({ description: "Id sản phẩm wifi gắn với ticket và telecom" })
  productId: number;

  @IsString()
  @ApiPropertyOptional({ description: "Hạng vé máy bay cho ticket và telecom" })
  ticketPlan: string;

  @IsString()
  @ApiPropertyOptional({ description: "Tên của sản phẩm ticket hoặc telecom" })
  name: string;

  @IsString()
  @ApiPropertyOptional({ description: "loại sản phẩm của telecom" })
  productType: string;
}

export class DataProductReqDto {
  @ApiProperty()
  data: ProductReqDto;
}

export class AddProductQueryDto {
  @IsString()
  @ApiPropertyOptional({ description: "Loại Product: product, ticket, telecom", enum: ["product", "ticket", "telecom"] })
  type?: string;
}

export class EditProductDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id sản phẩm" })
  id?: number;

  @IsBoolean()
  @ApiProperty()
  isEditPrice: boolean;

  @IsString()
  @ApiPropertyOptional({ description: "Loại Product: product, ticket, telecom", enum: ["product", "ticket", "telecom"] })
  type?: string;
}

export class DeleteProductDto {
  @IsNumber()
  @ApiPropertyOptional({ description: "Id sản phẩm" })
  id?: number;

  @IsString()
  @ApiPropertyOptional({ description: "Loại Product: product, ticket, telecom", enum: ["product", "ticket", "telecom"] })
  type?: string;
}

export class GetPriceProductDto {
  @IsNumber()
  @ApiProperty({ description: "Id Product" })
  id: number;

  @IsNumber()
  @ApiProperty({ description: "Số trang để phân trang" })
  page: number;

  @IsNumber()
  @ApiProperty({ description: "Số mục trên mỗi trang trang để phân trang" })
  pageSize: number;
}
