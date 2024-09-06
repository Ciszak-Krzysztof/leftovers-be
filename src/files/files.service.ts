import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
    region: this.configService.getOrThrow<string>('AWS_BUCKET_REGION'),
  });

  async uploadFile(key: string, file: Express.Multer.File) {
    const { buffer } = file;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('AWS_S3_BUCKET'),
        Key: key,
        Body: buffer,
      }),
    );
  }

  getPresignedFileUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string | null> {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow<string>('AWS_S3_BUCKET'),
      Key: key,
    });

    try {
      return getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (err) {
      if (err instanceof NoSuchKey) {
        return null;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
