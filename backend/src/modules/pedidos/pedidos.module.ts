import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { EstoqueService } from '../estoque/estoque.service';

@Module({
  imports: [AuthModule],
  controllers: [PedidosController],
  providers: [PedidosService, PrismaService, EstoqueService],
})
export class PedidosModule {}
