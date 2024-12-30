import { Controller, Get, Post, HttpStatus, Res, Req, Body, UseGuards, Query } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request, NextFunction } from "express";
import { responseMessage } from "src/utils/constant";
import { AuthenticateManageService } from "src/management_portal/user_auth/providers/authenticate_management.service";
import { ManagementLoginOAUTHRequestData, ManagementLoginRequestData } from "../interface/login.interface";
import { RegisterManagementRequestData, ResetPasswordData } from "../interface/register.interface";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoginManagementDto, LoginOauthDto, RegisterManagementDto, ResetPasswordDto, VerifyEmail } from "src/management_portal/user_auth/dto/authenticate_user.dto";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { DatabaseLogService } from "src/management_portal/common/log_user_activities/providers/user_activities.service";
import { ErrorResponseDto } from "src/management_portal/user/dto/user.dto";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/auth_management")
@ApiTags("API Authenticate quản lý hệ thống Aviation")
export class AuthenticateManagementController {
  constructor(
    private readonly authenticateService: AuthenticateManageService,
    private readonly logger: LoggerService,
    private readonly databaseLogService: DatabaseLogService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Post("/login_admin")
  @ApiOperation({ summary: "Đăng nhập trên trang Admin" })
  @ApiBody({ type: LoginManagementDto }) // Use type object to define the schema
  @ApiResponse({
    status: 400,
    description: "Yêu cầu không hợp lệ",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi dịch vụ",
    type: ErrorResponseDto,
  })
  async handleLoginManagement(@Body() loginRequest: ManagementLoginRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length === 0) {
        return await this.responseSystemService.respondWithBadRequest("login_admin", req, res, "users");
      }
      const user = await this.authenticateService.validateUserManagement(loginRequest.username, loginRequest.password);

      if (user) {
        const logData = {
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          userId: user.user.id,
          accessToken: user.accessToken,
        };
        await this.databaseLogService.handleUserActivities("login_admin", logData);
        await this.responseSystemService.saveAuditLog("login_admin", req, "users", user);
      }

      return res.status(HttpStatus.OK).json({
        code: 0,
        message: responseMessage.success,
        data: user,
      });
    } catch (error) {
      //Log thông tin vào bảng audit_log
      this.logger.error("Error in login_admin:", error);
      await this.responseSystemService.saveAuditLog("login_admin", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/login_auth")
  @ApiOperation({ summary: "Đăng nhập thông qua OAuth" })
  @ApiBody({ type: LoginOauthDto }) // Use type object to define the schema
  @ApiResponse({
    status: 400,
    description: "Yêu cầu không hợp lệ",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi dịch vụ",
    type: ErrorResponseDto,
  })
  async handleOAUTHLogin(@Body() loginRequest: ManagementLoginOAUTHRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length === 0) {
        return await this.responseSystemService.respondWithBadRequest("login_auth", req, res, "users");
      }
      const user = await this.authenticateService.validateUserOauth(loginRequest.email);

      const logData = {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        userId: user.user.id,
        accessToken: user.accessToken,
      };

      await this.databaseLogService.handleUserActivities("login_auth", logData);
      await this.responseSystemService.saveAuditLog("login_auth", req, "users", user);

      return res.status(HttpStatus.OK).json({
        code: 0,
        message: responseMessage.success,
        data: user,
      });
    } catch (error) {
      //Log thông tin vào bảng audit_log
      this.logger.error("Error in login_auth:", error);
      await this.responseSystemService.saveAuditLog("login_auth", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/register")
  @ApiOperation({
    summary: "Đăng ký tài khoản mới",
    description: "Lưu ý: Trường hợp đăng ký user ở trang admin isAdmin sẽ là true, còn lại là false",
  })
  @ApiResponse({
    status: 400,
    description: "Yêu cầu không hợp lệ",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi dịch vụ",
    type: ErrorResponseDto,
  })
  @ApiBody({ type: RegisterManagementDto })
  async handleRegister(@Body() registerRequest: RegisterManagementRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length === 0) {
        return await this.responseSystemService.respondWithBadRequest("register", req, res, "users");
      }

      const newUser = await this.authenticateService.registerUserManagement(registerRequest);
      await this.responseSystemService.saveAuditLog("register", req, "users", newUser);

      return res.status(HttpStatus.OK).json({
        code: 0,
        message: responseMessage.success,
      });
    } catch (error) {
      this.logger.error("Error in register:", error);
      await this.responseSystemService.saveAuditLog("register", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Get("/verify_login")
  @ApiOperation({ summary: "Xác thực đăng nhập" })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token cho authentication",
    required: true,
  })
  @UseGuards(VerifyLoginMiddleware)
  async getVerifyLogin(@Req() req: any, @Res() res: Response, next: NextFunction): Promise<any> {
    try {
      res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: req.userData });
    } catch (error) {
      next(error);
    }
  }

  @Get("/verify_email")
  @ApiOperation({ summary: "Xác thực email", description: "Sử dụng cho mục đích reset password" })
  @ApiQuery({ type: VerifyEmail })
  async getVerifyEmail(@Query() emailUser: VerifyEmail, @Req() req: any, @Res() res: Response): Promise<any> {
    const { email } = emailUser;
    try {
      if (!email) {
        res.status(HttpStatus.OK).json({ code: -2, message: responseMessage.notFound });
      }
      const emailResult = await this.authenticateService.getVerifyEmail(email);
      if (!emailResult) {
        res.status(HttpStatus.OK).json({ code: -4, message: responseMessage.notFound });
      } else {
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: { ...emailResult } });
      }
    } catch (error) {
      this.logger.error("Error in /verify_email:", error);
      await this.responseSystemService.saveAuditLog("verify_email", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/reset_password")
  @ApiOperation({ summary: "Reset password mới" })
  @ApiBody({ type: ResetPasswordDto })
  async handleResetPassword(@Body() resetPasswordData: ResetPasswordData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length === 0) {
        return await this.responseSystemService.respondWithBadRequest("reset_password", req, res, "users");
      }

      await this.authenticateService.handleResetPassword(resetPasswordData);
      await this.responseSystemService.saveAuditLog("reset_password", req, "users", resetPasswordData);

      return res.status(HttpStatus.OK).json({
        code: 0,
        message: responseMessage.success,
      });
    } catch (error) {
      this.logger.error("Error in /reset_password:", error);
      await this.responseSystemService.saveAuditLog("reset_password", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  // @Get("/logout")
  // @ApiOperation({ summary: "Đăng xuất" })
  // @ApiBody({ type: RegisterManagementDto })
  // async handleLogout(@Body() logoutRequest: LogoutRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
  //   try {
  //     if (Object.keys(req.body).length > 0) {
  //       await this.authenticateService.handleLogoutUser(logoutRequest);
  //       res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
  //     } else {
  //       res.status(HttpStatus.OK).json({ code: -2, message: responseMessage.badRequest });
  //     }
  //   } catch (error) {
  //     console.error("register error:", error.response);
  //     if (error.status !== 500) {
  //       res.status(HttpStatus.OK).json({ code: error.response.code, message: error.response.message });
  //     } else {
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code: -6, message: responseMessage.serviceError });
  //     }
  //   }
  // }
}
