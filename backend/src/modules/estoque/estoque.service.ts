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
      include: {
        variacoes: {
          where: {
            nivelMinimo: {
              not: null,
            },
          },
          select: {
            id: true,
            cor: true,
            numero: true,
            estoque: true,
            nivelMinimo: true,
            produto: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    produtos.forEach((produto) => {
      produto.variacoes.forEach((variacao) => {
        if (variacao.estoque < (variacao.nivelMinimo as number)) {
          const variacaoIdentificacao =
            variacao.cor +
            (variacao.numero ? ` (Número: ${variacao.numero})` : '');
          this.logger.warn(
            `ALERTA DE ESTOQUE BAIXO (Tarefa Agendada): Produto ${produto.nome} (ID: ${produto.id}), Variação: ${variacaoIdentificacao} atingiu o nível de ${variacao.estoque}, abaixo do mínimo de ${variacao.nivelMinimo}`,
          );
          // Aqui você pode adicionar outras ações, como enviar um e-mail específico para a variação.
        }
      });
    });
    this.logger.log('Verificação de níveis baixos de estoque concluída.');
  }
}
