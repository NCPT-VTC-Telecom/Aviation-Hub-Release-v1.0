import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsDateString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator";

export class GetOrdersManagementDto {
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

export class TotalRevenueDto {
  @IsNumber()
  @ApiPropertyOptional()
  flightId: number;

  @IsDateString()
  @ApiPropertyOptional()
  startDate: Date;

  @IsDateString()
  @ApiPropertyOptional()
  endDate: Date;
}

class CreateOrderItemDto {
  @IsString()
  @ApiProperty({ description: "ID của sản phẩm" })
  productId: string;

  @IsNumber()
  @ApiProperty({ description: "Số lượng của sản phẩm" })
  quantity: number;
}

class CreateOrderData {
  @IsString()
  @ApiProperty({ description: "ID của người dùng" })
  idUser?: string;

  @IsNumber()
  @ApiProperty({ description: "ID của kênh bán hàng" })
  idSaleChannels?: number;

  @IsNumber()
  @ApiProperty({ description: "ID của gateway" })
  idGateway?: number;

  @IsString()
  @ApiProperty({ description: "ID của chuyến bay" })
  idFlight?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({ description: "Danh sách sản phẩm trong đơn hàng", type: [CreateOrderItemDto] })
  itemList?: CreateOrderItemDto[];

  @IsNumber()
  @ApiProperty({ description: "Tổng phụ" })
  subtotal?: number;

  @IsNumber()
  @ApiProperty({ description: "Tổng số lượng sản phẩm" })
  totalQuantity?: number;

  @IsNumber()
  @ApiProperty({ description: "Tổng số tiền giảm giá" })
  totalDiscount?: number;

  @IsNumber()
  @ApiProperty({ description: "Tổng số tiền phải trả" })
  total?: number;

  @IsNumber()
  @ApiProperty({ description: "Phí thuế" })
  taxFee?: number;

  @IsString()
  @ApiProperty({ description: "Phương thức giao hàng" })
  shippingMethod?: string;

  @IsString()
  @ApiPropertyOptional({ description: "Ghi chú thêm của đơn hàng" })
  note?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: "Dữ liệu tạo đơn hàng" })
  data: CreateOrderData;
}
