import { Module } from '@nestjs/common';
import { VariacoesController } from './variacoes.controller';
import { VariacoesService } from './variacoes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VariacoesController],
  providers: [VariacoesService, PrismaService],
})
export class VariacoesModule {}
