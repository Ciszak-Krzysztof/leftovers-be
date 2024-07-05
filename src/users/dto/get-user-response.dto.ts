import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
