import { Test, TestingModule } from '@nestjs/testing';
import { AlimentadorService } from './alimentador.service';

describe('AlimentadorService', () => {
  let service: AlimentadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlimentadorService],
    }).compile();

    service = module.get<AlimentadorService>(AlimentadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
 