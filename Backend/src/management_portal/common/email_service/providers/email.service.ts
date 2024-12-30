import {  Injectable, InternalServerErrorException} from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Brackets, Repository } from "typeorm";
// import * as bcrypt from "bcrypt";
// import * as jwt from "jsonwebtoken";
// import * as dotenv from "dotenv";
// import { AuthManagementLogin, UserVerifyInformation } from "src/entity/management/user_management.entity";
// import { ManagementLoginResponseData } from "src/interface/management/login.interface";
// import { RegisterManagementDto } from "src/dto/management/register.dto";
// import { responseMessage } from "src/utils/constant";
// import { Status } from "src/entity/management/status.entity";
// import { GroupRole } from "src/entity/management/user_group.entity";
// import { UserGroup } from "src/entity/management/user_group.entity";
import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from "nodemailer";

@Injectable()
export class EmailSenderService {
  async sendEmail(email: string): Promise<any> {
    try {
      const transporter: Transporter = nodemailer.createTransport({
        host: "mail.vtctelecom.com.vn",
        port: 465, // or your SMTP port
        secure: true, // set this to true if using SSL/TLS
        auth: {
          user: process.env.AUTH_USER,
          pass: process.env.AUTH_PASS,
        },
      });

      // Email content
      const mailOptions: SendMailOptions = {
        from: process.env.AUTH_USER,
        to: email,
        subject: "KHÔI PHỤC MẬT KHẨU",
        html: `
  <div style="padding: 40px; margin: 0 auto; max-width: 600px; background-color: #f8f8f8; font-family: 'Montserrat', Helvetica, sans-serif">
  <div style="background-color: #ffffff">
    <div style="height: 80px; display: flex">
      <p style="margin-left: 40px">
       <img
          src="https://www.vtctelecom.com.vn/images/deffiles/viLogo.png"
          alt="VTC Telecom Logo"
          class="CToWUd"
          data-bit="iit"
        /> 
      </p>
      <p style="text-align: right">
        <a href="https://shop.vtctelecom.com.vn/" target="_blank">shop.vtctelecom.com.vn</a>
      </p>
      <p>&nbsp;</p>
    </div>
    <div style="padding: 40px">
      <div style="text-align: center; padding: 40px 0 60px">
        <img
          src="https://ci3.googleusercontent.com/meips/ADKq_NbrLWBIEaJdRhRt1Y5s_j5xbYbscSzMyqlkhXpBjDOf24md_v2qRTLh_yyZ0I34qk3RxY4a1a4xqmhHiv7SVeNXBo5SMzLNrQByyN2BXboyR3wKHtK5DJbbbD270A=s0-d-e1-ft#https://staging.onesme.vn/resources/upload/file/mail/images/icon_sb.png"
          alt="Thuê bao"
          class="CToWUd"
          data-bit="iit"
        />
        <p style="margin: 0; line-height: 28px; font-size: 20px; font-weight: 700; color: #2c3d94; text-transform: uppercase; margin-top: 30px">XÁC NHẬN KHÔI PHỤC MẬT KHẨU</p>
      </div>
      <div style="line-height: 22px; font-size: 14px; letter-spacing: 0.3px">
        <p style="margin: 0; margin-bottom: 20px">Xin chào <b>${email}</b>,</p>
        <p style="margin: 0; margin-bottom: 20px"Để thực hiện đặt lại mật khẩu quý khách vui lòng click vào bên dưới</p>

        <a href="https://portal-aviationhub.vtctelecom.com.vn/forgot-password/${email}" style="display: inline-block;
            padding: 10px 20px; margin-top: 5px; color: white; background-color: #2c3d94; text-align: center;    text-decoration: none; border-radius: 5px;">
          Click vào
        </a>
        
        <p style="margin: 0; margin-top: 20px">Trân trọng,</p>
        <p style="margin: 0">Đội ngũ phát triển sản phẩm VTC Telecom</p>
      </div>
    </div>
    <div style="padding: 40px">
      <div style="text-align: center">
        <a href="https://www.facebook.com/vtctelecomjsc" style="text-decoration: none; margin-right: 5px" target="_blank"
          ><img
            src="https://ci3.googleusercontent.com/meips/ADKq_NYjBkphm-WjqzhEu9kIwcsWggniPoF_8k06bjG6_sYAlrOzVU4RfQ3Znp-yalK5yiJboZlER_7IQ1JUvkK1GSVMrpeggBuMMdSopT_vA6rkCj2oRhh4aR1CoG3rkCk=s0-d-e1-ft#https://staging.onesme.vn/resources/upload/file/mail/images/facebook.png"
            class="CToWUd"
            data-bit="iit"
        /></a>
        <a href="https://www.linkedin.com/company/vtc-telecom/" style="text-decoration: none; margin-right: 5px; margin: 0" target="_blank"
          ><img
            src="https://ci3.googleusercontent.com/meips/ADKq_Nbi5PVRlDbXZkHkG7C-zbLzZxTqWDCOnHh7_c7P4jFJapCDGO1lzKp8s3PNk48TIJKvrdsOkubxEzM6DFalRsX3TyP9hT3dcsYL1f-2u06JnZcYv54SfqrXrcxhanE=s0-d-e1-ft#https://staging.onesme.vn/resources/upload/file/mail/images/linkedin.png"
            class="CToWUd"
            data-bit="iit"
        /></a>
      </div>
      <div style="text-align: center; color: #2c3d94; font-weight: 700; font-size: 14px; margin: 10px 0 20px">CÔNG TY CỔ PHẦN VIỄN THÔNG VTC</div>
      <div>
        <p>&nbsp;</p>
        <p style="margin-left: 0; text-align: center">Hotline: (+84.28) 38331106</p>
        <p style="margin-left: 0; text-align: center">Fax: (+84.28) 3830025</p>
        <p>&nbsp;</p>
        <p style="margin-left: 0; text-align: center">750 (lầu 3) Điện Biên Phủ, Phường 11, Quận 10, TP.HCM, Việt Nam</p>
        <p style="margin-left: 0; text-align: center">© Bản Quyền thuộc CÔNG TY CỔ PHẦN VIỄN THÔNG VTC</p>
        <div class="yj6qo"></div>
        <div class="adL"></div>
      </div>
      <div class="adL"></div>
    </div>
    <div class="adL"></div>
  </div>
  <div class="adL"></div>
</div>
        `,
      };

      // Send email
      transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.error("Error occurred:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
