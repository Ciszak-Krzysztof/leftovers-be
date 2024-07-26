export class SendEmailDto {
  from?: string;
  to: string;
  subject: string;
  context: object;
  template?: string;
}
