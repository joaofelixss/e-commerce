import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule
import { UploadModule } from '../../upload/upload.module';

@Module({
  imports: [
    AuthModule, // Apenas importe o AuthModule
    UploadModule,
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, PrismaService],
})
export class ProdutosModule {}
