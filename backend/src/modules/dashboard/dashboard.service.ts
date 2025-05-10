import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const totalPedidos = await this.prisma.pedido.count();
    const totalClientes = await this.prisma.cliente.count();
    // Podemos adicionar mais dados aqui no futuro, como total de produtos, vendas do mês, etc.

    return {
      totalPedidos,
      totalClientes,
      // Outros dados do dashboard virão aqui
    };
  }
}
