import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class GetUserByEmailResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
