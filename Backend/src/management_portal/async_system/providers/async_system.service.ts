import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckVoucherExpire } from "../entity/async_system.entity";
import { Repository } from "typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class AsyncSystemService {
  constructor(
    @InjectRepository(CheckVoucherExpire)
    private readonly checkVoucherExpireRepository: Repository<CheckVoucherExpire>,
    private readonly logger: LoggerService
  ) {}

  async handleCheckVoucherExpire(): Promise<any> {
    try {
      const queryBuilder = this.checkVoucherExpireRepository.createQueryBuilder("vouchers");
      const currentDate = new Date();

      const vouchers = await queryBuilder.where("vouchers.status_id = :status", { status: 14 }).getMany();
      const expiredVouchers = vouchers.filter((voucher) => voucher.end_date < currentDate);

      if (expiredVouchers.length > 0) {
        expiredVouchers.forEach(async (voucher) => {
          await this.checkVoucherExpireRepository.update(voucher.id, { status_id: 19, modified_date: currentDate });
        });
      }
      this.logger.debug("Check voucher expire successfully");
      return true;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
