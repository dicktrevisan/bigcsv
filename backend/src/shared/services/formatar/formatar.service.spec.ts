import { Test, TestingModule } from '@nestjs/testing';
import { FormatarService } from './formatar.service';

describe('FormatarService', () => {
  let service: FormatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormatarService],
    }).compile();

    service = module.get<FormatarService>(FormatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
