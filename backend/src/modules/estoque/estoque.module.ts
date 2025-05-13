import { Module } from '@nestjs/common';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service'; // Certifique-se do caminho correto para o seu PrismaService

@Module({
  imports: [AuthModule],
  controllers: [EstoqueController],
  providers: [EstoqueService, PrismaService], // Inclua o PrismaService se o seu Service o utiliza diretamente
})
export class EstoqueModule {}
