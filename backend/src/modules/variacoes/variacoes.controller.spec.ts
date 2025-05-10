import { Test, TestingModule } from '@nestjs/testing';
import { VariacoesController } from './variacoes.controller';

describe('VariacoesController', () => {
  let controller: VariacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariacoesController],
    }).compile();

    controller = module.get<VariacoesController>(VariacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
