import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Prisma } from '@prisma/client';
import { CheckoutPedidoDto } from './dto/checkout-pedido.dto';

const produtoSelectComEstoque = {
  id: true,
  nome: true,
  preco: true,
  estoque: true,
  nivelMinimo: true,
};

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

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    this.logger.log('createPedidoDto:', JSON.stringify(createPedidoDto));
    this.logger.log(
      'createPedidoDto.itens:',
      JSON.stringify(createPedidoDto.itens),
    );
    this.logger.log('createPedidoDto.clienteId:', createPedidoDto.clienteId);

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
    const {
      produtos,
      enderecoEntrega,
      cliente,
      total,
      formaPagamento,
      observacoes,
    } = checkoutPedidoDto;
    const clienteCriado = await this.prisma.cliente.create({
      data: {
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        endereco: cliente.endereco,
        numero: cliente.numero,
        complemento: cliente.complemento,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        uf: cliente.uf,
        cep: cliente.cep,
      },
    });

    const variacoesParaAtualizarEstoque: { id: string; estoque: number }[] = [];
    const produtosComQuantidadeParaPedido: {
      produtoId: string;
      variacaoId?: string | null;
      quantidade: number;
      preco: number;
    }[] = [];

    const variacaoIds = produtos
      .map((item) => item.variacaoId)
      .filter((id) => id !== undefined) as string[];

    const variacoesDoBanco = (await this.prisma.variacao.findMany({
      where: { id: { in: variacaoIds } },
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

    const produtoIdsSemVariacao = produtos
      .filter((item) => !item.variacaoId)
      .map((item) => item.produtoId);
    const produtosSemVariacaoDoBanco = await this.prisma.produto.findMany({
      where: { id: { in: produtoIdsSemVariacao } },
      select: { id: true, nome: true, preco: true }, // Removi 'estoque: true' aqui também
    });
    const produtosSemVariacaoMap = new Map(
      produtosSemVariacaoDoBanco.map((p) => [
        p.id,
        p as ProdutoComEstoqueSelecionado,
      ]),
    );

    for (const item of produtos) {
      if (item.variacaoId) {
        const variacao = variacoesMap.get(item.variacaoId);
        if (!variacao) {
          throw new BadRequestException(
            `Variação com ID ${item.variacaoId} não encontrada.`,
          );
        }
        if (variacao.estoque < item.quantidade) {
          const identificacao = `${variacao.cor}${
            variacao.numero ? ` (Número: ${variacao.numero})` : ''
          }`;
          throw new BadRequestException(
            `Estoque insuficiente para ${identificacao} do produto ${variacao.produto.nome}.`,
          );
        }
        produtosComQuantidadeParaPedido.push({
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
        if (!produto) {
          throw new BadRequestException(
            `Produto com ID ${item.produtoId} não encontrado.`,
          );
        }
        // Não há verificação de estoque aqui, pois 'estoque' não está mais no modelo Produto
        produtosComQuantidadeParaPedido.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          preco: produto.preco,
        });
        // Não há atualização de estoque aqui
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId: clienteCriado.id,
          status: 'pendente',
          total,
          formaPagamento,
          observacoes,
          enderecoEntrega: enderecoEntrega
            ? {
                create: {
                  cep: enderecoEntrega.cep,
                  rua: enderecoEntrega.rua,
                  bairro: enderecoEntrega.bairro,
                  cidade: enderecoEntrega.cidade,
                  estado: enderecoEntrega.estado,
                  numero: enderecoEntrega.numero,
                  complemento: enderecoEntrega.complemento,
                },
              }
            : undefined,
          produtos: produtosComQuantidadeParaPedido as Prisma.InputJsonValue,
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

      // REMOVEU A PARTE DE ATUALIZAÇÃO DO ESTOQUE DE PRODUTOS SEM VARIAÇÃO

      return { success: true, pedidoId: pedido.id };
    });
  }
}
