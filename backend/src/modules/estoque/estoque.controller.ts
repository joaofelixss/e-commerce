// backend/src/estoque/estoque.controller.ts
import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Se você usa autenticação
import { UpdateEstoqueDTO } from './dto/update-estoque.dto'; // Importe o DTO

interface StockItem {
  id: string; // ID do produto
  nome: string;
  quantidade: number; // Estoque da variação
  nivelMinimo?: number | null; // Nível mínimo da variação
  variacao?: string; // Cor e/ou número da variação, se aplicável
  variacaoId: string;
}

@Controller('estoque')
@UseGuards(JwtAuthGuard) // Se a rota precisa de autenticação
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get()
  async getEstoque(): Promise<StockItem[]> {
    const produtos = await this.estoqueService.buscarDadosEstoqueParaAdmin();
    const stockData: StockItem[] = [];

    for (const produto of produtos) {
      if (produto.variacoes && produto.variacoes.length > 0) {
        produto.variacoes.forEach((variacao) => {
          stockData.push({
            id: produto.id,
            nome: produto.nome,
            quantidade: variacao.estoque,
            nivelMinimo: variacao.nivelMinimo,
            variacao: `${variacao.cor || ''}${variacao.numero ? ` (Número: ${variacao.numero})` : ''}`,
            variacaoId: variacao.id,
          });
        });
      }
      // Se você precisar lidar com produtos sem variações de forma diferente, adicione a lógica aqui.
    }

    return stockData;
  }

  @Patch(':id')
  async updateEstoque(
    @Param('id') id: string,
    @Body() updateEstoqueDTO: UpdateEstoqueDTO,
  ): Promise<void> {
    await this.estoqueService.atualizarEstoque(
      id,
      updateEstoqueDTO.quantidade,
      updateEstoqueDTO.nivelMinimo,
    );
  }
}
