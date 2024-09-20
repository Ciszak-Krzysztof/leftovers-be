import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  type: string;

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  isPublic: boolean;
}
