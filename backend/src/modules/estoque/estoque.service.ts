import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstoqueService {
  private readonly logger = new Logger(EstoqueService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR) // Executa a cada hora
  async verificarNivelBaixoEstoque() {
    this.logger.log('Verificando níveis baixos de estoque...');
    const produtos = await this.prisma.produto.findMany({
      where: {
        nivelMinimo: {
          not: null,
        },
      },
      select: {
        id: true,
        nome: true,
        estoque: true,
        nivelMinimo: true,
      },
    });

    produtos.forEach((produto) => {
      if (produto.estoque < (produto.nivelMinimo as number)) {
        this.logger.warn(
          `ALERTA DE ESTOQUE BAIXO (Tarefa Agendada): Produto ${produto.nome} (ID: ${produto.id}) atingiu o nível de ${produto.estoque}, abaixo do mínimo de ${produto.nivelMinimo}`,
        );
        // Aqui você pode adicionar outras ações, como enviar um e-mail.
      }
    });
    this.logger.log('Verificação de níveis baixos de estoque concluída.');
  }
}
