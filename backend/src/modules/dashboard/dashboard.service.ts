import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const totalPedidos = await this.prisma.pedido.count();
    const totalClientes = await this.prisma.cliente.count();
    // Podemos adicionar mais dados aqui no futuro

    return {
      totalPedidos,
      totalClientes,
      // Outros dados do dashboard virão aqui
    };
  }

  async getTotalRevenue(): Promise<number> {
    const completedOrders = await this.prisma.pedido.findMany({
      where: { status: 'concluído' },
      select: { total: true },
    });
    return completedOrders.reduce((sum, order) => sum + order.total, 0);
  }

  async getOrderCounts(): Promise<{
    pending: number;
    completed: number;
    cancelled: number;
  }> {
    const pendingCount = await this.prisma.pedido.count({
      where: { status: 'pendente' },
    });
    const completedCount = await this.prisma.pedido.count({
      where: { status: 'concluído' },
    });
    const cancelledCount = await this.prisma.pedido.count({
      where: { status: 'cancelado' },
    });
    return {
      pending: pendingCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }

  async getLowStockCount(): Promise<number> {
    const lowStockThreshold = 5; // Defina um limite para baixo estoque

    // Usando o campo 'quantidade' da Model Variacao
    const lowStockVariationsCountQuantidade = await this.prisma.variacao.count({
      where: { quantidade: { lte: lowStockThreshold } },
    });

    // Se você preferir usar o campo 'estoque' da Model Variacao
    // const lowStockVariationsCountEstoque = await this.prisma.variacao.count({
    //   where: { estoque: { lte: lowStockThreshold } },
    // });

    // Você pode escolher qual contagem usar ou até mesmo somar as duas se fizer sentido para sua lógica de estoque
    return lowStockVariationsCountQuantidade; // Ou lowStockVariationsCountEstoque, ou a soma
  }
}
