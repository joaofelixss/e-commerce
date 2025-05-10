import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { UpdateVariacaoDto } from './dto/update-variacao.dto'; // Importe o UpdateVariacaoDto
import { Prisma } from '@prisma/client'; // Importe Prisma

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    const { variacoes, ...produtoData } = createProdutoDto;

    return this.prisma.produto.create({
      data: {
        ...produtoData,
        variacoes: {
          createMany: {
            data:
              variacoes?.map((variacao) => ({
                cor: variacao.cor,
                numero: variacao.numero,
                imagemUrl: variacao.imagemUrl,
                quantidade: variacao.quantidade,
                estoque: variacao.estoque,
                nivelMinimo: variacao.nivelMinimo,
              })) || [],
          },
        },
      },
      include: { variacoes: true }, // Inclui as variações criadas na resposta
    });
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
        include: { variacoes: true }, // Inclui as variações na listagem
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
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { variacoes: true }, // Inclui as variações ao buscar um produto
    });
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
    // Use um objeto para construir os dados de atualização condicionalmente
    const updateData: Prisma.ProdutoUpdateInput = {};

    if (updateProdutoDto.nome !== undefined) {
      updateData.nome = updateProdutoDto.nome;
    }
    if (updateProdutoDto.preco !== undefined) {
      updateData.preco = updateProdutoDto.preco;
    }
    if (updateProdutoDto.imagemUrl !== undefined) {
      updateData.imagemUrl = updateProdutoDto.imagemUrl;
    }
    // Corrigindo: a relação com Categoria é feita através de categoriaId
    if (updateProdutoDto.categoriaId !== undefined) {
      updateData.categoria = {
        connect: { id: updateProdutoDto.categoriaId },
      };
    }

    return this.prisma.produto.update({
      where: { id },
      data: updateData,
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

  // Novo método para atualizar uma variação específica
  async updateVariacao(id: string, updateVariacaoDto: UpdateVariacaoDto) {
    const variacaoExistente = await this.prisma.variacao.findUnique({
      where: { id },
    });
    if (!variacaoExistente) {
      throw new NotFoundException(`Variação com ID ${id} não encontrada`);
    }
    return this.prisma.variacao.update({
      where: { id },
      data: updateVariacaoDto,
    });
  }
}
