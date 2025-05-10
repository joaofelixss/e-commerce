// src/produtos/produtos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Prisma } from '@prisma/client'; // Importe Prisma

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto & { imagemUrl: string }) {
    return this.prisma.produto.create({ data: createProdutoDto });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    nome?: string,
    categoriaId?: string,
    precoMin?: number,
    precoMax?: number,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProdutoWhereInput = {};

    if (nome) {
      where.nome = {
        contains: nome,
        mode: 'insensitive',
      };
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (precoMin !== undefined || precoMax !== undefined) {
      where.preco = {}; // Inicializa where.preco como um objeto se algum filtro de preço for aplicado
      if (precoMin !== undefined) {
        where.preco.gte = precoMin;
      }
      if (precoMax !== undefined) {
        where.preco.lte = precoMax;
      }
    }

    const [produtos, total] = await this.prisma.$transaction([
      this.prisma.produto.findMany({
        skip,
        take: limit,
        where,
      }),
      this.prisma.produto.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: produtos,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return produto;
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    const produtoExistente = await this.prisma.produto.findUnique({
      where: { id },
    });
    if (!produtoExistente) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  async remove(id: string) {
    const produtoExistente = await this.prisma.produto.findUnique({
      where: { id },
    });
    if (!produtoExistente) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return this.prisma.produto.delete({ where: { id } });
  }

  async atualizarImagem(id: string, imagemUrl: string) {
    return this.prisma.produto.update({
      where: { id },
      data: { imagemUrl },
    });
  }
}
