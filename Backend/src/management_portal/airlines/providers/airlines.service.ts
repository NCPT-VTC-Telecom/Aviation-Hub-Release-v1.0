import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as crypto from "crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { AirlinesInfo } from "../entity/airlines.entity";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { AirlinesReq } from "../interface/airlines.interface";

@Injectable()
export class AirlinesService {
  constructor(
    @InjectRepository(AirlinesInfo)
    private readonly airlinesInfoRepository: Repository<AirlinesInfo>,
    private readonly logger: LoggerService
  ) {}

  async findAirlines(page: number, pageSize: number, filters: string): Promise<{ data: unknown[]; total: number; totalPages: number }> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let queryBuilder = this.airlinesInfoRepository.createQueryBuilder("airlines").where("airlines.status_id NOT IN (:...statusIds)", { statusIds: [13, 19] });

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("airlines.code LIKE :filters", { filters: `%${filters}%` }).orWhere("airlines.name LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }
      const [airlineListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: airlineListData.length > 0 ? airlineListData : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddAirlines(dataAirlines: AirlinesReq): Promise<string> {
    const { name, code, description, country, email, phoneNumber } = dataAirlines.data;
    const existAirlines = await this.airlinesInfoRepository.findOne({ where: { code: code, name: name } });

    if (existAirlines) {
      throw new ConflictException({ code: -1, message: responseMessage.existValue });
    }

    const newAirline = this.airlinesInfoRepository.create({
      code,
      description,
      name,
      country,
      email,
      phone_number: phoneNumber,
      status_id: 14,
    });

    const addAirline = await this.airlinesInfoRepository.save(newAirline);

    const secretKey = process.env.VTC_JWT_SECRET;
    const tokenPayload = `${addAirline.id}.${code}`;
    const generateToken = crypto.createHmac("sha256", secretKey).update(tokenPayload).digest("hex");

    await this.airlinesInfoRepository.update(addAirline.id, {
      token_code: generateToken,
    });

    return responseMessage.success;
  }

  async handleEditAirlines(id: string, dataAirline: AirlinesReq): Promise<string> {
    const { name, phoneNumber, email, country, description } = dataAirline.data;
    const existAirlines = await this.airlinesInfoRepository.findOne({ where: { id } });
    if (!existAirlines) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    await this.airlinesInfoRepository.update(id, {
      phone_number: phoneNumber,
      email,
      country,
      description,
      name,
      modified_date: new Date(),
    });

    return responseMessage.success;
  }

  async handleDeleteAirlines(id: string): Promise<string> {
    const existAirlines = await this.airlinesInfoRepository.findOne({ where: { id, status_id: 14 } });
    if (!existAirlines) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.airlinesInfoRepository.update(id, {
      status_id: 13,
      deleted_date: new Date(),
      modified_date: new Date(),
    });
    return responseMessage.success;
  }
}
