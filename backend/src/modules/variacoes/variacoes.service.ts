import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVariacaoDto } from './dto/create-variacao.dto';
import { UpdateVariacaoDto } from './dto/update-variacao.dto';

@Injectable()
export class VariacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVariacaoDto: CreateVariacaoDto) {
    return this.prisma.variacao.create({ data: createVariacaoDto });
  }

  async findAll(produtoId: string) {
    return this.prisma.variacao.findMany({ where: { produtoId } });
  }

  async findOne(id: string) {
    const variacao = await this.prisma.variacao.findUnique({ where: { id } });
    if (!variacao) {
      throw new NotFoundException(`Variação com ID ${id} não encontrada`);
    }
    return variacao;
  }

  async update(id: string, updateVariacaoDto: UpdateVariacaoDto) {
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

  async remove(id: string) {
    const variacaoExistente = await this.prisma.variacao.findUnique({
      where: { id },
    });
    if (!variacaoExistente) {
      throw new NotFoundException(`Variação com ID ${id} não encontrada`);
    }
    return this.prisma.variacao.delete({ where: { id } });
  }
}
