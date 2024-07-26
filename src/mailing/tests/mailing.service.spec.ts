import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailingService } from '../mailing.service';
import { SendEmailDto } from '../dto/sendEmail.dto';

describe('MailingService', () => {
  let mailingService: MailingService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    mailingService = module.get<MailingService>(MailingService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('shoud be defined', () => {
    expect(mailingService).toBeDefined();
  });

  describe('send email', () => {
    it('should send an email', async () => {
      jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce(null);
      const sendEmailDto: SendEmailDto = {
        to: 'test@test1.com',
        subject: 'test email',
        template: './exampleEmail',
        context: {
          name: 'test user',
        },
      };

      await mailingService.sendEmail(sendEmailDto);

      expect(mailerService.sendMail).toHaveBeenCalledWith(sendEmailDto);
    });
  });
});
