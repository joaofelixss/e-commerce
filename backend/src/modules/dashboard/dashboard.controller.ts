import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

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
}
