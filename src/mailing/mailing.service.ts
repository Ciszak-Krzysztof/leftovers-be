import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/sendEmail.dto';

@Injectable()
export class MailingService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    await this.mailerService.sendMail(sendEmailDto);
  }
}
