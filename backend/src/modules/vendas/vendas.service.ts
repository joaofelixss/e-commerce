import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendaDto, CreateItemVendaDto } from './dto/create-venda.dto';
import { AddItemVendaDto } from './dto/add-item-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';

@Injectable()
export class VendasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVendaDto: CreateVendaDto) {
    return this.prisma.venda.create({
      data: {
        pedidoId: createVendaDto.pedidoId,
        clienteId: createVendaDto.clienteId,
        formaPagamento: createVendaDto.formaPagamento,
        observacoes: createVendaDto.observacoes,
        totalVenda: 0, // O total será calculado com base nos itens
        itensVenda: {
          create: await Promise.all(
            createVendaDto.itens?.map(async (itemDto) => {
              const variacao = await this.prisma.variacao.findUnique({
                where: { id: itemDto.variacaoId },
                include: { produto: true },
              });

              if (!variacao) {
                throw new NotFoundException(
                  `Variação com ID ${itemDto.variacaoId} não encontrada.`,
                );
              }

              // Se custoUnitario não for fornecido, tentamos pegar o custo de compra da variação
              const custoUnitario =
                itemDto.custoUnitario !== undefined
                  ? itemDto.custoUnitario
                  : variacao.custoCompra;

              return {
                produtoId: itemDto.produtoId,
                variacaoId: itemDto.variacaoId,
                quantidade: itemDto.quantidade,
                precoVenda: itemDto.precoVenda,
                custoUnitario,
                subtotal: itemDto.quantidade * itemDto.precoVenda,
                lucroItem:
                  custoUnitario !== null
                    ? itemDto.precoVenda - custoUnitario
                    : null,
              };
            }) ?? [],
          ),
        },
      },
      include: {
        itensVenda: true,
        pedido: true,
        cliente: true,
      },
    });
  }

  async addItem(vendaId: string, addItemVendaDto: AddItemVendaDto) {
    const venda = await this.prisma.venda.findUnique({
      where: { id: vendaId },
    });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${vendaId} não encontrada.`);
    }

    const variacao = await this.prisma.variacao.findUnique({
      where: { id: addItemVendaDto.variacaoId },
      include: { produto: true },
    });

    if (!variacao) {
      throw new NotFoundException(
        `Variação com ID ${addItemVendaDto.variacaoId} não encontrada.`,
      );
    }

    const custoUnitario =
      addItemVendaDto.custoUnitario !== undefined
        ? addItemVendaDto.custoUnitario
        : variacao.custoCompra;

    const newItem = await this.prisma.itemVenda.create({
      data: {
        vendaId,
        produtoId: addItemVendaDto.produtoId,
        variacaoId: addItemVendaDto.variacaoId,
        quantidade: addItemVendaDto.quantidade,
        precoVenda: addItemVendaDto.precoVenda,
        custoUnitario,
        subtotal: addItemVendaDto.quantidade * addItemVendaDto.precoVenda,
        lucroItem:
          custoUnitario !== null
            ? addItemVendaDto.precoVenda - custoUnitario
            : null,
      },
    });

    await this.recalculateTotalVenda(vendaId);
    return newItem;
  }

  async findAll() {
    return this.prisma.venda.findMany({
      include: {
        itensVenda: true,
        pedido: true,
        cliente: true,
      },
    });
  }

  async findOne(id: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
      include: {
        itensVenda: true,
        pedido: true,
        cliente: true,
      },
    });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }
    return venda;
  }

  async update(id: string, updateVendaDto: UpdateVendaDto) {
    const vendaExists = await this.prisma.venda.findUnique({ where: { id } });
    if (!vendaExists) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }

    return this.prisma.venda.update({
      where: { id },
      data: {
        pedidoId: updateVendaDto.pedidoId,
        clienteId: updateVendaDto.clienteId,
        formaPagamento: updateVendaDto.formaPagamento,
        observacoes: updateVendaDto.observacoes,
        // Não permitimos a atualização direta dos itens por este método
      },
      include: {
        itensVenda: true,
        pedido: true,
        cliente: true,
      },
    });
  }

  async remove(id: string) {
    const vendaExists = await this.prisma.venda.findUnique({ where: { id } });
    if (!vendaExists) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }
    return this.prisma.venda.delete({
      where: { id },
    });
  }

  private async recalculateTotalVenda(vendaId: string): Promise<void> {
    const itens = await this.prisma.itemVenda.findMany({
      where: { vendaId },
    });

    const totalVenda = itens.reduce((sum, item) => sum + item.subtotal, 0);

    await this.prisma.venda.update({
      where: { id: vendaId },
      data: { totalVenda },
    });
  }
}
