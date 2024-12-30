import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
  @ApiProperty({ example: "John Doe" })
  fullname: string;

  @ApiProperty({ example: "john.doe@example.com" })
  email: string;

  @ApiProperty({ example: "+1234567890" })
  phone_number: string;

  @ApiProperty({ example: "male" })
  gender: string;

  @ApiProperty({ example: "123456789" })
  citizen_number: string;

  @ApiProperty({ example: "123 Main St" })
  address: string;

  @ApiProperty({ example: "Ward 1" })
  ward: string;

  @ApiProperty({ example: "District 1" })
  district: string;

  @ApiProperty({ example: "Cityville" })
  city: string;

  @ApiProperty({ example: "johndoe" })
  username: string;

  @ApiProperty({ example: "password123" })
  password: string;

  @ApiProperty({ example: "active" })
  status: string;

  @ApiProperty({ example: "Active user" })
  status_description: string;

  @ApiProperty({ example: "2024-05-23T00:00:00Z" })
  modified_date: string;

  @ApiProperty({ example: "2024-05-23T00:00:00Z" })
  created_date: string;
}
