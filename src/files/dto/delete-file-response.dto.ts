import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResponseDto {
  @ApiProperty({
    description: 'Message indicating that the file has been deleted',
    example: 'File has been deleted',
  })
  message: string;
}
