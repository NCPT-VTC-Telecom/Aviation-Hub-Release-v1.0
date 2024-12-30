import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TicketVNADto {
  @IsString()
  @ApiProperty()
  serial?: string;
}
