import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { responseMessage } from "src/utils/constant";
import * as dotenv from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import { UserVerifyInformation } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { Status } from "src/management_portal/status/entity/status.entity";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

dotenv.config();

@Injectable()
export class VerifyLoginMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserVerifyInformation)
    private readonly userRepository: Repository<UserVerifyInformation>,
    @InjectRepository(Status)
    private readonly StatusRespository: Repository<Status>,
    private readonly logger: LoggerService
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    try {
      const accessTokenSecret: string = process.env.VTC_JWT_SECRET;
      const token: string = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      }

      const decoded = jwt.verify(token, accessTokenSecret);
      req.userData = decoded;
      if (req.userData) {
        const userQueryBuilder = this.userRepository
          .createQueryBuilder("users")
          .where("users.status_id != :statusId", { statusId: 13 })
          .leftJoinAndSelect("users.user_group", "user_group")
          .leftJoinAndSelect("users.user_group_lv2", "user_group_lv2")
          .leftJoinAndSelect("users.user_group_lv3", "user_group_lv3")
          .andWhere("users.username = :username ", { username: req.userData.username });

        const user = await userQueryBuilder.getOne();

        if (!user) {
          return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
        }

        const status = await this.StatusRespository.findOne({ where: { id: user.status_id } });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, status_id, ...userWithoutSensitiveData } = user;
        req.userData = { ...userWithoutSensitiveData, status_description: status.description };
        return next();
      } else {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      }
    } catch (error) {
      this.logger.error("Error in VerifyLoginMiddleware:", error);
      if (error) {
        return res.status(HttpStatus.OK).json({ code: -3, message: responseMessage.unauthenticate });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -5, message: responseMessage.serviceError });
      }
    }
  }
}
