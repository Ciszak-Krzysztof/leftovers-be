import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE } from '@/common/constants';
import {
  DeleteFileResponseDto,
  GetFileUrlResponseDto,
  UploadFileResponseDto,
} from './dto';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({
    description: 'The file and its metadata',
    type: UploadFileDto,
  })
  @ApiOkResponse({
    description: 'The uploaded file',
    type: UploadFileResponseDto,
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SIZE,
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.filesService.uploadSingleFile({
      file,
      uploadFileDto,
    });
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get a file' })
  @ApiParam({
    name: 'key',
    type: 'string',
    required: true,
    description: 'The key of the file to retrieve',
    example: '1234567890abcdef',
  })
  @ApiOkResponse({
    description: 'The file',
    type: UploadFileResponseDto,
  })
  async getFileUrl(@Param('key') key: string) {
    return this.filesService.getFileUrl(key);
  }

  @Get('/signed-url/:key')
  @ApiOperation({ summary: 'Get a signed URL for a file' })
  @ApiParam({
    name: 'key',
    type: 'string',
    required: true,
    description: 'The key of the file to retrieve',
    example: '1234567890abcdef',
  })
  @ApiOkResponse({
    description: 'The signed URL',
    type: GetFileUrlResponseDto,
  })
  async getSignedUrl(@Param('key') key: string) {
    return this.filesService.getPresignedSignedUrl(key);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'key',
    type: 'string',
    required: true,
    description: 'The key of the file to delete',
    example: '1234567890abcdef',
  })
  @ApiOkResponse({
    description: 'The deleted file',
    type: DeleteFileResponseDto,
  })
  async deleteFile(@Param('key') key: string) {
    return this.filesService.deleteFile(key);
  }
}
