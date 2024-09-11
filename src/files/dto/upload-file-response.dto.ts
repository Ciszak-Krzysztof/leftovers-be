import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'The URL of the uploaded file.',
    example: 'https://example.com/uploads/image.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'The key of the uploaded file.',
    example: '1345134513254125g',
  })
  key: string;

  @ApiProperty({
    description: 'Whether the file is publicly accessible or not.',
    example: true,
  })
  isPublic: boolean;
}
