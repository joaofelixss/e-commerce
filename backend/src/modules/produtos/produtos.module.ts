import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../../upload/upload.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UploadModule, UsersModule],
  controllers: [ProdutosController],
  providers: [ProdutosService, PrismaService],
})
export class ProdutosModule {}
