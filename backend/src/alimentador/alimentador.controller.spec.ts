import { Test, TestingModule } from '@nestjs/testing';
import { AlimentadorController } from './alimentador.controller';
import { AlimentadorService } from './alimentador.service';

describe('AlimentadorController', () => {
  let controller: AlimentadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlimentadorController],
      providers: [AlimentadorService],
    }).compile();

    controller = module.get<AlimentadorController>(AlimentadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
