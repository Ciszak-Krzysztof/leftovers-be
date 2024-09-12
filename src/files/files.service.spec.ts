import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          AWS_BUCKET_REGION: 'eu-central-1',
        })),
      ],
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
