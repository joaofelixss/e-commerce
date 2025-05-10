import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Prisma, Produto } from '@prisma/client';
import { CheckoutPedidoDto } from './dto/checkout-pedido.dto';

interface VariacaoComEstoquePrecoSelecionada {
  id: string;
  cor: string;
  numero?: number | null;
  estoque: number;
  nivelMinimo?: number | null;
  produtoId: string;
  produto: {
    nome: string;
    preco: number;
  };
}

interface ProdutoComEstoqueSelecionado {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  nivelMinimo?: number | null;
  imagemUrl?: string;
  categoriaId?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

// Definindo explicitamente o tipo para o select de Produto
const produtoSelectComEstoque = {
  id: true,
  nome: true,
  preco: true,
  estoque: true,
  nivelMinimo: true,
};

// Definindo explicitamente o tipo para o select de Produto (sem nivelMinimo para o checkout)
const produtoSelectComEstoqueCheckout = {
  id: true,
  nome: true,
  preco: true,
  estoque: true,
};

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const { clienteId, itens } = createPedidoDto;
    let total = 0;
    const variacoesParaAtualizarEstoque: { id: string; estoque: number }[] = [];
    const produtosParaAtualizarEstoqueSemVariacao: {
      id: string;
      estoque: number;
    }[] = [];

    const variacoesDoBanco = (await this.prisma.variacao.findMany({
      where: {
        id: {
          in: itens
            .map((item) => item.variacaoId)
            .filter((id) => id !== undefined) as string[],
        },
      },
      select: {
        id: true,
        cor: true,
        numero: true,
        estoque: true,
        nivelMinimo: true,
        produtoId: true,
        produto: {
          select: {
            nome: true,
            preco: true,
          },
        },
      },
    })) as unknown as VariacaoComEstoquePrecoSelecionada[];
    const variacoesMap = new Map(variacoesDoBanco.map((v) => [v.id, v]));

    const produtosSemVariacaoNoPedido = itens
      .filter((item) => !item.variacaoId)
      .map((item) => item.produtoId);
    const produtosSemVariacaoDoBanco = (await this.prisma.produto.findMany({
      where: { id: { in: produtosSemVariacaoNoPedido } },
      select: produtoSelectComEstoque,
    })) as ProdutoComEstoqueSelecionado[];
    const produtosSemVariacaoMap = new Map(
      produtosSemVariacaoDoBanco.map((p) => [p.id, p]),
    );

    const produtosComQuantidade: {
      produtoId: string;
      variacaoId?: string;
      quantidade: number;
      preco: number;
    }[] = [];

