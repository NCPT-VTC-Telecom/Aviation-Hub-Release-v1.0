import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { UserGroup, UserGroupLevel2, UserGroupLevel3 } from "src/management_portal/user_group/entity/user_group.entity";
import { GroupRole } from "src/management_portal/user_group/entity/user_group.entity";
import { GroupRoleListRequestData } from "src/management_portal/user_group/interface/user_group.interface";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(UserGroupLevel2)
    private readonly userGroupLevel2Repository: Repository<UserGroupLevel2>,
    @InjectRepository(UserGroupLevel3)
    private readonly userGroupLevel3Repository: Repository<UserGroupLevel3>,
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
    private readonly logger: LoggerService
  ) {}

  async findListGroup(page: number, pageSize: number, filters: string, level: number, parentId: number[]): Promise<any> {
    try {
      page = Math.max(1, page);
      let queryBuilder = this.groupRoleRepository.createQueryBuilder("group_role").where("group_role.status_id = :statusId", { statusId: 14 }).andWhere("group_role.level = :level", { level });

      if (parentId.length > 0) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere("group_role.parent_id IN (:...parentId)", { parentId });
          })
        );
      }

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("group_role.title LIKE :filters", { filters: `%${filters}%` }).orWhere("group_role.permission LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }

      const [groupRoleData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: groupRoleData.length > 0 ? groupRoleData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async addGroupRole(roleData: GroupRoleListRequestData): Promise<any> {
    const { title, description, permission } = roleData;

    const existGroupRole = await this.groupRoleRepository.findOne({ where: { title } });

    if (existGroupRole) {
      throw new ConflictException({ code: -1, message: "Vai trò này đã tồn tại" });
    }

    try {
      const newGroupRole = this.groupRoleRepository.create({
        title,
        description,
        permission,
        level: 1,
        status_id: 14,
      });
      await this.groupRoleRepository.save(newGroupRole);

      return newGroupRole;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleEditGroupRole(id: number, roleData: GroupRoleListRequestData): Promise<any> {
    const { title, description, permission } = roleData;

    const existGroupRole = await this.groupRoleRepository.findOne({ where: { title } });

    if (!existGroupRole) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    try {
      await this.groupRoleRepository.update(id, {
        title,
        description,
        permission,
        status_id: 14,
        modified_date: new Date(),
      });

      const updateGroupRole = await this.groupRoleRepository.findOne({ where: { title } });
      return updateGroupRole;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteGroupRole(id: number): Promise<any> {
    try {
      // Check if the Payment Method exists
      const existGroupRole = await this.groupRoleRepository.findOne({ where: { id } });
      if (!existGroupRole) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.groupRoleRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return existGroupRole;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
