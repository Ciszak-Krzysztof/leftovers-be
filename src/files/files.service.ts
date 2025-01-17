import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
  DeleteFileResponseDto,
  GetFileUrlResponseDto,
  UploadFileResponseDto,
} from './dto';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class FilesService {
  private client: S3Client;
  private bucketName = this.configService.get('AWS_S3_BUCKET');

  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadSingleFile({
    file,
    uploadFileDto,
  }: {
    file: Express.Multer.File;
    uploadFileDto: UploadFileDto;
  }): Promise<UploadFileResponseDto> {
    const { type, isPublic } = uploadFileDto;
    try {
      const key = `${type}/${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',

        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.client.send(command);

      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        isPublic,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string): Promise<GetFileUrlResponseDto> {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  async getPresignedSignedUrl(key: string): Promise<GetFileUrlResponseDto> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string): Promise<DeleteFileResponseDto> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
