import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays, startOfDay, endOfDay } from 'date-fns';

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
      where: { status: 'em andamento' }, // Ajustado para 'em andamento'
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

    return lowStockVariationsCountQuantidade;
  }

  async getSalesPerformanceLastWeek(): Promise<
    { name: string; Vendas: number }[]
  > {
    const today = new Date();
    const lastWeekData: { [key: string]: number } = {};

    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      lastWeekData[this.getDayName(date)] = 0;
      const start = startOfDay(date);
      const end = endOfDay(date);

      const dailySales = await this.prisma.pedido.aggregate({
        _sum: {
          total: true,
        },
        where: {
          criadoEm: {
            // Alterado para 'criadoEm'
            gte: start,
            lte: end,
          },
          status: 'concluído',
        },
      });
      lastWeekData[this.getDayName(date)] = dailySales._sum.total || 0;
    }

    // Formatar os dados para o recharts
    return Object.keys(lastWeekData)
      .reverse() // Inverter para mostrar do dia mais antigo para o mais recente
      .map((day) => ({ name: day, Vendas: lastWeekData[day] }));
  }

  private getDayName(date: Date): string {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  }
  async getRecentOrders(limit: number): Promise<
    {
      id: string;
      customerName: string;
      orderDate: Date;
      status: string;
      total: number;
    }[]
  > {
    const recentOrders = await this.prisma.pedido.findMany({
      take: limit,
      orderBy: {
        criadoEm: 'desc',
      },
      select: {
        id: true,
        cliente: {
          select: {
            nome: true,
          },
        },
        criadoEm: true,
        status: true,
        total: true,
      },
    });

    return recentOrders.map((order) => ({
      id: order.id,
      customerName: order.cliente?.nome || 'Cliente Desconhecido',
      orderDate: order.criadoEm,
      status: order.status,
      total: order.total, // Converter BigInt para Number se necessário
    }));
  }
  async getLowStockProducts(): Promise<
    {
      id: string;
      nome: string;
      variacao?: { cor?: string; numero?: number };
      quantidade: number;
      nivelMinimo?: number;
    }[]
  > {
    const lowStockThreshold = 5; // Defina o seu limite de baixo estoque

    const lowStockVariations = await this.prisma.variacao.findMany({
      where: {
        quantidade: { lte: lowStockThreshold },
      },
      include: {
        produto: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: [
        { produto: { nome: 'asc' } },
        { cor: 'asc' },
        { numero: 'asc' },
      ],
    });

    return lowStockVariations.map((variacao) => ({
      id: variacao.id,
      nome: variacao.produto.nome,
      variacao: {
        cor: variacao.cor || undefined,
        numero: variacao.numero || undefined,
      },
      quantidade: variacao.quantidade,
      nivelMinimo: variacao.nivelMinimo || undefined,
    }));
  }
}
