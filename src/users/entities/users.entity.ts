import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UsersEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
