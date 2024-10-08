import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/sendEmail.dto';
import { AccountConfirmationEmailDto } from './dto/accountConfirmationEmail.dto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto';

@Injectable()
export class MailingService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendVerifyAccountEmail(
    accountConfirmationEmailDto: AccountConfirmationEmailDto,
  ): Promise<void> {
    const verifyLink = `${this.configService.get<string>(
      'APP_URL',
    )}/auth/verify?email=${accountConfirmationEmailDto.email}&token=${
      accountConfirmationEmailDto.token
    }`;

    await this.mailerService.sendMail({
      to: accountConfirmationEmailDto.email,
      subject: 'Verify account',
      context: {
        email: accountConfirmationEmailDto.email,
        link: verifyLink,
      },
      template: './verifyAccount',
    });
  }

  async sendResetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: resetPasswordEmailDto.email,
      subject: 'Reset Password',
      context: {
        email: resetPasswordEmailDto.email,
        link: resetPasswordEmailDto.resetPasswordLink,
      },
      template: './resetPassword',
    });
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    await this.mailerService.sendMail(sendEmailDto);
  }
}
