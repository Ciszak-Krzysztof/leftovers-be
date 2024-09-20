import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: 'S3_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const s3Region = configService.get('AWS_BUCKET_REGION');

        if (!s3Region) {
          throw new Error(
            'AWS_BUCKET_REGION not found in environment variables',
          );
        }

        return new S3Client({
          region: s3Region,
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
