import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { GroupRole, UserGroup, UserGroupLevel2, UserGroupLevel3 } from "src/management_portal/user_group/entity/user_group.entity";
import { responseMessage } from "src/utils/constant";
import { Brackets, In, Repository } from "typeorm";
import { VendorInformation, VendorRenewInformation, VendorUserInformation } from "../entity/vendors.entity";
import { VendorRequestData } from "../interface/vendors.interface";
import { BodyVendorRenewDto, QueryVendorRenewDto } from "../dto/vendors.dto";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorInformation)
    private readonly vendorInformationRepository: Repository<VendorInformation>,
    @InjectRepository(VendorUserInformation)
    private readonly vendorUserInformationRepository: Repository<VendorUserInformation>,
    @InjectRepository(VendorRenewInformation)
    private readonly vendorRenewRepository: Repository<VendorRenewInformation>,
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

  async findListVendor(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      let vendorQueryBuilder = this.vendorInformationRepository
        .createQueryBuilder("user_vendor")
        .leftJoinAndSelect("user_vendor.user_information", "user_information")
        .leftJoinAndSelect("user_information.user_group", "user_group")
        .leftJoinAndSelect("user_information.user_group_lv2", "user_group_lv2")
        .leftJoinAndSelect("user_information.user_group_lv3", "user_group_lv3")
        .where("user_vendor.status_id != :statusId", { statusId: 13 });

      if (filters && filters.trim() !== "") {
        vendorQueryBuilder = vendorQueryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("user_information.fullname = :fullname", { fullname: filters })
              .orWhere("user_information.username = :username", { username: filters })
              .orWhere("user_information.email = :email", { email: filters })
              .orWhere("TRIM(user_information.phone_number) = :phoneNumber", { phoneNumber: filters.trim() })
              .orWhere("user_information.id = :id", { id: filters });
          })
        );
      }
      vendorQueryBuilder.orderBy("user_vendor.created_date", "DESC");

      const [vendorListData, total] = await vendorQueryBuilder.skip(skip).take(pageSize).getManyAndCount();

      const transformData = (await vendorListData)
        ? vendorListData.map((item) => {
            const newData = {
              id: item.id,
              user_id: item.user_id,
              fullname: item.user_information.fullname,
              email: item.user_information.email,
              phone_number: item.user_information.phone_number,
              gender: item.user_information.gender,
              citizen_id: item.user_information.citizen_id,
              address: item.user_information.address,
              ward: item.user_information.ward,
              district: item.user_information.district,
              province: item.user_information.province,
              country: item.user_information.country,
              postcode: item.user_information.postcode,
              username: item.user_information.username,
              description: item.description,
              token: item.token,
              expired_date: item.expired_date,
              ip_addresses: JSON.parse(item.ip_addresses),
              status_id: item.status_id,
              created_date: item.created_date,
              user_group: item.user_information.user_group.map((group) => group.group_id),
              user_group_lv2: item.user_information.user_group_lv2.map((group) => group.group_id_lv2),
              user_group_lv3: item.user_information.user_group_lv3.map((group) => group.group_id_lv3),
            };
            return newData;
          })
        : [];
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: transformData.length > 0 ? transformData : [],
        total: total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  private async generateJWT(userId: string, expiredDate: Date): Promise<string> {
    const secretKey = process.env.VTC_JWT_SECRET;
    if (!secretKey) {
      throw new Error("VTC_JWT_SECRET is not defined in environment variables");
    }

    if (!(expiredDate instanceof Date) || isNaN(expiredDate.getTime())) {
      throw new Error("Invalid expiredDate");
    }
    const token = jwt.sign(
      { userId: userId }, // Payload
      secretKey, // Secret Key
      { expiresIn: Math.floor((expiredDate.getTime() - Date.now()) / 1000) } // Expiration time in seconds
    );

    return token;
  }

  async handleRenewVendorDate(dataQuery: QueryVendorRenewDto, dataRequest: BodyVendorRenewDto): Promise<any> {
    try {
      const id = dataQuery.userId;
      const { expiredDate } = dataRequest;
      const currentDate = new Date();
      const convertExpiredDate = new Date(expiredDate);

      const existedUser = await this.vendorRenewRepository.findOne({ where: { user_id: id, status_id: 14 } });
      if (!existedUser) {
        throw new NotFoundException({ code: -4, message: responseMessage.notFound });
      }
      if (convertExpiredDate <= currentDate) {
        throw new BadRequestException({ code: -2, message: responseMessage.fail });
      }

      const generateToken = this.generateJWT(id, convertExpiredDate);
      await this.vendorRenewRepository.update({ id: existedUser.id }, { expired_date: expiredDate, token: await generateToken, modified_date: new Date() });

      return { code: 0, message: responseMessage.success };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddVendor(dataAddVendor: VendorRequestData): Promise<any> {
    const { address, description, district, email, expiredDate, fullname, username, password, phoneNumber, province, ward, userGroupIdLv2, userGroupIdLv3, ipAddresses } = dataAddVendor.data;

    if (!email && !username) {
      throw new BadRequestException({ code: -2, message: "Email/Username bị thiếu" });
    }

    const existingVendor = await this.vendorUserInformationRepository.findOne({ where: { username, status_id: 14 } });
    if (existingVendor) {
      throw new ConflictException({ code: -1, message: responseMessage.existedUsername });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = this.vendorUserInformationRepository.create({
      fullname,
      address,
      district,
      email,
      phone_number: phoneNumber,
      province,
      ward,
      username,
      password: hashedPassword,
      status_id: 14,
    });

    const convertExpiredDate = new Date(expiredDate);
    const addedVendor = await this.vendorUserInformationRepository.save(newVendor);
    const generateToken = this.generateJWT(addedVendor.id, convertExpiredDate);

    const newVendorDetail = this.vendorInformationRepository.create({
      user_id: addedVendor.id,
      description,
      expired_date: expiredDate,
      token: await generateToken,
      ip_addresses: JSON.stringify(ipAddresses),
      status_id: 14,
    });
    await this.vendorInformationRepository.save(newVendorDetail);

    await this.saveUserGroups(addedVendor.id, userGroupIdLv2, userGroupIdLv3);

    return addedVendor;
  }

  private async saveUserGroups(userId: string, userGroupIdLv2: number[], userGroupIdLv3: number[]): Promise<void> {
    const userGroupId = [3];
    const userGroups = userGroupId.map((groupId) => ({ user_id: userId.toString(), group_id: groupId }));
    const userGroupLevel2 = [];
    const userGroupLevel3 = [];

    for (const groupId of userGroupId) {
      if (userGroupIdLv2 && userGroupIdLv2.length > 0) {
        for (const groupIdLevel2 of userGroupIdLv2) {
          const groupRoleLv2 = await this.groupRoleRepository.findOne({ where: { id: groupIdLevel2, level: 2 } });
          if (!groupRoleLv2) {
            this.logger.warn(`Skipping invalid level 2 group ${groupIdLevel2} for level 1 group ${groupId}`);
            continue;
          }
          userGroupLevel2.push({ user_id: userId, group_id_lv1: groupId, group_id_lv2: groupIdLevel2 });

          if (userGroupIdLv3 && userGroupIdLv3.length > 0) {
            for (const groupIdLevel3 of userGroupIdLv3) {
              const groupRoleLv3 = await this.groupRoleRepository.findOne({ where: { id: groupIdLevel3, level: 3, parent_id: groupIdLevel2 } });
              if (groupRoleLv3) {
                userGroupLevel3.push({ user_id: userId, group_id_lv1: groupId, group_id_lv2: groupIdLevel2, group_id_lv3: groupIdLevel3 });
              } else {
                this.logger.warn(`Skipping invalid level 3 group ${groupIdLevel3} for level 2 group ${groupIdLevel2}`);
              }
            }
          }
        }
      }
    }

    await Promise.all([
      this.userGroupRepository.save(userGroups),
      this.userGroupLevel2Repository.save(userGroupLevel2.map((group) => ({ ...group, user_id: group.user_id.toString() }))),
      this.userGroupLevel3Repository.save(userGroupLevel3.map((group) => ({ ...group, user_id: group.user_id.toString() }))),
    ]);
  }

  async handleEditVendor(id: string, dataVendor: VendorRequestData): Promise<any> {
    const { fullname, email, phoneNumber, description, address, ward, district, province, expiredDate, username, password, userGroupIdLv1, userGroupIdLv2, userGroupIdLv3, ipAddresses } = dataVendor.data;

    const existVendor = await this.vendorUserInformationRepository.findOne({ where: { id: id } });
    if (!existVendor) {
      throw new ConflictException({ code: -4, message: "Không tìm thấy thông tin cộng tác viên" });
    }
    await this.vendorUserInformationRepository.update(id, {
      fullname,
      email,
      phone_number: phoneNumber,
      address,
      ward,
      district,
      province,
      username,
      password,
      modified_date: new Date(),
    });

    await this.vendorInformationRepository.update(
      { user_id: id },
      {
        description,
        ip_addresses: JSON.stringify(ipAddresses),
        expired_date: expiredDate,
        modified_date: new Date(),
      }
    );
    // Update role
    const [existUserGroup, existUserGroupLv2, existUserGroupLv3] = await Promise.all([
      this.userGroupRepository.find({ where: { user_id: id } }),
      this.userGroupLevel2Repository.find({ where: { user_id: id } }),
      this.userGroupLevel3Repository.find({ where: { user_id: id } }),
    ]);

    const existingGroupIds = existUserGroup.map((group) => group.group_id);
    const existingGroupIdslLevel2 = existUserGroupLv2.map((group) => group.group_id_lv2);
    const existingGroupIdsLevel3 = existUserGroupLv3.map((group) => group.group_id_lv3);

    // Determine groups to be removed
    const groupsToRemove = existingGroupIds.filter((groupId) => !userGroupIdLv1.includes(groupId));
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

    for (const groupId of userGroupIdLv1) {
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
    for (const groupId of userGroupIdLv1) {
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

    const newUserVendor = await this.vendorUserInformationRepository.findOne({ where: { id: id } });
    return newUserVendor;
  }

  async handleDeleteVendor(vendorId: string): Promise<any> {
    const existVendor = await this.vendorInformationRepository.findOne({ where: { user_id: vendorId, status_id: 14 } });
    const existUserVendor = await this.vendorUserInformationRepository.findOne({ where: { id: vendorId, status_id: 14 } });

    if (!existVendor || !existUserVendor) {
      throw new ConflictException({
        code: -1,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    await this.vendorInformationRepository.update(
      { user_id: vendorId },
      {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      }
    );

    await this.vendorUserInformationRepository.update({ id: vendorId }, { status_id: 13, modified_date: new Date(), deleted_date: new Date() });

    await this.userGroupRepository.delete({ user_id: vendorId });

    await this.userGroupLevel2Repository.delete({ user_id: vendorId });

    await this.userGroupLevel3Repository.delete({ user_id: vendorId });

    return existVendor;
  }

  async handleChangeStatus(vendorId: string): Promise<any> {
    const existVendor = await this.vendorInformationRepository.findOne({ where: { user_id: vendorId, status_id: 14 } });
    const existUserVendor = await this.vendorUserInformationRepository.findOne({ where: { id: vendorId, status_id: 14 } });

    if (!existVendor || !existUserVendor) {
      throw new ConflictException({
        code: -1,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    if (existVendor.status_id === 19) {
      await this.vendorInformationRepository.update(
        { user_id: vendorId },
        {
          status_id: 14,
          modified_date: new Date(),
        }
      );

      await this.vendorUserInformationRepository.update({ id: vendorId }, { status_id: 14, modified_date: new Date() });
    } else {
      await this.vendorInformationRepository.update(
        { user_id: vendorId },
        {
          status_id: 19,
          modified_date: new Date(),
        }
      );

      await this.vendorUserInformationRepository.update({ id: vendorId }, { status_id: 19, modified_date: new Date() });
    }
    return { code: 0, message: responseMessage.success };
  }
}
