import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
// import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { responseMessage } from "src/utils/constant";
import * as dotenv from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import { UserVerifyInformation } from "../../management_portal/user/entity/user.entity";
import { Repository } from "typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { VendorMiddleware } from "../common/entity/middleware.entity";

dotenv.config();

@Injectable()
export class VerifyVendorMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserVerifyInformation)
    private readonly userRepository: Repository<UserVerifyInformation>,
    @InjectRepository(VendorMiddleware)
    private readonly vendorRepository: Repository<VendorMiddleware>,
    private readonly logger: LoggerService
  ) {}
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    try {
      const accessTokenSecret: string = process.env.VTC_JWT_SECRET;
      const token: string = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      }
      const decoded = jwt.verify(token, accessTokenSecret);
      req.vendorData = decoded;

      if (req.vendorData) {
        const existVendor = await this.vendorRepository.findOne({ where: { user_id: req.vendorData.userId, status_id: 14 } });
        if (!existVendor) {
          return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
        }
        const existUser = await this.userRepository.findOne({ where: { id: req.vendorData.userId } });
        const returnData = {
          userId: req.vendorData.userId,
          fullname: existUser.fullname,
          email: existUser.email,
          phone_number: existUser.phone_number,
          username: existUser.username,
          token: existVendor.token,
          expired_date: existVendor.expired_date,
        };
        req.vendorData = { ...returnData };
        return next();
      } else {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      }
    } catch (error) {
      this.logger.error("Error in VerifyVendorMiddleware:", error);
      if (error) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
      }
    }
  }
}
