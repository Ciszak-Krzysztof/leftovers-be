import { ApiProperty } from '@nestjs/swagger';

export class GetFileUrlResponseDto {
  @ApiProperty({
    description: 'The URL of the file.',
    example: 'https://my-bucket.s3.amazonaws.com/my-file.txt',
  })
  url: string;
}
