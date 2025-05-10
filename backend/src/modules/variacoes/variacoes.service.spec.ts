import { Test, TestingModule } from '@nestjs/testing';
import { VariacoesService } from './variacoes.service';

describe('VariacoesService', () => {
  let service: VariacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariacoesService],
    }).compile();

    service = module.get<VariacoesService>(VariacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
