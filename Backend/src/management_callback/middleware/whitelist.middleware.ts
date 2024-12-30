import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import { VendorMiddleware } from "../common/entity/middleware.entity";
import { Repository } from "typeorm";
dotenv.config();

@Injectable()
export class VerifyIPAddressMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(VendorMiddleware)
    private readonly vendorRepository: Repository<VendorMiddleware>,
    private readonly logger: LoggerService
  ) {}
  _;
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    try {
      const accessTokenSecret: string = process.env.VTC_JWT_SECRET;
      const token: string = req.headers.authorization?.split(" ")[1];
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      if (!token) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      }
      const decoded = jwt.verify(token, accessTokenSecret);
      req.vendorData = decoded;

      if (ip) {
        const existVendor = await this.vendorRepository.findOne({ where: { user_id: req.vendorData.userId, status_id: 14 } });

        const vendorIpAddresses = JSON.parse(existVendor.ip_addresses);
        if (!vendorIpAddresses.includes(ip)) {
          return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
        }
        return next();
      }
    } catch (error) {
      this.logger.error("Error in VerifyIPAddressMiddleware:", error);
      if (error) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
      }
    }
  }
}
