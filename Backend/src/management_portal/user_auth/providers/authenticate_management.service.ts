import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { AuthManagementLogin, ChangePasswordInformation, UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { ManagementLoginResponseData } from "../interface/login.interface";
import { RegisterManagementDto } from "src/management_portal/user_auth/dto/authenticate_user.dto";
import { responseMessage } from "src/utils/constant";
import { GroupRole } from "src/management_portal/user_group/entity/user_group.entity";
import { UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { ResetPasswordData } from "../interface/register.interface";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

dotenv.config();
const JWT_SECRET = process.env.VTC_JWT_SECRET;
@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  blacklistToken(token: string) {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
@Injectable()
export class AuthenticateManageService {
  constructor(
    @InjectRepository(AuthManagementLogin)
    private readonly authenticateUserRepository: Repository<AuthManagementLogin>,

    @InjectRepository(UserVerifyInformation)
    private readonly userVerifiyRepository: Repository<UserVerifyInformation>,

    @InjectRepository(ChangePasswordInformation)
    private readonly changePasswordRepository: Repository<ChangePasswordInformation>,

    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,

    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,

    private readonly logger: LoggerService
  ) {}

  private generateAccessToken(user: AuthManagementLogin): any {
    const payload = { username: user.username, sub: user.id };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "86400s" });
  }

  async validateUserManagement(username: string, password: string): Promise<ManagementLoginResponseData | null> {
    try {
      if (!username || !password) {
        throw new BadRequestException({
          code: -2,
          message: responseMessage.badRequest,
        });
      }

      const queryBuilder = this.authenticateUserRepository
        .createQueryBuilder("users")
        .where("users.status_id != :statusId", { statusId: 13 })
        .andWhere(
          new Brackets((qb) => {
            qb.where("users.username = :username", { username });
          })
        );

      const user = await queryBuilder.getOne();

      if (!user) {
        throw new UnauthorizedException({ code: -1, message: "Tên đăng nhập không đúng hoặc không tồn tại" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException({ code: -3, message: "Password không đúng" });
      }

      const accessToken = this.generateAccessToken(user);
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      console.error("error", error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error; // Re-throw known exceptions
      } else {
        throw new InternalServerErrorException({
          code: -5,
          message: responseMessage.serviceError,
        });
      }
    }
  }

  async validateUserOauth(userEmail: string): Promise<any> {
    try {
      if (!userEmail) {
        throw new BadRequestException({ code: -2, message: responseMessage.badRequest });
      }

      const queryBuilder = this.authenticateUserRepository
        .createQueryBuilder("users")
        .where("users.status_id != :statusId", { statusId: 13 })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`users.email = :userEmail`, { userEmail });
          })
        );

      const user = await queryBuilder.getOne();

      if (!user) {
        throw new UnauthorizedException({ code: -1, message: "Tên đăng nhập không đúng hoặc không tồn tại" });
      }

      const accessToken = this.generateAccessToken(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async registerUserManagement(RegisterManagementDto: RegisterManagementDto): Promise<UserVerifyInformation> {
    const { fullname, email, username, phoneNumber, password, isAdmin } = RegisterManagementDto;
    const user = await this.authenticateUserRepository.findOne({
      where: { username },
    });

    if (user) {
      throw new ConflictException({ code: -1, message: "User này đã tồn tại" });
    }

    if (!email && !username) {
      throw new BadRequestException({ code: -2, message: "Email/Username bị thiếu" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userVerifiyRepository.create({
        fullname,
        email,
        phone_number: phoneNumber,
        username,
        password: hashedPassword,
        status_id: 14,
      });
      const savedUser = await this.userVerifiyRepository.save(newUser);
      const userInfo = await this.userVerifiyRepository.findOne({ where: { username } });

      if (isAdmin) {
        const groupRoleAdmin = await this.groupRoleRepository.find();

        const groupRoleAdminPromises = groupRoleAdmin.map(async (item: any) => {
          const newGroupRoleAdmin = this.userGroupRepository.create({
            group_id: item.id,
            user_id: userInfo.id,
          });
          return this.userGroupRepository.save(newGroupRoleAdmin);
        });

        await Promise.all(groupRoleAdminPromises);
      } else {
        const groupRoleUser = await this.groupRoleRepository.findOne({ where: { id: 2 } });
        if (!groupRoleUser) {
          throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
        }

        const newGroupRoleUser = this.userGroupRepository.create({
          group_id: groupRoleUser.id,
          user_id: userInfo.id,
        });
        await this.userGroupRepository.save(newGroupRoleUser);
      }

      return savedUser;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async getVerifyEmail(email: string): Promise<any> {
    try {
      const queryBuilder = this.userVerifiyRepository.createQueryBuilder("users").where("users.email = :email", { email }).andWhere("users.status_id != :statusId", { statusId: 13 });
      const userResult = await queryBuilder.getOne();
      if (userResult) {
        const { password: _, ...userWithoutPassword } = userResult;
        return { user: userWithoutPassword };
      } else {
        return userResult;
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async handleResetPassword(resetPasswordData: ResetPasswordData): Promise<any> {
    try {
      const { email, username, newPassword } = resetPasswordData;
      const queryBuilder = this.userVerifiyRepository.createQueryBuilder("users").where("users.email = :email", { email }).andWhere("users.username = :username", { username }).andWhere("users.status_id != :statusId", { statusId: 13 });
      const userData = await queryBuilder.getOne();

      if (!userData) {
        throw new NotFoundException({ code: -4, message: responseMessage.notFound });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.changePasswordRepository.update(userData.id, {
        password: hashedPassword,
        modified_date: new Date(),
      });
      return;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  // async handleLogoutUser(logoutUserData: LogoutRequestData): Promise<any> {
  //   try {
  //     const { token } = logoutUserData;
  //     this.tokenBlacklistService.blacklistToken(token);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);  //   }
  // }
}
