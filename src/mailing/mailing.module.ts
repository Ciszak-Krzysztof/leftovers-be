import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailingService } from './mailing.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
          secure: false,
        },
        defaults: {
          from: `"No reply" <${config.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
