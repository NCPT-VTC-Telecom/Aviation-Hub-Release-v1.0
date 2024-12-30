import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, In, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AddUserInformation, ChangePasswordInformation, UserInformation } from "../entity/user.entity";
import { responseMessage } from "src/utils/constant";
import { AddUserManagementDto, EditUserManagementDto } from "src/management_portal/user/dto/user.dto";
import { ChangePasswordData } from "src/management_portal/user_auth/interface/register.interface";
import { GroupRole, UserGroup, UserGroupLevel2, UserGroupLevel3 } from "src/management_portal/user_group/entity/user_group.entity";
import { Orders } from "src/management_portal/orders/entity/order.entity";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
// import { InjectQueue } from "@nestjs/bullmq";
// import { Queue } from "bullmq";
// import { RegisterRadiusDto } from "../../dto/radius/register.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInformation)
    private readonly userRepository: Repository<UserInformation>,
    @InjectRepository(AddUserInformation)
    private readonly addUserRepository: Repository<AddUserInformation>,
    @InjectRepository(ChangePasswordInformation)
    private readonly changePasswordRepository: Repository<ChangePasswordInformation>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(UserGroupLevel2)
    private readonly userGroupLevel2Repository: Repository<UserGroupLevel2>,
    @InjectRepository(UserGroupLevel3)
    private readonly userGroupLevel3Repository: Repository<UserGroupLevel3>,
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,

    // @InjectQueue("users") private usersQueue: Queue,

    private readonly logger: LoggerService
  ) {}

  async findListUser(page: number, pageSize: number, filters: string, groupId: number): Promise<any> {
    try {
      page = Math.max(1, page);
      let userQueryBuilder = this.userRepository
        .createQueryBuilder("users")
        .where("users.status_id != :statusId", { statusId: 13 })
        .leftJoinAndSelect("users.user_group", "user_group")
        .leftJoinAndSelect("users.user_group_lv2", "user_group_lv2")
        .leftJoinAndSelect("users.user_group_lv3", "user_group_lv3")
        .andWhere("user_group.group_id = :groupId ", { groupId })
        .orderBy("users.created_date", "DESC");

      const subQuery = userQueryBuilder.subQuery().select("orders.user_id", "user_id").addSelect("SUM(orders.total)", "total_spending").from(Orders, "orders").groupBy("orders.user_id").getQuery();
      userQueryBuilder.leftJoin(subQuery, "total_spend", "total_spend.user_id = users.id").addSelect("COALESCE(total_spend.total_spending, 0)", "total_spending");

      if (filters) {
        userQueryBuilder = userQueryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("users.fullname LIKE :filters", { filters: `%${filters}%` })
              .orWhere("users.username LIKE :filters", { filters: `%${filters}%` })
              .orWhere("users.email LIKE :filters", { filters: `%${filters}%` })
              .orWhere("TRIM(users.phone_number) = :phoneNumber", { phoneNumber: filters.trim() })
              .orWhere("users.id LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }

      const [userListData, totalItem] = await Promise.all([
        userQueryBuilder
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        userQueryBuilder.getCount(),
      ]);

      const dataReturn = userListData.entities.map((aircraft, index) => {
        const { total_spending } = userListData.raw[index];
        const mapData: any = { ...aircraft, total_spending };
        return mapData;
      });

      const transformedData = dataReturn
        ? dataReturn.map((item) => ({
            id: item.id,
            fullname: item.fullname,
            email: item.email,
            phone_number: item.phone_number,
            gender: item.gender,
            citizen_id: item.citizen_id,
            address: item.address,
            ward: item.ward,
            district: item.district,
            province: item.province,
            country: item.country,
            postcode: item.postcode,
            username: item.username,
            status_id: item.status_id,
            total_spending: item.total_spending,
            user_group: item.user_group.map((detail) => detail.group_id),
            user_group_lv2: item.user_group_lv2.map((detail) => detail.group_id_lv2),
            user_group_lv3: item.user_group_lv3.map((detail) => detail.group_id_lv3),
          }))
        : [];
      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: transformedData.length > 0 ? transformedData : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleEditUser(id: string, dataUser: EditUserManagementDto): Promise<any> {
    const { fullname, address, citizenId, country, district, email, gender, phoneNumber, postcode, province, ward, userGroupId, userGroupIdLv2, userGroupIdLv3 } = dataUser.data;

    try {
      const existingUser = await this.userRepository.findOne({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException({ code: -4, message: responseMessage.notFound });
      }

      const [existUserGroup, existUserGroupLv2, existUserGroupLv3] = await Promise.all([
        this.userGroupRepository.find({ where: { user_id: id } }),
        this.userGroupLevel2Repository.find({ where: { user_id: id } }),
        this.userGroupLevel3Repository.find({ where: { user_id: id } }),
      ]);

      const existingGroupIds = existUserGroup.map((group) => group.group_id);
      const existingGroupIdslLevel2 = existUserGroupLv2.map((group) => group.group_id_lv2);
      const existingGroupIdsLevel3 = existUserGroupLv3.map((group) => group.group_id_lv3);

      // Determine groups to be removed
      const groupsToRemove = existingGroupIds.filter((groupId) => !userGroupId.includes(groupId));
      const groupsToRemoveLevel2 = existingGroupIdslLevel2.filter((groupId) => !userGroupIdLv2.includes(groupId));
      const groupsToRemoveLevel3 = existingGroupIdsLevel3.filter((groupId) => !userGroupIdLv3.includes(groupId));

      // Remove old groups
      if (groupsToRemove.length > 0) {
        await this.userGroupRepository.delete({ user_id: id, group_id: In(groupsToRemove) });
      }
      if (groupsToRemoveLevel2.length > 0) {
        await this.userGroupLevel2Repository.delete({ user_id: id, group_id_lv2: In(groupsToRemoveLevel2) });
      }
      if (groupsToRemoveLevel3.length > 0) {
        await this.userGroupLevel3Repository.delete({ user_id: id, group_id_lv3: In(groupsToRemoveLevel3) });
      }

      // Handle level 2 and level 3 group validation and addition
      const userGroupLevel2 = [];
      const userGroupLevel3 = [];

      for (const groupId of userGroupId) {
        if (userGroupIdLv2 && userGroupIdLv2.length > 0) {
          for (const groupIdLv2 of userGroupIdLv2) {
            // Validate level 2 group
            const groupRoleLv2 = await this.groupRoleRepository.findOne({
              where: { id: groupIdLv2, level: 2 }, // Ensure level 2 group is associated with level 1 group
            });

            if (!groupRoleLv2) {
              this.logger.warn(`Skipping invalid level 2 group ${groupIdLv2} for level 1 group ${groupId}`);
              continue;
            }

            // Save valid level 2 group
            userGroupLevel2.push({
              user_id: id,
              group_id_lv1: groupId,
              group_id_lv2: groupIdLv2,
            });

            if (userGroupIdLv3 && userGroupIdLv3.length > 0) {
              for (const groupIdLv3 of userGroupIdLv3) {
                // Validate level 3 group
                const groupRoleLv3 = await this.groupRoleRepository.findOne({
                  where: { id: groupIdLv3, level: 3, parent_id: groupIdLv2 }, // Ensure level 3 group is associated with level 2 group
                });

                if (groupRoleLv3) {
                  // Save valid level 3 group
                  userGroupLevel3.push({
                    user_id: id,
                    group_id_lv1: groupId,
                    group_id_lv2: groupIdLv2,
                    group_id_lv3: groupIdLv3,
                  });
                } else {
                  this.logger.warn(`Skipping invalid level 3 group ${groupIdLv3} for level 2 group ${groupIdLv2}`);
                  continue;
                }
              }
            }
          }
        }
      }

      // Add new groups (Level 1, 2, and 3)
      const promises = [];

      // Level 1 groups to add
      for (const groupId of userGroupId) {
        if (!existingGroupIds.includes(groupId)) {
          const newUserGroup = this.userGroupRepository.create({ user_id: id, group_id: groupId });
          promises.push(this.userGroupRepository.save(newUserGroup));
        }
      }

      // Level 2 groups to add
      for (const group of userGroupLevel2) {
        const existingLevel2Group = await this.userGroupLevel2Repository.findOne({ where: { user_id: id, group_id_lv2: group.group_id_lv2 } });
        if (!existingLevel2Group) {
          const newUserGroupLv2 = this.userGroupLevel2Repository.create(group);
          promises.push(this.userGroupLevel2Repository.save(newUserGroupLv2));
        }
      }

      // Level 3 groups to add
      for (const group of userGroupLevel3) {
        const existingLevel3Group = await this.userGroupLevel3Repository.findOne({ where: { user_id: id, group_id_lv3: group.group_id_lv3 } });
        if (!existingLevel3Group) {
          const newUserGroupLv3 = this.userGroupLevel3Repository.create(group);
          promises.push(this.userGroupLevel3Repository.save(newUserGroupLv3));
        }
      }

      // Execute all save operations in parallel
      await Promise.all(promises);

      await this.userRepository.update(id, {
        fullname: fullname,
        phone_number: phoneNumber,
        email,
        gender,
        address,
        ward,
        district,
        province,
        country,
        postcode,
        citizen_id: citizenId,
        status_id: 14,
        modified_date: new Date(),
      });
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      return updatedUser;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddUser(dataUser: AddUserManagementDto): Promise<any> {
    const { fullname, address, citizenId, country, district, email, gender, phoneNumber, postcode, province, ward, username, password, userGroupId, userGroupIdLv2, userGroupIdLv3 } = dataUser.data;

    const existingUser = await this.addUserRepository.findOne({
      where: { username },
    });
    if (!email && !username) {
      throw new BadRequestException({ code: -2, message: "Email/Username bị thiếu" });
    }

    if (existingUser) {
      throw new ConflictException({ code: -1, message: "User này đã tồn tại" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.addUserRepository.create({
        fullname,
        address,
        citizen_id: citizenId,
        country,
        district,
        email,
        gender,
        phone_number: phoneNumber,
        postcode,
        province,
        ward,
        username,
        password: hashedPassword,
        status_id: 14,
      });

      const addedUser = await this.addUserRepository.save(newUser);

      const userGroups = userGroupId.map((groupId) => ({
        user_id: addedUser.id,
        group_id: groupId,
      }));

      // Prepare newUserGroupLevel2 data for batch insert
      const userGroupLevel2 = [];
      const userGroupLevel3 = [];

      for (const groupId of userGroupId) {
        // Add level 2 groups
        if (userGroupIdLv2 && userGroupIdLv2.length > 0) {
          for (const groupIdLv2 of userGroupIdLv2) {
            // Validate that the level 2 group has the correct parent (level 1 group)
            const groupRoleLv2 = await this.groupRoleRepository.findOne({
              where: { id: groupIdLv2, level: 2 }, // Check the parent_id matches level 1 groupId
            });

            if (!groupRoleLv2) {
              // Skip saving this group if validation fails and log a message
              this.logger.warn(`Skipping invalid level 2 group ${groupIdLv2} for level 1 group ${groupId}`);
              continue;
            }

            // Save valid level 2 group
            userGroupLevel2.push({
              user_id: addedUser.id,
              group_id_lv1: groupId,
              group_id_lv2: groupIdLv2,
            });

            // Add corresponding level 3 groups
            if (userGroupIdLv3 && userGroupIdLv3.length > 0) {
              for (const groupIdLv3 of userGroupIdLv3) {
                // Validate that the level 3 group belongs to the level 2 group
                const groupRoleLv3 = await this.groupRoleRepository.findOne({
                  where: { id: groupIdLv3, level: 3, parent_id: groupIdLv2 },
                });

                if (groupRoleLv3) {
                  // Save valid level 3 group
                  userGroupLevel3.push({
                    user_id: addedUser.id,
                    group_id_lv1: groupId,
                    group_id_lv2: groupIdLv2,
                    group_id_lv3: groupIdLv3,
                  });
                } else {
                  this.logger.warn(`Skipping invalid level 3 group ${groupIdLv3} for level 2 group ${groupIdLv2}`);
                  continue;
                }
              }
            }
          }
        }
      }

      // Batch save user groups (Level 1, Level 2, Level 3)
      await Promise.all([this.userGroupRepository.save(userGroups), this.userGroupLevel2Repository.save(userGroupLevel2), this.userGroupLevel3Repository.save(userGroupLevel3)]);

      return addedUser;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteUser(id: string): Promise<UserInformation> {
    try {
      // Check if the User exists
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.userRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });

      return existingUser;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleChangePassword(id: string, changePasswordData: ChangePasswordData): Promise<any> {
    try {
      if (!id) {
        throw new NotFoundException({ code: -4, message: responseMessage.notFound });
      }
      const { email, username, newPassword, oldPassword } = changePasswordData;
      const queryBuilder = this.changePasswordRepository.createQueryBuilder("users").where("users.email = :email", { email }).andWhere("users.username = :username", { username }).andWhere("users.status_id != :statusId", { statusId: 13 });
      const userData = await queryBuilder.getOne();

      if (!userData) {
        throw new NotFoundException({ code: -4, message: responseMessage.notFound });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException({ code: -3, message: "Password cũ không đúng" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.changePasswordRepository.update(id, {
        password: hashedPassword,
        modified_date: new Date(),
      });
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
