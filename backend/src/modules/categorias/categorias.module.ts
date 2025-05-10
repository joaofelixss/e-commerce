import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; // <----- IMPORTAR AuthModule AQUI

@Module({
  imports: [
    AuthModule, // <----- ADICIONAR AuthModule AO ARRAY DE IMPORTS
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, PrismaService],
})
export class CategoriasModule {}
