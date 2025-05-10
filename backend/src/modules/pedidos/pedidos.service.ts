import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger, // Importe o Logger para registrar os alertas
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Prisma } from '@prisma/client'; // Importe Prisma
import { CheckoutPedidoDto, CheckoutItemDto } from './dto/checkout-pedido.dto'; // Importe o DTO de checkout

// Definimos uma interface simples para o produto com estoque selecionado
interface ProdutoComEstoqueSelecionado {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  nivelMinimo?: number | null; // Incluímos o nível mínimo
}

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name); // Inicializa o Logger

  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const { clienteId, itens } = createPedidoDto;
    let total = 0;

    // Buscar os produtos COM o campo estoque explicitamente selecionado E o nível mínimo
    const produtosDoBanco = (await this.prisma.produto.findMany({
      where: {
        id: {
          in: itens.map((item) => item.produtoId),
        },
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        nivelMinimo: true, // Selecionamos o nível mínimo
      },
    })) as unknown as ProdutoComEstoqueSelecionado[];

    const produtosMap = new Map<string, ProdutoComEstoqueSelecionado>(
      produtosDoBanco.map((produto) => [produto.id, produto]),
    );

    const produtosComQuantidade: {
      produtoId: string;
      quantidade: number;
      preco: number;
    }[] = [];
    const produtosParaAtualizarEstoque: { id: string; estoque: number }[] = [];
    const produtosComNivelBaixo: {
      id: string;
      nome: string;
      estoqueAtual: number;
      nivelMinimo: number | null;
    }[] = [];

    for (const item of itens) {
      const produto = produtosMap.get(item.produtoId);
      if (!produto) {
        throw new NotFoundException(
          `Produto com ID ${item.produtoId} não encontrado`,
        );
      }

      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${produto.nome} (ID: ${produto.id}). Estoque disponível: ${produto.estoque}, Quantidade solicitada: ${item.quantidade}`,
        );
      }

      total += produto.preco * item.quantidade;
      produtosComQuantidade.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: produto.preco,
      });

      produtosParaAtualizarEstoque.push({
        id: produto.id,
        estoque: produto.estoque - item.quantidade,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId,
          status: 'em andamento', // Status inicial
          total,
          produtos: produtosComQuantidade as Prisma.InputJsonValue,
        },
      });

      // Atualizar o estoque dos produtos
      const resultadosAtualizacao = await Promise.all(
        produtosParaAtualizarEstoque.map(async (produtoAtualizado) => {
          const produtoAtualizadoBanco = await tx.produto.update({
            where: { id: produtoAtualizado.id },
            data: { estoque: produtoAtualizado.estoque },
            select: { id: true, nome: true, estoque: true, nivelMinimo: true }, // Selecionamos para verificar o nível baixo
          });
          return produtoAtualizadoBanco;
        }),
      );

      // Verificar níveis baixos de estoque APÓS a atualização
      resultadosAtualizacao.forEach((produto) => {
        if (
          produto.nivelMinimo !== null &&
          produto.estoque < produto.nivelMinimo
        ) {
          this.logger.warn(
            `ALERTA DE ESTOQUE BAIXO: Produto ${produto.nome} (ID: ${produto.id}) atingiu o nível de ${produto.estoque}, abaixo do mínimo de ${produto.nivelMinimo}`,
          );
          // Aqui você pode adicionar outras ações, como enviar um e-mail.
        }
      });

      return pedido;
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const totalCount = await this.prisma.pedido.count();
    const pedidos = await this.prisma.pedido.findMany({
      skip,
      take: limit,
      include: { cliente: true },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return {
      pedidos,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { cliente: true },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { id },
    });
    if (!pedidoExistente) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto,
    });
  }

  async remove(id: string) {
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { id },
    });
    if (!pedidoExistente) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return this.prisma.pedido.delete({ where: { id } });
  }

  async checkout(checkoutPedidoDto: CheckoutPedidoDto) {
    const { clienteId, itens, enderecoEntrega } = checkoutPedidoDto;
    let total = 0;
    const produtosParaAtualizarEstoque: { id: string; estoque: number }[] = [];

    // Buscar os produtos COM o campo estoque
    const produtosDoBanco = (await this.prisma.produto.findMany({
      where: {
        id: {
          in: itens.map((item) => item.produtoId),
        },
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
      },
    })) as ProdutoComEstoqueSelecionado[];

    const produtosMap = new Map<string, ProdutoComEstoqueSelecionado>(
      produtosDoBanco.map((produto) => [produto.id, produto]),
    );

    for (const item of itens) {
      const produto = produtosMap.get(item.produtoId);
      if (!produto) {
        throw new BadRequestException(
          `Produto com ID ${item.produtoId} não encontrado`,
        );
      }

      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${produto.nome} (ID: ${produto.id}). Estoque disponível: ${produto.estoque}, Quantidade solicitada: ${item.quantidade}`,
        );
      }

      total += produto.preco * item.quantidade;
      produtosParaAtualizarEstoque.push({
        id: produto.id,
        estoque: produto.estoque - item.quantidade,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId,
          status: 'pendente', // Status inicial do pedido no checkout
          total,
          enderecoEntrega: { ...enderecoEntrega },
          produtos: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco: produtosMap.get(item.produtoId)!.preco,
          })) as Prisma.InputJsonValue,
        },
      });

      // Atualizar o estoque dos produtos
      await Promise.all(
        produtosParaAtualizarEstoque.map((produtoAtualizado) =>
          tx.produto.update({
            where: { id: produtoAtualizado.id },
            data: { estoque: produtoAtualizado.estoque },
          }),
        ),
      );

      return pedido;
    });
  }
}
