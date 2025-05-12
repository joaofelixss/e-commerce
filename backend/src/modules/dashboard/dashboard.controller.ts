import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard)
@Controller('dashboard') // A rota base agora é '/dashboard'
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get() // Esta rota agora responde a GET /dashboard
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }

  // Vamos adicionar as rotas específicas para os cards de status
  @Get('revenue')
  async getTotalRevenue() {
    return this.dashboardService.getTotalRevenue();
  }

  @Get('orders')
  async getOrderCounts() {
    return this.dashboardService.getOrderCounts();
  }

  @Get('low-stock')
  async getLowStockCount() {
    return this.dashboardService.getLowStockCount();
  }

  @Get('sales-performance')
  async getSalesPerformanceLastWeek(@Req() req: Request) {
    return this.dashboardService.getSalesPerformanceLastWeek();
  }
  @Get('recent-orders')
  async getRecentOrders(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5; // Define um limite padrão de 5 pedidos
    return this.dashboardService.getRecentOrders(parsedLimit);
  }
  @Get('low-stock-products')
  async getLowStockProducts() {
    return this.dashboardService.getLowStockProducts();
  }
}
