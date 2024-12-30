import { TypeOrmModule } from "@nestjs/typeorm";
import { CheckVoucherExpire } from "../entity/async_system.entity";

export const AsyncSystemEntities = [TypeOrmModule.forFeature([CheckVoucherExpire])];