    for (const item of itens) {
      if (item.variacaoId) {
        const variacao = variacoesMap.get(item.variacaoId);
        if (!variacao)
          throw new NotFoundException(
            `Variação com ID ${item.variacaoId} não encontrada`,
          );
        if (variacao.estoque < item.quantidade) {
          const identificacao = `${variacao.cor}${variacao.numero ? ` (Número: ${variacao.numero})` : ''}`;
          throw new BadRequestException(
            `Estoque insuficiente para ${identificacao} do produto ${variacao.produto.nome}.`,
          );
        }
        total += variacao.produto.preco * item.quantidade;
        produtosComQuantidade.push({
          produtoId: variacao.produtoId,
          variacaoId: item.variacaoId,
          quantidade: item.quantidade,
          preco: variacao.produto.preco,
        });
        variacoesParaAtualizarEstoque.push({
          id: variacao.id,
          estoque: variacao.estoque - item.quantidade,
        });
      } else {
        const produto = produtosSemVariacaoMap.get(item.produtoId);
        if (!produto)
          throw new NotFoundException(
            `Produto com ID ${item.produtoId} não encontrado`,
          );
        if (produto.estoque < item.quantidade)
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${produto.nome}.`,
          );
        total += produto.preco * item.quantidade;
        produtosComQuantidade.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          preco: produto.preco,
        });
        produtosParaAtualizarEstoqueSemVariacao.push({
          id: produto.id,
          estoque: produto.estoque - item.quantidade,
        });
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId,
          status: 'em andamento',
          total,
          produtos: produtosComQuantidade as Prisma.InputJsonValue,
        },
      });
      await Promise.all(
        variacoesParaAtualizarEstoque.map((v) =>
          tx.variacao.update({
            where: { id: v.id },
            data: { estoque: v.estoque },
          }),
        ),
      );
      await Promise.all(
        produtosParaAtualizarEstoqueSemVariacao.map((p) =>
          tx.produto.update({
            where: { id: p.id },
            data: { estoque: p.estoque } as Prisma.ProdutoUpdateInput,
          }),
        ),
      );
      return pedido;
    });
  }

  async findAllPedidos(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const totalCount = await this.prisma.pedido.count();
    const pedidos = await this.prisma.pedido.findMany({
      skip,
      take: limit,
      include: { cliente: true },
      orderBy: { criadoEm: 'desc' },
    });
    return {
      pedidos,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findPedidoById(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { cliente: true },
    });
    if (!pedido)
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    return pedido;
  }

  async updatePedido(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { id },
    });
    if (!pedidoExistente)
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    return this.prisma.pedido.update({ where: { id }, data: updatePedidoDto });
  }

  async removePedido(id: string) {
    const pedidoExistente = await this.prisma.pedido.findUnique({
      where: { id },
    });
    if (!pedidoExistente)
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    return this.prisma.pedido.delete({ where: { id } });
  }

  async checkout(checkoutPedidoDto: CheckoutPedidoDto) {
    const { clienteId, itens, enderecoEntrega } = checkoutPedidoDto;
    let total = 0;
    const variacoesParaAtualizarEstoque: { id: string; estoque: number }[] = [];
    const produtosParaAtualizarEstoqueSemVariacao: {
      id: string;
      estoque: number;
    }[] = [];

    const variacoesDoBanco = (await this.prisma.variacao.findMany({
      where: {
        id: {
          in: itens
            .map((item) => item.variacaoId)
            .filter((id) => id !== undefined) as string[],
        },
      },
      select: {
        id: true,
        cor: true,
        numero: true,
        estoque: true,
        produtoId: true,
        produto: { select: { nome: true, preco: true } },
      },
    })) as unknown as VariacaoComEstoquePrecoSelecionada[];
    const variacoesMap = new Map(variacoesDoBanco.map((v) => [v.id, v]));

    const produtosSemVariacaoNoPedido = itens
      .filter((item) => !item.variacaoId)
      .map((item) => item.produtoId);
    const produtosSemVariacaoDoBanco = await this.prisma.produto.findMany({
      where: { id: { in: produtosSemVariacaoNoPedido } },
      select: produtoSelectComEstoqueCheckout,
    });
    const produtosSemVariacaoMap = new Map(
      produtosSemVariacaoDoBanco.map((produto) => [
        produto.id,
        produto as ProdutoComEstoqueSelecionado,
      ]),
    );

    for (const item of itens) {
      if (item.variacaoId) {
        const variacao = variacoesMap.get(item.variacaoId);
        if (!variacao)
          throw new BadRequestException(
            `Variação com ID ${item.variacaoId} não encontrada.`,
          );
        if (variacao.estoque < item.quantidade) {
          const identificacao = `${variacao.cor}${variacao.numero ? ` (Número: ${variacao.numero})` : ''}`;
          throw new BadRequestException(
            `Estoque insuficiente para ${identificacao} do produto ${variacao.produto.nome}.`,
          );
        }
        total += variacao.produto.preco * item.quantidade;
        variacoesParaAtualizarEstoque.push({
          id: variacao.id,
          estoque: variacao.estoque - item.quantidade,
        });
      } else {
        const produto = produtosSemVariacaoMap.get(item.produtoId);
        if (!produto)
          throw new BadRequestException(
            `Produto com ID ${item.produtoId} não encontrado.`,
          );
        if (produto.estoque < item.quantidade)
          throw new BadRequestException(
            `Estoque insuficiente para o produto ${produto.nome}.`,
          );
        total += produto.preco * item.quantidade;
        produtosParaAtualizarEstoqueSemVariacao.push({
          id: produto.id,
          estoque: produto.estoque - item.quantidade,
        });
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId,
          status: 'pendente',
          total,
          enderecoEntrega: { ...enderecoEntrega },
          produtos: itens.map((item) => ({
            produtoId: item.produtoId,
            variacaoId: item.variacaoId,
            quantidade: item.quantidade,
            preco: item.variacaoId
              ? variacoesMap.get(item.variacaoId)!.produto.preco
              : produtosSemVariacaoMap.get(item.produtoId)!.preco,
          })) as Prisma.InputJsonValue,
        },
      });
      await Promise.all(
        variacoesParaAtualizarEstoque.map((v) =>
          tx.variacao.update({
            where: { id: v.id },
            data: { estoque: v.estoque },
          }),
        ),
      );
      await Promise.all(
        produtosParaAtualizarEstoqueSemVariacao.map((p) =>
          tx.produto.update({
            where: { id: p.id },
            data: { estoque: p.estoque } as Prisma.ProdutoUpdateInput,
          }),
        ),
      );
      return pedido;
    });
  }
}
